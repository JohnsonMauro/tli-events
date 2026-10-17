# Changelog

Releases of the TLI Events site, newest first. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as defined in `CLAUDE.md` → "Releases".
What changed in the game itself (patches, odds, data) is logged per event in `events/<Dir>/CHANGELOG.md`.

## [Unreleased]

## [1.2.0] - 2026-10-17

### Added

- SS14 play sheet: a **"!"** marks instruments whose sources disagree (card, simulator, our tests), so their tier may be off — Severed Iron Maiden, Barbed Collar, Agonizing Muzzle, Fanged Guillotine, Skewered Rat Heads, Iron Tongs, Blood-Stained Trap, Filthy Claws, Executioner's Blacklist and Avenger's Casket. Its info says we keep playing to pin them down, and a note under the ranking asks for card prints or numbers through a GitHub issue or the Reddit thread.
- SS14 play sheet: game art for Ferocious Beast's Ravenous Chains and Blood-Stained Trap (they showed a "?"), and a summary for Blood-Stained Trap (Hunt and the Prey mark), from their live cards.

### Fixed

- SS14 play sheet: Fanged Guillotine explains **Oppress** — eating lower-rarity prey has a 5% lower upgrade chance per tier of rarity difference (the simulator still counts a sure +1).
- SS14 play sheet: Iron Tongs says the **Tusk stays** through Replaces until its cell empties, and how to play it (keep Mammoths, never eat the inmate of a Tusk cell); its tier is marked as low, since the simulator doesn't farm Tusks (tip from content creator ALannister).

## [1.1.2] - 2026-10-17

### Fixed

- SS14 play sheet: Skewered Rat Heads gives **+2** extra tiers per Rat bite, as the live card says (it said +1, from the simulator); its tier is marked as underestimated.
- SS14 play sheet: Fanged Guillotine now says the Wolf triggers **Oppress** after eating lower-rarity prey, as the live card does (the simulator leaves it out; what Oppress does is not known yet).

### Changed

- SS14 play sheet: sharper Skewered Rat Heads art, from the live client instead of the preview video.
- SS14 play sheet: instruments show their full card name, including the beast they work for (e.g. "Fanged Guillotine: Alpha Wolf").

## [1.1.1] - 2026-10-17

### Added

- SS14 play sheet: game art for Executioner's Blacklist (it showed a "?").

## [1.1.0] - 2026-10-17

### Added

- SS14 play sheet: the Archenemy incident (seen live, not in the simulator), with its card art and when to take it.
- SS14 play sheet: game art for Iron Crown of the Prison King (it showed a "?").

## [1.0.3] - 2026-10-17

### Added

- SS14 play sheet: game art for Scapegoat's Guillotine (it showed a "?").

### Changed

- SS14 play sheet: sharper Iron Pestle art, from the live client instead of the preview video.

## [1.0.2] - 2026-10-17

### Added

- SS14 play sheet: game art for Severed Iron Maiden (it showed a "?").

### Changed

- SS14 play sheet: sharper Barbed Whip art, from the live client instead of the preview video.

## [1.0.1] - 2026-10-17

### Fixed

- SS14 play sheet, "Who eats whom": rows with three portraits no longer spill out of their card on phones around 412–600 px wide and in German on desktop; the portraits shrink a little instead.
- The "Method & credits" dialog no longer picks up spacing meant for the "Who eats whom" grid.

### Removed

- The version number in the footer.

## [1.0.0] - 2026-10-17

First versioned release: the site as it stands when versioning started. Earlier steps (2026-10-16 → 2026-10-17) are in the git history.

### Added

- Event list with one card per season event; SS14 Tartarus is the first.
- SS14 Tartarus play sheet: how to win (rule patterns), instrument pick with tiers and the best of the 3 offered given what you hold, strong pairs, Warden's Treasure, incidents and start choices.
- The play sheet in English, Português (Brasil), Deutsch, 한국어, 日本語, 简体中文 and Русский.
- Game art for instruments, incidents, treasures and the board, cut from the live client and the official preview.
- Info popover on each tier explaining "≥2.6×" (Rainbows per run compared with no instrument).
- Link to CoffeeBns' Tartarus Simulator for practice.
- Season numbers refreshed every 6 hours from the simulator and live telemetry.
- Works offline after the first visit.

[Unreleased]: https://github.com/JohnsonMauro/tli-events/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/JohnsonMauro/tli-events/releases/tag/v1.0.0
