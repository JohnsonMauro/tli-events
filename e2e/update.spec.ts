// The "new version" notice (src/lib/update-check.ts): the page compares its build with the live page's.
// The live page is faked by rewriting the check's fetch (the navigation itself stays real). Service workers
// are blocked here so Playwright sees that fetch.
import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

for (const path of ['/', '/ss14/', '/ss14/pt-br/']) {
  test(`${path}: no notice while the live page is the same build`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(2500);
    await expect(page.locator('#update-toast')).toBeHidden();
  });

  test(`${path}: notice and reload when the live page is a newer build`, async ({ page }) => {
    await page.route(
      (url) => url.pathname === new URL(path, 'http://x').pathname,
      async (route) => {
        if (route.request().resourceType() !== 'fetch') return route.continue();
        const res = await route.fetch();
        const html = (await res.text()).replace(/(<meta name="tli-build" content=")[^"]*/, '$1newer-build');
        await route.fulfill({ response: res, body: html });
      },
    );
    await page.goto(path);
    const toast = page.locator('#update-toast');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast.locator('button')).toBeVisible();

    const reloaded = page.waitForEvent('load');
    await toast.locator('button').click();
    await reloaded;
  });
}

// The service worker answers a slow navigation from its page cache, so Reload first puts the fresh page there:
// the copy it would fall back on is the new one, never the old.
test('Reload refreshes the cached page before reloading', async ({ page }) => {
  await page.route(
    (url) => url.pathname === '/',
    async (route) => {
      if (route.request().resourceType() !== 'fetch') return route.continue();
      const res = await route.fetch();
      const html = (await res.text()).replace(/(<meta name="tli-build" content=")[^"]*/, '$1newer-build');
      await route.fulfill({ response: res, body: html });
    },
  );
  await page.goto('/');
  await page.evaluate(async () => {
    const cache = await caches.open('tli-pages-v2');
    await cache.put(location.href, new Response('<meta name="tli-build" content="old-build">'));
  });
  const toast = page.locator('#update-toast');
  await expect(toast).toBeVisible({ timeout: 5000 });
  const reloaded = page.waitForEvent('load');
  await toast.locator('button').click();
  await reloaded;
  const cached = await page.evaluate(async () =>
    (await (await caches.open('tli-pages-v2')).match(location.href))?.text(),
  );
  expect(cached).toContain('newer-build');
});
