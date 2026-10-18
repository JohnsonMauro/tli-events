// Pre-commit checks on staged files (run by .husky/pre-commit with --hide-all --concurrent false:
// unstaged and untracked files are stashed, so the type check sees exactly what is being committed).
export default {
  '*.{js,mjs,ts,astro,css}': ['prettier --write', 'eslint --max-warnings=0 --no-warn-ignored'],
  '*.{json,yml,yaml}': 'prettier --write',
  // Whole-project type check: a function, so it does not receive the file list.
  '*.{ts,astro}': () => 'astro check',
  // Browser checks on the built site (playwright.config.ts), only when the commit touches what the site shows.
  '{src/**,public/**,e2e/**,events/*/data/*.json,events/*/art/**,events/*/credits.json,events/*/*_GUIDE.md,astro.config.mjs,playwright.config.ts,package.json,pnpm-lock.yaml}':
    () => 'pnpm test:e2e',
};
