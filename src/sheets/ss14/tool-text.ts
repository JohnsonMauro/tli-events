// Instruments whose rule is not fully confirmed in the game (cut card, card never seen, or a number
// the card leaves open), so their value may move: the sheet marks them with "!" and asks players for
// prints. Remove an id once a card settles it (images/INDEX.md, engine/README.md → "Open rules").
export const DOUBT: ReadonlySet<string> = new Set([
  'collar', // live card cut: every chain bite, or only after the first?
  'claws', // only the tlidb tooltip; no full card
  'shortchain', // Short-Chained Shackles: no card text seen
  'crown', // Iron Crown: card text never seen
  'maul', // Elephant-Foot Maul: never seen
]);

// One-line English summaries shown next to each instrument's card text (other languages: `tool` in ./i18n.ts).
export const TOOL_TEXT = {
  crown: 'Lions eat any inmate of the same rarity; +2 extra tiers per bite (3 in total).',
  rope: 'Replace never brings Normal/Magic → every Replace is an upgrade.',
  maul: 'Mammoths eat countered prey of higher rarity; rise to 2 tiers above the meal.',
  scapegoat:
    'Replace with ≥2 others on the block: removes 2 at random; the new one comes in above the replaced rarity.',
  coin: 'Each morning, 2+ identical inmates (beast+rarity): 60% to remove one and give another +2.',
  maiden:
    'After a Replace, if as many inmates are above the new one as below → +3 tiers. An empty block always qualifies.',
  shackles: 'Walking ≥4 cells: 40% for +1 tier on a random inmate.',
  blacklist: 'With ≤5 locked cells, each opened door: 2 random inmates +1.',
  muzzle: 'A consume leaving ≤4 inmates on the block: +2 tiers.',
  ravenous: 'Each morning the top inmate removes its 2 ring neighbours; 40% for +1 per removal.',
  revenge: 'After a consume, 30% to open a cell holding a meal for the eater at its new tier.',
  skewer: 'Rats eat Rats of the same rarity; +2 extra tiers per Rat bite (3 in total).',
  hook: 'Opened cells never hold a Normal.',
  saw: 'After a consume, 25% for +1 extra.',
  collar: 'Each bite of a chain: 80% for +1 extra.',
  stake: '−1 destination/day. Replacing an inmate below Legendary: 40% to bring a Legendary.',
  guillotine:
    'Wolves also eat their prey at a lower rarity, then trigger Oppress: −5% upgrade chance per tier of rarity difference.',
  dogtag: 'Door opened on patrol: 25% for that inmate to rise +1.',
  whip: '−1 destination/day. Each bite: 35% for +1 extra.',
  tongs:
    'Each morning a Mammoth gets a Tusk; every Replace there raises 4 inmates, and the Tusk stays until the cell empties. Keep Mammoths, never eat the inmate of a Tusk cell.',
  claws:
    'Each morning Scratch Marks go on a random locked cell (its rarity shows); a Wolf of that rarity eats through the door for +3.',
  trap: "With the warden on a Lion's cell, Hunt joins the day's choices: a Prey mark on an inmate the Lion can eat; both +1 each morning for 3 rounds (ends if either leaves or changes beast).",
  keys: 'Opened door: 80% (card; 63% measured live) to also open both neighbours.',
  cage: 'After an inmate is eaten, 40% for its cell to reopen with a new inmate.',
  scales: 'After a Replace, 80% to reveal the best inmate behind the doors.',
  shortchain: 'Walking ≤3 cells: 50% to open a random cell.',
  fire: 'Opened door: 35% to copy its inmate into a sealed cell, which opens.',
  pestle: 'Replace keeps the beast and only re-rolls rarity.',
  axe: 'A Replace that rolls higher opens 2 random cells.',
  forged: '−1 destination/day. Opened door: 50% to open one more. Loses more than it gains.',
  ironbox: 'Each morning a cell becomes a rat nest (Rare Rat in 2 days). Bad alone; great with Skewer/Coin.',
};

// What a strong pair does together, in English (other languages: `pair` in ./i18n.ts). Keyed by the two ids
// sorted and joined with "+"; a pair with no line here shows each instrument's line instead. The mechanics
// come from the engine's rules (events/SS14_Tartarus/engine/src/rules.rs); "no direct link" = the pair is
// worth about what both solos add up to (pair − (soloA + soloB − base) < 0.5 Rainbow/run at the 2026-10-18 export).
// The same line shows under every start card's list, so keep it true under all of them (no solo verdicts).
export const PAIR_TEXT = {
  'maiden+rope':
    "Every Replace lands Rare or better, and Maiden's +3 on a Rare is already Rainbow: each Replace that meets Maiden's balance (an empty block always does) is a Rainbow.",
  'coin+rope':
    "Noose's Replaces land Rare or Legendary, so twins (same beast and rarity) form high — Coin's +2 on a Legendary twin is a Rainbow.",
  'maiden+scapegoat':
    "Each Replace clears 2 other inmates and comes in above the old rarity; the thinner block meets Maiden's balance more often, for +3.",
  'maiden+stake':
    "Stake turns 40% of Replaces on a sub-Legendary inmate into a Legendary; when Maiden's +3 fires on it too, that's a Rainbow.",
  'blacklist+rope':
    'No direct link: Noose makes every Replace an upgrade; once ≤5 cells are locked, Blacklist raises 2 inmates per door.',
  'coin+ironbox':
    'Iron Box hatches Rare Rats all run long — a steady supply of twins; Coin removes one and gives another +2 (Ultimate).',
  'collar+rope': 'No direct link: Noose upgrades every Replace, Collar adds +1 to most bites.',
  'rope+shackles': 'No direct link: Noose upgrades every Replace, Shackles gives a random +1 on long walks (≥4 cells).',
  'coin+maiden': 'No direct link: Maiden pays on Replaces (+3), Coin on twins each morning (+2).',
  'blacklist+maiden': 'No direct link: Maiden pays on Replaces (+3), Blacklist on every door once ≤5 cells are locked.',
  'collar+maiden': "No direct link: Maiden's +3 comes from Replaces, Collar's +1 from bites — the run uses both.",
  'maiden+shackles': 'No direct link: Maiden pays on Replaces (+3), Shackles on long walks (a random +1).',
  'maiden+ravenous':
    "Little direct link: each morning Ravenous's top inmate clears its 2 neighbours (40% for +1 each); Maiden pays on Replaces (+3).",
  'coin+stake':
    'Stake makes Legendaries out of Replaces; a Legendary twin (same beast) is a Coin target: +2 = Rainbow.',
  'blacklist+keys':
    'Keys opens the neighbours of a door too, so locked cells drop to ≤5 early — from then on every door you open raises 2 inmates.',
  'coin+collar': 'No direct link: Collar adds +1 to most bites, Coin +2 to a twin each morning.',
  'coin+shackles': 'No direct link: Coin +2 to a twin each morning, Shackles a random +1 on long walks.',
  'ravenous+rope':
    "No direct link: Noose upgrades every Replace; each morning Ravenous's top inmate clears its 2 neighbours (40% for +1 each).",
  'collar+shackles': 'No direct link: Collar adds +1 to most bites, Shackles a random +1 on long walks.',
  'coin+keys': "Keys opens the neighbours of a door too: more inmates on the block, more twins for Coin's +2.",
};
