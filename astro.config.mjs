// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// GitHub Pages serves project sites under /<repo>/; the deploy workflow sets
// SITE and BASE_PATH. Locally both fall back to the root.
// Pages can't set headers (every file gets `cache-control: max-age=600`, gzip only), so the
// build does the work: self-hosted fonts, CSS inlined into each page, hashed assets that the
// service worker (public/sw.js) keeps cache-first.
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: {
    // ~5 KB gzipped per page: cheaper than two render-blocking requests that Pages revalidates every 10 min.
    inlineStylesheets: 'always',
  },
  // Downloaded at build time and served from /_astro/fonts/ (no request to Google at runtime).
  // Body and mono text use `display: optional`: metric-matched fallbacks still wrap lines differently,
  // and a late swap reflowed the play sheet (CLS 0.2). The critical weights are preloaded (Base.astro),
  // so they usually make the first paint; on a slow first visit the page keeps the fallback, no shift.
  // Headings (brand face, one preloaded file) keep `swap`.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Barlow Semi Condensed',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700],
      // No italics anywhere on the site; pt-BR fits in Latin, and the family has no Cyrillic/CJK
      // (those pages fall back to the system font).
      styles: ['normal'],
      subsets: ['latin'],
      display: 'optional',
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Google's API now only lists the successor "Big Shoulders Stencil" (opsz axis, different look);
      // this is the legacy Display cut, Latin subset, variable weight (OFL; file from fonts.gstatic.com v30), its
      // weight axis cut to the 400–700 the site uses (fontTools varLib.instancer, 2026-10-18: 36 → 25 KB).
      provider: fontProviders.local(),
      name: 'Big Shoulders Stencil Display',
      cssVariable: '--font-display',
      display: 'swap',
      fallbacks: ['Impact', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/big-shoulders-stencil-display-latin.woff2'], weight: '400 700', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      display: 'optional',
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
