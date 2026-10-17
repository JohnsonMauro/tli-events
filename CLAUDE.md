# TLI Events — Torchlight: Infinite event research base

The team's strategy base for Torchlight: Infinite (XD Games) seasonal events, published as an Astro site on GitHub Pages (public repo `JohnsonMauro/tli-events`). **Everything is in English** — the team plays the English client, so mechanic/item names match the game exactly; Chinese terms stay in parentheses where useful.
Exception: the SS14 play sheet (`/ss14/`) is also published in pt-BR, de, ko, ja, zh and ru for other players — texts in `src/sheets/ss14/i18n.ts`; game names (instruments, incidents, actions, rarities) stay in English there too.

**Product principle:** players have little time between runs, so a play sheet **synthesizes**: short text, patterns over prose, one screen where possible. Anything that needs testing or deep detail links out to the community simulator ([Tartarus Simulator](https://blahdot3h.github.io/tartarus-simulator/) by CoffeeBns for SS14) instead of being explained on the page.

## Layout

```
events/                       one self-contained folder per event — the workspace's data
  README.md                   method, sources, how to add an event  ← read before researching
  _template/                  skeleton to copy for a new event (skipped by the site)
  SS14_Tartarus/              SS14 event (guide, changelog, data, images, scripts)
src/                          Astro 7 site — publishes the event list and each event's play sheet
  content.config.ts           `guides` (events/*/*_GUIDE.md, frontmatter = event card)
  lib/                        site-wide modules, no markup
    events.ts                 event registry from the guides (banner, hasPage), url(), eventUrl(), eventLangs()
    i18n.ts                   LANGS, Lang, fmt(), rich() — shared by every sheet
    images.ts                 fixed()/fluid()/artSet(): WebP + srcset + intrinsic size
    project.ts                repo and Discussions URLs
  layouts/Base.astro          head (fonts, canonical, hreflang, OG, manifest, SW) + sticky header + footer
  components/                 Art (optimized <img>), BackLink (top of an event page's content), EventInfo ("Method & credits" dialog), Flag
  sheets/<slug>/              one play sheet per event, colocated: PlaySheet.astro, i18n.ts, play.ts (client), play.css
  pages/                      index (event list), 404, sitemap.xml, manifest.webmanifest, <slug>/index + [lang] → sheets/<slug>
  assets/fonts/               self-hosted font files not on Google's API (astro.config.mjs `fonts`)
public/sw.js                  service worker: /_astro/* cache-first, pages network-first (works around Pages' 10-min cache)
.github/workflows/deploy.yml  push → build/deploy; every 6h → run events/*/scripts/update_data.py, commit if changed, deploy
```

## Repo skills

| Change touches | Load first |
|---|---|
| `src/`, event pages, `astro.config.mjs`, `.github/workflows/` | `.claude/skills/astro-site` |

## New event

Follow `events/README.md` → "Adding a new event". In short: copy `events/_template`, fill the guide's frontmatter — the card shows up on the list, unlinked until the event has a page at `src/pages/<slug>/index.astro`.
Guide, CHANGELOG and `images/INDEX.md` are the research base in the repo; the site doesn't publish them.

## Releases

The site follows [SemVer](https://semver.org/spec/v2.0.0.html). The version lives in `package.json` (`version`), equals the git tag `vX.Y.Z` and shows in the footer, linked to `CHANGELOG.md` ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/)).

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
- Code style is enforced, not described: ESLint (`eslint.config.js`) and Prettier (`prettier.config.js`) run on staged files in the pre-commit hook (husky + lint-staged, plus `astro check`); `pnpm install` activates the hook. Never skip it with `--no-verify`.
- Before calling something done: clean `pnpm build`, `pnpm check`, `pnpm lint` and `pnpm format:check`; look at the pages in a browser (`pnpm preview`, which runs in the background — stop it with `pnpm astro preview stop`) and test at 390 px (see the `astro-site` skill).
- CHANGELOG is append-only with absolute dates; automatic and manual entries coexist.
- Research scratch files go to the session scratchpad, not the event folder.
