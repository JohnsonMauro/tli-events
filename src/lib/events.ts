import { getCollection } from 'astro:content';
import { DEFAULT_LANG, LANGS, type Lang } from './i18n';

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
  /** The card in other languages (guide frontmatter `i18n`); English when a language is missing. */
  i18n?: Partial<Record<Lang, { mechanic: string; summary: string }>>;
  /** Official key art (events/<Dir>/banner.*): event card background and share image. */
  banner?: ImageMetadata;
  /** Whether the event has a play sheet (src/pages/<slug>/index.astro); the list links only these. */
  hasPage: boolean;
}

// Discovered at build time: banners next to each guide, and which slugs have a page.
const BANNERS = import.meta.glob<{ default: ImageMetadata }>('../../events/*/banner.{webp,jpg,png}', { eager: true });
const PAGES = new Set(Object.keys(import.meta.glob('../pages/*/index.astro')).map((p) => p.split('/')[2]));
const bannerOf = (dir: string) => Object.entries(BANNERS).find(([p]) => p.includes(`/events/${dir}/`))?.[1].default;

/** All events found under events/, newest first. Fails the build on duplicate slugs. */
export async function getEvents(): Promise<EventInfo[]> {
  const guides = await getCollection('guides');
  const events = guides.map((g) => ({
    ...g.data,
    dir: g.id,
    launched: g.data.launched.toISOString().slice(0, 10),
    banner: bannerOf(g.id),
    hasPage: PAGES.has(g.data.slug),
  }));
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

/** Path of the home page (the event list) in a language: / for English, /<lang>/ otherwise. */
export const homeUrl = (lang: Lang = DEFAULT_LANG) => url(lang === DEFAULT_LANG ? '' : `${lang}/`);

/** Language switcher entries for the home page (also drives its hreflang links and the sitemap). */
export const homeLangs = (current: Lang = DEFAULT_LANG) =>
  LANGS.map((l) => ({ ...l, href: homeUrl(l.code), current: l.code === current }));

/** An event's card text in a language, falling back to English. */
export const eventCard = (event: Pick<EventInfo, 'mechanic' | 'summary' | 'i18n'>, lang: Lang = DEFAULT_LANG) =>
  event.i18n?.[lang] ?? { mechanic: event.mechanic, summary: event.summary };

/** Path of an event page in a language: /<slug>/ for English, /<slug>/<lang>/ otherwise. */
export const eventUrl = (event: Pick<EventInfo, 'slug'>, lang: Lang = DEFAULT_LANG) =>
  url(lang === DEFAULT_LANG ? `${event.slug}/` : `${event.slug}/${lang}/`);

/** Language switcher entries for an event page (also drives hreflang links and the sitemap). */
export const eventLangs = (event: Pick<EventInfo, 'slug'>, current: Lang = DEFAULT_LANG) =>
  LANGS.map((l) => ({ ...l, href: eventUrl(event, l.code), current: l.code === current }));
