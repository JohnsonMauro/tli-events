/* Client script for /ss14/ (all languages) — your run's choices, the instrument pick and the info popover. */
// Data is embedded by the page as <script type="application/json" id="play-data">: our engine's numbers
// (default, per start card, per objective), the tier thresholds, live offer counts and `ui` strings (./i18n.ts).

interface Tool {
  name: string;
  value: number;
}
type Pair = [string, string, number];
type Values = Record<string, number>;
interface PlayData {
  tools: Record<string, Tool>;
  pairs: Pair[];
  base: number;
  byStart: Record<string, { base: number; tools: Values; pairs: Pair[] }>;
  byObjective: Record<string, { base: number; tools: Values }>;
  tiers: [string, number][];
  offers: { n: number; counts: Record<string, number> } | null;
  ui: Record<
    | 'take'
    | 'perRun'
    | 'withHeld'
    | 'sim'
    | 'remove'
    | 'nothing'
    | 'pickHint'
    | 'full'
    | 'offered'
    | 'withYou'
    | 'partners'
    | 'partnersSub'
    | 'rankOf'
    | 'doubt',
    string
  > & { tool: Record<string, string> };
}
interface PickState {
  held: string[];
  offered: string[];
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

const el = document.getElementById('play-data');
const D: PlayData | null = el ? JSON.parse(el.textContent || 'null') : null;
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

  // Per-viewer convenience only: what this player holds and was offered, kept in this browser.
  const KEY = 'ss14-pick-v1';
  let S: PickState = { held: [], offered: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Array.isArray(saved.held)) S = { held: saved.held, offered: saved.offered || [] };
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
  const defaults: Numbers = {
    base: D.base,
    tools: Object.fromEntries(Object.entries(D.tools).map(([id, x]) => [id, x.value])),
    pairs: D.pairs,
  };
  /** A start card changes the rules, so it wins; an objective only through its reward (values with rewards on). */
  const numbers = (): Numbers => {
    const s = D.byStart[R.start];
    if (s) return s;
    const o = D.byObjective[R.objective];
    if (o) return { base: o.base, tools: o.tools, pairs: D.pairs };
    return defaults;
  };
  let N = numbers();

  const toolName = (id: string) => D.tools[id]?.name ?? id;
  const value = (id: string) => N.tools[id] ?? D.tools[id]?.value ?? 0;
  /** Tier for the current numbers (cut against their no-instrument run). */
  const tierOf = (v: number) => D.tiers.find(([, min]) => v / N.base >= min)?.[0] ?? 'X';
  /** Position among all instruments for the current numbers (1 = best), for "#5 of 31". */
  const rankOf = (id: string) => {
    const ids = Object.keys(D.tools);
    return { n: 1 + ids.filter((x) => value(x) > value(id)).length, total: ids.length };
  };
  const pairValue = (a: string, b: string) =>
    N.pairs.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] ?? null;
  /** Rainbow/run of taking `id` now: best pair with something held, else its solo value. */
  const score = (id: string) => {
    const own = S.held.filter((h) => h !== id);
    const solo = value(id);
    return own.length ? Math.max(...own.map((h) => pairValue(id, h) ?? solo)) : solo;
  };

  // A run gives 2 instruments at most: 1 at the start, 1 from the objective.
  const MAX_HELD = 2;
  const full = () => S.held.length >= MAX_HELD;

  function render() {
    const [best, ...rest] = full() ? [] : S.offered.slice().sort((a, b) => score(b) - score(a));
    grid.querySelectorAll<HTMLElement>('.tool').forEach((b) => {
      const id = b.dataset.tool ?? '';
      b.classList.toggle('on', S.offered.includes(id));
      b.classList.toggle('held', S.held.includes(id));
      b.classList.toggle('best', id === best);
      b.setAttribute('aria-pressed', String(S.offered.includes(id)));
    });
    heldEl.innerHTML = S.held.length
      ? S.held
          .map(
            (id) =>
              `<button type="button" class="chip" data-drop="${esc(id)}" title="${esc(T.remove)}">${esc(toolName(id))} ✕</button>`,
          )
          .join('')
      : `<span class="meta">${esc(T.nothing)}</span>`;
    // Every partner the first instrument can get as the second, best first (the pane scrolls, the card can't).
    // A run holds 2 at most: tapping a row takes it as the second, replacing the one taken before.
    const second = S.held.length
      ? `<div class="tp-sub tp-second held-pairs"><span>${esc(T.partners)}</span><small>${esc(T.partnersSub)}</small>${pairList(partners(S.held[0]), true)}</div>`
      : '';
    if (!best) {
      out.innerHTML = `<p class="meta">${esc(full() ? T.full : T.pickHint)}</p>` + second;
      return;
    }
    out.innerHTML =
      // One tap on the advice marks it as taken.
      `<button type="button" class="pick best" data-take="${esc(best)}"><span class="pick-what"><b>${esc(fmt(T.take, { name: toolName(best) }))}</b><span class="pick-sub">${score(best).toFixed(2)} ${esc(T.perRun)}${S.held.length ? esc(T.withHeld) : ''} ${esc(T.sim)}</span></span></button>` +
      (rest.length
        ? `<p class="meta">${rest.map((id) => `${esc(toolName(id))} ${score(id).toFixed(2)}`).join(' · ')}</p>`
        : '') +
      second;
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
  /** Ring on a partner the player marked as offered in Instrument pick (same cue as the tile). */
  const offeredCls = (id: string) => (S.offered.includes(id) ? ' class="off"' : '');
  /** The tile's image as already downloaded (currentSrc picks the srcset entry in use, so nothing is fetched again). */
  const toolImg = (id: string) => {
    const img = grid.querySelector<HTMLImageElement>(`[data-tool="${CSS.escape(id)}"] img`);
    return img ? img.currentSrc || img.src : '';
  };
  /** Pairs as a list, best first: partner art, its own tier, name, Rainbows per run with both. */
  /** `pickable`: each row is a button that takes the partner as the run's second instrument (Instrument pick). */
  const pairList = (rows: [string, number | null][], pickable = false) =>
    `<ol class="tp-pairs">${rows
      .filter((r): r is [string, number] => r[1] != null)
      .sort((x, y) => y[1] - x[1])
      .map(([p, v]) => {
        const src = toolImg(p);
        const pt = tierOf(value(p));
        const row = `${src ? `<img src="${esc(src)}" alt="">` : '<span class="ph">?</span>'}<span class="tier t${pt}">${pt === 'X' ? '✕' : pt}</span><span class="pn">${esc(toolName(p))}</span><b>${v.toFixed(2)}</b>`;
        const taken = pickable && S.held[1] === p;
        return pickable
          ? `<li class="${taken ? 'held' : ''}${S.offered.includes(p) ? ' off' : ''}"><button type="button" data-second="${esc(p)}" aria-pressed="${taken}">${row}</button></li>`
          : `<li${offeredCls(p)}>${row}</li>`;
      })
      .join('')}</ol>`;

  // An instrument's card, as a player reads it: its own rank (tier + position) decides the first pick; the best
  // second instrument (pairs, with each partner's tier) decides the run. No multiplier: the tiers are cut against a
  // run with no instrument, which never happens in the game.
  function toolHtml(btn: HTMLElement) {
    const id = btn.dataset.tool ?? '',
      t = D.tools[id],
      tier = btn.dataset.tier ?? '',
      src = toolImg(id);
    const offers = D.offers?.n ? D.offers : null;
    const off = offers ? (offers.counts[id] || 0) / offers.n : null;
    const withHeld = S.held
      .filter((h) => h !== id)
      .map((h): [string, number | null] => [h, pairValue(id, h)])
      .filter(([, v]) => v != null);
    return `<div class="tp-head">${src ? `<img src="${esc(src)}" alt="">` : '<span></span>'}<div><b>${esc(t.name)}</b>
        <div class="tp-rank"><span class="tier t${esc(tier)}">${tier === 'X' ? '✕' : esc(tier)}</span><b>${esc(fmt(T.rankOf, rankOf(id)))}</b></div>
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
  function showPop(anchor: HTMLElement) {
    pop.innerHTML = anchor.dataset.tool ? toolHtml(anchor) : anchor.dataset.ev ? evHtml(anchor) : tipHtml(anchor);
    if (anchor.dataset.row) pop.querySelector(`[data-row="${anchor.dataset.row}"]`)?.classList.add('on');
    // The tier table's Rainbows per run follow the run's start card and objective.
    pop.querySelectorAll<HTMLElement>('[data-min]').forEach((td) => {
      td.textContent = `≥${(Number(td.dataset.min) * N.base).toFixed(2)} ${T.perRun}`;
    });
    pop.querySelectorAll<HTMLElement>('[data-max]').forEach((td) => {
      td.textContent = `<${(Number(td.dataset.max) * N.base).toFixed(2)} ${T.perRun}`;
    });
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
  const target = (e: Event) =>
    (e.target as Element | null)?.closest<HTMLElement>('[data-tool],[data-ev],[data-tip]') ?? null;

  // Hover (mouse), focus (keyboard) and tap (touch) all open the same popover.
  document.addEventListener('pointerover', (e) => {
    const a = target(e);
    if (a && e.pointerType === 'mouse') showPop(a);
  });
  document.addEventListener('pointerout', (e) => {
    const a = target(e);
    if (a && e.pointerType === 'mouse' && !a.contains(e.relatedTarget as Node | null)) hidePop();
  });
  document.addEventListener('focusin', (e) => {
    const a = target(e);
    if (a) showPop(a);
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
    const a = target(e);
    closeOnClick = !!a && shownFor === a && e.pointerType !== 'mouse';
  });
  document.addEventListener('click', (e) => {
    const a = target(e);
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
  grid.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-tool]'),
      id = b?.dataset.tool;
    if (!b || !id) return;
    toggleOffered(id);
    render();
    showPop(b);
  });
  /** Marks or unmarks an instrument as offered (at most the 3 the game shows). */
  const toggleOffered = (id: string) => {
    S.offered = S.offered.includes(id) ? S.offered.filter((x) => x !== id) : [...S.offered, id].slice(-3);
    save();
  };
  out.addEventListener('click', (e) => {
    const pick = (e.target as Element).closest<HTMLElement>('[data-second]')?.dataset.second;
    if (pick && S.held[0]) {
      S = { held: [S.held[0], pick], offered: [] };
      save();
      render();
      // render() rebuilt the list: keep keyboard focus on the same row.
      out.querySelector<HTMLElement>(`[data-second="${CSS.escape(pick)}"]`)?.focus({ preventScroll: true });
      return;
    }
    const id = (e.target as Element).closest<HTMLElement>('[data-take]')?.dataset.take;
    if (!id || full()) return;
    S = { held: S.held.includes(id) ? S.held : [...S.held, id], offered: [] };
    save();
    render();
  });
  heldEl.addEventListener('click', (e) => {
    const x = (e.target as Element).closest<HTMLElement>('[data-drop]');
    if (!x) return;
    S = { ...S, held: S.held.filter((h) => h !== x.dataset.drop) };
    save();
    render();
  });

  // ---------- your run: the choices re-tier the grid ----------
  /** Moves every tile into its tier for the current numbers, best first, and hides empty tiers. */
  function retier() {
    const tiles = [...grid.querySelectorAll<HTMLElement>('.tool')].sort(
      (a, b) => value(b.dataset.tool ?? '') - value(a.dataset.tool ?? ''),
    );
    for (const b of tiles) {
      const tier = tierOf(value(b.dataset.tool ?? ''));
      b.dataset.tier = tier;
      grid.querySelector(`[data-group="${tier}"] .tool-grid`)?.append(b);
    }
    grid.querySelectorAll<HTMLElement>('[data-group]').forEach((g) => {
      g.hidden = !g.querySelector('.tool');
    });
  }
  const run = document.getElementById('run');
  // "Strong pairs": one list per start card, rendered at build; show the marked one (none → no start card).
  const pairLists = [...document.querySelectorAll<HTMLElement>('[data-pairs]')];
  function showPairs() {
    const start = pairLists.some((l) => l.dataset.pairs === R.start) ? R.start : '';
    pairLists.forEach((l) => {
      l.hidden = l.dataset.pairs !== start;
    });
  }
  function showRun() {
    showPairs();
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
    retier();
    render();
  });
  showRun();
  if (N !== defaults) retier();
  render();
}
