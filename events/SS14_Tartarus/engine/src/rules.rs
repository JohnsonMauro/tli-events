//! The rules of a Warden's Duty run, written from the research base:
//! `TARTARUS_GUIDE.md`, the card transcriptions in `images/INDEX.md`, the
//! tlidb glossary and the rule texts in `data/tartarus_data.json`.
//! Choices are not made here: `run.rs` asks the policy and calls these.

use crate::model::*;
use crate::params::Params;
use crate::rng::Rng;

/// A small set of cell indices without allocation.
#[derive(Clone, Copy, Default)]
pub struct Cells {
    pub n: u8,
    pub at: [u8; CELLS],
}

impl Cells {
    pub fn push(&mut self, c: usize) {
        self.at[self.n as usize] = c as u8;
        self.n += 1;
    }
    pub fn as_slice(&self) -> &[u8] {
        &self.at[..self.n as usize]
    }
    pub fn is_empty(&self) -> bool {
        self.n == 0
    }
    pub fn len(&self) -> usize {
        self.n as usize
    }
    /// Takes a random element out.
    pub fn take(&mut self, rng: &mut Rng) -> Option<usize> {
        if self.n == 0 {
            return None;
        }
        let i = rng.below(self.n as usize);
        let c = self.at[i];
        self.n -= 1;
        self.at[i] = self.at[self.n as usize];
        Some(c as usize)
    }
    pub fn collect(it: impl Iterator<Item = usize>) -> Self {
        let mut s = Cells::default();
        for c in it {
            s.push(c);
        }
        s
    }
}

/// A meal: an open cell, or a scratched door a Wolf eats through.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Meal {
    pub cell: u8,
    pub scratch: bool,
}

// ---------- Rolls ----------

pub fn roll_tier(rng: &mut Rng, weights: &[f64]) -> u8 {
    rng.weighted(weights).unwrap_or(0) as u8
}

pub fn roll_beast(rng: &mut Rng, p: &Params) -> u8 {
    rng.weighted(&p.beasts).unwrap_or(0) as u8
}

fn door_inmate(st: &mut State, p: &Params) -> Inmate {
    let tier = roll_tier(&mut st.rng, &p.door_tiers);
    Inmate {
        beast: roll_beast(&mut st.rng, p),
        tier,
    }
}

// ---------- Food chain ----------

/// Beasts (bitmask) an inmate counters: its first meal, plus the second from
/// `second_meal_from` up (always under Cage Fight, whose card lists both).
pub fn counters(st: &State, p: &Params, eater: Inmate) -> u8 {
    let b = eater.beast as usize;
    let second = st.cage_fight() || eater.tier >= p.second_meal_from;
    FIRST_MEAL[b] | if second { SECOND_MEAL[b] } else { 0 }
}

/// Beasts it can eat at its own rarity.
pub fn eats_same_tier(st: &State, p: &Params, eater: Inmate) -> u8 {
    let mut m = counters(st, p, eater);
    if eater.beast == RAT && st.has(Tool::Skewer) {
        m |= 1 << RAT;
    }
    if eater.beast == LION && st.has(Tool::Crown) {
        m = 0b1111;
    }
    m
}

pub fn can_eat(st: &State, p: &Params, eater: Inmate, meal: Inmate) -> bool {
    if eater.tier >= RAINBOW {
        return false;
    }
    let bit = 1u8 << meal.beast;
    if meal.tier == eater.tier {
        return eats_same_tier(st, p, eater) & bit != 0;
    }
    let countered = counters(st, p, eater) & bit != 0;
    if meal.tier < eater.tier {
        // Cage Fight: countered prey at its own rarity or lower.
        // Fanged Guillotine: a Wolf eats its prey at a lower rarity.
        (st.cage_fight() && countered)
            || (eater.beast == WOLF && st.has(Tool::Guillotine) && countered)
    } else {
        // Elephant-Foot Maul: a Mammoth eats what it counters at a higher rarity.
        eater.beast == MAMMOTH && st.has(Tool::Maul) && countered
    }
}

/// Every meal the inmate in cell `from` can take now.
pub fn meals(st: &State, p: &Params, from: usize) -> ([Meal; CELLS], usize) {
    let mut out = [Meal {
        cell: 0,
        scratch: false,
    }; CELLS];
    let mut n = 0;
    let Some(eater) = st.inmate_at(from) else {
        return (out, 0);
    };
    for (c, cell) in st.cells.iter().enumerate() {
        if c == from {
            continue;
        }
        let ok = match cell.kind {
            CellKind::Open => can_eat(st, p, eater, cell.inmate),
            // Scratch Marks (tlidb): a Wolf eats any inmate of its rarity behind a scratched door.
            CellKind::Sealed => {
                cell.scratch
                    && eater.beast == WOLF
                    && cell.inmate.tier == eater.tier
                    && eater.tier < RAINBOW
            }
            CellKind::Office => false,
        };
        if ok {
            out[n] = Meal {
                cell: c as u8,
                scratch: cell.kind == CellKind::Sealed,
            };
            n += 1;
        }
    }
    (out, n)
}

pub fn has_meal(st: &State, p: &Params, from: usize) -> bool {
    meals(st, p, from).1 > 0
}

// ---------- Setup ----------

pub fn new_run(p: &Params, seed: u64, tools: u64, start_card: StartCard) -> State {
    let blank = Cell {
        kind: CellKind::Sealed,
        inmate: Inmate { beast: 0, tier: 0 },
        event: None,
        event_seen: false,
        revealed: false,
        scratch: false,
        tusk: false,
        nest: 0,
    };
    let mut st = State {
        cells: [blank; CELLS],
        warden: OFFICE as u8,
        day: 1,
        max_days: if start_card == StartCard::IronLaw {
            30
        } else {
            p.days
        },
        vault: 0,
        tools,
        start_card,
        objective: Objective::King,
        objective_progress: 0,
        objective_done: false,
        consumed_today: false,
        replaced_today: false,
        chain_next: false,
        usurp_stage: 1,
        first_incident: p.first_incident,
        prey: None,
        pending_tools: 0,
        pending_treasures: 0,
        rng: Rng::new(seed),
        stats: Stats::default(),
    };
    st.cells[OFFICE].kind = CellKind::Office;
    for n in 1..CELLS {
        st.cells[n].inmate = door_inmate(&mut st, p);
        if st.rng.chance(p.event_chance) {
            st.cells[n].event = Some(roll_incident(&mut st));
        }
    }
    // The board always holds at least one incident (owner, live play).
    if p.incident_respawn && (1..CELLS).all(|c| st.cells[c].event.is_none()) {
        add_incident(&mut st, None);
    }
    st.objective = st.rng.pick(&Objective::ALL);
    if p.rewards {
        st.pending_tools = p.start_picks;
    }
    st
}

// ---------- Board changes ----------

/// The cell locks again with someone new behind it (an eaten, removed or
/// vaulted inmate leaves its cell unopened: in-game rules page).
pub fn seal(st: &mut State, p: &Params, n: usize) {
    if n == OFFICE {
        return;
    }
    break_prey_at(st, n);
    let inmate = door_inmate(st, p);
    let c = &mut st.cells[n];
    c.kind = CellKind::Sealed;
    c.inmate = inmate;
    c.event = None;
    c.revealed = false;
    c.scratch = false;
    c.tusk = false;
    c.nest = 0;
}

fn break_prey_at(st: &mut State, n: usize) {
    if let Some(pr) = st.prey
        && (pr.lion as usize == n || pr.prey as usize == n)
    {
        st.prey = None;
    }
}

/// Opens a sealed cell. Returns the incident behind it; only a patrol's own
/// door triggers it (every other opening says "does not trigger other effects").
pub fn open(st: &mut State, p: &Params, n: usize) -> Option<Incident> {
    if !st.cells[n].is_sealed() {
        return None;
    }
    // Sorting Hook: an unseen Normal never comes out.
    if st.has(Tool::Hook) && st.cells[n].inmate.tier == NORMAL && !st.cells[n].revealed {
        let w = &p.door_tiers;
        st.cells[n].inmate.tier = roll_tier(&mut st.rng, &[0.0, w[1], w[2], w[3], w[4]]);
    }
    let c = &mut st.cells[n];
    c.kind = CellKind::Open;
    c.revealed = false;
    c.scratch = false;
    c.nest = 0;
    let event = c.event.take();
    st.stats.opened += 1;
    if st.objective == Objective::Doors {
        advance_objective(st, p, 1);
    }
    check_king(st, p, n);
    event
}

/// Opens a cell with a chosen inmate (Branding Iron, Avenger's Casket, Archenemy, nests).
fn open_with(st: &mut State, p: &Params, n: usize, inmate: Inmate) {
    st.cells[n].inmate = inmate;
    st.cells[n].revealed = true; // the Hook doesn't reroll a placed inmate
    open(st, p, n);
}

fn random_sealed(st: &mut State) -> Option<usize> {
    let mut s = Cells::collect(st.sealed_cells());
    s.take(&mut st.rng)
}

fn open_random_sealed(st: &mut State, p: &Params, count: usize) {
    let mut s = Cells::collect(st.sealed_cells());
    for _ in 0..count {
        match s.take(&mut st.rng) {
            Some(c) => {
                open(st, p, c);
            }
            None => break,
        }
    }
}

/// Raises the inmate in cell `n`. A Rainbow goes to the vault at once (its
/// cell empties); past the cap it stays Supreme. A consume re-rolls the beast.
pub fn promote(st: &mut State, p: &Params, n: usize, by: u8, reroll: bool) {
    if !st.cells[n].is_open() {
        return;
    }
    let old = st.cells[n].inmate;
    let mut tier = (old.tier + by).min(RAINBOW);
    if tier >= RAINBOW {
        if st.vault < p.rainbow_cap {
            st.vault += 1;
            if p.rewards || p.treasures {
                // Opulence: each Treasure is 3 picks in a row; a Rainbow a pick makes comes back here for 3 more.
                st.pending_treasures += if st.start_card == StartCard::Opulence {
                    3
                } else {
                    1
                };
            }
            seal(st, p, n);
            return;
        }
        tier = SUPREME;
    }
    st.cells[n].inmate.tier = tier;
    if reroll {
        let beast = roll_beast(&mut st.rng, p);
        st.cells[n].inmate.beast = beast;
        if beast != old.beast {
            break_prey_at(st, n);
        }
    }
    check_king(st, p, n);
}

fn raise_random(st: &mut State, p: &Params, count: usize, by: u8) {
    let mut s = Cells::collect(st.open_cells());
    for _ in 0..count {
        match s.take(&mut st.rng) {
            Some(c) => promote(st, p, c, by, false),
            None => break,
        }
    }
}

// ---------- Objectives ----------

fn check_king(st: &mut State, p: &Params, n: usize) {
    if st.objective == Objective::King
        && st.cells[n].is_open()
        && st.cells[n].inmate.tier >= SUPREME
    {
        advance_objective(st, p, 1);
    }
}

pub fn advance_objective(st: &mut State, p: &Params, by: u16) {
    if st.objective_done {
        return;
    }
    st.objective_progress += by;
    if st.objective_progress >= st.objective.need() {
        st.objective_done = true;
        if p.rewards {
            st.pending_tools += 1;
            st.stats.tools_earned += 1;
        }
    }
}

// ---------- A day ----------

/// Morning effects, in a fixed order (the game's order is not documented).
pub fn start_day(st: &mut State, p: &Params) {
    st.consumed_today = false;
    st.replaced_today = false;
    // Prey mark: the Lion and its prey rise a tier each morning.
    if let Some(mut pr) = st.prey {
        let (l, q) = (pr.lion as usize, pr.prey as usize);
        if st.cells[l].is_open() && st.cells[q].is_open() {
            promote(st, p, l, 1, false);
            promote(st, p, q, 1, false);
            pr.rounds -= 1;
            st.prey = if pr.rounds > 0 && st.prey.is_some() {
                Some(pr)
            } else {
                None
            };
        } else {
            st.prey = None;
        }
    }
    // Rat nests hatch a Rare Rat after `nest_days` rounds.
    for n in 1..CELLS {
        let c = st.cells[n];
        if c.is_sealed() && c.nest > 0 {
            st.cells[n].nest -= 1;
            if st.cells[n].nest == 0 {
                open_with(
                    st,
                    p,
                    n,
                    Inmate {
                        beast: RAT,
                        tier: RARE,
                    },
                );
            }
        }
    }
    if st.has(Tool::IronBox) {
        let mut s = Cells::collect(st.sealed_cells().filter(|&c| st.cells[c].nest == 0));
        if let Some(c) = s.take(&mut st.rng) {
            st.cells[c].nest = p.nest_days;
        }
    }
    if st.has(Tool::Tongs) {
        let mut s = Cells::collect(
            st.open_cells()
                .filter(|&c| st.cells[c].inmate.beast == MAMMOTH),
        );
        if let Some(c) = s.take(&mut st.rng) {
            st.cells[c].tusk = true;
        }
    }
    if st.has(Tool::Claws) {
        let mut s = Cells::collect(st.sealed_cells().filter(|&c| !st.cells[c].scratch));
        if let Some(c) = s.take(&mut st.rng) {
            st.cells[c].scratch = true;
            st.cells[c].revealed = true;
        }
    }
    if st.has(Tool::Coin) {
        kins_coin(st, p);
    }
    if st.has(Tool::Ravenous) {
        ravenous_chains(st, p);
    }
}

/// Kin's Coin of Fate: with matching inmates (same beast and rarity), 60%:
/// one of them is removed and another gains +2.
fn kins_coin(st: &mut State, p: &Params) {
    let mut pairs = Cells::default();
    for a in st.open_cells() {
        if st
            .open_cells()
            .any(|b| b != a && st.cells[b].inmate == st.cells[a].inmate)
        {
            pairs.push(a);
        }
    }
    if pairs.is_empty() || !st.rng.chance(0.6) {
        return;
    }
    let gone = pairs.take(&mut st.rng).unwrap();
    let kind = st.cells[gone].inmate;
    let mut mates = Cells::collect(
        st.open_cells()
            .filter(|&c| c != gone && st.cells[c].inmate == kind),
    );
    seal(st, p, gone);
    if let Some(up) = mates.take(&mut st.rng) {
        promote(st, p, up, 2, false);
    }
}

/// Ferocious Beast's Ravenous Chains: the highest inmate removes both ring
/// neighbours; 40% of +1 for each one removed.
fn ravenous_chains(st: &mut State, p: &Params) {
    let Some(top) = st.open_cells().map(|c| st.cells[c].inmate.tier).max() else {
        return;
    };
    let mut s = Cells::collect(st.open_cells().filter(|&c| st.cells[c].inmate.tier == top));
    let n = s.take(&mut st.rng).unwrap();
    for side in [(n + CELLS - 1) % CELLS, (n + 1) % CELLS] {
        if st.cells[side].is_open() && st.cells[n].is_open() {
            seal(st, p, side);
            if st.rng.chance(0.4) {
                promote(st, p, n, 1, false);
            }
        }
    }
}

/// Today's destinations: up to 3 of the next `patrol_range` cells clockwise.
pub fn destinations(st: &mut State, p: &Params) -> Cells {
    let mut count = p.destinations as i32;
    for t in [Tool::Forged, Tool::Whip, Tool::Stake] {
        if st.has(t) {
            count -= 1;
        }
    }
    if st.rng.chance(p.fewer_doors) {
        count -= 1;
    }
    let count = count.max(1) as usize;
    let w = st.warden as usize;
    let mut ahead = Cells::collect((1..=p.patrol_range as usize).map(|k| (w + k) % CELLS));
    let mut out = Cells::default();
    for _ in 0..count {
        if let Some(c) = ahead.take(&mut st.rng) {
            out.push(c);
        }
    }
    out
}

/// Walks the warden clockwise to `dest`. Returns the incident that triggers there.
pub fn patrol(st: &mut State, p: &Params, dest: usize) -> Option<Incident> {
    let w = st.warden as usize;
    let steps = (dest + CELLS - w) % CELLS;
    for k in 1..steps {
        let c = (w + k) % CELLS;
        st.cells[c].event_seen = true;
        if st.chain_next && st.cells[c].is_sealed() {
            open(st, p, c);
        }
    }
    st.chain_next = false;
    st.warden = dest as u8;
    if st.objective == Objective::Walk {
        advance_objective(st, p, steps as u16);
    }
    let event = if st.cells[dest].is_sealed() {
        let ev = open(st, p, dest);
        door_effects(st, p, dest);
        if p.maiden_any_time {
            maiden(st, p, dest);
        }
        ev
    } else {
        st.cells[dest].event.take()
    };
    if st.has(Tool::Shackles) && steps >= 4 && st.rng.chance(0.4) {
        raise_random(st, p, 1, 1);
    }
    if st.has(Tool::ShortChain) && steps <= 3 && st.rng.chance(0.5) {
        open_random_sealed(st, p, 1);
    }
    event
}

/// What a patrol's own door sets off.
fn door_effects(st: &mut State, p: &Params, n: usize) {
    if st.has(Tool::DogTag) && st.rng.chance(0.25) {
        promote(st, p, n, 1, false);
    }
    if st.has(Tool::Keys) && st.rng.chance(p.keys_chance) {
        for side in [(n + CELLS - 1) % CELLS, (n + 1) % CELLS] {
            open(st, p, side);
        }
    }
    if st.has(Tool::Fire) && st.rng.chance(0.35) && st.cells[n].is_open() {
        let copy = st.cells[n].inmate;
        if let Some(c) = random_sealed(st) {
            open_with(st, p, c, copy);
        }
    }
    if st.has(Tool::Forged) && st.rng.chance(0.5) {
        open_random_sealed(st, p, 1);
    }
    if st.has(Tool::Blacklist) && st.sealed_count() <= 5 {
        raise_random(st, p, 2, 1);
    }
}

// ---------- Decisions in a cell ----------

pub fn can_act(st: &State) -> bool {
    !st.consumed_today
        && !st.replaced_today
        && st.warden as usize != OFFICE
        && st.cells[st.warden as usize].is_open()
}

/// Oppress (tlidb): the chance a Wolf's lower-rarity bite rises at all.
pub fn oppress_chance(st: &State, p: &Params, eater: Inmate, meal: Inmate) -> f64 {
    if eater.beast == WOLF && meal.tier < eater.tier && st.has(Tool::Guillotine) {
        (p.oppress_base - p.oppress_step * (eater.tier - meal.tier) as f64).clamp(0.0, 1.0)
    } else {
        1.0
    }
}

/// The sure part of a bite's gain (before Saw, Whip, Collar and Oppress).
pub fn base_gain(
    st: &State,
    p: &Params,
    eater: Inmate,
    meal: Inmate,
    scratch: bool,
    block_after: usize,
) -> u8 {
    let mut gain: u8 = if scratch { 1 + p.scratch_extra } else { 1 };
    if !scratch && eater.beast == MAMMOTH && st.has(Tool::Maul) {
        gain = (meal.tier + 2).saturating_sub(eater.tier).max(1);
    }
    if st.has(Tool::Muzzle) && block_after <= p.muzzle_max as usize {
        gain += 2;
    }
    if eater.beast == RAT && st.has(Tool::Skewer) {
        gain += p.skewer_extra;
    }
    if eater.beast == LION && st.has(Tool::Crown) {
        gain += 2;
    }
    gain
}

/// One bite by the inmate in `from`. Returns false when the eater left the
/// block (Rainbow). `chained`: a bite after the first of the same consume.
pub fn bite(st: &mut State, p: &Params, from: usize, meal: Meal, chained: bool) -> bool {
    let Some(eater) = st.inmate_at(from) else {
        return false;
    };
    let target = meal.cell as usize;
    let food = st.cells[target].inmate;
    st.consumed_today = true;
    seal(st, p, target);
    // The Muzzle counts the block after the meal is gone; a scratched door's meal wasn't on it.
    let block_after = st.open_count();
    let mut gain = base_gain(st, p, eater, food, meal.scratch, block_after);
    if st.has(Tool::Saw) && st.rng.chance(0.25) {
        gain += 1;
    }
    if st.has(Tool::Whip) && st.rng.chance(0.35) {
        gain += 1;
    }
    if st.has(Tool::Collar) && (chained || p.collar_first_bite) && st.rng.chance(0.8) {
        gain += 1;
    }
    if !meal.scratch {
        let pr = oppress_chance(st, p, eater, food);
        if pr < 1.0 && !st.rng.chance(pr) {
            gain = 0;
        }
    }
    // Crowded Beastcage: the meal's cell opens again at once with someone new.
    if !meal.scratch && st.has(Tool::Cage) && st.rng.chance(0.4) {
        open(st, p, target);
    }
    promote(st, p, from, gain, !st.cage_fight());
    if p.maiden_any_time {
        maiden(st, p, from);
    }
    st.stats.bites += 1;
    if st.objective == Objective::Consume {
        advance_objective(st, p, 1);
    }
    let Some(now) = st.inmate_at(from) else {
        return false;
    };
    // Avenger's Casket: 30%, a sealed cell opens on a meal for the eater's new form.
    if st.has(Tool::Revenge) && st.rng.chance(0.3) {
        let mask = eats_same_tier(st, p, now);
        let options: Vec<u8> = (0..4u8).filter(|b| mask & (1 << b) != 0).collect();
        if let (Some(c), false) = (random_sealed(st), options.is_empty()) {
            let beast = st.rng.pick(&options);
            open_with(
                st,
                p,
                c,
                Inmate {
                    beast,
                    tier: now.tier,
                },
            );
        }
    }
    true
}

/// Severed Iron Maiden: as many inmates above this one's rarity as below it → +3.
fn maiden(st: &mut State, p: &Params, n: usize) {
    if !st.has(Tool::Maiden) || !st.cells[n].is_open() {
        return;
    }
    let t = st.cells[n].inmate.tier;
    let above = st
        .open_cells()
        .filter(|&c| c != n && st.cells[c].inmate.tier > t)
        .count();
    let below = st
        .open_cells()
        .filter(|&c| c != n && st.cells[c].inmate.tier < t)
        .count();
    if above == below {
        promote(st, p, n, 3, false);
    }
}

pub fn start_consume(st: &mut State) {
    st.stats.consumes += 1;
}

/// Replace the inmate in the warden's cell.
pub fn replace(st: &mut State, p: &Params) {
    let n = st.warden as usize;
    let Some(old) = st.inmate_at(n) else { return };
    st.replaced_today = true;
    st.stats.replaces += 1;
    let mut w = p.replace_tiers;
    if st.has(Tool::Rope) {
        w[0] = 0.0;
        w[1] = 0.0;
    }
    if st.has(Tool::Scapegoat) {
        let mut others = Cells::collect(st.open_cells().filter(|&c| c != n));
        if others.len() >= 2 {
            for _ in 0..2 {
                let c = others.take(&mut st.rng).unwrap();
                seal(st, p, c);
            }
            for (t, x) in w.iter_mut().enumerate() {
                if t as u8 <= old.tier {
                    *x = 0.0;
                }
            }
            if w.iter().all(|x| *x <= 0.0) {
                w[(old.tier + 1).min(RAINBOW) as usize] = 1.0;
            }
        }
    }
    let mut tier = roll_tier(&mut st.rng, &w);
    if st.has(Tool::Stake) && old.tier < LEGENDARY && st.rng.chance(0.4) {
        tier = LEGENDARY;
    }
    let beast = if st.has(Tool::Pestle) {
        old.beast
    } else {
        roll_beast(&mut st.rng, p)
    };
    break_prey_at(st, n);
    st.cells[n].inmate = Inmate {
        beast,
        tier: tier.min(SUPREME),
    };
    if tier >= RAINBOW {
        promote(st, p, n, 1, false);
    }
    check_king(st, p, n);
    maiden(st, p, n);
    // Tusk: replacing this inmate raises random inmates. The tooltip says the
    // mark goes when the room is empty; whether a Replace empties it is open.
    if st.cells[n].tusk {
        st.cells[n].tusk = p.tusk_persists;
        raise_random(st, p, p.tusk_count as usize, 1);
    }
    if st.has(Tool::Axe) && tier > old.tier {
        open_random_sealed(st, p, 2);
    }
    // Warden's Scales: 80%, the highest-rarity sealed door shows.
    if st.has(Tool::Scales)
        && st.rng.chance(0.8)
        && let Some(top) = st.sealed_cells().map(|c| st.cells[c].inmate.tier).max()
    {
        let mut s = Cells::collect(
            st.sealed_cells()
                .filter(|&c| st.cells[c].inmate.tier == top),
        );
        if let Some(c) = s.take(&mut st.rng) {
            st.cells[c].revealed = true;
        }
    }
}

/// Blood-Stained Trap: the Lion in the warden's cell marks prey it can eat.
pub fn hunt(st: &mut State, p: &Params, prey: usize) -> bool {
    let n = st.warden as usize;
    let (Some(lion), Some(q)) = (st.inmate_at(n), st.inmate_at(prey)) else {
        return false;
    };
    if !st.has(Tool::Trap) || lion.beast != LION || prey == n || !can_eat(st, p, lion, q) {
        return false;
    }
    st.prey = Some(Prey {
        lion: n as u8,
        prey: prey as u8,
        rounds: p.prey_rounds,
    });
    st.consumed_today = true;
    true
}

/// The Interrogation Room: Instigate adds incidents, Bestow raises a random inmate.
/// Tyranny adds 3 of each on top of the choice.
pub fn office(st: &mut State, p: &Params, instigate: bool) {
    let (mut inst, mut best) = if instigate { (1, 0) } else { (0, 1) };
    if st.start_card == StartCard::Tyranny {
        inst += 3;
        best += 3;
    }
    for _ in 0..inst * p.instigate_count as usize {
        add_incident(st, None);
    }
    for _ in 0..best {
        raise_random(st, p, 1, 1);
    }
}

// ---------- Incidents ----------

/// Puts a random incident on a random cell that has none (never the Interrogation
/// Room, nor `except`).
fn add_incident(st: &mut State, except: Option<usize>) {
    let mut s =
        Cells::collect((1..CELLS).filter(|&c| st.cells[c].event.is_none() && Some(c) != except));
    if let Some(c) = s.take(&mut st.rng) {
        st.cells[c].event = Some(roll_incident(st));
    }
}

/// A random incident from the pool (uniform: no live rate per incident yet).
pub fn roll_incident(st: &mut State) -> Incident {
    let mut pool = [Incident::ChainReaction; 13];
    let base = [
        Incident::ChainReaction,
        Incident::Execution,
        Incident::BehindClosedDoors,
        Incident::RavenousAppetite,
        Incident::HighRiskConvict,
        Incident::CrowWhispers,
        Incident::TasteOfFreedom,
        Incident::SewerRatway,
        Incident::TreasureHunt,
        Incident::SharedFortune,
        Incident::Archenemy,
        Incident::ExtraPortion,
    ];
    pool[..12].copy_from_slice(&base);
    // Only Usurpation I is ever drawn: once it fires, II-IV come as the next incidents triggered (`incident`).
    let n = if st.usurp_stage == 1 {
        pool[12] = Incident::Usurpation(1);
        13
    } else {
        12
    };
    pool[st.rng.below(n)]
}

/// The incident a "!" really sets off. Once Usurpation I fires, the next incidents triggered are II, III and IV
/// in turn, whatever the "!" held (live cards 102-105: four in a row, day 14 to day 6); a stale Usurpation after
/// IV draws again. `Params::first_incident` replaces the run's first one. Calling it twice changes nothing.
pub fn fires(st: &mut State, inc: Incident) -> Incident {
    let inc = st.first_incident.take().unwrap_or(inc);
    match st.usurp_stage {
        2..=4 => Incident::Usurpation(st.usurp_stage),
        5 if matches!(inc, Incident::Usurpation(_)) => roll_incident(st),
        _ => inc,
    }
}

/// Applies an incident at the warden's cell. `ratway`: the cell Sewer Ratway
/// moves to. Returns an incident the move set off, if any.
pub fn incident(
    st: &mut State,
    p: &Params,
    inc: Incident,
    ratway: Option<usize>,
) -> Option<Incident> {
    let inc = fires(st, inc);
    st.stats.incidents += 1;
    if st.objective == Objective::Undercurrents {
        advance_objective(st, p, 1);
    }
    let here = st.warden as usize;
    if p.incident_respawn {
        add_incident(st, Some(here));
    }
    let cur = st.inmate_at(here);
    match inc {
        Incident::ChainReaction => st.chain_next = true,
        Incident::Execution => {
            if let Some(ex) = cur {
                let mask = counters(st, p, ex);
                let victims = Cells::collect(st.open_cells().filter(|&c| {
                    let v = st.cells[c].inmate;
                    c != here
                        && mask & (1 << v.beast) != 0
                        && (v.tier < ex.tier || (p.execution_same_tier && v.tier == ex.tier))
                }));
                for &c in victims.as_slice() {
                    seal(st, p, c as usize);
                }
                promote(st, p, here, victims.len() as u8, false);
            }
        }
        Incident::BehindClosedDoors => {
            if cur.is_some() {
                let counts: Vec<usize> = (0..4u8)
                    .map(|b| {
                        st.open_cells()
                            .filter(|&c| st.cells[c].inmate.beast == b)
                            .count()
                    })
                    .collect();
                let low = *counts.iter().min().unwrap();
                let scarce: Vec<u8> = (0..4u8).filter(|&b| counts[b as usize] == low).collect();
                let beast = st.rng.pick(&scarce);
                break_prey_at(st, here);
                st.cells[here].inmate = Inmate {
                    beast,
                    tier: SUPREME,
                };
                check_king(st, p, here);
            }
        }
        Incident::RavenousAppetite => {
            if let Some(low) = st.open_cells().map(|c| st.cells[c].inmate.tier).min() {
                let mut s =
                    Cells::collect(st.open_cells().filter(|&c| st.cells[c].inmate.tier == low));
                let c = s.take(&mut st.rng).unwrap();
                for _ in 0..5 {
                    if st.rng.chance(0.5) {
                        promote(st, p, c, 1, false);
                    }
                }
            }
        }
        Incident::HighRiskConvict => {
            if let Some(c) = random_sealed(st) {
                let w = &p.door_tiers;
                let tier = roll_tier(&mut st.rng, &[0.0, 0.0, 0.0, w[3], w[4]]);
                let beast = roll_beast(&mut st.rng, p);
                open_with(st, p, c, Inmate { beast, tier });
            }
        }
        Incident::CrowWhispers => {
            let mut left = 4;
            for k in 1..CELLS {
                let c = (here + k) % CELLS;
                if left > 0 && st.cells[c].is_sealed() {
                    st.cells[c].revealed = true;
                    left -= 1;
                }
            }
        }
        Incident::TasteOfFreedom => open_random_sealed(st, p, 3),
        Incident::Usurpation(stage) => {
            match stage {
                1 => raise_random(st, p, 1, 1),
                2 => raise_random(st, p, 1, 2),
                3 => raise_random(st, p, 2, 2),
                _ => {
                    let all = Cells::collect(st.open_cells());
                    for &c in all.as_slice() {
                        promote(st, p, c as usize, 2, false);
                    }
                }
            }
            // The card swaps the next stage into the incidents: it is the next one triggered (see above).
            st.usurp_stage = stage + 1;
        }
        Incident::SewerRatway => {
            if let Some(dest) = ratway.filter(|&d| d != OFFICE) {
                st.warden = dest as u8;
                if st.cells[dest].is_sealed() {
                    let ev = open(st, p, dest);
                    door_effects(st, p, dest);
                    return ev;
                }
                return st.cells[dest].event.take();
            }
        }
        Incident::TreasureHunt => {
            for c in 1..CELLS {
                if st.cells[c].is_sealed() && st.cells[c].inmate.tier < RARE {
                    st.cells[c].revealed = true;
                }
            }
        }
        Incident::SharedFortune => {
            if let Some(me) = cur {
                let same = st
                    .open_cells()
                    .filter(|&c| c != here && st.cells[c].inmate.beast == me.beast)
                    .count();
                promote(st, p, here, same as u8, false);
            }
        }
        Incident::ExtraPortion => raise_random(st, p, 3, 1),
        Incident::Archenemy => {
            if let Some(me) = cur {
                let mask = eats_same_tier(st, p, me);
                let options: Vec<u8> = (0..4u8).filter(|b| mask & (1 << b) != 0).collect();
                if let (Some(c), false) = (random_sealed(st), options.is_empty()) {
                    let beast = st.rng.pick(&options);
                    open_with(
                        st,
                        p,
                        c,
                        Inmate {
                            beast,
                            tier: me.tier,
                        },
                    );
                }
            }
        }
    }
    None
}

// ---------- Warden's Treasure and instruments ----------

pub fn treasure(st: &mut State, p: &Params, t: Treasure) {
    match t {
        Treasure::CrimsonVintage => {
            let low = Cells::collect(
                st.open_cells()
                    .filter(|&c| st.cells[c].inmate.tier < LEGENDARY),
            );
            for &c in low.as_slice() {
                promote(st, p, c as usize, 1, false);
            }
        }
        Treasure::ThumbRing => open_random_sealed(st, p, 3),
        Treasure::BrassHorn => {
            // Every inmate with a target consumes one at random, in random order (plain bites).
            let mut order = Cells::collect(st.open_cells());
            while let Some(c) = order.take(&mut st.rng) {
                let (list, n) = meals(st, p, c);
                let open_meals: Vec<Meal> =
                    list[..n].iter().copied().filter(|m| !m.scratch).collect();
                if open_meals.is_empty() {
                    continue;
                }
                let m = st.rng.pick(&open_meals);
                seal(st, p, m.cell as usize);
                promote(st, p, c, 1, !st.cage_fight());
            }
        }
        Treasure::BrandOfOriginalSin => {
            let mut hungry = Cells::collect(st.open_cells().filter(|&c| !has_meal(st, p, c)));
            for _ in 0..4 {
                let Some(c) = hungry.take(&mut st.rng) else {
                    break;
                };
                let me = st.cells[c].inmate;
                let fits: Vec<u8> = (0..4u8)
                    .filter(|&b| {
                        let as_b = Inmate {
                            beast: b,
                            tier: me.tier,
                        };
                        st.open_cells()
                            .any(|o| o != c && can_eat(st, p, as_b, st.cells[o].inmate))
                    })
                    .collect();
                if !fits.is_empty() {
                    let beast = st.rng.pick(&fits);
                    break_prey_at(st, c);
                    st.cells[c].inmate.beast = beast;
                }
            }
        }
    }
}

/// Up to 3 different instruments not held, drawn by offer weight.
pub fn offer_tools(st: &mut State, p: &Params) -> ([Tool; 3], usize) {
    let mut w: Vec<f64> = Tool::ALL
        .iter()
        .map(|t| {
            if st.has(*t) {
                0.0
            } else {
                p.offer_weights[*t as usize]
            }
        })
        .collect();
    let mut out = [Tool::Rope; 3];
    let mut n = 0;
    while n < 3 {
        let Some(i) = st.rng.weighted(&w) else { break };
        out[n] = Tool::ALL[i];
        w[i] = 0.0;
        n += 1;
    }
    (out, n)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn board(tools: &[Tool]) -> (State, Params) {
        let p = Params {
            rewards: false,
            event_chance: 0.0,
            ..Params::default()
        };
        let bits = tools.iter().fold(0, |b, t| b | t.bit());
        (new_run(&p, 1, bits, StartCard::None), p)
    }

    fn put(st: &mut State, n: usize, beast: u8, tier: u8) {
        st.cells[n].kind = CellKind::Open;
        st.cells[n].inmate = Inmate { beast, tier };
    }

    #[test]
    fn eats_only_countered_prey_of_its_rarity() {
        let (st, p) = board(&[]);
        let m = |beast, tier| Inmate { beast, tier };
        assert!(can_eat(&st, &p, m(MAMMOTH, 1), m(LION, 1)));
        assert!(!can_eat(&st, &p, m(MAMMOTH, 1), m(LION, 0)));
        assert!(!can_eat(&st, &p, m(LION, 1), m(MAMMOTH, 1)));
        assert!(can_eat(&st, &p, m(RAT, 2), m(MAMMOTH, 2)));
        // Second meals at every rarity by default.
        assert!(can_eat(&st, &p, m(MAMMOTH, 0), m(WOLF, 0)));
        assert!(can_eat(&st, &p, m(LION, 2), m(RAT, 2)));
        assert!(!can_eat(&st, &p, m(MAMMOTH, 2), m(WOLF, 3)));
    }

    #[test]
    fn a_bite_raises_the_eater_and_reseals_the_meal() {
        let (mut st, p) = board(&[]);
        put(&mut st, 2, WOLF, 1);
        put(&mut st, 3, RAT, 1);
        st.warden = 2;
        assert!(bite(
            &mut st,
            &p,
            2,
            Meal {
                cell: 3,
                scratch: false
            },
            false
        ));
        assert_eq!(st.cells[2].inmate.tier, 2);
        assert!(st.cells[3].is_sealed());
    }

    #[test]
    fn tusk_stays_after_a_replace_and_goes_when_the_cell_empties() {
        let (mut st, p) = board(&[Tool::Tongs]);
        put(&mut st, 2, MAMMOTH, 1);
        for n in 3..7 {
            put(&mut st, n, LION, 0);
        }
        st.cells[2].tusk = true;
        st.warden = 2;
        replace(&mut st, &p);
        assert!(st.cells[2].tusk);
        seal(&mut st, &p, 2);
        assert!(!st.cells[2].tusk);
    }

    #[test]
    fn a_triggered_incident_is_replaced_elsewhere() {
        let (mut st, p) = board(&[]);
        put(&mut st, 2, WOLF, 1);
        st.warden = 2;
        let before = (1..CELLS).filter(|&c| st.cells[c].event.is_some()).count();
        incident(&mut st, &p, Incident::TreasureHunt, None);
        let after: Vec<usize> = (1..CELLS)
            .filter(|&c| st.cells[c].event.is_some())
            .collect();
        assert_eq!(after.len(), before + 1);
        assert!(!after.contains(&2));
    }

    #[test]
    fn a_run_starts_with_at_least_one_incident() {
        let p = Params::default();
        for seed in 0..200 {
            let st = new_run(&p, seed, 0, StartCard::None);
            assert!(
                (1..CELLS).any(|c| st.cells[c].event.is_some()),
                "seed {seed}"
            );
        }
    }

    #[test]
    fn extra_portion_raises_three_inmates() {
        let (mut st, mut p) = board(&[]);
        p.incident_respawn = false;
        for n in 2..7 {
            put(&mut st, n, LION, 0);
        }
        st.warden = 2;
        incident(&mut st, &p, Incident::ExtraPortion, None);
        let raised = (2..7).filter(|&n| st.cells[n].inmate.tier == 1).count();
        assert_eq!(raised, 3);
    }

    #[test]
    fn usurpation_stages_follow_in_turn_and_ii_gives_two_tiers_to_one() {
        let (mut st, mut p) = board(&[]);
        p.incident_respawn = false;
        for n in 2..7 {
            put(&mut st, n, LION, 0);
        }
        st.warden = 2;
        incident(&mut st, &p, Incident::Usurpation(1), None);
        assert_eq!(st.usurp_stage, 2);
        // The next incident triggered is II, whatever the "!" held: +2 tiers to one inmate (print 103).
        let before: Vec<u8> = (2..7).map(|n| st.cells[n].inmate.tier).collect();
        incident(&mut st, &p, Incident::ExtraPortion, None);
        let gains: Vec<u8> = (2..7)
            .zip(&before)
            .map(|(n, b)| st.cells[n].inmate.tier - b)
            .collect();
        assert_eq!(gains.iter().filter(|&&g| g != 0).collect::<Vec<_>>(), [&2]);
        assert_eq!(st.usurp_stage, 3);
        // The chain is under way: no Usurpation is drawn any more.
        for _ in 0..200 {
            assert!(!matches!(roll_incident(&mut st), Incident::Usurpation(_)));
        }
    }

    #[test]
    fn skewer_gives_plus_two_extra() {
        let (mut st, p) = board(&[Tool::Skewer]);
        put(&mut st, 2, RAT, 1);
        put(&mut st, 3, RAT, 1);
        st.warden = 2;
        bite(
            &mut st,
            &p,
            2,
            Meal {
                cell: 3,
                scratch: false,
            },
            false,
        );
        assert_eq!(st.cells[2].inmate.tier, 4);
    }

    #[test]
    fn oppress_lowers_the_rise_chance_by_tier_gap() {
        let (_, p) = board(&[]);
        for (gap, want) in [(1u8, 0.95), (2, 0.90), (3, 0.85)] {
            let mut rose = 0;
            let n = 40_000;
            for seed in 0..n {
                let (mut st, _) = board(&[Tool::Guillotine]);
                st.rng = Rng::new(seed);
                put(&mut st, 2, WOLF, 3);
                put(&mut st, 3, RAT, 3 - gap);
                bite(
                    &mut st,
                    &p,
                    2,
                    Meal {
                        cell: 3,
                        scratch: false,
                    },
                    false,
                );
                if st.cells[2].inmate.tier == 4 {
                    rose += 1;
                }
            }
            let got = rose as f64 / n as f64;
            assert!((got - want).abs() < 0.006, "gap {gap}: {got}");
        }
    }

    #[test]
    fn supreme_bite_vaults_a_rainbow_and_empties_the_cell() {
        let (mut st, mut p) = board(&[]);
        p.rewards = true;
        put(&mut st, 5, LION, 4);
        put(&mut st, 6, WOLF, 4);
        st.warden = 5;
        assert!(!bite(
            &mut st,
            &p,
            5,
            Meal {
                cell: 6,
                scratch: false
            },
            false
        ));
        assert_eq!(st.vault, 1);
        assert_eq!(st.pending_treasures, 1);
        assert!(st.cells[5].is_sealed() && st.cells[6].is_sealed());
    }

    /// Treasures pending after a Supreme Lion eats a Supreme Wolf (a Rainbow), for a start card and the flags.
    fn treasures_after_a_rainbow(card: StartCard, rewards: bool, treasures: bool) -> u8 {
        let (_, mut p) = board(&[]);
        p.rewards = rewards;
        p.treasures = treasures;
        let mut st = new_run(&p, 1, 0, card);
        put(&mut st, 5, LION, 4);
        put(&mut st, 6, WOLF, 4);
        st.warden = 5;
        bite(
            &mut st,
            &p,
            5,
            Meal {
                cell: 6,
                scratch: false,
            },
            false,
        );
        assert_eq!(st.vault, 1);
        st.pending_treasures
    }

    #[test]
    fn opulence_gives_three_treasure_picks_a_rainbow() {
        // Opulence: "2 additional choices when obtaining Warden's Treasure" → 3 picks.
        assert_eq!(
            treasures_after_a_rainbow(StartCard::Opulence, true, false),
            3
        );
        assert_eq!(treasures_after_a_rainbow(StartCard::None, true, false), 1);
        // `treasures` alone (the export's start cards): Treasures without the instrument picks.
        assert_eq!(
            treasures_after_a_rainbow(StartCard::Opulence, false, true),
            3
        );
        assert_eq!(
            treasures_after_a_rainbow(StartCard::Tyranny, false, true),
            1
        );
        assert_eq!(
            treasures_after_a_rainbow(StartCard::Opulence, false, false),
            0
        );
    }

    #[test]
    fn replace_and_consume_share_the_day() {
        let (mut st, p) = board(&[]);
        put(&mut st, 2, WOLF, 0);
        st.warden = 2;
        assert!(can_act(&st));
        replace(&mut st, &p);
        assert!(!can_act(&st));
    }

    #[test]
    fn maiden_fires_when_above_equals_below() {
        let (mut st, mut p) = board(&[Tool::Maiden]);
        p.replace_tiers = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0]; // always Magic
        put(&mut st, 2, WOLF, 0);
        put(&mut st, 7, LION, 0);
        put(&mut st, 9, LION, 2);
        st.warden = 2;
        replace(&mut st, &p);
        assert_eq!(st.cells[2].inmate.tier, MAGIC + 3);
        // One more below than above: no bonus.
        let (mut st, _) = board(&[Tool::Maiden]);
        put(&mut st, 2, WOLF, 0);
        put(&mut st, 7, LION, 0);
        put(&mut st, 8, LION, 0);
        put(&mut st, 9, LION, 2);
        st.warden = 2;
        replace(&mut st, &p);
        assert_eq!(st.cells[2].inmate.tier, MAGIC);
    }

    #[test]
    fn destinations_lose_one_per_slowing_instrument() {
        let (mut st, mut p) = board(&[Tool::Whip, Tool::Stake]);
        p.fewer_doors = 0.0;
        assert_eq!(destinations(&mut st, &p).len(), 1);
    }

    #[test]
    fn muzzle_needs_four_or_fewer_after_the_meal() {
        // Eater + 3 others left = 4: +2 extra. Eater + 4 others = 5: none.
        for (others, want) in [(3usize, 1 + 1 + 2), (4, 1 + 1)] {
            let (mut st, p) = board(&[Tool::Muzzle]);
            put(&mut st, 2, WOLF, 1);
            put(&mut st, 3, RAT, 1);
            for k in 0..others {
                put(&mut st, 8 + k, MAMMOTH, 0);
            }
            st.warden = 2;
            bite(
                &mut st,
                &p,
                2,
                Meal {
                    cell: 3,
                    scratch: false,
                },
                false,
            );
            assert_eq!(st.cells[2].inmate.tier, want, "{others} others");
        }
    }

    /// Share of 2,000 bites (Wolf on a Rat, both Magic) that got the Collar's extra tier.
    fn collar_rate(first_bite: bool, chained: bool) -> f64 {
        let (_, mut p) = board(&[]);
        p.collar_first_bite = first_bite;
        let mut extra = 0;
        for seed in 0..2_000 {
            let (mut st, _) = board(&[Tool::Collar]);
            st.rng = Rng::new(seed);
            put(&mut st, 2, WOLF, 1);
            put(&mut st, 3, RAT, 1);
            for k in 0..4 {
                put(&mut st, 8 + k, MAMMOTH, 0); // keeps the Muzzle-free block large
            }
            bite(
                &mut st,
                &p,
                2,
                Meal {
                    cell: 3,
                    scratch: false,
                },
                chained,
            );
            if st.cells[2].inmate.tier == 3 {
                extra += 1;
            }
        }
        extra as f64 / 2_000.0
    }

    #[test]
    fn collar_fires_on_chained_bites_only_by_default() {
        // Chinese live card (print 112): 囚犯連吃時 — "when an Inmate eats in succession", 80%.
        assert_eq!(collar_rate(false, false), 0.0, "first bite");
        assert!(
            (collar_rate(false, true) - 0.8).abs() < 0.03,
            "chained bite"
        );
        // The other reading (every bite, the EN card's "Chain Consumes" taken loosely) stays a parameter.
        assert!(
            (collar_rate(true, false) - 0.8).abs() < 0.03,
            "first bite, collar_first_bite=true"
        );
    }

    #[test]
    fn maiden_fires_only_after_a_replace_unless_any_time() {
        // Live card (print 88): "+3 ... to the Inmate after this Replacement".
        let (mut st, mut p) = board(&[Tool::Maiden]);
        p.maiden_any_time = true;
        put(&mut st, 2, WOLF, 1);
        put(&mut st, 3, RAT, 1);
        put(&mut st, 8, LION, 0);
        put(&mut st, 9, LION, 4);
        st.warden = 2;
        // Wolf rises to Rare: one inmate below (Normal), one above (Supreme) → +3.
        bite(
            &mut st,
            &p,
            2,
            Meal {
                cell: 3,
                scratch: false,
            },
            false,
        );
        assert_eq!(st.vault, 1); // Rare + 3 = Rainbow
        let (mut st, p) = board(&[Tool::Maiden]);
        put(&mut st, 2, WOLF, 1);
        put(&mut st, 3, RAT, 1);
        put(&mut st, 8, LION, 0);
        put(&mut st, 9, LION, 4);
        bite(
            &mut st,
            &p,
            2,
            Meal {
                cell: 3,
                scratch: false,
            },
            false,
        );
        assert_eq!(st.cells[2].inmate.tier, RARE);
    }
}
