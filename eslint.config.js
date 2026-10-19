// ESLint flat config. Every block is scoped by `files`: a rule set without it would also run on CSS
// and crash ("sourceCode.getAllComments is not a function").
import css from '@eslint/css';
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const CODE = ['**/*.{js,mjs,ts}', '**/*.astro'];

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'node_modules/']),
  {
    files: CODE,
    extends: [js.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic],
    rules: {
      // localStorage is a per-viewer convenience: it throws in private windows and the page works without it.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  // TypeScript already checks undefined names (and knows Astro's ambient types such as ImageMetadata).
  { files: ['**/*.{ts,astro}'], rules: { 'no-undef': 'off' } },
  // .astro components (frontmatter + template), with the a11y checks for their markup.
  { files: ['**/*.astro'], extends: [astro.configs['flat/recommended'], astro.configs['flat/jsx-a11y-recommended']] },
  // Build-time code: astro.config.mjs, the endpoints/content config and scripts/ run in Node.
  {
    files: ['astro.config.mjs', 'src/pages/**/*.ts', 'src/content.config.ts', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  // Client scripts run in the browser; the service worker in its own scope.
  { files: ['src/**/*.ts', 'src/**/*.astro'], languageOptions: { globals: globals.browser } },
  { files: ['public/sw.js'], languageOptions: { globals: globals.serviceworker } },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    rules: {
      // Tokens come from theme.css (site.css and play.css read them across files) and from Astro's <Font cssVariable>.
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
      // --sans/--display/--mono already end in a generic family: Astro builds them from `fallbacks` in astro.config.mjs.
      'css/font-family-fallbacks': 'off',
      // Progressive enhancement, each with a fallback in place: ::-webkit-scrollbar, a near-opaque nav
      // background under the blur, and the -webkit- prefixed background-clip next to the standard one.
      'css/use-baseline': [
        'error',
        {
          allowProperties: ['scrollbar-width', 'scrollbar-color', 'backdrop-filter'],
          allowPropertyValues: { 'background-clip': ['text'] },
        },
      ],
    },
  },
]);
