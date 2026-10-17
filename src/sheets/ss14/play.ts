/* Client script for /ss14/ (all languages) — the instrument pick and the info popover for instruments and incidents. */
// Data is embedded by the page as <script type="application/json" id="play-data">: { tools, pairs, base, offers, ui }.
// `ui` holds the page language's strings (./i18n.ts).

interface Tool {
  name: string;
  value: number;
  text?: string;
}
type Pair = [string, string, number];
interface PlayData {
  tools: Record<string, Tool>;
  pairs: Pair[];
  base: number;
  offers: { n: number; counts: Record<string, number> } | null;
  ui: Record<
    | 'take'
    | 'perRun'
    | 'withHeld'
    | 'sim'
    | 'tookIt'
    | 'remove'
    | 'nothing'
    | 'pickHint'
    | 'xNone'
    | 'offered'
    | 'card'
    | 'withYou'
    | 'partners'
    | 'doubt',
    string
  > & { tool: Record<string, string> };
}
interface PickState {
  held: string[];
  offered: string[];
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

  const toolName = (id: string) => D.tools[id]?.name ?? id;
  const pairValue = (a: string, b: string) =>
    D.pairs.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] ?? null;
  /** Sim Rainbow/run of taking `id` now: best pair with something held, else its solo value. */
  const score = (id: string) => {
    const own = S.held.filter((h) => h !== id);
    const solo = D.tools[id].value;
    return own.length ? Math.max(...own.map((h) => pairValue(id, h) ?? solo)) : solo;
  };

  function render() {
    const [best, ...rest] = S.offered.slice().sort((a, b) => score(b) - score(a));
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
    if (!best) {
      out.innerHTML = `<p class="meta">${esc(T.pickHint)}</p>`;
      return;
    }
    out.innerHTML =
      `<div class="pick best"><div><b>${esc(fmt(T.take, { name: toolName(best) }))}</b><span>${score(best).toFixed(2)} ${esc(T.perRun)}${S.held.length ? esc(T.withHeld) : ''} ${esc(T.sim)}</span></div><button type="button" class="take" data-take="${esc(best)}">${esc(T.tookIt)}</button></div>` +
      (rest.length
        ? `<p class="meta">${rest.map((id) => `${esc(toolName(id))} ${score(id).toFixed(2)}`).join(' · ')}</p>`
        : '');
  }

  // ---------- info popover (fixed position: escapes the panes' scroll clipping) ----------
  const partners = (id: string): [string, number][] =>
    D.pairs
      .filter(([a, b]) => a === id || b === id)
      .map(([a, b, v]): [string, number] => [a === id ? b : a, v])
      .sort((x, y) => y[1] - x[1])
      .slice(0, 5);
  /** The tile's image as already downloaded (currentSrc picks the srcset entry in use, so nothing is fetched again). */
  const toolImg = (id: string) => {
    const img = grid.querySelector<HTMLImageElement>(`[data-tool="${CSS.escape(id)}"] img`);
    return img ? img.currentSrc || img.src : '';
  };
  /** Pairs as a list, best first: partner art, name, Rainbow/run and × no instrument. */
  const pairList = (rows: [string, number | null][]) =>
    `<ol class="tp-pairs">${rows
      .filter((r): r is [string, number] => r[1] != null)
      .sort((x, y) => y[1] - x[1])
      .map(([p, v]) => {
        const src = toolImg(p);
        return `<li>${src ? `<img src="${esc(src)}" alt="">` : '<span class="ph">?</span>'}<span class="pn">${esc(toolName(p))}</span><b>${v.toFixed(2)}</b><em>${(v / D.base).toFixed(1)}×</em></li>`;
      })
      .join('')}</ol>`;

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
        <div class="tp-stats"><span class="tier t${esc(tier)}">${tier === 'X' ? '✕' : esc(tier)}</span> <b>${t.value.toFixed(2)}</b> ${esc(T.perRun)} · ${(t.value / D.base).toFixed(1)}${esc(T.xNone)}</div>
        ${offers && off != null ? `<div class="tp-stats">${esc(fmt(T.offered, { p: Math.round(off * 100), n: offers.n }))}</div>` : ''}</div></div>
      ${btn.dataset.doubt != null ? `<p class="tp-doubt"><span class="doubt" aria-hidden="true">!</span>${esc(T.doubt)}</p>` : ''}
      ${T.tool[id] ? `<p class="tp-what">${esc(T.tool[id])}</p>` : ''}
      ${t.text ? `<p class="tp-sub"><span>${esc(T.card)}</span>${esc(t.text)}</p>` : ''}
      ${withHeld.length ? `<div class="tp-sub"><span>${esc(T.withYou)}</span>${pairList(withHeld)}</div>` : ''}
      <div class="tp-sub"><span>${esc(T.partners)}</span>${pairList(partners(id))}</div>`;
  }
  // Incident details are rendered by the page into <template id="ev-ID"> (already in the page language).
  const evHtml = (btn: HTMLElement) =>
    (document.getElementById('ev-' + btn.dataset.ev) as HTMLTemplateElement | null)?.innerHTML ?? '';
  // Explanations (e.g. what a tier's "≥2.6×" means) live in <template id="tip-NAME">, also in the page language.
  const tipHtml = (btn: HTMLElement) =>
    (document.getElementById('tip-' + btn.dataset.tip) as HTMLTemplateElement | null)?.innerHTML ?? '';

  let shownFor: HTMLElement | null = null;
  function showPop(anchor: HTMLElement) {
    pop.innerHTML = anchor.dataset.tool ? toolHtml(anchor) : anchor.dataset.ev ? evHtml(anchor) : tipHtml(anchor);
    if (anchor.dataset.row) pop.querySelector(`[data-row="${anchor.dataset.row}"]`)?.classList.add('on');
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
    S.offered = S.offered.includes(id) ? S.offered.filter((x) => x !== id) : [...S.offered, id].slice(-3);
    save();
    render();
    showPop(b);
  });
  out.addEventListener('click', (e) => {
    const id = (e.target as Element).closest<HTMLElement>('[data-take]')?.dataset.take;
    if (!id) return;
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
  render();
}
