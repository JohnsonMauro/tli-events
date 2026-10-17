# Tartarus engine (Rust)

Our own simulator of the SS14 Warden's Duty, for fast what-ifs: instrument rankings, rule variants, strategy weights. Native, multi-threaded (`rayon`), 40% of the logical cores by default so the machine stays usable (`--threads N` to change); ~140–180k full runs/s on all 32 threads of a 16-core Ryzen 9 9950X3D (2026-10-17).

**Clean room.** Written from this folder's research base only: `TARTARUS_GUIDE.md`, the card transcriptions in `images/INDEX.md`, the tlidb glossary (Oppress, Scratch Marks, Tusk, Prey, Matching Inmate, Higher/Lower-Tier Inmate, …) and the rule texts in `data/tartarus_data.json`. The community simulator (CoffeeBns) has no license: none of its code is used or ported. Its published numbers are only compared against.

## Run

```bash
cargo build --release
./target/release/tartarus eval  --games 100000                  # full runs: Rainbows/run, spread, what the player did
./target/release/tartarus tools --games 100000                  # each instrument held from day 1 vs none (rewards off)
./target/release/tartarus eval  --tool rope,maiden              # a set held from day 1
./target/release/tartarus export                                # base, every instrument and pair, full run → ../data/engine_results.json (~5 min)
./target/release/tartarus eval  --set muzzle_max=4 --set oppress_base=0.9
cargo test --release                                            # rules tests
```

Options: `--seed WORD` (default `LAB`; same seed = same result on any thread count), `--threads N`, `--rewards on|off`, `--start cagefight|ironlaw|tyranny`, `--data PATH`.

## Where the numbers come from

Defaults are read from `../data/tartarus_data.json` at start, so they follow the 6-hourly refresh:

| Value | Source |
|---|---|
| Door rarity / beast odds | live `doorTiers`, `doorBeasts` (n=7,191) |
| Replace odds (incl. 0.3% Rainbow) | live `replaceTiers` (n=696) |
| Mornings with one door fewer | live `fewerDoorMornings` (16.9%) |
| Incident behind a door | live `eventDoorsDay1` (6.4%) |
| Lost Ring of Keys | live `keyRing` (62.8%; card 80%) |
| Instrument offer weights | live `toolOffers` counts + 1 |
| Doors come from the next **6** cells (`patrol_range`) | upstream `rates.json` → `mornings.stepsAhead`: offered doors spread evenly over 1–6 cells ahead (~4,100 each, n≈24,700; checked 2026-10-17) |
| Incident type | uniform — telemetry only splits Chain Reaction vs Execution (12 of 20), too few |
| The policy's instrument ranking | `tools.*.value` (the community sim's published values) |

## Open rules (parameters, `--set key=value`)

Each is a rule no source settles yet (see `tli-events.local-context/watchlist/ss14-missing-and-divergent.md`). Change the value, not the code, when a print settles it.

| Key | Default | Why open |
|---|---|---|
| `second_meal_from` | 3 (Legendary) | rules diagram + tlidb "Counter" draw second meals at every rarity; live boards suggested Legendary+ |
| `muzzle_max` | 3 | VOD card (print 34): "no more than 3 inmates on the board, after Devouring"; community sim 4; no live print |
| `maiden_any_time` | true | live card (print 73) gives only the state ("Higher-Tier and Lower-Tier Inmates are equal") and no trigger; we check it whenever the warden's inmate changes (door, Replace, bite). `false` = after a Replace only (community sim). **Our reading of the timing, not confirmed** — and the one that moves the ranking most |
| `oppress_base`, `oppress_step` | 1.0, 0.05 | tlidb gives −5%/tier; base chance not printed |
| `skewer_extra` | 2 | live card print 78 (+2); VOD and community sim +1 |
| `collar_first_bite` | true | live card (print 72): "When an Inmate Chain Consumes, 80%" — no "after the first"; community sim: bites after the first |
| `tusk_persists` | true | tlidb: Tusk goes "when there is no Inmate in this room"; content creator ALannister (2026-10-17): it stays through Replaces and clears only when the cell empties (eaten or Chromatic). The community sim agrees. `false` = gone after one Replace |
| `instigate_count` | 1 | in-game rules text (community sim uses 2) |
| `can_skip_incidents` | false | live cards have only Confirm |
| `rainbow_cap` | 10 | a limit exists (rules); ~10 seen on riot screens |
| `execution_same_tier` | false | card: lower-tier prey |

Not modelled yet: Opulence, Tartarus Rumors, the riot itself, the contract challenge, events in open cells appearing on their own. Incidents are drawn uniformly (no live rate per incident). Morning effects run in a fixed order (prey, nests, Iron Box, Tongs, Claws, Coin, Ravenous Chains); the game's order isn't documented.

## The player (`src/policy.rs`)

Our own, simple and explicit: a board value (`w_tier` per rarity, `w_rainbow`, `w_event`, `w_objective`, `w_chain`) scores every bite, Replace and Hunt analytically; patrols, treasures and incident choices are played out on copies with the hidden doors and the dice re-rolled (`samples` copies per option), so it never sees what the player can't. The weights are a first guess — tune with `eval`.

## Results (2026-10-17, 100k runs per row, seed LAB)

Card texts against the community sim (prints in `images/INDEX.md`): it differs on Skewered Rat Heads (+2 live), Fanged Guillotine (Oppress), Agonizing Muzzle (3), Barbed Collar (every chain bite), Severed Iron Maiden (no Replace in the condition), Instigate (1) and lacks Shared Fortune and Archenemy. This engine follows the card text on all of them.

- `eval` (rewards on): **2.76 ± 0.006 Rainbows/run**, median 2, zero in 7% (2.79, median 3, with the sim 20261016zzs values the instrument pick reads; the Tusk rule moves it by +0.002, since the pick still trusts the sim's low Tongs value); live runs (n=114) mean 2.04, median 2, zero in 25%.
- `tools` (rewards off): no instrument **0.909** (community sim 0.891). Literal card readings move three instruments: **Severed Iron Maiden 4.19** (2.37 with `maiden_any_time=false`), **Barbed Collar 2.10** (1.12 bites after the first only), **Agonizing Muzzle 1.21** (1.51 at ≤4). Close to the community sim elsewhere (Crown 2.59 vs 2.66, Noose 2.11 vs 2.17, Coin 2.09 vs 1.96, Scapegoat 1.99 vs 2.04, Ravenous 1.53 vs 1.53, Stake 1.31 vs 1.33). **Iron Tongs 2.38** vs 1.09 (1.88 with `tusk_persists=false`): the sim keeps the Tusk too, but its player doesn't farm Tusks. Still far off, to investigate: **Executioner's Blacklist** 1.99 vs 1.56, **Filthy Claws** 2.69 vs 2.15.
