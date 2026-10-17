---
name: astro-site
description: Verified pitfalls of this repo's Astro 7 site (Torchlight: Infinite seasons) — whitespace between inline elements vanishing in the build, mobile overflow, markdown from outside src/, rewriting links inside the .md docs, season images, GitHub Pages base path, astro check and background servers. Use when touching src/, season pages or the deploy workflow.
---

# Astro site — pitfalls verified in this repo

Dated: Astro 7.4.0, pnpm 12, Oct 2026. Original template: `stacks/astro/skills/astro-static-site` in global-context (adapted copy).

## Markup

- **A line break between inline elements disappears** (`compressHTML: 'jsx'`). `<span class="n">02</span>Flow` rendered "02Flow"; the badge legend glued "Steam" to "LIVE". Use `{" "}` where words form a sentence. Check: build, then grep `dist/` for text glued to `<span|b|a|code>`.
- An HTML comment `<!-- -->` ships to the page; in templates use `{/* */}`.

## Mobile layout

- **A grid item with `min-width: auto` widens the page.** The calculator (`.calc-grid`) with fixed columns made the page 19 px too wide at 390 px. Use `minmax(0,1fr)` in `.grid2`/`.calc-grid`.
- **Long filenames/URLs in `.prose`** (headings in `images/INDEX.md`, guide sources) overflow: `.prose{overflow-wrap:anywhere}`.
- Test at 390 px on every page: `document.documentElement.scrollWidth === clientWidth`; to find the culprit, list text nodes whose `Range.getBoundingClientRect().right` passes the container.

## Content from outside `src/`

- Season docs live in `SS*_*/` (source of truth). `src/content.config.ts` uses `glob({ base: '.', pattern: [...], generateId })` — the loader accepts the repo root as base; ids become `SS14_Tartarus/CHANGELOG`.
- **Astro 7 uses Sätteri as its markdown processor.** `markdown.rehypePlugins`/`remarkPlugins` fail the build asking for `@astrojs/markdown-remark`. Here link rewriting (`CHANGELOG.md` → `/ss14/changelog/`) runs on `entry.rendered.html` via `rewriteDocLinks` (`src/seasons-routes.mjs`) and goes in with `set:html`.
- Images from `SS*_*/images/` come in through `import.meta.glob(..., { eager: true })` + `<Image>`/`getImage` from `astro:assets` (optimized to WebP). The gallery uses `loading="lazy"`: a full-page screenshot shows empty frames — prove loading with `img.complete && naturalWidth > 0` after scrolling.
- Map data: `import data from '…/tartarus_data.json'` in the frontmatter and `<script type="application/json" set:html={JSON.stringify(data).replace(/</g,'\\u003c')}>` — the escape keeps `</script>` inside the JSON from closing the tag.

## GitHub Pages

- Internal links always go through `url()` from `src/seasons.ts` (uses `import.meta.env.BASE_URL`). Check: `BASE_PATH=/repo/ SITE=https://x.github.io pnpm build`, then grep for `href="/` without the prefix.
- In the workflow, `github.event.repository` **does not exist on `schedule` events**: `BASE_PATH` comes from `${GITHUB_REPOSITORY#*/}`.
- A push made with `GITHUB_TOKEN` doesn't trigger another workflow: data refresh and deploy live in the same file (`.github/workflows/deploy.yml`, jobs `update-data` → `build` → `deploy`).
- Pushing files under `.github/workflows/` needs a token with the `workflow` scope (`gh auth refresh -s workflow`).

## Tooling

- `astro build` doesn't type-check; the gate is `pnpm check`. **`astro check` rejects TypeScript 7** ("install TypeScript 6") → `typescript@6`. An endpoint using `node:fs` needs `@types/node`.
- **`astro dev` and `astro preview` run in the background in Astro 7** and return the prompt; stop with `pnpm astro preview stop` / `pnpm astro dev stop` (`status`, `logs`). Before testing a port, `ss -ltn` to see who is listening.
- Playwright (MCP) blocks `file://`: always test through `pnpm preview`.
