// Service worker for TLI Events (registered by src/layouts/Base.astro in production builds).
//
// GitHub Pages sends `cache-control: max-age=600` for every file, so without this the browser
// revalidates even content-hashed assets every 10 minutes. Here:
//   /_astro/*   content-hashed (CSS, JS, images, fonts) → cache-first, kept until evicted
//   pages       network-first with a short timeout → fresh data when online, last copy offline
// Bump VERSION only to drop every cache (e.g. after changing this strategy).
const VERSION = 'v1';
const ASSETS = `tli-assets-${VERSION}`;
const PAGES = `tli-pages-${VERSION}`;
const MAX_ASSETS = 300; // a few deploys' worth; oldest entries go first
const NETWORK_TIMEOUT_MS = 3000;

const scope = new URL(self.registration.scope).pathname; // e.g. /tli-events/

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([ASSETS, PAGES]);
    await Promise.all((await caches.keys()).filter((k) => k.startsWith('tli-') && !keep.has(k)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const { origin, pathname } = new URL(req.url);
  if (origin !== self.location.origin || !pathname.startsWith(scope)) return;
  if (pathname.startsWith(`${scope}_astro/`)) event.respondWith(cacheFirst(req));
  else if (req.mode === 'navigate') event.respondWith(networkFirst(req, event));
});

async function cacheFirst(req) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) {
    await cache.put(req, res.clone());
    trim(cache);
  }
  return res;
}

async function networkFirst(req, event) {
  const cache = await caches.open(PAGES);
  const network = fetch(req).then(async (res) => {
    if (res.ok) await cache.put(req, res.clone());
    return res;
  });
  // Keep the worker alive until the cache is updated, even when the cached copy answers first.
  event.waitUntil(network.catch(() => {})); // eslint-disable-line @typescript-eslint/no-empty-function -- offline: the cached copy already answered
  // Slow connection: answer from the last copy after a few seconds; the fetch still updates the cache.
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS)).then(() => cache.match(req));
  try {
    return (await Promise.race([network, timeout.then((hit) => hit || network)]));
  } catch {
    return (await cache.match(req)) || Response.error();
  }
}

async function trim(cache) {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_ASSETS)).map((k) => cache.delete(k)));
}
