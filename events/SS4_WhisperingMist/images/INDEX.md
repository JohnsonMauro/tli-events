# SS4 Whispering Mist — image index and transcriptions

Collected on 2026-10-17. 4 images + the banner. Literal transcriptions (EN as shown on screen); our comments in [brackets].
Confidence: **OFFICIAL** (official SS4 site, pre-launch build).

All from XD's official SS4 landing page https://torchlight.xd.com/us/ep6 ("Torchlight: Infinite SS4 starting on April 19th!"), read through Wayback (https://web.archive.org/web/20240416100713/https://torchlight.xd.com/us/ep6). Slide-to-image mapping from the page's data script `poster.xd.com/r/data/NDB5lmXkt75e.1713405600.js` (epoch 1713405600 = 2024-04-18 02:00 UTC; Wayback `20240418162442id_`). Image URLs still answered HTTP 200 on 2026-10-17. Converted to WebP; originals not kept.

Not copied, referenced only: Maxroll's own game captures (day-1 board with 3 Sanity per cell, "Folklores of Key" dialog, Old Stuff pick, empty Deduction Record, Netherrealm mist portal) at `https://assets-ng.maxroll.gg/wordpress/{MistvilleExploration,Folklore,OldStuff,DeductionRecords,Mist}.jpg`.

## Conventions seen in the images

- Board: 5×5 grid; a red cost badge (Sanity) sits on the cells you can reveal next; crossed-out cells in red = spent/removed.
- Left column: Sanity (current/max), Coins. Top right: day number (red). Right column: Intel scroll counter, Food slots with quantities.

---

### banner.webp (event folder root) — OFFICIAL
- Page: https://torchlight.xd.com/us/ep6 (hero background `section_1.bg`)
- Image: https://website.xdcdn.net/poster/227017/ss4/stg2/en/DbMrdLQU.jpg · 2024-04-18 · XD Games · 2880×1620, resized to 1920×1080
- Description: Erika (Lightning Shadow, cat-ear visor) in front of the Mistville Clock Tower at full moon, pale mist tentacles.
- Transcription: no text.
- [Same art with the "WHISPERING MIST" logo: patch-notes cover https://website.xdcdn.net/form/website/images/1C6CXgVrd.jpg (3840×2160, 2024-04-13).]

### 01_mistville_board_xdsite.webp — OFFICIAL
- Page: https://torchlight.xd.com/us/ep6, slide "WHEN THE MIST SURGES AGAIN"
- Image: https://website.xdcdn.net/poster/227017/ss4/stg2/en/DljO5qVY.png · 2024-04-18 · 1736×825
- Description: a Mistville board on day 14. Revealed cells: Banks ($), Sanatoriums (green cross), Clock Tower (red spire, bottom-left), bench with lamp-post (centre-right), steles and tentacle/eye cells; crossed-out cells.
- Transcription: `Sanity` `81/320` · `200` (Coins) · cost badges `80` ×4 and `40` ×1 · `14` (day) · `0` (Intel scroll) · Food slots `2`, `1` · bag `4`.
- Slide text: "Upon entering Mistville, the Hunter needs to find the lantern and consume Sanity to disperse the mist. Cells with various functions are randomly hidden beneath the mist. The Hunter must make good use of these Cells to deal with the various events that occur in Mistville and ultimately find the Clock Tower. / Hunters must always pay attention to changes of their Sanity. Once Sanity is depleted, they will be lost in the boundless mist."

### 02_clocktower_loot_xdsite.webp — OFFICIAL
- Page: same, slide "WHEN THE FOLKLORE DESCENDS ONCE AGAIN"
- Image: https://website.xdcdn.net/poster/227017/ss4/stg2/en/DljR5smU.png · 2024-04-18 · 1736×825
- Description: loot explosion around the Mistville bench and lamp-post after the Clock Tower fight.
- Transcription: no text.
- Slide text: "Upon entering the Clock Tower, the unknown folklore finally descend. The hunter needs to complete the challenge within a limited time to resolve the folklore, recover the sanity and obtain the hidden treasure in the Clock Tower. Once the time runs out, the folklore will spread, and the hunter will be unable to gain sanity from it. / Finally, take a nap on the bench and start a new day."

### 03_exploration_notes_xdsite.webp — OFFICIAL
- Page: same, slide "A TWISTING AND BIZARRE EXPLORATION"
- Image: https://website.xdcdn.net/poster/227017/ss4/stg2/en/DljR5abf.png · 2024-04-18 · 1737×825
- Description: the Old Stuff / Food codex with one item's base and upgraded effect.
- Transcription: `Mistville Exploration Notes` · tabs `Old Stuff` | `Food` · `Watchful Purse` · `Before Up…` "From now on, you recover 1 Sanity for every 7 Coins obtained" · `After Upg…` "From now on, you recover 1 Sanity for every 4 Coins obtained" · flavour "Every greedy eye is keeping count of every gold coin you put in." · `Discovered (51/110)`.
- [Pre-launch values: the current client has 10 / 5 Coins per Sanity (REFERENCE.md). Codex size 110 here vs 73 Old Stuff rows on tlidb.]

### 04_deduction_record_xdsite.webp — OFFICIAL
- Page: same, slide "LAYERED REASONING LEADING TO THE TRUTH"
- Image: https://website.xdcdn.net/poster/227017/ss4/stg2/en/DljYGn3Q.png · 2024-04-18 · 1736×825
- Description: the Deduction Record tree: a base row of 5 talents (max 5 each) and three tiers gated by total points.
- Transcription: `Deduction Record` · gates `21/30`, `21/20`, `21/10` · rows `0/1 0/1 0/1` (×2) · base row `3/5 5/5 5/5 5/5 3/5` · `Reset` · panel `Unfamiliar Acquaintance` `0/1` · "Next Level:Unlock even rarer Folklores" · flavour "If you find that you have been mistaken for someone else, do not tell the speaker about this. You are him, and these are your lives." · cost `100` · `Level Up`.
- [Pre-launch: gates 10/20/30 and Unfamiliar Acquaintance at 100 Intel; now 50 Intel and gates lowered in SS5.]
