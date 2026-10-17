// Only what differs from Prettier's defaults. prettier-plugin-astro's astroCompressHTML default ('jsx')
// already matches Astro 7's compressHTML, so formatting does not change the rendered whitespace.
/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  printWidth: 120,
  plugins: ['prettier-plugin-astro'],
};
