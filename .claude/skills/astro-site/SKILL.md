---
name: astro-site
description: Verified pitfalls of this repo's Astro 7 site (TLI Events) — whitespace between inline elements vanishing in the build, mobile overflow, event data and art from outside src/, GitHub Pages base path and delivery limits (cache headers, service worker), self-hosted fonts and CLS, astro check and background servers. Use when touching src/, event pages, astro.config.mjs or the deploy workflow.
---

# Astro site — pitfalls verified in this repo

Dated: Astro 7.4.0, pnpm 12, Oct 2026. Original template: `stacks/astro/skills/astro-static-site` in global-context (adapted copy).

## Markup

- **A line break between inline elements disappears** (`compressHTML: 'jsx'`). `<span class="n">02</span>Flow` rendered "02Flow"; the badge legend glued "Steam" to "LIVE". Use `{" "}` where words form a sentence. Check: build, then grep `dist/` for text glued to `<span|b|a|code>`.
- An HTML comment `<!-- -->` ships to the page; in templates use `{/* */}`.

## Mobile layout

- **A grid item with `min-width: auto` widens the page.** The calculator (`.calc-grid`) with fixed columns made the page 19 px too wide at 390 px. Use `minmax(0,1fr)` in `.grid2`/`.calc-grid`.
- Test at 390 px on every page: `document.documentElement.scrollWidth === clientWidth`; to find the culprit, list text nodes whose `Range.getBoundingClientRect().right` passes the container.

- **The nav scrolls sideways on phones, so nothing absolute may live in the scroller.** `overflow-x:auto` also clips Y: the language dropdown was cut off. `Base.astro` splits the bar into `.links` (scrolls) and `.nav-end` (language `<details>` + theme icon, `flex:none`). The event pages' "All events" link was cut off there at 390 px, so since 2026-10-17 it lives at the top of the page content (`src/components/BackLink.astro`), not in the nav.

## Content from outside `src/`

- Event docs live in `events/<Dir>/` (source of truth). `src/content.config.ts` uses `glob({ base: './events', pattern: ['*/*_GUIDE.md', '!_*/**'], generateId })` — the loader accepts a folder outside `src/`, and the `!_*/**` negation skips `events/_template`. The guide's frontmatter is the event card (zod schema); `src/lib/events.ts` builds the registry from it (plus `banner` and `hasPage` via `import.meta.glob`), so a new folder needs no code.
- **Astro 7 uses Sätteri as its markdown processor.** `markdown.rehypePlugins`/`remarkPlugins` fail the build asking for `@astrojs/markdown-remark` (matters if markdown pages come back; the site renders none since 2026-10-17).
- Event art comes in through `import.meta.glob('…/events/SS14_Tartarus/art/*.webp', { eager: true })` → `artSet()` (`src/lib/images.ts`) in `src/sheets/ss14/PlaySheet.astro`; the glob must be a static string. `artSet(id, size)` returns `null` synchronously for missing art (so `A(id) ? <Art …/> : placeholder` works) and otherwise a memoized promise that `<Art>` awaits — only the sizes actually drawn get generated (eager generation of every size tripled `dist/`).
- Page data: `import data from '…/tartarus_data.json'` in the frontmatter and `<script type="application/json" set:html={JSON.stringify(data).replace(/</g,'\\u003c')}>` — the escape keeps `</script>` inside the JSON from closing the tag.

## GitHub Pages

- Internal links always go through `url()` from `src/lib/events.ts` (uses `import.meta.env.BASE_URL`). Check: `BASE_PATH=/repo/ SITE=https://x.github.io pnpm build`, then grep for `href="/` without the prefix.
- In the workflow, `github.event.repository` **does not exist on `schedule` events**: `BASE_PATH` comes from `${GITHUB_REPOSITORY#*/}`.
- A push made with `GITHUB_TOKEN` doesn't trigger another workflow: data refresh and deploy live in the same file (`.github/workflows/deploy.yml`, jobs `update-data` → `build` → `deploy`).
- Pushing files under `.github/workflows/` over **HTTPS with the gh OAuth token** needs the `workflow` scope (`gh auth refresh -s workflow`). This repo's remote is **SSH**, which isn't restricted.

## Delivery on GitHub Pages (measured 2026-10-17)

- **Pages sets the headers, not us:** every file gets `cache-control: max-age=600`, `content-encoding: gzip` (no brotli), no way to add headers. Hashed `/_astro/*` files are revalidated every 10 min like everything else. Workarounds in the build: CSS inlined into each page (`build.inlineStylesheets: 'always'`), and `public/sw.js` (cache-first for `/_astro/`, network-first with a 3 s timeout for pages; registered only in `import.meta.env.PROD`, scope = base). Change the SW strategy → bump `VERSION` in it.
- **robots.txt is useless on a project site** (crawlers only read `https://<user>.github.io/robots.txt`). The sitemap (`src/pages/sitemap.xml.ts`) has to be submitted in Search Console.
- `404.astro` → `dist/404.html`: Pages serves it for any missing path under the project; links inside must use `url()`.
- Baseline → after this setup, Lighthouse mobile on `pnpm preview`: home perf 89 → 100 (FCP 3.0 → 1.1 s; Google Fonts CSS was 2.4 s render-blocking), `/ss14/` perf 90 → 99, a11y 90 → 100, CLS 0.195 → 0.

## Fonts

- **Astro 7 `fonts` config + `<Font cssVariable preload>`** downloads at build time and self-hosts under `/_astro/fonts/`. It defaults to **normal + italic** for every weight: set `styles: ['normal']` (the site has no italics; every `<em>`/`<i>` is `font-style:normal`). List only the subsets a language needs (Barlow has no Cyrillic; IBM Plex Mono does).
- **Google's metadata API no longer lists "Big Shoulders Stencil Display"** (the old css2 URL still serves it; the API offers the successor "Big Shoulders Stencil", opsz axis, different look). The legacy Latin file is in `src/assets/fonts/` through `fontProviders.local()` — one variable file covers 700–800.
- **Metric-matched fallbacks don't stop CLS:** same average width, different line breaks; the late Barlow swap reflowed the play sheet (CLS 0.2). Body + mono use `display: 'optional'` with the critical weights preloaded (400 + 700 Latin); only the heading face keeps `swap`.

## Images

- `<Art img=… />` (`src/components/Art.astro`) always emits `srcset` (1×/2× of the drawn box, `fixed()`) or width-based `srcset` + `sizes` (`fluid()`), intrinsic `width`/`height` and `loading="lazy"`; `eager` adds `fetchpriority="high"` (LCP image only — the home banner). An `<img>` without width/height (the inline `.inl` icons) caused layout shift.
- `fluid()` passes `width` = largest entry so the plain `src` is a srcset file, not a full-size copy.

## Tooling

- `astro build` doesn't type-check; the gate is `pnpm check`. **`astro check` rejects TypeScript 7** ("install TypeScript 6") → `typescript@6`. An endpoint using `node:fs` needs `@types/node`.
- **`astro dev` and `astro preview` run in the background in Astro 7** and return the prompt; stop with `pnpm astro preview stop` / `pnpm astro dev stop` (`status`, `logs`). Before testing a port, `ss -ltn` to see who is listening.
- Playwright (MCP) blocks `file://`: always test through `pnpm preview`.
- `astro preview` reads `astro.config.mjs` at start: to preview the Pages build, start it with the same env (`BASE_PATH=/tli-events/ SITE=https://johnsonmauro.github.io pnpm preview`), or assets 404 under the base.
- Lighthouse without installing: `CHROME_PATH=/usr/bin/google-chrome-stable pnpm dlx lighthouse@<version> <url> --chrome-flags="--headless=new" --form-factor=mobile --output=json` (reports to the scratchpad).
