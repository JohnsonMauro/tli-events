// Screenshots for the README (docs/readme/*.webp), in the light and the dark theme: the SS14 play sheet on desktop
// with one instrument held, and three phone screens side by side (event list, play sheet, an instrument's card).
// Run after `pnpm build`: `pnpm readme-shots`. It serves dist/ itself and Chrome (the e2e browser) encodes the WebP.
/* global document, Image -- the page.evaluate callbacks below run in the browser */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const PORT = 4331;
const BASE = `http://localhost:${PORT}`;
const OUT = new URL('../docs/readme/', import.meta.url);
const BG = { light: '#f3efe6', dark: '#111214' }; // --bg of each theme (src/styles/theme.css)

// --ignore-lock: Astro 7's preview stays in the foreground, so this script can stop it
const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT), '--ignore-lock'], {
  stdio: 'ignore',
  detached: true, // its own process group: killing pnpm alone leaves astro serving the port
});
for (let i = 0; ; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {}
  if (i > 60) throw new Error('astro preview did not start');
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ channel: 'chrome' });
mkdirSync(OUT, { recursive: true });

/** A page in `theme`, the translation offer already answered, fonts in place (optional fonts need a warm cache). */
async function open(theme, path, options) {
  const ctx = await browser.newContext({ colorScheme: theme, serviceWorkers: 'block', ...options });
  await ctx.addInitScript(() => localStorage.setItem('tli-lang', 'never'));
  const page = await ctx.newPage();
  for (let i = 0; i < 2; i++) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
  }
  return page;
}

/** PNG screenshots → one WebP strip (gap and padding in --bg), scaled to `width`, encoded by Chrome. */
async function webp(page, shots, theme, width) {
  return page.evaluate(
    async ({ shots, bg, width }) => {
      const imgs = await Promise.all(
        shots.map(
          (b64) =>
            new Promise((ok) => {
              const img = new Image();
              img.onload = () => ok(img);
              img.src = `data:image/png;base64,${b64}`;
            }),
        ),
      );
      const pad = imgs.length > 1 ? 48 : 0;
      const w = imgs.reduce((s, i) => s + i.width, 0) + pad * (imgs.length + 1);
      const h = Math.max(...imgs.map((i) => i.height)) + pad * 2;
      const scale = width / w;
      const canvas = Object.assign(document.createElement('canvas'), {
        width: Math.round(w * scale),
        height: Math.round(h * scale),
      });
      const g = canvas.getContext('2d');
      g.fillStyle = bg;
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.scale(scale, scale);
      let x = pad;
      for (const img of imgs) {
        g.drawImage(img, x, pad);
        x += img.width + pad;
      }
      return canvas.toDataURL('image/webp', 0.86).split(',')[1];
    },
    { shots: shots.map((s) => s.toString('base64')), bg: BG[theme], width },
  );
}

const save = (name, b64) => {
  const data = Buffer.from(b64, 'base64');
  writeFileSync(new URL(name, OUT), data);
  console.log(`docs/readme/${name}  ${Math.round(data.length / 1024)} KB`);
};

for (const theme of ['light', 'dark']) {
  // Desktop: the play sheet with the best solo instrument held, so the list shows pairs and Combo/Clash
  const desk = await open(theme, '/ss14/', { viewport: { width: 1440, height: 900 } });
  await desk.locator('#tools .tool').first().click();
  await desk.mouse.move(0, 0);
  await desk.locator('#pop').waitFor({ state: 'hidden' });
  save(`ss14-desktop-${theme}.webp`, await webp(desk, [await desk.screenshot()], theme, 1440));
  await desk.context().close();

  // Phone: event list, play sheet, an instrument's card (a tap opens it as a dialog)
  const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };
  const home = await open(theme, '/', phone);
  const shots = [await home.screenshot()];
  const sheet = await open(theme, '/ss14/', phone);
  shots.push(await sheet.screenshot());
  const row = sheet.locator('#tools .tool').first();
  await row.scrollIntoViewIfNeeded();
  await row.tap();
  await sheet.locator('#popdlg').waitFor({ state: 'visible' });
  shots.push(await sheet.screenshot());
  save(`phone-${theme}.webp`, await webp(sheet, shots, theme, 1440));
  await home.context().close();
  await sheet.context().close();
}

await browser.close();
process.kill(-server.pid);
