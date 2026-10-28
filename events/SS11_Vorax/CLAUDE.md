# SS11 Vorax (渴瘾症) — maintenance context

Season of 2026-01-15 (18:00 PT). Mechanic: **Vorax** — infected Vorax Elites drop Vorax Substance; 12 of it start a **Surgical Preparation** at Mad Doctor Shelley's clinic (13 rounds, 6 tanks, score = Σ Activity × Quantity = Ultimate Activity); the Operating Theater fight turns the score into 6 Antidote Vials (rainbow at 1,120,000); the loot feeds **Grafting** on Vorax Gear. See `VORAX_GUIDE.md` (base) and `CHANGELOG.md` (changes). Methodology: `../README.md`.

**Scope (owner, 2026-10-27):** Vorax stays in the game after SS11. The rules come from the SS11 research; farm, strategy and improvement advice is always for the **current season** (SS14 Tartarus now). Each new season: read its patch notes' Vorax section, log it, and redo the farm part.

## Data pipeline

No polling script. `engine/` is our own simulator (Rust; not run by CI): `cargo build --release`, then `VORAX_DATE=YYYY-MM-DD ./target/release/vorax export --games 20000` (~11 min on 12 threads) writes `data/engine_results.json`, which the sheet reads — rerun after any rule or odds change, then rebuild. Open rules are `--set` parameters listed in `engine/README.md`. Raw transcriptions/offer logs live outside the repo (session research).

## Site

- **Play sheet** (`/ss11/` + `/ss11/<lang>/`): `src/sheets/ss11/` — markup `PlaySheet.astro` (pages `src/pages/ss11/index.astro` and `[lang].astro` pass the language), texts `i18n/` (one file per language; `en.ts` sets the shape) and `engine-text.ts` (the engine panes and the method, all languages), styles `play.css`. Static: no client script. Instrument bars, best pairs and the potion cards (verdict from the play rate: ≥40% take, ≥20% depends) come from `data/engine_results.json`. Numbers with a `{var}` are formatted per language in the page; game names stay English.
- Card on the list: this folder's guide frontmatter (+ `i18n`) and `banner.webp` (source in `images/INDEX.md`).
- Credits: `credits.json` → "Method & credits" dialog.

## Hard-won facts

- SS11/SS12 patch notes are 404 on .com and .cn and have no Wayback copy; SS13/SS14 notes carry the Vorax changes (EN strings in the HTML's i18n JSON).
- Only six vial thresholds are confirmed in-game (38k, 266k, 512k, 607k, 721k, 1.12M); TLICompendium and the solver disagree on the rest — keep them out of the sheet.
- Owner's rule: the site's numbers come from our own simulator, never a community one — `engine/` since 2026-10-28. The community solver is only linked for practice (source-available: no code or data reuse).
- Potion draw weight per card is Normal 3 : Magic 2 : Rare 1, counted twice independently (CN 135 hands, EN SS14 89 hands). The fan simulator's uniform draw was wrong.
- Compass colour (blue/purple/gold) is read from tlidb's icon quality class (2/3/100), not from a text.

## When updating

1. New season: read `torchlight.xd.com/ss<nn>pn` → Vorax section; add a CHANGELOG entry; adjust the guide and the sheet (`src/sheets/ss11/i18n/` in every language).
2. Refresh the SS-current farm part from `../tli-events.local-context/insights/farm-ranking.md` (`/farm-research`).
3. A conclusion changed → fix it in the guide and the sheet, log the correction in the CHANGELOG.
