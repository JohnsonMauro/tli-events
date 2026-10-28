import type { Dict } from './en';

export const fr: Dict = {
  title: 'Vorax — Fiche de jeu',
  desc: 'Vorax tel qu’il tourne en SS14 : comment la Surgical Preparation compte les points, le premier instrument à prendre, les seuils des fioles, le compass rentable et le fonctionnement du Grafting.',
  back: 'Tous les événements',
  h1: 'Vorax',
  lead: 'Arrivé avec la **SS11** (janvier 2026) et toujours en jeu. Règles issues de nos recherches sur la SS11 ; farm et stratégie pour **SS14 Tartarus**.',
  tags: { o: 'en jeu', p: 'joueurs', c: 'affirmation' },
  tagsH: 'D’où vient chaque ligne',

  loopH: 'Comment marche Vorax',
  steps: [
    {
      h: 'Récolter',
      p: 'Tuez les **Vorax Elites** pourpres sur les cartes du Netherrealm : ils lâchent de la **Vorax Substance**. **{a}** lancent une Surgical Preparation ; vous pouvez en garder jusqu’à **{b}**.',
    },
    {
      h: 'Préparer',
      p: '**Surgical Preparation** dans la clinique de Shelley : **6 cuves** de groupes de monstres, **13 manches**. Le score, **Ultimate Activity**, vaut Activity × Quantity additionné sur les 6 cuves.',
    },
    {
      h: 'Combattre',
      p: 'Dans l’**Operating Theater**, vos groupes arrivent par vagues. Le score final colore les **6 Antidote Vials** : blanc → violet → rouge, et une arc-en-ciel.',
    },
    {
      h: 'Greffer',
      p: 'Le butin alimente le **Grafting** sur le Vorax Gear : organes et sutures ajoutent des affixes pris sur d’autres objets.',
    },
  ],
  rulesH: 'Les règles qui font la partie',
  rules: {
    rounds:
      'Manches 1 à 10 : jouez 1 potion sur 3. Manches 11 à 13 : plus de potions, vos instruments travaillent seuls.',
    instruments:
      'Instruments : un à la manche 1, un de plus à **{a}** et à **{b}** d’Ultimate Activity — sans coûter de manche.',
    refresh: '**3** relances de potions par partie ; Intern Shelley ajoute jusqu’à **2** relances d’instrument.',
    abandon: '!!Abandonner avant le combat fait perdre la Substance.!! Après l’arc-en-ciel, abandonnez pour encaisser.',
    risk: 'Surgical Risk faible / moyen / élevé : +5 / 10 / 20 % d’Activity par élimination, −1 / 2 / 5 % d’Ultimate Activity par mort.',
  },

  winH: 'Réussir la préparation',
  firstH: 'Premier instrument',
  patternsH: 'Schémas',
  patterns: {
    fuse: '**Ajoutez, puis fusionnez :** continuez d’ajouter des monstres, faites-en quelques groupes énormes et empilez Quantity et Activity dessus.',
    pests: '**Les Pests sont la voie sûre :** montez 2 groupes de Pest tôt, sans les fusionner ni les muter.',
    tank: '**Gardez une cuve libre :** un ajout avec les 6 cuves pleines échoue et ne déclenche rien.',
    kit: '**Ouvrez un Potion Kit plutôt que de relancer :** un nouveau choix, et vous gardez la relance.',
    xeno: '**Xenopanacea** (+333 d’Activity ou de Quantity, transforme le monstre en Aemberon) : énorme sur votre plus gros groupe, faible sur un petit.',
    aim: '**Visez {a} avant le combat :** le bonus de bataille vous mène en général à l’arc-en-ciel.',
  },
  practice: 'S’entraîner sur un plateau dans le Vorax Simulator de la communauté',

  vialsH: 'Ce que rapporte le score',
  vialCols: ['Ultimate Activity', 'Fioles'],
  vials: {
    purple1: 'première violette',
    red1: 'première rouge',
    red4: 'rouges 4, 5 et 6',
    rainbow: 'arc-en-ciel (une seule fiole)',
  },
  vialsNote:
    'Les violettes 2 à 6 et les rouges 2 et 3 tombent entre les deux (non confirmé en jeu). Au-delà de l’arc-en-ciel, plus de score ne rapporte rien.',

  farmH: 'Farmer en SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'des groupes Vorax sur la carte ; monstres +10 % de vie.',
    purple: '+30 % de vie ; chaque groupe Vorax nettoyé amène un Scavenger : +8 % de quantité de fioles chacun.',
    gold: '+70 % de vie ; plus de drops de Surgical Protocol, +2 Rare Protocols ; Severe Symptoms.',
  },
  colours: { blue: 'bleu', purple: 'violet', gold: 'or' },
  tierP:
    'Selon la difficulté : **T8** bleu · **Profound** bleu ou violet · **Deep Space** violet ou or — l’or seulement avec une Intern Shelley solide et de l’entraînement.',
  farm: {
    price:
      '!!Vérifiez d’abord le prix du compass.!! Une partie en or rapportait 2 500 à 3 000 FE/h les jours 3 à 5, puis perdait 50 à 150 FE par partie quand le compass est passé à 50–60 FE (serveur chinois, un joueur).',
    rainbow:
      'Le violet rapporte environ 180 FE par partie et l’or 300+ — les deux perdent de l’argent quand la partie rate l’arc-en-ciel (commentaire sur le serveur chinois).',
    stack: 'Les joueurs le jouent sur la même carte que Sandlord et d’autres mécaniques rapides.',
    chimera: '**Illusory Chimera** (bottes) ne tombe que du Vorax, à partir de **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Chaque drop d’Antidote Vial a **18 %** (niv. 1) à **28 %** (niv. 6) de chances d’être doublé ; au niveau 6 elle donne aussi +2 relances d’instrument et 20 % de chances qu’une fiole se rouvre.',

  graftH: 'Le Grafting en un coup d’œil',
  graft: {
    one: '**Une seule** pièce de Vorax Gear à la fois : jusqu’à 2 affixes Advanced, 2 Ultimate et 2 Legendary, sans condition d’attribut.',
    normal: '**Normal Organs** → affixes Basic/Advanced : Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → affixes Ultimate, sur un objet de niveau 89+.',
    core: '**Core Organ + Suture** → un affixe Legendary : Sullied pour Fine, Tenacious pour Fine/Precious, Exquisite pour Matchless/Ultimate.',
    ss14: 'SS14 : démonter un Ultimate Legendary donne **1 Core Organ** ; quatre Core Organs demandent 20 Exquisite Sutures (depuis la SS13).',
  },
  gapsH: 'Encore inconnu',
  gapsP:
    'Les seuils intermédiaires des fioles, les taux de drop de la Substance et des organes, et un FE/h mesuré sur le serveur global.',
};
