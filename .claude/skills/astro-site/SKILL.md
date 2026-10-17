---
name: astro-site
description: Verified pitfalls of this repo's Astro 7 site (Torchlight: Infinite seasons) — whitespace between inline elements vanishing in the build, mobile overflow, event data and art from outside src/, GitHub Pages base path, astro check and background servers. Use when touching src/, season pages or the deploy workflow.
---

# Astro site — pitfalls verified in this repo

Dated: Astro 7.4.0, pnpm 12, Oct 2026. Original template: `stacks/astro/skills/astro-static-site` in global-context (adapted copy).

## Markup

- **A line break between inline elements disappears** (`compressHTML: 'jsx'`). `<span class="n">02</span>Flow` rendered "02Flow"; the badge legend glued "Steam" to "LIVE". Use `{" "}` where words form a sentence. Check: build, then grep `dist/` for text glued to `<span|b|a|code>`.
- An HTML comment `<!-- -->` ships to the page; in templates use `{/* */}`.

## Mobile layout

- **A grid item with `min-width: auto` widens the page.** The calculator (`.calc-grid`) with fixed columns made the page 19 px too wide at 390 px. Use `minmax(0,1fr)` in `.grid2`/`.calc-grid`.
- Test at 390 px on every page: `document.documentElement.scrollWidth === clientWidth`; to find the culprit, list text nodes whose `Range.getBoundingClientRect().right` passes the container.

- **The nav scrolls sideways on phones, so nothing absolute may live in the scroller.** `overflow-x:auto` also clips Y: the language dropdown was cut off. `Base.astro` splits the bar into `.links` (scrolls) and `.nav-end` (language `<details>` + theme icon, `flex:none`).

## Content from outside `src/`

- Event docs live in `events/<Dir>/` (source of truth). `src/content.config.ts` uses `glob({ base: './events', pattern: ['*/*_GUIDE.md', '!_*/**'], generateId })` — the loader accepts a folder outside `src/`, and the `!_*/**` negation skips `events/_template`. The guide's frontmatter is the event card (zod schema); `src/events.ts` builds the registry from it, so a new folder needs no code.
- **Astro 7 uses Sätteri as its markdown processor.** `markdown.rehypePlugins`/`remarkPlugins` fail the build asking for `@astrojs/markdown-remark` (matters if markdown pages come back; the site renders none since 2026-10-17).
- Event art comes in through `import.meta.glob('…/events/SS14_Tartarus/art/*.webp', { eager: true })` + `getImage` from `astro:assets` (optimized to WebP) in `src/components/ss14/PlaySheet.astro`; the glob must be a static string.
- Page data: `import data from '…/tartarus_data.json'` in the frontmatter and `<script type="application/json" set:html={JSON.stringify(data).replace(/</g,'\\u003c')}>` — the escape keeps `</script>` inside the JSON from closing the tag.

## GitHub Pages

- Internal links always go through `url()` from `src/events.ts` (uses `import.meta.env.BASE_URL`). Check: `BASE_PATH=/repo/ SITE=https://x.github.io pnpm build`, then grep for `href="/` without the prefix.
- In the workflow, `github.event.repository` **does not exist on `schedule` events**: `BASE_PATH` comes from `${GITHUB_REPOSITORY#*/}`.
- A push made with `GITHUB_TOKEN` doesn't trigger another workflow: data refresh and deploy live in the same file (`.github/workflows/deploy.yml`, jobs `update-data` → `build` → `deploy`).
- Pushing files under `.github/workflows/` over **HTTPS with the gh OAuth token** needs the `workflow` scope (`gh auth refresh -s workflow`). This repo's remote is **SSH**, which isn't restricted.

## Tooling

- `astro build` doesn't type-check; the gate is `pnpm check`. **`astro check` rejects TypeScript 7** ("install TypeScript 6") → `typescript@6`. An endpoint using `node:fs` needs `@types/node`.
- **`astro dev` and `astro preview` run in the background in Astro 7** and return the prompt; stop with `pnpm astro preview stop` / `pnpm astro dev stop` (`status`, `logs`). Before testing a port, `ss -ltn` to see who is listening.
- Playwright (MCP) blocks `file://`: always test through `pnpm preview`.
