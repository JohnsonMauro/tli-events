import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';

// Static copy of the generated CSV (SS14_Tartarus/instrument_combos.csv).
export const GET: APIRoute = async () => {
  const csv = await readFile(new URL('../../../SS14_Tartarus/instrument_combos.csv', import.meta.url), 'utf-8');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
};
