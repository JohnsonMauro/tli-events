# SS14 Tartarus (塔罗斯的困兽) — maintenance context

Season starting Oct 15, 2026 (19:00 PDT). Mechanic: the **Warden's Duty** (典狱) prison — 20 days on a ring of 16 cells, raising prisoners up to Rainbow (绮彩); the riot at the end converts the board into Warden's Caches. See `TARTARUS_GUIDE.md` (base) and `CHANGELOG.md` (changes).

## Data pipeline

`scripts/update_data.py` (stdlib, `python3 -I`; `--dry-run` only shows the diff):
- Downloads from the EN simulator (`https://blahdot3h.github.io/tartarus-simulator/`): `index.html` (`?v=` version), `js/engine.js` (`DEFAULT_PARAMS`, `TOOLS`, `EVENTS`, `OBJECTIVES`, `START_EVENTS`, `GIFTS`), `js/guide-data.js` (`TARTARUS_GUIDE`), `js/tool-combos.js` (`TARTARUS_COMBOS`).
- Downloads the live telemetry `beta/data/rates.json` from the repo `github.com/blahdot3h/tartarus-simulator`.
- Writes `data/tartarus_data.json` (read by `src/sheets/ss14/PlaySheet.astro`), `instrument_combos.csv`, a snapshot in `data/snapshots/` **only when something changed**, and an automatic CHANGELOG entry.
- Runs on its own on GitHub every 6h (`.github/workflows/deploy.yml`, job `update-data`).
- Regex parsing of the engine's `const NAME = {...}` blocks. **If the author changes the format, the script breaks with "block not found"** — adjust `block()`/`entries()`.
- `tool-combos.js` keys: each character is `chr(97 + index in ids)`; 1 character = solo, 2 = pair. `}` is the 29th (maul).

## Site (Astro, at the repo root)

- **Play sheet** (`/ss14/` + `/ss14/<lang>/` for pt-br, es, de, fr, pl, sv, ko, ja, zh, ru, vi): everything lives in `src/sheets/ss14/`: markup `PlaySheet.astro` (pages `src/pages/ss14/index.astro` and `[lang].astro` only pass the language), texts `i18n.ts` (`**x**` = accent, `!!x!!` = red, `{var}` = fmt; languages and helpers in `src/lib/i18n.ts`), client `play.ts`, styles `play.css`. Art goes through `artSet` (`src/lib/images.ts`) + `<Art>` at the box size it is drawn (`sm`/`md`/`lg`). A text change goes to all 12 languages; a new language also needs `LANGS` + `SITE_TEXT` (`src/lib/i18n.ts`), `INFO` (`src/components/event-info.i18n.ts`) and a flag (`src/components/Flag.astro`) — `pnpm check` fails until every `Record<Lang, …>` has it; a language with letters outside Latin-1 may need a font subset (`astro.config.mjs` → `fonts`; Polish brought latin-ext, Vietnamese the vietnamese subset in all three faces, 2026-10-18). Incident details render into `<template id="ev-…">` and the tier explanation (the ⓘ above the instrument list) into `<template id="tip-tiers">`; both open in the same popover as instruments (hover, focus or tap). One screen on desktop (panes scroll inside), stacked under 1100/760 px. **Numbers: `data/engine_results.json` only** (our engine's `tartarus export`); `tartarus_data.json` is read only for `live.toolOffers`. Three panes: *How to win* (on top, *Your run*: start card and objective chips — the choice re-ranks the instrument list in `play.ts` from `byStart`/`byObjective`, state in `localStorage` `ss14-run-v1`; then general rule patterns; one-line summaries from `TOOL_TEXT` in `src/sheets/ss14/tool-text.ts`, "!" marks from `DOUBT` there), *Instrument pick* (one ranked list, best first — art, tier, name, Rainbows per run; `play.ts` re-sorts it for the run's choices; hover → info popover; a tap takes the start pick, then the list re-ranks by `pairs` with it, each row says what the pair does — Combo/Clash from the numbers (pair − both apart, ±0.5) and why from `TOOL_LINKS`/`PAIR_TEXT` in `tool-text.ts`, or No combo — and a tap takes or swaps the second; state in `localStorage` `ss14-pick-v1`), and *Treasure / Incidents* (what each does + "take it when…", static in the page frontmatter: `EVENTS`, `gifts`). A board-mirroring advisor was tried on 2026-10-16 and dropped: the game is too conditional for a move solver, players learn the patterns instead.
- **Game art:** `scripts/game_art.py` (Pillow; not run by CI) cuts rectangles from images already in `images/` into `art/*.webp` and writes `art/SOURCES.md`. Change a crop in its `CROPS` table and rerun. New art needs a source image indexed in `images/INDEX.md` first.
- **A new instrument or incident** shows with no summary until it is added: instruments to `TOOL_TEXT` in `src/sheets/ss14/tool-text.ts` (EN) and to `tool` in every language of `src/sheets/ss14/i18n/`; incidents to `EVENTS` in `PlaySheet.astro` and `inc` in every language.
- Guide, CHANGELOG and `images/INDEX.md` are not published (removed from the site on 2026-10-17); `instrument_combos.csv` is still generated for the repo.
- `pnpm check` requires TypeScript 6 (TS 7 not supported by `astro check` as of Oct 2026).

## Engine (Rust, `engine/`)

Our own simulator, the only source of the site's numbers (not run by CI): `cargo build --release`, then `./target/release/tartarus eval|tools|export`. `export` (~35–60 min at 12 threads; 60 min on 2026-10-18) writes `data/engine_results.json`, which the site reads — rerun it after any rule change, then rebuild. On the owner's machine (Ryzen 9 9950X3D) run heavy engine jobs on the CCD without 3D V-Cache, so the game keeps the V-Cache cores: `taskset -c 8-15,24-31 ./target/release/tartarus export --threads 12` (CPUs 0-7,16-23 share the 96 MB L3; check with `/sys/devices/system/cpu/cpu*/cache/index3/shared_cpu_list`). Pinned on 2026-10-18: smoother frames and lower temperature while playing (owner). Never port code from the community simulator (no license). Live odds come from `data/tartarus_data.json` → `live` at start (frozen upstream since 2026-10-16). Rules no source settles are parameters (`--set key=value`, listed in `engine/README.md`): when a print settles one, change its default there and in `src/params.rs`, and run `cargo test --release`.

## Hard-won facts

- The original CN simulator (吉吉罗 / 二零后游戏荒) **stopped on Oct 14**; the EN one (CoffeeBns) keeps updating with live reports. The CN sim's "推荐" is buggy.
- The EN sim still uses the Replace odds from the old sample (52/32/9/6/1.5); the telemetry (n=696) gives ≈ door odds. Prefer the telemetry.
- Iron Crown/Maul (best solos in the sim) had **0 offers in 110** live. The team saw the Iron Crown once on 2026-10-17 (`images/76`): rare, not absent.
- Actual Rainbows per run (n=114): median 2. The sim (3.43) is optimistic.
- The mechanic only appears 100% of the time from TM7 onward.

## When updating

1. `python3 -I scripts/update_data.py --dry-run` → if there is a change, run it without `--dry-run`.
2. New official patch: read `torchlight.xd.com/ss14pn` (and the supplemental log), add a manual entry to the CHANGELOG, adjust `TARTARUS_GUIDE.md` (rules/odds/instruments sections) and the play sheet texts (`src/sheets/ss14/tool-text.ts`, `src/sheets/ss14/i18n/`).
3. A conclusion changed → fix it in the document and record the correction in the CHANGELOG.
4. Steps 2–3 changed what the play sheet says → also add a line under `## [Unreleased]` in the root `CHANGELOG.md` (patch → MINOR, correction → PATCH; see the root `CLAUDE.md` → "Releases").
