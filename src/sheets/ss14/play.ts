/* Client script for /ss14/ (all languages) — your run's choices, the instrument pick and the info popover. */
// Data is embedded by the page as <script type="application/json" id="play-data">: our engine's numbers
// (default, per start card, per objective), the tier thresholds, live offer counts and `ui` strings (./i18n/).

import { matches, parseFind } from './find';
import { unpackPairs, unpackValues, type Packed, type Pair, type Values } from './pack';
import { TEXT_KEY, TEXT_SIZES } from './text-size';

interface Tool {
  name: string;
  value: number;
}
interface PlayData {
  tools: Record<string, Tool>;
  pairs: Pair[];
  base: number;
  byStart: Record<string, { base: number; tools: Values; pairs: Pair[] }>;
  byObjective: Record<string, { base: number; tools: Values }>;
  tiers: [string, number][];
  offers: { n: number; counts: Record<string, number> } | null;
  /** What each instrument gives the block and pays off on (./tool-text.ts → TOOL_LINKS). */
  links: Record<string, { gives: string[]; needs: string[] }>;
  /** Pairs whose hand-written line explains a link (./tool-text.ts → PAIR_LINKED). */
  linked: string[];
  ui: Record<
    | 'perRun'
    | 'remove'
    | 'nothing'
    | 'pickHint'
    | 'pickSecond'
    | 'offered'
    | 'withYou'
    | 'partners'
    | 'partnersSub'
    | 'rankOf'
    | 'rankAlone'
    | 'rankPair'
    | 'doubt'
    | 'combo'
    | 'clashV'
    | 'noCombo'
    | 'findCount'
    | 'findNone'
    | 'findHeavy'
    | 'resetDone',
    string
  > & {
    tool: Record<string, string>;
    /** What two instruments do together, keyed by their ids sorted and joined with "+"; only some pairs have one. */
    pair: Record<string, string>;
    /** Templates ({a} gives, {b} pays off) for a combo, by what links them. */
    link: Record<string, string>;
    /** Templates for a clash: `clear` (a empties what b needs), `full` (a fills what b wants thin), `overlap`. */
    clashWhy: Record<string, string>;
  };
}
/** The run's instruments in the order taken: [start pick, objective reward]. */
interface PickState {
  held: string[];
}
/** What this run got: a start card id and an objective id ('' = not marked). */
interface RunState {
  start: string;
  objective: string;
}
/** The numbers in force for the run's choices. */
interface Numbers {
  base: number;
  tools: Values;
  pairs: Pair[];
  /** Each instrument alone in the same runs as `pairs` (an objective's `tools` have rewards on, its pairs don't). */
  pairSolo: Values;
  /** No instrument, in the same runs as `pairs`. */
  pairBase: number;
}

// "Last simulation": the build's UTC instant in the reader's own time zone, labelled with that zone's offset.
const simAt = document.querySelector<HTMLTimeElement>('time[data-sim]');
if (simAt) showLocalTime(simAt);

function showLocalTime(at: HTMLTimeElement) {
  const when = new Date(at.dateTime);
  if (Number.isNaN(when.getTime())) return;
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  const lang = document.documentElement.lang;
  let text: string;
  try {
    text = new Intl.DateTimeFormat(lang, { ...opts, timeZoneName: 'shortOffset' }).format(when);
  } catch {
    // Browsers before 'shortOffset' (2021–22): the zone's short name instead.
    text = new Intl.DateTimeFormat(lang, { ...opts, timeZoneName: 'short' }).format(when);
  }
  at.textContent = text;
}

/** The page's data as embedded: pairs and per-card values packed by the sorted ids (./pack.ts). */
type Embedded = Omit<PlayData, 'pairs' | 'byStart' | 'byObjective'> & {
  ids: string[];
  pairs: Packed;
  byStart: Record<string, { base: number; tools: Packed; pairs: Packed }>;
  byObjective: Record<string, { base: number; tools: Packed }>;
};
const unpack = (e: Embedded): PlayData => ({
  ...e,
  pairs: unpackPairs(e.ids, e.pairs),
  byStart: Object.fromEntries(
    Object.entries(e.byStart).map(([id, s]) => [
      id,
      { base: s.base, tools: unpackValues(e.ids, s.tools), pairs: unpackPairs(e.ids, s.pairs) },
    ]),
  ),
  byObjective: Object.fromEntries(
    Object.entries(e.byObjective).map(([id, o]) => [id, { base: o.base, tools: unpackValues(e.ids, o.tools) }]),
  ),
});

const el = document.getElementById('play-data');
const raw: Embedded | null = el ? JSON.parse(el.textContent || 'null') : null;
const D: PlayData | null = raw ? unpack(raw) : null;
const grid = document.getElementById('tools');
const out = document.getElementById('pickOut');
const heldEl = document.getElementById('held');
const pop = document.getElementById('pop');

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);
const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

if (D && grid && out && heldEl && pop) init(D, grid, out, heldEl, pop);

function init(D: PlayData, grid: HTMLElement, out: HTMLElement, heldEl: HTMLElement, pop: HTMLElement) {
  const T = D.ui;
  // Text size: what the page's inline script applied from this browser's choice (./text-size.ts).
  const applied = Number(document.documentElement.style.getPropertyValue('--fs'));
  let fs = TEXT_SIZES.includes(applied) ? applied : TEXT_SIZES[0];

  // Per-viewer convenience only: what this player holds, kept in this browser.
  const KEY = 'ss14-pick-v1';
  let S: PickState = { held: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Array.isArray(saved.held)) S = { held: saved.held.slice(0, 2) };
  } catch {}
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch {}
  };

  // The run's choices, also kept in this browser only.
  const RUN_KEY = 'ss14-run-v1';
  let R: RunState = { start: '', objective: '' };
  try {
    const saved = JSON.parse(localStorage.getItem(RUN_KEY) || 'null');
    if (saved && typeof saved.start === 'string') R = { start: saved.start, objective: saved.objective || '' };
  } catch {}
  const soloDefaults = Object.fromEntries(Object.entries(D.tools).map(([id, x]) => [id, x.value]));
  const defaults: Numbers = {
    base: D.base,
    tools: soloDefaults,
    pairs: D.pairs,
    pairSolo: soloDefaults,
    pairBase: D.base,
  };
  /** A start card changes the rules, so it wins; an objective only through its reward (values with rewards on). */
  const numbers = (): Numbers => {
    const s = D.byStart[R.start];
    if (s) return { ...s, pairSolo: s.tools, pairBase: s.base };
    const o = D.byObjective[R.objective];
    if (o) return { base: o.base, tools: o.tools, pairs: D.pairs, pairSolo: soloDefaults, pairBase: D.base };
    return defaults;
  };
  let N = numbers();

  const toolName = (id: string) => D.tools[id]?.name ?? id;
  const value = (id: string) => N.tools[id] ?? D.tools[id]?.value ?? 0;
  /** A list's scale: what its rows are measured against, and its best row. */
  interface Scale {
    base: number;
    best: number;
  }
  /** Tier = share of the best row's gain over `base` (PlaySheet.astro → TIERS); E = no gain. */
  const tierIn = (v: number, sc: Scale) =>
    v <= sc.base || sc.best <= sc.base
      ? 'E'
      : (D.tiers.find(([, share]) => (v - sc.base) / (sc.best - sc.base) >= share)?.[0] ?? 'D');
  /** Instruments alone, for the run's choices. */
  const soloScale = (): Scale => ({ base: N.base, best: Math.max(...Object.keys(D.tools).map((id) => value(id))) });
  /** Second instruments: the pair with `first`, against `first` alone in the same runs as the pairs. */
  const pairScale = (first: string): Scale => ({
    base: N.pairSolo[first] ?? value(first),
    best: Math.max(
      ...Object.keys(D.tools)
        .filter((id) => id !== first)
        .map((id) => pairValue(id, first) ?? 0),
    ),
  });
  /** The scale of the list on screen. */
  const listScale = () => (S.held[0] ? pairScale(S.held[0]) : soloScale());
  /** Position among all instruments for the current numbers (1 = best), for "#5 of 31". */
  const rankOf = (id: string) => {
    const ids = Object.keys(D.tools);
    return { n: 1 + ids.filter((x) => value(x) > value(id)).length, total: ids.length };
  };
  const pairValue = (a: string, b: string) =>
    N.pairs.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] ?? null;
  // ---------- what a pair does together (a row's line once one is held) ----------
  // The verdict comes from the numbers in force: what the pair gains over the two apart. The reason comes from
  // the cards (TOOL_LINKS) and is shown only when it agrees with the verdict; a hand-written line wins.
  const COMBO = 0.5; // Rainbows per run; below it either way the two just add up (./tool-text.ts → PAIR_TEXT)
  const LINK_ORDER = ['rats', 'twins', 'replace', 'clear', 'bites', 'open', 'full']; // most telling first
  const linked = new Set(D.linked);
  const shortName = (id: string) => toolName(id).split(':')[0];
  const gives = (id: string, l: string) => D.links[id]?.gives.includes(l) ?? false;
  const needs = (id: string, l: string) => D.links[id]?.needs.includes(l) ?? false;
  const why = (tpl: string | undefined, a: string, b: string) =>
    tpl ? fmt(tpl, { a: shortName(a), b: shortName(b) }) : '';
  const comboWhy = (a: string, b: string) => {
    const l = LINK_ORDER.find((x) => gives(a, x) && needs(b, x));
    return l ? why(T.link[l], a, b) : '';
  };
  const clashWhy = (a: string, b: string) => {
    if (gives(a, 'clear') && ['full', 'twins', 'rats'].some((x) => needs(b, x))) return why(T.clashWhy.clear, a, b);
    if (gives(a, 'full') && needs(b, 'clear')) return why(T.clashWhy.full, a, b);
    if (gives(a, 'replace') && gives(b, 'replace')) return why(T.clashWhy.overlap, a, b);
    return '';
  };
  /** A row's line with `first` held: verdict ('up' combo, 'down' clash, '' none) and what the two do together. */
  const pairLine = (id: string, first: string) => {
    const v = pairValue(id, first);
    const key = [id, first].sort().join('+');
    const hand = T.pair[key];
    const gain = v == null ? 0 : v - ((N.pairSolo[id] ?? 0) + (N.pairSolo[first] ?? 0) - N.pairBase);
    const signed = (gain > 0 ? '+' : '−') + Math.abs(gain).toFixed(2);
    if (gain >= COMBO) {
      const text = (linked.has(key) && hand) || comboWhy(first, id) || comboWhy(id, first);
      return { kind: 'up', label: fmt(T.combo, { v: signed }), text };
    }
    if (gain <= -COMBO)
      return { kind: 'down', label: fmt(T.clashV, { v: signed }), text: clashWhy(first, id) || clashWhy(id, first) };
    return { kind: '', label: T.noCombo, text: (!linked.has(key) && hand) || T.tool[id] || '' };
  };

  /** What a row is worth now: alone before the first pick; after it, the pair with the first instrument. */
  const rowValue = (id: string) => {
    const first = S.held[0];
    return first ? (pairValue(id, first) ?? value(id)) : value(id);
  };
  const head = grid.querySelector('.tool-head > span');
  const list = grid.querySelector('.tool-list');

  // ---------- search: hides the rows whose name doesn't match; the ranking stays as it is ----------
  const findEl = document.querySelector<HTMLInputElement>('#toolFind');
  const findOut = document.getElementById('findOut');
  function applyFind() {
    // Words, or a regex refused when it could hang the page (./find.ts); the text never reaches the HTML.
    const { q, words, re, heavy } = parseFind(findEl?.value ?? '');
    let shown = 0,
      total = 0;
    for (const b of grid.querySelectorAll<HTMLElement>('.tool')) {
      const id = b.dataset.tool ?? '',
        li = b.parentElement;
      // The first instrument is in Holding; its row leaves the list of candidates for the second.
      const candidate = id !== S.held[0],
        hit = candidate && (!q || matches(toolName(id), words, re));
      if (li) li.hidden = !hit;
      if (candidate) total++;
      if (hit) shown++;
    }
    if (!findOut) return;
    const result = shown ? fmt(T.findCount, { n: shown, total }) : T.findNone;
    findOut.textContent = !q ? '' : heavy ? `${T.findHeavy} ${result}` : result;
  }
  findEl?.addEventListener('input', applyFind);
  findEl?.addEventListener('keydown', (e) => {
    // Esc empties the field in every browser (Chrome does it natively, Firefox doesn't).
    if (e.key === 'Escape' && findEl.value) {
      findEl.value = '';
      applyFind();
    }
  });

  // A run gives 2 instruments: 1 at the start, 1 from the objective. One list does both picks: before the first,
  // it is ranked alone and a tap takes the start pick; after it, ranked by the pair with it and a tap takes
  // (or swaps) the second.
  function render() {
    const [first, second] = S.held;
    const scale = listScale();
    // Ties by name (as the page renders it): the order never depends on what was picked before.
    const rows = [...grid.querySelectorAll<HTMLElement>('.tool')].sort((a, b) => {
      const x = a.dataset.tool ?? '',
        y = b.dataset.tool ?? '';
      return rowValue(y) - rowValue(x) || toolName(x).localeCompare(toolName(y), 'en');
    });
    for (const b of rows) {
      const id = b.dataset.tool ?? '',
        li = b.parentElement,
        tier = tierIn(rowValue(id), scale),
        badge = b.querySelector('.tier'),
        val = b.querySelector('.val'),
        line = b.querySelector<HTMLElement>('.why');
      if (line) {
        const p = first && id !== first ? pairLine(id, first) : null;
        line.hidden = !p;
        line.innerHTML = p ? `<strong class="${p.kind}">${esc(p.label)}</strong> ${esc(p.text)}` : '';
      }
      b.dataset.tier = tier;
      b.classList.toggle('held', id === second);
      b.setAttribute('aria-pressed', String(id === second));
      if (val) val.textContent = rowValue(id).toFixed(2);
      if (badge) {
        badge.className = `tier t${tier}`;
        badge.textContent = tier;
      }
      if (li) list?.append(li);
    }
    applyFind();
    if (head) head.textContent = first ? T.partnersSub : T.perRun;
    // Each held instrument: its name opens its card (hover, focus or tap, like a row of the list, whose row it left),
    // and its own ✕ button drops it.
    heldEl.innerHTML = S.held.length
      ? S.held
          .map((id) => {
            const doubt = grid.querySelector<HTMLElement>(`.tool[data-tool="${CSS.escape(id)}"]`)?.dataset.doubt;
            const label = `${T.remove}: ${toolName(id)}`;
            return `<span class="chip"><button type="button" class="chip-name" data-tool="${esc(id)}"${doubt != null ? ' data-doubt=""' : ''} aria-describedby="pop">${chipImg(id)}${esc(toolName(id))}</button><button type="button" class="chip-x" data-drop="${esc(id)}" aria-label="${esc(label)}" title="${esc(label)}">✕</button></span>`;
          })
          .join('')
      : `<span class="meta">${esc(T.nothing)}</span>`;
    out.innerHTML = `<p class="meta">${esc(first ? fmt(T.pickSecond, { name: toolName(first) }) : T.pickHint)}</p>`;
  }

  // ---------- info popover (fixed position: escapes the panes' scroll clipping) ----------
  /** Every partner of `id` with Rainbows per run for the pair, best first. */
  const partners = (id: string): [string, number][] =>
    N.pairs
      .filter(([a, b]) => a === id || b === id)
      .map(([a, b, v]): [string, number] => [a === id ? b : a, v])
      .sort((x, y) => y[1] - x[1]);
  // The card shows the best partners only (it never scrolls); the full list waits in Instrument pick once one is held.
  const TOP_PARTNERS = 5;
  /** The tile's image as already downloaded (currentSrc picks the srcset entry in use, so nothing is fetched again). */
  const toolImg = (id: string) => {
    const img = grid.querySelector<HTMLImageElement>(`[data-tool="${CSS.escape(id)}"] img`);
    return img ? img.currentSrc || img.src : '';
  };
  /** The held instrument's art in its Holding chip (decorative: the name follows). */
  const chipImg = (id: string) => {
    const src = toolImg(id);
    return src
      ? `<img src="${esc(src)}" alt="" width="22" height="22">`
      : '<span class="ph" aria-hidden="true">?</span>';
  };
  /** Pairs as a list, best first: partner art, its own tier, name, Rainbows per run with both. */
  const pairList = (rows: [string, number | null][]) =>
    `<ol class="tp-pairs">${rows
      .filter((r): r is [string, number] => r[1] != null)
      .sort((x, y) => y[1] - x[1])
      .map(([p, v]) => {
        const src = toolImg(p);
        const pt = tierIn(value(p), soloScale());
        return `<li>${src ? `<img src="${esc(src)}" alt="">` : '<span class="ph">?</span>'}<span class="tier t${pt}">${pt}</span><span class="pn">${esc(toolName(p))}</span><b>${v.toFixed(2)}</b></li>`;
      })
      .join('')}</ol>`;

  /** One ranking: tier badge, place, and which list it is (alone, or paired with what you hold). */
  const rankHtml = (tier: string, place: string, label: string) =>
    `<div class="tp-rank"><span class="tier t${esc(tier)}">${esc(tier)}</span><div><b>${esc(place)}</b><small>${esc(label)}</small></div></div>`;
  /** The second ranking, once an instrument is held: this one as the second, by the pair with the first. */
  const pairRank = (id: string) => {
    const first = S.held[0];
    const v = first && id !== first ? pairValue(id, first) : null;
    if (!first || v == null) return '';
    const others = Object.keys(D.tools).filter((x) => x !== first);
    const n = 1 + others.filter((x) => (pairValue(x, first) ?? -Infinity) > v).length;
    return rankHtml(
      tierIn(v, pairScale(first)),
      fmt(T.rankOf, { n, total: others.length }),
      fmt(T.rankPair, { name: toolName(first) }),
    );
  };

  // An instrument's card, as a player reads it: its own rank (tier + position) decides the first pick; the best
  // second instrument (pairs, with each partner's tier) decides the run. No multiplier: the tiers are cut against a
  // run with no instrument, which never happens in the game.
  function toolHtml(btn: HTMLElement) {
    const id = btn.dataset.tool ?? '',
      t = D.tools[id],
      // The card describes the instrument itself: its own tier and place alone, whatever the list is ranking.
      tier = tierIn(value(id), soloScale()),
      src = toolImg(id);
    const offers = D.offers?.n ? D.offers : null;
    const off = offers ? (offers.counts[id] || 0) / offers.n : null;
    const withHeld = S.held
      .filter((h) => h !== id)
      .map((h): [string, number | null] => [h, pairValue(id, h)])
      .filter(([, v]) => v != null);
    return `<div class="tp-head">${src ? `<img src="${esc(src)}" alt="">` : '<span></span>'}<div><b>${esc(t.name)}</b>
        <div class="tp-ranks">${rankHtml(tier, fmt(T.rankOf, rankOf(id)), T.rankAlone)}${pairRank(id)}</div>
        ${offers && off != null ? `<div class="tp-stats">${esc(fmt(T.offered, { p: Math.round(off * 100), n: offers.n }))}</div>` : ''}</div></div>
      ${btn.dataset.doubt != null ? `<p class="tp-doubt"><span class="doubt" aria-hidden="true">!</span>${esc(T.doubt)}</p>` : ''}
      ${T.tool[id] ? `<p class="tp-what">${esc(T.tool[id])}</p>` : ''}
      ${withHeld.length ? `<div class="tp-sub"><span>${esc(T.withYou)}</span><small>${esc(T.partnersSub)}</small>${pairList(withHeld)}</div>` : ''}
      <div class="tp-sub tp-second"><span>${esc(T.partners)}</span>${withHeld.length ? '' : `<small>${esc(T.partnersSub)}</small>`}${pairList(partners(id).slice(0, TOP_PARTNERS))}</div>`;
  }
  // Incident details are rendered by the page into <template id="ev-ID"> (already in the page language).
  const evHtml = (btn: HTMLElement) =>
    (document.getElementById('ev-' + btn.dataset.ev) as HTMLTemplateElement | null)?.innerHTML ?? '';
  // Explanations (e.g. what the tiers mean) live in <template id="tip-NAME">, also in the page language.
  const tipHtml = (btn: HTMLElement) =>
    (document.getElementById('tip-' + btn.dataset.tip) as HTMLTemplateElement | null)?.innerHTML ?? '';

  let shownFor: HTMLElement | null = null;
  /** The card for `anchor` (instrument, incident or explanation), written into `box`. */
  function fill(box: HTMLElement, anchor: HTMLElement) {
    box.innerHTML = anchor.dataset.tool ? toolHtml(anchor) : anchor.dataset.ev ? evHtml(anchor) : tipHtml(anchor);
    if (anchor.dataset.row) box.querySelector(`[data-row="${anchor.dataset.row}"]`)?.classList.add('on');
    // The tier table's Rainbows per run follow the list on screen: start card, objective, pair with what you hold.
    const sc = listScale();
    box.querySelectorAll<HTMLElement>('[data-share]').forEach((td) => {
      const share = Number(td.dataset.share);
      td.textContent = `${share ? '≥' : '>'}${(sc.base + share * (sc.best - sc.base)).toFixed(2)} ${T.perRun}`;
    });
    box.querySelectorAll<HTMLElement>('[data-floor]').forEach((td) => {
      td.textContent = `≤${sc.base.toFixed(2)} ${T.perRun}`;
    });
  }
  function showPop(anchor: HTMLElement) {
    fill(pop, anchor);
    pop.hidden = false;
    shownFor = anchor;
    const r = anchor.getBoundingClientRect(),
      pw = pop.offsetWidth,
      ph = pop.offsetHeight,
      m = 8;
    let left = r.right + m <= innerWidth - pw - m ? r.right + m : r.left - pw - m;
    let top = Math.min(Math.max(m, r.top), innerHeight - ph - m);
    if (left < m) {
      left = Math.max(m, Math.min(innerWidth - pw - m, r.left + r.width / 2 - pw / 2));
      top = r.bottom + m + ph < innerHeight ? r.bottom + m : Math.max(m, r.top - ph - m);
    }
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  const hidePop = () => {
    pop.hidden = true;
    shownFor = null;
  };

  // Touch (and pen): a tooltip that covers the screen can't be scrolled or closed, and a tap beside it lands on the
  // row underneath. There the same card opens as a modal dialog: close button, Esc, a tap outside closes it, it
  // scrolls, the page under it is inert, and focus returns to the row on close (native <dialog>).
  // Enlarged text (A+) does the same for mouse and keyboard: the card no longer fits a tooltip — on a click or
  // Enter, never on hover or focus.
  const dlg = document.getElementById('popdlg') as HTMLDialogElement | null;
  const dlgBody = dlg?.querySelector<HTMLElement>('.dlg-body') ?? null;
  let touch = false;
  const modal = () => touch || fs > 1;
  // The row that opened it: a pick re-sorts the list, and moving a node drops its focus, so the dialog can't
  // restore it by itself.
  let opener: HTMLElement | null = null;
  function openDialog(anchor: HTMLElement) {
    if (!dlg || !dlgBody) return showPop(anchor);
    hidePop();
    opener = anchor;
    fill(dlgBody, anchor);
    const title = dlgBody.querySelector('b')?.textContent?.trim();
    if (title) dlg.setAttribute('aria-label', title);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  dlg?.addEventListener('close', () => {
    // Back to the row, or — when that tap took it as the start pick and its row left the list — to its chip in
    // Holding, where it went.
    const tool = opener?.dataset.tool;
    const back =
      opener?.isConnected && opener.offsetParent
        ? opener
        : tool
          ? heldEl.querySelector<HTMLElement>(`[data-tool="${CSS.escape(tool)}"]`)
          : null;
    back?.focus({ preventScroll: true });
    opener = null;
  });
  dlg?.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-close]')) return dlg.close();
    // A tap on the backdrop: outside the dialog's own box.
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
  });
  const target = (e: Event) =>
    (e.target as Element | null)?.closest<HTMLElement>('[data-tool],[data-ev],[data-tip]') ?? null;

  // Hover (mouse), focus (keyboard) and tap (touch) all open the same popover.
  document.addEventListener('pointerover', (e) => {
    const a = target(e);
    if (a && e.pointerType === 'mouse' && fs === 1) showPop(a);
  });
  document.addEventListener('pointerout', (e) => {
    const a = target(e);
    if (a && e.pointerType === 'mouse' && !a.contains(e.relatedTarget as Node | null)) hidePop();
  });
  document.addEventListener('focusin', (e) => {
    const a = target(e);
    // A tap focuses the button first: the dialog opens on its click instead.
    if (a && !modal() && !dlg?.contains(a)) showPop(a);
  });
  document.addEventListener('focusout', (e) => {
    if (target(e)) hidePop();
  });
  document.querySelectorAll('.pane').forEach((p) => p.addEventListener('scroll', hidePop, { passive: true }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePop();
  });
  // A tap focuses the button (focusin opens the popover) before its click, so the click alone can't tell
  // "open" from "close": a touch closes it only if it was already open when the finger came down.
  // With a mouse, hover already opened it and the click keeps it open.
  let closeOnClick = false;
  document.addEventListener('pointerdown', (e) => {
    touch = e.pointerType === 'touch' || e.pointerType === 'pen';
    const a = target(e);
    closeOnClick = !!a && shownFor === a && e.pointerType !== 'mouse';
  });
  // Keys: back to the tooltip (a keyboard user after a tap).
  document.addEventListener('keydown', () => {
    touch = false;
  });
  document.addEventListener('click', (e) => {
    if (dlg?.contains(e.target as Node)) return;
    const a = target(e);
    if (a && modal() && (a.dataset.ev || a.dataset.tip)) {
      openDialog(a);
      return;
    }
    if (!a) {
      hidePop();
      return;
    }
    if (a.dataset.ev || a.dataset.tip) {
      if (closeOnClick) hidePop();
      else showPop(a);
    }
    closeOnClick = false;
  });
  /** Runs `change` — which can resize the advice above — and scrolls by the shift, so the row the player
   * clicked (found again by `selector`, it may be re-rendered) stays under the pointer: otherwise the next
   * click lands on another row. */
  function keepInPlace(selector: string, change: () => void) {
    const top = document.querySelector(selector)?.getBoundingClientRect().top;
    change();
    const now = document.querySelector<HTMLElement>(selector);
    const delta = top == null || !now ? 0 : now.getBoundingClientRect().top - top;
    if (!delta || !now) return;
    let box = now.parentElement;
    while (box && !(/auto|scroll/.test(getComputedStyle(box).overflowY) && box.scrollHeight > box.clientHeight))
      box = box.parentElement;
    (box ?? window).scrollBy({ top: delta, behavior: 'instant' });
  }
  grid.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-tool]'),
      id = b?.dataset.tool;
    if (!b || !id || id === S.held[0]) return;
    const take = () => {
      // No start pick yet: this is it. Then: the second, swapped by a tap on another row, dropped by a second tap.
      S = { held: !S.held.length ? [id] : S.held[1] === id ? [S.held[0]] : [S.held[0], id] };
      save();
      render();
    };
    // The first pick re-sorts the whole list; after it, the row stays under the pointer.
    if (S.held.length) keepInPlace(`#tools [data-tool="${CSS.escape(id)}"]`, take);
    else take();
    if (modal()) openDialog(b);
    else showPop(b);
  });
  heldEl.addEventListener('click', (e) => {
    // The name: its card, as a dialog on touch (a mouse already has it from hover, a keyboard from focus).
    const name = (e.target as Element).closest<HTMLElement>('.chip-name');
    if (name) {
      if (modal()) openDialog(name);
      else showPop(name);
      return;
    }
    const x = (e.target as Element).closest<HTMLElement>('[data-drop]');
    if (!x) return;
    S = { ...S, held: S.held.filter((h) => h !== x.dataset.drop) };
    save();
    hidePop();
    render();
    // The ✕ went away with its chip: focus the other held instrument, or the top of the list to pick again.
    (
      heldEl.querySelector<HTMLElement>('.chip-name') ??
      grid.querySelector<HTMLElement>('#toolList li:not([hidden]) .tool')
    )?.focus({ preventScroll: true });
  });

  // ---------- your run: the choices re-rank the list (render) ----------
  const run = document.getElementById('run');
  function showRun() {
    run?.querySelectorAll<HTMLElement>('[data-start]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.start === R.start));
    });
    run?.querySelectorAll<HTMLElement>('[data-objective]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.objective === R.objective));
    });
  }
  run?.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-start],[data-objective]');
    if (!b) return;
    if (b.dataset.start != null) R = { ...R, start: b.dataset.start };
    if (b.dataset.objective != null) R = { ...R, objective: b.dataset.objective };
    try {
      localStorage.setItem(RUN_KEY, JSON.stringify(R));
    } catch {}
    N = numbers();
    showRun();
    render();
  });

  // ---------- reset: a new run — no start card, no objective, nothing held ----------
  const resetOut = document.getElementById('resetOut');
  let resetTimer = 0;
  document.getElementById('resetRun')?.addEventListener('click', () => {
    S = { held: [] };
    save();
    R = { start: '', objective: '' };
    try {
      localStorage.setItem(RUN_KEY, JSON.stringify(R));
    } catch {}
    N = numbers();
    hidePop();
    showRun();
    render();
    // Said beside the button (and by screen readers: role="status"), then cleared.
    if (!resetOut) return;
    resetOut.textContent = T.resetDone;
    clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      resetOut.textContent = '';
    }, 3000);
  });

  // ---------- text size: A− / A+ step through TEXT_SIZES (./text-size.ts) ----------
  const textOut = document.getElementById('textOut');
  const textDown = document.getElementById('textDown');
  const textUp = document.getElementById('textUp');
  const pct = new Intl.NumberFormat(document.documentElement.lang, { style: 'percent' });
  function showTextSize() {
    document.documentElement.style.setProperty('--fs', String(fs));
    if (textOut) textOut.textContent = pct.format(fs);
    // aria-disabled, not disabled: the button keeps focus at either end
    textDown?.setAttribute('aria-disabled', String(fs === TEXT_SIZES[0]));
    textUp?.setAttribute('aria-disabled', String(fs === TEXT_SIZES[TEXT_SIZES.length - 1]));
  }
  const stepText = (by: number) => {
    const next = TEXT_SIZES[TEXT_SIZES.indexOf(fs) + by];
    if (next == null) return;
    fs = next;
    try {
      localStorage.setItem(TEXT_KEY, String(fs));
    } catch {}
    hidePop();
    showTextSize();
  };
  textDown?.addEventListener('click', () => stepText(-1));
  textUp?.addEventListener('click', () => stepText(1));
  showTextSize();
  showRun();
  render();
}
