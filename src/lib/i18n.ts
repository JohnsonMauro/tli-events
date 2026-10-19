// Site-wide languages and string helpers. Each play sheet keeps its own texts (e.g. src/sheets/ss14/i18n/);
// game names stay in English everywhere: they are what the EN client shows.

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English', hreflang: 'en' },
  { code: 'pt-br', label: 'PT', name: 'Português (Brasil)', hreflang: 'pt-BR' },
  { code: 'de', label: 'DE', name: 'Deutsch', hreflang: 'de' },
  { code: 'es', label: 'ES', name: 'Español', hreflang: 'es' },
  { code: 'fr', label: 'FR', name: 'Français', hreflang: 'fr' },
  { code: 'pl', label: 'PL', name: 'Polski', hreflang: 'pl' },
  { code: 'sv', label: 'SV', name: 'Svenska', hreflang: 'sv' },
  { code: 'ko', label: '한', name: '한국어', hreflang: 'ko' },
  { code: 'ja', label: '日', name: '日本語', hreflang: 'ja' },
  { code: 'zh', label: '中', name: '简体中文', hreflang: 'zh-Hans' },
  { code: 'ru', label: 'RU', name: 'Русский', hreflang: 'ru' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', hreflang: 'vi' },
] as const;
export type Lang = (typeof LANGS)[number]['code'];

export const DEFAULT_LANG: Lang = 'en';

/** BCP 47 tag of a site language (for `<html lang>` and hreflang). */
export const hreflang = (code: Lang): string => LANGS.find((l) => l.code === code)?.hreflang ?? code;

/** Fill {var} placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

/** Escape, then turn **x** into an accent span and !!x!! into a warning span. Strings are ours, not user input. */
export const rich = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<span class="k">$1</span>')
    .replace(/!!(.+?)!!/g, '<span class="no">$1</span>');

/** Site-wide strings (src/layouts/Base.astro): the "new version" notice and the footer ({heart} = the heart icon). */
export const SITE_TEXT: Record<
  Lang,
  {
    newVersion: string;
    reload: string;
    madeWith: string;
    love: string;
    pause: string;
    /** The translation offer (src/lib/lang-offer.ts), shown in this language to readers of it. */
    offer: string;
    offerGo: string;
    offerNever: string;
    offerClose: string;
  }
> = {
  en: {
    newVersion: 'A new version of this page is out.',
    reload: 'Reload',
    madeWith: 'TLI Events, made with {heart}',
    love: 'love',
    pause: 'Pause the heart animation',
    offer: 'This page is also in English.',
    offerGo: 'Read in English',
    offerNever: "Don't show again",
    offerClose: 'Close',
  },
  'pt-br': {
    newVersion: 'Saiu uma versão nova desta página.',
    reload: 'Recarregar',
    madeWith: 'TLI Events, feito com {heart}',
    love: 'amor',
    pause: 'Pausar a animação do coração',
    offer: 'Esta página também está em português.',
    offerGo: 'Ler em português',
    offerNever: 'Não mostrar mais',
    offerClose: 'Fechar',
  },
  de: {
    newVersion: 'Eine neue Version dieser Seite ist da.',
    reload: 'Neu laden',
    madeWith: 'TLI Events, gemacht mit {heart}',
    love: 'Liebe',
    pause: 'Herz-Animation anhalten',
    offer: 'Diese Seite gibt es auch auf Deutsch.',
    offerGo: 'Auf Deutsch lesen',
    offerNever: 'Nicht mehr anzeigen',
    offerClose: 'Schließen',
  },
  es: {
    newVersion: 'Hay una versión nueva de esta página.',
    reload: 'Recargar',
    madeWith: 'TLI Events, hecho con {heart}',
    love: 'amor',
    pause: 'Pausar la animación del corazón',
    offer: 'Esta página también está en español.',
    offerGo: 'Leer en español',
    offerNever: 'No volver a mostrar',
    offerClose: 'Cerrar',
  },
  fr: {
    newVersion: 'Une nouvelle version de cette page est disponible.',
    reload: 'Recharger',
    madeWith: 'TLI Events, fait avec {heart}',
    love: 'amour',
    pause: 'Mettre en pause l’animation du cœur',
    offer: 'Cette page existe aussi en français.',
    offerGo: 'Lire en français',
    offerNever: 'Ne plus afficher',
    offerClose: 'Fermer',
  },
  pl: {
    newVersion: 'Jest nowa wersja tej strony.',
    reload: 'Odśwież',
    madeWith: 'TLI Events, zrobione z {heart}',
    love: 'miłością',
    pause: 'Zatrzymaj animację serca',
    offer: 'Ta strona jest też po polsku.',
    offerGo: 'Czytaj po polsku',
    offerNever: 'Nie pokazuj więcej',
    offerClose: 'Zamknij',
  },
  vi: {
    newVersion: 'Đã có phiên bản mới của trang này.',
    reload: 'Tải lại',
    madeWith: 'TLI Events, làm bằng cả {heart}',
    love: 'tình yêu',
    pause: 'Tạm dừng hiệu ứng trái tim',
    offer: 'Trang này cũng có bằng tiếng Việt.',
    offerGo: 'Đọc bằng tiếng Việt',
    offerNever: 'Không hiện lại',
    offerClose: 'Đóng',
  },
  sv: {
    newVersion: 'Det finns en ny version av den här sidan.',
    reload: 'Ladda om',
    madeWith: 'TLI Events, gjort med {heart}',
    love: 'kärlek',
    pause: 'Pausa hjärtanimationen',
    offer: 'Den här sidan finns också på svenska.',
    offerGo: 'Läs på svenska',
    offerNever: 'Visa inte igen',
    offerClose: 'Stäng',
  },
  ko: {
    newVersion: '이 페이지의 새 버전이 나왔습니다.',
    reload: '새로고침',
    madeWith: 'TLI Events, {heart}을 담아 만듦',
    love: '사랑',
    pause: '하트 애니메이션 일시정지',
    offer: '이 페이지는 한국어로도 볼 수 있습니다.',
    offerGo: '한국어로 보기',
    offerNever: '다시 표시하지 않기',
    offerClose: '닫기',
  },
  ja: {
    newVersion: 'このページの新しいバージョンがあります。',
    reload: '再読み込み',
    madeWith: 'TLI Events、{heart}を込めて',
    love: '愛',
    pause: 'ハートのアニメーションを一時停止',
    offer: 'このページは日本語でも読めます。',
    offerGo: '日本語で読む',
    offerNever: '今後表示しない',
    offerClose: '閉じる',
  },
  zh: {
    newVersion: '本页面有新版本。',
    reload: '刷新',
    madeWith: 'TLI Events，用{heart}制作',
    love: '爱',
    pause: '暂停爱心动画',
    offer: '本页也有简体中文版。',
    offerGo: '阅读中文版',
    offerNever: '不再显示',
    offerClose: '关闭',
  },
  ru: {
    newVersion: 'Вышла новая версия этой страницы.',
    reload: 'Обновить',
    madeWith: 'TLI Events, сделано с {heart}',
    love: 'любовью',
    pause: 'Остановить анимацию сердца',
    offer: 'Эта страница есть и на русском.',
    offerGo: 'Читать на русском',
    offerNever: 'Больше не показывать',
    offerClose: 'Закрыть',
  },
};

/** Site language of a BCP 47 tag (Base.astro gets `lang` as the tag); English when unknown. */
export const langOfTag = (tag: string): Lang => LANGS.find((l) => l.hreflang === tag)?.code ?? DEFAULT_LANG;
