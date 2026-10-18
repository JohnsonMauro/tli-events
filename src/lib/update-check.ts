// "A new version of this page is out — Reload" (the toast in src/layouts/Base.astro). Players keep the page
// open through a run, and a copy can come from a cache (Pages' 10-minute max-age, or the service worker's
// slow-network fallback), so the page asks the server now and then whether it is still current: it compares its
// own <meta name="tli-build"> (the commit it was built from) with the live page's.
const META = 'meta[name="tli-build"]';
// First look shortly after load (catches a cached copy), then each time the tab comes back into view.
const FIRST_CHECK_MS = 1500;
const MIN_GAP_MS = 60_000;

async function liveBuild(): Promise<string | null> {
  // `no-cache` revalidates with the server (a 304 when nothing changed), skipping a stale HTTP-cache copy.
  const res = await fetch(location.href, { cache: 'no-cache' });
  if (!res.ok) return null;
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  return doc.querySelector<HTMLMetaElement>(META)?.content ?? null;
}

// Reload that is sure to show the new page: the service worker answers a slow navigation (over 3 s) from its page
// cache, so put the fresh copy there first; then reload. Offline or with no cache, it is a plain reload.
async function reloadFresh() {
  const url = location.href.split('#')[0];
  try {
    const res = await fetch(url, { cache: 'reload' });
    if (res.ok && 'caches' in window) {
      const names = (await caches.keys()).filter((k) => k.startsWith('tli-pages-'));
      await Promise.all(names.map(async (n) => (await caches.open(n)).put(url, res.clone())));
    }
  } catch {
    // Network or storage failed: the reload below still asks the server first.
  }
  location.reload();
}

export function watchForUpdates() {
  const mine = document.querySelector<HTMLMetaElement>(META)?.content;
  const toast = document.getElementById('update-toast');
  if (!mine || !toast) return;
  const button = toast.querySelector('button');
  button?.addEventListener('click', () => {
    button.disabled = true;
    void reloadFresh();
  });

  let last = 0;
  const check = async () => {
    if (!toast.hidden || Date.now() - last < MIN_GAP_MS) return;
    last = Date.now();
    try {
      const live = await liveBuild();
      if (live && live !== mine) toast.hidden = false;
    } catch {
      // Offline or a network hiccup: try again on the next visit to the tab.
    }
  };
  setTimeout(check, FIRST_CHECK_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
}
