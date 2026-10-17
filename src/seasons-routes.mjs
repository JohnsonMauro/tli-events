// Filenames used as links inside season docs → route inside /<slug>/.
// Docs keep filename links so they read well on disk and on GitHub; the site
// rewrites them when rendering (see src/pages/ss14/[doc].astro).
export const DOC_ROUTES = {
  'TARTARUS_GUIDE.md': 'guide/',
  'CHANGELOG.md': 'changelog/',
  'instrument_combos.csv': 'instrument_combos.csv',
  'images/INDEX.md': 'images/',
};

/** Rewrite href="<file>" in rendered HTML to the season's routes. */
export function rewriteDocLinks(html, seasonBase) {
  return html.replace(/href="([^"#?]+)([#?][^"]*)?"/g, (whole, file, rest = '') =>
    file in DOC_ROUTES ? `href="${seasonBase}${DOC_ROUTES[file]}${rest}"` : whole);
}
