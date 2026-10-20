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
    /** The header's light/dark switch: its accessible name and tooltip. */
    theme: string;
    /** The header's Feedback button and its dialog (src/lib/feedback.ts): opens a GitHub issue, filled. */
    fbBtn: string;
    fbTitle: string;
    fbLabel: string;
    fbHint: string;
    fbSend: string;
    fbEmpty: string;
    fbLong: string;
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
    theme: 'Switch between light and dark theme',
    fbBtn: 'Feedback',
    fbTitle: 'Send feedback',
    fbLabel: 'What should we fix, add or explain better?',
    fbHint:
      'Opens GitHub in a new tab with your text ready to post — you need a GitHub account, and the post is public. The page you are on and its language go along.',
    fbSend: 'Continue on GitHub',
    fbEmpty: 'Write something first.',
    fbLong: 'Too long for one GitHub link. Shorten it here and add the rest on GitHub.',
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
    theme: 'Alternar entre tema claro e escuro',
    fbBtn: 'Feedback',
    fbTitle: 'Enviar feedback',
    fbLabel: 'O que devemos corrigir, acrescentar ou explicar melhor?',
    fbHint:
      'Abre o GitHub numa nova aba com o seu texto pronto para publicar — é preciso ter conta no GitHub, e o que você publicar fica visível para todos. A página em que você está e o idioma vão junto.',
    fbSend: 'Continuar no GitHub',
    fbEmpty: 'Escreva algo primeiro.',
    fbLong: 'Longo demais para um link do GitHub. Encurte aqui e complete no GitHub.',
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
    theme: 'Zwischen hellem und dunklem Design wechseln',
    fbBtn: 'Feedback',
    fbTitle: 'Feedback senden',
    fbLabel: 'Was sollen wir korrigieren, ergänzen oder besser erklären?',
    fbHint:
      'Öffnet GitHub in einem neuen Tab, dein Text ist schon eingetragen — du brauchst ein GitHub-Konto, und der Beitrag ist öffentlich. Die aktuelle Seite und ihre Sprache werden mitgeschickt.',
    fbSend: 'Weiter auf GitHub',
    fbEmpty: 'Schreib zuerst etwas.',
    fbLong: 'Zu lang für einen GitHub-Link. Kürze den Text hier und ergänze den Rest auf GitHub.',
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
    theme: 'Cambiar entre tema claro y oscuro',
    fbBtn: 'Comentarios',
    fbTitle: 'Enviar comentarios',
    fbLabel: '¿Qué deberíamos corregir, añadir o explicar mejor?',
    fbHint:
      'Abre GitHub en una pestaña nueva con tu texto listo para publicar — necesitas una cuenta de GitHub y lo que publiques será público. La página en la que estás y su idioma van incluidos.',
    fbSend: 'Continuar en GitHub',
    fbEmpty: 'Escribe algo primero.',
    fbLong: 'Demasiado largo para un enlace de GitHub. Acórtalo aquí y añade el resto en GitHub.',
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
    theme: 'Basculer entre thème clair et sombre',
    fbBtn: 'Avis',
    fbTitle: 'Donner votre avis',
    fbLabel: 'Que devrions-nous corriger, ajouter ou mieux expliquer ?',
    fbHint:
      'Ouvre GitHub dans un nouvel onglet avec votre texte prêt à publier — un compte GitHub est nécessaire, et ce que vous publiez est visible de tous. La page où vous êtes et sa langue sont jointes.',
    fbSend: 'Continuer sur GitHub',
    fbEmpty: "Écrivez d'abord quelque chose.",
    fbLong: 'Trop long pour un lien GitHub. Raccourcissez-le ici et ajoutez le reste sur GitHub.',
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
    theme: 'Przełącz między jasnym a ciemnym motywem',
    fbBtn: 'Opinia',
    fbTitle: 'Wyślij opinię',
    fbLabel: 'Co powinniśmy poprawić, dodać albo lepiej wyjaśnić?',
    fbHint:
      'Otwiera GitHub w nowej karcie z gotowym tekstem do opublikowania — potrzebne jest konto GitHub, a wpis będzie publiczny. Dołączamy stronę, na której jesteś, i jej język.',
    fbSend: 'Przejdź do GitHuba',
    fbEmpty: 'Najpierw coś napisz.',
    fbLong: 'Za długie na jeden link do GitHuba. Skróć tutaj, a resztę dopisz na GitHubie.',
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
    theme: 'Chuyển giữa giao diện sáng và tối',
    fbBtn: 'Góp ý',
    fbTitle: 'Gửi góp ý',
    fbLabel: 'Chúng tôi nên sửa, thêm hoặc giải thích rõ hơn điều gì?',
    fbHint:
      'Mở GitHub trong thẻ mới với nội dung của bạn đã điền sẵn (cần tài khoản GitHub, và bài đăng sẽ công khai). Trang bạn đang xem và ngôn ngữ của nó sẽ được gửi kèm.',
    fbSend: 'Tiếp tục trên GitHub',
    fbEmpty: 'Hãy viết gì đó trước.',
    fbLong: 'Quá dài cho một liên kết GitHub. Hãy rút gọn ở đây và bổ sung phần còn lại trên GitHub.',
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
    theme: 'Växla mellan ljust och mörkt tema',
    fbBtn: 'Feedback',
    fbTitle: 'Skicka feedback',
    fbLabel: 'Vad ska vi rätta, lägga till eller förklara bättre?',
    fbHint:
      'Öppnar GitHub i en ny flik med din text klar att publicera — du behöver ett GitHub-konto, och inlägget blir offentligt. Sidan du är på och dess språk följer med.',
    fbSend: 'Fortsätt på GitHub',
    fbEmpty: 'Skriv något först.',
    fbLong: 'För långt för en GitHub-länk. Korta ner det här och lägg till resten på GitHub.',
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
    theme: '밝은 테마와 어두운 테마 전환',
    fbBtn: '피드백',
    fbTitle: '피드백 보내기',
    fbLabel: '무엇을 고치거나 추가하거나 더 잘 설명해야 할까요?',
    fbHint:
      '새 탭에서 GitHub가 열리고 작성한 내용이 미리 채워집니다(GitHub 계정이 필요하며, 게시물은 공개됩니다). 지금 보고 있는 페이지와 언어도 함께 전달됩니다.',
    fbSend: 'GitHub에서 계속',
    fbEmpty: '먼저 내용을 입력하세요.',
    fbLong: 'GitHub 링크 하나에 담기에는 너무 깁니다. 여기서 줄이고 나머지는 GitHub에서 추가하세요.',
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
    theme: 'ライト／ダークテーマを切り替え',
    fbBtn: 'フィードバック',
    fbTitle: 'フィードバックを送る',
    fbLabel: '直すべき点、追加してほしいこと、分かりにくい説明は？',
    fbHint:
      '新しいタブでGitHubが開き、入力した文章が入った状態になります（GitHubアカウントが必要で、投稿は公開されます）。今見ているページと言語も一緒に送られます。',
    fbSend: 'GitHubで続ける',
    fbEmpty: '先に内容を書いてください。',
    fbLong: 'GitHubのリンク1つには長すぎます。ここで短くして、残りはGitHubで追記してください。',
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
    theme: '切换浅色/深色主题',
    fbBtn: '反馈',
    fbTitle: '提交反馈',
    fbLabel: '有什么需要修正、补充或解释得更清楚？',
    fbHint:
      '会在新标签页打开 GitHub，并预先填好你的内容（需要 GitHub 账号，提交的内容会公开）。当前页面和语言也会一并附上。',
    fbSend: '前往 GitHub 继续',
    fbEmpty: '请先写点内容。',
    fbLong: '内容太长，放不进一个 GitHub 链接。请在这里缩短，其余部分到 GitHub 上补充。',
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
    theme: 'Переключить светлую/тёмную тему',
    fbBtn: 'Отзыв',
    fbTitle: 'Отправить отзыв',
    fbLabel: 'Что нам исправить, добавить или объяснить понятнее?',
    fbHint:
      'Откроет GitHub в новой вкладке с вашим текстом, готовым к публикации (нужен аккаунт GitHub, публикация будет видна всем). Страница, на которой вы находитесь, и её язык будут приложены.',
    fbSend: 'Продолжить на GitHub',
    fbEmpty: 'Сначала напишите что-нибудь.',
    fbLong: 'Слишком длинно для одной ссылки на GitHub. Сократите здесь, а остальное добавьте на GitHub.',
  },
};

/** Site language of a BCP 47 tag (Base.astro gets `lang` as the tag); English when unknown. */
export const langOfTag = (tag: string): Lang => LANGS.find((l) => l.hreflang === tag)?.code ?? DEFAULT_LANG;

/** One language's site-wide texts (header, footer, notices, feedback). */
export type SiteText = (typeof SITE_TEXT)[Lang];
