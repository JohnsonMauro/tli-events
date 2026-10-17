# Torchlight: Infinite — seasons

The team's strategy base for Torchlight: Infinite seasonal mechanics: confirmed rules, odds measured live, combos, and what changed during each event. Astro site, published on GitHub Pages.

| Season | Mechanic | Folder |
|---|---|---|
| SS14 Tartarus (塔罗斯的困兽) | Warden's Duty — a 16-cell prison | [SS14_Tartarus/](SS14_Tartarus/) |

## Run it

Needs Node ≥ 22.12, pnpm 12 and Python 3 (stdlib only).

```bash
pnpm install
pnpm dev        # http://localhost:4321 with live reload (Astro 7: runs in the background; `pnpm astro dev stop`)
pnpm build      # writes dist/
pnpm preview    # serves dist/ (background; stop with `pnpm astro preview stop`)
pnpm check      # type-check
pnpm data       # refresh SS14 data (simulator + live telemetry)
```

## Structure

```
src/                  site (layout, pages, map script)
  pages/ss14/         map (index.astro), guide/changelog/images ([doc].astro), CSV
SS14_Tartarus/        season source of truth: .md docs, data/, images/, scripts/
.github/workflows/    build + deploy to Pages; data refresh every 6h
```

The season's `.md` files are rendered by the site straight from their folder; links between them (`CHANGELOG.md`, …) are rewritten to site routes.

## Publishing

`.github/workflows/deploy.yml`: push to `main` → build and deploy. Scheduled (6h) or manual → runs `update_data.py`, commits if anything changed, deploys.
Needs GitHub Pages with source "GitHub Actions" (Settings → Pages). Pages on a private repo requires a paid plan.

Community research; not affiliated with XD Games. Sources are listed in each season's guide.
