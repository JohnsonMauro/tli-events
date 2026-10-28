# Events

One folder per seasonal event. Each folder is self-contained: guide, changelog, data, images and (optionally) an update script. The site discovers events from here — adding a folder is enough to publish a new event.

| Event | Mechanic | Folder |
|---|---|---|
| SS14 Tartarus (塔罗斯的困兽) | Warden's Duty — a 16-cell prison | [SS14_Tartarus/](SS14_Tartarus/) |
| SS11 Vorax (渴瘾症) | Surgical Preparation — still in the game; farm advice follows the current season | [SS11_Vorax/](SS11_Vorax/) |

## Adding a new event

1. `cp -r events/_template events/SS<nn>_<Name>`
2. Rename `MECHANIC_GUIDE.md` to `<MECHANIC>_GUIDE.md` and fill the frontmatter (event card: `slug`, `code`, `name`, `nameCn`, `mechanic`, `launched`, `summary`, and optionally `i18n` — the card's `mechanic` and `summary` in the other site languages; a missing language shows English). That puts the event's card on the site's list, in every language.
3. Research with the method below and fill the guide, `CHANGELOG.md` and `images/INDEX.md`.
4. Optional: `scripts/update_data.py` following `scripts/README.md` — then the 6-hourly workflow keeps the data and changelog fresh.
5. The event page: `src/pages/<slug>/index.astro` (see SS14's play sheet). Until it exists the card on the list is not linked. Every event page carries `<EventInfo slot="nav">` (`src/components/EventInfo.astro`): a short methodology in each language plus `credits.json` — **always thank the YouTube/Bilibili creators used and link their channel** (resolve the channel from the video itself, e.g. `yt-dlp --print channel_url`; Bilibili via the video page's `__INITIAL_STATE__.videoData.owner`).
6. Add the row to the table above; check with `pnpm build` and `pnpm check`.

Folder layout:

```
SS<nn>_<Name>/
  <MECHANIC>_GUIDE.md   base document + event card (frontmatter, read by the site's list)
  CHANGELOG.md          what changed and when (not published)
  CLAUDE.md             maintenance context (pipeline, pitfalls)
  README.md             file index (optional)
  *.csv                 generated tables (not published)
  data/                 generated data + snapshots/
  images/               event images + INDEX.md (transcriptions and sources; not published)
  art/                  game art cut from images/ for a custom page (optional; SS14: scripts/game_art.py)
  banner.webp           official season key art, background of the event's card on the list (optional; source in images/INDEX.md)
  credits.json          creators whose work the event page uses (YouTube/Bilibili: name, platform, channel url, role) → "Method & credits" dialog
  scripts/              update_data.py (optional)
```

## Method (what worked for SS14)

1. **Confirm season/name/date first** (the CN name can differ — SS14 = 「塔罗斯的困兽」).
2. **Research in parallel** with separate agents: official/patch notes · Reddit/EN streams · CN sources · images. Once the focus is set (e.g. "just the event"), redirect running agents instead of starting over.
3. **Look for a fan simulator early.** The community (CN especially) builds simulators during preview week; their source is the best rules spec available and sometimes ships live telemetry. Download as **text** and extract data with Python — never execute downloaded JS.
4. **Tag confidence** on everything written: `OFFICIAL` (patch notes/Steam/press) · `LIVE` (measured/seen by players, with n) · `SIM` (simulator) · `CALC` (derived math) · `PRE` (pre-launch theorycraft).
5. **Correct the record** when a bigger sample contradicts an earlier conclusion (SS14: Replace "worse than a door" at n=261 became "equivalent" at n=696). Log the correction in the CHANGELOG.
6. **Images:** transcribe every image into `images/INDEX.md` (source page, image URL, date, literal EN/CN text). Never copy a fan tool's own artwork.
7. During the season: run `pnpm data`, log differences in the CHANGELOG, adjust the guide.

## Sources and how to reach them

| Source | Access | Notes |
|---|---|---|
| Official patch notes | `https://torchlight.xd.com/ss<nn>pn` (`?lang=en`); CN `torchlight.xd.cn/ss<nn>pn/?lang=zh-CN` | JS-rendered; download the HTML and extract the embedded i18n JSON. Watch for a supplemental log (补充日志) that overrides the main text. |
| Steam news | `GetNewsForApp` API, appid **1974050** | The launch post usually summarizes the mechanic. |
| tlidb.com | `/en/<Page>` and `/cn/<Page>` | Beta data — tag it as such. |
| Reddit r/TorchlightInfinite | `.json` and old.reddit are blocked; **RSS (`/.rss`) works** | RSS has no upvote counts. |
| Bilibili | search API IP-blocks fast; **wbi comment API** worked | Video/subtitles/AI summary need login. Comment images on `i0.hdslb.com` need `Referer: https://www.bilibili.com`. |
| NGA, 小黑盒, kdocs, 腾讯文档 | login required | Unusable for SS14. |
| YouTube | streamer VOD transcripts (DonTheCrown, Raxxanterax, CoffeeBns, Malagant) | Good `LIVE` source in the first days. The **official preview VOD** shows cards in 1080p: `yt-dlp --download-sections` fetches only the clip (quote the `-o '…%(ext)s'` template — zsh treats it as a glob); extract frames (temporary files outside the repo, delete afterwards). Animated diagrams need a 4 fps contact sheet (`ffmpeg -vf fps=4,crop=…,tile=8x6`): 1 fps missed the extra food-chain arrows in SS14. |
| CN media | 17173, gcores, ali213, 3DM, gamersky | Pre-launch previews; sometimes wrong (17173 claimed "6 races"). 17173's CDN (Tencent EdgeOne) blocks curl by IP: open the page in Playwright and `fetch` from inside it. |
| EN guide sites (mmogah, mmoexp, iggm) | often 403 | Shallow/pre-launch content. |
