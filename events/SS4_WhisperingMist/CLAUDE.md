# SS4 Whispering Mist — maintenance context

Season of 2024-04-18 (19:00 PDT) → 2024-07-04. Mechanic: **Mistville** (雾都), a 15-day roguelike on a fogged 5×5 board: spend Sanity to reveal cells, reach the Clock Tower each day, beat the timed folklore fight on odd days for a Chest of Folklores, survive day 15 for a guaranteed Activation Medium. Moved into the base game ("core") with SS5 and still played. See `MISTVILLE_GUIDE.md` (base), `REFERENCE.md` (tlidb tables) and `CHANGELOG.md` (changes). Methodology: `../README.md`.

## Data pipeline

None. No fan simulator or live data source exists for Mistville (searched 2026-10-17). `REFERENCE.md` is a one-off transcription of tlidb, not generated: re-collect it by hand if tlidb shows new values.

## Site

- **Mistville sheet** (`/ss4/` + `/ss4/<lang>/` for pt-br, de, ko, ja, zh, ru): everything lives in `src/sheets/ss4/`: markup and the data lists (steps, engines with their items, steles, months, start) in `PlaySheet.astro`, texts in `i18n.ts` (`**x**` = accent, `!!x!!` = red), styles in `sheet.css`. Static: no client script. A text change goes to all 7 languages. Three panes like SS14: *How to clear* (7 steps), *Engines* (4 engines + "once rich" + Bad Omen Steles with their Amulet L2 flip), side (months table from the SS5 notes, entry, Wally, Intel, Mistville Orphan, link to tlidb for the full lists).
- **Game art:** `scripts/game_art.py` (Pillow; not run by CI) downloads client icons from tlidb's CDN (needs a `tlidb.com` Referer: Cloudflare hotlink protection), trims the transparent margin (the cell textures are mostly empty), caps at 256 px and writes `art/*.webp` + `art/SOURCES.md`. Add an icon → a row in its `ICONS` table, rerun, use the id in `PlaySheet.astro`.
- `credits.json` is `[]`: the page was built from text sources only, so the "Method & credits" dialog shows no thanks section. Add creators there if a video or a creator's tool is used.
- Card background: `banner.webp`, source in `images/INDEX.md`.

## Hard-won facts

- **Season numbering:** global "SS4"; Maxroll calls it "Season 6"; client icons are `UI_S6Gameplay_*` (6th season counting S1 Dark Surge and S2 Blacksail). There is no `torchlight.xd.com/ss4pn` page (404); the patch notes live under `torchlight.xd.com/en/news/single?id=w2fksu9BgFUo`, and the JSON at `website.xdcdn.net/form/website/torchlight/news/en/<id>.json` is readable without JS.
- **tlidb values are post-SS5**, not launch values. Tag them [DATA].
- **"July Whispering Mist" = Month 7** (第七月) — EN client mistranslation. Months 1–7 are difficulty tiers.
- Activation Medium rarities in the SS5 notes: 珍贵 = Priceless, 稀世 = Rare, 至臻 = Ultimate.
- Maxroll's Whispering Mist pages return 404; read them on the Wayback Machine. The official SS4 site (`torchlight.xd.com/us/ep6`) is also only usable through Wayback, but its images on `website.xdcdn.net` are still live.

## When updating

1. A patch mentions Mistville / 怪谈 → add a manual CHANGELOG entry and adjust `MISTVILLE_GUIDE.md`.
2. tlidb changes values → re-collect the affected table in `REFERENCE.md` and note it in the CHANGELOG.
3. A conclusion changed → fix it in the guide and log the correction in the CHANGELOG.
4. Steps 1–3 changed what the sheet says → update `src/sheets/ss4/i18n.ts` in all 7 languages and add a line under `## [Unreleased]` in the root `CHANGELOG.md` (patch → MINOR, correction → PATCH). Same for a change to the card text (guide frontmatter).
