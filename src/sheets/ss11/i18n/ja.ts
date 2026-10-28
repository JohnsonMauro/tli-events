import type { Dict } from './en';

export const ja: Dict = {
  title: 'Vorax — プレイシート',
  desc: 'SS14でのVorax：Surgical Preparationのスコアの仕組み、最初に取る器具、薬瓶のしきい値、得なcompass、Graftingの要点。',
  back: 'イベント一覧',
  h1: 'Vorax',
  lead: '**SS11**（2026年1月）で登場し、今もゲームに残っている。ルールはSS11の調査から、ファームと戦略は**SS14 Tartarus**向け。',
  tags: { o: 'ゲーム内', p: 'プレイヤー', c: '主張' },
  tagsH: '各行の出典',

  loopH: 'Voraxの流れ',
  steps: [
    {
      h: '集める',
      p: 'Netherrealmのマップで深紅の**Vorax Elites**を倒すと**Vorax Substance**が落ちる。**{a}**個でSurgical Preparationを1回開始でき、最大**{b}**個まで持てる。',
    },
    {
      h: '準備',
      p: 'Shelleyの診療所で**Surgical Preparation**：モンスター群の**タンク6つ**、**13ラウンド**。スコアの**Ultimate Activity**は、6つのタンクのActivity × Quantityの合計。',
    },
    {
      h: '戦う',
      p: '**Operating Theater**では自分の群れがウェーブで出てくる。最終スコアで**Antidote Vial 6本**の色が決まる：白 → 紫 → 赤、そして虹が1本。',
    },
    {
      h: '移植',
      p: '戦利品はVorax Gearの**Grafting**に使う。臓器と縫合糸で、ほかの装備の効果を移し替える。',
    },
  ],
  rulesH: '勝敗を分けるルール',
  rules: {
    rounds: '1〜10ラウンド：薬3つから1つを使う。11〜13ラウンド：薬はなく、器具だけが働く。',
    instruments: '器具：1ラウンド目に1つ、Ultimate Activity **{a}** と **{b}** でさらに1つずつ。ラウンドは消費しない。',
    refresh: '薬のリロールは1回のランで**3**回。Intern Shelleyで器具のリロールが最大**2**回増える。',
    abandon: '!!戦闘前に放棄するとSubstanceを失う。!!虹が出たら放棄して報酬を受け取る。',
    risk: 'Surgical Risk 低 / 中 / 高：撃破ごとにActivity +5 / 10 / 20%、死亡ごとにUltimate Activity −1 / 2 / 5%。',
  },

  winH: '準備を制する',
  firstH: '最初の器具',
  patternsH: 'パターン',
  patterns: {
    fuse: '**追加してから融合：** モンスターを足し続けて少数の巨大な群れにまとめ、そこにQuantityとActivityを積む。',
    pests: '**Pestが安定ルート：** 早めにPestの群れを2つ作り、融合や変異で消さない。',
    tank: '**タンクを1つ空けておく：** 6つ全部埋まった状態での追加は失敗し、何も発動しない。',
    kit: '**リロールの代わりにPotion Kitを開ける：** 新しい選択肢が出て、リロールは残る。',
    xeno: '**Xenopanacea**（Activity か Quantity +333、モンスターをAemberonに変える）：一番大きい群れなら大きく、小さい群れでは効果が薄い。',
    aim: '**戦闘前に{a}を目指す：** 戦闘ボーナスでたいてい虹まで届く。',
  },
  practice: 'コミュニティのVorax Simulatorで盤面を練習する',

  vialsH: 'スコアで得られるもの',
  vialCols: ['Ultimate Activity', '薬瓶'],
  vials: {
    purple1: '紫の1本目',
    red1: '赤の1本目',
    red4: '赤の4・5・6本目',
    rainbow: '虹（1本だけ）',
  },
  vialsNote: '紫の2〜6本目と赤の2〜3本目はその間（ゲーム内では未確認）。虹を超えたスコアは報酬にならない。',

  farmH: 'SS14でのファーム',
  compassH: 'Compass',
  compass: {
    blue: 'マップにVoraxの群れが出る。モンスターのライフ +10%。',
    purple: 'ライフ +30%。Voraxの群れを倒すたびにScavengerが出て、1体ごとに薬瓶のドロップ数 +8%。',
    gold: 'ライフ +70%。Surgical Protocolのドロップ増加、Rare Protocol +2、Severe Symptoms。',
  },
  colours: { blue: '青', purple: '紫', gold: '金' },
  tierP:
    '難易度別：**T8** は青 · **Profound** は青か紫 · **Deep Space** は紫か金。金はIntern Shelleyが強く、慣れているときだけ。',
  farm: {
    price:
      '!!まずcompassの相場を確認。!!金のランは3〜5日目に2,500〜3,000 FE/hだったが、compassが50〜60 FEになると1回あたり50〜150 FEの赤字になった（中国サーバー、プレイヤー1人）。',
    rainbow: '紫は1回あたり約180 FE、金は300 FE以上の回収。虹を逃すとどちらも赤字（中国サーバーのコメント）。',
    stack: 'プレイヤーはSandlordなどの速いメカニクスと同じマップで回している。',
    chimera: '**Illusory Chimera**（ブーツ）は**Timemark 8**以上のVoraxでしか落ちない。',
  },
  shelleyH: 'Intern Shelley（パクトスピリット）',
  shelleyP:
    'Antidote Vialのドロップごとに**18%**（Lv 1）〜**28%**（Lv 6）の確率で倍になる。Lv 6では器具のリロール +2 と、薬瓶がもう一度開く確率20%も付く。',

  graftH: 'Graftingのまとめ',
  graft: {
    one: 'Vorax Gearは**1つ**だけ装備可能：Advanced 2、Ultimate 2、Legendary 2まで。能力値の要求なし。',
    normal: '**Normal Organs** → Basic/Advancedの接辞：Rotten T5〜T3、Inert T2、Vital T2〜T0。',
    flawless: '**Flawless Organs** → Ultimateの接辞、レベル89以上の装備に。',
    core: '**Core Organ + Suture** → Legendaryの接辞1つ：FineにはSullied、Fine/PreciousにはTenacious、Matchless/UltimateにはExquisite。',
    ss14: 'SS14：Ultimate Legendaryを分解すると**Core Organ 1つ**。4種のCore OrganはExquisite Sutureが20本必要（SS13から）。',
  },
  gapsH: 'まだ分からないこと',
  gapsP: '薬瓶の中間しきい値、Substanceと臓器のドロップ率、グローバルサーバーで計測したFE/h。',
};
