// Labels of the "Method & credits" dialog shown on every event page (src/components/EventInfo.astro).
// The methodology itself is per event (e.g. `method` in src/sheets/ss14/i18n.ts).
import type { Lang } from '../lib/i18n';

export type Role = 'sim' | 'video' | 'interview' | 'official';
export interface InfoLabels {
  btn: string; title: string; methodH: string; thanksH: string; thanksLead: string;
  roles: Record<Role, string>; feedbackH: string; feedbackP: string; feedbackBtn: string; close: string;
}

export const INFO: Record<Lang, InfoLabels> = {
  en: {
    btn: 'Method & credits', title: 'How this page was made', methodH: 'Method',
    thanksH: 'Thanks, creators', thanksLead: 'This page stands on their work — visit their channels and support them:',
    roles: { sim: 'simulator & tools', video: 'season video', interview: 'dev interview', official: 'official preview' },
    feedbackH: 'Help improve it', feedbackP: 'Found a mistake, a new combo or a game bug? Share it with us on GitHub Discussions.',
    feedbackBtn: 'Open GitHub Discussions', close: 'Close',
  },
  'pt-br': {
    btn: 'Método e créditos', title: 'Como esta página foi feita', methodH: 'Método',
    thanksH: 'Obrigado, criadores', thanksLead: 'Esta página se apoia no trabalho deles — visite os canais e fortaleça a comunidade:',
    roles: { sim: 'simulador e ferramentas', video: 'vídeo da season', interview: 'entrevista com os devs', official: 'prévia oficial' },
    feedbackH: 'Ajude a melhorar', feedbackP: 'Achou um erro, um combo novo ou um bug do jogo? Conte para a gente no GitHub Discussions.',
    feedbackBtn: 'Abrir GitHub Discussions', close: 'Fechar',
  },
  de: {
    btn: 'Methode & Credits', title: 'Wie diese Seite entstanden ist', methodH: 'Methode',
    thanksH: 'Danke an die Creator', thanksLead: 'Diese Seite baut auf ihrer Arbeit auf — besucht ihre Kanäle und unterstützt sie:',
    roles: { sim: 'Simulator & Tools', video: 'Season-Video', interview: 'Entwickler-Interview', official: 'offizielle Vorschau' },
    feedbackH: 'Hilf mit, sie zu verbessern', feedbackP: 'Einen Fehler, eine neue Kombo oder einen Bug im Spiel gefunden? Teil es uns in den GitHub Discussions mit.',
    feedbackBtn: 'GitHub Discussions öffnen', close: 'Schließen',
  },
  ko: {
    btn: '방법 & 크레딧', title: '이 페이지는 이렇게 만들었습니다', methodH: '방법',
    thanksH: '크리에이터분들께 감사드립니다', thanksLead: '이 페이지는 이분들의 작업 위에 있습니다 — 채널을 방문해 응원해 주세요:',
    roles: { sim: '시뮬레이터 & 도구', video: '시즌 영상', interview: '개발자 인터뷰', official: '공식 프리뷰' },
    feedbackH: '함께 개선해요', feedbackP: '오류, 새로운 조합, 게임 버그를 발견했나요? GitHub Discussions에 공유해 주세요.',
    feedbackBtn: 'GitHub Discussions 열기', close: '닫기',
  },
  ja: {
    btn: '方法とクレジット', title: 'このページの作り方', methodH: '方法',
    thanksH: 'クリエイターの皆さんに感謝', thanksLead: 'このページは彼らの成果の上にあります——チャンネルを訪れて応援してください：',
    roles: { sim: 'シミュレーター・ツール', video: 'シーズン動画', interview: '開発者インタビュー', official: '公式プレビュー' },
    feedbackH: '改善に協力', feedbackP: '誤り、新しい組み合わせ、ゲームのバグを見つけたら、GitHub Discussionsで教えてください。',
    feedbackBtn: 'GitHub Discussionsを開く', close: '閉じる',
  },
  zh: {
    btn: '方法与鸣谢', title: '本页是怎么做出来的', methodH: '方法',
    thanksH: '感谢各位创作者', thanksLead: '本页建立在他们的成果之上——去他们的频道看看，支持社区：',
    roles: { sim: '模拟器与工具', video: '赛季视频', interview: '开发者访谈', official: '官方前瞻' },
    feedbackH: '一起完善', feedbackP: '发现错误、新组合或游戏bug？欢迎在 GitHub Discussions 告诉我们。',
    feedbackBtn: '打开 GitHub Discussions', close: '关闭',
  },
  ru: {
    btn: 'Методика и благодарности', title: 'Как сделана эта страница', methodH: 'Методика',
    thanksH: 'Спасибо авторам', thanksLead: 'Эта страница держится на их работе — заходите на их каналы и поддержите сообщество:',
    roles: { sim: 'симулятор и инструменты', video: 'видео сезона', interview: 'интервью с разработчиками', official: 'официальное превью' },
    feedbackH: 'Помогите улучшить', feedbackP: 'Нашли ошибку, новую связку или баг игры? Расскажите нам в GitHub Discussions.',
    feedbackBtn: 'Открыть GitHub Discussions', close: 'Закрыть',
  },
};
