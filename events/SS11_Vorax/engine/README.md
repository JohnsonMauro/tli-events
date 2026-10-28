# Vorax engine

Our own simulator of **Surgical Preparation**, the Vorax minigame of Torchlight: Infinite (SS11, still in the game in SS14). It plays the minigame card by card and answers: which instrument to open with, which to add at the thresholds, which pairs work, and how often each potion is worth playing. The numbers behind the `/ss11/` play sheet come from here only.

## The game in one minute

Six tanks hold monster groups (Pest, Bone Sentry, Agito, Aemberon; Normal, Magic, Rare, Boss). Each group has **Activity** and **Quantity**; the score, **Ultimate Activity**, is Activity × Quantity summed over the tanks. A run is 13 rounds: in rounds 1–10 you play one of three potions; rounds 11–13 only the instruments act. You take one of three basic **Surgical Instruments** in round 1 and one of three advanced ones each time the score first passes 8,000 and 28,000. The board when round 13 ends goes into the fight; with the battle bonus about 840,000 on the board makes the rainbow vial (1,120,000).

## Use

```sh
cargo build --release
./target/release/vorax eval --games 20000            # runs played by the policy
./target/release/vorax eval --first sac --second suture
./target/release/vorax tools --games 20000           # every basic instrument taken in round 1
VORAX_DATE=2026-10-28 ./target/release/vorax export --games 20000   # → ../data/engine_results.json (the page reads it)
```

Threads default to 40% of the logical cores (`--threads`). `export` runs 162 tests (base, 8 first instruments, 17 second ones, 136 pairs); 20,000 runs each take ~11 min on 12 threads. Same seed, same result.

## Sources

| What | Where it comes from |
|---|---|
| Card pool and texts | Moebing's fan simulator (MIT, April 2026) as the starting list, then **every card checked** on SS13–SS14 footage: EN (Malagant, 8 runs, 2026-10-25) gives the EN names and texts, CN (Bilibili, 2026-08 → 10) the rest. Same numbers everywhere; new: 抱卵蝶 (advanced). Not seen yet: 速效强心剂, 至纯圣水, Lady of the Plague Quarter. |
| Potion odds | **Our count**: 224 real hands, 664 cards (CN 135 + EN 89) → per card Normal 3 : Magic 2 : Rare 1; Supreme ~1% per slot. |
| Starting board | **Our count**: 44 groups → Normal 26, Magic 12, Rare 6; 3–4 groups (more with Scavengers, not simulated). |
| Board rules | Base stats, 13 rounds, thresholds 8,000/28,000, 3 potion refreshes, 2 instrument refreshes — seen on screen. |

Code is ours; no code was taken from any community tool. Raw transcriptions, offer logs and frames are research files outside the repo (see `../CHANGELOG.md`).

## Open rules (parameters, `--set key=value`)

| Key | Default | Why it is open |
|---|---|---|
| `w_normal` … `w_boss` | 30/40/20/10 | Rarity of a group **added** at random: not counted yet (the fan simulator's value). |
| `reactive_now` | 1 | Reactive instruments (on add/remove/mutate) answer at once; 0 = in one batch at the round end. |
| `mutate_rerolls_rarity` | 1 | "Mutates into a random monster": also a random rarity. |
| `lady_snapshot` | 1 | Lady of the Plague Quarter: the four groups are drawn before any awakens (0 = one group can climb Normal → Boss in one go, the fan simulator’s reading). |
| `rainbow_board` | 840,000 | Board counted as a rainbow run before the battle bonus. |
| `tier_*`, `start_*`, `supreme_chance` | measured | Change only with a bigger count. |

Not simulated: the Surgical Protocols (rounds 11–13), the fight, Scavenger starts, the special potion chains (seen once per race, effects not all read), instrument refreshes, and talent-scaled potion values (one SS14 video shows +62/+95 where the cards say +52/+73).

## The simulated player

Potions: every card and target in the hand is tried on a copy; the move whose board, carried to the end of round 13 by the instruments alone, scores best is played (`lookahead`). Kits are valued by opening sample kits. A hand is refreshed when sample hands look 5% of the board better. Instruments: each offered one is played out `inst_samples` times; best average wins. It never peeks: every look ahead runs on a copy with fresh dice.
