// Site-wide languages and string helpers. Each play sheet keeps its own texts (e.g. src/sheets/ss14/i18n.ts);
// game names stay in English everywhere: they are what the EN client shows.

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English', hreflang: 'en' },
  { code: 'pt-br', label: 'PT', name: 'Português (Brasil)', hreflang: 'pt-BR' },
  { code: 'de', label: 'DE', name: 'Deutsch', hreflang: 'de' },
  { code: 'ko', label: '한', name: '한국어', hreflang: 'ko' },
  { code: 'ja', label: '日', name: '日本語', hreflang: 'ja' },
  { code: 'zh', label: '中', name: '简体中文', hreflang: 'zh-Hans' },
  { code: 'ru', label: 'RU', name: 'Русский', hreflang: 'ru' },
] as const;
export type Lang = (typeof LANGS)[number]['code'];

export const DEFAULT_LANG: Lang = 'en';

/** BCP 47 tag of a site language (for `<html lang>` and hreflang). */
export const hreflang = (code: Lang) => LANGS.find((l) => l.code === code)!.hreflang;

/** Fill {var} placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

/** Escape, then turn **x** into an accent span and !!x!! into a warning span. Strings are ours, not user input. */
export const rich = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<span class="k">$1</span>')
    .replace(/!!(.+?)!!/g, '<span class="no">$1</span>');
