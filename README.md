# TLI Events

**Strategy sheets for Torchlight: Infinite seasonal events: what actually works, backed by sources.**

Each season XD Games ships a new event mechanic, and for the first few weeks nobody knows the real rules. TLI Events collects what is known: confirmed rules, odds measured during the live season, simulator rankings and the changes made mid-season. Each event ends up as a play sheet you can keep open next to the game.

**Site:** https://johnsonmauro.github.io/tli-events/

## Events

| Event | Mechanic | Play sheet | Research |
|---|---|---|---|
| **SS14 Tartarus** (塔罗斯的困兽) | Warden's Duty, a 16-cell prison | [/ss14/](https://johnsonmauro.github.io/tli-events/ss14/) | [events/SS14_Tartarus/](events/SS14_Tartarus/) |

## What a play sheet gives you

- **How to win:** the board patterns that turn inmates into Rainbow, step by step.
- **Instrument pick:** tap the 3 instruments the game offers and the sheet highlights the best one, counting the ones you already hold. Tiers come from simulator runs, weighted by how often each instrument shows up in live offers.
- **Treasures and incidents:** what each card does, when it pays off and when to avoid it.
- **Six languages:** English, Português (BR), 한국어, 日本語, 中文 and Русский. Game terms stay in English so they match the client.
- **Live data:** during the season, data is refreshed from the simulator and live telemetry every 6 hours, and each change is logged.

## Why trust it

- **Every claim is labeled by source:** `OFFICIAL` (patch notes, Steam), `LIVE` (seen in play, with sample size), `SIM` (simulator), `CALC` (derived math) or `PRE` (pre-launch theorycraft).
- **No invented numbers.** If there is no source, the guide says "no data" and lists it under Gaps.
- **Corrections are logged.** When a bigger sample overturns an earlier conclusion, the guide changes and the CHANGELOG says when and why.
- **Creators are credited.** Each event page has a *Method & credits* dialog that links the YouTube and Bilibili creators whose work it uses.

Spotted something wrong, or have live data? Open a [Discussion](https://github.com/JohnsonMauro/tli-events/discussions).

## Practice or simulate

TLI Events summarizes; it doesn't simulate. To practice the Warden's Duty, test a board from your own run, or rerun the numbers, use **[Tartarus Simulator](https://blahdot3h.github.io/tartarus-simulator/)** by **CoffeeBns** ([source](https://github.com/blahdot3h/tartarus-simulator), [YouTube](https://www.youtube.com/@CoffeeBns), [Twitch](https://twitch.tv/coffeebns)). It is the source of the instrument tiers and the live odds on the SS14 play sheet, and it ships a board analyzer and a strategy lab that runs under Node.

## Contributing a new event

1. `cp -r events/_template events/SS<nn>_<Name>`, then fill in the guide's frontmatter. The event's card shows up on the list right away.
2. Research using the method in [events/README.md](events/README.md) (sources, access tricks, confidence labels).
3. Add the play sheet at `src/pages/<slug>/index.astro`. The card links to it once the page exists.

## Run locally

Needs Node ≥ 22.12, pnpm 12 and Python 3 (stdlib only).

```bash
pnpm install
pnpm dev        # http://localhost:4321, live reload (runs in the background; stop with `pnpm astro dev stop`)
pnpm build      # writes dist/
pnpm preview    # serves dist/ (background; stop with `pnpm astro preview stop`)
pnpm check      # type-check
pnpm data       # run every events/*/scripts/update_data.py
```

```
events/               one self-contained folder per event (guide, changelog, data, images, scripts) + _template
src/lib/              event registry, languages, image pipeline
src/sheets/<slug>/    one play sheet per event: markup, texts (6 languages), client script, styles
src/pages/            event list, play sheet routes, 404, sitemap, web app manifest
public/sw.js          service worker: instant repeat visits and offline play sheets
.github/workflows/    build + deploy to GitHub Pages; data refresh every 6h
```

The site is fully static and tuned for GitHub Pages: self-hosted fonts, CSS inlined into each page, responsive WebP images and a service worker that makes up for Pages' 10-minute cache. Lighthouse mobile scores 99–100 on every page.

On a push to `main`, [deploy.yml](.github/workflows/deploy.yml) builds and deploys the site. Scheduled runs (every 6h) and manual runs first run the update scripts and commit any changes. GitHub Pages must use the "GitHub Actions" source (Settings → Pages).

---

Community research. Not affiliated with XD Games. *Torchlight: Infinite* and its art belong to XD Games. Sources for each event are listed in its guide.
