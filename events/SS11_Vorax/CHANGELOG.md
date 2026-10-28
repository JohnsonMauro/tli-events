# Changelog — SS11 Vorax

Dated log of what changed in the Vorax mechanic (patches, hotfixes, community-measured data, corrections to our own conclusions). Vorax launched in SS11 and stays in the game: entries follow the current season.

Sources to watch:
- Official patch notes of each new season: https://torchlight.xd.com/ss<nn>pn (`?lang=en`) — section "Vorax" / "Vorax Adjustments"; watch for a supplemental log (补充日志)
- Steam news (appid 1974050): https://store.steampowered.com/news/app/1974050
- Fan simulator/solver: https://voraxlab.pages.dev/tli-vorax-simulator/ (github.com/tidewarden/vorax-solver)
- tlidb: https://tlidb.com/en/Vorax_Season
- r/TorchlightInfinite, Bilibili

---

## 2026-10-27 — baseline (SS14 day 13)

**Official**
- SS11 launched 2026-01-15 18:00 PT (2026-01-16 10:00 GMT+8, CN at the same moment; CN name 渴瘾症). SS11/SS12 patch notes are gone (404, no Wayback copy).
- SS13: new Core Organs, 20 Exquisite Sutures for four of them, Flawless Spine/Heart changes, Deflection stacks on limb bases, main-city button when Surgical Preparation is available (ss13pn).
- SS14 "Vorax Adjustments": Ultimate Legendary → 1 Core Organ; Ralph's Dreadcrest and Flawless Spine: Malleable removed; Flawless Eyes: Impassive → +(30-34) max Frostbite Rating; Illusory Chimera drops only from Vorax at Timemark 8+ (ss14pn).

**Measured live (community)**
- Vial thresholds confirmed in-game: 38k (purple 1), 266k (red 1), 512k / 607k / 721k (reds 4–6), 1.12M (rainbow). Others estimated (tidewarden solver `rewards.ts`; TLICompendium).
- Solver's pick order (2,000 simulated runs at live odds of 2026-10-25; 3,841 solver-played live games 2026-10-19 → 23): Incubation Sac or Chrysalis Specimen first, else Contracted Claws, else refresh.
- SS14 farm (CN, farm-ranking snapshot 2026-10-24): gold Vorax 2,500–3,000 FE/h on days 3–5, negative once the compass cost 50–60 FE (n=1).

## 2026-10-28 — our engine, card check and counted odds

**Measured live (our counts on SS13–SS14 footage)**
- Every instrument and every non-Supreme potion read on screen (EN: Malagant, 8 SS14 runs, 2026-10-25; CN: Bilibili, 2026-08 → 10): same numbers as the April 2026 fan list. New advanced instrument 抱卵蝶. Not seen: 速效强心剂, 至纯圣水; Lady of the Plague Quarter only twice (CN).
- Potion odds per card Normal 3 : Magic 2 : Rare 1 (224 hands, 664 cards); starting groups 26 Normal / 12 Magic / 6 Rare (n=44).
- Vermicular Spinal Cord is +80 Activity (cards 2026); the +90 read from a 2026-01-15 screenshot was wrong or an early value — **correction** of the baseline entry.
- Tanned Leather Restraint needs "Normal, Magic, and Elite" (Elite = Rare or Boss), not Boss only.

**Our engine** (`engine/`, first export)
- Base run (our player's own picks) ≈ 0.62M board; best first instruments Incubation Sac and Contracted Claws; strongest second Lady of the Plague Quarter (rarely offered), then Black Goat Gut Suture.
