import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Season docs stay in their season folders (SS14_Tartarus/…), the source of
// truth on disk and on GitHub; the site renders them from there.
// Ids look like "SS14_Tartarus/CHANGELOG".
const docs = defineCollection({
  loader: glob({
    base: '.',
    pattern: ['SS*_*/*_GUIDE.md', 'SS*_*/CHANGELOG.md', 'SS*_*/images/INDEX.md'],
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
});

export const collections = { docs };
