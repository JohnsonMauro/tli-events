// The header's Feedback button (src/lib/feedback.ts): a dialog with a textarea that opens a filled GitHub issue in a
// new tab (owner, 2026-10-19). window.open is recorded instead of followed: the test checks the link, not GitHub.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { MAX_URL } from '../src/lib/feedback';
import { SITE_TEXT } from '../src/lib/i18n';
import { ISSUES_URL } from '../src/lib/project';

test.use({ viewport: { width: 390, height: 844 } });

async function openPage(page: Page, path: string) {
  await page.addInitScript(() => {
    const w = window as unknown as { opened: string[] };
    w.opened = [];
    window.open = (url?: string | URL) => {
      w.opened.push(String(url));
      return null;
    };
  });
  await page.goto(path);
}
const opened = (page: Page) => page.evaluate(() => (window as unknown as { opened: string[] }).opened);

for (const [path, lang] of [
  ['/', 'en'],
  ['/ss14/ja/', 'ja'],
] as const) {
  test(`${path}: Feedback opens a dialog and sends a filled GitHub issue`, async ({ page }) => {
    const t = SITE_TEXT[lang];
    await openPage(page, path);
    const btn = page.getByRole('button', { name: t.fbBtn, exact: true });
    await expect(btn).toBeVisible();
    await btn.click();
    const dlg = page.getByRole('dialog', { name: t.fbTitle });
    await expect(dlg).toBeVisible();
    const box = dlg.getByRole('textbox', { name: t.fbLabel });
    await expect(box).toBeFocused();

    // Nothing written: an announced message, the field marked, nothing opened.
    await dlg.getByRole('button', { name: t.fbSend }).click();
    await expect(dlg.getByRole('alert')).toHaveText(t.fbEmpty);
    await expect(box).toHaveAttribute('aria-invalid', 'true');
    await expect(box).toBeFocused();
    expect(await opened(page)).toEqual([]);

    // Typing clears the message; sending opens the issue form with the text, the page and its language.
    const text = 'The Usurpation line\nneeds a source.';
    await box.fill(text);
    await expect(dlg.getByRole('alert')).toBeHidden();
    await expect(box).not.toHaveAttribute('aria-invalid');
    await dlg.getByRole('button', { name: t.fbSend }).click();
    const [url] = await opened(page);
    const u = new URL(url ?? '');
    expect(`${u.origin}${u.pathname}`).toBe(`${ISSUES_URL}/new`);
    expect(u.searchParams.get('template')).toBe('feedback.yml');
    expect(u.searchParams.get('feedback')).toBe(text);
    expect(u.searchParams.get('page')).toBe(page.url());
    expect(u.searchParams.get('language')).toBe(lang);
    expect(u.searchParams.get('title')).toBe('Feedback: The Usurpation line needs a source.');
    await expect(dlg).toBeHidden();
    await expect(btn).toBeFocused();
  });
}

test('a text too long for one GitHub link is refused, not cut', async ({ page }) => {
  const t = SITE_TEXT.zh;
  await openPage(page, '/ss14/zh/');
  await page.getByRole('button', { name: t.fbBtn, exact: true }).click();
  const dlg = page.getByRole('dialog', { name: t.fbTitle });
  // A Chinese letter is 9 characters once encoded: this many pass MAX_URL on their own.
  await dlg.getByRole('textbox').fill('长'.repeat(Math.ceil(MAX_URL / 9) + 10));
  await dlg.getByRole('button', { name: t.fbSend }).click();
  await expect(dlg.getByRole('alert')).toHaveText(t.fbLong);
  await expect(dlg).toBeVisible();
  expect(await opened(page)).toEqual([]);
});

test('closes by ✕, Esc or the backdrop — not by a click on its own padding — and keeps the text', async ({ page }) => {
  const t = SITE_TEXT.en;
  await openPage(page, '/');
  const btn = page.getByRole('button', { name: t.fbBtn, exact: true });
  const dlg = page.getByRole('dialog', { name: t.fbTitle });
  await btn.click();
  await dlg.getByRole('textbox').fill('draft');

  const r = await dlg.boundingBox();
  if (!r) throw new Error('dialog has no box');
  await page.mouse.click(r.x + 4, r.y + r.height / 2); // inside, on the padding
  await expect(dlg).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
  await expect(btn).toBeFocused();

  await btn.click();
  await expect(dlg.getByRole('textbox')).toHaveValue('draft');
  await page.mouse.click(4, 4); // the backdrop
  await expect(dlg).toBeHidden();

  await btn.click();
  await dlg.getByRole('button', { name: t.offerClose }).click();
  await expect(dlg).toBeHidden();
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`feedback dialog in ${colorScheme} theme, with its message: no axe violations`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await openPage(page, '/');
    await page.getByRole('button', { name: SITE_TEXT.en.fbBtn, exact: true }).click();
    await page.getByRole('button', { name: SITE_TEXT.en.fbSend }).click();
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .include('#fbDlg')
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}
