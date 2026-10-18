// Every page in the build (`pnpm test:e2e` builds first), as its HTML file and the URL path it is served at.
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );

export const pages = htmlFiles(DIST).map((file) => ({
  file,
  path: '/' + relative(DIST, file).replace(/(^|\/)index\.html$/, '$1'),
}));
