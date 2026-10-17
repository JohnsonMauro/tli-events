import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every folder under events/ is a self-contained event. The site discovers
// events from their guide (`events/<Dir>/<MECHANIC>_GUIDE.md`) and reads the
// event card from its frontmatter. Folders starting with "_" (the template)
// are skipped.
const guides = defineCollection({
  loader: glob({
    base: './events',
    pattern: ['*/*_GUIDE.md', '!_*/**'],
    // id = event folder, e.g. "SS14_Tartarus"
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug: lowercase letters, digits and dashes'),
    code: z.string(),
    name: z.string(),
    nameCn: z.string().optional(),
    mechanic: z.string(),
    launched: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { guides };
