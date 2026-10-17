// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves project sites under /<repo>/; the deploy workflow sets
// SITE and BASE_PATH. Locally both fall back to the root.
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
