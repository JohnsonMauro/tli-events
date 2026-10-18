// Every built page, at phone and desktop width: no sideways scroll, no console errors from our own code, and no
// words glued together by `compressHTML` (see .claude/skills/astro-site → Markup).
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, test } from '@playwright/test';

const DIST = 'dist';
const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );
const pages = htmlFiles(DIST).map((file) => ({
  file,
  path: '/' + relative(DIST, file).replace(/(^|\/)index\.html$/, '$1'),
}));

const WIDTHS = [390, 1440];

for (const { path } of pages) {
  for (const width of WIDTHS) {
    test(`${path} at ${width}px: no sideways scroll, no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        // Third-party scripts (analytics, often blocked) are not ours to fix.
        if (m.type() === 'error' && m.location().url.startsWith('http://localhost')) errors.push(m.text());
      });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.waitForLoadState('load');
      const { scroll, client, scrollers } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
        // Content wider than a box that scrolls on its own (the play sheet's panes): the page stays narrow, the
        // box gets a sideways scroll. The nav's link strip scrolls sideways on purpose (src/layouts/Base.astro).
        scrollers: [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => !el.closest('nav') && ['auto', 'scroll'].includes(getComputedStyle(el).overflowX))
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map(
            (el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${el.scrollWidth}>${el.clientWidth}`,
          ),
      }));
      expect(scroll, 'page wider than the screen').toBeLessThanOrEqual(client);
      expect(scrollers, 'boxes that scroll sideways').toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

// A line break between inline elements vanishes in the build: "02</span>Flow". Latin and Cyrillic only —
// CJK and Korean write words without spaces, so a letter next to a tag is normal there.
const LETTER = '[A-Za-zÀ-ÖØ-öø-ÿА-Яа-яЁё]';
const INLINE = '(?:span|b|a|code|em|i|strong|time)';
const GLUED = new RegExp(`${LETTER}(?:</${INLINE}>|<${INLINE}\\b[^>]*>)${LETTER}`, 'g');

for (const { file, path } of pages) {
  test(`${path}: no words glued across inline tags`, () => {
    const html = readFileSync(file, 'utf8').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/g, '');
    const glued = [...html.matchAll(GLUED)].map((m) => html.slice(Math.max(0, m.index - 30), m.index + 30));
    expect(glued).toEqual([]);
  });
}
