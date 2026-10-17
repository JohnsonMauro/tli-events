# SS14 Tartarus — strategy base

On the site: `/ss14/` (map), `/ss14/guide/`, `/ss14/changelog/`. Running the site: see the [root README](../README.md).

| File | What it is |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Maintenance context (pipeline, where to make changes, pitfalls). General base in `../CLAUDE.md`. |
| [TARTARUS_GUIDE.md](TARTARUS_GUIDE.md) | Base document: rules, probabilities, strategy, sources, gaps. Becomes `/ss14/guide/`. |
| [CHANGELOG.md](CHANGELOG.md) | What changed and when, during the season. Becomes `/ss14/changelog/`. |
| [instrument_combos.csv](instrument_combos.csv) | Rainbows/run for each instrument and each pair (generated). |
| `data/tartarus_data.json` | Data the map (`src/pages/ss14/index.astro`) reads (generated). |
| `data/snapshots/` | Frozen copy on every change — lets you compare across the season. |
| `images/` | Event images + `INDEX.md` (transcriptions and sources) + `mechanic_data.json`. |
| `scripts/update_data.py` | Updates data/CSV and records the differences in the CHANGELOG. |

## Updating during the season

```bash
python3 -I SS14_Tartarus/scripts/update_data.py --dry-run   # only shows what changed
pnpm data                                                   # writes data/, CSV, snapshot and CHANGELOG
```

On GitHub this runs on its own every 6h (`.github/workflows/deploy.yml`) and commits only when something changed.
After an official patch: read the patch, add a manual entry to the CHANGELOG and adjust `TARTARUS_GUIDE.md`.
