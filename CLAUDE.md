# Torchlight: Infinite — season research base

The team's strategy base for Torchlight: Infinite (XD Games) seasonal mechanics, published as an Astro site on GitHub Pages (private repo). **Everything is in English** — the team plays the English client, so mechanic/item names match the game exactly; Chinese terms stay in parentheses where useful.

## Layout

```
src/                        Astro 7 site (Base layout, per-season pages, client scripts)
  seasons.ts                season registry (slug, folder, titles, doc ids)
  seasons-routes.mjs        filename → route (rewrites links inside the .md docs)
  content.config.ts         `docs` collection: *_GUIDE.md, CHANGELOG.md, images/INDEX.md of each season
SS<nn>_<Name>/              source of truth for the season
  CLAUDE.md                 season specifics (pipeline, pitfalls)
  README.md                 file index + how to update
  <MECHANIC>_GUIDE.md       base document: rules, odds, strategy, gaps, sources → /<slug>/guide/
  CHANGELOG.md              what changed and when → /<slug>/changelog/
  data/                     generated data (JSON) + snapshots/ frozen on every change
  images/                   event images + INDEX.md (transcriptions) + structured JSON
  scripts/update_data.py    stdlib-only Python; run with `python3 -I`
.github/workflows/deploy.yml  push → build/deploy; every 6h → refresh data, commit if changed, deploy
```
Template to copy: `SS14_Tartarus/` + `src/pages/ss14/`.

## Repo skills

| Change touches | Load first |
|---|---|
| `src/`, season pages, `astro.config.mjs`, `.github/workflows/` | `.claude/skills/astro-site` |

## New season

1. Copy `SS14_Tartarus/` to `SS<nn>_<Name>/` and empty the docs/data.
2. Register it in `src/seasons.ts` and create `src/pages/<slug>/` (a map for the new mechanic + `[doc].astro` with the new ids).
3. Add the base document's filename to `DOC_ROUTES` in `src/seasons-routes.mjs`.
4. The workflow runs every `SS*_*/scripts/update_data.py` it finds.

## Method (what worked for SS14)

1. **Confirm season/name/date first** (the CN name can differ — SS14 = 「塔罗斯的困兽」).
2. **Research in parallel** with separate agents: official/patch notes · Reddit/EN streams · CN sources · images. Once the user sets the focus (e.g. "just the event"), redirect running agents via SendMessage.
3. **Look for a fan simulator early.** The community (CN especially) builds simulators during preview week; their source is the best rules spec available and sometimes ships live telemetry. Download as **text** and extract data with Python — never execute downloaded JS.
4. **Tag confidence** on everything written: `OFFICIAL` (patch notes/Steam/press) · `LIVE` (measured/seen by players, with n) · `SIM` (simulator) · `CALC` (derived math) · `PRE` (pre-launch theorycraft).
5. **Correct the record** when a bigger sample contradicts an earlier conclusion (SS14: Replace "worse than a door" at n=261 became "equivalent" at n=696). Log the correction in the CHANGELOG.
6. During the season: run the update script, log differences in the CHANGELOG, adjust the guide.

## Sources and how to reach them

| Source | Access | Notes |
|---|---|---|
| Official patch notes | `https://torchlight.xd.com/ss<nn>pn` (`?lang=en`); CN `torchlight.xd.cn/ss<nn>pn/?lang=zh-CN` | JS-rendered; download the HTML and extract the embedded i18n JSON. Watch for a supplemental log (补充日志) that overrides the main text. |
| Steam news | `GetNewsForApp` API, appid **1974050** | The launch post usually summarizes the mechanic. |
| tlidb.com | `/en/<Page>` and `/cn/<Page>` | Beta data — tag it as such. |
| Reddit r/TorchlightInfinite | `.json` and old.reddit are blocked; **RSS (`/.rss`) works** | RSS has no upvote counts. |
| Bilibili | search API IP-blocks fast; **wbi comment API** worked | Video/subtitles/AI summary need login. Comment images on `i0.hdslb.com` need `Referer: https://www.bilibili.com`. |
| NGA, 小黑盒, kdocs, 腾讯文档 | login required | Unusable for SS14. |
| YouTube | streamer VOD transcripts (DonTheCrown, Raxxanterax, CoffeeBns, Malagant) | Good `LIVE` source in the first days. The **official preview VOD** shows cards in 1080p: `yt-dlp --download-sections` fetches only the clip; extract frames (venv/files in the scratchpad, delete afterwards). |
| CN media | 17173, gcores, ali213, 3DM, gamersky | Pre-launch previews; sometimes wrong (17173 claimed "6 races"). 17173's CDN (Tencent EdgeOne) blocks curl by IP: open the page in Playwright and `fetch` from inside it. |
| EN guide sites (mmogah, mmoexp, iggm) | often 403 | Shallow/pre-launch content. |

## Rules for this repo

- Don't invent numbers: no source → write "no data" and list it under Gaps.
- Generated files (`data/*.json`, `*.csv`, snapshots) only via the script — never edit by hand.
- Before calling something done: clean `pnpm build` and `pnpm check`; look at the map in a browser (`pnpm preview`, which runs in the background — stop it with `pnpm astro preview stop`) and test at 390 px (see the `astro-site` skill).
- CHANGELOG is append-only with absolute dates; automatic and manual entries coexist.
- Research scratch files go to the session scratchpad, not the season folder.
