/* Client script for /ss14/ — renders the strategy map from the embedded data. */
// Data is embedded by the page as <script type="application/json" id="tartarus-data">.
const dataEl = document.getElementById('tartarus-data');
const D = dataEl ? JSON.parse(dataEl.textContent || 'null') : null;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = (x, d=0) => (x*100).toFixed(d) + '%';
const BEASTS = ['Mammoth','Lion','Wolf','Rat'];
const TIER = ['Normal','Magic','Rare','Legendary','Supreme','Rainbow'];
const TCOL = ['var(--t0)','var(--t1)','var(--t2)','var(--t3)','var(--t4)'];
const LOW = {Mammoth:['Lion'],Lion:['Wolf'],Wolf:['Rat'],Rat:['Mammoth']};
const HIGH = {Mammoth:['Lion','Wolf'],Lion:['Wolf','Rat'],Wolf:['Rat'],Rat:['Mammoth']};

if (!D) {
  $('#meta').textContent = 'data missing — run pnpm data';
}

// ---------- header ----------
if (D) {
  $('#meta').textContent = `data: simulator ${D.simVersion} · updated ${D.fetched}`;
  const h = D.headline;
  const stats = [
    [h.rainbowsPerRun.toFixed(2), 'Rainbows/run with the tuned strategy + rewards'],
    [D.baseNoTools.toFixed(2), 'Rainbows/run with no instruments'],
    [pct(h.runsWithRainbow), 'runs with ≥1 Rainbow'],
    ['day ' + h.firstRainbowDay, 'average first Rainbow'],
    [D.pairs.length ? D.pairs[0][2].toFixed(1) : '—', 'best instrument pair'],
  ];
  $('#stats').innerHTML = stats.map(([v,l]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
}

// ---------- ring ----------
(function ring(){
  const svg = $('#ring'); const cx=200, cy=200, R=160; let here = 1;
  let html = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--line)" stroke-dasharray="4 6"/>`;
  html += `<text x="${cx}" y="${cy-6}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink2)">TARTARUS</text><text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="12" fill="var(--ink2)">clockwise →</text>`;
  for (let i=0;i<16;i++){
    const a = -Math.PI/2 + i*2*Math.PI/16, x = cx + R*Math.cos(a), y = cy + R*Math.sin(a);
    const n = i+1;
    html += `<g class="cell${n===1?' office':''}" data-n="${n}" transform="translate(${x},${y})"><rect x="-19" y="-19" width="38" height="38" rx="5"/><text text-anchor="middle" dy="5">${String(n).padStart(2,'0')}</text></g>`;
  }
  svg.innerHTML = html;
  const paint = () => svg.querySelectorAll('.cell').forEach((g) => {
    const n = +g.dataset.n; const d = (n - here + 16) % 16;
    g.classList.toggle('here', n === here); g.classList.toggle('reach', d >= 1 && d <= 6);
  });
  svg.addEventListener('click', (e) => { const g = e.target.closest('.cell'); if (g) { here = +g.dataset.n; paint(); } });
  paint();
})();

// ---------- food chain ----------
(function chain(){
  const pos = {Mammoth:[200,40],Lion:[350,165],Wolf:[200,290],Rat:[50,165]};
  const col = {Mammoth:'var(--mammoth)',Lion:'var(--lion)',Wolf:'var(--wolf)',Rat:'var(--rat)'};
  const arrow = (a,b,dashed,bend) => {
    const [x1,y1]=pos[a],[x2,y2]=pos[b]; const mx=(x1+x2)/2+bend[0], my=(y1+y2)/2+bend[1];
    return `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" fill="none" stroke="${dashed?'var(--ink2)':'var(--accent)'}" stroke-width="${dashed?2:3}" ${dashed?'stroke-dasharray="6 5"':''} marker-end="url(#ah${dashed?'d':''})"/>`;
  };
  let s = `<defs><marker id="ah" viewBox="0 0 10 10" refX="34" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--accent)"/></marker><marker id="ahd" viewBox="0 0 10 10" refX="34" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--ink2)"/></marker></defs>`;
  s += arrow('Mammoth','Lion',false,[30,-20]) + arrow('Lion','Wolf',false,[30,20]) + arrow('Wolf','Rat',false,[-30,20]) + arrow('Rat','Mammoth',false,[-30,-20]);
  s += arrow('Mammoth','Wolf',true,[25,0]) + arrow('Lion','Rat',true,[0,25]);
  for (const b of BEASTS){ const [x,y]=pos[b]; s += `<circle cx="${x}" cy="${y}" r="30" fill="${col[b]}"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#fff" font-weight="700" font-size="14">${b}</text>`; }
  s += `<line x1="8" y1="312" x2="34" y2="312" stroke="var(--accent)" stroke-width="3"/><text x="40" y="316" font-size="12" fill="var(--ink2)">eats (same rarity)</text>`;
  s += `<line x1="230" y1="312" x2="256" y2="312" stroke="var(--ink2)" stroke-width="2" stroke-dasharray="6 5"/><text x="262" y="316" font-size="12" fill="var(--ink2)">Legendary+ only</text>`;
  $('#chain').innerHTML = s;
})();

// ---------- chain calculator ----------
function contP(set, tier){ const fc = tier >= 3 ? HIGH : LOW; return BEASTS.filter((b) => fc[b].some((f) => set.has(f))).length / 4; }
(function calc(){
  const sel = $('#eater');
  sel.innerHTML = TIER.slice(0,5).map((t,i) => `<option value="${i}" ${i===2?'selected':''}>${t}</option>`).join('');
  const grid = $('#calcGrid');
  let h = `<div class="h">tier</div>` + BEASTS.map((b) => `<div class="h">${b}</div>`).join('') + `<div class="h">continues</div>`;
  for (let t=1;t<=4;t++){
    h += `<div data-row="${t}"><span class="tier" style="background:${TCOL[t]}">${TIER[t][0]}</span> ${TIER[t]}</div>`;
    h += BEASTS.map((b) => `<div data-row="${t}"><input type="checkbox" id="c${t}${b}" data-t="${t}" data-b="${b}"><label class="tg" for="c${t}${b}">${b[0]}</label></div>`).join('');
    h += `<div class="p" data-row="${t}" id="p${t}">—</div>`;
  }
  grid.innerHTML = h;
  const read = () => { const s = {}; for (let t=1;t<=4;t++) s[t] = new Set(BEASTS.filter((b) => $(`#c${t}${b}`).checked)); return s; };
  const total = (e, s) => { let p = 1; for (let t=e+1;t<=4;t++) p *= contP(s[t], t); return p; };
  const run = () => {
    const e = +sel.value, s = read();
    grid.querySelectorAll('[data-row]').forEach((el) => el.classList.toggle('dis', +el.dataset.row <= e));
    for (let t=1;t<=4;t++) $('#p'+t).textContent = t <= e ? '' : pct(contP(s[t], t));
    const p = total(e, s);
    $('#calcOut').textContent = e === 4 ? '100%' : pct(p, 1);
    $('#calcSteps').textContent = e === 4 ? 'A Supreme that eats becomes a Rainbow directly.' : `bites to Rainbow: ${5-e} (the 1st is your pick)`;
    const empty = []; for (let t=e+1;t<=4;t++) if (!s[t].size) empty.push(t);
    let tip;
    if (e === 4) tip = '<span class="meta">—</span>';
    else if (empty.length) tip = `No food at <b>${empty.map((t) => TIER[t]).join(', ')}</b> — the chain stops there. ` +
      `Priority: ${empty.some((t) => t >= 3) ? '<b>Wolf</b> or <b>Rat</b> at Legendary+ (50% each)' : 'any beast (25% each)'}.`;
    else { let best = null;
      for (let t=e+1;t<=4;t++) for (const b of BEASTS) { if (s[t].has(b)) continue; const s2 = {...s, [t]: new Set([...s[t], b])}; const v = total(e, s2); if (!best || v > best.v) best = {t, b, v}; }
      tip = best ? `Add <b>${best.b}</b> at <b>${TIER[best.t]}</b> → <b>${pct(best.v,1)}</b> <span class="meta">(+${((best.v-p)*100).toFixed(1)} pts)</span>` : 'Chain guaranteed.'; }
    $('#calcTip').innerHTML = tip;
  };
  // example board: Rare eater, Wolf + Rat waiting at Legendary, Mammoth at Supreme
  for (const id of ['c3Wolf','c3Rat','c4Mammoth']) $('#'+id).checked = true;
  sel.addEventListener('change', run); grid.addEventListener('change', run); run();
  // continuation table
  const combos = []; for (let m=1;m<16;m++) combos.push(BEASTS.filter((_,i) => m & (1<<i)));
  combos.sort((a,b) => a.length - b.length);
  $('#contTbl tbody').innerHTML = combos.map((c) => { const s = new Set(c); const lo = contP(s,0), hi = contP(s,3);
    return `<tr><td>${c.join(' + ')}</td><td class="num">${pct(lo)}</td><td class="num"${hi>lo?' style="color:var(--ok);font-weight:700"':''}>${pct(hi)}</td></tr>`; }).join('');
})();
if (D) {
  const rows = D.stairs.slice().sort((a,b) => b.rainbow - a.rainbow).slice(0,20);
  $('#stairTbl tbody').innerHTML = rows.map((r) => `<tr><td><code>${esc(r.key)}</code> — ${esc(TIER[+r.key.split(':')[0]])} eating</td><td class="num">${r.n.toLocaleString('en-US')}</td><td class="num">${pct(r.rainbow)}</td><td style="width:30%"><div class="bar"><i style="width:${r.rainbow*100}%"></i></div></td><td class="num">${r.bites}</td></tr>`).join('');
}

// ---------- odds ----------
if (D) {
  const bar = (label, w) => { const t = w.reduce((a,b)=>a+b,0);
    return `<div class="oddsrow"><b style="font-size:14px">${label}</b><div class="stack">${w.map((x,i) => `<span style="width:${x/t*100}%;background:${TCOL[i]}" title="${TIER[i]} ${(x/t*100).toFixed(1)}%">${x/t>=.05?TIER[i][0]+' '+(x/t*100).toFixed(0)+'%':''}</span>`).join('')}</div></div>`; };
  const L = D.live;
  const liveW = (sec) => TIER.slice(0,5).map((t) => (sec.share[t] || 0) * 100);
  const door = L ? liveW(L.doorTiers) : D.odds.door, rep = L ? liveW(L.replaceTiers) : D.odds.replace;
  $('#oddsBars').innerHTML =
    (L ? bar(`Door <span class="meta">n=${L.doorTiers.n}</span>`, door) + bar(`Replace <span class="meta">n=${L.replaceTiers.n}</span>`, rep) : '') +
    bar('Door <span class="meta">sim</span>', D.odds.door) + bar('Replace <span class="meta">sim</span>', D.odds.replace) +
    bar('Replace w/ Noose', rep.map((x,i) => i<2?0:x));
  const norm = (w) => { const t = w.reduce((a,b)=>a+b,0); return w.map((x)=>x/t); };
  const pd = norm(door), pr = norm(rep);
  const E = (p) => p.reduce((a,x,i)=>a+x*i,0);
  const n50 = (q) => Math.ceil(Math.log(.5)/Math.log(1-q));
  const beastShare = L ? L.doorBeasts.share : {Mammoth:.25,Lion:.25,Wolf:.25,Rat:.25};
  const rarest = Object.entries(beastShare).sort((a,b)=>a[1]-b[1])[0];
  $('#oddsDerived').innerHTML = [
    [E(pd).toFixed(2)+' vs '+E(pr).toFixed(2), 'expected tier: door vs Replace'],
    [pct(pd[2]+pd[3]+pd[4]), 'door with Rare or better'],
    [pct(1-pr[0]), 'Replacing a Normal improves'],
    [pct(pr[2]+pr[3]+pr[4],1), `Replacing a Magic improves (${pct(pr[0])} worse)`],
    ['~'+n50(pd[3]*rarest[1]), `doors for 50% odds of a ${rarest[0]} Legendary (rarest beast)`],
    ['~'+n50(pd[4]*rarest[1]), `doors for 50% odds of a ${rarest[0]} Supreme`],
  ].map(([v,l]) => `<div class="stat"><div class="v" style="font-size:30px">${v}</div><div class="l">${l}</div></div>`).join('');
  if (L) {
    $('#liveStats').innerHTML = [
      [L.boards.toLocaleString('en-US'), `boards / ${L.runs.toLocaleString('en-US')} runs (through ${L.latest})`],
      [pct(L.fewerDoorMornings.share,1), 'mornings with only 2 doors (sim: 0%)'],
      [pct(L.eventDoorsDay1.share,1), 'doors with an event on day 1 (sim: 5%)'],
      [pct(L.keyRing.share), 'Lost Ring of Keys opens neighbours (card: 80%)'],
      [L.devours.meanBites.toFixed(2), 'bites per consume (real chains are short)'],
      [Object.entries(beastShare).map(([b,s]) => b[0]+' '+Math.round(s*100)).join(' · '), 'beast behind a door (%)'],
    ].map(([v,l]) => `<div class="stat"><div class="v" style="font-size:26px">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  } else {
    $('#liveStats').innerHTML = '<p class="meta">No telemetry in this snapshot.</p>';
  }
}

// ---------- tools ----------
// One-line summaries shown next to each instrument's card text.
const TOOL_TEXT = {
  crown:'Lions eat any inmate of the same rarity; +2 extra tiers per bite (3 in total).',
  rope:'Replace never brings Normal/Magic → every Replace is an upgrade.',
  maul:'Mammoths eat countered prey of higher rarity; rise to 2 tiers above the meal.',
  scapegoat:'Replace with ≥2 others on the block: removes 2 at random; the new one comes in above the replaced rarity.',
  coin:'Each morning, 2+ identical inmates (beast+rarity): 60% to remove one and give another +2.',
  maiden:'After a Replace, if as many inmates are above the new one as below → +3 tiers. An empty block always qualifies.',
  shackles:'Walking ≥4 cells: 40% for +1 tier on a random inmate.',
  blacklist:'With ≤5 locked cells, each opened door: 2 random inmates +1.',
  muzzle:'A consume leaving ≤4 inmates on the block: +2 tiers.',
  ravenous:'Each morning the top inmate removes its 2 ring neighbours; 40% for +1 per removal.',
  revenge:'After a consume, 30% to open a cell holding a meal for the eater at its new tier.',
  skewer:'Rats eat Rats of the same rarity; a Rat consume gets +1 extra.',
  hook:'Opened cells never hold a Normal.',
  saw:'After a consume, 25% for +1 extra.',
  collar:'Each chain bite after the 1st: 80% for +1 extra.',
  stake:'−1 destination/day. Replacing an inmate below Legendary: 40% to bring a Legendary.',
  guillotine:'Wolves also eat prey of lower rarity.',
  dogtag:'Door opened on patrol: 25% for that inmate to rise +1.',
  whip:'−1 destination/day. Each bite: 35% for +1 extra.',
  tongs:'Each morning a Mammoth gets a Tusk (a Replace there raises 4 inmates).',
  keys:'Opened door: 80% (card; 63% measured live) to also open both neighbours.',
  cage:'After an inmate is eaten, 40% for its cell to reopen with a new inmate.',
  scales:'After a Replace, 80% to reveal the best inmate behind the doors.',
  shortchain:'Walking ≤3 cells: 50% to open a random cell.',
  fire:'Opened door: 35% to copy its inmate into a sealed cell.',
  pestle:'Replace keeps the beast and only re-rolls rarity.',
  axe:'A Replace that rolls higher opens 2 random cells.',
  forged:'−1 destination/day. Opened door: 50% to open one more. Loses more than it gains.',
  ironbox:'Each morning a cell becomes a rat nest (Rare Rat in 2 days). Bad alone; great with Skewer/Coin.',
};
function tierOf(v, base){ const r = v/base; return r>=2.6?'S':r>=1.9?'A':r>=1.5?'B':r>=1.2?'C':r>=1?'D':'X'; }
if (D) {
  $('#baseVal').textContent = D.baseNoTools.toFixed(2);
  const tools = Object.entries(D.tools).filter(([,t]) => t.value != null).sort((a,b) => b[1].value - a[1].value);
  const max = tools[0][1].value;
  const pairOf = new Map(); for (const [a,b,v] of D.pairs) { pairOf.set(a+'|'+b, v); pairOf.set(b+'|'+a, v); }
  const partners = (id) => D.pairs.filter(([a,b]) => a===id || b===id).map(([a,b,v]) => [a===id?b:a, v]).sort((x,y)=>y[1]-x[1]);
  // live offer frequency: share of 3-tool offers in which each tool appeared
  const OF = D.live && D.live.toolOffers && D.live.toolOffers.n ? D.live.toolOffers : null;
  const offerP = (id) => OF ? (OF.counts[id] || 0) / OF.n : 3 / tools.length;
  const tb = $('#toolTbl tbody');
  tb.innerHTML = tools.map(([id,t]) => { const tr = tierOf(t.value, D.baseNoTools); const op = offerP(id);
    return `<tr data-id="${esc(id)}" style="cursor:pointer"><td><span class="tier t${tr}">${tr==='X'?'✕':tr}</span></td><td>${esc(t.name)}</td><td class="num">${t.value.toFixed(2)}</td><td style="width:22%"><div class="bar"><i style="width:${t.value/max*100}%"></i></div></td><td class="num"${OF && op < .03 ? ' style="color:var(--bad)"' : ''}>${OF ? pct(op) : '?'}</td></tr>`; }).join('');
  $('#offerNote').innerHTML = OF
    ? `"Offered" column <span class="badge b-live">LIVE</span>: % of offers (n=${OF.n}) the instrument appeared in. <b>Beast-specific instruments (Crown, Maul, Skewer, Tongs, Guillotine) almost never show up</b> — the best solo pick is rare in practice.`
    : 'No live offer data; assuming uniform offers.';
  const show = (id) => { const t = D.tools[id]; tb.querySelectorAll('tr').forEach((r) => r.classList.toggle('sel', r.dataset.id === id));
    const ps = partners(id).slice(0,5);
    $('#toolDetail').innerHTML = `<h3 style="margin-top:0">${esc(t.name)}</h3><p>${esc(TOOL_TEXT[id] || '')}</p><p class="meta">card: ${esc(t.text || '')}</p>
      <table><thead><tr><th>Best partner</th><th class="num">R/run together</th></tr></thead><tbody>${ps.map(([p,v]) => `<tr><td>${esc(D.tools[p]?.name || p)}</td><td class="num">${v.toFixed(2)}</td></tr>`).join('')}</tbody></table>`; };
  tb.addEventListener('click', (e) => { const r = e.target.closest('tr'); if (r) show(r.dataset.id); });
  $('#toolSearch').addEventListener('input', (e) => { const q = e.target.value.toLowerCase(); tb.querySelectorAll('tr').forEach((r) => { r.style.display = D.tools[r.dataset.id].name.toLowerCase().includes(q) ? '' : 'none'; }); });
  $('#pairTbl tbody').innerHTML = D.pairs.slice(0,12).map(([a,b,v]) => `<tr><td>${esc(D.tools[a]?.name)} + ${esc(D.tools[b]?.name)}</td><td class="num">${v.toFixed(2)}</td><td class="num">${(v/D.baseNoTools).toFixed(1)}×</td></tr>`).join('');
  const opts = tools.map(([id,t]) => `<option value="${esc(id)}">${esc(t.name)}</option>`).join('');
  $('#pA').innerHTML = opts; $('#pB').innerHTML = opts; $('#pA').value = 'rope'; $('#pB').value = 'maiden';
  const pc = () => { const a = $('#pA').value, b = $('#pB').value;
    const v = a === b ? D.tools[a].value : pairOf.get(a+'|'+b);
    // two picks per run (start + objective): one tool in each, either order
    const pa = offerP(a), pb = offerP(b);
    const build = a === b ? 1 - (1 - pa) ** 2 : pa * pb * 2 - pa * pb * pa * pb;
    $('#pOut').textContent = v == null ? 'no data' : `${v.toFixed(2)} R/run (${(v/D.baseNoTools).toFixed(1)}× base) · chance to assemble ~${(build*100).toFixed(1)}% of runs`; };
  $('#pA').addEventListener('change', pc); $('#pB').addEventListener('change', pc); pc(); show(tools[0][0]);
}

// ---------- events ----------
// Effect and recommended decision per Prison Incident.
const EVENT_TEXT = {
  trickster:['The inmate behind the door becomes a Supreme of the scarcest beast on the block.','Accept (skip if it is already Supreme)'],
  appetite:['5 tries at +1 tier, 50% each (average +2.5).','Accept'],
  convict:['A gain with no cost.','Accept'],
  crow:['Reveals the rarity of 4 locked cells.','Accept'],
  freedom:['Opens 3 random locked cells.','Accept'],
  usurp1:['1 inmate +1; swaps itself for Usurpation II in the pool.','Accept'],
  usurp2:['2 inmates +1 (card not seen; inferred).','Accept'],
  usurp3:['2 inmates +2.','Accept'],
  usurp4:['All inmates +2.','Accept'],
  hunt:['Reveals cells below Rare → the dark ones are Rare+.','Just confirm'],
  ratway:['Move to any cell (except the office) and trigger its content.','Use on the best cell'],
  chain:['Opens every door along the path.','Close call: floods the block, burns doors'],
  execution:['The executioner wipes inmates and gains tiers.','Only if the gain beats the losses'],
};
const OBJECTIVE_TEXT = { king:'1 inmate reaches Supreme', walk:'walk 18 cells', consume:'consume 4 times', incident:'trigger 2 incidents' };
const CARD_TEXT = { cagefight:'eat prey of your rarity or lower without re-rolling the beast — great for chains', ironlaw:'30-day run', tyranny:'the office also fires Instigate + Bestow 3 extra times' };
const GIFT_TEXT = { wine:'many inmates below Legendary', ring:'many sealed doors', horn:'many inmates with targets', brand:'many inmates with nothing to eat' };
if (D) {
  $('#evTbl tbody').innerHTML = Object.entries(D.events).map(([id,e]) => { const [fx,dec] = EVENT_TEXT[id] || ['(new — no description yet)','?'];
    const good = /^Accept|^Just confirm|^Use/.test(dec);
    return `<tr><td><b>${esc(e.name)}</b></td><td>${esc(fx)}</td><td style="color:${good?'var(--ok)':'var(--warn)'};font-weight:600">${esc(dec)}</td></tr>`; }).join('');
  $('#objTbl tbody').innerHTML = Object.entries(D.objectives).filter(([id]) => id !== 'other').map(([id,o]) => `<tr><td><b>${esc(o.name)}</b></td><td>${esc(OBJECTIVE_TEXT[id] || o.text)}</td></tr>`).join('');
  $('#cardTbl tbody').innerHTML = Object.entries(D.startCards).map(([id,o]) => `<tr><td><b>${esc(o.name)}</b></td><td>${esc(CARD_TEXT[id] || o.text)}</td></tr>`).join('');
  $('#giftTbl tbody').innerHTML = Object.entries(D.gifts).sort((a,b)=>b[1].value-a[1].value).map(([id,g]) => `<tr><td><b>${esc(g.name)}</b><div class="meta">${esc(g.text)}</div></td><td class="num">${g.value.toFixed(2)}</td><td>${esc(GIFT_TEXT[id] || '')}</td></tr>`).join('');
  const HABIT_TEXT = { full:'The full strategy', simple:'A simple player', random:'Random moves' };
  const hmax = Math.max(...D.habits.map((h)=>h.value));
  $('#habTbl tbody').innerHTML = D.habits.slice().sort((a,b)=>b.value-a.value).map((h) => `<tr><td>${esc(HABIT_TEXT[h.id] || h.label)}</td><td class="num">${h.value.toFixed(2)}</td><td style="width:45%"><div class="bar"><i style="width:${h.value/hmax*100}%;${h.id==='full'?'background:var(--ok)':''}"></i></div></td></tr>`).join('');
  const gal = $('#gallery');
  const lb = $('#lightbox');
  if (gal) gal.addEventListener('click', (e) => { const a = e.target.closest('a[data-full]'); if (!a) return; e.preventDefault(); lb.querySelector('img').src = a.dataset.full; lb.showModal(); });
  lb.addEventListener('click', () => lb.close());
}