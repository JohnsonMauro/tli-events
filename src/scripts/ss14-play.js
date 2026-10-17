/* Client script for /ss14/ (all languages) — the instrument pick and the info popover for instruments and incidents. */
// Data is embedded by the page as <script type="application/json" id="play-data">: { tools, pairs, base, offers, ui }.
// `ui` holds the page language's strings (src/i18n/ss14-play.ts).
const el = document.getElementById('play-data');
const D = el ? JSON.parse(el.textContent || 'null') : null;
const T = D ? D.ui : {};
const grid = document.getElementById('tools');
const out = document.getElementById('pickOut');
const heldEl = document.getElementById('held');
const pop = document.getElementById('pop');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

// Per-viewer convenience only: what this player holds and was offered, kept in this browser.
const KEY = 'ss14-pick-v1';
let S = { held: [], offered: [] };
try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && Array.isArray(saved.held)) S = { held: saved.held, offered: saved.offered || [] }; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

const toolName = (id) => (D.tools[id]?.name ?? id).replace(/:.*/, '');
const pairValue = (a, b) => { const p = D.pairs.find(([x, y]) => (x === a && y === b) || (x === b && y === a)); return p ? p[2] : null; };
/** Sim Rainbow/run of taking `id` now: best pair with something held, else its solo value. */
function score(id) {
  const own = S.held.filter((h) => h !== id);
  const solo = D.tools[id].value;
  return own.length ? Math.max(...own.map((h) => pairValue(id, h) ?? solo)) : solo;
}

function render() {
  const ranked = S.offered.slice().sort((a, b) => score(b) - score(a));
  const [best, ...rest] = ranked;
  grid.querySelectorAll('.tool').forEach((b) => {
    b.classList.toggle('on', S.offered.includes(b.dataset.tool));
    b.classList.toggle('held', S.held.includes(b.dataset.tool));
    b.classList.toggle('best', b.dataset.tool === best);
  });
  heldEl.innerHTML = S.held.length
    ? S.held.map((id) => `<button type="button" class="chip" data-drop="${esc(id)}" title="${esc(T.remove)}">${esc(toolName(id))} ✕</button>`).join('')
    : `<span class="meta">${esc(T.nothing)}</span>`;
  if (!best) { out.innerHTML = `<p class="meta">${esc(T.pickHint)}</p>`; return; }
  out.innerHTML = `<div class="pick best"><div><b>${esc(fmt(T.take, { name: toolName(best) }))}</b><span>${score(best).toFixed(2)} ${esc(T.perRun)}${S.held.length ? esc(T.withHeld) : ''} ${esc(T.sim)}</span></div><button type="button" class="take" data-take="${esc(best)}">${esc(T.tookIt)}</button></div>`
    + (rest.length ? `<p class="meta">${rest.map((id) => `${esc(toolName(id))} ${score(id).toFixed(2)}`).join(' · ')}</p>` : '');
}

// ---------- info popover (fixed position: escapes the panes' scroll clipping) ----------
const partners = (id) => D.pairs.filter(([a, b]) => a === id || b === id).map(([a, b, v]) => [a === id ? b : a, v]).sort((x, y) => y[1] - x[1]).slice(0, 5);
const toolImg = (id) => grid.querySelector(`[data-tool="${CSS.escape(id)}"] img`)?.src ?? '';
/** Pairs as a list, best first: partner art, name, Rainbow/run and × no instrument. */
const pairList = (rows) => `<ol class="tp-pairs">${rows.slice().sort((x, y) => y[1] - x[1]).map(([p, v]) => {
  const src = toolImg(p);
  return `<li>${src ? `<img src="${src}" alt="">` : '<span class="ph">?</span>'}<span class="pn">${esc(toolName(p))}</span><b>${v.toFixed(2)}</b><em>${(v / D.base).toFixed(1)}×</em></li>`;
}).join('')}</ol>`;
function toolHtml(btn) {
  const id = btn.dataset.tool, t = D.tools[id], img = btn.querySelector('img'), tier = btn.dataset.tier;
  const off = D.offers && D.offers.n ? (D.offers.counts[id] || 0) / D.offers.n : null;
  const withHeld = S.held.filter((h) => h !== id).map((h) => [h, pairValue(id, h)]).filter(([, v]) => v != null);
  return `<div class="tp-head">${img ? `<img src="${img.src}" alt="">` : '<span></span>'}<div><b>${esc(t.name)}</b>
      <div class="tp-stats"><span class="tier t${esc(tier)}">${tier === 'X' ? '✕' : esc(tier)}</span> <b>${t.value.toFixed(2)}</b> ${esc(T.perRun)} · ${(t.value / D.base).toFixed(1)}${esc(T.xNone)}</div>
      ${off != null ? `<div class="tp-stats">${esc(fmt(T.offered, { p: Math.round(off * 100), n: D.offers.n }))}</div>` : ''}</div></div>
    ${T.tool[id] ? `<p class="tp-what">${esc(T.tool[id])}</p>` : ''}
    ${t.text ? `<p class="tp-sub"><span>${esc(T.card)}</span>${esc(t.text)}</p>` : ''}
    ${withHeld.length ? `<div class="tp-sub"><span>${esc(T.withYou)}</span>${pairList(withHeld)}</div>` : ''}
    <div class="tp-sub"><span>${esc(T.partners)}</span>${pairList(partners(id))}</div>`;
}
// Incident details are rendered by the page into <template id="ev-ID"> (already in the page language).
const evHtml = (btn) => document.getElementById('ev-' + btn.dataset.ev)?.innerHTML ?? '';
let shownFor = null;
function showPop(anchor) {
  pop.innerHTML = anchor.dataset.tool ? toolHtml(anchor) : evHtml(anchor);
  pop.hidden = false; shownFor = anchor;
  const r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, m = 8;
  let left = r.right + m <= innerWidth - pw - m ? r.right + m : r.left - pw - m;
  let top = Math.min(Math.max(m, r.top), innerHeight - ph - m);
  if (left < m) { left = Math.max(m, Math.min(innerWidth - pw - m, r.left + r.width / 2 - pw / 2)); top = r.bottom + m + ph < innerHeight ? r.bottom + m : Math.max(m, r.top - ph - m); }
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
}
const hidePop = () => { pop.hidden = true; shownFor = null; };
const target = (e) => e.target.closest('[data-tool],[data-ev]');

if (D && grid && pop) {
  // Hover (mouse), focus (keyboard) and tap (touch) all open the same popover.
  document.addEventListener('pointerover', (e) => { const a = target(e); if (a && e.pointerType === 'mouse') showPop(a); });
  document.addEventListener('pointerout', (e) => { const a = target(e); if (a && e.pointerType === 'mouse' && !a.contains(e.relatedTarget)) hidePop(); });
  document.addEventListener('focusin', (e) => { const a = target(e); if (a) showPop(a); });
  document.addEventListener('focusout', (e) => { if (target(e)) hidePop(); });
  document.querySelectorAll('.pane').forEach((p) => p.addEventListener('scroll', hidePop, { passive: true }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePop(); });
  document.addEventListener('click', (e) => {
    const a = target(e);
    if (!a) { hidePop(); return; }
    if (a.dataset.ev) { if (shownFor === a) hidePop(); else showPop(a); }
  });
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tool]'); if (!b) return;
    const id = b.dataset.tool;
    S.offered = S.offered.includes(id) ? S.offered.filter((x) => x !== id) : [...S.offered, id].slice(-3);
    save(); render(); showPop(b);
  });
  out.addEventListener('click', (e) => {
    const k = e.target.closest('[data-take]'); if (!k) return;
    if (!S.held.includes(k.dataset.take)) S.held.push(k.dataset.take);
    S.offered = [];
    save(); render();
  });
  heldEl.addEventListener('click', (e) => {
    const x = e.target.closest('[data-drop]'); if (!x) return;
    S.held = S.held.filter((h) => h !== x.dataset.drop);
    save(); render();
  });
  render();
}
