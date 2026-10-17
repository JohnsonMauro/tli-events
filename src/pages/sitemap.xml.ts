// /sitemap.xml: the home page and every event page in every language, with hreflang alternates.
// A project site can't serve /robots.txt at the domain root, so submit this URL in Search Console.
import type { APIRoute } from 'astro';
import { eventLangs, getEvents, url } from '../lib/events';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => esc(new URL(path, site).href);
  const entries = [`  <url><loc>${abs(url())}</loc></url>`];
  for (const event of (await getEvents()).filter((e) => e.hasPage)) {
    const langs = eventLangs(event);
    const alternates = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${abs(l.href)}"/>`).join('\n');
    for (const l of langs) entries.push(`  <url><loc>${abs(l.href)}</loc>\n${alternates}\n  </url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
