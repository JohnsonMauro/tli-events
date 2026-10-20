// Rewrites the site-wide texts of a page that was built in another language — the 404, which GitHub Pages serves as
// one English file for every path (src/pages/404.astro). layouts/Base.astro marks each such text: `data-site="key"`
// sets the element's text, `data-site-label="key"` its accessible name (and tooltip, if it has one). Without this the
// page switched its `lang` while the header and footer stayed English, read in the wrong voice (WCAG 3.1.2).
import type { SiteText } from './i18n';

export function applySiteText(t: SiteText, code: string): void {
  const [madeBefore, madeAfter = ''] = t.madeWith.split('{heart}');
  const text: Record<string, string> = { ...t, madeBefore, madeAfter };
  document.querySelectorAll<HTMLElement>('[data-site]').forEach((el) => {
    const v = text[el.dataset.site ?? ''];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll<HTMLElement>('[data-site-label]').forEach((el) => {
    const v = text[el.dataset.siteLabel ?? ''];
    if (v === undefined) return;
    el.setAttribute('aria-label', v);
    if (el.hasAttribute('title')) el.title = v;
  });
  // The feedback dialog sends its language and messages from these (src/lib/feedback.ts reads them on use).
  const fb = document.getElementById('fbDlg');
  if (fb) Object.assign(fb.dataset, { lang: code, empty: t.fbEmpty, long: t.fbLong });
}
