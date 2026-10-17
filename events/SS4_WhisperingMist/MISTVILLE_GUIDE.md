---
# Event card: read by the site (src/content.config.ts) to list and route this event.
slug: ss4
code: SS4
name: Whispering Mist
nameCn: 雾都怪谈
mechanic: "Mistville — a 15-day roguelike in a fogged town"
launched: 2024-04-18
summary: "Spend Sanity to clear the mist cell by cell, reach the Clock Tower each day and survive 15 days for a guaranteed Activation Medium. Permanent since SS5."
---

# SS4 Whispering Mist (雾都怪谈) — Mistville map, rules and strategy

> Written 2026-10-17, from sources dated 2024-04 → 2026-07. The season ran **2024-04-18 19:00 PDT** (= Apr 19 10:00 GMT+8, same day on CN and global) → **2024-07-04** (SS5 Clockwork Ballet). Mistville was then moved into the base game ("core") and is still played. Later changes: [CHANGELOG.md](CHANGELOG.md). Full item/tile/folklore tables: [REFERENCE.md](REFERENCE.md).
> Focus: the **Mistville** (雾都) exploration mode. Activation Medium builds and heroes are out of scope.

**Confidence legend**
- **[OFFICIAL]** XD patch notes (SS4, SS5), Steam posts, official SS4 site, press release, XD CN announcements
- **[LIVE]** observed by players (Reddit, Steam forum, Maxroll, TapTap, caimogu), with n when given
- **[DATA]** game-client text mirrored by tlidb.com — **current build (SS13/SS14), i.e. after the SS5 rebalance**, not April 2024 values
- **[CALC]** our own math from the data above
- **[PRE]** pre-launch (preview stream, Apr 13 patch notes, press)

No fan simulator or planner exists for this mechanic (searched CN/EN web, GitHub, Bilibili articles on 2026-10-17).

---

## 1. TL;DR — what to do

1. **Economy first (days 1–5).** Cells are cheap early: reveal most of the board and stack Coins. "Gold generation early on is super important, more so than max sanity." [LIVE, EN + CN consensus]
2. **Have a plan by day 7–8.** 3–5 Old Stuff that work together, or the run dies around day 9–12 when exploration and stele costs climb. [LIVE]
3. **Pick one engine and complete it** — half-built engines are traps [LIVE]:
   - **Food loop** (the easiest clear): Gourmet's Knife and Fork + Guild Medal – Food + Chief Trader's Statue, then cycle *Golden Worm Cheese* (Sanity → Coins) and *Dreamfish Sashimi* (full Sanity).
   - **Stele kit**: make every Bad Omen Stele one type (a *Black Goat's Horn*), see them (*Map: Bad Omen Stele*), neutralise or profit from them (*Amulet*, *Filth Eater's* items, dolls *Mr. Misfortune / Ms. Grumpy / Baby Bear*).
   - **Preview/reveal**: Cartographer items, *Burnt Map*, *Torn Map* L2 (preview the Clock Tower).
4. **Days 11–15: rush the Clock Tower.** Coin/Sanatorium/preview items stop mattering; Food, Trader and Alchemy Workshop decide. Keep food for the next day. [LIVE]
5. **Always take Mistosis** when it is cheap (Wally's Mistosis Section, folklores): +20% chest drops per stack, max 6. [DATA]
6. **Run the hardest month you can clear.** Months 1–6 mostly pay cheap Activation Mediums; Month 6 is "farming tickets for Month 7"; Month 7 (paid with Mist Essence) is where the money is, and players say it needs the **Mistville Orphan** pactspirit. [LIVE, TapTap 2025-04-05]

**Realistic expectations [LIVE]:** one CN player reports ~70% clear rate (~75% with a starting relic), another 8 of 9 in Month 7; experienced EN players claimed 80%+ day-15 rate in May 2024. No larger sample exists.

## 2. Event map (full flow)

```
 Netherrealm: kill Mistville "Residents" ──► Resident's Eye ──► Infection Progress (cap 900)
        │
        ▼
 Ember's Rest: talk to Wally ──► pay Infection Progress (Month 7: + Mist Essence)
        │
        ▼
 Mistville (5×5 board, 15 days) ── each day ──────────────────────────────────────┐
   light the lantern at the bench ─► spend Sanity to reveal cells ─► Clock Tower   │
        odd day:  Advent of Folklores (timed fight) ─► Chest of Folklores ─► bench ─┤
        even day: tower restores some Sanity ─► next day ───────────────────────────┘
        │
        ├─ Sanity hits 0 ─► run over
        └─ survive day 15 ─► guaranteed Activation Medium
 Chests also drop Mistville Intel ──► Deduction Record (permanent talents)
```

## 3. A run, step by step

| Step | What happens | Best decision |
|---|---|---|
| Enter | Wally takes Infection Progress (at launch ~300 per entry at 7-1, rising per run [LIVE]; exact table: no data). Wally options from the Deduction Record let you pay Intel for 1 Mistosis / 1 Old Stuff / +1 Food slot + Food. [DATA] | Before the talents are maxed, spend spare Intel on day 1 for the Old Stuff + Mistosis. [LIVE, caimogu] |
| Day start | You "awaken" at the bench (Place of Awakening), light the lantern; daily triggers fire (previews, Coins, Sanity). [OFFICIAL/DATA] | — |
| Explore | Reveal a cell adjacent (4 directions; 8 with Explorer's Glasses) to a revealed one by paying its Sanity cost. Costs rise every day. [LIVE/DATA] | Early: reveal almost everything. Late: path straight to the tower. |
| Cells | Bank (Coins), Sanatorium (Sanity), Trader (buy Food/Old Stuff with Coins), Alchemy Workshop (upgrade Old Stuff), Unknown Old Stuff / Food, Folklores (choice events), Watch Tower (clears steles in its row and column), Tentacle (costs Sanity), Ruins (blocks the 4 neighbours), Bad Omen Steles (seal 4 neighbours until removed with Sanity). Full list: §6. | — |
| Clock Tower | Always ≥3 cells from the spawn [LIVE]. Odd days: **Advent of Folklores**, a timed fight; beat the timer to get Sanity back, otherwise "the folklore spreads" and you get none. Then the **Chest of Folklores** and the bench to start a new day. Even days: restores some Sanity and starts the next day. [OFFICIAL/DATA] | — |
| Chests | 8 per full run: end of days 1, 3, 5, 7, 9, 11, 13, 15. [LIVE, matches the odd-day rule] | Mistosis stacks multiply them. |
| End | Sanity runs out, or day 15 is survived. [DATA] | — |

Month 7 extra: from day 9 the Clock Tower is **locked**; the key is under one of the Bad Omen Steles. [DATA tile text + LIVE caimogu 2024-07-16]

## 4. Core rules and numbers

| Rule | Value | Tag |
|---|---|---|
| Board | 5×5 = 25 cells, 24 clickable | LIVE (TapTap 2024-05-08) + official screenshots |
| Run length | 15 days; the mist strengthens every day | OFFICIAL |
| Sanity cost per cell | Day 1: **3** per cell (Maxroll screenshot, 84/100 Sanity). Official pre-launch day-14 screenshot: **40–80** per cell with Max Sanity 320. Players: ~30/cell by day 11–12; day 15 ≈ 50+/cell and 150+/stele (pre-SS5) | LIVE / PRE |
| Cost formula | grows multiplicatively by day — exact formula: no data | LIVE |
| Clock Tower Sanity restore | 30% of Max Sanity (Maxroll only; official text says "some") | LIVE |
| Base Max Sanity | no data (players cite ~100–120 early) | LIVE |
| Food | limited uses; 3 Food slots base | DATA / LIVE |
| Old Stuff | permanent for the run; 2 levels (upgrade at the Alchemy Workshop) | DATA |
| Mistosis (雾化症) | +20% Chest of Folklores drop quantity per stack, max 6 | DATA |
| Drop bonuses | Activation Medium and Mistville Intel ignore every drop-quantity bonus; other chest drops only take Mistosis, chest-quantity and the month's bonus | DATA |
| Infection Progress | cap 900 shown (Eyes can push past it); **20 per Resident's Eye at launch** (CALC from "45 eyes is 900"), **7 now** (SS5 lowered it) | LIVE / CALC / DATA |
| Day 1 layout | 3 Sanatoriums, 3 Banks, 2 Old Stuff, 1 Food; day 2 guarantees ≥1 Old Stuff and a Trader; day 3 guarantees an Alchemy Workshop | LIVE (one CN source) |
| Fail confirm | since SS5 the game asks twice when a cost ≥ your remaining Sanity | OFFICIAL |

## 5. Months (difficulty tiers) and rewards

Runs are tiered by **Month 1–7** (第1–7月). The EN client text "July Whispering Mist gameplay" is a mistranslation of 第七月 = **Month 7**. [DATA EN/CN + OFFICIAL]

| Month | Days 9 / 11 / 13 chest | Day 15 chest | Entry |
|---|---|---|---|
| 1–5 | chance of a **Priceless** Activation Medium | guaranteed Activation Medium (up to **Rare**) | Infection Progress |
| 6 | chance of a Priceless Activation Medium | guaranteed **Rare** | Infection Progress ("Deep Space" difficulty, per a player) |
| 7 | chance of an Activation Medium (up to Rare) | guaranteed **Ultimate** | Infection Progress + **Mist Essence** |

Table: SS5 notes (2024-07-01) [OFFICIAL]; EN 珍贵/稀世/至臻 = Priceless/Rare/Ultimate from the EN and CN versions of the same note. At launch only "day 9+ can drop, day 15 guaranteed" was documented. [LIVE, Maxroll]

- **Month-7-only Activation Mediums** (players, 2025): Still Attack, Burst Activation, Wind Rhythm, Perpetual Motion. [LIVE]
- **Mist Essence** (迷雾的本质): drops from Chests of Folklores, tradeable (fixed 2024-04-21), drop rate ×2 in SS5. Month 7 cost 42 in May 2024 [LIVE]. Price ~50–60 FE (May 2024), 70–80 (May 2025), 80–100 (Nov 2025). [LIVE]
- **Other chest loot**: Flame Elementium, compasses, Fluorescent Memory, legendaries; one player estimates Month 6 with the pet at ~500 FE per 15-day clear, excluding Activation Mediums. [LIVE, single source]
- **Profit (May 2024)**: 300–400 FE per completion at 8-4, cost ~15–25 FE of Eyes per entry. 2025: "not the holy grail of profits it was"; Mist Essence is the main profit. Poll on TapTap (n=95, 2025-04-05): 48.4% think the rewards are reasonable. [LIVE]

## 6. Cells and Bad Omen Steles

| Cell | Effect | Tag |
|---|---|---|
| Place of Awakening | start (bench + lantern) | DATA |
| Clock Tower | ends the day (fight on odd days); Month 7 day 9+: locked, key under a stele | DATA |
| Sanatorium | recovers Sanity (+20 at launch) | DATA / LIVE |
| Bank | Coins | DATA |
| Mistville Trader | buy Food and Old Stuff with Coins | DATA |
| Alchemy Workshop | spend Coins to upgrade Old Stuff | DATA |
| Unknown Old Stuff / Unknown Food | pick one of the offered items | DATA |
| Folklores | a choice event: strong reward, often with a heavy drawback ("leaving this place is sometimes a good idea") — 30 events, see REFERENCE.md | DATA / LIVE |
| Watch Tower | removes Bad Omen Steles in its row and column | DATA |
| Tentacle | takes Sanity when revealed | DATA |
| Ruins | its 4 neighbours can't be explored | DATA |
| Clearing | nothing | DATA |

**Bad Omen Steles** seal the 4 cells around them until you pay Sanity to remove them. Special effects [DATA]:

| Stele | Base effect | With its Amulet at L2 |
|---|---|---|
| Blank | none | — |
| Blindness | seals 8 cells instead of 4 | the 8 cells around it become explorable |
| Anxiety | removal cost ×2 | removal costs 0 Sanity |
| Poverty | lose 10% of current Coins per cell revealed | +8 Coins per cell revealed |
| Anorexia | can't eat Food | 30% chance Food isn't consumed |

## 7. Folklores (Advent of Folklores at the Clock Tower)

Timed fights on odd days. Named in the SS5 notes, with the easing they got [OFFICIAL]:

| Folklore (EN) | CN | SS5 change |
|---|---|---|
| Catching Moth | 抓飞蛾 | 5 fewer moths |
| Mistville Master | 迷雾的主人 | boss damage −10% |
| One Man's Hide & Seek | 一个人的捉迷藏 | timer +15 s |
| Visitors in the Plaza | 广场上的客人 | the "door" no longer reactivates |
| Lamplighter | 点灯人 | +5 charge per moth-carrier kill |

Full list of fights: no data. The Deduction Record talent *Unfamiliar Acquaintance* unlocks "even rarer Folklores". The 30 **Folklore cells** on the board (choice events like *Folklores of Key*, *First Bank*, *Black Cat*) are listed with options in [REFERENCE.md](REFERENCE.md#folklores).

Watch out: three Folklore choices hand you a cursed Old Stuff — *First Bank's Shackles* (no more Coins), *Rusty Cranial Nail* (no more Sanity recovery), *Amnesia Patient's Key* (no more Old Stuff). The same three come from Trader foods *Coin Soup*, *Wally's Grapes* (50-Coin version) and *Night Pudding* (50-Coin version). [DATA]

## 8. Old Stuff and Food — what players rate

73 Old Stuff and 72 Trader goods, all with EN/CN names and values in [REFERENCE.md](REFERENCE.md). Values are the current client (SS5 "rebalanced the values of all effects"). [DATA]

**Income** [LIVE, TapTap 2024-09-18]: Poverty stele kit (*Amulet: Poverty* + *Map: Bad Omen Stele – Poverty* + *Poor Black Goat's Horn*); *Filth Eater's Wages* (Coins per stele removed); *Banker's IOU* + foods that create Banks (*Lard Potion*, *Water of Blithe*).

**Core trio once rich** [LIVE, TapTap + caimogu]: *Watchful Purse* (Sanity per Coins), *Guild Medal – Food* (Food −30/−60%), *Chief Trader's Statue* (refresh the Trader). Upgrade Statue first, then Medal, then Purse. caimogu rates the Guild Medals "T0".

**Food loop** [LIVE]: *Gourmet's Knife and Fork* (more Food choices, +1 initial Food) → *Golden Worm Cheese* (lose 50% Sanity, +2 Coins per Sanity lost) ↔ *Dreamfish Sashimi* (recover all Sanity); *Rich Pork Pate* adds uses; *Dried Mistfish* early. "With max Forks the infinite loop starts under ~400 Coins." EN players reported 18k–100k Sanity with this loop in May 2024.

**Stele kit** [LIVE + our inference]: *Map: Bad Omen Stele – X* + *X Black Goat's Horn* (L2: every stele is that type) + *Amulet: Anxiety* (L2: Anxiety steles cost 0) + dolls *Mr. Misfortune* / *Ms. Grumpy* / *Baby Bear* turns steles into Sanatorium + Bank + Food. caimogu warns "these four relics can't coexist"; we read that as the four Black Goat's Horns (each forces a different type). Unverified.

**EN tier list (Reddit, 2024-05-07)** [LIVE]: Cartographer + "Bottle" (probably *Cartographer's Medicine Bottle* — our reading) "in a league of their own"; the dolls for early stability; Fluffy Old Blanket disputed.

**Fallback** [LIVE]: no engine by ~day 10 → buy *Fluorescent Moth Soup* (reveals the Clock Tower) or *Clock Tower Sleeping Candy* (previews it) and sneak to the tower.

## 9. Deduction Record (permanent talents)

Paid with **Mistville Intel** (雾都情报), which drops from Chests of Folklores and ignores drop-quantity bonuses. Tiers unlock by total points spent. [DATA/OFFICIAL]

| Tier | Talent (current name) | Effect per level | Levels × Intel (now) |
|---|---|---|---|
| 1 | Never Look Back | initial Max Sanity +4 → +20 | 5 × 10/20/30/40/50 |
| 1 | Cabinet at Bank 7 | initial Coins +40 → +200 | 5 × 10–50 |
| 1 | Second-Hand Intel | Intel 4% → 20% chance to double | 5 × 10–50 |
| 1 | Try Sleeping Under the Bench | +2 → +10 Sanity at each new day | 5 × 10–50 |
| 1 | Legends of the Mist Monsters | Chest of Folklores quantity +2% → +10% | 5 × 10–50 |
| 2 | Ingredients Can't Talk | Trader sells +1 Food | 1 × 50 |
| 2 | Unfamiliar Acquaintance | unlocks rarer Folklores | 1 × 50 |
| 2 | Overly Familiar Traces | Trader sells +1 Old Stuff | 1 × 50 |
| 3 | Getting Used to It? | 20%/day: explore cost −1 | 1 × 100 |
| 3 | Nothing's Under the Stele | 20%/day: stele removal −5 | 1 × 100 |
| 3 | Wally's Mistosis Section | pay Intel → start with 1 Mistosis | 1 × 100 |
| 4 | Wally's Relic Pouch | pay Intel → 1 random Old Stuff at start | 1 × 250 |
| 4 | Wally's Special Lunch Box | pay Intel → +1 Food slot and 1 Food | 1 × 250 |

- Total now: **1,700 Intel** for 13 talents / 33 levels. [CALC]
- SS5 cut costs per point by 66% (tier 1) and 50% (other tiers) and lowered the tier 2/3 gates to 15/20 points → launch costs were ~3× / ~2× these; exact launch values: no data. The official pre-launch screenshot shows gates at 10/20/30 points. [OFFICIAL/CALC]
- At launch some talents had other names (Maxroll): Don't Look Behind You, Cabinet at Bank, Legend of the Monsters in the Mist, Ingredients Don't Speak, Are You Used To It Now?, Nothing's Under The Stele. [LIVE]
- Intel only drops from the 2nd–3rd month up, per a 2025 player. [LIVE]

## 10. Season pactspirit — Mistville Orphan (雾都孤女)

Legendary, Boon "Whisper in the Mist" [OFFICIAL, SS4 notes]:
- Inner rings: Mistville Intel 2% (then 4%) chance to double; Advent of Folklores drop quantity +2% (then +4%).
- Outer ring: going to the Clock Tower has a **10% chance to skip the fight** → **Misty Lake** with **3 Chests of Folklores**.
- Ranks: +1 → 5% chance of an extra chest when opening one · +2 → +1 free Trader refresh per round · +3 → extra chest 10% · +4 → 3 free refreshes · +5 → skip chance 13%.
- Players call it near-essential for consistent Month 7 profit. [LIVE]

Other chest pactspirits from the season: Happy Chonky – Violet (2.5% extra chest), First Mate of the Furious Sea – Silent Night (5% extra chest). [DATA]

## 11. History and patches

| Date | Change | Tag |
|---|---|---|
| 2024-03-29 | Season teaser; preview stream Apr 13 | PRE |
| 2024-04-13 | SS4 patch notes (EN) | PRE |
| 2024-04-18 19:00 PDT | Launch (CN: Apr 19 10:00 GMT+8), together with the 1st anniversary | OFFICIAL |
| 2024-04-21 | CN hotfix: first 10 days made easier; Residents' damage −30%; Mist Essence made tradeable; a wall exploit giving huge damage reduction fixed | OFFICIAL (XD CN) |
| 2024-04-18 → 07-04 | No EN hotfix touching Mistville found (Steam, XD news, Reddit mirrors of in-game notices) | — |
| 2024-07-04 | SS5 Clockwork Ballet: Mistville goes **core**; Netherrealm drops only Resident's Eye (less Infection Progress each); Residents spawn without the rift portal; Mist Essence ×2; Deduction Record −66%/−50%; folklore fights eased (§7); Activation Medium drops by month (§5); all Old Stuff/Food values rebalanced; Month 7 slightly harder | OFFICIAL |
| 2025–2026 | Still played (Reddit, TapTap 2025-04, 233leyuan 2026); tlidb lists the items in SS13 and SS14 data | LIVE / DATA |

## 12. Gaps (what we don't know)

- Base Max Sanity; exact Sanity cost per cell per day/month.
- Infection Progress needed per entry per month; which Timemark unlocks which month.
- Launch (pre-SS5) values of Old Stuff, Food and Deduction Record costs; tlidb only has current values.
- Full list of Advent of Folklores fights; Wally's Intel prices for his three options; chest loot tables; per-month drop bonus.
- "Lanterns" from the press release: the only lantern we can confirm is the one you light at the bench to start the day, and *Doctor's Lantern* (Old Stuff).
- Video guides were not transcribed (titles only, see Sources).

## Sources

Official (XD):
- SS4 patch notes (EN), 2024-04-13 — https://torchlight.xd.com/en/news/single?id=w2fksu9BgFUo (JSON `https://website.xdcdn.net/form/website/torchlight/news/en/w2fksu9BgFUo.json`; zh-TW `…/news/zh-tw/w2fksu9BgFUo.json`)
- SS4 official site — https://torchlight.xd.com/us/ep6 (Wayback 2024-04-16: https://web.archive.org/web/20240416100713/https://torchlight.xd.com/us/ep6)
- Steam posts (appid 1974050): 2024-03-29, 04-16, 04-17 (preview replay + patch notes), 04-19 (event & boon), 05-06 (feedback), 07-01 (Clockwork Ballet) — https://store.steampowered.com/news/app/1974050
- SS5 patch notes (EN), 2024-07-01 — https://torchlight.xd.com/en/news/single?id=tjiwsuhfoGpD ; CN — https://torchlight.xd.cn/news/single?id=9ugZrpXl
- CN hotfix 2024-04-21 — https://www.taptap.cn/moment/531167383390257758
- Press release 2024-04-15 — https://www.gamedeveloper.com/press-release/torchlight-infinite-unveils-season-ss4-whispering-mist-in-livestream-reveal

Data:
- tlidb.com (current client, SS13/SS14) — https://tlidb.com/en/Mistville_Exploration , /en/Mistville_Trader , /en/Deduction_Record , /en/Whispering_Mist , /en/Whispering_Mist_Season (and the /cn/ versions)

Guides and players:
- Maxroll "Whispering Mist Season Guide" (2024-04-18, edited 2024-07-04; live page now 404) — https://web.archive.org/web/20240425044144/https://maxroll.gg/torchlight-infinite/resources/whispering-mist-season-guide
- Reddit r/TorchlightInfinite: Old Stuff tier list 2024-05-07 (/comments/1cm6iyw/), cost of entry 2024-05-10 (/1coimcg/), mistville strat 2024-05-01 (/1chgjcq/), max Sanity 2024-04-28 (/1cfjznj/), 18k Sanity 2024-05-06 (/1clc4rn/), Intel 2025-11-22 (/1p3o78g/)
- Steam forum: "Please buff access to new league content" 2024-04-19 (/discussions/0/4363500448198778214/), "Mistville review" 2024-05-03 (/4360124186532890510/)
- TapTap: archetypes 2024-04-17 (/moment/529675030431270010), Month 7 2024-04-30 (/534535270373000883), tips 2024-05-08 (/537306264862982634), high clear rate 2024-09-18 (/585561784824367386), value poll 2025-04-05 (/657519215774797720)
- caimogu "十五天存活——雾都玩法攻略" 2024-07-16 — https://www.caimogu.cc/post/1334196.html
- Bilibili article on Mistville Orphan 2024-04-22 — https://www.bilibili.com/read/cv33995933
- gcores 2024-03-29 / 04-19 (CN launch date) — https://www.gcores.com/articles/179564 , https://www.gcores.com/articles/180564
- Videos (not transcribed): Palsteron "The Most Fun League Mechanic I've Ever Played - Mistville Full Guide" (youtube XWh0sFpFLQc); Senth "MISTVILLE guide SS4" (j_pqZ3EsLdU); Travic "Mistville Beginner's Guide" (Fr_HKsHcC0Y), "How to Profit from Mistville" (X599beQsu0g); Riktor (2HERurVU3lk); GukDaddy Gaming "Mistville Eazy Day 15" (5zjPaMIijMs)
