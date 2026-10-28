import type { Dict } from './en';

export const ko: Dict = {
  title: 'Vorax — 플레이 시트',
  desc: 'SS14 기준 Vorax: Surgical Preparation 점수 계산, 처음 고를 도구, 약병 기준점, 이득인 compass, Grafting 정리.',
  back: '모든 이벤트',
  h1: 'Vorax',
  lead: '**SS11**(2026년 1월)에 나와서 지금도 게임에 있습니다. 규칙은 SS11 조사 결과, 파밍과 전략은 **SS14 Tartarus** 기준입니다.',
  tags: { o: '게임 내', p: '플레이어', c: '주장' },
  tagsH: '각 줄의 출처',

  loopH: 'Vorax 진행 방식',
  steps: [
    {
      h: '모으기',
      p: 'Netherrealm 맵의 붉은 **Vorax Elites**를 처치하면 **Vorax Substance**가 나옵니다. **{a}**개로 Surgical Preparation 1회를 시작하고, 최대 **{b}**개까지 보관합니다.',
    },
    {
      h: '준비',
      p: 'Shelley의 진료소에서 **Surgical Preparation**: 몬스터 그룹 **탱크 6개**, **13라운드**. 점수인 **Ultimate Activity**는 6개 탱크의 Activity × Quantity를 합한 값입니다.',
    },
    {
      h: '전투',
      p: '**Operating Theater**에서 내 그룹들이 웨이브로 나옵니다. 최종 점수에 따라 **Antidote Vial 6개**의 색이 정해집니다: 흰색 → 보라 → 빨강, 그리고 무지개 하나.',
    },
    {
      h: '이식',
      p: '전리품은 Vorax Gear의 **Grafting**에 쓰입니다. 장기와 봉합사로 다른 장비의 옵션을 옮겨 붙입니다.',
    },
  ],
  rulesH: '한 판을 가르는 규칙',
  rules: {
    rounds: '1–10라운드: 물약 3개 중 1개를 사용. 11–13라운드: 물약 없이 도구만 작동합니다.',
    instruments: '도구: 1라운드에 하나, Ultimate Activity **{a}**와 **{b}**에서 하나씩 더 — 라운드를 쓰지 않습니다.',
    refresh: '물약 새로고침은 한 판에 **3**회, Intern Shelley가 도구 새로고침을 최대 **2**회 더해 줍니다.',
    abandon: '!!전투 전에 포기하면 Substance를 잃습니다.!! 무지개를 띄운 뒤에 포기해서 보상을 받으세요.',
    risk: 'Surgical Risk 낮음 / 보통 / 높음: 처치당 Activity +5 / 10 / 20%, 사망당 Ultimate Activity −1 / 2 / 5%.',
  },

  winH: '준비 단계 이기기',
  firstH: '첫 도구',
  patternsH: '패턴',
  patterns: {
    fuse: '**추가하고 합치기:** 몬스터를 계속 추가해 몇 개의 거대한 그룹으로 만들고, 거기에 Quantity와 Activity를 몰아주세요.',
    pests: '**Pest가 가장 안정적:** Pest 그룹 2개를 일찍 만들고, 합치거나 변이시키지 마세요.',
    tank: '**탱크 하나는 비워 두기:** 6개가 꽉 찬 상태에서 추가하면 실패하고 아무 효과도 없습니다.',
    kit: '**새로고침 대신 Potion Kit 열기:** 새 선택지를 받으면서 새로고침은 아낄 수 있습니다.',
    xeno: '**Xenopanacea**(Activity 또는 Quantity +333, 몬스터를 Aemberon으로 바꿈): 가장 큰 그룹에 쓰면 크고, 작은 그룹에 쓰면 미미합니다.',
    aim: '**전투 전에 {a}을 목표로:** 전투 보너스로 보통 무지개까지 갑니다.',
  },
  practice: '커뮤니티 Vorax Simulator에서 보드 연습하기',

  vialsH: '점수로 얻는 것',
  vialCols: ['Ultimate Activity', '약병'],
  vials: {
    purple1: '첫 보라',
    red1: '첫 빨강',
    red4: '빨강 4, 5, 6번째',
    rainbow: '무지개(1병만)',
  },
  vialsNote:
    '보라 2–6번째와 빨강 2–3번째는 그 사이에 있습니다(게임에서 미확인). 무지개를 넘긴 점수는 보상이 늘지 않습니다.',

  farmH: 'SS14에서 파밍하기',
  compassH: 'Compass',
  compass: {
    blue: '맵에 Vorax 그룹 등장, 몬스터 생명력 +10%.',
    purple: '생명력 +30%, Vorax 그룹을 처치할 때마다 Scavenger 등장: 하나당 약병 드롭 수량 +8%.',
    gold: '생명력 +70%, Surgical Protocol 드롭 증가, Rare Protocol +2, Severe Symptoms.',
  },
  colours: { blue: '파랑', purple: '보라', gold: '금색' },
  tierP:
    '난이도별: **T8** 파랑 · **Profound** 파랑 또는 보라 · **Deep Space** 보라 또는 금색 — 금색은 Intern Shelley가 강하고 손에 익었을 때만.',
  farm: {
    price:
      '!!먼저 compass 시세를 확인하세요.!! 금색 판은 3–5일 차에 시간당 2,500–3,000 FE를 벌었지만, compass가 50–60 FE로 오르자 판마다 50–150 FE 손해였습니다(중국 서버, 플레이어 1명).',
    rainbow:
      '보라는 한 판에 약 180 FE, 금색은 300+ FE를 돌려주지만, 무지개를 못 띄우면 둘 다 손해입니다(중국 서버 댓글).',
    stack: '플레이어들은 Sandlord 등 빠른 메커니즘과 같은 맵에서 함께 돌립니다.',
    chimera: '**Illusory Chimera**(신발)는 **Timemark 8** 이상 Vorax에서만 나옵니다.',
  },
  shelleyH: 'Intern Shelley(계약령)',
  shelleyP:
    'Antidote Vial 드롭마다 **18%**(Lv 1)에서 **28%**(Lv 6) 확률로 두 배. Lv 6에서는 도구 새로고침 +2와 약병이 한 번 더 열릴 확률 20%도 줍니다.',

  graftH: 'Grafting 한눈에 보기',
  graft: {
    one: 'Vorax Gear는 **한 개**만 착용: Advanced 2, Ultimate 2, Legendary 2개까지, 능력치 요구 없음.',
    normal: '**Normal Organs** → Basic/Advanced 옵션: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → Ultimate 옵션, 89레벨 이상 장비에.',
    core: '**Core Organ + Suture** → Legendary 옵션 1개: Fine은 Sullied, Fine/Precious는 Tenacious, Matchless/Ultimate는 Exquisite.',
    ss14: 'SS14: Ultimate Legendary를 분해하면 **Core Organ 1개**. Core Organ 4종은 Exquisite Suture 20개가 필요합니다(SS13부터).',
  },
  gapsH: '아직 모르는 것',
  gapsP: '중간 약병 기준점, Substance와 장기의 드롭률, 글로벌 서버에서 측정한 시간당 FE.',
};
