# Changelog

Releases of the TLI Events site, newest first. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as defined in `CLAUDE.md` → "Releases".
What changed in the game itself (patches, odds, data) is logged per event in `events/<Dir>/CHANGELOG.md`.

## [Unreleased]

### Fixed

- SS14 play sheet: Raging Beast's Agonizing Muzzle gives its +2 when **4 or fewer** inmates are left after the meal (the live card), not 3 — every number and pair with it is recalculated; with Cage Fight it is now the best first instrument.
- SS14 play sheet: Agonizing Muzzle, Burning Stake, Crowded Beastcage, Avenger's Casket and Searing Branding Iron lose the "!" (not confirmed): their full cards are read now, and match the sheet. The Branding Iron's line adds that the cell with the copy opens. Fanged Guillotine loses it too: the game never prints Oppress's base chance, and the sheet keeps reading it as 100% (−5% per tier of gap).

## [1.6.0] - 2026-10-18

### Added

- SS14 play sheet in **French** (`/ss14/fr/`), with the "Method & credits" dialog and the "new version" notice.
- Language switcher: English now shows the Anglosphere flag (Union Jack, US stripes, Canada's maple leaf) — English for every English-speaking player, not one country.
- SS14 play sheet: in **Your run**, each start card and objective opens a card (hover or tap) — what the start card does and the 3 best first instruments with it (with their tiers); the objective's goal and reward. Tyranny is marked "!" (no print of its card yet).

### Changed

- The footer ("made with ♥") in each page's language.
- SS14 play sheet: an instrument's card reads the way you pick — its own rank first (a big tier badge and its place, e.g. "#5 of 31", for your first instrument), then **Best second instrument**, each partner with its own tier.
- SS14 play sheet: no more "× no instrument" anywhere (every run holds an instrument, so that comparison never happens in the game). Tiers keep their order; pairs show **Rainbows per run** with both, now defined in the tier explanation (ⓘ): how many inmates reach Rainbow, the top rarity, in a full run, on average, in our simulation.

## [1.5.0] - 2026-10-17

### Added

- Every page: a "new version" notice with a Reload button when the page you have open (or got from a cache) is older than the one online.

### Fixed

- Every page: after an update, opening the site shows the new version right away; before, the browser could keep the old copy for up to 10 minutes.

## [1.4.0] - 2026-10-17

### Added

- SS14 play sheet: the left column folds — "Your run", "How to win" and "Strong pairs" open and close on their heading (pairs start closed), and the page remembers your choice in this browser. Each pair's numbers sit under its two pictures.
- SS14 play sheet: "Strong pairs" follows the start card marked in "Your run" — Cage Fight, Iron Law and Tyranny each show their own top 20 (pairs we haven't explained yet show each instrument's line).

### Changed

- SS14 play sheet: the link to CoffeeBns' Tartarus Simulator is back, at the top of the instrument ranking, with a note: its numbers differ from ours in places — natural while the game is still being figured out; ours follow the live cards.
- SS14 play sheet: the lowest tier shows only its metric (<1×), without "worse than none" — a run always gets its instruments.
- SS14 play sheet: "Strong pairs that show up" lists the top 20 pairs from our simulator (was 6), each with one line on what the two do together — whether they really combine or just add up; the notes now sit above the list.
- SS14 play sheet: "Last simulation" shows the date and time in your own time zone (it used to show the UTC date, a day ahead for part of the world).

## [1.3.0] - 2026-10-17

### Added

- SS14 play sheet: **Your run** at the top of "How to win" — mark the start card (Cage Fight, Iron Law, Tyranny; they come from Viktor, a map boss) and the objective, and the instrument ranking re-sorts for them. Mode and Compass notes moved there from the right column.
- SS14 play sheet: the date of the last simulation above the instrument ranking.
- SS14 play sheet: the **Extra Portion** incident (up to 3 random inmates +1), seen on the live client.
- SS14 play sheet: game art for Cage Fight, and a summary for Filthy Claws.

### Changed

- SS14 play sheet: **every number now comes from our own simulator**, which follows the live cards (incidents refill, Extra Portion, Oppress, Skewer +2, Maiden after a Replace, the Tusk staying, and more) — the tiers, pairs and recommendations change accordingly.
- SS14 play sheet: "!" now marks instruments whose rule isn't fully confirmed in the game yet (cut or unseen card).
- SS14 play sheet: the instrument pick stops at 2 held instruments, the most a run gives (1 at the start, 1 from the objective).
- SS14 play sheet: each Warden's Treasure shows what it does (from the live cards) next to when to take it.
- SS14 play sheet: step 4 points to the instrument ranking instead of naming three instruments; the pick's instructions, what you hold and the tier note stand out.
- SS14 play sheet: Agonizing Muzzle reads ≤3 inmates and Barbed Collar every chain bite, as their cards say.

### Removed

- SS14 play sheet: the link to the community Tartarus Simulator — its rules and numbers lag the live game.

### Fixed

- SS14 play sheet: Severed Iron Maiden is no longer marked "!" — its full live card confirms it fires after a Replace, as the sheet already said.

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

[Unreleased]: https://github.com/JohnsonMauro/tli-events/compare/v1.6.0...HEAD
[1.6.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/JohnsonMauro/tli-events/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/JohnsonMauro/tli-events/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/JohnsonMauro/tli-events/releases/tag/v1.0.0
