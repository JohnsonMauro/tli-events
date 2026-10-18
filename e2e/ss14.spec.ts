// The SS14 play sheet's interactive parts (src/sheets/ss14): folds, the instrument pick and
// "Last simulation" in the reader's time zone. Each test gets a fresh browser context (empty localStorage).
import { readFileSync } from 'node:fs';

import { expect, test, type Page } from '@playwright/test';

import { PAIR_TEXT, TOOL_TEXT } from '../src/sheets/ss14/tool-text';

const SHEET = '/ss14/';
// Opens an instrument's card by focus. Scroll first and focus without scrolling: a pane scroll closes the card.
// Instant scroll: the page scrolls smoothly (site.css), and a scroll still running after the wait closed the card.
async function openCard(page: Page, id: string) {
  const tile = page.locator(`#tools .tool[data-tool="${id}"]`);
  await tile.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(200);
  await tile.evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
}

test('folds: a fold closed on its heading stays closed after reload', async ({ page }) => {
  await page.goto(SHEET);
  const win = page.locator('details[data-acc="win"]');
  await expect(page.locator('details[data-acc="run"]')).toHaveAttribute('open', '');
  await expect(win).toHaveAttribute('open', '');

  await win.locator('summary').click();
  await expect(win).not.toHaveAttribute('open', '');
  // The choice is saved on the `toggle` event, a task after the click.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ss14-acc-v1'))).toContain('"win":false');
  await page.reload();
  await expect(win).not.toHaveAttribute('open', '');
});

// The "Strong pairs" section moved into the list (owner, 2026-10-18): once one is held, every row says what its
// pair with it does — the verdict from the engine's numbers (combo, clash or none), then why.
test('instrument pick: with one held, every row tells what its pair with it does', async ({ page }) => {
  await page.goto(SHEET);
  const why = (id: string) => page.locator(`#tools .tool[data-tool="${id}"] .why`);
  await expect(page.locator('#tools .tool .why:not([hidden])')).toHaveCount(0);

  await page.locator('#tools .tool[data-tool="rope"]').click();
  await expect(page.locator('#tools li:not([hidden]) .tool .why[hidden]')).toHaveCount(0);
  // A combo with a hand-written line (Noose + Maiden, +5.46 at the 2026-10-18 export).
  await expect(why('maiden').locator('strong.up')).toHaveText(/^Combo \+\d+\.\d\d$/);
  await expect(why('maiden')).toContainText(PAIR_TEXT['maiden+rope']);
  // A clash explained by the cards: both change what a Replace brings.
  await expect(why('scapegoat').locator('strong.down')).toHaveText(/^Clash −\d+\.\d\d$/);
  await expect(why('scapegoat')).toContainText('both change what a Replace brings');
  // No combo: the line is what that instrument does.
  await expect(why('cage').locator('strong')).toHaveText('No combo');
  await expect(why('cage')).toContainText(TOOL_TEXT.cage);

  await page.locator('#held [data-drop]').click();
  await expect(page.locator('#tools .tool .why:not([hidden])')).toHaveCount(0);
});

// One list does both picks (owner, 2026-10-18): the first tap is the start pick; no advice bar in between.
test('instrument pick: the first tap takes the start pick', async ({ page }) => {
  await page.goto(SHEET);
  await page.locator('#tools .tool[data-tool="rope"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(1);
  await expect(page.locator('#held .chip')).toHaveText(/Hangman's Noose/);
  await expect(page.locator('#tools .tool[data-tool="rope"]')).toBeHidden();
  await expect(page.locator('#pickOut button')).toHaveCount(0);
  await expect(page.locator('#pickOut')).toContainText("Hangman's Noose");
});

test('instrument card: own rank (tier + position), then the best second instrument with tiers', async ({ page }) => {
  await page.goto(SHEET);
  await openCard(page, 'rope');
  const pop = page.locator('#pop');
  await expect(pop).toBeVisible();
  await expect(pop.locator('.tp-rank .tier')).toHaveText(/^[SABCDE]$/);
  await expect(pop.locator('.tp-rank b')).toHaveText(/^#\d+ of \d+$/);
  const second = pop.locator('.tp-second');
  await expect(second).toContainText('Best second instrument');
  await expect(second.locator('li').first().locator('.tier')).toHaveText(/^[SABCDE]$/);
});

// The owner's run (2026-10-18): Cage Fight, holding Crowded Beastcage, offered Felon's Dog Tag, Avenger's Casket and
// Executioner's Blacklist — none in the card's top 5, so the pair they needed was not on the sheet.
async function holdBeastcage(page: Page) {
  await page.goto(SHEET);
  await page.locator('#run [data-start="cagefight"]').click();
  await page.locator('#tools .tool[data-tool="cage"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(1);
}
const candidates = (page: Page) => page.locator('#tools li:not([hidden]) .tool');

// Two rankings (owner, 2026-10-18): the instrument alone, and — once one is held — as the second, by the pair.
test('instrument card: alone, then paired with what you hold', async ({ page }) => {
  await holdBeastcage(page);
  await openCard(page, 'revenge');
  const ranks = page.locator('#pop .tp-rank');
  await expect(ranks).toHaveCount(2);
  await expect(ranks.nth(0).locator('small')).toHaveText('alone');
  await expect(ranks.nth(1).locator('small')).toHaveText('paired with Crowded Beastcage');
  await expect(ranks.nth(1).locator('b')).toHaveText(/^#\d+ of 30$/);
  // The pair's place matches the row's place in the list.
  const ids = await candidates(page).evaluateAll((t) => t.map((b) => (b as HTMLElement).dataset.tool ?? ''));
  await expect(ranks.nth(1).locator('b')).toHaveText(`#${ids.indexOf('revenge') + 1} of 30`);
});

test('instrument card: the best 5 partners only', async ({ page }) => {
  await page.goto(SHEET);
  await openCard(page, 'cage');
  await expect(page.locator('#pop')).toBeVisible();
  await expect(page.locator('#pop .tp-second .tp-pairs li')).toHaveCount(5);
});

test('instrument pick: with one held, the list ranks the second by the pair with it', async ({ page }) => {
  await holdBeastcage(page);
  await expect(candidates(page)).toHaveCount(30);
  const ids = await candidates(page).evaluateAll((t) => t.map((b) => (b as HTMLElement).dataset.tool ?? ''));
  expect(ids).toContain('revenge');
  expect(ids).not.toContain('cage');
  const values = (await candidates(page).locator('.val').allTextContents()).map(Number);
  expect(values).toEqual([...values].sort((a, b) => b - a));
  // Casket + Beastcage under Cage Fight: the pair's value from the engine export, not the Casket alone.
  const pair = await page.evaluate(() => {
    const d = JSON.parse(document.getElementById('play-data')?.textContent ?? '{}');
    const row = d.byStart.cagefight.pairs.find(
      (p: [string, string, number]) => p.includes('cage') && p.includes('revenge'),
    );
    return row[2].toFixed(2);
  });
  await expect(page.locator('#tools .tool[data-tool="revenge"] .val')).toHaveText(pair);
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
      await page.locator('#tools .tool[data-tool="keys"]').click();
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

test('instrument pick: what you hold sits above the hint', async ({ page }) => {
  await page.goto(SHEET);
  const order = await page.evaluate(() => {
    const held = document.querySelector('.held-row');
    const out = document.getElementById('pickOut');
    return held && out ? held.compareDocumentPosition(out) & Node.DOCUMENT_POSITION_FOLLOWING : 0;
  });
  expect(order).toBeTruthy();
});

// A run holds 2 instruments: a tap on a row takes it as the second; a tap on another replaces it, never a third.
test('instrument pick: a tap takes the second instrument, another tap swaps it', async ({ page }) => {
  await holdBeastcage(page);
  await page.locator('#tools .tool[data-tool="revenge"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(2);
  await expect(page.locator('#held .chip').nth(1)).toHaveText(/Avenger's Casket/);
  await expect(page.locator('#tools .tool[data-tool="revenge"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#tools .tool[data-tool="dogtag"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(2);
  await expect(page.locator('#held .chip').nth(0)).toHaveText(/Crowded Beastcage/);
  await expect(page.locator('#held .chip').nth(1)).toHaveText(/Felon's Dog Tag/);
  await expect(page.locator('#tools .tool.held')).toHaveCount(1);
  // A second tap on the taken one drops it.
  await page.locator('#tools .tool[data-tool="dogtag"]').click();
  await expect(page.locator('#held .chip')).toHaveCount(1);
});

test('instruments: one list, best first, re-ranked for the start card', async ({ page }) => {
  await page.goto(SHEET);
  const values = async () => (await page.locator('#tools .tool .val').allTextContents()).map(Number);
  const before = await values();
  expect(before).toEqual([...before].sort((a, b) => b - a));
  await page.locator('#run [data-start="cagefight"]').click();
  const after = await values();
  expect(after).toEqual([...after].sort((a, b) => b - a));
  expect(after).not.toEqual(before);
});

// Picking the second must not move the list under the pointer: an earlier advice bar grew and slid the list ~40 px
// down, so the next tap hit another row (owner, 2026-10-18).
for (const [width, height] of [
  [1440, 900],
  [390, 844],
] as const) {
  test(`instruments: a clicked row stays under the pointer (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto(SHEET);
    await page.locator('#tools .tool').first().click(); // the start pick re-sorts the list
    const ids = await page
      .locator('#tools li:not([hidden]) .tool')
      .evaluateAll((t) => t.slice(0, 6).map((b) => (b as HTMLElement).dataset.tool ?? ''));
    for (const id of ids) {
      const row = page.locator(`#tools .tool[data-tool="${id}"]`);
      await row.scrollIntoViewIfNeeded();
      const before = (await row.boundingBox())?.y ?? 0;
      await row.click();
      const after = (await row.boundingBox())?.y ?? 0;
      expect(Math.abs(after - before), id).toBeLessThan(4);
    }
  });
}

// Tiers are cut on the list in force (owner, 2026-10-18): the old multiple-of-a-bare-run cut left a start card's
// best instrument at B or C. Now the top row is S in every list, and the letters only go down the list.
test('tiers: the top row is S in every list, and letters never go up the list', async ({ page }) => {
  await page.goto(SHEET);
  const ORDER = 'SABCDE';
  const check = async (label: string) => {
    const tiers = await page
      .locator('#tools li:not([hidden]) .tool')
      .evaluateAll((t) => t.map((b) => (b as HTMLElement).dataset.tier ?? ''));
    expect(tiers[0], label).toBe('S');
    const idx = tiers.map((x) => ORDER.indexOf(x));
    expect(idx, label).toEqual([...idx].sort((a, b) => a - b));
  };
  await check('alone');
  for (const start of ['cagefight', 'ironlaw', 'tyranny']) {
    await page.locator(`#run [data-start="${start}"]`).click();
    await check(start);
  }
  await page.locator('#tools li:not([hidden]) .tool').first().click();
  await check('pair with the first pick');
  // An objective's values have rewards on and its pairs don't: measured against each other, every row read E (then ✕).
  await page.locator('#held .chip').click();
  await page.locator('#run [data-start=""]').click();
  await page.locator('#run [data-objective="walk"]').click();
  await page.locator('#tools li:not([hidden]) .tool').first().click();
  await check('objective, pair with the first pick');
});

// Our method in the open (owner, 2026-10-18): the simulator box counts the tests the export ran.
test('simulator box: our tests counted from the export, and a link to how the engine works', async ({ page }) => {
  interface Ex {
    tools: object;
    pairs: unknown[];
    byStart: Record<string, { tools: object; pairs: unknown[] }>;
    byObjective: Record<string, { tools: object }>;
    incidents?: object;
  }
  const e: Ex = JSON.parse(readFileSync('events/SS14_Tartarus/data/engine_results.json', 'utf8'));
  const n = (o: object) => Object.keys(o).length;
  const tests =
    1 +
    n(e.tools) +
    e.pairs.length +
    Object.values(e.byStart).reduce((t, x) => t + 1 + n(x.tools) + x.pairs.length, 0) +
    1 +
    Object.values(e.byObjective).reduce((t, x) => t + 1 + n(x.tools), 0) +
    n(e.incidents ?? {});
  await page.goto(SHEET);
  const box = page.locator('.sim-cta');
  await expect(box).toContainText(`${tests.toLocaleString('en')} tests`);
  await expect(box.locator('a[href$="/events/SS14_Tartarus/engine"]')).toHaveCount(1);
});

// Incidents (owner, 2026-10-18): ranked by what one "!" is worth, the number on the row instead of "go/depends".
test('incidents: best first, each with its worth against an average "!"', async ({ page }) => {
  const e = JSON.parse(readFileSync('events/SS14_Tartarus/data/engine_results.json', 'utf8'));
  await page.goto(SHEET);
  const rows = page.locator('.list li .ev');
  const ids = await rows.evaluateAll((b) => b.map((x) => (x as HTMLElement).dataset.ev ?? ''));
  const worths = ids.map((id) => e.incidents[id] as number);
  expect(worths).toEqual([...worths].sort((a, b) => b - a));
  expect(ids[0]).toBe('usurp');
  const shown = await rows.locator('strong').allTextContents();
  expect(shown).toEqual(worths.map((w) => (w > 0 ? '+' : '') + w.toFixed(2)));
  await expect(page.locator('.list:has(.ev)')).not.toContainText(/\bdepends\b/i);
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
  await expect(pop.locator('.tp-second li .tier').first()).toHaveText(/^[SABCDE]$/);

  await open('#run [data-start="tyranny"]');
  await expect(pop).toContainText('Tyranny');
  await expect(pop.locator('.tp-doubt')).toHaveCount(0);
  await expect(pop.locator('.tp-head img')).toHaveCount(1);

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
