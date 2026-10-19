// English texts of the /ss14/ play sheet, and the shape every other language must match (`Dict`).
// Game names (instruments, incidents, treasures, actions, rarities) stay in English in every language: they are
// what the EN client shows; localized client names are not verified.
// Markup in strings: **key term** → .k (accent), !!warning!! → .no (red), {var} → filled by fmt().
import { PAIR_TEXT, TOOL_TEXT } from '../tool-text';

type IncidentId =
  | 'trickster'
  | 'convict'
  | 'transfer'
  | 'archenemy'
  | 'appetite'
  | 'shared'
  | 'freedom'
  | 'portion'
  | 'ratway'
  | 'hunt'
  | 'crow'
  | 'usurp'
  | 'chain'
  | 'execution';
interface Incident {
  short: string;
  does: string;
  good: string;
  bad: string;
}
type ToolText = Record<keyof typeof TOOL_TEXT, string>;
type PairText = Record<keyof typeof PAIR_TEXT, string>;

export const en = {
  title: 'Tartarus — Play Sheet',
  desc: "SS14 Tartarus: the patterns that win the Warden's Duty, the instrument ranking and when to take each treasure.",
  back: 'All events',
  method: [
    '**Rules:** official patch notes, the in-game rules screen and the official preview VOD — card texts transcribed word for word.',
    '**Numbers:** our own simulator (millions of runs) on the rules above; live odds (door and Replace rarity, offers) from the telemetry players shared through the community board analyzer.',
    "**Real runs:** our own runs, screenshot by screenshot, plus streamers' VODs and Bilibili guides.",
    '**Every claim has a source;** when sources disagree, the in-game text wins and the conflict stays visible.',
    '**Instrument tiers** rank our simulated Rainbows per run with the instrument alone (your first pick); pairs only count instruments seen in ≥3% of live offers.',
  ],
  howToWin: 'How to win',
  step: 'Step',
  runH: 'Your run',
  runHint: 'Mark what this run got — the numbers follow. Nothing marked = any run.',
  runStart: 'Start card',
  runObjective: 'Objective',
  runNone: 'none',
  runAny: 'any',
  eats: 'eats',
  s1t: 'Eat every day you can',
  s1p: 'on a portrait = **it has prey**. Each bite: **+1 tier**, the beast re-rolls; if the new beast has food at the new tier, **it eats again**.',
  s2t: 'Who eats whom',
  s2p: '**Same rarity by default** — these break the rule:',
  exGuillotine: 'Wolf also eats **lower** rarity',
  exMaul: 'Mammoth eats **higher** rarity',
  exCage: "(start card) eats **own rarity or lower**; the beast doesn't re-roll",
  exCrown: 'Lion eats **any beast** of its rarity',
  exSkewer: 'Rat eats **Rat** of its rarity',
  s3t: 'Ultimate + Ultimate prey = Rainbow',
  s3p: "**Protect that prey**: standing on it, **End** — !!never Replace!!. Walk the ring until the eater's cell is offered.",
  s4t: 'Play to your instruments',
  s4p: 'Each instrument changes what a good move is. Look it up in **{pick}**: what it does, its tier and its best partners.',
  s5t: 'Pick the destination',
  s5sub: '3 of the 6 cells ahead are offered — take the highest step',
  l1b: 'Cell that eats',
  l1e: 'any inmate with prey',
  l2b: '“!” incident',
  l2e: 'almost always a free gain',
  l3b: 'Locked door',
  l3e: 'the farthest one',
  l4b: 'Replace',
  l4e: 'Normal/Magic with nothing to eat',
  s5tip: '**Plan 1–2 days ahead** so the cell of your best eater comes into reach.',
  s6t: 'Objective first',
  s6p: 'Each one gives **+1 instrument** and an **Ultimate/Rainbow cache** at the riot. “!” objective → **Instigate** at the office.',
  s7t: 'Last days: bodies = caches',
  s7p: "**Every inmate left becomes a Warden's Cache.** Open doors, take the Ring, !!no Replace or Execution!!.",
  pickH: 'Instrument pick',
  simDate: 'Last simulation: {date}',
  simCta: 'Want to practice, or test a board of your own?',
  simOurs: 'Ours is a helper next to it: our own simulator — {tests} tests, {runs} simulated runs.',
  simHow: 'How it works',
  simDiff:
    'Its numbers differ from ours in places — natural while the game is still being figured out; ours follow the live cards.',
  pickHint: 'Tap the instrument you took at the start.',
  pickSecond: 'Now tap your second one — the list is ranked by its pair with {name}.',
  holding: 'holding:',
  nothing: 'nothing yet',
  perRun: 'Rainbows per run',
  find: 'Search instruments',
  findHint: 'Name or regex, e.g. tongs|maul',
  findCount: 'Showing {n} of {total}',
  findNone: 'No instrument by that name.',
  findHeavy: 'Regex too heavy to run — searching the words instead.',
  remove: 'remove',
  reset: 'Reset',
  resetLabel: 'Reset: clear the start card, objective and instruments',
  resetDone: 'Cleared.',
  tierMeta:
    'Tier = how close the instrument comes to the best one in the list (S = the top); once you hold one, how close the pair comes to the best pair. Hover (or tap) a row for what it does and the best second one. Crown and Maul almost never show up live.',
  doubt:
    'Not fully confirmed in the game yet (cut card or open rule): its value may move. We keep playing to pin it down.',
  doubtNote:
    '= not fully confirmed in the game yet; we keep playing to pin these down. Got a card print or a number? Send it:',
  doubtIssue: 'GitHub issue',
  doubtReddit: 'Reddit thread',
  combo: 'Combo {v}',
  clashV: 'Clash {v}',
  noCombo: 'No combo',
  comboMeta:
    'Once you hold one, each row says what the two do together. Combo / Clash = Rainbows per run the pair gains or loses against the two apart; no combo = each works on its own (the line is what that one does).',
  link: {
    open: '{a} opens extra cells, and {b} pays off on opened cells.',
    full: '{a} brings more inmates onto the block — more for {b} to work with.',
    clear: '{a} takes inmates off the block; {b} pays off on a thin block.',
    twins: '{a} makes identical inmates (same beast and rarity), the ones {b} pays off on.',
    bites: '{a} adds bites, and {b} pays off on every bite.',
    replace: '{a} makes every Replace better, and {b} pays off on Replaces.',
    rats: '{a} breeds Rare Rats; {b} turns Rat bites into big jumps.',
  },
  clashWhy: {
    clear: '{a} takes inmates off the block — the ones {b} needs.',
    full: '{a} fills the block, but {b} pays off on a thin one.',
    overlap: '{a} and {b} both change what a Replace brings: they overlap.',
  },
  tipBtn: 'What does the tier mean?',
  tipH: 'Instrument tiers',
  tipP: "**Rainbows per run** = how many inmates reach **Rainbow** (the top rarity) in one full run, on average, in our simulation, holding the instrument from day 1. The tier says how close it comes to the best one in the list: **S** at least 85% of the best one's gain, **A** 65%, **B** 45%, **C** 25%, **D** any gain, **E** none.",
  tipNote: 'Numbers for the list on screen: instruments alone, or — once you hold one — the pair with it.',
  offered: 'in {p}% of live offers (n={n})',
  card: 'Card',
  withYou: 'With what you hold',
  partners: 'Best second instrument',
  partnersSub: 'Rainbows per run with both',
  rankOf: '#{n} of {total}',
  rankAlone: 'alone',
  rankPair: 'paired with {name}',
  treasureH: "Warden's Treasure",
  gHorn: 'An Ultimate has an Ultimate prey → instant Rainbow (and another treasure). Or many inmates with prey.',
  gRing: 'Thin board (≤3 inmates) or the last days: 3 new inmates = food and caches.',
  gWine: 'Many inmates below Legendary.',
  gBrand: 'Many inmates with no prey but others at their tier.',
  gHornDo: 'Every inmate with a Consumable target eats 1, in random order.',
  gRingDo: 'Opens up to 3 random cells (no other effects).',
  gWineDo: 'Every inmate below Legendary +1 tier.',
  gBrandDo: 'Up to 4 inmates with nothing to eat change beast so they have prey.',
  gWhen: 'Take it:',
  incH: 'Incidents',
  incMeta:
    'Number = Rainbows per run against an average “!”. No skip — the card only has Confirm. Hover or tap for details.',
  does: 'What it does',
  good: 'Good when',
  bad: 'Watch out',
  src: 'Source',
  srcLive: 'card seen live',
  srcVod: 'official VOD card',
  srcSim: 'early reports — card not captured yet',
  startH: 'Start',
  regularTag: 'if nameplates are short',
  regularP: '12 per run. Meat Grinder costs 36 for +50% drops — half the drops per nameplate.',
  compassB: 'Compass',
  compassP: 'Highest you can still clear: Redgold +80% caches › Mercury +30% › Darkiron +10%.',
  ironlawP: 'The run lasts 30 days instead of 20.',
  // Your run: what each start card and objective does (the popover on its chip).
  run: {
    cagefight: "Inmates eat prey of **their own rarity or lower**, and a bite **doesn't re-roll the beast**.",
    tyranny: 'At the office, whatever you pick, you also get **3 Instigates and 3 Bestows**.',
    opulence: "Each Warden's Treasure gives **3 picks** in a row, and a Rainbow a pick makes brings 3 more.",
    king: 'At least 1 inmate reaches **Ultimate**.',
    walk: 'Move **18 tiles**.',
    consume: '**Consume** 4 times.',
    undercurrents: 'Trigger **2 Prison Incidents**.',
    doors: 'Open **10 cells**.',
    goalH: 'Goal',
    rewardH: 'Reward',
    reward: '**+1 instrument** (your pick) and an **Ultimate or Rainbow cache** when the riot starts.',
    bestFirst: 'Best first instruments with it',
  },
  inc: {
    trickster: {
      short: 'The inmate here becomes an Ultimate of the scarcest beast.',
      does: 'The inmate in the current cell becomes an **Ultimate** of the Scarce Code — the beast with the fewest inmates on the board (0 counts; random on a tie).',
      good: 'Almost always: it skips several tiers at once. Best when that new Ultimate will have an Ultimate prey.',
      bad: 'Wasted if the inmate here is already Ultimate.',
    },
    convict: {
      short: 'Opens 1 cell with a Legendary or better inmate.',
      does: 'Opens 1 random locked cell with a **Legendary or better** inmate inside (triggers nothing else).',
      good: 'Always — a free high inmate, food for your Legendary/Ultimate eaters.',
      bad: 'Nothing.',
    },
    transfer: {
      short: 'Copies the inmate here into a locked cell, which opens.',
      does: 'Copies the inmate in the current cell — **same beast and rarity** — into a random locked cell, which **opens** (triggers nothing else).',
      good: 'On a high inmate — the copy is just as high. It also makes a pair of identical inmates.',
      bad: 'On a low inmate the copy is just as low.',
    },
    archenemy: {
      short: 'Opens 1 cell with an inmate the current one can consume.',
      does: 'Opens 1 random locked cell; the inmate inside is **guaranteed to be a Consumable target** for the inmate in the current cell.',
      good: 'Always — a sure meal on the board. Best when the current cell holds your strongest eater.',
      bad: 'The meal follows the current inmate: on a low-rarity cell it is a low-rarity snack.',
    },
    appetite: {
      short: 'Lowest inmate: 5 tries at +1 tier, 50% each.',
      does: 'Picks 1 random inmate among the **lowest rarity** and makes **5 tries at +1 tier**, 50% each (avg +2.5).',
      good: 'Always a gain.',
      bad: 'It lifts your weakest inmate, not your best — rarely makes a Rainbow by itself.',
    },
    shared: {
      short: '+1 tier here per other inmate of the same beast.',
      does: '**+1 tier** to the inmate in the current cell for **each other inmate of the same beast** on the board.',
      good: 'When the board has many of the beast standing here.',
      bad: 'With no other inmate of that beast it gives nothing.',
    },
    freedom: {
      short: 'Opens 3 random cells.',
      does: 'Opens **3 random locked cells** (triggers nothing else).',
      good: 'Thin board or many locked cells — new food and caches.',
      bad: 'Nothing.',
    },
    portion: {
      short: 'Up to 3 random inmates +1.',
      does: 'Raises **up to 3 random inmates** by 1 tier.',
      good: 'Always — free tiers, best on a full board.',
      bad: 'Nothing.',
    },
    ratway: {
      short: 'Jump to any cell — pick the one that eats.',
      does: 'Move to **any cell except the office** and trigger what is there.',
      good: 'Jump to the cell whose inmate can eat — or to the Ultimate eater you protect.',
      bad: 'Nothing.',
    },
    hunt: {
      short: 'Shows which locked cells are below Rare.',
      does: '**Reveals** the rarity of every unopened cell below Rare (does not open them).',
      good: 'Tells you which locked doors hide Rare+ (the unmarked ones).',
      bad: 'Information only.',
    },
    crow: {
      short: 'Reveals 4 locked cells.',
      does: 'Reveals the rarity of 4 locked cells.',
      good: 'Helps pick which door to open.',
      bad: 'Information only.',
    },
    usurp: {
      short: 'A chain: once I fires, your next 3 incidents are II, III and IV — IV raises the whole board.',
      does: 'I: +1 tier to 1 inmate · II: +2 to 1 · III: +2 to 2 · IV: +2 to all. Once I fires, the next incidents you trigger are II, III and IV in turn.',
      good: 'Always — and it scales: IV raises the whole board.',
      bad: 'Nothing.',
    },
    chain: {
      short: 'Next move opens every door on the path — good on an empty board, wasteful on a full one.',
      does: 'On your next move, **opens every unopened cell along the path** (no other effects).',
      good: 'Empty board, long walk ahead: many new inmates at once.',
      bad: 'Full board: it burns doors you would open later with better timing.',
    },
    execution: {
      short: 'Wipes the weaker prey of this inmate, +1 tier each — good early, costs caches late.',
      does: '**Removes every lower-tier inmate** that the current inmate counters; **+1 tier** for each one removed.',
      good: 'Many weak prey of its counter beast and plenty of days left — it can make an Ultimate fast.',
      bad: "Each removed inmate is a Warden's Cache lost at the riot. Avoid it in the last days.",
    },
  } as Record<IncidentId, Incident>,
  tool: TOOL_TEXT as ToolText,
  pair: PAIR_TEXT as PairText,
};
export type Dict = typeof en;
