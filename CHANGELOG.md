# Changelog

Releases of the TLI Events site, newest first. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as defined in `CLAUDE.md` → "Releases".
What changed in the game itself (patches, odds, data) is logged per event in `events/<Dir>/CHANGELOG.md`.

## [Unreleased]

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

[Unreleased]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/JohnsonMauro/tli-events/releases/tag/v1.0.0
