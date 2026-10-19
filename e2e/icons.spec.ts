// The site's icons (built from public/favicon.svg by `pnpm icons`): every icon the page head and the web app
// manifest point to is served, with the type and pixel size they declare — a missing or stale PNG would leave a
// blank tile on a home screen and no console error anywhere.
import { expect, test } from '@playwright/test';

/** Width × height from a PNG's IHDR chunk. */
const pngSize = (b: Buffer) => `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;

test('head icons are served, the .ico holds 16, 32 and 48 px', async ({ page, request }) => {
  await page.goto('/');
  const links = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((els) => els.map((el) => (el as HTMLLinkElement).href));
  expect(links.map((l) => new URL(l).pathname).sort()).toEqual([
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon.svg',
  ]);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);

  const ico = await (await request.get('/favicon.ico')).body();
  const count = ico.readUInt16LE(4);
  const sizes = Array.from({ length: count }, (_, i) => ico.readUInt8(6 + 16 * i));
  expect(sizes).toEqual([16, 32, 48]);
  expect(pngSize(await (await request.get('/apple-touch-icon.png')).body())).toBe('180x180');
});

test('manifest icons are served at the size and type they declare', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  const icons: { src: string; sizes: string; type: string; purpose: string }[] = manifest.icons;
  expect(icons.map((i) => i.purpose)).toContain('maskable');
  for (const icon of icons) {
    const res = await request.get(icon.src);
    expect(res.status(), icon.src).toBe(200);
    expect(res.headers()['content-type'], icon.src).toContain(icon.type);
    if (icon.type === 'image/png') expect(pngSize(await res.body()), icon.src).toBe(icon.sizes);
  }
});
