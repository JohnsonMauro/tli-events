// The instrument search (./play.ts): plain words, or a regex when the field has regex syntax.
// A regex runs on the reader's own page and JavaScript can't stop one mid-run, so a pattern that can backtrack for
// minutes is refused before it runs: `(.*)*z$` on a 43-character name hung for over two minutes (2026-10-18).

/** Longest search the field takes (its `maxlength`, enforced here too). */
export const FIND_MAX = 60;
/** Most quantifiers a regex may hold: each one can multiply the work by the name's length (43 at most). */
const MAX_QUANTIFIERS = 3;

/** No accents or apostrophes, lower case: "kins" finds "Kin's". */
export const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\p{M}'’]/gu, '')
    .toLowerCase();
/** Words only: "kins coin" finds "Kin's Coin of Fate". */
export const norm = (s: string) => plain(s).replace(/[^\p{L}\p{N}]+/gu, ' ');

const QUANT = new Set(['*', '+', '?', '{']);

/** True for a pattern that can backtrack catastrophically: a backreference, a quantified group holding a quantifier
 * or an alternation (`(.*)*`, `(a|a)+`, at any depth), or more than MAX_QUANTIFIERS quantifiers. */
export function risky(q: string): boolean {
  let quantifiers = 0;
  const groups: boolean[] = []; // per open group: does it hold a quantifier or "|"?
  for (let i = 0; i < q.length; i++) {
    const c = q[i];
    if (c === '\\') {
      if (/[1-9k]/.test(q[i + 1] ?? '')) return true;
      i++;
    } else if (c === '[') {
      // a class is one character: skip to its closing "]" (escapes inside included)
      for (i++; i < q.length && q[i] !== ']'; i++) if (q[i] === '\\') i++;
    } else if (c === '(') {
      groups.push(false);
      if (q[i + 1] === '?') i++; // (?: (?= (?<name> — not a quantifier
    } else if (c === ')') {
      const holds = groups.pop() ?? false;
      if (holds && QUANT.has(q[i + 1] ?? '')) return true;
      if (holds && groups.length) groups[groups.length - 1] = true;
    } else if (QUANT.has(c)) {
      if (c === '{') i = q.indexOf('}', i) < 0 ? i : q.indexOf('}', i);
      if (q[i + 1] === '?') i++; // lazy: same quantifier
      quantifiers++;
      if (groups.length) groups[groups.length - 1] = true;
    } else if (c === '|' && groups.length) {
      groups[groups.length - 1] = true;
    }
  }
  return quantifiers > MAX_QUANTIFIERS;
}

/** What the field asks for: words to match in any order, or a regex (case-insensitive) when it has regex syntax and
 * compiles. `heavy`: it looked like a regex but was refused as risky — searched as words, and the page says so. */
export function parseFind(raw: string): { q: string; words: string[]; re: RegExp | null; heavy: boolean } {
  const q = raw.slice(0, FIND_MAX).trim();
  const words = norm(q).split(' ').filter(Boolean);
  if (!/[\\^$.|?*+()[\]{}]/.test(q)) return { q, words, re: null, heavy: false };
  if (risky(q)) return { q, words, re: null, heavy: true };
  try {
    return { q, words, re: new RegExp(q, 'iu'), heavy: false };
  } catch {
    return { q, words, re: null, heavy: false }; // still being typed
  }
}

/** A regex matches the name (also without accents and apostrophes); plain words must all be in it, any order. */
export function matches(name: string, words: string[], re: RegExp | null): boolean {
  if (re) return re.test(name) || re.test(plain(name));
  return words.length > 0 && words.every((w) => norm(name).includes(w));
}
