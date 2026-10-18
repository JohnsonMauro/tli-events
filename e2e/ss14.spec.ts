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

// The owner's run (2026-10-18): Cage Fight, holding Crowded Beastcage, offered Felon's Dog Tag, Avenger's Casket and
// Executioner's Blacklist — none in the card's top 5, so the pair they needed was not on the sheet.
async function holdBeastcage(page: Page) {
  await page.goto(SHEET);
  await page.locator('#run [data-start="cagefight"]').click();
  await page.locator('#tools .tool[data-tool="cage"]').click();
  await page.locator('#pickOut [data-take="cage"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(1);
}
const heldPairs = (page: Page) => page.locator('#pickOut .held-pairs .tp-pairs li');

test('instrument card: the best 5 partners only', async ({ page }) => {
  await page.goto(SHEET);
  await openCard(page, 'cage');
  await expect(page.locator('#pop')).toBeVisible();
  await expect(page.locator('#pop .tp-second .tp-pairs li')).toHaveCount(5);
});

test('Instrument pick: holding one lists every partner, best first', async ({ page }) => {
  await holdBeastcage(page);
  await expect(heldPairs(page)).toHaveCount(30);
  const names = await heldPairs(page).locator('.pn').allTextContents();
  expect(names).toContain("Avenger's Casket");
  expect(names).not.toContain('Crowded Beastcage');
  const values = (await heldPairs(page).locator('b').allTextContents()).map(Number);
  expect(values).toEqual([...values].sort((a, b) => b - a));
});

// The card ignores the pointer (it never scrolls), so whatever passes the screen is lost. Russian runs longest.
// Holding an instrument adds the "with what you hold" block, the usual state mid-run.
for (const [width, height, lang, holding] of [
  [390, 844, '', false],
  ...['', 'pt-br/', 'de/', 'fr/', 'ko/', 'ja/', 'zh/', 'ru/'].map((l) => [360, 740, l, false] as const),
  [360, 740, '', true],
  [360, 740, 'ru/', true],
] as const) {
  const state = holding ? ', holding one' : '';
  test(`instrument cards fit a ${width}×${height} screen (${lang || 'en/'}${state}): none gets cut`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto(SHEET + lang);
    if (holding) {
      for (const id of ['keys', 'muzzle', 'claws']) await page.locator(`#tools .tool[data-tool="${id}"]`).click();
      await page.locator('#pickOut [data-take]').click();
      await expect(page.locator('#held .chip')).toHaveCount(1);
    }
    const ids = await page
      .locator('#tools .tool')
      .evaluateAll((t) => t.map((b) => (b as HTMLElement).dataset.tool ?? ''));
    const tooTall: string[] = [];
    for (const id of ids) {
      await openCard(page, id);
      await expect(page.locator('#pop')).toBeVisible();
      const { scroll, client } = await page
        .locator('#pop')
        .evaluate((p) => ({ scroll: p.scrollHeight, client: p.clientHeight }));
      if (scroll > client + 1) tooTall.push(`${id} ${scroll}>${client}`);
    }
    expect(tooTall).toEqual([]);
  });
}

test('Instrument pick: what you hold sits above the advice, and one tap on the advice takes it', async ({ page }) => {
  await page.goto(SHEET);
  const order = await page.evaluate(() => {
    const held = document.querySelector('.held-row');
    const out = document.getElementById('pickOut');
    return held && out ? held.compareDocumentPosition(out) & Node.DOCUMENT_POSITION_FOLLOWING : 0;
  });
  expect(order).toBeTruthy();
  await page.locator('#tools .tool[data-tool="maiden"]').click();
  const advice = page.locator('#pickOut button.pick.best');
  await expect(advice).toHaveAttribute('data-take', 'maiden');
  await expect(page.locator('#pickOut button')).toHaveCount(1);
  await advice.click();
  await expect(page.locator('#held .chip')).toHaveText(/Severed Iron Maiden/);
});

test('Instrument pick: partners marked as offered get a ring in the held list', async ({ page }) => {
  await holdBeastcage(page);
  for (const id of ['dogtag', 'revenge', 'blacklist']) await page.locator(`#tools .tool[data-tool="${id}"]`).click();
  const marked = await page.locator('#pickOut .held-pairs li.off .pn').allTextContents();
  expect(marked.sort()).toEqual(["Avenger's Casket", "Executioner's Blacklist", "Felon's Dog Tag"]);
});

// A run holds 2 instruments: a tap on a row takes it as the second; a tap on another replaces it, never a third.
test('Instrument pick: a tap on a partner takes it as the second instrument, another tap replaces it', async ({
  page,
}) => {
  await holdBeastcage(page);
  await page.locator('#pickOut [data-second="revenge"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(2);
  await expect(page.locator('#held .chip').nth(1)).toHaveText(/Avenger's Casket/);
  await expect(page.locator('#pickOut [data-second="revenge"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(heldPairs(page)).toHaveCount(30);
  await page.locator('#pickOut [data-second="dogtag"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(2);
  await expect(page.locator('#held .chip').nth(0)).toHaveText(/Crowded Beastcage/);
  await expect(page.locator('#held .chip').nth(1)).toHaveText(/Felon's Dog Tag/);
  await expect(page.locator('#pickOut .held-pairs li.held')).toHaveCount(1);
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
