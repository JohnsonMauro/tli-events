# TLI Events — Torchlight: Infinite event research base

The team's strategy base for Torchlight: Infinite (XD Games) seasonal events, published as an Astro site on GitHub Pages (public repo `JohnsonMauro/tli-events`). **Everything is in English** — the team plays the English client, so mechanic/item names match the game exactly; Chinese terms stay in parentheses where useful.
Exception: the SS14 play sheet (`/ss14/`) is also published in pt-BR, ko, ja, zh and ru for other players — texts in `src/i18n/ss14-play.ts`; game names (instruments, incidents, actions, rarities) stay in English there too.

## Layout

```
events/                       one self-contained folder per event — the workspace's data
  README.md                   method, sources, how to add an event  ← read before researching
  _template/                  skeleton to copy for a new event (skipped by the site)
  SS14_Tartarus/              SS14 event (guide, changelog, data, images, scripts)
src/                          Astro 7 site — publishes only the event list and each event's page
  content.config.ts           `guides` (events/*/*_GUIDE.md, frontmatter = event card)
  events.ts                   event registry from the guides, url()
  layouts/Base.astro          sticky header (brand, back to list, language, theme) + footer
  pages/index.astro           TLI Events home: event list (links only events with a page; card background = events/<Dir>/banner.*)
  pages/ss14/                 SS14 play sheet: index.astro (en) + [lang].astro → components/ss14/PlaySheet.astro
  components/EventInfo.astro  "Method & credits" dialog on every event page (methodology, creator thanks + links, GitHub Discussions)
  project.ts                  repo and Discussions URLs
.github/workflows/deploy.yml  push → build/deploy; every 6h → run events/*/scripts/update_data.py, commit if changed, deploy
```

## Repo skills

| Change touches | Load first |
|---|---|
| `src/`, event pages, `astro.config.mjs`, `.github/workflows/` | `.claude/skills/astro-site` |

## New event

Follow `events/README.md` → "Adding a new event". In short: copy `events/_template`, fill the guide's frontmatter — the card shows up on the list, unlinked until the event has a page at `src/pages/<slug>/index.astro`.
Guide, CHANGELOG and `images/INDEX.md` are the research base in the repo; the site doesn't publish them.

## Rules for this repo

- Research method and source access live in `events/README.md`; event-specific context in `events/<Dir>/CLAUDE.md`.
- Don't invent numbers: no source → write "no data" and list it under Gaps.
- Generated files (`data/*.json`, `*.csv`, snapshots) only via the script — never edit by hand.
- Before calling something done: clean `pnpm build` and `pnpm check`; look at the pages in a browser (`pnpm preview`, which runs in the background — stop it with `pnpm astro preview stop`) and test at 390 px (see the `astro-site` skill).
- CHANGELOG is append-only with absolute dates; automatic and manual entries coexist.
- Research scratch files go to the session scratchpad, not the event folder.
