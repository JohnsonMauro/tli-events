# scripts/ — data update contract

Optional. Add `update_data.py` only when the event has a source worth polling during the season (a fan simulator, telemetry, a wiki API). Model: `events/SS14_Tartarus/scripts/update_data.py`.

The workflow (`.github/workflows/deploy.yml`) and `pnpm data` run every `events/*/scripts/update_data.py` every 6 hours, so the script must:

- Use the Python standard library only; run as `python3 -I scripts/update_data.py [--dry-run]`.
- Download sources as **text** and parse them — never execute downloaded code.
- Write `data/<event>_data.json` (what the site reads) and any generated CSV at the event root.
- Freeze a copy in `data/snapshots/` **only when something changed**, named `<stamp>_<source-version>.json`.
- Append an "(automatic)" entry to `CHANGELOG.md` listing what changed; print nothing else to the changelog.
- With `--dry-run`, only print the diff.
- Exit non-zero on a parsing failure (so the scheduled run shows red instead of committing broken data); treat optional sources as warnings.
