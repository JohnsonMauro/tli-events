// The SS14 sheet's text size (A− / A+ in the Reset bar, src/sheets/ss14/text-size.ts): 100% as designed up to 200%
// in 4 steps, kept in this browser, and the sheet still fits the screen at the largest.
import { expect, test, type Page } from '@playwright/test';

const SHEET = '/ss14/';
const LANGS = ['', 'pt-br/', 'es/', 'de/', 'fr/', 'pl/', 'sv/', 'ko/', 'ja/', 'zh/', 'ru/', 'vi/'];
const rowFont = (page: Page) =>
  page
    .locator('#tools .tool .nm-t')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test('text size: A+ steps 100 → 125 → 150 → 175 → 200%, A− back, kept after reload', async ({ page }) => {
  await page.goto(SHEET);
  const [down, up, out] = [page.locator('#textDown'), page.locator('#textUp'), page.locator('#textOut')];
  await expect(page.getByRole('group', { name: 'Text size' })).toBeVisible();
  await expect(out).toHaveText('100%');
  await expect(down).toHaveAttribute('aria-disabled', 'true');
  const base = await rowFont(page);

  for (const [pct, x] of [
    ['125%', 1.25],
    ['150%', 1.5],
    ['175%', 1.75],
    ['200%', 2],
  ] as const) {
    await up.click();
    await expect(out).toHaveText(pct);
    expect(await rowFont(page)).toBeCloseTo(base * x, 1);
  }
  await expect(up).toHaveAttribute('aria-disabled', 'true');
  // aria-disabled at the top: Enter does nothing, and focus stays on the button
  await up.press('Enter');
  await expect(out).toHaveText('200%');
  await expect(up).toBeFocused();
  await expect(out).toHaveAttribute('role', 'status');

  await page.reload();
  await expect(out).toHaveText('200%');
  expect(await rowFont(page)).toBeCloseTo(base * 2, 1);

  await down.click();
  await expect(out).toHaveText('175%');
  await expect(up).toHaveAttribute('aria-disabled', 'false');
  for (let i = 0; i < 3; i++) await down.click();
  await expect(out).toHaveText('100%');
  await expect(down).toHaveAttribute('aria-disabled', 'true');
  expect(await rowFont(page)).toBeCloseTo(base, 1);
});

test('text size: the readout follows the page language', async ({ page }) => {
  await page.goto(SHEET + 'de/');
  await page.locator('#textUp').click();
  await expect(page.locator('#textOut')).toHaveText(/^125\s%$/);
});

// The screen decides, not the text size: a card that fits stays a tooltip on hover, even enlarged.
test('text size: enlarged on a desktop screen, a card that fits still opens on hover', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ss14-text-v1', '1.25'));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(SHEET);
  const tile = page.locator('#tools .tool[data-tool="rope"]');
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  const pop = page.locator('#pop');
  await expect(pop).toBeVisible();
  const { scroll, client } = await pop.evaluate((p) => ({ scroll: p.scrollHeight, client: p.clientHeight }));
  expect(scroll).toBeLessThanOrEqual(client + 1);
  // A click takes it as the pick: still no dialog.
  await tile.click();
  await expect(page.locator('#popdlg')).toBeHidden();
});

// A card taller than the screen would be cut in the tooltip (it never scrolls): hover opens nothing, a click
// opens it as the dialog.
test('text size: a card taller than the screen opens as a dialog on click, not on hover', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ss14-text-v1', '2'));
  await page.setViewportSize({ width: 1366, height: 600 });
  await page.goto(SHEET);
  const tile = page.locator('#tools .tool[data-tool="rope"]');
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await expect(page.locator('#pop')).toBeHidden();
  const name = (await tile.locator('.nm-t').innerText()).trim();
  await tile.click();
  await expect(page.locator('#popdlg')).toBeVisible();
  await expect(page.locator('#popdlg')).toHaveAttribute('aria-label', name);
  await page.keyboard.press('Escape');
  await expect(page.locator('#popdlg')).toBeHidden();
});

// The largest size in every language: no sideways scroll (page or pane), and the Reset bar's parts stay apart.
for (const lang of LANGS) {
  for (const width of [320, 1440]) {
    test(`text size 200%: the sheet fits (${lang || 'en/'}, ${width}px)`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('ss14-text-v1', '2'));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(SHEET + lang);
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
      const { scroll, scrollers } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        scrollers: [...document.querySelectorAll<HTMLElement>('main *')]
          .filter((el) => ['auto', 'scroll'].includes(getComputedStyle(el).overflowX))
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map(
            (el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${el.scrollWidth}>${el.clientWidth}`,
          ),
      }));
      expect(scroll, 'page wider than the screen').toBeLessThanOrEqual(width);
      expect(scrollers, 'boxes that scroll sideways').toEqual([]);

      const boxes = await Promise.all(
        ['.sheet-top .back', '#resetRun', '.text-size'].map((s) => page.locator(s).boundingBox()),
      );
      for (const b of boxes) expect(b && b.x >= 0 && b.x + b.width <= width).toBe(true);
      const overlap = (a: NonNullable<(typeof boxes)[0]>, b: NonNullable<(typeof boxes)[0]>) =>
        a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
      const [back, reset, size] = boxes as NonNullable<(typeof boxes)[0]>[];
      expect(overlap(back, reset) || overlap(back, size) || overlap(reset, size)).toBe(false);
    });
  }
}
