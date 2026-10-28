---
# Event card: read by the site (src/content.config.ts) to list and route this event.
slug: ss11
code: SS11
name: Vorax
nameCn: 渴瘾症
mechanic: "Surgical Preparation — build monsters, kill them for vials"
launched: 2026-01-15
summary: "13 rounds to grow monsters in 6 tanks; the board you build sets the Antidote Vials."
# The card on the home page in the other languages; Surgical Preparation and Antidote Vials stay as the game shows.
i18n:
  pt-br:
    mechanic: "Surgical Preparation — monte monstros e mate-os por vials"
    summary: "13 rodadas para criar monstros em 6 tanques; o tabuleiro que você monta define os Antidote Vials."
  es:
    mechanic: "Surgical Preparation — crea monstruos y mátalos por viales"
    summary: "13 rondas para criar monstruos en 6 tanques; el tablero que montas decide los Antidote Vials."
  de:
    mechanic: "Surgical Preparation — Monster bauen, für Phiolen töten"
    summary: "13 Runden, um Monster in 6 Tanks zu züchten; dein Board bestimmt die Antidote Vials."
  fr:
    mechanic: "Surgical Preparation — fabriquez des monstres, tuez-les pour des fioles"
    summary: "13 manches pour faire grandir des monstres dans 6 cuves ; votre plateau décide des Antidote Vials."
  pl:
    mechanic: "Surgical Preparation — buduj potwory i zabijaj je dla fiolek"
    summary: "13 rund, by hodować potwory w 6 zbiornikach; zbudowana plansza decyduje o Antidote Vials."
  sv:
    mechanic: "Surgical Preparation — bygg monster, döda dem för flaskor"
    summary: "13 rundor att föda upp monster i 6 tankar; brädet du bygger avgör dina Antidote Vials."
  ko:
    mechanic: "Surgical Preparation — 몬스터를 만들고 처치해 약병을 얻기"
    summary: "13라운드 동안 탱크 6개에서 몬스터를 키우고, 완성한 보드가 Antidote Vial을 결정합니다."
  ja:
    mechanic: "Surgical Preparation — モンスターを育てて倒し、薬瓶を得る"
    summary: "13ラウンドで6つのタンクのモンスターを育てる。作った盤面がAntidote Vialを決める。"
  zh:
    mechanic: "Surgical Preparation — 培育怪物，击杀换解药罐"
    summary: "13 回合在 6 个罐子里培育怪物；你搭出的盘面决定 Antidote Vial。"
  ru:
    mechanic: "Surgical Preparation — растите монстров и убивайте их ради флаконов"
    summary: "13 раундов растите монстров в 6 резервуарах; собранная доска решает, какими будут Antidote Vials."
  vi:
    mechanic: "Surgical Preparation — tạo quái rồi hạ chúng để lấy lọ"
    summary: "13 vòng nuôi quái trong 6 bể; bàn bạn xây quyết định các Antidote Vial."
---

# SS11 Vorax (渴瘾症) — the mechanic as it runs in SS14

> Researched 2026-10-27, day 13 of SS14 Tartarus. Vorax came with SS11 (global launch 2026-01-15 18:00 PT = 2026-01-16 10:00 GMT+8, same moment on CN) and stayed in the game as a core mechanic: SS13 and SS14 patch notes still adjust it. Later changes: [CHANGELOG.md](CHANGELOG.md).
> **Scope (owner, 2026-10-27):** the rules come from SS11 research; farm, strategy and improvement advice is always for the **current season** (SS14 now). Builds/heroes are out of scope.

**Confidence legend**
- **[OFFICIAL]** patch notes (ss13pn, ss14pn), Steam post, XD press, in-game text mirrored on tlidb
- **[LIVE]** observed by players in the live game (with n when measured)
- **[SIM]** fan simulator/solver (tidewarden's Vorax Simulator) — relative decisions only
- **[CLAIM]** a creator's title/description or one comment, nobody measured
- **[PRE]** pre-launch preview / press paraphrase

---

## 1. TL;DR — what to do (SS14)

1. **Score is Σ Activity × Quantity over the 6 tanks.** Grow both on a few big groups: add monsters, fuse them, pile stats on the biggest. [LIVE/SIM]
2. **First instrument: Incubation Sac or Chrysalis Specimen, else Contracted Claws, else refresh.** [SIM, confirmed by 3,841 solver-played live games, Oct 19–23]
3. **Aim for ~840,000 before the fight;** the battle bonus usually carries it to 1,120,000 = the Rainbow vial. Score beyond that pays nothing more. [SIM/LIVE]
4. **Never abandon before the fight** (the Substance is lost). Abandon after Rainbow to collect. [LIVE]
5. **Compass by difficulty:** T8 blue (Vorax Compass) · Profound blue/purple (Scavenger) · Deep Space purple/gold (Consultation), gold only with a strong Intern Shelley and practice. [LIVE, mas0ny1]
6. **Check compass prices before farming it:** a gold-Vorax farm paid 2,500–3,000 FE/h on SS14 days 3–5 and went negative once the compass cost 50–60 FE. [CLAIM, CN, n=1]
7. **Timemark 8+** for Illusory Chimera (boots), which drops only from Vorax there. [OFFICIAL, SS14]

## 2. Event map (full flow)

```
 Netherrealm map ── kill Vorax Elites ──► Vorax Substance (12 per run, hold up to 48)
        │ (Scavenger may drop a Surgical Instrument for the next run)
        ▼
 Mad Doctor Shelley's clinic ── Surgical Preparation (13 rounds, 6 tanks) ──► Ultimate Activity
        ▼
 Operating Theater (3 phases, waves of your groups) ──► 6 Antidote Vials (white → purple → red, 1 rainbow)
        ▼
 Organs, Sutures, Corrosion, Vorax Gear ──► Grafting
```

## 3. A run, step by step

| Step | What happens | Best decision |
|---|---|---|
| Collect | Crimson **Vorax Elites** (渴瘾症劲敌) in Netherrealm maps drop **Vorax Substance** (渴瘾物质). 12 start a run; cap 48. [OFFICIAL text on tlidb + LIVE: Palsteron, TLICompendium] Pack count per map is random; Void Chart nodes change it. [LIVE, reddit 1xfx7u6, Oct 2026] | Stack the compass and Void Chart nodes for more groups. |
| Round 1 | 3 basic **Surgical Instruments** (手术用具) offered. | Incubation Sac / Chrysalis Specimen / Contracted Claws, else refresh (~1 in 4 runs). [SIM] |
| Rounds 1–10 | One of 3 **potions** (药剂) per round: Add, Remove, Mutate, Awaken, Fuse/Devour. 3 potion refreshes per run. [LIVE/SIM] | Play what feeds your instrument and your biggest groups; open a Potion Kit instead of refreshing. |
| 8,000 / 28,000 | An advanced instrument offer at each score (doesn't cost a round). Usually rounds 2–5. [SIM code + TLICompendium; Cliptis says 8k/20k, mas0ny1 10k/30k] | Get there early. |
| Rounds 11–13 | No potions: instruments work alone; **Surgical Protocols** (手术方案) / Surgical Risk picks add arena hazards. [LIVE] | — |
| Fight | **Operating Theater**: groups spawn as waves, 3 phases. Surgical Risk Low/Med/High = +5/10/20% Activity per kill, −1/2/5% Ultimate Activity per death. [LIVE, TLICompendium] | Abandon after Rainbow. |
| Loot | 6 **Antidote Vials** (解药罐), colour by final score. | — |

## 4. Core rules

- **Base stats per rarity** (Activity × Quantity): Normal 1 × 36, Magic 5 × 24, Rare 15 × 12, Boss 300 × 1. Awaken into Magic +60 Activity, into Rare/Boss +120. [SIM, measured against real boards]
- **Archetypes:** Pest, Bone Sentry, Agito, Aemberon. [LIVE]
- **Instruments** (card texts as the solver transcribes them) [SIM/LIVE]:
  - Incubation Sac: +45 Quantity to every monster each time a monster is added, once you have 2+ Pest groups.
  - Chrysalis Specimen: end of each round, +8 Quantity to random groups, repeated once per Pest group.
  - Contracted Claws: +150 Quantity to a random monster each time a non-Bone Sentry monster is removed.
  - Adherent Metatarsals: +180 Quantity to a random monster per removal, once you have 2 Bone Sentries.
  - Hyperplastic Frontal Lobe: +80 Activity to a Rare monster each round, once you have 2 Agitos.
  - Hypertrophic Pituitary: +80 Activity to a random monster each round, once you have a Rare or Boss Agito.
  - Aberrant Sprout: +35 Activity to every monster each time one mutates into an Aemberon.
  - Black Goat Gut Suture: fuses three monsters of the same rarity into one of the next rarity.
  - Beak of the Twice-Born: adds a monster every round.
  - Vermicular Spinal Cord (蠕动脊髓): each add, 75% chance to mutate into an Aemberon and +80 Activity. [LIVE: CN footage 2026-08 → 10; a sohu screenshot of 2026-01-15 reads +90 — early value or misread]
- **Xenopanacea: Osteotrophy / Brood:** a random monster becomes an Aemberon with +333 Activity / +333 Quantity. [SIM]
- **An add with 6 full tanks fails** and triggers nothing. [SIM]

## 5. Vial thresholds

| Ultimate Activity | Vial step | Confidence |
|---|---|---|
| 38,000 | purple 1 | LIVE (confirmed in-game, solver) |
| ~52,600 – ~192,300 | purples 2–6 | estimated (solver: equal growth ratio); TLICompendium lists 57k, 76k, 114k, 152k, 190k |
| 266,000 | red 1 | LIVE |
| ~342,000 – ~430,000 | reds 2–3 | estimated (TLICompendium 342k, 418k; solver 348k, 430k) |
| 512,000 / 607,000 / 721,000 | reds 4 / 5 / 6 | LIVE |
| 854,000 | +15% vial drop quantity | LIVE (TLICompendium only) |
| 1,120,000 | rainbow (only 1 vial) | LIVE |

TLICompendium also lists 2,000 and 18,000 as +1 vial quantity each (not confirmed by the solver). Rainbow is the cap: a 131M score gives the same loot (reddit 1r7q047). mas0ny1 quotes "790k + no death" for rainbow, likely the board before the battle bonus.

## 6. Compasses and the pactspirit

| Item | Effect | Source |
|---|---|---|
| **Vorax Compass** (渴瘾罗盘, blue — tlidb icon quality 2) | Vorax-infected groups appear; monsters +10% Max Life | OFFICIAL (tlidb, SS14 data) |
| **Scavenger Vorax Compass** (清道夫之渴瘾罗盘, purple — quality 3) | +30% life; each Vorax group cleared spawns 1 Scavenger guarding the Antidote Vial, +8% vial Drop Quantity each; Moderate Symptoms | OFFICIAL (tlidb) |
| **Consultation Vorax Compass** (会诊之渴瘾罗盘, gold — quality 100) | +70% life; per group cleared +1/2/4% Drop Quantity for Normal/Magic/Rare Surgical Protocols; +2 Rare Protocols; Severe Symptoms | OFFICIAL (tlidb) |
| **Intern Shelley** (实习医生雪莱, seasonal pactspirit) | Lv1: 18% chance each Antidote Vial drop is replicated. Lv6: 28%, +2 Surgical Instrument refreshes, 20% chance a vial opens again. Small/medium nodes +1.5%/+3% vial drop quantity | OFFICIAL (tlidb — "beta data" footer; gamersky from the official site, 2026-01-13) |

Colour → compass mapping is our reading of tlidb's icon quality classes, not a text source.
**SS11 history:** at launch the extra difficulty came from **Scalpels** (手术刀; blue/purple/gold, a separate seasonal compass slot, raised vial quantity). Whether they became the three Vorax Compasses is not confirmed. [MEDIA iggm + LIVE Palsteron, reddit 1qnhjxc]

## 7. Farming it in SS14

- **By difficulty** [LIVE, mas0ny1, SS14]: T8 blue · Profound blue/purple · Deep Space purple/gold; gold needs strong pet levels and minigame skill. Stack with boss-rush mechanics on the same map: Sandlord ("48 vials every 30 min"), Arcana, Afterlight, Carjack, God's Chest, Blacksail.
- **CN trick** [CLAIM]: switch to a Void Chart tree with the Vorax Confusion Card node when a Scavenger appears.
- **FE/h in SS14** (all from `../tli-events.local-context/insights/farm-ranking.md`, snapshot 2026-10-24, CN servers — compare strategies, don't expect the same FE/h on global):
  - Profound Vorax ~2,500 FE/h (枫霖游戏分享, BV1BTnA6ZE5Q, 2026-10-21). [CLAIM] Comment: purple Vorax compass returns ~180 FE a run, gold ~300+, a loss if the run misses rainbow.
  - Gold Vorax (金渴瘾), Profound: 2,500–3,000 FE/h on days 3–5, then −50 to −150 FE per round once the compass cost 50–60 FE and a round 300–420 (comment on BV173nt6wEdH, 2026-10-23). [LIVE, n=1]
  - Global: CoffeeBns "Vorax Sandlord 2150 FE/HR", Malagant ~2,000 FE/h in Profound — titles/descriptions only. [CLAIM]
- **Compass inflation** is the main risk: every viral farm gets its compass bid up until it stops paying (farm-ranking, Market and mood).
- **Illusory Chimera** (boots, Limited Legendary) drops exclusively from Vorax encounters at Timemark 8+. [OFFICIAL, ss14pn]

## 8. Grafting (缝合) and Vorax Gear

- Only **1 Vorax Gear** equipped; at most **2 Advanced + 2 Ultimate + 2 Legendary** affixes; ignores Str/Int/Dex requirements; shares the affix pool across its slots. [OFFICIAL, tlidb Graft help]
- **Normal Organs** → Basic/Advanced affixes: Rotten T5–T3, Inert T2, Vital T2–T0. [OFFICIAL]
- **Flawless (Special) Organs** → Ultimate affixes, only on Lv 89+ gear. [OFFICIAL]
- **Core Organ + Suture** → Legendary affixes, all from one Legendary (2-affix legendary = 1 option, more = 2): Sullied Suture for Fine, Tenacious for Fine/Precious, Exquisite for Matchless/Ultimate. [OFFICIAL]
- **Limb slots:** Head/Neck take helmet and necklace organs; Chest/Hands take chest and gloves; Legs/Waist/Digits take boots, belt and ring. [OFFICIAL]
- **Cutting Instrument** rerolls values; **Vorax Corrosion** (畸化侵蚀) raises every prefix/suffix 1–2 tiers; **Mutagenic Slurry** (畸化浆液) comes from the rainbow vial. [OFFICIAL]
- **Vorax Exchange:** break gear into Amputated Limb Decayed (Lv 86–88), Engorged (89) or Throbbing (90) and trade for gear of that level; **Vorax Imprint** copies base affixes. [OFFICIAL]
- **SS13:** new Core Organs (The Three Saints, Contained Mind, Uros's Bond, Beneath the Styx, Pantheon's Elegy); Mother Goddess' Paddock renamed Crimson Gash; Eternity, Lone Walker's Boots, Pantheon's Elegy and Verdant Steps need 20 Exquisite Sutures; Flawless Spine: Fragmented removed, Extension and Flawless Heart: Tangled added; limb bases gained Deflection stacks; Brain base +50% → +36% Evasion; Neck base God of War's Blessing 3 → 2. [OFFICIAL, ss13pn]
- **SS14:** disassembling an Ultimate Legendary yields 1 Core Organ; Ralph's Dreadcrest and Flawless Spine: Malleable removed; Flawless Eyes: Impassive grafts +(30-34) max Frostbite Rating. [OFFICIAL, ss14pn]
- A player reports breaking a legendary gives 2 matching organs, and the grafted legendary affix doesn't work if you also wear that legendary. [LIVE, n=1, TapTap, 2026-01-14]

## 9. CN consensus (SS11, for reference)

- Target 1M+ activity and "6红" (six reds) or the rainbow vial; easiest race 蛊虫 (Pest), then 异魔 (Aemberon) and 骨族 (Bone Sentry). Fill all 6 tanks with Pests first, then stack activity. [LIVE: 零尘0 BV1skrXBfEsr, -逝雪- BV1LTz3BREXH, 吃鱼不吃菜c BV12ck4BRE9x]
- Scalpel economics (SS11): blue in U8, purple deep, gold only with a "666" pet; titanium vs silver breaks even near 350 FE of no-scalpel drops (Ray鸽 BV16fcczREXP, 嗖嗖了 BV1usz1B3Erx). [CLAIM]

## 10. Our engine and our counts (2026-10-28)

- **Engine:** `engine/` (Rust) plays Surgical Preparation card by card; `vorax export` → `data/engine_results.json`, the only source of the play sheet's instrument and potion numbers. Rules and open parameters: `engine/README.md`.
- **Cards checked on SS13–SS14 footage** [LIVE]: every instrument and every non-Supreme potion seen with the numbers of the April 2026 fan list (Moebing, MIT); EN names from Malagant's SS14 runs (2026-10-25), CN from Bilibili (2026-08 → 10). New: 抱卵蝶 (advanced, every 3 rounds 2 Pests fuse). Special potion chains per race exist (Pest chain seen once, SS13 server; SS12 EN names "Incubation Elixir: Hollow Cocoon", "F1 Gen: Vermin Egg Cluster"…), not simulated.
- **Odds counted by us** [LIVE]: potion hands per card Normal 3 : Magic 2 : Rare 1 (CN 135 hands 0.042/0.028/0.014, EN SS14 89 hands 0.040/0.027/0.016); Supreme ~1% per slot. Starting board 44 groups: Normal 26, Magic 12, Rare 6. Advanced instruments look weighted too (Canine Teeth File 12, Vermicular Spinal Cord 11 … Lady of the Plague Quarter 2 in 87 CN slots; EN never) — not modelled yet.
- **Engine findings** [SIM, ours]: best first instruments Incubation Sac and Contracted Claws, then Chrysalis Specimen; Lady of the Plague Quarter is the strongest second instrument when it shows up (rarely), then Black Goat Gut Suture. Lady's draw rule is open (`lady_snapshot`): with one group climbing Normal → Boss in one go it would be stronger still.
- Tanned Leather Restraint (EN): "Normal, Magic, and **Elite**" — Elite = Rare or Boss.
- Community tools (for practice only, numbers not used): Vorax Simulator + Solver (voraxlab.pages.dev, tidewarden; source-available, no reuse), Vorax Overlay Plus, Voraxhalper.

## 11. Gaps (what we don't know yet)

- SS11 and SS12 patch notes: 404 on torchlight.xd.com / .cn, no Wayback copy.
- Thresholds of purples 2–6 and reds 2–3; the 2k/18k/854k steps.
- Drop rates of Substance, organs, Core Organs; measured FE/h on the global server.
- The rarity of a group added at random; advanced instrument offer weights; the Surgical Protocols' effects; the battle bonus formula; Lady of the Plague Quarter's draw rule.
- The SS11 Scalpels' EN names and whether they became the Vorax Compasses.
- Whether Intern Shelley can still be obtained in SS14.
- "Allseeing Prophet" (press) — no official text found.

## Sources

- Steam post 2026-01-16 (gid 1821922921814686): https://store.steampowered.com/news/app/1974050
- SS13 / SS14 patch notes: https://torchlight.xd.com/ss13pn/ · https://torchlight.xd.com/ss14pn (`?lang=en`)
- tlidb: https://tlidb.com/en/Vorax_Season · /en/Vorax_Substance · /en/Graft · /en/Vorax_Gameplay_Exclusive_Drops · /en/Compass · /en/Intern_Shelley · /en/Vorax_Exchange · /en/Vorax_Imprint (CN: /cn/…)
- TLICompendium: https://tlicompendium.com/en/season/vorax
- tidewarden/vorax-solver: README, OPTIMAL_PLAY.md, src/engine/rewards.ts, src/data/archetypes.ts (read 2026-10-27)
- Press: bleedingcool (2026-01-09), pcgamesn, pocketgamer, massivelyop (2026-01-13), gcores 208917 / 209662, gamersky 2074800
- Reddit r/TorchlightInfinite: 1xfx7u6, 1r7q047, 1qnhjxc, 1qfdf04
- YouTube: Palsteron, Cliptis, DonTheCrown, Mia Kitten, mas0ny1, Malagant, CoffeeBns (channels in `credits.json`)
- Bilibili: official 火炬之光无限Torchlight (preview BV1LrrMBQEpH), 零尘0, -逝雪-, 吃鱼不吃菜c, Ray鸽鸽鸽鸽, 嗖嗖了, 枫霖游戏分享
