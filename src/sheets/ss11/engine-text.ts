// Texts of the /ss11/ sheet that describe our engine's numbers (events/SS11_Vorax/engine), one block per language.
// Markup as in ./i18n: **x** accent, {var} filled by the page.
import type { Lang } from '../../lib/i18n';

export interface EngineText {
  method: string[];
  firstHint: string;
  secondH: string;
  secondHint: string;
  bestWith: string;
  potH: string;
  potHint: string;
  verdict: { take: string; maybe: string; pass: string };
  played: string;
  unseen: string;
}

export const ENGINE_TEXT: Record<Lang, EngineText> = {
  en: {
    method: [
      '**Rules:** the card texts — every potion and instrument read on SS13–SS14 runs (EN and CN streams), checked against the SS13 and SS14 patch notes. The SS11 patch notes are offline.',
      '**Numbers:** our own simulator plays Surgical Preparation by those cards — {games} runs per test: every first instrument, every second one and every pair.',
      '**Odds:** counted by us on 224 real hands (664 cards) and 44 starting groups from SS13–SS14 streams; what we could not count is a stated assumption in the engine.',
      '**Vial thresholds:** only the ones players confirmed in-game.',
      '**Farm:** SS14 only — videos and comments of the current season, Chinese servers included (their FE prices differ from global).',
      '**Every line is tagged** with where it comes from; a claim nobody measured says so.',
    ],
    firstHint:
      'Our simulator, {games} runs per instrument taken in round 1. Bar: average board when round 13 ends. %: runs that reach {a} on the board — the rainbow, once the fight bonus is added.',
    secondH: 'Second instrument (at {a} and {b})',
    secondHint: 'Taken at the first threshold; the first instrument is our player’s own pick.',
    bestWith: 'Best with',
    potH: 'Potions: take it or pass',
    potHint:
      'How often our player plays each card when a hand shows it. Rarer cards show up less: Normal 3 · Magic 2 · Rare 1 (we counted 224 real hands).',
    verdict: { take: 'take', maybe: 'depends', pass: 'pass' },
    played: 'played in {p} of its hands',
    unseen: 'not seen in SS14 yet',
  },
  'pt-br': {
    method: [
      '**Regras:** o texto das cartas — cada poção e instrumento lido em runs do SS13–SS14 (streams em inglês e em chinês), conferido com as notas de patch do SS13 e do SS14. As notas de patch do SS11 saíram do ar.',
      '**Números:** nosso próprio simulador joga a Surgical Preparation com essas cartas — {games} runs por teste: cada primeiro instrumento, cada segundo e cada par.',
      '**Chances:** contadas por nós em 224 mãos reais (664 cartas) e 44 grupos iniciais de streams do SS13–SS14; o que não deu para contar fica como suposição declarada no motor.',
      '**Faixas dos vials:** só as que os jogadores confirmaram no jogo.',
      '**Farm:** só do SS14 — vídeos e comentários da season atual, servidores chineses incluídos (lá o preço do FE é outro).',
      '**Cada linha diz de onde vem;** o que ninguém mediu aparece como alegação.',
    ],
    firstHint:
      'Nosso simulador, {games} runs por instrumento pego na rodada 1. Barra: tabuleiro médio no fim da rodada 13. %: runs que chegam a {a} no tabuleiro — o arco-íris, somado o bônus da luta.',
    secondH: 'Segundo instrumento (com {a} e {b})',
    secondHint: 'Pego no primeiro limiar; o primeiro instrumento é o que o nosso jogador escolhe.',
    bestWith: 'Melhor com',
    potH: 'Poções: pegar ou passar',
    potHint:
      'Quantas vezes o nosso jogador usa cada carta quando ela aparece na mão. As mais raras aparecem menos: Normal 3 · Magic 2 · Rare 1 (contamos 224 mãos reais).',
    verdict: { take: 'pegue', maybe: 'depende', pass: 'passe' },
    played: 'usada em {p} das mãos em que aparece',
    unseen: 'ainda não vista no SS14',
  },
  es: {
    method: [
      '**Reglas:** el texto de las cartas — cada poción e instrumento leído en partidas de SS13–SS14 (streams en inglés y en chino), contrastado con las notas del parche de SS13 y SS14. Las notas del parche de SS11 ya no están en línea.',
      '**Números:** nuestro propio simulador juega la Surgical Preparation con esas cartas — {games} partidas por prueba: cada primer instrumento, cada segundo y cada pareja.',
      '**Probabilidades:** contadas por nosotros en 224 manos reales (664 cartas) y 44 grupos iniciales de streams de SS13–SS14; lo que no pudimos contar queda como supuesto declarado en el motor.',
      '**Umbrales de los viales:** solo los que los jugadores confirmaron en el juego.',
      '**Farmeo:** solo de SS14 — vídeos y comentarios de la temporada actual, servidores chinos incluidos (allí el FE tiene otro precio).',
      '**Cada línea indica su origen;** lo que nadie midió figura como afirmación.',
    ],
    firstHint:
      'Nuestro simulador, {games} partidas por instrumento tomado en la ronda 1. Barra: tablero medio al acabar la ronda 13. %: partidas que llegan a {a} en el tablero — el arcoíris, sumado el bonus del combate.',
    secondH: 'Segundo instrumento (con {a} y {b})',
    secondHint: 'Tomado en el primer umbral; el primer instrumento lo elige nuestro jugador.',
    bestWith: 'Mejor con',
    potH: 'Pociones: tomar o pasar',
    potHint:
      'Cuántas veces nuestro jugador usa cada carta cuando sale en la mano. Las más raras salen menos: Normal 3 · Magic 2 · Rare 1 (contamos 224 manos reales).',
    verdict: { take: 'tómala', maybe: 'depende', pass: 'pasa' },
    played: 'jugada en el {p} de sus manos',
    unseen: 'aún no vista en SS14',
  },
  de: {
    method: [
      '**Regeln:** die Kartentexte — jeder Trank und jedes Instrument, gelesen in Runs aus SS13–SS14 (englische und chinesische Streams), abgeglichen mit den Patchnotes von SS13 und SS14. Die Patchnotes von SS11 sind offline.',
      '**Zahlen:** unser eigener Simulator spielt die Surgical Preparation mit diesen Karten — {games} Runs pro Test: jedes erste Instrument, jedes zweite und jedes Paar.',
      '**Chancen:** von uns gezählt an 224 echten Händen (664 Karten) und 44 Startgruppen aus Streams von SS13–SS14; was wir nicht zählen konnten, steht als ausgewiesene Annahme im Simulator.',
      '**Schwellen der Phiolen:** nur die, die Spieler im Spiel bestätigt haben.',
      '**Farm:** nur SS14 — Videos und Kommentare der aktuellen Season, chinesische Server eingeschlossen (dort hat FE einen anderen Preis).',
      '**Jede Zeile sagt, woher sie kommt;** was niemand gemessen hat, steht als Behauptung da.',
    ],
    firstHint:
      'Unser Simulator, {games} Runs pro Instrument, genommen in Runde 1. Balken: durchschnittliches Board am Ende von Runde 13. %: Runs, die {a} auf dem Board erreichen — mit dem Kampfbonus der Regenbogen.',
    secondH: 'Zweites Instrument (bei {a} und {b})',
    secondHint: 'An der ersten Schwelle genommen; das erste Instrument wählt unser Spieler selbst.',
    bestWith: 'Am besten mit',
    potH: 'Tränke: nehmen oder nicht',
    potHint:
      'Wie oft unser Spieler eine Karte spielt, wenn sie auf der Hand ist. Seltenere Karten kommen seltener: Normal 3 · Magic 2 · Rare 1 (224 echte Hände gezählt).',
    verdict: { take: 'nehmen', maybe: 'je nachdem', pass: 'lassen' },
    played: 'gespielt in {p} ihrer Hände',
    unseen: 'in SS14 noch nicht gesehen',
  },
  fr: {
    method: [
      '**Règles :** le texte des cartes — chaque potion et chaque instrument lus sur des parties de SS13–SS14 (streams anglais et chinois), recoupés avec les notes de patch de la SS13 et de la SS14. Les notes de patch de la SS11 ne sont plus en ligne.',
      '**Chiffres :** notre propre simulateur joue la Surgical Preparation avec ces cartes — {games} parties par test : chaque premier instrument, chaque second et chaque paire.',
      '**Probabilités :** comptées par nous sur 224 vraies mains (664 cartes) et 44 groupes de départ issus de streams SS13–SS14 ; ce que nous n’avons pas pu compter reste une hypothèse déclarée dans le moteur.',
      '**Seuils des fioles :** seulement ceux que les joueurs ont confirmés en jeu.',
      '**Farm :** SS14 uniquement — vidéos et commentaires de la saison en cours, serveurs chinois compris (le FE n’y a pas le même prix).',
      '**Chaque ligne indique sa source ;** ce que personne n’a mesuré est marqué comme affirmation.',
    ],
    firstHint:
      'Notre simulateur, {games} parties par instrument pris à la manche 1. Barre : plateau moyen à la fin de la manche 13. % : parties qui atteignent {a} sur le plateau — l’arc-en-ciel, une fois le bonus de combat ajouté.',
    secondH: 'Deuxième instrument (à {a} et {b})',
    secondHint: 'Pris au premier seuil ; le premier instrument est le choix de notre joueur.',
    bestWith: 'Idéal avec',
    potH: 'Potions : prendre ou passer',
    potHint:
      'À quelle fréquence notre joueur joue chaque carte quand elle sort dans une main. Les plus rares sortent moins : Normal 3 · Magic 2 · Rare 1 (224 vraies mains comptées).',
    verdict: { take: 'à prendre', maybe: 'selon le plateau', pass: 'à passer' },
    played: 'jouée dans {p} de ses mains',
    unseen: 'pas encore vue en SS14',
  },
  pl: {
    method: [
      '**Zasady:** teksty kart — każda mikstura i każdy instrument odczytane z runów SS13–SS14 (streamy angielskie i chińskie), sprawdzone z patch notes SS13 i SS14. Patch notes SS11 nie są już dostępne.',
      '**Liczby:** nasz własny symulator rozgrywa Surgical Preparation tymi kartami — {games} runów na test: każdy pierwszy instrument, każdy drugi i każda para.',
      '**Szanse:** policzone przez nas na 224 prawdziwych rękach (664 karty) i 44 grupach startowych ze streamów SS13–SS14; czego nie dało się policzyć, jest jawnym założeniem w symulatorze.',
      '**Progi fiolek:** tylko te, które gracze potwierdzili w grze.',
      '**Farma:** tylko SS14 — filmy i komentarze z obecnego sezonu, łącznie z serwerami chińskimi (tam FE ma inną cenę).',
      '**Każda linijka mówi, skąd pochodzi;** czego nikt nie zmierzył, jest oznaczone jako deklaracja.',
    ],
    firstHint:
      'Nasz symulator, {games} runów na instrument wzięty w rundzie 1. Pasek: średnia plansza na koniec rundy 13. %: runy, które dochodzą do {a} na planszy — czyli do tęczy po dodaniu bonusu z walki.',
    secondH: 'Drugi instrument (przy {a} i {b})',
    secondHint: 'Brany przy pierwszym progu; pierwszy instrument wybiera nasz gracz.',
    bestWith: 'Najlepiej z',
    potH: 'Mikstury: brać czy nie',
    potHint:
      'Jak często nasz gracz zagrywa daną kartę, gdy pojawi się w ręce. Rzadsze karty pojawiają się rzadziej: Normal 3 · Magic 2 · Rare 1 (policzyliśmy 224 prawdziwe ręce).',
    verdict: { take: 'bierz', maybe: 'zależy', pass: 'pomiń' },
    played: 'zagrana w {p} rąk, w których się pojawia',
    unseen: 'jeszcze niewidziana w SS14',
  },
  sv: {
    method: [
      '**Regler:** korttexterna — varje dryck och varje instrument lästa i körningar från SS13–SS14 (engelska och kinesiska streams), stämda av mot patchnoterna för SS13 och SS14. Patchnoterna för SS11 är borta.',
      '**Siffror:** vår egen simulator spelar Surgical Preparation med de korten — {games} körningar per test: varje första instrument, varje andra och varje par.',
      '**Odds:** räknade av oss på 224 riktiga händer (664 kort) och 44 startgrupper från streams i SS13–SS14; det vi inte kunde räkna är ett uttalat antagande i simulatorn.',
      '**Flaskornas trösklar:** bara de som spelare har bekräftat i spelet.',
      '**Farm:** bara SS14 — videor och kommentarer från den pågående säsongen, kinesiska servrar inräknade (där har FE ett annat pris).',
      '**Varje rad säger var den kommer ifrån;** sådant som ingen har mätt står som påstående.',
    ],
    firstHint:
      'Vår simulator, {games} körningar per instrument som tas i runda 1. Stapel: genomsnittligt bräde när runda 13 slutar. %: körningar som når {a} på brädet — regnbågen, när stridsbonusen räknas in.',
    secondH: 'Andra instrumentet (vid {a} och {b})',
    secondHint: 'Tas vid första tröskeln; det första instrumentet väljer vår spelare själv.',
    bestWith: 'Bäst med',
    potH: 'Drycker: ta eller låt bli',
    potHint:
      'Hur ofta vår spelare spelar ett kort när det dyker upp i handen. Ovanligare kort dyker upp mer sällan: Normal 3 · Magic 2 · Rare 1 (vi räknade 224 riktiga händer).',
    verdict: { take: 'ta', maybe: 'beror på', pass: 'låt bli' },
    played: 'spelas i {p} av händerna där det dyker upp',
    unseen: 'inte sedd i SS14 än',
  },
  ko: {
    method: [
      '**규칙:** 카드 텍스트 — SS13–SS14 판(영어·중국어 방송)에서 읽은 모든 물약과 도구를 SS13·SS14 패치 노트와 대조했습니다. SS11 패치 노트는 내려갔습니다.',
      '**수치:** 우리 시뮬레이터가 이 카드들로 Surgical Preparation을 직접 플레이합니다 — 테스트마다 {games}판: 모든 첫 도구, 모든 두 번째 도구, 모든 조합.',
      '**확률:** SS13–SS14 방송의 실제 패 224개(카드 664장)와 시작 그룹 44개를 직접 셌습니다. 셀 수 없던 부분은 시뮬레이터에 가정으로 명시했습니다.',
      '**약병 기준점:** 플레이어가 게임에서 확인한 값만.',
      '**파밍:** SS14만 — 이번 시즌의 영상과 댓글, 중국 서버 포함(FE 시세가 다릅니다).',
      '**모든 줄에 출처를 표시했습니다.** 아무도 측정하지 않은 내용은 주장으로 표시합니다.',
    ],
    firstHint:
      '우리 시뮬레이터, 1라운드에 고른 도구마다 {games}판. 막대: 13라운드가 끝날 때의 평균 보드. %: 보드가 {a}에 도달한 판 — 전투 보너스를 더하면 무지개입니다.',
    secondH: '두 번째 도구({a}와 {b}에서)',
    secondHint: '첫 기준점에서 고른 경우이며, 첫 도구는 우리 플레이어가 직접 고릅니다.',
    bestWith: '잘 맞는 조합',
    potH: '물약: 고를까, 넘길까',
    potHint:
      '패에 나왔을 때 우리 플레이어가 그 카드를 쓰는 비율입니다. 희귀한 카드일수록 덜 나옵니다: Normal 3 · Magic 2 · Rare 1(실제 패 224개를 셌습니다).',
    verdict: { take: '고르기', maybe: '상황에 따라', pass: '넘기기' },
    played: '나온 패의 {p}에서 사용',
    unseen: 'SS14에서는 아직 못 봄',
  },
  ja: {
    method: [
      '**ルール：** カードのテキスト。SS13〜SS14のプレイ（英語・中国語の配信）で全ての薬と器具を読み取り、SS13とSS14のパッチノートと照合した。SS11のパッチノートは公開終了。',
      '**数値：** 自前のシミュレーターがそのカードでSurgical Preparationをプレイする。テストごとに{games}回：全ての最初の器具、全ての2つ目、全ての組み合わせ。',
      '**確率：** SS13〜SS14の配信から、実際の手札224回（カード664枚）と開始時の群れ44組を自分たちで数えた。数えられなかった部分はシミュレーター内の明示した仮定。',
      '**薬瓶のしきい値：** プレイヤーがゲーム内で確認した値だけ。',
      '**ファーム：** SS14のみ。今シーズンの動画とコメントで、中国サーバーも含む（FEの相場は違う）。',
      '**各行に出典の種類を付けている。** 誰も計測していない情報は「主張」と表示。',
    ],
    firstHint:
      '自前のシミュレーター、1ラウンド目に取った器具ごとに{games}回。バー：13ラウンド終了時の平均盤面。%：盤面が{a}に届いた回の割合 — 戦闘ボーナスを足すと虹。',
    secondH: '2つ目の器具（{a}と{b}）',
    secondHint: '最初のしきい値で取った場合。最初の器具はこちらのプレイヤーが自分で選ぶ。',
    bestWith: '相性が良い',
    potH: '薬：取るか見送るか',
    potHint:
      '手札に出たとき、こちらのプレイヤーがそのカードを使う割合。レアなカードほど出にくい：Normal 3 · Magic 2 · Rare 1（実際の手札224回を数えた）。',
    verdict: { take: '取る', maybe: '状況次第', pass: '見送る' },
    played: '出た手札の{p}で使用',
    unseen: 'SS14ではまだ見ていない',
  },
  zh: {
    method: [
      '**规则：** 卡牌原文——每张药剂和器具都从 SS13–SS14 的对局（英文和中文直播）中读取，并与 SS13、SS14 更新日志核对。SS11 的更新日志已下线。',
      '**数据：** 我们自己的模拟器按这些卡牌打 Surgical Preparation——每项测试 {games} 局：每个开局器具、每个第二器具、每种组合。',
      '**概率：** 由我们在 SS13–SS14 直播中实际数出：224 手真实手牌（664 张卡）和 44 组开局怪物；数不到的部分在模拟器中作为明确的假设。',
      '**解药罐分数线：** 只列玩家在游戏里确认过的。',
      '**搬砖：** 只看 SS14——本赛季的视频和评论，包括国服（火的价格和国际服不同）。',
      '**每一行都标了来源；** 没人实测的内容标为“说法”。',
    ],
    firstHint:
      '我们的模拟器，第 1 回合拿的每个器具各 {games} 局。条：第 13 回合结束时的平均盘面。%：盘面达到 {a} 的局数占比——加上战斗加成就是彩罐。',
    secondH: '第二个器具（{a} 和 {b} 时）',
    secondHint: '在第一个分数线拿；开局器具由我们的玩家自己选。',
    bestWith: '最佳搭配',
    potH: '药剂：拿还是不拿',
    potHint:
      '某张卡出现在手牌里时，我们的玩家使用它的比例。越稀有的卡出现得越少：Normal 3 · Magic 2 · Rare 1（实际数了 224 手）。',
    verdict: { take: '拿', maybe: '看情况', pass: '不拿' },
    played: '出现时 {p} 会被使用',
    unseen: 'SS14 中尚未见到',
  },
  ru: {
    method: [
      '**Правила:** тексты карт — каждое зелье и каждый инструмент прочитаны в забегах SS13–SS14 (английские и китайские стримы) и сверены с патчноутами SS13 и SS14. Патчноуты SS11 больше не доступны.',
      '**Цифры:** наш собственный симулятор играет Surgical Preparation этими картами — {games} забегов на тест: каждый первый инструмент, каждый второй и каждая пара.',
      '**Шансы:** посчитаны нами на 224 настоящих руках (664 карты) и 44 стартовых группах со стримов SS13–SS14; то, что посчитать не удалось, — явное допущение в симуляторе.',
      '**Пороги флаконов:** только те, что игроки подтвердили в игре.',
      '**Фарм:** только SS14 — видео и комментарии текущего сезона, включая китайские серверы (там у FE другая цена).',
      '**У каждой строки указан источник;** то, что никто не измерял, помечено как заявление.',
    ],
    firstHint:
      'Наш симулятор, {games} забегов на каждый инструмент, взятый в 1-м раунде. Полоса: средняя доска к концу 13-го раунда. %: забеги, где доска доходит до {a}, — с бонусом за бой это радуга.',
    secondH: 'Второй инструмент (при {a} и {b})',
    secondHint: 'Берётся на первом пороге; первый инструмент выбирает наш игрок.',
    bestWith: 'Лучше всего с',
    potH: 'Зелья: брать или нет',
    potHint:
      'Как часто наш игрок играет карту, когда она приходит в руку. Более редкие карты приходят реже: Normal 3 · Magic 2 · Rare 1 (мы посчитали 224 настоящие руки).',
    verdict: { take: 'брать', maybe: 'по ситуации', pass: 'пропускать' },
    played: 'сыграна в {p} рук, где пришла',
    unseen: 'в SS14 пока не встречалась',
  },
  vi: {
    method: [
      '**Luật chơi:** chữ trên thẻ — mọi lọ thuốc và dụng cụ đều được đọc từ các lượt chơi SS13–SS14 (stream tiếng Anh và tiếng Trung), đối chiếu với ghi chú cập nhật SS13 và SS14. Ghi chú cập nhật SS11 không còn trên mạng.',
      '**Con số:** trình mô phỏng của chúng tôi tự chơi Surgical Preparation bằng các thẻ đó — {games} lượt mỗi phép thử: mọi dụng cụ đầu tiên, mọi dụng cụ thứ hai và mọi cặp.',
      '**Tỉ lệ:** do chúng tôi tự đếm trên 224 tay bài thật (664 thẻ) và 44 nhóm quái khởi đầu từ stream SS13–SS14; phần không đếm được là giả định ghi rõ trong trình mô phỏng.',
      '**Mốc lọ thuốc:** chỉ những mốc người chơi đã xác nhận trong game.',
      '**Farm:** chỉ SS14 — video và bình luận của mùa hiện tại, kể cả máy chủ Trung Quốc (ở đó FE có giá khác).',
      '**Mỗi dòng đều ghi nguồn;** điều chưa ai đo được ghi là lời khẳng định.',
    ],
    firstHint:
      'Trình mô phỏng của chúng tôi, {games} lượt cho mỗi dụng cụ lấy ở vòng 1. Thanh: bàn trung bình khi hết vòng 13. %: số lượt bàn đạt {a} — tức lọ cầu vồng khi cộng điểm thưởng trận đánh.',
    secondH: 'Dụng cụ thứ hai (ở {a} và {b})',
    secondHint: 'Lấy ở mốc đầu tiên; dụng cụ đầu tiên do người chơi của chúng tôi tự chọn.',
    bestWith: 'Hợp nhất với',
    potH: 'Lọ thuốc: lấy hay bỏ',
    potHint:
      'Tỉ lệ người chơi của chúng tôi dùng mỗi thẻ khi nó xuất hiện trong tay. Thẻ hiếm hơn ít xuất hiện hơn: Normal 3 · Magic 2 · Rare 1 (đã đếm 224 tay bài thật).',
    verdict: { take: 'lấy', maybe: 'tùy bàn', pass: 'bỏ' },
    played: 'được dùng ở {p} số tay có nó',
    unseen: 'chưa thấy trong SS14',
  },
};
