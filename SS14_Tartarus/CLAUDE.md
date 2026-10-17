# SS14 Tartarus (塔罗斯的困兽) — maintenance context

Season starting Oct 15, 2026 (19:00 PDT). Mechanic: the **Warden's Duty** (典狱) prison — 20 days on a ring of 16 cells, raising prisoners up to Rainbow (绮彩); the riot at the end converts the board into Warden's Caches. See `TARTARUS_GUIDE.md` (base) and `CHANGELOG.md` (changes).

## Data pipeline

`scripts/update_data.py` (stdlib, `python3 -I`; `--dry-run` only shows the diff):
- Downloads from the EN simulator (`https://blahdot3h.github.io/tartarus-simulator/`): `index.html` (`?v=` version), `js/engine.js` (`DEFAULT_PARAMS`, `TOOLS`, `EVENTS`, `OBJECTIVES`, `START_EVENTS`, `GIFTS`), `js/guide-data.js` (`TARTARUS_GUIDE`), `js/tool-combos.js` (`TARTARUS_COMBOS`).
- Downloads the live telemetry `beta/data/rates.json` from the repo `github.com/blahdot3h/tartarus-simulator`.
- Writes `data/tartarus_data.json` (read by `src/pages/ss14/index.astro`), `instrument_combos.csv`, a snapshot in `data/snapshots/` **only when something changed**, and an automatic CHANGELOG entry.
- Runs on its own on GitHub every 6h (`.github/workflows/deploy.yml`, job `update-data`).
- Regex parsing of the engine's `const NAME = {...}` blocks. **If the author changes the format, the script breaks with "block not found"** — adjust `block()`/`entries()`.
- `tool-combos.js` keys: each character is `chr(97 + index in ids)`; 1 character = solo, 2 = pair. `}` is the 29th (maul).

## Site (Astro, at the repo root)

- Map: `src/pages/ss14/index.astro` (markup) + `src/scripts/ss14-map.js` (client-side render). The data comes embedded as `<script type="application/json" id="tartarus-data">`.
- Display texts live in maps in `ss14-map.js`: `TOOL_TEXT` (instruments), `EVENT_TEXT` (events), `OBJECTIVE_TEXT`, `CARD_TEXT`, `GIFT_TEXT`, `HABIT_TEXT`. **A new instrument/event shows up with an empty description until it is added to these maps.**
- Chain calculator: single-chain model, uniform re-roll, second meal from Legendary up (`doubleEatTier` = 3).
- The chance of assembling a pair uses `live.toolOffers` (small n on day 1).
- Gallery: `import.meta.glob` over `SS14_Tartarus/images/*` at build time (optimizes to WebP); the `/ss14/images/` page only exists if there is an `images/INDEX.md`.
- Docs: `src/content.config.ts` loads `*_GUIDE.md`, `CHANGELOG.md`, `images/INDEX.md`; `src/pages/ss14/[doc].astro` renders them and `rewriteDocLinks` (`src/seasons-routes.mjs`) swaps file links for routes. Astro 7 uses Sätteri as its markdown processor — `markdown.rehypePlugins` requires `@astrojs/markdown-remark`, which is why the rewrite happens on the HTML.
- `pnpm check` requires TypeScript 6 (TS 7 not supported by `astro check` as of Oct 2026).

## Hard-won facts

- The original CN simulator (吉吉罗 / 二零后游戏荒) **stopped on Oct 14**; the EN one (CoffeeBns) keeps updating with live reports. The CN sim's "推荐" is buggy.
- The EN sim still uses the Replace odds from the old sample (52/32/9/6/1.5); the telemetry (n=696) gives ≈ door odds. Prefer the telemetry.
- Iron Crown/Maul (best solos in the sim) had **0 offers in 110** live.
- Actual Rainbows per run (n=114): median 2. The sim (3.43) is optimistic.
- The mechanic only appears 100% of the time from TM7 onward.

## When updating

1. `python3 -I scripts/update_data.py --dry-run` → if there is a change, run it without `--dry-run`.
2. New official patch: read `torchlight.xd.com/ss14pn` (and the supplemental log), add a manual entry to the CHANGELOG, adjust `TARTARUS_GUIDE.md` (rules/odds/instruments sections) and the text maps in `src/scripts/ss14-map.js`.
3. A conclusion changed → fix it in the document and record the correction in the CHANGELOG.
