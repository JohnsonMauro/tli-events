// public/sw.js: once the worker controls the page, a navigation still reaches the server, revalidated
// (`cache: 'no-cache'` → Cache-Control: max-age=0), and the page loads.
import { expect, test } from '@playwright/test';

test('service worker: a controlled navigation is revalidated with the server', async ({ page, context }) => {
  await page.goto('/ss14/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }));
  });

  const fromWorker = new Promise<Record<string, string>>((resolve) => {
    context.on('request', async (req) => {
      if (req.serviceWorker() && new URL(req.url()).pathname === '/ss14/') resolve(await req.allHeaders());
    });
  });
  // A plain navigation (link, typed URL), not reload(): a reload is already `no-cache` and hides the bug.
  await page.goto('/');
  await page.goto('/ss14/');
  const headers = await fromWorker;
  expect(headers['cache-control']).toBe('max-age=0');
  await expect(page.locator('.sim-date')).toBeVisible();
});
