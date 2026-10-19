// Texts of the home page (the event list, src/components/HomePage.astro) and of the 404 page, in every site
// language. Event names and game names stay in English; each event's card text is in its guide's frontmatter.
import type { Lang } from '../lib/i18n';

export interface HomeText {
  title: string;
  desc: string;
  tagline: string;
  lead: string;
  events: string;
  /** Above each card: {code} and {date} (the launch date, formatted for the language). */
  since: string;
  nfTitle: string;
  nfDesc: string;
  nfTagline: string;
  /** {link} = nfLink, a link to the event list. */
  nfLead: string;
  nfLink: string;
}

export const HOME_TEXT: Record<Lang, HomeText> = {
  en: {
    title: 'TLI Events — Torchlight: Infinite season strategy',
    desc: 'Torchlight: Infinite season event strategy: rules, odds and picks, backed by sources.',
    tagline: 'Torchlight: Infinite season mechanics, decoded.',
    lead: 'One page per season event: the rules that matter, what to pick and when — built from live runs, official cards and simulators. Community research; not affiliated with XD Games.',
    events: 'Events',
    since: '{code} since {date}',
    nfTitle: 'Page not found · TLI Events',
    nfDesc: "This page doesn't exist.",
    nfTagline: 'This cell is empty.',
    nfLead: 'The page moved or never existed. Pick an event below, or go back to the {link}.',
    nfLink: 'event list',
  },
  'pt-br': {
    title: 'TLI Events — estratégia das temporadas de Torchlight: Infinite',
    desc: 'Estratégia dos eventos de temporada de Torchlight: Infinite: regras, chances e escolhas, com fontes.',
    tagline: 'As mecânicas de temporada de Torchlight: Infinite, decifradas.',
    lead: 'Uma página por evento de temporada: as regras que importam, o que escolher e quando — feita a partir de runs ao vivo, cards oficiais e simuladores. Pesquisa da comunidade; sem vínculo com a XD Games.',
    events: 'Eventos',
    since: '{code} desde {date}',
    nfTitle: 'Página não encontrada · TLI Events',
    nfDesc: 'Esta página não existe.',
    nfTagline: 'Esta cela está vazia.',
    nfLead: 'A página mudou de lugar ou nunca existiu. Escolha um evento abaixo ou volte para a {link}.',
    nfLink: 'lista de eventos',
  },
  de: {
    title: 'TLI Events — Strategie für die Saisons von Torchlight: Infinite',
    desc: 'Strategie für die Saison-Events von Torchlight: Infinite: Regeln, Chancen und Entscheidungen, mit Quellen.',
    tagline: 'Die Saisonmechaniken von Torchlight: Infinite, entschlüsselt.',
    lead: 'Eine Seite pro Saison-Event: die Regeln, die zählen, was du wann wählen solltest — aus Live-Runs, offiziellen Karten und Simulatoren. Community-Recherche; nicht mit XD Games verbunden.',
    events: 'Events',
    since: '{code} seit {date}',
    nfTitle: 'Seite nicht gefunden · TLI Events',
    nfDesc: 'Diese Seite gibt es nicht.',
    nfTagline: 'Diese Zelle ist leer.',
    nfLead: 'Die Seite wurde verschoben oder hat nie existiert. Wähle unten ein Event oder geh zurück zur {link}.',
    nfLink: 'Event-Liste',
  },
  es: {
    title: 'TLI Events — estrategia de las temporadas de Torchlight: Infinite',
    desc: 'Estrategia de los eventos de temporada de Torchlight: Infinite: reglas, probabilidades y elecciones, con fuentes.',
    tagline: 'Las mecánicas de temporada de Torchlight: Infinite, descifradas.',
    lead: 'Una página por evento de temporada: las reglas que importan, qué elegir y cuándo — hecha con partidas reales, cartas oficiales y simuladores. Investigación de la comunidad; sin relación con XD Games.',
    events: 'Eventos',
    since: '{code} desde el {date}',
    nfTitle: 'Página no encontrada · TLI Events',
    nfDesc: 'Esta página no existe.',
    nfTagline: 'Esta celda está vacía.',
    nfLead: 'La página se movió o nunca existió. Elige un evento abajo o vuelve a la {link}.',
    nfLink: 'lista de eventos',
  },
  fr: {
    title: 'TLI Events — stratégie des saisons de Torchlight: Infinite',
    desc: "Stratégie des événements de saison de Torchlight: Infinite : règles, probabilités et choix, sources à l'appui.",
    tagline: 'Les mécaniques de saison de Torchlight: Infinite, décryptées.',
    lead: 'Une page par événement de saison : les règles qui comptent, quoi choisir et quand — construite à partir de parties réelles, de cartes officielles et de simulateurs. Recherche communautaire ; sans lien avec XD Games.',
    events: 'Événements',
    since: '{code} depuis le {date}',
    nfTitle: 'Page introuvable · TLI Events',
    nfDesc: "Cette page n'existe pas.",
    nfTagline: 'Cette cellule est vide.',
    nfLead: "La page a été déplacée ou n'a jamais existé. Choisissez un événement ci-dessous, ou revenez à la {link}.",
    nfLink: 'liste des événements',
  },
  pl: {
    title: 'TLI Events — strategia sezonów Torchlight: Infinite',
    desc: 'Strategia wydarzeń sezonowych Torchlight: Infinite: zasady, szanse i wybory, z podanymi źródłami.',
    tagline: 'Mechaniki sezonowe Torchlight: Infinite — rozszyfrowane.',
    lead: 'Jedna strona na każde wydarzenie sezonowe: zasady, które się liczą, co i kiedy wybierać — na podstawie prawdziwych runów, oficjalnych kart i symulatorów. Badania społeczności; bez związku z XD Games.',
    events: 'Wydarzenia',
    since: '{code} od {date}',
    nfTitle: 'Nie znaleziono strony · TLI Events',
    nfDesc: 'Ta strona nie istnieje.',
    nfTagline: 'Ta cela jest pusta.',
    nfLead: 'Strona została przeniesiona albo nigdy nie istniała. Wybierz wydarzenie poniżej albo wróć do {link}.',
    nfLink: 'listy wydarzeń',
  },
  sv: {
    title: 'TLI Events — strategi för säsongerna i Torchlight: Infinite',
    desc: 'Strategi för säsongsevenemangen i Torchlight: Infinite: regler, odds och val, med källor.',
    tagline: 'Säsongsmekanikerna i Torchlight: Infinite, avkodade.',
    lead: 'En sida per säsongsevenemang: reglerna som spelar roll, vad du ska välja och när — byggd på riktiga runs, officiella kort och simulatorer. Communityforskning; inte knuten till XD Games.',
    events: 'Evenemang',
    since: '{code} sedan {date}',
    nfTitle: 'Sidan hittades inte · TLI Events',
    nfDesc: 'Den här sidan finns inte.',
    nfTagline: 'Den här cellen är tom.',
    nfLead: 'Sidan har flyttats eller har aldrig funnits. Välj ett evenemang nedan, eller gå tillbaka till {link}.',
    nfLink: 'evenemangslistan',
  },
  ko: {
    title: 'TLI Events — Torchlight: Infinite 시즌 공략',
    desc: 'Torchlight: Infinite 시즌 이벤트 공략: 규칙, 확률, 선택 — 출처와 함께.',
    tagline: 'Torchlight: Infinite 시즌 메커니즘, 해독 완료.',
    lead: '시즌 이벤트마다 한 페이지: 중요한 규칙, 무엇을 언제 고를지 — 실제 플레이, 공식 카드, 시뮬레이터를 바탕으로 만들었습니다. 커뮤니티 연구이며 XD Games와는 관련이 없습니다.',
    events: '이벤트',
    since: '{code} · {date} 시작',
    nfTitle: '페이지를 찾을 수 없음 · TLI Events',
    nfDesc: '이 페이지는 존재하지 않습니다.',
    nfTagline: '이 칸은 비어 있습니다.',
    nfLead: '페이지가 옮겨졌거나 처음부터 없었습니다. 아래에서 이벤트를 고르거나 {link}으로 돌아가세요.',
    nfLink: '이벤트 목록',
  },
  ja: {
    title: 'TLI Events — Torchlight: Infinite シーズン攻略',
    desc: 'Torchlight: Infinite のシーズンイベント攻略：ルール、確率、選択を出典付きで。',
    tagline: 'Torchlight: Infinite のシーズンメカニクスを解読。',
    lead: 'シーズンイベントごとに1ページ：大事なルール、何をいつ選ぶか — 実際のプレイ、公式カード、シミュレーターをもとに作成。コミュニティによる調査で、XD Games とは無関係です。',
    events: 'イベント',
    since: '{code}・{date}開始',
    nfTitle: 'ページが見つかりません · TLI Events',
    nfDesc: 'このページは存在しません。',
    nfTagline: 'このマスは空です。',
    nfLead: 'ページは移動したか、最初から存在しません。下のイベントを選ぶか、{link}に戻ってください。',
    nfLink: 'イベント一覧',
  },
  zh: {
    title: 'TLI Events — Torchlight: Infinite 赛季攻略',
    desc: 'Torchlight: Infinite 赛季活动攻略：规则、概率与选择，均附来源。',
    tagline: 'Torchlight: Infinite 赛季机制，一一拆解。',
    lead: '每个赛季活动一页：真正重要的规则、该选什么、何时选——基于实战、官方卡牌和模拟器。社区研究，与 XD Games 无关。',
    events: '活动',
    since: '{code} · {date} 开始',
    nfTitle: '找不到页面 · TLI Events',
    nfDesc: '此页面不存在。',
    nfTagline: '这一格是空的。',
    nfLead: '页面已移动或从未存在。请在下方选择一个活动，或返回{link}。',
    nfLink: '活动列表',
  },
  ru: {
    title: 'TLI Events — стратегия сезонов Torchlight: Infinite',
    desc: 'Стратегия сезонных событий Torchlight: Infinite: правила, шансы и выбор — со ссылками на источники.',
    tagline: 'Сезонные механики Torchlight: Infinite, разобранные по полочкам.',
    lead: 'Одна страница на каждое сезонное событие: правила, которые важны, что и когда выбирать — по реальным забегам, официальным картам и симуляторам. Исследование сообщества; не связано с XD Games.',
    events: 'События',
    since: '{code} с {date}',
    nfTitle: 'Страница не найдена · TLI Events',
    nfDesc: 'Такой страницы нет.',
    nfTagline: 'Эта клетка пуста.',
    nfLead: 'Страница переехала или никогда не существовала. Выберите событие ниже или вернитесь к {link}.',
    nfLink: 'списку событий',
  },
  vi: {
    title: 'TLI Events — chiến thuật mùa giải Torchlight: Infinite',
    desc: 'Chiến thuật sự kiện mùa giải Torchlight: Infinite: luật, tỉ lệ và lựa chọn, đều có nguồn.',
    tagline: 'Cơ chế mùa giải Torchlight: Infinite, giải mã.',
    lead: 'Mỗi sự kiện mùa giải một trang: những luật quan trọng, chọn gì và khi nào — dựa trên lượt chơi thật, thẻ chính thức và trình mô phỏng. Nghiên cứu của cộng đồng; không liên quan đến XD Games.',
    events: 'Sự kiện',
    since: '{code} từ {date}',
    nfTitle: 'Không tìm thấy trang · TLI Events',
    nfDesc: 'Trang này không tồn tại.',
    nfTagline: 'Ô này trống.',
    nfLead: 'Trang đã được chuyển hoặc chưa từng tồn tại. Chọn một sự kiện bên dưới, hoặc quay lại {link}.',
    nfLink: 'danh sách sự kiện',
  },
};

/** A launch date (YYYY-MM-DD) as the language writes it. */
export const formatDate = (iso: string, hreflang: string) =>
  new Intl.DateTimeFormat(hreflang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
