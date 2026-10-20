// The header's Feedback button (layouts/Base.astro): a dialog with a textarea, and "Continue on GitHub" opens a new
// issue on the project in a new tab, filled through the issue form .github/ISSUE_TEMPLATE/feedback.yml (its field
// ids — feedback, page, language — are the contract). The site is static: a token in the page would let anyone
// write to the repo, so the reader posts the issue on GitHub (account needed; the dialog says so).

// GitHub answered 500/414 past ~6,500 characters of URL, signed out (measured 2026-10-19); signed in, cookies take
// part of the same limit. A Chinese, Japanese or Korean letter is 9 characters once encoded, so the cap is on the
// URL, not on the text.
export const MAX_URL = 4000;

/** The new-issue link for `text`, sent from `page` in `lang`. */
export function feedbackUrl(issues: string, text: string, page: string, lang: string): string {
  const body = text.trim();
  const title = `Feedback: ${body.replace(/\s+/g, ' ').slice(0, 60)}`;
  const q = { template: 'feedback.yml', title, feedback: body, page, language: lang };
  return `${issues}/new?${Object.entries(q)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}`;
}

export function setupFeedback(): void {
  const btn = document.getElementById('fbBtn');
  const dlg = document.getElementById('fbDlg');
  const form = document.getElementById('fbForm');
  const text = document.getElementById('fbText');
  const err = document.getElementById('fbErr');
  if (
    !btn ||
    !(dlg instanceof HTMLDialogElement) ||
    !(form instanceof HTMLFormElement) ||
    !(text instanceof HTMLTextAreaElement) ||
    !err
  )
    return;
  // The message is a role="alert": filling it is what screen readers announce.
  const say = (msg: string) => {
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) text.setAttribute('aria-invalid', 'true');
    else text.removeAttribute('aria-invalid');
  };

  btn.addEventListener('click', () => {
    say('');
    dlg.showModal();
    text.focus();
  });
  // Close on ✕ or a click on the backdrop — not on the dialog's own padding, where a stray click would lose the text.
  dlg.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest('[data-close]')) return dlg.close();
    if (t !== dlg) return;
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
  });
  text.addEventListener('input', () => {
    if (!err.hidden) say('');
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!text.value.trim()) {
      say(dlg.dataset.empty ?? '');
      text.focus();
      return;
    }
    // Read on use: the 404 rewrites these for the reader's language after this runs (./site-text.ts).
    const { issues = '', lang = 'en', long = '' } = dlg.dataset;
    const url = feedbackUrl(issues, text.value, location.href, lang);
    if (url.length > MAX_URL) {
      say(long);
      text.focus();
      return;
    }
    window.open(url, '_blank', 'noopener');
    dlg.close();
  });
}
