import type { Dict } from './en';

export const ptbr: Dict = {
  title: 'Vorax — Ficha de jogo',
  desc: 'O Vorax como funciona no SS14: como a Surgical Preparation pontua, o primeiro instrumento a pegar, as faixas dos vials, qual compass compensa e como funciona o Grafting.',
  back: 'Todos os eventos',
  h1: 'Vorax',
  lead: 'Chegou no **SS11** (janeiro de 2026) e continua no jogo. Regras da pesquisa do SS11; farm e estratégia para o **SS14 Tartarus**.',
  tags: { o: 'no jogo', p: 'jogadores', c: 'alegação' },
  tagsH: 'De onde vem cada linha',

  loopH: 'Como o Vorax funciona',
  steps: [
    {
      h: 'Coletar',
      p: 'Mate os **Vorax Elites** vermelhos nos mapas do Netherrealm: eles dropam **Vorax Substance**. Com **{a}** você começa uma Surgical Preparation; dá para guardar até **{b}**.',
    },
    {
      h: 'Preparar',
      p: '**Surgical Preparation** na clínica da Shelley: **6 tanques** de grupos de monstros, **13 rodadas**. A pontuação, **Ultimate Activity**, é Activity × Quantity somado nos 6 tanques.',
    },
    {
      h: 'Lutar',
      p: 'No **Operating Theater** seus grupos vêm em ondas. A pontuação final dá a cor dos **6 Antidote Vials**: branco → roxo → vermelho, e um arco-íris.',
    },
    {
      h: 'Enxertar',
      p: 'O loot alimenta o **Grafting** no Vorax Gear: órgãos e suturas trazem afixos tirados de outros itens.',
    },
  ],
  rulesH: 'Regras que decidem a run',
  rules: {
    rounds: 'Rodadas 1–10: jogue 1 de 3 poções. Rodadas 11–13: sem poções, seus instrumentos trabalham sozinhos.',
    instruments:
      'Instrumentos: um na rodada 1, mais um com **{a}** e outro com **{b}** de Ultimate Activity — não gastam rodada.',
    refresh: '**3** refreshes de poção por run; a Intern Shelley dá até **2** refreshes de instrumento.',
    abandon: '!!Abandonar antes da luta perde a Substance.!! Depois do arco-íris, abandone para coletar.',
    risk: 'Surgical Risk baixo / médio / alto: +5 / 10 / 20% de Activity por abate, −1 / 2 / 5% de Ultimate Activity por morte.',
  },

  winH: 'Vencer a preparação',
  firstH: 'Primeiro instrumento',
  patternsH: 'Padrões',
  patterns: {
    fuse: '**Adicione, depois funda:** continue adicionando monstros, transforme-os em poucos grupos enormes e empilhe Quantity e Activity neles.',
    pests: '**Pest é o caminho estável:** monte 2 grupos de Pest cedo e não os funda nem os mute.',
    tank: '**Deixe um tanque livre:** adicionar com os 6 tanques cheios falha e não ativa nada.',
    kit: '**Abra um Potion Kit em vez de dar refresh:** é uma escolha nova e você guarda o refresh.',
    xeno: '**Xenopanacea** (+333 de Activity ou Quantity, vira o monstro em Aemberon): forte no seu maior grupo, fraca num grupo pequeno.',
    aim: '**Mire em {a} antes da luta:** o bônus da batalha costuma levar ao arco-íris.',
  },
  practice: 'Treine um tabuleiro no Vorax Simulator da comunidade',

  vialsH: 'O que a pontuação compra',
  vialCols: ['Ultimate Activity', 'Vials'],
  vials: {
    purple1: 'primeiro roxo',
    red1: 'primeiro vermelho',
    red4: 'vermelhos 4, 5 e 6',
    rainbow: 'arco-íris (só um vial)',
  },
  vialsNote:
    'Os roxos 2–6 e os vermelhos 2–3 ficam no meio (não confirmados no jogo). Passado o arco-íris, pontuar mais não paga nada.',

  farmH: 'Farmar no SS14',
  compassH: 'Compasses',
  compass: {
    blue: 'grupos Vorax no mapa; monstros com +10% de vida.',
    purple: '+30% de vida; cada grupo Vorax limpo traz um Scavenger: +8% de quantidade de vials cada.',
    gold: '+70% de vida; mais drops de Surgical Protocol, +2 Rare Protocols; Severe Symptoms.',
  },
  colours: { blue: 'azul', purple: 'roxo', gold: 'dourado' },
  tierP:
    'Por dificuldade: **T8** azul · **Profound** azul ou roxo · **Deep Space** roxo ou dourado — dourado só com a Intern Shelley forte e prática.',
  farm: {
    price:
      '!!Veja o preço do compass antes.!! Uma run de dourado rendia 2.500–3.000 FE/h nos dias 3 a 5 e depois perdia 50–150 FE por run, quando o compass passou a custar 50–60 FE (servidor chinês, um jogador).',
    rainbow:
      'O roxo devolve cerca de 180 FE por run e o dourado 300+ — os dois dão prejuízo quando a run não chega ao arco-íris (comentário no servidor chinês).',
    stack: 'Os jogadores rodam no mesmo mapa que o Sandlord e outras mecânicas rápidas.',
    chimera: '**Illusory Chimera** (botas) só dropa do Vorax, a partir de **Timemark 8**.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Cada drop de Antidote Vial tem de **18%** (Lv 1) a **28%** (Lv 6) de chance de dobrar; no Lv 6 ela também dá +2 refreshes de instrumento e 20% de chance de um vial abrir de novo.',

  graftH: 'Grafting num relance',
  graft: {
    one: '**Uma** peça de Vorax Gear por vez: até 2 afixos Advanced, 2 Ultimate e 2 Legendary, sem requisito de atributo.',
    normal: '**Normal Organs** → afixos Basic/Advanced: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → afixos Ultimate, em itens de nível 89+.',
    core: '**Core Organ + Suture** → um afixo Legendary: Sullied para Fine, Tenacious para Fine/Precious, Exquisite para Matchless/Ultimate.',
    ss14: 'SS14: desmontar um Ultimate Legendary dá **1 Core Organ**; quatro Core Organs pedem 20 Exquisite Sutures (desde o SS13).',
  },
  gapsH: 'Ainda não se sabe',
  gapsP: 'As faixas intermediárias dos vials, a taxa de drop de Substance e órgãos, e FE/h medido no servidor global.',
};
