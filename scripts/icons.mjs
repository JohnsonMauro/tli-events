// Builds every raster icon from public/favicon.svg (the one source; edit it, then run `pnpm icons` and commit
// the output). Chrome draws the SVG — the same browser the e2e tests use — so no image tool is needed.
//   favicon.ico            16/32/48 for browsers and tools that never ask for the SVG
//   apple-touch-icon.png   180, opaque (iOS fills transparency with black and rounds the corners itself)
//   icon-192.png/-512.png  the web app manifest's icons (Android's install prompt wants PNGs)
//   icon-maskable-512.png  full bleed, the lantern inside the 80% safe circle Android crops to
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const PUBLIC = new URL('../public/', import.meta.url);
const svg = readFileSync(new URL('favicon.svg', PUBLIC), 'utf8');
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
// the tile's own colour (--bg of the dark theme): where the rounded tile meets this, no edge shows
const TILE = '#111214';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ deviceScaleFactor: 1 });

/** The SVG drawn at `size` px, at `scale` of the canvas, on `bg` (null = transparent). */
async function draw(size, { scale = 1, bg = null } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const box = Math.round(size * scale);
  await page.setContent(
    `<body style="margin:0;display:grid;place-items:center;width:${size}px;height:${size}px;background:${bg ?? 'transparent'}">` +
      `<img src="${src}" width="${box}" height="${box}" alt=""></body>`,
  );
  await page.locator('img').evaluate((img) => img.decode());
  return page.screenshot({ omitBackground: bg === null });
}

/** An ICO file holding PNG images (supported since Windows Vista and by every current browser). */
function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size % 256, e); // 0 means 256
    head.writeUInt8(size % 256, e + 1);
    head.writeUInt16LE(1, e + 4); // colour planes
    head.writeUInt16LE(32, e + 6); // bits per pixel
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.data)]);
}

const out = (name, data) => {
  writeFileSync(new URL(name, PUBLIC), data);
  console.log(`public/${name}  ${data.length} B`);
};

const small = [];
for (const size of [16, 32, 48]) small.push({ size, data: await draw(size) });
out('favicon.ico', ico(small));
out('apple-touch-icon.png', await draw(180, { bg: TILE }));
out('icon-192.png', await draw(192));
out('icon-512.png', await draw(512));
out('icon-maskable-512.png', await draw(512, { scale: 0.8, bg: TILE }));

await browser.close();
