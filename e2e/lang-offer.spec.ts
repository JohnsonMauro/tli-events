// The translation offer (src/lib/lang-offer.ts): a page offers the translation the browser asks for, in that
// language, never redirects, and asks once — "Don't show again" for good, × for the tab, a picked language counts.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// A first visit: nothing stored (the config pre-answers "never" for every other spec).
test.use({ storageState: { cookies: [], origins: [] } });

const box = (page: Page) => page.locator('#lang-offer');

test.describe('a Portuguese browser', () => {
  test.use({ locale: 'pt-BR' });

  test('the English page offers Portuguese, in Portuguese; the Portuguese page offers nothing', async ({ page }) => {
    await page.goto('/ss14/');
    await expect(box(page)).toBeVisible();
    await expect(box(page)).toHaveAttribute('lang', 'pt-BR');
    await expect(box(page).locator('p')).toHaveText('Esta página também está em português.');
    await expect(box(page).getByRole('link', { name: 'Ler em português' })).toHaveAttribute('href', '/ss14/pt-br/');
    await expect(box(page).getByRole('button', { name: 'Fechar' })).toBeVisible();
    // Never a redirect.
    expect(new URL(page.url()).pathname).toBe('/ss14/');

    await page.goto('/ss14/pt-br/');
    await expect(box(page)).toBeHidden();
  });

  // Both bottom notices at once (a deploy while the offer is open): stacked, never covering each other.
  for (const width of [1440, 320]) {
    test(`with the "new version" notice too, they stack (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/ss14/');
      await expect(box(page)).toBeVisible();
      await page.locator('#update-toast').evaluate((el: HTMLElement) => (el.hidden = false));
      // The notice slides up for 280 ms: measure where it rests.
      // (only its own animations: the footer heart beats on purpose)
      await page
        .locator('#update-toast')
        .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)).then(() => undefined));
      const offer = await box(page).boundingBox();
      const toast = await page.locator('#update-toast').boundingBox();
      if (!offer || !toast) throw new Error('missing');
      // The notice that matters more sits at the edge, the offer right above it.
      expect(offer.y + offer.height).toBeLessThanOrEqual(toast.y);
      expect(offer.y).toBeGreaterThanOrEqual(0);
      expect(toast.y + toast.height).toBeLessThanOrEqual(800);
      expect(Math.max(offer.x + offer.width, toast.x + toast.width)).toBeLessThanOrEqual(width);
      // Both still take clicks: the offer's × closes it.
      await box(page).getByRole('button', { name: 'Fechar' }).click();
      await expect(box(page)).toBeHidden();
    });
  }

  test('the home page offers Portuguese too, pointing at the Portuguese home page', async ({ page }) => {
    await page.goto('/');
    await expect(box(page)).toBeVisible();
    await expect(box(page).getByRole('link', { name: 'Ler em português' })).toHaveAttribute('href', '/pt-br/');
  });

  test('"Don\'t show again" is for good: not after a reload, not in a new tab', async ({ page, context }) => {
    await page.goto('/ss14/');
    await box(page).getByRole('button', { name: 'Não mostrar mais' }).click();
    await expect(box(page)).toBeHidden();
    // The focused button went away: focus lands on the language switcher, where the language can still be changed.
    await expect(page.locator('.lang-select summary')).toBeFocused();
    await page.reload();
    await expect(box(page)).toBeHidden();
    const other = await context.newPage();
    await other.goto('/ss14/');
    await expect(box(other)).toBeHidden();
  });

  test('× (or Esc) closes it for this tab only', async ({ page, context }) => {
    await page.goto('/ss14/');
    await box(page).getByRole('button', { name: 'Fechar' }).click();
    await expect(box(page)).toBeHidden();
    await page.reload();
    await expect(box(page)).toBeHidden();
    // A new tab is a new visit: asked once more.
    const other = await context.newPage();
    await other.goto('/ss14/');
    await expect(box(other)).toBeVisible();
    await box(other).getByRole('link').focus();
    await other.keyboard.press('Escape');
    await expect(box(other)).toBeHidden();
  });

  test("following the offer, or picking a language in the switcher, is the reader's choice", async ({ page }) => {
    await page.goto('/ss14/');
    await box(page).getByRole('link').click();
    await expect(page).toHaveURL(/\/ss14\/pt-br\/$/);
    await page.goto('/ss14/');
    await expect(box(page)).toBeHidden();
  });

  test('picking English in the switcher stops the offer', async ({ page }) => {
    await page.goto('/ss14/');
    await page.locator('.lang-select summary').click();
    await page.locator('.lang-select a[data-lang="en"]').click();
    await page.goto('/ss14/');
    await expect(box(page)).toBeHidden();
  });
});

for (const [locale, path, offered] of [
  ['en-US', '/ss14/pt-br/', 'en'],
  ['fr-CA', '/ss14/', 'fr'],
  ['pt-PT', '/ss14/', 'pt-br'],
  ['zh-CN', '/ss14/', 'zh'],
  ['zh-TW', '/ss14/', null],
  ['en-US', '/ss14/', null],
  ['nl-NL', '/ss14/', null],
] as const) {
  test.describe(`a ${locale} browser on ${path}`, () => {
    test.use({ locale });
    test(offered ? `offers ${offered}` : 'offers nothing', async ({ page }) => {
      await page.goto(path);
      if (offered) {
        await expect(box(page)).toBeVisible();
        await expect(box(page).getByRole('link')).toHaveAttribute(
          'href',
          offered === 'en' ? '/ss14/' : `/ss14/${offered}/`,
        );
      } else {
        // Hidden is the starting state; give the script its turn before asserting.
        await page.waitForLoadState('load');
        await expect(box(page)).toBeHidden();
      }
    });
  });
}

// Readable and inside the screen in every theme, on a phone, in the longest wording (Vietnamese, Russian).
for (const [locale, scheme] of [
  ['vi-VN', 'light'],
  ['vi-VN', 'dark'],
  ['ru-RU', 'light'],
  ['ru-RU', 'dark'],
] as const) {
  test.describe(`${locale}, ${scheme} theme, 320px`, () => {
    test.use({ locale, viewport: { width: 320, height: 700 } });
    test('no axe violations, nothing past the screen', async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/ss14/');
      await expect(box(page)).toBeVisible();
      const r = await box(page).boundingBox();
      expect(r && r.x >= 0 && r.x + r.width <= 320).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
      const results = await new AxeBuilder({ page })
        .include('#lang-offer')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  });
}
