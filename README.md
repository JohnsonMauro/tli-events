# Torchlight: Infinite — events

The team's strategy base for Torchlight: Infinite seasonal events: confirmed rules, odds measured live, combos, and what changed during each event. Astro site, published on GitHub Pages.

| Event | Mechanic | Folder |
|---|---|---|
| SS14 Tartarus (塔罗斯的困兽) | Warden's Duty — a 16-cell prison | [events/SS14_Tartarus/](events/SS14_Tartarus/) |

New event? Copy [`events/_template`](events/_template/) — see [events/README.md](events/README.md) for the method and the steps. The list reads each event's card from its guide's frontmatter; an event is linked once it has a page in `src/pages/<slug>/`.

## Run it

Needs Node ≥ 22.12, pnpm 12 and Python 3 (stdlib only).

```bash
pnpm install
pnpm dev        # http://localhost:4321 with live reload (Astro 7: runs in the background; `pnpm astro dev stop`)
pnpm build      # writes dist/
pnpm preview    # serves dist/ (background; stop with `pnpm astro preview stop`)
pnpm check      # type-check
pnpm data       # run every events/*/scripts/update_data.py
```

## Structure

```
events/               one self-contained folder per event (+ _template, README with the method)
src/                  site: event list + one page per event (SS14 play sheet in 6 languages)
.github/workflows/    build + deploy to Pages; data refresh every 6h
```

## Publishing

`.github/workflows/deploy.yml`: push to `main` → build and deploy. Scheduled (6h) or manual → runs the update scripts, commits if anything changed, deploys.
Needs GitHub Pages with source "GitHub Actions" (Settings → Pages).

Community research; not affiliated with XD Games. Sources are listed in each event's guide (in this repo).
