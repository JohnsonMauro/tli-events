// Every built page in both themes, at phone width: no WCAG 2.x A/AA violations that axe can find (contrast,
// names, landmarks…). Lighthouse caught a link at 4.33:1 that the other tests let through (2026-10-18).
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { pages } from './site-pages';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const THEMES = ['light', 'dark'] as const;

async function violations(page: Page, include?: string) {
  const builder = new AxeBuilder({ page }).withTags(TAGS);
  const { violations } = await (include ? builder.include(include) : builder).analyze();
  return violations.flatMap((v) =>
    v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`),
  );
}

async function open(page: Page, path: string, colorScheme: (typeof THEMES)[number]) {
  await page.emulateMedia({ colorScheme });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(path);
  await page.waitForLoadState('load');
}

for (const { path } of pages) {
  for (const colorScheme of THEMES) {
    test(`${path} in ${colorScheme} theme: no axe violations`, async ({ page }) => {
      await open(page, path, colorScheme);
      expect(await violations(page)).toEqual([]);
    });
  }
}

// axe skips what is hidden, so the load state says nothing about closed folds, the language list and the cards.
for (const colorScheme of THEMES) {
  test(`/ss14/ in ${colorScheme} theme, folds and cards open: no axe violations`, async ({ page }) => {
    await open(page, '/ss14/', colorScheme);
    await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
    expect(await violations(page)).toEqual([]);

    // One card of each kind: instrument, start card, objective.
    for (const sel of [
      '#tools .tool[data-tool="rope"]',
      '#run [data-start="tyranny"]',
      '#run [data-objective="walk"]',
    ]) {
      await page.locator(sel).evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
      await expect(page.locator('#pop')).toBeVisible();
      expect(await violations(page, '#pop'), sel).toEqual([]);
    }
  });
}

// WCAG 2.2.2 Pause, Stop, Hide (A), which axe does not check: motion that starts on its own and runs next to other
// content must stop within 5 s (or offer a pause). Decoration is not exempt, and reduced motion is not the answer.
const MAX_MOTION_MS = 5000;

for (const { path } of pages) {
  test(`${path}: every CSS animation stops within 5 s`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('load');
    const endless = await page.evaluate(
      (max) =>
        document
          .getAnimations()
          .filter((a): a is CSSAnimation => a instanceof CSSAnimation)
          .filter((a) => !(Number(a.effect?.getComputedTiming().endTime) <= max))
          .map((a) => `${a.animationName} on .${(a.effect as KeyframeEffect).target?.getAttribute('class')}`),
      MAX_MOTION_MS,
    );
    expect(endless).toEqual([]);
  });
}
