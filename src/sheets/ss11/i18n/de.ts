import type { Dict } from './en';

export const de: Dict = {
  title: 'Vorax — Spielblatt',
  desc: 'Vorax, wie es in SS14 läuft: wie die Surgical Preparation punktet, welches Instrument zuerst, die Schwellen der Phiolen, welcher Compass sich lohnt und wie Grafting funktioniert.',
  back: 'Alle Events',
  h1: 'Vorax',
  lead: 'Kam mit **SS11** (Januar 2026) und ist immer noch im Spiel. Regeln aus der SS11-Recherche; Farm und Strategie für **SS14 Tartarus**.',
  tags: { o: 'im Spiel', p: 'Spieler', c: 'Behauptung' },
  tagsH: 'Woher jede Zeile kommt',

  loopH: 'So funktioniert Vorax',
  steps: [
    {
      h: 'Sammeln',
      p: 'Töte die purpurroten **Vorax Elites** auf Netherrealm-Karten: Sie droppen **Vorax Substance**. **{a}** starten eine Surgical Preparation; du kannst bis zu **{b}** lagern.',
    },
    {
      h: 'Vorbereiten',
      p: '**Surgical Preparation** in Shelleys Klinik: **6 Tanks** mit Monstergruppen, **13 Runden**. Die Punktzahl, **Ultimate Activity**, ist Activity × Quantity, summiert über die 6 Tanks.',
    },
    {
      h: 'Kämpfen',
      p: 'Im **Operating Theater** kommen deine Gruppen in Wellen. Die Endpunktzahl färbt die **6 Antidote Vials**: weiß → lila → rot, und eine Regenbogen-Phiole.',
    },
    {
      h: 'Pfropfen',
      p: 'Die Beute speist das **Grafting** auf Vorax Gear: Organe und Nähte übertragen Affixe von anderen Items.',
    },
  ],
  rulesH: 'Regeln, die einen Run entscheiden',
  rules: {
    rounds: 'Runden 1–10: spiele 1 von 3 Tränken. Runden 11–13: keine Tränke mehr, deine Instrumente arbeiten allein.',
    instruments:
      'Instrumente: eins in Runde 1, je eins mehr bei **{a}** und **{b}** Ultimate Activity — kostet keine Runde.',
    refresh: '**3** Trank-Refreshes pro Run; Intern Shelley gibt bis zu **2** Instrument-Refreshes dazu.',
    abandon: '!!Wer vor dem Kampf abbricht, verliert die Substance.!! Nach dem Regenbogen abbrechen, um einzusammeln.',
    risk: 'Surgical Risk niedrig / mittel / hoch: +5 / 10 / 20 % Activity pro Kill, −1 / 2 / 5 % Ultimate Activity pro Tod.',
  },

  winH: 'Die Vorbereitung gewinnen',
  firstH: 'Erstes Instrument',
  patternsH: 'Muster',
  patterns: {
    fuse: '**Erst hinzufügen, dann fusionieren:** immer weiter Monster hinzufügen, daraus wenige riesige Gruppen machen und Quantity und Activity darauf stapeln.',
    pests: '**Pests sind der sichere Weg:** früh 2 Pest-Gruppen holen und sie weder fusionieren noch mutieren.',
    tank: '**Einen Tank frei lassen:** Hinzufügen bei 6 vollen Tanks schlägt fehl und löst nichts aus.',
    kit: '**Ein Potion Kit öffnen statt zu refreshen:** eine neue Auswahl, und der Refresh bleibt dir.',
    xeno: '**Xenopanacea** (+333 Activity oder Quantity, macht das Monster zum Aemberon): stark auf deiner größten Gruppe, schwach auf einer kleinen.',
    aim: '**Vor dem Kampf {a} anpeilen:** der Kampfbonus trägt dich meist bis zum Regenbogen.',
  },
  practice: 'Ein Board im Vorax Simulator der Community üben',

  vialsH: 'Was die Punktzahl bringt',
  vialCols: ['Ultimate Activity', 'Phiolen'],
  vials: {
    purple1: 'erste lila',
    red1: 'erste rote',
    red4: 'rote 4, 5 und 6',
    rainbow: 'Regenbogen (nur eine Phiole)',
  },
  vialsNote:
    'Lila 2–6 und Rot 2–3 liegen dazwischen (im Spiel nicht bestätigt). Über dem Regenbogen bringt mehr Punktzahl nichts.',

  farmH: 'In SS14 farmen',
  compassH: 'Compasses',
  compass: {
    blue: 'Vorax-Gruppen auf der Karte; Monster +10 % Leben.',
    purple: '+30 % Leben; jede besiegte Vorax-Gruppe bringt einen Scavenger: je +8 % Phiolen-Dropmenge.',
    gold: '+70 % Leben; mehr Surgical-Protocol-Drops, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'blau', purple: 'lila', gold: 'gold' },
  tierP:
    'Nach Schwierigkeit: **T8** blau · **Profound** blau oder lila · **Deep Space** lila oder gold — gold nur mit starker Intern Shelley und Übung.',
  farm: {
    price:
      '!!Erst den Compass-Preis prüfen.!! Ein Gold-Run brachte an den Tagen 3–5 2.500–3.000 FE/h und verlor dann 50–150 FE pro Run, als der Compass 50–60 FE kostete (chinesischer Server, ein Spieler).',
    rainbow:
      'Lila bringt etwa 180 FE pro Run, Gold 300+ — beide machen Verlust, wenn der Run den Regenbogen verfehlt (Kommentar vom chinesischen Server).',
    stack: 'Spieler kombinieren es auf derselben Karte mit Sandlord und anderen schnellen Mechaniken.',
    chimera: '**Illusory Chimera** (Stiefel) droppt nur aus Vorax, ab **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (Pactspirit)',
  shelleyP:
    'Jeder Antidote-Vial-Drop wird mit **18 %** (Stufe 1) bis **28 %** (Stufe 6) Chance verdoppelt; Stufe 6 gibt außerdem +2 Instrument-Refreshes und 20 % Chance, dass sich eine Phiole erneut öffnet.',

  graftH: 'Grafting auf einen Blick',
  graft: {
    one: '**Ein** Vorax-Gear-Teil gleichzeitig: bis zu 2 Advanced-, 2 Ultimate- und 2 Legendary-Affixe, keine Attributsanforderung.',
    normal: '**Normal Organs** → Basic/Advanced-Affixe: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → Ultimate-Affixe, auf Items ab Stufe 89.',
    core: '**Core Organ + Suture** → ein Legendary-Affix: Sullied für Fine, Tenacious für Fine/Precious, Exquisite für Matchless/Ultimate.',
    ss14: 'SS14: Ein zerlegtes Ultimate Legendary gibt **1 Core Organ**; vier Core Organs brauchen 20 Exquisite Sutures (seit SS13).',
  },
  gapsH: 'Noch unbekannt',
  gapsP:
    'Die Zwischenschwellen der Phiolen, die Dropraten von Substance und Organen und gemessene FE/h auf dem globalen Server.',
};
