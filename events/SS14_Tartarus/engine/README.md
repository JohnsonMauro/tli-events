# Tartarus engine (Rust)

Our own simulator of the SS14 Warden's Duty, for fast what-ifs: instrument rankings, rule variants, strategy weights. Native, multi-threaded (`rayon`), 40% of the logical cores by default so the machine stays usable (`--threads N` to change); ~140–180k full runs/s on all 32 threads of a 16-core Ryzen 9 9950X3D (2026-10-17).

**Our numbers only (owner's call, 2026-10-17).** Rules come from the live cards transcribed in `images/INDEX.md`, the tlidb glossary (Oppress, Scratch Marks, Tusk, Prey, Matching Inmate, Higher/Lower-Tier Inmate, …) and the owner's play. The community simulator (CoffeeBns) is not a source any more: its board reader misses incidents on open cells and its rules lag the cards; none of its code is used or ported (no license). The only thing still taken from its project is the live odds its analyzer measured (frozen at 2026-10-16), for lack of another sample.

## Run

```bash
cargo build --release
./target/release/tartarus eval  --games 100000                  # full runs: Rainbows/run, spread, what the player did
./target/release/tartarus tools --games 100000                  # each instrument held from day 1 vs none (rewards off)
./target/release/tartarus eval  --tool rope,maiden              # a set held from day 1
./target/release/tartarus export                                # everything the play sheet reads → ../data/engine_results.json (~30 min at 12 threads)
./target/release/tartarus eval  --start cagefight --objective walk  # a start card and a fixed objective
./target/release/tartarus eval  --set muzzle_max=4 --set oppress_base=0.9
cargo test --release                                            # rules tests
```

Options: `--seed WORD` (default `LAB`; same seed = same result on any thread count), `--threads N`, `--rewards on|off`, `--start cagefight|ironlaw|tyranny`, `--objective king|walk|consume|undercurrents|doors` (default random, as in the game), `--data PATH`.

`export` writes, all from this engine: the default `base`, `tools` and `pairs` (no start card, rewards off); `run` (rewards on); `byStart.<card>` with its own base, instrument values and pairs (a start card changes the rules); `byObjective.<id>` with rewards on and that objective fixed (an objective only matters through its reward). The instrument pick inside the export uses the export's own solo values.

## Where the numbers come from

Live odds are read from `../data/tartarus_data.json` → `live` at start (frozen upstream since 2026-10-16):

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
| The policy's instrument ranking | our own last export (`engine_results.json` → `tools`); all equal if it doesn't exist |

## Open rules (parameters, `--set key=value`)

Each is a rule no source settles yet (see `tli-events.local-context/watchlist/ss14-missing-and-divergent.md`). Change the value, not the code, when a print settles it.

| Key | Default | Why open |
|---|---|---|
| `second_meal_from` | 3 (Legendary) | rules diagram + tlidb "Counter" draw second meals at every rarity; live boards suggested Legendary+ |
| `muzzle_max` | 3 | VOD card (print 34): "no more than 3 inmates on the board, after Devouring"; community sim 4; no live print |
| `maiden_any_time` | false | live card (print 88): "+3 additional Rarity Tiers to the Inmate after this Replacement" — after a Replace only, as the community sim does. `true` = checked whenever the warden's inmate changes |
| `oppress_base`, `oppress_step` | 1.0, 0.05 | tlidb gives −5%/tier; base chance not printed |
| `skewer_extra` | 2 | live card print 78 (+2); VOD and community sim +1 |
| `collar_first_bite` | true | live card (print 72): "When an Inmate Chain Consumes, 80%" — no "after the first"; community sim: bites after the first |
| `tusk_persists` | true | tlidb: Tusk goes "when there is no Inmate in this room"; content creator ALannister (2026-10-17): it stays through Replaces and clears only when the cell empties (eaten or Chromatic). The community sim agrees. `false` = gone after one Replace |
| `instigate_count` | 1 | in-game rules text (community sim uses 2) |
| `incident_respawn` | true | owner, live play (2026-10-17, prints 92-94): a run starts with at least one incident, and a triggered incident is replaced by a new one elsewhere, so the board always keeps one. The community sim has no such rule |
| `can_skip_incidents` | false | live cards have only Confirm |
| `rainbow_cap` | 10 | a limit exists (rules); ~10 seen on riot screens |
| `execution_same_tier` | false | card: lower-tier prey |

Not modelled yet: Opulence, Tartarus Rumors, the riot itself, the contract challenge, events in open cells appearing on their own. Incidents are drawn uniformly (no live rate per incident). Morning effects run in a fixed order (prey, nests, Iron Box, Tongs, Claws, Coin, Ravenous Chains); the game's order isn't documented.

## The player (`src/policy.rs`)

Our own, simple and explicit: a board value (`w_tier` per rarity, `w_rainbow`, `w_event`, `w_objective`, `w_chain`, `w_tusk`) scores every bite, Replace and Hunt analytically; patrols, treasures and incident choices are played out on copies with the hidden doors and the dice re-rolled (`samples` copies per option), so it never sees what the player can't. The weights are a first guess — tune with `eval`. `w_tusk` (12): a Tusk cell kept is worth that much, and a Mammoth half of it while holding Iron Tongs, so the player stops eating them (ALannister's play); it lifts Tongs 2.87 → 3.05 and changes nothing without Tongs.

## Results (2026-10-17, 100k runs per test, seed LAB, `export`)

- No instrument **1.394** Rainbows/run (rewards off); full run with rewards **3.41** (median 3, zero in 4%); live runs (n=114, before most of these rules were known) mean 2.04, median 2.
- Best solos: Iron Crown 3.05, Iron Tongs 3.05, Filthy Claws 3.02, Severed Iron Maiden 2.79, Hangman's Noose 2.73. Best pair: Noose + Maiden.
- Start cards (`byStart`, rewards off): **Cage Fight** base 3.54, top Lost Ring of Keys 5.43, Agonizing Muzzle 5.13, Claws 5.05; **Iron Law** base 2.68, top Tongs 6.33, Crown 5.22, Blacklist 5.22; **Tyranny** base 4.13, top Noose 6.38, Claws 5.77, Crown 5.63.
- Objectives (`byObjective`, rewards on): base 3.11 (Survival of the Fittest) to 3.65 (Prison Walk); the top five is the same in all (Claws, Tongs, Crown, Noose, Maul) — an objective moves the values, barely the order.
- Card readings this engine follows where the community sim differs: Skewer +2, Oppress, Muzzle ≤3, Collar on every chain bite, Instigate 1, the incident refill, Shared Fortune, Archenemy, Extra Portion. Rule changes moved Maiden (after a Replace only: 4.19 → 2.79 with the refill) and Tongs (Tusk stays: 1.88 → 3.05 with the refill and the Tusk-keeping player).
