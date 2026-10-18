// The SS14 play sheet's interactive parts (src/sheets/ss14): folds, pairs per start card, the instrument pick and
// "Last simulation" in the reader's time zone. Each test gets a fresh browser context (empty localStorage).
import { expect, test, type Page } from '@playwright/test';

const SHEET = '/ss14/';
const visiblePairs = (page: Page) => page.locator('[data-pairs]:not([hidden])');
// Opens an instrument's card by focus. Scroll first and focus without scrolling: a pane scroll closes the card.
// Instant scroll: the page scrolls smoothly (site.css), and a scroll still running after the wait closed the card.
async function openCard(page: Page, id: string) {
  const tile = page.locator(`#tools .tool[data-tool="${id}"]`);
  await tile.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(200);
  await tile.evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
}

test('folds: pairs start closed, open on the heading and stay open after reload', async ({ page }) => {
  await page.goto(SHEET);
  const pairs = page.locator('details[data-acc="pairs"]');
  await expect(page.locator('details[data-acc="run"]')).toHaveAttribute('open', '');
  await expect(page.locator('details[data-acc="win"]')).toHaveAttribute('open', '');
  await expect(pairs).not.toHaveAttribute('open', '');

  await pairs.locator('summary').click();
  await expect(pairs).toHaveAttribute('open', '');
  // The choice is saved on the `toggle` event, a task after the click.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ss14-acc-v1'))).toContain('"pairs":true');
  await page.reload();
  await expect(pairs).toHaveAttribute('open', '');
});

test('strong pairs: 20 per list, and the list follows the start card', async ({ page }) => {
  await page.goto(SHEET);
  await page.locator('details[data-acc="pairs"] summary').click();
  await expect(visiblePairs(page)).toHaveCount(1);
  await expect(visiblePairs(page)).toHaveAttribute('data-pairs', '');
  await expect(visiblePairs(page).locator('.builds li')).toHaveCount(20);

  for (const start of ['cagefight', 'ironlaw', 'tyranny']) {
    await page.locator(`#run [data-start="${start}"]`).click();
    await expect(visiblePairs(page)).toHaveAttribute('data-pairs', start);
    await expect(visiblePairs(page).locator('.builds li')).toHaveCount(20);
  }
  // The marked start card survives a reload, and so does its list.
  await page.reload();
  await expect(visiblePairs(page)).toHaveAttribute('data-pairs', 'tyranny');

  await page.locator('#run [data-start=""]').click();
  await expect(visiblePairs(page)).toHaveAttribute('data-pairs', '');
});

test('instrument pick: tapping 3 offered lights up a pick', async ({ page }) => {
  await page.goto(SHEET);
  const tiles = page.locator('#tools .tool');
  for (const i of [0, 1, 2]) await tiles.nth(i).click();
  await expect(page.locator('#pickOut .pick.best')).toBeVisible();
  await expect(page.locator('#tools .tool.best')).toHaveCount(1);
});

test('instrument card: own rank (tier + position), then the best second instrument with tiers', async ({ page }) => {
  await page.goto(SHEET);
  await openCard(page, 'rope');
  const pop = page.locator('#pop');
  await expect(pop).toBeVisible();
  await expect(pop.locator('.tp-rank .tier')).toHaveText(/^[SABCD✕]$/);
  await expect(pop.locator('.tp-rank b')).toHaveText(/^#\d+ of \d+$/);
  const second = pop.locator('.tp-second');
  await expect(second).toContainText('Best second instrument');
  await expect(second.locator('li').first().locator('.tier')).toHaveText(/^[SABCD✕]$/);
});

test('no "no instrument" baseline anywhere: a run always holds one', async ({ page }) => {
  await page.goto(SHEET);
  await openCard(page, 'rope');
  await expect(page.locator('#pop')).toBeVisible();
  // Visible text and the accessible names (aria-label) both count.
  const said = await page.evaluate(() =>
    [
      document.body.innerText,
      ...[...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')),
    ].join('\n'),
  );
  expect(said).not.toMatch(/no instrument/i);
});

test('your run: start cards and objectives open a card (what it does; best first picks)', async ({ page }) => {
  await page.goto(SHEET);
  const pop = page.locator('#pop');
  const open = (sel: string) => page.locator(sel).evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));

  await open('#run [data-start="cagefight"]');
  await expect(pop).toContainText('Cage Fight');
  await expect(pop.locator('.tp-doubt')).toHaveCount(0);
  await expect(pop.locator('.tp-second li')).toHaveCount(3);
  await expect(pop.locator('.tp-second li .tier').first()).toHaveText(/^[SABCD✕]$/);

  await open('#run [data-start="tyranny"]');
  await expect(pop).toContainText('Tyranny');
  await expect(pop.locator('.tp-doubt')).toHaveCount(1);

  await open('#run [data-objective="walk"]');
  await expect(pop).toContainText('Prison Walk');
  await expect(pop).toContainText('18 tiles');
  await expect(pop).toContainText('+1 instrument');

  // "none" and "any" are not cards: no popover.
  await expect(page.locator('#run [data-start=""]')).not.toHaveAttribute('data-tip');
  await expect(page.locator('#run [data-objective=""]')).not.toHaveAttribute('data-tip');
});

for (const [timezoneId, offset] of [
  ['America/Sao_Paulo', 'GMT-3'],
  ['Asia/Tokyo', 'GMT+9'],
] as const) {
  test.describe(`last simulation in ${timezoneId}`, () => {
    test.use({ timezoneId });
    test(`shows the reader's zone (${offset})`, async ({ page }) => {
      await page.goto(SHEET);
      const at = page.locator('.sim-date time[data-sim]');
      // No <time> = built without git history or with an uncommitted export: only the UTC date (sim-time.ts).
      test.skip((await at.count()) === 0, 'no commit time in this build');
      await expect(at).toContainText(offset);
      await expect(at).not.toContainText('UTC');
    });
  });
}
