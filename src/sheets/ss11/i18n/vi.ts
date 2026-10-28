import type { Dict } from './en';

export const vi: Dict = {
  title: 'Vorax — Bảng tóm tắt',
  desc: 'Vorax trong SS14: cách Surgical Preparation tính điểm, dụng cụ nên lấy đầu tiên, các mốc lọ thuốc, compass nào có lời và cách Grafting hoạt động.',
  back: 'Tất cả sự kiện',
  h1: 'Vorax',
  lead: 'Ra mắt cùng **SS11** (tháng 1/2026) và vẫn còn trong game. Luật chơi từ phần tìm hiểu SS11; farm và chiến thuật cho **SS14 Tartarus**.',
  tags: { o: 'trong game', p: 'người chơi', c: 'lời khẳng định' },
  tagsH: 'Nguồn của từng dòng',

  loopH: 'Vorax hoạt động thế nào',
  steps: [
    {
      h: 'Thu thập',
      p: 'Hạ những **Vorax Elites** đỏ thẫm trên bản đồ Netherrealm: chúng rơi **Vorax Substance**. **{a}** cái mở một lượt Surgical Preparation; bạn giữ được tối đa **{b}**.',
    },
    {
      h: 'Chuẩn bị',
      p: '**Surgical Preparation** ở phòng khám của Shelley: **6 bể** chứa các nhóm quái, **13 vòng**. Điểm số, **Ultimate Activity**, là Activity × Quantity cộng trên cả 6 bể.',
    },
    {
      h: 'Chiến đấu',
      p: 'Trong **Operating Theater**, các nhóm quái của bạn kéo đến theo đợt. Điểm cuối cùng tô màu **6 Antidote Vial**: trắng → tím → đỏ, và một lọ cầu vồng.',
    },
    {
      h: 'Ghép',
      p: 'Chiến lợi phẩm dùng cho **Grafting** trên Vorax Gear: nội tạng và chỉ khâu thêm dòng chỉ số lấy từ trang bị khác.',
    },
  ],
  rulesH: 'Những luật quyết định một lượt',
  rules: {
    rounds: 'Vòng 1–10: dùng 1 trong 3 lọ thuốc. Vòng 11–13: hết thuốc, chỉ còn dụng cụ tự hoạt động.',
    instruments:
      'Dụng cụ: một cái ở vòng 1, thêm một cái khi đạt **{a}** và **{b}** Ultimate Activity — không tốn vòng.',
    refresh: '**3** lần làm mới thuốc mỗi lượt; Intern Shelley cho thêm tối đa **2** lần làm mới dụng cụ.',
    abandon: '!!Bỏ trước khi đánh là mất Substance.!! Có lọ cầu vồng rồi thì bỏ để nhận thưởng.',
    risk: 'Surgical Risk thấp / vừa / cao: +5 / 10 / 20% Activity mỗi lần hạ quái, −1 / 2 / 5% Ultimate Activity mỗi lần chết.',
  },

  winH: 'Thắng phần chuẩn bị',
  firstH: 'Dụng cụ đầu tiên',
  patternsH: 'Quy luật',
  patterns: {
    fuse: '**Thêm rồi hợp nhất:** cứ thêm quái, gom chúng thành vài nhóm thật lớn, rồi dồn Quantity và Activity vào đó.',
    pests: '**Pest là đường chắc nhất:** có 2 nhóm Pest sớm, và đừng hợp nhất hay đột biến mất chúng.',
    tank: '**Chừa một bể trống:** thêm quái khi cả 6 bể đã đầy sẽ thất bại và không kích hoạt gì.',
    kit: '**Mở Potion Kit thay vì làm mới:** được lựa chọn mới mà vẫn giữ lượt làm mới.',
    xeno: '**Xenopanacea** (+333 Activity hoặc Quantity, biến quái thành Aemberon): rất mạnh với nhóm lớn nhất, yếu với nhóm nhỏ.',
    aim: '**Nhắm tới {a} trước trận đánh:** điểm thưởng trận đánh thường đưa bạn tới lọ cầu vồng.',
  },
  practice: 'Luyện một bàn trên Vorax Simulator của cộng đồng',

  vialsH: 'Điểm số đổi được gì',
  vialCols: ['Ultimate Activity', 'Lọ'],
  vials: {
    purple1: 'lọ tím đầu tiên',
    red1: 'lọ đỏ đầu tiên',
    red4: 'lọ đỏ thứ 4, 5, 6',
    rainbow: 'cầu vồng (chỉ một lọ)',
  },
  vialsNote:
    'Lọ tím 2–6 và lọ đỏ 2–3 nằm ở giữa (chưa xác nhận trong game). Quá mốc cầu vồng, điểm cao hơn không cho thêm gì.',

  farmH: 'Farm trong SS14',
  compassH: 'Compass',
  compass: {
    blue: 'nhóm quái Vorax xuất hiện trên bản đồ; quái +10% máu.',
    purple: '+30% máu; mỗi nhóm Vorax bị dọn sẽ gọi một Scavenger: mỗi con +8% số lọ rơi.',
    gold: '+70% máu; rơi thêm Surgical Protocol, +2 Rare Protocol; Severe Symptoms.',
  },
  colours: { blue: 'xanh', purple: 'tím', gold: 'vàng' },
  tierP:
    'Theo độ khó: **T8** xanh · **Profound** xanh hoặc tím · **Deep Space** tím hoặc vàng — vàng chỉ khi Intern Shelley mạnh và bạn đã quen tay.',
  farm: {
    price:
      '!!Xem giá compass trước.!! Một lượt dùng compass vàng kiếm 2.500–3.000 FE/giờ vào ngày 3–5, rồi lỗ 50–150 FE mỗi lượt khi compass lên 50–60 FE (máy chủ Trung Quốc, một người chơi).',
    rainbow:
      'Compass tím thu lại khoảng 180 FE mỗi lượt, vàng hơn 300 — cả hai đều lỗ khi không ra lọ cầu vồng (bình luận ở máy chủ Trung Quốc).',
    stack: 'Người chơi chạy nó trên cùng bản đồ với Sandlord và các cơ chế nhanh khác.',
    chimera: '**Illusory Chimera** (giày) chỉ rơi từ Vorax, từ **Timemark 8** trở lên.',
  },
  shelleyH: 'Intern Shelley (pactspirit)',
  shelleyP:
    'Mỗi Antidote Vial rơi ra có **18%** (cấp 1) đến **28%** (cấp 6) cơ hội nhân đôi; ở cấp 6 còn có +2 lần làm mới dụng cụ và 20% cơ hội một lọ mở thêm lần nữa.',

  graftH: 'Grafting trong nháy mắt',
  graft: {
    one: 'Chỉ mặc **một** món Vorax Gear: tối đa 2 dòng Advanced, 2 Ultimate và 2 Legendary, không yêu cầu chỉ số.',
    normal: '**Normal Organs** → dòng Basic/Advanced: Rotten T5–T3, Inert T2, Vital T2–T0.',
    flawless: '**Flawless Organs** → dòng Ultimate, trên trang bị cấp 89 trở lên.',
    core: '**Core Organ + Suture** → một dòng Legendary: Sullied cho Fine, Tenacious cho Fine/Precious, Exquisite cho Matchless/Ultimate.',
    ss14: 'SS14: phân rã một Ultimate Legendary được **1 Core Organ**; bốn Core Organ cần 20 Exquisite Suture (từ SS13).',
  },
  gapsH: 'Chưa rõ',
  gapsP: 'Các mốc lọ ở giữa, tỉ lệ rơi Substance và nội tạng, và FE/giờ đo trên máy chủ quốc tế.',
};
