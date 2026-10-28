// English texts of the /ss11/ play sheet (Vorax), and the shape every other language must match (`Dict`).
// Game names (Vorax Substance, Surgical Preparation, instruments, compasses, vials, organs) stay in English in every
// language: they are what the EN client shows. Markup: **key term** → .k (accent), !!warning!! → .no (red),
// {var} → a number the page formats for the language (./../PlaySheet.astro).

export const en = {
  title: 'Vorax — Play Sheet',
  desc: 'Vorax as it runs in SS14: how Surgical Preparation scores, the first instrument to take, the vial thresholds, which compass pays and how Grafting works.',
  back: 'All events',
  h1: 'Vorax',
  lead: 'Came with **SS11** (January 2026) and is still in the game. Rules from the SS11 research; farm and strategy for **SS14 Tartarus**.',
  tags: { o: 'in-game', p: 'players', c: 'claim' },
  tagsH: 'Where each line comes from',

  loopH: 'How Vorax works',
  steps: [
    {
      h: 'Collect',
      p: 'Kill the crimson **Vorax Elites** in Netherrealm maps: they drop **Vorax Substance**. **{a}** start one Surgical Preparation; you hold up to **{b}**.',
    },
    {
      h: 'Prepare',
      p: "**Surgical Preparation** at Shelley's clinic: **6 tanks** of monster groups, **13 rounds**. The score, **Ultimate Activity**, is Activity × Quantity added over the 6 tanks.",
    },
    {
      h: 'Fight',
      p: 'In the **Operating Theater** your groups come as waves. The final score colours the **6 Antidote Vials**: white → purple → red, and one rainbow.',
    },
    {
      h: 'Graft',
      p: 'The loot feeds **Grafting** on Vorax Gear: organs and sutures add affixes taken from other gear.',
    },
  ],
  rulesH: 'Rules that decide a run',
  rules: {
    rounds: 'Rounds 1–10: play 1 of 3 potions. Rounds 11–13: no potions, your instruments work alone.',
    instruments:
      'Instruments: one in round 1, one more at **{a}** and at **{b}** Ultimate Activity — they don’t cost a round.',
    refresh: '**3** potion refreshes per run; Intern Shelley adds up to **2** instrument refreshes.',
    abandon: '!!Abandoning before the fight loses the Substance.!! After the rainbow, abandon to collect.',
    risk: 'Surgical Risk Low / Medium / High: +5 / 10 / 20% Activity per kill, −1 / 2 / 5% Ultimate Activity per death.',
  },

  winH: 'Win the preparation',
  firstH: 'First instrument',
  patternsH: 'Patterns',
  patterns: {
    fuse: '**Add, then fuse:** keep adding monsters, turn them into a few huge groups, pile Quantity and Activity on those.',
    pests: '**Pests are the steady road:** get 2 Pest groups early, and don’t fuse or mutate them away.',
    tank: '**Keep one tank free:** an add with all 6 tanks full fails and triggers nothing.',
    kit: '**Open a Potion Kit instead of refreshing:** a fresh choice that keeps your refresh.',
    xeno: '**Xenopanacea** (+333 Activity or Quantity, turns the monster into an Aemberon): big on your biggest group, small on a small one.',
    aim: '**Aim for {a} before the fight:** the battle bonus usually carries it to the rainbow.',
  },
  practice: 'Practise a board in the community Vorax Simulator',

  vialsH: 'What the score buys',
  vialCols: ['Ultimate Activity', 'Vials'],
  vials: {
    purple1: 'first purple',
    red1: 'first red',
    red4: 'reds 4, 5, 6',
    rainbow: 'rainbow (one vial only)',
  },
  vialsNote:
    'Purples 2–6 and reds 2–3 fall in between (not confirmed in-game). Past the rainbow, more score pays nothing.',

  farmH: 'Farm it in SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'Vorax groups in the map; monsters +10% life.',
    purple: '+30% life; each Vorax group cleared brings a Scavenger: +8% vial drop quantity each.',
    gold: '+70% life; more Surgical Protocol drops, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'blue', purple: 'purple', gold: 'gold' },
  tierP:
    'By difficulty: **T8** blue · **Profound** blue or purple · **Deep Space** purple or gold — gold only with a strong Intern Shelley and practice.',
  farm: {
    price:
      '!!Check the compass price first.!! A gold run paid 2,500–3,000 FE/h on days 3–5, then lost 50–150 FE a run once the compass cost 50–60 FE (Chinese server, one player).',
    rainbow:
      'Purple returns about 180 FE a run and gold 300+ — both lose money when the run misses the rainbow (Chinese server comment).',
    stack: 'Players run it on the same map as Sandlord and other fast mechanics.',
    chimera: '**Illusory Chimera** (boots) drops only from Vorax, at **Timemark 8+**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Each Antidote Vial drop has an **18%** (Lv 1) to **28%** (Lv 6) chance to be doubled; Lv 6 also gives +2 instrument refreshes and a 20% chance a vial opens again.',

  graftH: 'Grafting in one look',
  graft: {
    one: '**One** Vorax Gear piece at a time: up to 2 Advanced, 2 Ultimate and 2 Legendary affixes, no attribute requirement.',
    normal: '**Normal Organs** → Basic/Advanced affixes: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → Ultimate affixes, on level 89+ gear.',
    core: '**Core Organ + Suture** → a Legendary affix: Sullied for Fine, Tenacious for Fine/Precious, Exquisite for Matchless/Ultimate.',
    ss14: 'SS14: breaking an Ultimate Legendary gives **1 Core Organ**; four Core Organs need 20 Exquisite Sutures (since SS13).',
  },
  gapsH: 'Not known yet',
  gapsP:
    'The in-between vial thresholds, the drop rates of Substance and organs, and FE/h measured on the global server.',
};

export type Dict = typeof en;
