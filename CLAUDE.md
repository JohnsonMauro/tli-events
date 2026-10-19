# TLI Events — Torchlight: Infinite event research base

The team's strategy base for Torchlight: Infinite (XD Games) seasonal events, published as an Astro site on GitHub Pages (public repo `JohnsonMauro/tli-events`). **Everything is in English** — the team plays the English client, so mechanic/item names match the game exactly; Chinese terms stay in parentheses where useful.
Exception: the site itself is published in pt-BR, es, de, fr, pl, sv, ko, ja, zh, ru and vi for other players — the home page at `/<lang>/` (`src/components/home.i18n.ts`, each card's text in its guide's frontmatter `i18n`), the 404 (rewritten in the browser), and the SS14 play sheet at `/ss14/<lang>/` (`src/sheets/ss14/i18n/`). Pages with translations offer the reader's browser language once (`src/lib/lang-offer.ts`). Game names (instruments, incidents, actions, rarities) stay in English everywhere.

**Supreme law: accessibility.** The site serves the public, so accessibility outranks every other call — looks, brevity, convenience, deadlines (owner, 2026-10-18). WCAG 2.2 AA is the floor, not the goal: anything a reader can't perceive, operate or understand is a bug, whatever the tests say. Each translation reads as a native speaker would write it (generic words in the reader's language; only what the EN client shows stays in English).

**Product principle:** players have little time between runs, so a play sheet **synthesizes**: short text, patterns over prose, one screen where possible. The numbers come from our own simulator (SS14: `events/SS14_Tartarus/engine`), never from a community one (owner's call, 2026-10-17: the community Tartarus Simulator's rules lag the live cards and its board reader misses incidents on open cells).

## Layout

```
events/                       one self-contained folder per event — the workspace's data
  README.md                   method, sources, how to add an event  ← read before researching
  _template/                  skeleton to copy for a new event (skipped by the site)
  SS14_Tartarus/              SS14 event (guide, changelog, data, images, scripts)
e2e/                          Playwright checks on the built site (playwright.config.ts; `pnpm test:e2e`)
src/                          Astro 7 site — publishes the event list and each event's play sheet
  content.config.ts           `guides` (events/*/*_GUIDE.md, frontmatter = event card)
  lib/                        site-wide modules, no markup
    events.ts                 event registry from the guides (banner, hasPage), url(), eventUrl(), eventLangs()
    i18n.ts                   LANGS, Lang, fmt(), rich() — shared by every sheet
    images.ts                 fixed()/fluid()/artSet(): WebP + srcset + intrinsic size
    project.ts                repo and Discussions URLs
    build.ts                  BUILD_ID (git HEAD) → <meta name="tli-build"> on every page
    update-check.ts           "new version" toast: compares that meta with the live page's
    lang-offer.ts             offers the translation the browser asks for (never redirects; asked once)
  layouts/Base.astro          head (fonts, canonical, hreflang, OG, manifest, SW) + sticky header + footer
  components/                 Art (optimized <img>), BackLink (top of an event page's content), EventInfo ("Method & credits" dialog), Flag, HomePage (the event list in one language) + home.i18n.ts (its texts and the 404's)
  sheets/<slug>/              one play sheet per event, colocated: PlaySheet.astro, i18n/ (one file per language), play.ts (client), play.css
  pages/                      index + [lang]/index (event list → components/HomePage), 404, sitemap.xml, manifest.webmanifest, <slug>/index + [lang] → sheets/<slug>
  assets/fonts/               self-hosted font files not on Google's API (astro.config.mjs `fonts`)
public/sw.js                  service worker: /_astro/* cache-first, pages network-first revalidated with `no-cache` (works around Pages' 10-min cache)
.github/workflows/deploy.yml  push → lint (eslint, prettier, astro check) → build/deploy; every 6h → run events/*/scripts/update_data.py, commit if changed, deploy
```

## Repo skills

| Change touches | Load first |
|---|---|
| `src/`, event pages, `astro.config.mjs`, `.github/workflows/` | `.claude/skills/astro-site` |

## New event

Follow `events/README.md` → "Adding a new event". In short: copy `events/_template`, fill the guide's frontmatter — the card shows up on the list, unlinked until the event has a page at `src/pages/<slug>/index.astro`.
Guide, CHANGELOG and `images/INDEX.md` are the research base in the repo; the site doesn't publish them.

## Releases

The site follows [SemVer](https://semver.org/spec/v2.0.0.html). The version lives in `package.json` (`version`) and equals the git tag `vX.Y.Z`; history in `CHANGELOG.md` ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/)). The version is not shown on the site (owner's call), and there are no GitHub Releases: tag + changelog are the record.

- **Every change a player can see adds a line under `## [Unreleased]` in the same commit**, written as the effect for the player, not the diff.
- **Two changelogs, two jobs:** `events/<Dir>/CHANGELOG.md` is the research log of the game (patches, odds, data, dated, append-only); the root `CHANGELOG.md` records what the site changed. A game patch that changes what a page says goes in both: the facts in the event log, the page change here (naming the patch).
- **Bump by what a player notices:**

| Bump | When |
|---|---|
| MAJOR | links break or content goes away: URL/route changes, a page or language removed |
| MINOR | something new: an event page, a language, a section or tool, the site updated for a game patch (new or changed instruments, incidents, rules) |
| PATCH | corrections: texts and numbers, art for items already listed, layout and behavior fixes, dependency updates |
| none | the 6-hourly data refresh (`chore(data)`), docs, tooling, refactors with no visible change |

- **Cutting a release:** move `Unreleased` into `## [X.Y.Z] - YYYY-MM-DD`, update the compare links at the bottom, bump `package.json`, commit `chore(release): vX.Y.Z`. Creating and pushing the tag `vX.Y.Z` only when the owner says so.

## Rules for this repo

- Research method and source access live in `events/README.md`; event-specific context in `events/<Dir>/CLAUDE.md`.
- Don't invent numbers: no source → write "no data" and list it under Gaps.
- Generated files (`data/*.json`, `*.csv`, snapshots) only via the script — never edit by hand.
- Code style is enforced, not described: ESLint (`eslint.config.js`) and Prettier (`prettier.config.js`) run on staged files in the pre-commit hook (husky + lint-staged, plus `astro check`, plus `pnpm test:e2e` when the commit touches the site); `pnpm install` activates the hook. Never skip it with `--no-verify`.
- Before calling something done: `pnpm check`, `pnpm lint`, `pnpm format:check` and `pnpm test:e2e` (builds, then Playwright on every page at 390 and 1440 px: no sideways scroll, no console errors, no glued words, axe (WCAG 2.x A/AA) in light and dark — the SS14 sheet also with its folds and cards open —, the SS14 sheet's interactive parts — `e2e/`). A new interactive behavior gets its test in `e2e/` in the same change. Don't open a browser to re-check what the tests cover; the owner judges the look. Open one only to debug a failing test or when asked.
- CHANGELOG is append-only with absolute dates; automatic and manual entries coexist.
- Research scratch files go to the session scratchpad, not the event folder.
