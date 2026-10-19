// Web app manifest: lets players add TLI Events to the home screen and open it like an app
// (the service worker, public/sw.js, keeps visited pages available offline).
import type { APIRoute } from 'astro';
import { url } from '../lib/events';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'TLI Events — Torchlight: Infinite season strategy',
      short_name: 'TLI Events',
      description: 'Torchlight: Infinite season event strategy: rules, odds and picks, backed by sources.',
      start_url: url(),
      scope: url(),
      display: 'standalone',
      background_color: '#111214',
      theme_color: '#111214',
      // built from public/favicon.svg by `pnpm icons`
      icons: [
        { src: url('favicon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: url('icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: url('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: url('icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
