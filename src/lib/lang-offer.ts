// "This page is also in Português — Read in Português · Don't show again · ×" (the box in src/layouts/Base.astro).
// GitHub Pages can't pick a language on the server, so the page offers the translation the reader's browser asks
// for. It never redirects (the reader may want English on purpose: the game client is English), and it asks at most
// once: any choice is kept in this browser, "Don't show again" for good, × until the tab closes.

/** The reader's choice, kept in localStorage: a language code (picked here or in the switcher) or 'never'. */
export const CHOICE_KEY = 'tli-lang';
/** × closes the offer for this tab (sessionStorage). */
export const LATER_KEY = 'tli-lang-later';

export interface Offer {
  code: string;
  hreflang: string;
  href: string;
  text: string;
  go: string;
  never: string;
  close: string;
}

/** The translation the reader's languages ask for first, in their order; null when none fits. Exact tag first, then
 * the same language in another region (pt-PT → pt-BR, fr-CA → fr). Our Chinese is Simplified: a Traditional
 * Chinese reader (zh-TW, zh-HK, zh-Hant) gets nothing from it and moves on to their next language. */
export function pickLang<T extends { code: string; hreflang: string }>(tags: readonly string[], offers: T[]): T | null {
  for (const raw of tags) {
    const tag = raw.toLowerCase();
    const exact = offers.find((o) => o.hreflang.toLowerCase() === tag || o.code === tag);
    if (exact) return exact;
    if (/^zh-(tw|hk|mo|hant)\b/.test(tag)) continue;
    const base = tag.split('-')[0];
    const same = offers.find((o) => o.hreflang.toLowerCase().split('-')[0] === base);
    if (same) return same;
  }
  return null;
}

const read = (store: () => Storage, key: string) => {
  try {
    return store().getItem(key);
  } catch {
    return null; // storage blocked: the offer may show again, nothing breaks
  }
};
const write = (store: () => Storage, key: string, value: string) => {
  try {
    store().setItem(key, value);
  } catch {}
};

export function offerLanguage() {
  // A language picked in the switcher counts as the reader's choice too.
  document
    .querySelectorAll<HTMLAnchorElement>('.lang-select a[data-lang]')
    .forEach((a) => a.addEventListener('click', () => write(() => localStorage, CHOICE_KEY, a.dataset.lang ?? '')));
  const data = document.getElementById('lang-offer-data');
  const box = document.getElementById('lang-offer');
  if (!data || !box) return;
  if (read(() => localStorage, CHOICE_KEY) || read(() => sessionStorage, LATER_KEY)) return;
  const { current, offers } = JSON.parse(data.textContent || '{}') as { current: string; offers: Offer[] };
  const want = pickLang(navigator.languages?.length ? navigator.languages : [navigator.language], offers);
  if (!want || want.code === current) return;

  // Built here, in the language it offers (so a reader of that language can read it): textContent only, the texts
  // are ours but nothing from storage or the URL ever reaches markup.
  box.lang = want.hreflang;
  const text = document.createElement('p');
  text.textContent = want.text;
  const go = document.createElement('a');
  go.href = want.href;
  go.hreflang = want.hreflang;
  go.textContent = want.go;
  const never = document.createElement('button');
  never.type = 'button';
  never.dataset.never = '';
  never.textContent = want.never;
  const acts = document.createElement('div');
  acts.className = 'lang-offer-acts';
  acts.append(go, never);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'lang-offer-x';
  close.setAttribute('aria-label', want.close);
  close.title = want.close;
  close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  box.replaceChildren(text, acts, close);

  // Closing removes the focused button: hand focus to the switcher, where the language can still be changed.
  const hide = () => {
    const hadFocus = box.contains(document.activeElement);
    box.hidden = true;
    if (hadFocus) document.querySelector<HTMLElement>('.lang-select summary')?.focus();
  };
  go.addEventListener('click', () => write(() => localStorage, CHOICE_KEY, want.code));
  never.addEventListener('click', () => {
    write(() => localStorage, CHOICE_KEY, 'never');
    hide();
  });
  const later = () => {
    write(() => sessionStorage, LATER_KEY, '1');
    hide();
  };
  close.addEventListener('click', later);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') later();
  });
  box.hidden = false;
}
