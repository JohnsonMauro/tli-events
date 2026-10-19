// The engine's numbers travel packed in the page (./PlaySheet.astro packs, ./play.ts unpacks): every start card
// repeats 465 pairs, and spelling out both ids in each one was most of the page's embedded data (17.6 → 10.6 KB
// gzipped, 2026-10-18). Ids go once, sorted; values follow that order.

/** Two instruments and Rainbows per run with both. */
export type Pair = [string, string, number];
/** Rainbows per run by instrument id. */
export type Values = Record<string, number>;
/** A value per id or per pair, in the order of the sorted ids; null = not measured. */
export type Packed = (number | null)[];

const key = (a: string, b: string) => (a < b ? `${a}+${b}` : `${b}+${a}`);

/** One value per pair of `ids`, in the order (0,1), (0,2) … (0,n-1), (1,2) … */
export function packPairs(ids: string[], pairs: Pair[]): Packed {
  const at = new Map(pairs.map(([a, b, v]) => [key(a, b), v]));
  const out: Packed = [];
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++) out.push(at.get(key(ids[i], ids[j])) ?? null);
  return out;
}

export function unpackPairs(ids: string[], packed: Packed): Pair[] {
  const out: Pair[] = [];
  let k = 0;
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++) {
      const v = packed[k++];
      if (v != null) out.push([ids[i], ids[j], v]);
    }
  return out;
}

export const packValues = (ids: string[], values: Values): Packed => ids.map((id) => values[id] ?? null);

export const unpackValues = (ids: string[], packed: Packed): Values =>
  Object.fromEntries(ids.flatMap((id, i) => (packed[i] == null ? [] : [[id, packed[i]]])));
