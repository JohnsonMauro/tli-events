// Browser checks on the built site (`pnpm test:e2e` builds first): layout at phone and desktop widths, console
// errors, and the SS14 play sheet's interactive parts. Run by the pre-commit hook when a commit touches the site
// (lint-staged.config.js) and by CI. Uses the installed Google Chrome, so no Playwright browser download.
import { defineConfig } from '@playwright/test';

const PORT = 4329;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  // The owner works in parallel: keep it light (see the repo's CPU cap).
  workers: 4,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'line',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
  },
  webServer: {
    // --ignore-lock: runs in the foreground (Playwright stops it) and never touches a preview already running.
    command: `pnpm exec astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
