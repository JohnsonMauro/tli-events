import type { Dict } from './en';

export const sv: Dict = {
  title: 'Vorax — Spelblad',
  desc: 'Vorax som det fungerar i SS14: hur Surgical Preparation ger poäng, vilket instrument du tar först, flaskornas trösklar, vilken compass som lönar sig och hur Grafting fungerar.',
  back: 'Alla event',
  h1: 'Vorax',
  lead: 'Kom med **SS11** (januari 2026) och finns kvar i spelet. Reglerna kommer från vår SS11-research; farm och strategi gäller **SS14 Tartarus**.',
  tags: { o: 'i spelet', p: 'spelare', c: 'påstående' },
  tagsH: 'Var varje rad kommer ifrån',

  loopH: 'Så fungerar Vorax',
  steps: [
    {
      h: 'Samla',
      p: 'Döda de karmosinröda **Vorax Elites** på Netherrealm-kartor: de släpper **Vorax Substance**. **{a}** startar en Surgical Preparation; du kan spara upp till **{b}**.',
    },
    {
      h: 'Förbered',
      p: '**Surgical Preparation** i Shelleys klinik: **6 tankar** med monstergrupper, **13 rundor**. Poängen, **Ultimate Activity**, är Activity × Quantity summerat över de 6 tankarna.',
    },
    {
      h: 'Slåss',
      p: 'I **Operating Theater** kommer dina grupper i vågor. Slutpoängen färgar de **6 Antidote Vials**: vit → lila → röd, och en regnbåge.',
    },
    {
      h: 'Ympa',
      p: 'Bytet går till **Grafting** på Vorax Gear: organ och suturer lägger till affix tagna från andra föremål.',
    },
  ],
  rulesH: 'Regler som avgör en körning',
  rules: {
    rounds: 'Rundor 1–10: spela 1 av 3 drycker. Rundor 11–13: inga drycker, dina instrument jobbar själva.',
    instruments:
      'Instrument: ett i runda 1, ett till vid **{a}** och vid **{b}** Ultimate Activity — de kostar ingen runda.',
    refresh: '**3** dryckesomslag per körning; Intern Shelley ger upp till **2** instrumentomslag.',
    abandon: '!!Ger du upp före striden förlorar du din Substance.!! Efter regnbågen, ge upp för att hämta ut.',
    risk: 'Surgical Risk låg / medel / hög: +5 / 10 / 20 % Activity per dödat monster, −1 / 2 / 5 % Ultimate Activity per död.',
  },

  winH: 'Vinn förberedelsen',
  firstH: 'Första instrumentet',
  patternsH: 'Mönster',
  patterns: {
    fuse: '**Lägg till, slå sedan ihop:** fortsätt lägga till monster, gör dem till några få jättegrupper och stapla Quantity och Activity på dem.',
    pests: '**Pest är den säkra vägen:** skaffa 2 Pest-grupper tidigt och slå inte ihop eller mutera bort dem.',
    tank: '**Håll en tank ledig:** att lägga till med alla 6 tankar fulla misslyckas och utlöser ingenting.',
    kit: '**Öppna ett Potion Kit i stället för att slå om:** ett nytt val, och du behåller omslaget.',
    xeno: '**Xenopanacea** (+333 Activity eller Quantity, gör monstret till en Aemberon): stort på din största grupp, litet på en liten.',
    aim: '**Sikta på {a} före striden:** stridsbonusen tar dig oftast till regnbågen.',
  },
  practice: 'Öva på ett bräde i communityns Vorax Simulator',

  vialsH: 'Vad poängen ger',
  vialCols: ['Ultimate Activity', 'Flaskor'],
  vials: {
    purple1: 'första lila',
    red1: 'första röda',
    red4: 'röda 4, 5 och 6',
    rainbow: 'regnbåge (bara en flaska)',
  },
  vialsNote:
    'Lila 2–6 och röd 2–3 ligger däremellan (inte bekräftat i spelet). Efter regnbågen ger mer poäng ingenting.',

  farmH: 'Farma det i SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'Vorax-grupper på kartan; monster +10 % liv.',
    purple: '+30 % liv; varje rensad Vorax-grupp ger en Scavenger: +8 % fler flaskor var.',
    gold: '+70 % liv; fler Surgical Protocol-drops, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'blå', purple: 'lila', gold: 'guld' },
  tierP:
    'Efter svårighet: **T8** blå · **Profound** blå eller lila · **Deep Space** lila eller guld — guld bara med en stark Intern Shelley och vana.',
  farm: {
    price:
      '!!Kolla compassens pris först.!! En guldkörning gav 2 500–3 000 FE/h dag 3–5 och förlorade sedan 50–150 FE per körning när compassen kostade 50–60 FE (kinesisk server, en spelare).',
    rainbow:
      'Lila ger tillbaka runt 180 FE per körning och guld 300+ — båda går med förlust om körningen missar regnbågen (kommentar från kinesisk server).',
    stack: 'Spelare kör det på samma karta som Sandlord och andra snabba mekaniker.',
    chimera: '**Illusory Chimera** (stövlar) släpps bara av Vorax, från **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Varje Antidote Vial-drop har **18 %** (nivå 1) till **28 %** (nivå 6) chans att dubblas; på nivå 6 ger hon även +2 instrumentomslag och 20 % chans att en flaska öppnas igen.',

  graftH: 'Grafting i korthet',
  graft: {
    one: '**En** Vorax Gear-del åt gången: upp till 2 Advanced-, 2 Ultimate- och 2 Legendary-affix, inga attributkrav.',
    normal: '**Normal Organs** → Basic/Advanced-affix: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → Ultimate-affix, på föremål från nivå 89.',
    core: '**Core Organ + Suture** → ett Legendary-affix: Sullied för Fine, Tenacious för Fine/Precious, Exquisite för Matchless/Ultimate.',
    ss14: 'SS14: att plocka isär en Ultimate Legendary ger **1 Core Organ**; fyra Core Organs kräver 20 Exquisite Sutures (sedan SS13).',
  },
  gapsH: 'Ännu okänt',
  gapsP:
    'Flaskornas mellanliggande trösklar, dropptakten för Substance och organ, och FE/h uppmätt på den globala servern.',
};
