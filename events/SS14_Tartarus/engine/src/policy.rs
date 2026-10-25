//! Our player. Decisions in a cell are scored analytically from a board
//! value; patrols, treasures and incidents are scored by playing the step
//! out on copies of the state with the hidden parts re-rolled ("fog"), so
//! the policy never sees behind a door or the game's own dice.

use crate::model::*;
use crate::params::Params;
use crate::rng::Rng;
use crate::rules::{self, Meal};

/// Board value weights. Defaults are a first guess, to be tuned with `eval`.
#[derive(Clone, Debug)]
pub struct Weights {
    /// Worth of an inmate on the block by rarity, Normal..Supreme.
    pub tier: [f64; 5],
    pub rainbow: f64,
    /// Worth of an incident waiting on the ring.
    pub event: f64,
    /// Worth of an unfinished objective's reward, scaled by progress.
    pub objective: f64,
    /// Weight of "the eater may chain on" after a bite.
    pub chain: f64,
    /// Worth of a Tusk cell kept (future Replaces there raise 4 inmates); with
    /// Iron Tongs a Mammoth on the block is worth half of it (it can get the next
    /// Tusk). ALannister's play: never eat a Mammoth early or an inmate on a Tusk.
    pub tusk: f64,
    /// Fogged copies played per patrol option.
    pub samples: u8,
}

impl Default for Weights {
    fn default() -> Self {
        Weights {
            tier: [1.0, 2.5, 6.0, 15.0, 40.0],
            rainbow: 100.0,
            event: 2.0,
            objective: 8.0,
            chain: 0.5,
            tusk: 12.0,
            samples: 6,
        }
    }
}

impl Weights {
    pub fn set(&mut self, kv: &str) -> Result<bool, String> {
        let Some((k, v)) = kv.split_once('=') else {
            return Ok(false);
        };
        let f = || {
            v.parse::<f64>()
                .map_err(|_| format!("--set {k}: `{v}` is not a number"))
        };
        match k {
            "w_tier" => {
                let xs: Result<Vec<f64>, _> = v.split(',').map(str::parse).collect();
                let xs = xs.map_err(|_| format!("--set w_tier: `{v}`"))?;
                if xs.len() != 5 {
                    return Err("--set w_tier: needs 5 numbers".into());
                }
                self.tier.copy_from_slice(&xs);
            }
            "w_rainbow" => self.rainbow = f()?,
            "w_event" => self.event = f()?,
            "w_objective" => self.objective = f()?,
            "w_chain" => self.chain = f()?,
            "w_tusk" => self.tusk = f()?,
            "samples" => self.samples = f()? as u8,
            _ => return Ok(false),
        }
        Ok(true)
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Action {
    Consume(Meal),
    Replace,
    Hunt(usize),
    End,
}

pub struct Greedy<'a> {
    pub w: &'a Weights,
    rng: Rng,
}

impl<'a> Greedy<'a> {
    pub fn new(w: &'a Weights, seed: u64) -> Self {
        Greedy {
            w,
            rng: Rng::new(seed ^ 0xD1B5_4A32_D192_ED03),
        }
    }

    /// Worth of a rarity, with a would-be Rainbow capped by the vault.
    fn worth(&self, st: &State, p: &Params, t: u8) -> f64 {
        if t >= RAINBOW {
            if st.vault < p.rainbow_cap {
                self.w.rainbow
            } else {
                self.w.tier[4]
            }
        } else {
            self.w.tier[t as usize]
        }
    }

    pub fn value(&self, st: &State, p: &Params) -> f64 {
        let mut v = st.vault as f64 * self.w.rainbow;
        for c in st.open_cells() {
            v += self.w.tier[st.cells[c].inmate.tier as usize];
        }
        v += st.cells.iter().filter(|c| c.event.is_some()).count() as f64 * self.w.event;
        v += (1..CELLS).map(|c| self.keep(st, c)).sum::<f64>();
        if !st.objective_done && p.rewards {
            v += self.w.objective * st.objective_progress as f64 / st.objective.need() as f64;
        }
        v
    }

    /// Worth of what a cell holds beyond its inmate's rarity: a Tusk, or a Mammoth
    /// that can take the next one.
    fn keep(&self, st: &State, c: usize) -> f64 {
        if !st.cells[c].is_open() {
            return 0.0;
        }
        let tusk = if st.cells[c].tusk { self.w.tusk } else { 0.0 };
        let mammoth = if st.has(Tool::Tongs) && st.cells[c].inmate.beast == MAMMOTH {
            self.w.tusk / 2.0
        } else {
            0.0
        };
        tusk + mammoth
    }

    /// Expected worth of an unopened door.
    fn door_worth(&self, st: &State, p: &Params) -> f64 {
        let mut d = p.door_tiers;
        if st.has(Tool::Hook) {
            d[0] = 0.0;
        }
        let total: f64 = d.iter().sum();
        d.iter()
            .enumerate()
            .map(|(t, x)| x / total * self.w.tier[t])
            .sum()
    }

    /// The hidden parts re-rolled, and fresh dice: what the player can't know.
    fn fog(&mut self, st: &State, p: &Params) -> State {
        let mut s = *st;
        s.rng = Rng::new(self.rng.next_u64());
        for n in 1..CELLS {
            let c = &mut s.cells[n];
            if c.kind != CellKind::Sealed {
                continue;
            }
            let beast = rules::roll_beast(&mut s.rng, p);
            let tier = if c.revealed {
                c.inmate.tier
            } else {
                rules::roll_tier(&mut s.rng, &p.door_tiers)
            };
            let c = &mut s.cells[n];
            c.inmate = Inmate { beast, tier };
            if !c.event_seen {
                c.event = None;
            }
        }
        s
    }

    /// Expected change in board value from biting `meal` now.
    pub fn bite_value(
        &self,
        st: &State,
        p: &Params,
        from: usize,
        meal: Meal,
        chained: bool,
    ) -> f64 {
        let Some(eater) = st.inmate_at(from) else {
            return f64::NEG_INFINITY;
        };
        let food = st.cells[meal.cell as usize].inmate;
        let block_after = st.open_count() - if meal.scratch { 0 } else { 1 };
        let g = rules::base_gain(st, p, eater, food, meal.scratch, block_after);
        let extras = [
            if st.has(Tool::Saw) { 0.25 } else { 0.0 },
            if st.has(Tool::Whip) { 0.35 } else { 0.0 },
            if st.has(Tool::Collar) && (chained || p.collar_first_bite) {
                0.8
            } else {
                0.0
            },
        ];
        // Severed Iron Maiden checked after the bite: the block without the eater and the meal.
        let maiden = st.has(Tool::Maiden) && p.maiden_any_time;
        let others: Vec<u8> = if maiden {
            st.open_cells()
                .filter(|&c| c != from && c != meal.cell as usize)
                .map(|c| st.cells[c].inmate.tier)
                .collect()
        } else {
            Vec::new()
        };
        let lifted = |t: u8| {
            let above = others.iter().filter(|&&o| o > t).count();
            let below = others.iter().filter(|&&o| o < t).count();
            if maiden && t < RAINBOW && above == below {
                t + 3
            } else {
                t
            }
        };
        let mut after = 0.0;
        for mask in 0..8u8 {
            let mut pr = 1.0;
            let mut k = 0;
            for (i, x) in extras.iter().enumerate() {
                if mask & (1 << i) != 0 {
                    pr *= x;
                    k += 1;
                } else {
                    pr *= 1.0 - x;
                }
            }
            if pr > 0.0 {
                after += pr * self.worth(st, p, lifted(eater.tier + g + k));
            }
        }
        let rise = if meal.scratch {
            1.0
        } else {
            rules::oppress_chance(st, p, eater, food)
        };
        let now = self.w.tier[eater.tier as usize];
        let lost = if meal.scratch {
            0.0
        } else {
            self.w.tier[food.tier as usize] + self.keep(st, meal.cell as usize)
        };
        let mut v = rise * after + (1.0 - rise) * now - now - lost;
        // Chance the new form finds food at its new rarity (beast re-rolls: 1/4 each).
        let t2 = eater.tier + g;
        if t2 < RAINBOW {
            let fed = (0..4u8)
                .filter(|&b| {
                    let as_b = Inmate { beast: b, tier: t2 };
                    st.open_cells().any(|c| {
                        c != from
                            && c != meal.cell as usize
                            && rules::can_eat(st, p, as_b, st.cells[c].inmate)
                    })
                })
                .count() as f64
                / 4.0;
            v += rise * fed * self.w.chain * (self.worth(st, p, t2 + 1) - self.worth(st, p, t2));
        }
        if !meal.scratch && st.has(Tool::Cage) {
            v += 0.4 * self.door_worth(st, p);
        }
        v
    }

    /// Expected change in board value from a Replace now.
    pub fn replace_value(&self, st: &State, p: &Params) -> f64 {
        let n = st.warden as usize;
        let Some(old) = st.inmate_at(n) else {
            return f64::NEG_INFINITY;
        };
        let mut w = p.replace_tiers;
        if st.has(Tool::Rope) {
            w[0] = 0.0;
            w[1] = 0.0;
        }
        let others: Vec<u8> = st
            .open_cells()
            .filter(|&c| c != n)
            .map(|c| st.cells[c].inmate.tier)
            .collect();
        let mut loss = 0.0;
        let scapegoat = st.has(Tool::Scapegoat) && others.len() >= 2;
        if scapegoat {
            loss = 2.0 * others.iter().map(|&t| self.w.tier[t as usize]).sum::<f64>()
                / others.len() as f64;
            for (t, x) in w.iter_mut().enumerate() {
                if t as u8 <= old.tier {
                    *x = 0.0;
                }
            }
            if w.iter().all(|x| *x <= 0.0) {
                w[(old.tier + 1).min(RAINBOW) as usize] = 1.0;
            }
        }
        let total: f64 = w.iter().sum();
        let mut dist: Vec<f64> = w.iter().map(|x| x / total).collect();
        if st.has(Tool::Stake) && old.tier < LEGENDARY {
            for x in dist.iter_mut() {
                *x *= 0.6;
            }
            dist[LEGENDARY as usize] += 0.4;
        }
        let mut v = 0.0;
        for (t, pr) in dist.iter().enumerate() {
            if *pr == 0.0 {
                continue;
            }
            let t = t as u8;
            let mut got = self.worth(st, p, t);
            if st.has(Tool::Maiden) && !scapegoat {
                let above = others.iter().filter(|&&o| o > t).count();
                let below = others.iter().filter(|&&o| o < t).count();
                if above == below {
                    got = self.worth(st, p, t + 3);
                }
            }
            if st.has(Tool::Axe) && t > old.tier {
                got += 2.0 * self.door_worth(st, p);
            }
            v += pr * got;
        }
        if st.cells[n].tusk && !others.is_empty() {
            let lift: f64 = others
                .iter()
                .map(|&t| self.worth(st, p, t + 1) - self.w.tier[t as usize])
                .sum::<f64>()
                / others.len() as f64;
            v += lift * (p.tusk_count as usize).min(others.len() + 1) as f64;
        }
        v - self.w.tier[old.tier as usize] - loss
    }

    fn best_bite(&self, st: &State, p: &Params, from: usize, chained: bool) -> Option<(Meal, f64)> {
        let (list, n) = rules::meals(st, p, from);
        list[..n]
            .iter()
            .map(|&m| (m, self.bite_value(st, p, from, m, chained)))
            .max_by(|a, b| a.1.total_cmp(&b.1))
    }

    pub fn action(&mut self, st: &State, p: &Params) -> Action {
        if !rules::can_act(st) {
            return Action::End;
        }
        let n = st.warden as usize;
        let mut best = (Action::End, 0.0);
        if let Some((m, v)) = self.best_bite(st, p, n, false)
            && v > best.1
        {
            best = (Action::Consume(m), v);
        }
        let r = self.replace_value(st, p);
        if r > best.1 {
            best = (Action::Replace, r);
        }
        if st.has(Tool::Trap)
            && let Some(lion) = st.inmate_at(n).filter(|i| i.beast == LION)
        {
            for q in st.open_cells().filter(|&c| c != n) {
                let prey = st.cells[q].inmate;
                if rules::can_eat(st, p, lion, prey) {
                    let rounds = p.prey_rounds.min(st.max_days.saturating_sub(st.day));
                    let v = (self.worth(st, p, lion.tier + rounds)
                        - self.w.tier[lion.tier as usize])
                        + (self.worth(st, p, prey.tier + rounds) - self.w.tier[prey.tier as usize]);
                    if v * 0.8 > best.1 {
                        best = (Action::Hunt(q), v * 0.8);
                    }
                }
            }
        }
        best.0
    }

    /// The next bite of a chain, or None to stop (the game's Cancel).
    pub fn chain(&mut self, st: &State, p: &Params, from: usize) -> Option<Meal> {
        self.best_bite(st, p, from, true)
            .filter(|(_, v)| *v > 0.0)
            .map(|(m, _)| m)
    }

    /// Instigate (true) or Bestow (false).
    pub fn office(&mut self, st: &State, p: &Params) -> bool {
        let lifts: Vec<f64> = st
            .open_cells()
            .map(|c| {
                let t = st.cells[c].inmate.tier;
                self.worth(st, p, t + 1) - self.w.tier[t as usize]
            })
            .collect();
        if lifts.is_empty() {
            return true;
        }
        let bestow = lifts.iter().sum::<f64>() / lifts.len() as f64;
        p.instigate_count as f64 * self.w.event > bestow
    }

    /// Plays a step out quickly on a fogged copy (no look-ahead inside).
    fn quick_day(&mut self, s: &mut State, p: &Params, ev: Option<Incident>) {
        if let Some(inc) = ev {
            rules::incident(s, p, inc, None);
        }
        if s.warden as usize == OFFICE {
            let inst = self.office(s, p);
            rules::office(s, p, inst);
        } else {
            match self.action(s, p) {
                Action::Consume(m) => {
                    rules::start_consume(s);
                    let from = s.warden as usize;
                    rules::bite(s, p, from, m, false);
                }
                Action::Replace => rules::replace(s, p),
                Action::Hunt(q) => {
                    rules::hunt(s, p, q);
                }
                Action::End => {}
            }
        }
        while s.pending_treasures > 0 {
            s.pending_treasures -= 1;
            rules::treasure(s, p, Treasure::CrimsonVintage);
        }
    }

    pub fn patrol(&mut self, st: &State, p: &Params, dests: &[u8]) -> usize {
        if dests.len() == 1 {
            return dests[0] as usize;
        }
        let k = self.w.samples.max(1);
        let mut best = (dests[0] as usize, f64::NEG_INFINITY);
        for &d in dests {
            let mut total = 0.0;
            for _ in 0..k {
                let mut s = self.fog(st, p);
                let ev = rules::patrol(&mut s, p, d as usize);
                self.quick_day(&mut s, p, ev);
                total += self.value(&s, p);
            }
            let v = total / k as f64;
            if v > best.1 {
                best = (d as usize, v);
            }
        }
        best.0
    }

    pub fn accept_incident(&mut self, st: &State, p: &Params, inc: Incident) -> bool {
        if !p.can_skip_incidents {
            return true;
        }
        let k = self.w.samples.max(1);
        let (mut yes, mut no) = (0.0, 0.0);
        for _ in 0..k {
            let mut s = self.fog(st, p);
            self.quick_day(&mut s, p, Some(inc));
            yes += self.value(&s, p);
            let mut s = self.fog(st, p);
            self.quick_day(&mut s, p, None);
            no += self.value(&s, p);
        }
        yes >= no
    }

    /// Sewer Ratway: the cell to move to.
    pub fn ratway(&mut self, st: &State, p: &Params) -> usize {
        let mut best = (1usize, f64::NEG_INFINITY);
        for c in 1..CELLS {
            let v = match st.cells[c].kind {
                CellKind::Sealed if st.cells[c].revealed => {
                    self.w.tier[st.cells[c].inmate.tier as usize]
                }
                CellKind::Sealed => self.door_worth(st, p),
                CellKind::Open => {
                    let mut s = *st;
                    s.warden = c as u8;
                    let a = self.action(&s, p);
                    match a {
                        Action::Consume(m) => self.bite_value(&s, p, c, m, false),
                        Action::Replace => self.replace_value(&s, p),
                        _ => 0.0,
                    }
                }
                CellKind::Office => continue,
            };
            if v > best.1 {
                best = (c, v);
            }
        }
        best.0
    }

    pub fn treasure(&mut self, st: &State, p: &Params) -> Treasure {
        let k = self.w.samples.max(1);
        let mut best = (Treasure::CrimsonVintage, f64::NEG_INFINITY);
        for t in Treasure::ALL {
            let mut total = 0.0;
            for _ in 0..k {
                let mut s = self.fog(st, p);
                rules::treasure(&mut s, p, t);
                total += self.value(&s, p);
            }
            if total > best.1 {
                best = (t, total);
            }
        }
        best.0
    }

    pub fn tool(&mut self, p: &Params, offer: &[Tool]) -> Tool {
        *offer
            .iter()
            .max_by(|a, b| p.tool_value[**a as usize].total_cmp(&p.tool_value[**b as usize]))
            .unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn eats_around_a_tusk() {
        let p = Params {
            rewards: false,
            event_chance: 0.0,
            incident_respawn: false,
            start_inmates: 0,
            ..Params::default()
        };
        let mut st = rules::new_run(&p, 1, Tool::Tongs.bit(), StartCard::None);
        for (n, beast) in [(2, RAT), (3, MAMMOTH), (4, MAMMOTH)] {
            st.cells[n].kind = CellKind::Open;
            st.cells[n].inmate = Inmate { beast, tier: 1 };
        }
        // On a tie the last meal wins, so the Tusk sits on the later cell.
        st.cells[4].tusk = true;
        let w = Weights::default();
        let pol = Greedy::new(&w, 1);
        let (meal, _) = pol.best_bite(&st, &p, 2, false).unwrap();
        assert_eq!(
            meal.cell, 3,
            "the Rat should eat the Mammoth without the Tusk"
        );
    }
}
