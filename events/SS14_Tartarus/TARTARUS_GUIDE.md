---
# Event card: read by the site (src/content.config.ts) to list and route this event.
slug: ss14
code: SS14
name: Tartarus
nameCn: 塔罗斯的困兽
mechanic: "Warden's Duty — a 16-cell prison"
launched: 2026-10-15
summary: "20 days to raise inmates to Rainbow; the riot turns the board into Warden's Caches."
---

# SS14 Tartarus (塔罗斯的困兽) — event map, odds and strategy

> Updated 2026-10-16, evening — day 1 of the season (launched Oct 15 19:00 PDT = Oct 16 10:00 GMT+8). Later changes: [CHANGELOG.md](CHANGELOG.md).
> Focus: the **Warden's Duty** (典狱) prison mode. Builds/heroes are out of scope.

**Confidence legend**
- **[OFFICIAL]** patch notes torchlight.xd.com/ss14pn, Steam post, XD press release
- **[LIVE]** observed by players on the live servers (shared boards, transcribed cards) on Oct 16
- **[SIM]** fan simulator (rules + millions of simulated runs). Good for *relative decisions*; absolute numbers may differ from the game
- **[CALC]** my own math from the data above
- **[ENGINE]** our own simulator (`engine/`, rules from the card texts, odds from the live telemetry); rewards off unless stated

---

## 1. TL;DR — what to do

1. **Consume every day you can.** Waiting for a longer chain *loses* Rainbows (0.98 → 0.96 → 0.92 per run). [SIM]
2. **Only exception: don't break a Prey mark.** Lion + marked prey rise 1 tier per morning, for free, for 3 mornings. [SIM/LIVE]
3. **Patrol: prefer a locked door and the farthest destination.** Doors = raw material; walking far is worth +0.15 Rainbow/run vs. walking short. [SIM]
4. **Replace when there is no good consume** and the prisoner is Normal/Magic. Live (n=696), Replace has odds ≈ door; never Replacing costs Rainbows (0.86 vs 0.98). [LIVE/SIM]
5. **Office: decide by the board.** Never "always Bestow" (0.80) — mixing gives 0.98; "always Instigate" 0.94. [SIM]
6. **Execution: only accept if it gains more tiers than it erases.** Always accept: 0.83; never: 0.95; check: 0.98. [SIM]
7. **Accept events that only give:** Behind Closed Doors (unless the prisoner is already Supreme), Ravenous Appetite, High-Risk Convict, Crow Whispers, Taste of Freedom, Usurpations, "Treasure" Hunt. [SIM]
8. **Instruments: Hangman's Noose + Severed Iron Maiden is the broken combo (~15 Rainbow/run, 16× normal).** Iron Crown is the best solo in the sim, but **did not appear in any of the 110 offers recorded live** — in practice, Noose (7%), Scapegoat (17%), Coin (11%) and Maiden (12%) are the strong ones that actually show up. [SIM + LIVE]
9. **Riot:** bring Twin Inquisitors (pactspirit) and the highest Shackles compass you can still kill safely. [OFFICIAL + inference]
10. **Play at TM7+.** Below that the mechanic doesn't always appear on the map and loot is low (K7 drops stacks of 1 FE; K8 of 1/5/10/20). [LIVE, community + dev]

**Realistic expectation [LIVE]:** real shared runs (n=114) give **mean 2.04 / median 2 Rainbows**, 25% with zero, max 8. Streamers with good instruments get 7–10. Likely **cap of 10 per run**: the 4 riot screens from live show exactly 10 Chromatic and the containment panel has ~10 slots (not confirmed in text).

**Entry cost [LIVE]:** 12 Prisoner Nameplates per run; Meat Grinder mode costs 36 (3×) for +50% drops.

Practical tool: the simulator's **Board Analyzer** takes your real board (with instruments and objective) and recommends the move → https://blahdot3h.github.io/tartarus-simulator/analyze.html

---

## 2. Event map (full flow)

```
 NETHERREALM MAPS ──► hunt escaped prisoners ──► Prisoner Nameplates
                                                    │ (fixed N, not published)
                                                    ▼
                    ┌────────── WARDEN'S DUTY: 20 "days" (turns) ──────────┐
                    │  ring of 16 cells; 01 = office/Interrogation Room    │
                    │  02–16 = prisoner cells (sealed at the start)        │
                    │  Goal: raise prisoners to RAINBOW (Chromatic/绮彩)   │
                    └──────────────────────────────────────────────────────┘
                                                    │ end of day 20
                                                    ▼
             RIOT: Rainbows + everyone left on the board escape
             3 zones in sequence, 6 difficulties; each prisoner carries
             a Warden's Cache (典狱秘藏) of its own quality
                                                    ▼
             Reward room: open caches → rare items + Recommendation
             Letters (引荐信) → recruit Followers (4 Caged Beast families)
```
[OFFICIAL: Steam, patch notes, tlidb; the 3 zones × 6 difficulties format is wording from the pre-launch press release]

### The cell ring

```
            16  01* 02
         15            03
       14                04          * 01 = office (Instigate / Bestow)
       13                05          clockwise →
         12            06            daily destinations: 3 options among the
            11  10  09 (07,08)       next 6 cells ahead of the warden
```
[SIM, rules confirmed by players on live]

**Key point:** the spatial dimension matters little. There is no adjacency rule for consuming — any prisoner on the board can be a meal. Position matters for: (a) which cells you can reach (6 ahead), (b) Ravenous Chains (removes neighbors), (c) walking ≥4 cells (Long-Chained Shackles / Prison Walk).

---

## 3. A day in the block [SIM; order confirmed on live]

| Step | What happens | Optimal decision |
|---|---|---|
| **Patrol** | Pick 1 of 3 destinations among the 6 cells ahead. A sealed door opens when you arrive (new prisoner). | Sealed door > known prisoner with no food. Go to a known prisoner only if it has a strong consume. Tie → farther. Don't open a rat nest before it hatches. |
| **Event** | If there was an event behind the door: accept/skip. | See §6. |
| **Office** (if you stopped on 01) | **Instigate**: adds 1 Prison Incident to a random cell [OFFICIAL rules text; the sim models 2]. **Bestow**: +1 tier on a random prisoner. | Board with many prisoners and targets → Bestow; poor board/many doors → Instigate. |
| **Consume** | The prisoner in the warden's cell eats; each bite +1 tier and **re-rolls the beast** (25% each). The chain continues if the new beast has food at the new tier. Cancel stops the chain. | Always consume. Pick the 1st meal whose chain has the best odds (§4). Continue almost always. |
| **Replace** | Swaps the prisoner in the warden's cell for a random one. **1 Replace OR 1 consume per day, not both.** | Only if there is no good consume and the prisoner is Normal. |
| **End of day** | Prey marks grow, nests hatch, new destinations. | — |

---

## 4. Food chain and combo probability

**Cycle [OFFICIAL]:** Mammoth → Lion → Wolf → Rat → Mammoth ("Mammoth > Lion > Wolf > Colossal Rat", and the rat kills the mammoth).
**Rule:** it only eats the **same rarity**, and only the beast it counters. [OFFICIAL tlidb]
**Second meal — Mammoth also eats Wolf; Lion also eats Rat.** Open conflict on *from which rarity*: the in-game rules diagram [OFFICIAL, live client] and the preview VOD draw both as default counters with no rarity condition, and pre-launch boards show them at Normal/Magic; the fan-sim says Legendary+ [LIVE, 3 observations on Oct 16]. No live board settles it yet ([images](images/INDEX.md) 47, 56, 57).

Tiers: Normal → Magic → Rare → Legendary → Supreme → **Rainbow** (goes to the vault, grants 1 Warden's Treasure pick).

### Chance the chain continues at the next tier [CALC]

After each bite the eater becomes a random beast (25% each). The chain continues if there is food for it at the new tier:

| Beasts waiting at the next tier | below Legendary | Legendary+ |
|---|---|---|
| 1 beast (Mammoth or Lion) | 25% | 25% |
| 1 beast (Wolf or Rat) | 25% | **50%** |
| 2 beasts | 50% | 75%, except Mammoth+Lion and Lion+Wolf (50%) |
| Mammoth+Lion+Rat **or** Mammoth+Wolf+Rat | 75% | **100%** |
| all 4 | 100% | 100% |

**Strategic reading:**
- Below Legendary: each *different* beast waiting = +25%. Copies of the same beast don't help the same chain (but they leave the "ladder" ready for the next one).
- At Legendary/Supreme: **Wolf and Rat are the most valuable prey** (each one feeds 2 beasts). Mammoth+Wolf+Rat or Mammoth+Lion+Rat already guarantees the bite.
- A Supreme that eats → guaranteed Rainbow (100%, n=49,735). [SIM]

### "Ladder" — chance of a chain reaching Rainbow [SIM, 100k runs]

Format `eater_tier : # of distinct beasts waiting at each tier above`.

| Situation | n | Reaches Rainbow |
|---|---|---|
| Supreme eats (`4:`) | 49,735 | **100%** |
| Legendary with 2 distinct beasts at Supreme (`3:2`) | 11,456 | **74%** |
| Rare with 2 at Leg and 2 at Sup (`2:22`) | 1,603 | 57% |
| Legendary with 1 beast at Supreme (`3:1`) | 68,430 | 52% |
| Rare with 3 at Leg, 1 at Sup (`2:31`) | 2,115 | 47% |
| Rare with 1/1 (`2:11`) | 20,788 | 37% |
| Legendary with nothing at Supreme (`3:0`) | 51,146 | 28% |
| Magic with 1/1/1 (`1:111`) | 16,244 | 25% |
| Normal with 1/1/1/1 (`0:1111`) | 5,263 | 22% |

**Conclusion:** Rainbows come from high eaters climbing a well-stocked ladder. A chain from the bottom rarely makes it in one go. Build the ladder at Legendary/Supreme.

Chain length (optimal strategy): 1 bite 71%, 2 → 23%, 3 → 5%, 4+ → 1%. [SIM]

---

## 5. Odds (measured on live) [LIVE]

Source: the simulator's `rates.json` telemetry — boards shared by players through the board analyzer (38,011 boards, 5,873 runs up to Oct 16), excluding instruments that alter odds. Updated with `scripts/update_data.py`; history in the [CHANGELOG](CHANGELOG.md).

| | n | Normal | Magic | Rare | Legendary | Supreme | Rainbow |
|---|---|---|---|---|---|---|---|
| **Door** | 7,191 | 41.8% | 35.9% | 11.4% | 9.2% | 1.8% | 0 |
| **Replace** | 696 | 42.2% | 33.3% | 14.5% | 7.3% | 2.3% | 0.3% |
| *sim (door)* | | *40* | *38* | *12* | *8* | *2* | |
| *sim (Replace)* | | *52* | *32* | *9* | *6* | *1.5* | |

The simulator still uses the old Replace sample (n=261). **Use the live rows.**

| Other measurements | Live value | Simulator assumed |
|---|---|---|
| Beast behind the door | Mammoth 24.1 · **Lion 23.2** · Wolf 26.3 · Rat 26.4 % | 25% each |
| Mornings with only 2 doors | **16.9%** (n=8,592) | 0% |
| Doors with an event on day 1 | **6.4%** (n=10,370) | 5% |
| Lost Ring of Keys opens neighbors | **62.8%** (n=199) | 80% (card) |
| Bites per consume | 1.12 (n=155) | — |
| Beast changed after bite | 73% (matches a uniform re-roll = 75%) | 75% |

**Derived [CALC on the live data]:**
- Expected tier: door 0.93 · Replace 0.94 → **equivalent**. (Correction: with the 261 sample I had concluded "door better than Replace" — that doesn't hold with n=696.)
- P(≥Rare): door 22% · Replace 24%. P(≥Legendary): door 11% · Replace 10%.
- Replace on **Normal**: 58% improve. Replace on **Magic**: 24% improve, 42% get worse — only worth it if the Magic has no food and you need to re-roll the beast.
- Lion is the rarest beast: ~33 doors for a 50% chance of a specific Legendary Lion; ~167 for a Supreme Lion.
- With **Hangman's Noose**, Replace becomes ~Rare 60% / Legendary 30% / Supreme 10%.
- Real chains are short (1.12 bites/consume): most of the gain comes from **many 1-bite consumes**, not long chains.

Typical run (optimal strategy, with rewards): ~21 doors, ~9 Replaces, ~5 consumes, 1st Rainbow on day ~9. [SIM]

---

## 6. Events (Prison Incidents) [LIVE transcribed cards + SIM]

| Event | Effect | Decision |
|---|---|---|
| **Behind Closed Doors** | The prisoner behind the door becomes a **Supreme** of the scarcest beast in the block | Accept (skip only if it's already Supreme) |
| **Ravenous Appetite** | 5 attempts at +1 tier, 50% each (E = +2.5 tiers) | Accept |
| **High-Risk Convict** | gain at no cost | Accept |
| **Crow Whispers** | reveals the rarity of 4 locked cells | Accept |
| **Taste of Freedom** | opens 3 random locked cells | Accept |
| **Usurpation I→IV** | I: 1 prisoner +1 · II: 2 prisoners +1 · III: 2 prisoners +2 · IV: **all +2**. Each one swaps in the next one in the pool | Always accept (it scales) |
| **"Treasure" Hunt** | reveals all locked cells below Rare → the dark ones are Rare+ | Just confirm |
| **Sewer Ratway** | moves to any cell (except the office) and triggers its contents | Use it to reach the best cell |
| **Chain Reaction** | opens all doors along the path | Close call — floods the block but uses up doors |
| **Execution** | executioner eliminates prisoners; gains tiers | Count: gain > losses? |
| **Shared Fortune** [LIVE, not in the sim] | +1 tier to the current prisoner per prisoner with the same beast | Good with many of the same beast |
| **Archenemy** [LIVE, not in the sim] | opens 1 random cell whose prisoner is guaranteed to be a Consumable target for the current prisoner | Accept (a sure meal; best on your strongest eater) |
| **Extra Portion** [LIVE, not in the sim] | up to 3 random prisoners +1 tier (print 93) | Accept (free tiers) |
| **Transfer of Convicts** [LIVE, not in the sim] | copies the current prisoner (same beast and rarity) into a random locked cell, which opens (prints 132–133) | Better on a high prisoner |

**The board always holds at least one incident:** a run starts with one, and a triggered incident is replaced by a new one on another cell (prints 92 → 94) [LIVE, owner's play 2026-10-17]. Instigate adds 1 on top of that. The sim has no such refill (it adds 2 on Instigate when the board has none, a case that doesn't happen).

**No skip [LIVE + VOD]:** every incident card seen (8, plus Archenemy on 2026-10-17) has only *Confirm* — the decision columns above come from the simulator. In the game, decide before stepping on a "!" cell.

**Pre-run cards [LIVE]:** *Cage Fight* (eats prey of rarity ≤ its own, without re-rolling the beast — very strong for chains), *Iron Law* (30-day run), *Tyranny* (office triggers Instigate + Bestow 3× extra).

**Run objectives [LIVE]** (completing one = pick 1 of 3 instruments): King of the Caged (1 prisoner at Supreme), Prison Walk (walk 18 cells), Survival of the Fittest (consume 4×), Undercurrents (trigger 2 incidents).

**Warden's Treasure** (1 pick per Rainbow): Crimson Vintage (everyone below Legendary +1 — best with many low prisoners), Three-Headed Thumb Ring (opens 3 cells — good with many doors), Brass Horn of Strife (every prisoner with a target eats — good with many targets), Brand of Original Sin (up to 4 prisoners with no meal change beast so they have a target). Average value: Vintage 3.23 > Ring 3.06 > Horn 2.88 > Brand 2.84 Rainbow/run — pick based on the board. [SIM]

---

## 7. Torture Instruments (刑具) — tier list and combos

Start: pick 1 of 3. Objective completed: 1 more out of 3. [LIVE]
Values = Rainbows/run holding the instrument from day 1, with no other rewards. Baseline with nothing = **0.98**. [SIM, ~885k runs; margin ±0.01]

| Tier | Instrument | R/run | Effect |
|---|---|---|---|
| **S** | Iron Crown of the Prison King: Berserk Lion | **2.71** | Lion eats any prisoner of the same rarity; +2 extra tiers per bite |
| **A** | Hangman's Noose | 2.23 | Replace never brings Normal/Magic |
| A | Elephant-Foot Maul: Mammoth | 2.16 | Mammoth eats its counter prey at a higher rarity; rises to 2 tiers above the meal (Normal eating a Legendary Lion = Rainbow) |
| A | Scapegoat's Guillotine | 2.16 | Replace with ≥2 others: removes 2 random ones and the new one comes in above the replaced rarity |
| A | Kin's Coin of Fate | 2.09 | Every morning, if 2+ identical prisoners (beast+rarity): 60% → remove 1, another +2 |
| A | Severed Iron Maiden | 2.03 | After a Replace, if # above = # below the new one's rarity → +3 tiers (live card, print 88: "to the Inmate after this Replacement") |
| B | Long-Chained Shackles | 1.82 | Walking ≥4 cells: 40% for +1 tier on a prisoner |
| B | Executioner's Blacklist | 1.72 | With ≤5 locked cells, each door opened: 2 prisoners +1 |
| B | Raging Beast's Agonizing Muzzle | 1.70 | Consume with ≤4 prisoners in the block afterwards: +2 tiers |
| B | Ferocious Beast's Ravenous Chains | 1.65 | Every morning the highest prisoner removes its 2 neighbors; 40% for +1 per one removed |
| B | Avenger's Casket | 1.61 | Consume can open up a new meal at the new tier |
| B | Skewered Rat Heads | 1.57 | Rat eats rat; rat consume **+2 extra** on the live card (print 78) — the sim uses +1, so 1.57 is an underestimate |
| C | Sorting Hook 1.39 · Rusty Saw 1.37 · Barbed Collar 1.36 · Burning Stake 1.35 · Fanged Guillotine 1.32 · Felon's Dog Tag 1.25 · Barbed Whip 1.23 | | |
| D | Iron Tongs 1.17 (underestimate, see below) · Lost Ring of Keys 1.14 · Crowded Beastcage 1.07 · Warden's Scales 1.02 · Short-Chained Shackles 1.02 · Searing Branding Iron 0.99 · Iron Pestle 0.97 | ~0 | near zero |
| **Avoid** | Gaoler's Execution Axe 0.94 · Forged Key 0.81 · **Squirming Iron Box 0.54** | <1 | make the run worse (on their own) |

**Fanged Guillotine: Alpha Wolf** (live card, print 79): the Wolf eats lower-rarity countered prey and then triggers **Oppress** — *"Determines upgrade based on the difference in rarity between both parties. Reduces upgrade chance by 5% for each tier difference."* [DATA, tlidb `en/Oppress`, `cn/Oppress` 欺压, checked 2026-10-17]. So those bites are no longer a sure +1: if the base is 100% (not stated), 95% / 90% / 85% for a 1 / 2 / 3-tier gap [CALC]. The sim gives a sure +1, so its 1.32 is a slight overestimate; eating the lower prey is still worth it.

**Iron Tongs of Lust: Mammoth** (VOD card, print 37): each morning a Tusk mark goes on 1 random Mammoth cell; a Replace in a Tusk cell raises 4 random inmates +1 (tlidb `Tusk`). The Tusk **stays through Replaces** and goes only when the cell empties — the inmate is eaten or reaches Chromatic [OFFICIAL tlidb: "when there is no Inmate in this room"; LIVE: content creator ALannister, Reddit, 2026-10-17]. How to play it (ALannister): get Mammoths on the board early, never consume a Mammoth or an inmate standing in a Tusk cell, and keep landing on Tusk cells to Replace (+1 ×4 each time) — "a Rainbow printer", one of the best instruments, especially as the first pick. The sim keeps the Tusk too, but its player doesn't farm Tusks, so its value (1.17; 1.09 in sim 20261017d) is an **underestimate**. Our engine gives **2.38** (base 0.91), 4th of 31, with a player that doesn't protect Tusk cells either [ENGINE, 100k runs, 2026-10-17].

### Combos (pairs) — top [SIM, ~16.6M runs]

| Pair | R/run | × base | Why |
|---|---|---|---|
| **Hangman's Noose + Severed Iron Maiden** | **15.45** | **15.8×** | Empty block = Maiden's condition is always true (0 above = 0 below). Noose guarantees Rare+ → +3 = **Rainbow on every Replace**. Loop: open door → Replace → Rainbow → block stays empty. ~1 Rainbow/day |
| Severed Iron Maiden + Scapegoat's Guillotine | 5.77 | 5.9× | Guillotine empties the block (removes 2) → Maiden triggers |
| Squirming Iron Box + Skewered Rat Heads | 4.09 | 4.2× | Rat factory: nests → Rare Rat → rat eats rat with +2 live (the sim's +1 makes 4.09 an underestimate) |
| Agonizing Muzzle + Iron Crown | 4.09 | 4.2× | small block + lion +3/bite |
| Hangman's Noose + Kin's Coin | 3.97 | | |
| Lost Ring of Keys + Iron Crown | 3.92 | | |
| Squirming Iron Box + Kin's Coin | 3.89 | | nests produce identical Rare Rats → Coin triggers |
| Hangman's Noose + Iron Crown | 3.83 | | |
| Severed Iron Maiden + Burning Stake | 3.63 | | Stake puts in a Legendary → Maiden +3 = Rainbow |

Full table (29 solos + 406 pairs): [instrument_combos.csv](instrument_combos.csv)

**Best 2nd instrument given the 1st** (top 3): see the CSV; rule of thumb: **if you have no special pair, take Iron Crown**; if you have Noose/Maiden/Scapegoat/Stake, look for the partner for the Maiden loop; if you have Iron Box, look for Skewer or Coin.

### Actual offer frequency [LIVE, n=110 offers of 3 — small sample]

| Appears in | Instruments |
|---|---|
| 15–17% | Scapegoat's Guillotine, Iron Pestle, Sorting Hook, Lost Ring of Keys, Burning Stake |
| 10–13% | Maiden, Coin, Blacklist, Ravenous, Revenge, Saw, Collar, Whip, Dog Tag, Shackles, Forged Key, Branding Iron, Scales, Short-Chained, Beastcage, Axe |
| 7–8% | **Hangman's Noose**, Agonizing Muzzle |
| ≤4% | Squirming Iron Box, Skewered Rat Heads, Iron Tongs, Fanged Guillotine |
| **0%** | **Iron Crown, Elephant-Foot Maul** |

The beast-specific instruments (name with ": Berserk Lion", ": Mammoth", ": Colossal Rat", ": Alpha Wolf") almost never appear — hypothesis: they are only offered under some condition (beast in the block? objective?). **Not verified.**

**Chance of assembling a pair [CALC with the frequencies above]** (1 pick at the start + 1 at the objective):
- Noose + Maiden: 7.3% × 11.8% × 2 ≈ **1.7% of runs**.
- Maiden + Scapegoat: 11.8% × 17.3% × 2 ≈ **4.1%** — the most reachable Maiden loop.
- Twin Inquisitors (T2/T4) gives instrument refreshes → raises these chances.
- Extra Rainbows don't give an instrument, only Warden's Treasure. The site's map (`/ss14/`, Torture Instruments section) computes the chance of any pair.

**Live:** CoffeeBns, with Noose, Replaces "every time the prisoner is below yellow/orange" and goes for golden pairs for Kin's Coin.

---

## 8. Riot and loot (where the profit happens)

| Lever | Data | Source |
|---|---|---|
| Each Rainbow + each prisoner left on the board → 1 Warden's Cache of its quality; defeat that inmate in the Riot to unlock it | higher rarity = better loot | [OFFICIAL tooltip, print 87] |
| **Darkiron Shackles** (compass) | +10% caches | [tlidb beta] |
| **Mercury Shackles** | +30% caches; monsters −45% damage taken | [tlidb beta] |
| **Redgold Shackles** | +80% caches; monsters −70% damage taken | [tlidb beta] |
| Shackles don't stack; consumed when the riot starts | | [tlidb] |
| **Twin Inquisitors** (断罪双子, legendary drop pactspirit) | minor nodes +1/2% caches; major: 18% to duplicate everything in the cache; T2 50% for +1 instrument refresh; T3 8% to reopen a cache; T4 +1 guaranteed refresh; T5 16% reopen; T6 28% duplicate (reopening doesn't chain) | [OFFICIAL] |
| Riot ends | everyone dead or out of revives | [tlidb] |
| **First Aember** (gloves, season-limited) | only from Caged Beast at Profound+ | [OFFICIAL] |

**Riot on live [LIVE, CN screenshots + streams]:** "塔罗斯发生暴乱" screen, 3 levels (上层/中层/下层), up to ~9 prisoners per level, **6 attempts** ("剩余挑战次数 6/6"). Prisoners are quite tanky; deaths from the "falling rock execution" and a spinning blade — you can't tank it with sustain, dodge. After clearing, the panel still shows 放弃镇压/前往镇压: just abandon.

**Profit [LIVE, anecdotal, Oct 16–17]:** ~1 FE per Rainbow at K7 · ~20 FE/run at 7-2 (CoffeeBns) · 12–20 FE/run (DonTheCrown) · 2 K7 10-Rainbow runs = 300+ FE with one 188 FE legendary (lucky). High variance. **Meat Grinder mode**: consumes 3× nameplates, +50% drops. Twin Inquisitors C6 ≈ +40–48% loot — weaker than previous seasonal pets.

**Implication [inference]:** the end of the run counts *everything left on the board* — so in the last 2–3 days **stop using Replace/Execution that reduce the prisoner count** and use consume/Bestow/Crimson Vintage to raise the quality of what's already there. Use Redgold only if your character can still clear the riot while monsters take −70% damage.

---

## 9. Contract Challenge (alternate mode, 12 days) [SIM]

6 vouchers, 3 contracts (days 4, 8, 12). You pass with 2 delivered, including the heavy one (needs Supreme or Rainbow). Points per prisoner = 2^tier.
- **Never spend the last voucher on the heavy contract** (always sending the maximum passes only 36%).
- Contracts 1 and 2 via light escort (1 voucher) → keeps 3 for the heavy escort.
- Send only the minimum on the first two; save Rare/Legendary for day 8.
- Final heavy escort: 2 Supreme + 1 Rare, or Rainbow + Magic + Normal.
- Trained strategy: 95.4% pass rate, ~52 points.

---

## 10. Other studies

- **oOpsiq** (500 seeds × 5 policies on the CN sim engine, Oct 12): Replace on Normal/Magic = 2.82 Rainbows/run; Replace only Normal 2.61; never Replace 1.68. The built-in "推荐" (recommended) in the CN sim is bugged (0.53) — don't trust it. https://github.com/oopsmelodic/torchlight-talos-en
- **CN heuristics [LIVE]**: keep a variety of beasts and eat with the beast you have the most copies of (the re-roll still finds food); with 2 Supremes, hold without merging while you build Rares and convert afterwards; when Usurpation drops, push rarity to the max; "时间较多无脑选煽动" (with days to spare, always Instigate) — differs slightly from the sim, which mixes.
- **"2048" model [CN]**: values 1,2,4,8,16,32 — eating doesn't increase the board's sum; it only converts it into Rainbow. Raise the sum (doors, events, Bestow) during the first ~10 days, convert afterwards.
- **Boss Caged Beast on the map** gives the 奢靡 buff, which "almost guarantees 10 Rainbows" (opens rooms, raises and eats en masse) [LIVE, 1 report].

## 11. Gaps (what we still don't know)

- Number of Nameplates per run: 12 inferred from the UI ("1/12"), no official text; actual time per run; Warden's Cache drop table by quality — **no public data**.
- Why beast-specific instruments are almost never offered.
- **Oppress** (defined in §7): the base upgrade chance before the −5%/tier (the tooltip doesn't say), and whether it also applies to other cross-rarity bites (Elephant-Foot Maul eats *higher* rarity; only the Fanged Guillotine card names Oppress) — no data.
- Rate of each event type (the sim assumes uniform; on live only 20 Chain/Execution counted).
- Reward for each objective (the sim assumes 1 instrument); Tartarus Rumors (异闻) with no reports.
- Origin of the markers seen on live (Tusk, Prey, Scratch, Rat nest) beyond the instruments — uncertain.
- Follower recruitment odds per Recommendation Letter — no data.
- Everything tagged [SIM] reflects the simulator's rules; the author updates it with reports from live (version 20261016).

---

## Sources

- Official patch notes: https://torchlight.xd.com/ss14pn (`?lang=en`)
- Steam post (Oct 16): https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1846651706679832
- XD press release: https://www.gamespress.com/Latest-Torchlight-Infinite-Season-Is-Now-Live-Adding-New-Hero-Trait-Ne
- tlidb: https://tlidb.com/en/Tartarus_Season · https://tlidb.com/en/Season_Compass · https://tlidb.com/en/Caged_Beast_Gameplay_Exclusive_Drops
- EN simulator (CoffeeBns) + guide + analyzer: https://blahdot3h.github.io/tartarus-simulator/ · /strategy.html · /analyze.html
- EN simulator repo + live telemetry: https://github.com/blahdot3h/tartarus-simulator (`beta/data/rates.json`)
- Original CN simulator 塔羅斯监狱 (爱玩游戏的吉吉罗 / 二零后游戏荒, stopped on Oct 14): https://torchlightskill.com/talos/ · code mirror https://github.com/xiaoyihuang0503-cyber/torchlightskill-talos · https://space.bilibili.com/39881994
- oOpsiq policy study: https://github.com/oopsmelodic/torchlight-talos-en
- Streams/VODs: DonTheCrown https://youtu.be/3DutbKdoqrw · Raxxanterax https://youtu.be/xFwyzuevayg · CoffeeBns https://youtu.be/fk2_VsmQKFg · Malagant https://youtu.be/uvoCNLe09MA · dev interview (ZiggyD) https://youtu.be/ZOGnkQAZJzg
- Reddit: https://www.reddit.com/r/TorchlightInfinite/comments/1x7r9dr/hows_everyone_enjoying_the_new_season/
- Bilibili (comments/riot screenshots): BV1RGJb6xEWf, BV1fUJ668Ect, BV11eJb63EUn, BV1BMpS68Ejc, BV12bJS6NEyC
- 17173 (CN preview): https://news.17173.com/content/10102026/140115923.shtml
- Inven Global (launch): https://www.invenglobal.com/articles/27271/torchlight-infinite-launches-ss14-tartarus
