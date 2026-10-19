// The whole site in every language, not only the play sheets: the home page at /<lang>/, links that keep the
// reader's language, the 404 page rewritten for the reader, and the sitemap.
import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

test('the home page in Portuguese: its texts, the card, links that stay in Portuguese', async ({ page }) => {
  await page.goto('/pt-br/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('.tagline')).toHaveText('As mecânicas de temporada de Torchlight: Infinite, decifradas.');
  const card = page.locator('a.season-card').first();
  await expect(card).toHaveAttribute('href', '/ss14/pt-br/');
  await expect(card).toContainText('uma prisão de 16 celas');
  // The launch date written the Portuguese way, not ISO.
  await expect(card.locator('.code')).toHaveText(/^SS14 desde 15 de out\.? de 2026$/);
  await expect(page.locator('a.brand')).toHaveAttribute('href', '/pt-br/');
  await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute('href', /\/vi\/$/);
});

test('the switcher on the home page lists the home page in every language', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('.lang-select a[data-lang]');
  await expect(links).toHaveCount(12);
  await expect(page.locator('.lang-select a[data-lang="vi"]')).toHaveAttribute('href', '/vi/');
  await expect(page.locator('.lang-select a[data-lang="en"]')).toHaveAttribute('href', '/');
});

test('from a play sheet, the logo and "All events" go back to the home page in its language', async ({ page }) => {
  await page.goto('/ss14/vi/');
  await expect(page.locator('a.brand')).toHaveAttribute('href', '/vi/');
  await expect(page.locator('.sheet-top a.back')).toHaveAttribute('href', '/vi/');
  await page.goto('/ss14/');
  await expect(page.locator('.sheet-top a.back')).toHaveAttribute('href', '/');
});

test.describe('404', () => {
  test('a missing path under /pt-br/ answers in Portuguese', async ({ page }) => {
    await page.goto('/pt-br/nao-existe/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('#nf-tagline')).toHaveText('Esta cela está vazia.');
    await expect(page.locator('#nf-lead a')).toHaveAttribute('href', '/pt-br/');
    await expect(page.locator('#nf-list a').first()).toHaveAttribute('href', '/ss14/pt-br/');
    await expect(page.locator('a.brand')).toHaveAttribute('href', '/pt-br/');
    await expect(page).toHaveTitle('Página não encontrada · TLI Events');
  });

  test.describe('a Vietnamese browser', () => {
    test.use({ locale: 'vi-VN' });
    test('a missing path with no language in it answers in Vietnamese', async ({ page }) => {
      await page.goto('/no-such-page/');
      await expect(page.locator('#nf-tagline')).toHaveText('Ô này trống.');
      await expect(page.locator('#nf-list a').first()).toHaveAttribute('href', '/ss14/vi/');
    });
  });

  test('a saved choice wins over the browser language', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('tli-lang', 'fr'));
    await page.goto('/no-such-page/');
    await expect(page.locator('#nf-tagline')).toHaveText('Cette cellule est vide.');
  });

  test('an English browser keeps the English page', async ({ page }) => {
    await page.goto('/no-such-page/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#nf-tagline')).toHaveText('This cell is empty.');
  });
});

test('the sitemap lists the home page in every language, with alternates', async () => {
  const xml = readFileSync('dist/sitemap.xml', 'utf8');
  for (const path of ['/', '/pt-br/', '/vi/', '/ss14/', '/ss14/vi/']) expect(xml).toContain(`${path}</loc>`);
  expect(xml).toMatch(
    /<loc>[^<]*\/pt-br\/<\/loc>\n(\s*<xhtml:link[^>]*\/>\n)*\s*<xhtml:link rel="alternate" hreflang="vi"/,
  );
});
