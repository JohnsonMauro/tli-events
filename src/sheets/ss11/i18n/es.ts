import type { Dict } from './en';

export const es: Dict = {
  title: 'Vorax — Hoja de juego',
  desc: 'Vorax tal como funciona en SS14: cómo puntúa la Surgical Preparation, el primer instrumento que tomar, los umbrales de los viales, qué compass compensa y cómo funciona el Grafting.',
  back: 'Todos los eventos',
  h1: 'Vorax',
  lead: 'Llegó con **SS11** (enero de 2026) y sigue en el juego. Reglas de la investigación de SS11; farmeo y estrategia para **SS14 Tartarus**.',
  tags: { o: 'en el juego', p: 'jugadores', c: 'afirmación' },
  tagsH: 'De dónde sale cada línea',

  loopH: 'Cómo funciona Vorax',
  steps: [
    {
      h: 'Recoger',
      p: 'Mata a los **Vorax Elites** carmesí en los mapas del Netherrealm: sueltan **Vorax Substance**. Con **{a}** empiezas una Surgical Preparation; puedes guardar hasta **{b}**.',
    },
    {
      h: 'Preparar',
      p: '**Surgical Preparation** en la clínica de Shelley: **6 tanques** de grupos de monstruos, **13 rondas**. La puntuación, **Ultimate Activity**, es Activity × Quantity sumado en los 6 tanques.',
    },
    {
      h: 'Luchar',
      p: 'En el **Operating Theater** tus grupos llegan en oleadas. La puntuación final da color a los **6 Antidote Vials**: blanco → morado → rojo, y uno arcoíris.',
    },
    {
      h: 'Injertar',
      p: 'El botín alimenta el **Grafting** del Vorax Gear: órganos y suturas añaden afijos sacados de otro equipo.',
    },
  ],
  rulesH: 'Reglas que deciden la partida',
  rules: {
    rounds: 'Rondas 1–10: juega 1 de 3 pociones. Rondas 11–13: sin pociones, tus instrumentos actúan solos.',
    instruments:
      'Instrumentos: uno en la ronda 1, otro al llegar a **{a}** y otro a **{b}** de Ultimate Activity — no gastan ronda.',
    refresh: '**3** refrescos de poción por partida; Intern Shelley añade hasta **2** refrescos de instrumento.',
    abandon: '!!Abandonar antes del combate pierde la Substance.!! Tras el arcoíris, abandona para cobrar.',
    risk: 'Surgical Risk bajo / medio / alto: +5 / 10 / 20 % de Activity por baja, −1 / 2 / 5 % de Ultimate Activity por muerte.',
  },

  winH: 'Gana la preparación',
  firstH: 'Primer instrumento',
  patternsH: 'Patrones',
  patterns: {
    fuse: '**Añade y luego fusiona:** sigue añadiendo monstruos, conviértelos en pocos grupos enormes y acumula Quantity y Activity en ellos.',
    pests: '**Pest es el camino seguro:** consigue 2 grupos de Pest pronto y no los fusiones ni los mutes.',
    tank: '**Deja un tanque libre:** añadir con los 6 tanques llenos falla y no activa nada.',
    kit: '**Abre un Potion Kit en vez de refrescar:** es una elección nueva y conservas el refresco.',
    xeno: '**Xenopanacea** (+333 de Activity o Quantity, convierte al monstruo en Aemberon): enorme en tu grupo más grande, poca cosa en uno pequeño.',
    aim: '**Apunta a {a} antes del combate:** el bonus de la batalla suele llevarte al arcoíris.',
  },
  practice: 'Practica un tablero en el Vorax Simulator de la comunidad',

  vialsH: 'Lo que compra la puntuación',
  vialCols: ['Ultimate Activity', 'Viales'],
  vials: {
    purple1: 'primer morado',
    red1: 'primer rojo',
    red4: 'rojos 4, 5 y 6',
    rainbow: 'arcoíris (un solo vial)',
  },
  vialsNote:
    'Los morados 2–6 y los rojos 2–3 quedan en medio (sin confirmar en el juego). Pasado el arcoíris, puntuar más no da nada.',

  farmH: 'Farméalo en SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'grupos Vorax en el mapa; monstruos con +10 % de vida.',
    purple: '+30 % de vida; cada grupo Vorax limpiado trae un Scavenger: +8 % de cantidad de viales cada uno.',
    gold: '+70 % de vida; más drops de Surgical Protocol, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'azul', purple: 'morado', gold: 'dorado' },
  tierP:
    'Por dificultad: **T8** azul · **Profound** azul o morado · **Deep Space** morado o dorado — el dorado solo con una Intern Shelley fuerte y práctica.',
  farm: {
    price:
      '!!Mira antes el precio del compass.!! Una partida con el dorado daba 2.500–3.000 FE/h los días 3 a 5 y luego perdía 50–150 FE por partida cuando el compass pasó a costar 50–60 FE (servidor chino, un jugador).',
    rainbow:
      'El morado devuelve unos 180 FE por partida y el dorado 300+; los dos pierden dinero si la partida no llega al arcoíris (comentario del servidor chino).',
    stack: 'Los jugadores lo combinan en el mismo mapa con Sandlord y otras mecánicas rápidas.',
    chimera: '**Illusory Chimera** (botas) solo cae del Vorax, desde **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Cada drop de Antidote Vial tiene entre un **18 %** (Nv 1) y un **28 %** (Nv 6) de probabilidad de duplicarse; en Nv 6 además da +2 refrescos de instrumento y un 20 % de probabilidad de que un vial se abra otra vez.',

  graftH: 'El Grafting de un vistazo',
  graft: {
    one: '**Una** pieza de Vorax Gear a la vez: hasta 2 afijos Advanced, 2 Ultimate y 2 Legendary, sin requisito de atributos.',
    normal: '**Normal Organs** → afijos Basic/Advanced: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → afijos Ultimate, en equipo de nivel 89+.',
    core: '**Core Organ + Suture** → un afijo Legendary: Sullied para Fine, Tenacious para Fine/Precious, Exquisite para Matchless/Ultimate.',
    ss14: 'SS14: desmontar un Ultimate Legendary da **1 Core Organ**; cuatro Core Organs piden 20 Exquisite Sutures (desde SS13).',
  },
  gapsH: 'Aún no se sabe',
  gapsP:
    'Los umbrales intermedios de los viales, la tasa de drop de Substance y órganos, y el FE/h medido en el servidor global.',
};
