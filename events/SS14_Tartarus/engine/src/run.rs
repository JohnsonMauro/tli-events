//! One run from setup to the riot, and many runs in parallel.

use rayon::prelude::*;

use crate::model::*;
use crate::params::Params;
use crate::policy::{Action, Greedy, Weights};
use crate::rules;

#[derive(Clone, Copy, Debug)]
pub struct Setup {
    /// Instruments held from day 1 (bitmask of `Tool::bit`).
    pub tools: u64,
    pub start_card: StartCard,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct Outcome {
    pub rainbows: u8,
    /// Supremes left on the block for the riot.
    pub supremes: u8,
    pub stats: Stats,
}

/// Mixes a run index into the batch seed (SplitMix64 step).
pub fn run_seed(base: u64, i: u64) -> u64 {
    let mut z = base ^ i.wrapping_mul(0x9E37_79B9_7F4A_7C15);
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

/// Instrument picks and Warden's Treasures waiting to be chosen.
fn settle(st: &mut State, p: &Params, pol: &mut Greedy) {
    loop {
        if st.pending_tools > 0 {
            st.pending_tools -= 1;
            let (offer, n) = rules::offer_tools(st, p);
            if n > 0 {
                let t = pol.tool(p, &offer[..n]);
                st.tools |= t.bit();
            }
        } else if st.pending_treasures > 0 {
            st.pending_treasures -= 1;
            let t = pol.treasure(st, p);
            rules::treasure(st, p, t);
        } else {
            return;
        }
    }
}

fn resolve_incident(st: &mut State, p: &Params, pol: &mut Greedy, mut ev: Option<Incident>) {
    // Sewer Ratway can land on another incident; cap the cascade.
    for _ in 0..4 {
        let Some(inc) = ev else { return };
        if !pol.accept_incident(st, p, inc) {
            return;
        }
        let to = (inc == Incident::SewerRatway).then(|| pol.ratway(st, p));
        ev = rules::incident(st, p, inc, to);
        settle(st, p, pol);
    }
}

pub fn play(p: &Params, w: &Weights, seed: u64, setup: Setup) -> Outcome {
    let mut st = rules::new_run(p, seed, setup.tools, setup.start_card);
    let mut pol = Greedy::new(w, seed);
    settle(&mut st, p, &mut pol);
    while st.day <= st.max_days {
        rules::start_day(&mut st, p);
        settle(&mut st, p, &mut pol);
        let dests = rules::destinations(&mut st, p);
        let d = pol.patrol(&st, p, dests.as_slice());
        let ev = rules::patrol(&mut st, p, d);
        settle(&mut st, p, &mut pol);
        resolve_incident(&mut st, p, &mut pol, ev);
        if st.warden as usize == OFFICE {
            let inst = pol.office(&st, p);
            rules::office(&mut st, p, inst);
        } else {
            match pol.action(&st, p) {
                Action::Consume(m) => {
                    rules::start_consume(&mut st);
                    let from = st.warden as usize;
                    let mut meal = Some(m);
                    let mut chained = false;
                    while let Some(m) = meal {
                        let stays = rules::bite(&mut st, p, from, m, chained);
                        settle(&mut st, p, &mut pol);
                        chained = true;
                        meal = if stays { pol.chain(&st, p, from) } else { None };
                    }
                }
                Action::Replace => rules::replace(&mut st, p),
                Action::Hunt(q) => {
                    rules::hunt(&mut st, p, q);
                }
                Action::End => {}
            }
        }
        settle(&mut st, p, &mut pol);
        st.day += 1;
    }
    let supremes = st
        .open_cells()
        .filter(|&c| st.cells[c].inmate.tier == SUPREME)
        .count() as u8;
    Outcome {
        rainbows: st.vault,
        supremes,
        stats: st.stats,
    }
}

#[derive(Clone, Debug, Default)]
pub struct Summary {
    pub games: u64,
    pub sum: f64,
    pub sum_sq: f64,
    /// Runs by Rainbows vaulted (index = count, 0..=30).
    pub hist: Vec<u64>,
    pub supremes: f64,
    pub consumes: f64,
    pub bites: f64,
    pub replaces: f64,
    pub opened: f64,
}

impl Summary {
    fn add(mut self, o: &Outcome) -> Self {
        if self.hist.is_empty() {
            self.hist = vec![0; 31];
        }
        let r = o.rainbows as f64;
        self.games += 1;
        self.sum += r;
        self.sum_sq += r * r;
        self.hist[o.rainbows as usize] += 1;
        self.supremes += o.supremes as f64;
        self.consumes += o.stats.consumes as f64;
        self.bites += o.stats.bites as f64;
        self.replaces += o.stats.replaces as f64;
        self.opened += o.stats.opened as f64;
        self
    }

    fn merge(mut self, o: Summary) -> Self {
        if self.hist.is_empty() {
            return o;
        }
        if o.hist.is_empty() {
            return self;
        }
        self.games += o.games;
        self.sum += o.sum;
        self.sum_sq += o.sum_sq;
        for (a, b) in self.hist.iter_mut().zip(o.hist) {
            *a += b;
        }
        self.supremes += o.supremes;
        self.consumes += o.consumes;
        self.bites += o.bites;
        self.replaces += o.replaces;
        self.opened += o.opened;
        self
    }

    pub fn mean(&self) -> f64 {
        self.sum / self.games.max(1) as f64
    }

    /// Standard error of the mean.
    pub fn se(&self) -> f64 {
        let n = self.games.max(2) as f64;
        let var = (self.sum_sq - self.sum * self.sum / n) / (n - 1.0);
        (var.max(0.0) / n).sqrt()
    }

    pub fn median(&self) -> usize {
        let half = self.games.div_ceil(2);
        let mut acc = 0;
        for (k, n) in self.hist.iter().enumerate() {
            acc += n;
            if acc >= half {
                return k;
            }
        }
        0
    }

    pub fn per_run(&self, x: f64) -> f64 {
        x / self.games.max(1) as f64
    }
}

/// `games` runs on every core. Deterministic for a seed, whatever the thread count.
pub fn simulate(p: &Params, w: &Weights, games: u64, seed: u64, setup: Setup) -> Summary {
    (0..games)
        .into_par_iter()
        .fold(Summary::default, |s, i| {
            s.add(&play(p, w, run_seed(seed, i), setup))
        })
        .reduce(Summary::default, Summary::merge)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn same_seed_same_summary() {
        let p = Params::default();
        let w = Weights::default();
        let setup = Setup {
            tools: 0,
            start_card: StartCard::None,
        };
        let a = simulate(&p, &w, 300, 42, setup);
        let b = simulate(&p, &w, 300, 42, setup);
        assert_eq!(a.sum, b.sum);
        assert_eq!(a.hist, b.hist);
    }

    #[test]
    fn a_run_ends_with_a_sane_board() {
        let p = Params::default();
        let w = Weights::default();
        for seed in 0..200 {
            let o = play(
                &p,
                &w,
                seed,
                Setup {
                    tools: 0,
                    start_card: StartCard::None,
                },
            );
            assert!(o.rainbows <= p.rainbow_cap);
            assert!((o.supremes as usize) < CELLS);
        }
    }
}
