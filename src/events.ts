import { getCollection } from 'astro:content';

export interface EventInfo {
  /** URL segment, e.g. "ss14". */
  slug: string;
  /** Folder under events/, e.g. "SS14_Tartarus". */
  dir: string;
  code: string;
  name: string;
  nameCn?: string;
  mechanic: string;
  /** ISO date (YYYY-MM-DD). */
  launched: string;
  summary: string;
}

/** All events found under events/, newest first. Fails the build on duplicate slugs. */
export async function getEvents(): Promise<EventInfo[]> {
  const guides = await getCollection('guides');
  const events = guides.map((g) => ({ ...g.data, dir: g.id, launched: g.data.launched.toISOString().slice(0, 10) }));
  const seen = new Map<string, string>();
  for (const e of events) {
    const other = seen.get(e.slug);
    if (other) throw new Error(`Duplicate event slug "${e.slug}" in events/${other} and events/${e.dir}`);
    seen.set(e.slug, e.dir);
  }
  return events.sort((a, b) => b.launched.localeCompare(a.launched));
}

export async function getEvent(slug: string): Promise<EventInfo> {
  const event = (await getEvents()).find((e) => e.slug === slug);
  if (!event) throw new Error(`Unknown event slug "${slug}"`);
  return event;
}

/** Prefix an internal path with the deploy base (GitHub Pages project path). */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
