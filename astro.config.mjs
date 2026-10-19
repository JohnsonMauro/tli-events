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
      // No italics anywhere on the site; latin-ext is for Polish and vietnamese for Vietnamese (each loaded by
      // unicode-range only where used), and the family has no Cyrillic/CJK (those pages fall back to the system font).
      styles: ['normal'],
      subsets: ['latin', 'latin-ext', 'vietnamese'],
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
        // Three files split by unicode-range, as Google serves them: a page loads latin-ext or vietnamese only when it
        // shows one of their letters (Polish ą ę ł ń ś ź ż ć; Vietnamese ơ ư đ and the tone marks). Same v30 source and
        // 400–700 cut (2026-10-18).
        variants: [
          {
            src: ['./src/assets/fonts/big-shoulders-stencil-display-latin.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [
              'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
            ],
          },
          {
            src: ['./src/assets/fonts/big-shoulders-stencil-display-latin-ext.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [
              'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF',
            ],
          },
          {
            src: ['./src/assets/fonts/big-shoulders-stencil-display-vietnamese.woff2'],
            weight: '400 700',
            style: 'normal',
            unicodeRange: [
              'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB',
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'],
      display: 'optional',
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
