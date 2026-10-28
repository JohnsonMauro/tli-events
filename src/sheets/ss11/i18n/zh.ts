import type { Dict } from './en';

export const zh: Dict = {
  title: 'Vorax — 速查表',
  desc: 'SS14 版本的 Vorax：Surgical Preparation 怎么算分、开局拿哪个器具、解药罐的分数线、哪种罗盘划算、Grafting 怎么做。',
  back: '全部活动',
  h1: 'Vorax',
  lead: '**SS11**（2026 年 1 月）推出，至今仍在游戏中。规则来自 SS11 的资料整理；搬砖和打法以 **SS14 Tartarus** 为准。',
  tags: { o: '游戏内', p: '玩家', c: '说法' },
  tagsH: '每行的来源',

  loopH: 'Vorax 的流程',
  steps: [
    {
      h: '收集',
      p: '在 Netherrealm 地图里击杀深红色的 **Vorax Elites**，掉落 **Vorax Substance**。**{a}** 个开一次 Surgical Preparation，最多存 **{b}** 个。',
    },
    {
      h: '准备',
      p: '在 Shelley 的诊所进行 **Surgical Preparation**：**6 个罐子**装怪物群，共 **13 回合**。分数 **Ultimate Activity** = 6 个罐子的 Activity × Quantity 之和。',
    },
    {
      h: '战斗',
      p: '在 **Operating Theater** 里，你培育的怪物群分波出现。最终分数决定 **6 个 Antidote Vial** 的颜色：白 → 紫 → 红，外加一个彩罐。',
    },
    {
      h: '缝合',
      p: '掉落用于 Vorax Gear 的 **Grafting**：用器官和缝线把别的装备上的词缀移植过来。',
    },
  ],
  rulesH: '决定一局的规则',
  rules: {
    rounds: '第 1–10 回合：三选一用一瓶药剂。第 11–13 回合：没有药剂，只有器具在起作用。',
    instruments: '器具：第 1 回合一个，Ultimate Activity 到 **{a}** 和 **{b}** 时各再给一个——不占回合。',
    refresh: '每局 **3** 次药剂刷新；Intern Shelley 最多再加 **2** 次器具刷新。',
    abandon: '!!战斗前放弃会损失 Substance。!!出彩罐后再放弃领奖。',
    risk: 'Surgical Risk 低 / 中 / 高：每次击杀 Activity +5 / 10 / 20%，每次死亡 Ultimate Activity −1 / 2 / 5%。',
  },

  winH: '打好准备阶段',
  firstH: '开局器具',
  patternsH: '规律',
  patterns: {
    fuse: '**先加再融合：** 不断添加怪物，合成少数几组超大的怪物群，把 Quantity 和 Activity 都堆在它们身上。',
    pests: '**Pest 最稳：** 尽早凑出 2 组 Pest，别把它们融合或变异掉。',
    tank: '**留一个空罐：** 6 个罐子都满时添加会失败，什么也不触发。',
    kit: '**开 Potion Kit 代替刷新：** 等于多一次选择，刷新次数还留着。',
    xeno: '**Xenopanacea**（Activity 或 Quantity +333，把怪物变成 Aemberon）：用在最大的那组收益很大，用在小组上没什么用。',
    aim: '**战斗前做到 {a}：** 战斗加成通常能把你带到彩罐。',
  },
  practice: '在社区的 Vorax Simulator 里练习盘面',

  vialsH: '分数换来什么',
  vialCols: ['Ultimate Activity', '解药罐'],
  vials: {
    purple1: '第一个紫罐',
    red1: '第一个红罐',
    red4: '第 4、5、6 个红罐',
    rainbow: '彩罐（只有一个）',
  },
  vialsNote: '紫罐 2–6、红罐 2–3 落在这些分数之间（游戏内未确认）。过了彩罐，分数再高也没有额外奖励。',

  farmH: 'SS14 怎么搬砖',
  compassH: '罗盘',
  compass: {
    blue: '地图里出现 Vorax 怪物群；怪物生命 +10%。',
    purple: '生命 +30%；每清一组 Vorax 怪物会来一个 Scavenger：每个解药罐掉落数量 +8%。',
    gold: '生命 +70%；Surgical Protocol 掉落更多，Rare Protocol +2；Severe Symptoms。',
  },
  colours: { blue: '蓝', purple: '紫', gold: '金' },
  tierP:
    '按难度：**T8** 用蓝 · **Profound** 用蓝或紫 · **Deep Space** 用紫或金——金只在 Intern Shelley 够强、操作熟练时用。',
  farm: {
    price:
      '!!先看罗盘价格。!!金罗盘第 3–5 天每小时 2,500–3,000 火，罗盘涨到 50–60 火后每把亏 50–150 火（国服，一名玩家）。',
    rainbow: '紫罗盘每把回本约 180 火，金罗盘 300+——没出彩罐两种都亏（国服评论）。',
    stack: '玩家会和 Sandlord 等快节奏玩法在同一张图里一起刷。',
    chimera: '**Illusory Chimera**（鞋子）只在 **Timemark 8** 及以上的 Vorax 中掉落。',
  },
  shelleyH: 'Intern Shelley（契灵）',
  shelleyP:
    '每个 Antidote Vial 掉落有 **18%**（1 级）到 **28%**（6 级）的概率翻倍；6 级还给器具刷新 +2，以及 20% 概率让一个解药罐再开一次。',

  graftH: 'Grafting 一览',
  graft: {
    one: 'Vorax Gear 同时只能穿 **一件**：最多 2 条 Advanced、2 条 Ultimate、2 条 Legendary 词缀，无属性需求。',
    normal: '**Normal Organs** → Basic/Advanced 词缀：Rotten T5–T3，Inert T2，Vital T2–T0。',
    flawless: '**Flawless Organs** → Ultimate 词缀，限 89 级及以上装备。',
    core: '**Core Organ + Suture** → 一条 Legendary 词缀：Fine 用 Sullied，Fine/Precious 用 Tenacious，Matchless/Ultimate 用 Exquisite。',
    ss14: 'SS14：分解一件 Ultimate Legendary 得 **1 个 Core Organ**；有四种 Core Organ 需要 20 根 Exquisite Suture（SS13 起）。',
  },
  gapsH: '尚不清楚',
  gapsP: '解药罐中间档的分数线、Substance 和器官的掉率，以及国际服实测的每小时收益。',
};
