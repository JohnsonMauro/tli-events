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

// What you hold and what to tap next help each other: one box, holding first (owner, 2026-10-18).
test('instrument pick: what you hold sits above the hint, in the same box', async ({ page }) => {
  await page.goto(SHEET);
  const order = await page.evaluate(() => {
    const held = document.querySelector('.held-row');
    const out = document.getElementById('pickOut');
    return held && out ? held.compareDocumentPosition(out) & Node.DOCUMENT_POSITION_FOLLOWING : 0;
  });
  expect(order).toBeTruthy();
  await expect(page.locator('.pick-box .held-row')).toHaveCount(1);
  await expect(page.locator('.pick-box #pickOut')).toHaveCount(1);
});

test('instrument pick: the Holding chip shows the instrument art left of its name', async ({ page }) => {
  await page.goto(SHEET);
  await page.locator('#tools .tool[data-tool="rope"]').click();
  const chip = page.locator('#held .chip');
  await expect(chip.locator('img')).toHaveAttribute('alt', '');
  expect(await chip.locator('img').getAttribute('src')).toBeTruthy();
  await expect(chip).toHaveAccessibleName(/^Hangman's Noose/);
  const [img, chipBox] = [await chip.locator('img').boundingBox(), await chip.boundingBox()];
  expect(img && chipBox && img.x - chipBox.x).toBeLessThan(6);
});

// The search narrows the list by name (owner, 2026-10-18): case, apostrophes and word order don't matter, the
// ranking stays, the row held as the first never comes back, and the result is announced (role="status").
test('instrument search: narrows the list by name, Esc brings every row back', async ({ page }) => {
  await page.goto(SHEET);
  const find = page.getByRole('searchbox', { name: 'Search instruments' });
  const shown = () =>
    page.locator('#tools li:not([hidden]) .tool').evaluateAll((b: HTMLElement[]) => b.map((x) => x.dataset.tool));
  const all = await shown();
  await expect(page.locator('#findOut')).toHaveAttribute('role', 'status');
  await expect(page.locator('#findOut')).toHaveText('');

  await find.fill('MAMMOTH');
  expect((await shown()).sort()).toEqual(['maul', 'tongs']);
  await expect(page.locator('#findOut')).toHaveText(`Showing 2 of ${all.length}`);
  await find.fill('coin kins');
  expect(await shown()).toEqual(['coin']);
  // A regex finds more than one at a time (owner, 2026-10-18); the placeholder says so.
  await expect(find).toHaveAttribute('placeholder', /regex.*\|/);
  await find.fill('tongs|NOOSE');
  expect((await shown()).sort()).toEqual(['rope', 'tongs']);
  const iron = await page
    .locator('#tools .tool')
    .evaluateAll((b: HTMLElement[]) =>
      b.filter((x) => x.querySelector('.nm-t')?.textContent?.trim().startsWith('Iron')).map((x) => x.dataset.tool),
    );
  await find.fill('^iron');
  expect((await shown()).sort()).toEqual(iron.sort());
  // Not a regex yet (mid-typing): plain words only, and no error.
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await find.fill('maul (');
  expect(await shown()).toEqual(['maul']);
  expect(errors).toEqual([]);
  await find.fill('zzz');
  expect(await shown()).toEqual([]);
  await expect(page.locator('#findOut')).toHaveText('No instrument by that name.');
  await find.press('Escape');
  await expect(find).toHaveValue('');
  expect(await shown()).toEqual(all);
  await expect(page.locator('#findOut')).toHaveText('');

  // A pick re-renders the list and keeps the search; the held one stays out of it.
  await find.fill('noose');
  await page.locator('#tools .tool[data-tool="rope"]').click();
  await expect(page.locator('#held .chip')).toHaveText(/Hangman's Noose/);
  expect(await shown()).toEqual([]);
  await expect(page.locator('#findOut')).toHaveText('No instrument by that name.');
});

// The search row sits centered between the hint above and the list below (owner, 2026-10-18).
for (const width of [1440, 390]) {
  test(`instrument search: centered between the hint and the list (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(SHEET);
    const box = (s: string) => page.locator(s).evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);
    const [hint, head, list] = [await box('.pick-box'), await box('.tool-head'), await box('.tool-list')];
    expect(Math.abs(head.top - hint.bottom - (list.top - head.bottom))).toBeLessThanOrEqual(1);
  });
}

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
  for (const start of ['cagefight', 'ironlaw', 'tyranny', 'opulence']) {
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

// Instrument, treasure and incident art shows whole (owner, 2026-10-18): a cropped picture hides what the card looks like in
// game. Instrument art wider than its box (Tongs, Noose…) was cropped at the sides until then. Either the image letterboxes (contain) or its box has the art's own shape.
for (const width of [390, 1440]) {
  test(`instrument, treasure and incident art is never cropped (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(SHEET);
    const imgs = page.locator('.list .pic img, #tools .tool .pic img');
    await expect(imgs.first()).toBeVisible();
    // The rows below the fold are lazy: load them first, or an unloaded image (natural size 0) proves nothing.
    await imgs.evaluateAll((list) =>
      Promise.all(
        (list as HTMLImageElement[]).map((img) => {
          img.loading = 'eager';
          return img.decode().catch(() => undefined);
        }),
      ),
    );
    const cropped = await imgs.evaluateAll((list) =>
      (list as HTMLImageElement[])
        .filter((img) => {
          if (!img.naturalWidth) return true;
          if (getComputedStyle(img).objectFit === 'contain') return false;
          const box = img.getBoundingClientRect();
          return Math.abs(box.width / box.height - img.naturalWidth / img.naturalHeight) > 0.02;
        })
        .map((img) => img.closest('li, .tool')?.textContent?.trim().slice(0, 30)),
    );
    expect(cropped).toEqual([]);
  });
}

// One row height for every instrument: the art sits on its box and never sets the row (a tall Iron Box icon made
// its row twice as tall, owner 2026-10-18).
test('instrument rows: the art never sets the row height', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(SHEET);
  const heights = await page
    .locator('#tools .tool')
    .evaluateAll((rows) => [...new Set(rows.map((r) => Math.round(r.getBoundingClientRect().height)))]);
  expect(heights).toHaveLength(1);
});

// Touch: the card opens as a modal dialog (owner, 2026-10-18 — on a phone the tooltip covered the screen, could not
// be closed or scrolled, and a tap beside it picked the row underneath).
test.describe('touch: cards open as a dialog', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test('opens on a tap, closes by its button, Esc or a tap outside, and never picks the row under it', async ({
    page,
  }) => {
    await page.goto(SHEET);
    const dlg = page.locator('#popdlg');
    const row = page.locator('#tools .tool[data-tool="coin"]');
    await row.scrollIntoViewIfNeeded();

    await row.tap();
    await expect(dlg).toBeVisible();
    await expect(page.locator('#pop')).toBeHidden();
    await expect(dlg).toContainText("Kin's Coin of Fate");
    await expect(dlg).toHaveAttribute('aria-label', /Coin/);
    const close = dlg.getByRole('button', { name: 'Close' });
    await close.tap();
    await expect(dlg).toBeHidden();
    // That tap took the Coin as the start pick: its row left the list, so focus lands on its chip in Holding.
    await expect(page.locator('#held [data-drop="coin"]')).toBeFocused();
    // A second instrument's row stays in the list: focus returns to that row.
    const second = page.locator('#tools .tool[data-tool="keys"]');
    await second.scrollIntoViewIfNeeded();
    await second.tap();
    await expect(dlg).toBeVisible();
    await close.tap();
    await expect(second).toBeFocused();

    // Esc closes it too.
    await page.locator('#tools .tool[data-tool="rope"]').tap();
    await expect(dlg).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();

    // A tap on the backdrop closes it and reaches nothing under it.
    const held = await page.locator('#held .chip').count();
    await page.locator('.list li .ev').first().tap();
    await expect(dlg).toBeVisible();
    await page.touchscreen.tap(195, 830);
    await expect(dlg).toBeHidden();
    await expect(page.locator('#held .chip')).toHaveCount(held);
  });

  // After a tap the element stays :hover until the next tap elsewhere: hover styles live under
  // (hover: hover) and (pointer: fine), so a tapped row doesn't stay lit.
  test('a tapped row does not stay lit (no sticky hover)', async ({ page }) => {
    await page.goto(SHEET);
    const rows = page.locator('.list li .ev');
    const bg = (i: number) => rows.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
    const calm = await bg(1);
    await rows.nth(0).tap();
    // Closed without another tap, so the row is still the last thing touched (and still :hover).
    await page.locator('#popdlg').evaluate((d: HTMLDialogElement) => d.close());
    await expect(page.locator('#popdlg')).toBeHidden();
    expect(await rows.nth(0).evaluate((el) => el.matches(':hover'))).toBe(true);
    expect(await bg(0)).toBe(calm);
  });

  test('a long card scrolls inside the dialog', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/ss14/ru/');
    await page.locator('#tools .tool').first().tap();
    const dlg = page.locator('#popdlg');
    await expect(dlg).toBeVisible();
    const { scrollable, overflowY } = await dlg.evaluate((d) => ({
      scrollable: d.scrollHeight > d.clientHeight,
      overflowY: getComputedStyle(d).overflowY,
    }));
    expect(overflowY).toBe('auto');
    if (scrollable) {
      await dlg.evaluate((d) => d.scrollTo({ top: d.scrollHeight, behavior: 'instant' }));
      expect(await dlg.evaluate((d) => d.scrollTop)).toBeGreaterThan(0);
    }
  });
});

// With a mouse, hover still lights the row (the media query only drops it on touch).
test('mouse: hovering an incident row still lights it', async ({ page }) => {
  await page.goto(SHEET);
  const row = page.locator('.list li .ev').first();
  const calm = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
  await row.hover();
  await expect.poll(() => row.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(calm);
});
