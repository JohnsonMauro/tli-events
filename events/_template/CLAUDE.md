# SSNN Name — maintenance context

Season of YYYY-MM-DD. Mechanic: <one paragraph>. See `<MECHANIC>_GUIDE.md` (base) and `CHANGELOG.md` (changes). Methodology: `../README.md`.

## Data pipeline

`scripts/update_data.py` (only if the event has a data source worth automating — see `scripts/README.md`):
- Source(s): …
- Writes: `data/<event>_data.json`, snapshots in `data/snapshots/` only when something changed, automatic CHANGELOG entry.

## Site

- Default: the generic overview page (`src/pages/[slug]/index.astro`) + guide/changelog/images routes. No code needed.
- Custom interactive page (optional): `src/pages/<slug>/index.astro` + `src/scripts/<slug>-map.js` (see SS14 for the pattern).

## Hard-won facts

- …

## When updating

1. `pnpm data` (if there is a script).
2. New official patch: read it, add a manual CHANGELOG entry, adjust the guide.
3. A conclusion changed → fix the guide and log the correction in the CHANGELOG.
