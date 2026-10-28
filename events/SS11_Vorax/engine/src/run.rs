//! Whole runs, many at once: one Surgical Preparation from the starting board to the end of round 13.

use rayon::prelude::*;

use crate::cards::{Instrument, Potion};
use crate::params::Params;
use crate::policy::Policy;
use crate::rules::{LAST_ROUND, POTION_ROUNDS, State};

/// What a test fixes; the rest is played by the policy.
#[derive(Clone, Copy, Debug, Default)]
pub struct Setup {
    /// Taken in round 1 instead of the basic offer.
    pub first: Option<Instrument>,
    /// Taken at the first threshold instead of that advanced offer.
    pub second: Option<Instrument>,
}

pub struct Game {
    pub score: i64,
    pub held: Vec<Instrument>,
    /// Every potion card shown in a hand, and every one played.
    pub seen: Vec<Potion>,
    pub played: Vec<Potion>,
}

pub fn play_game(p: Params, pol: &Policy, seed: u64, setup: Setup) -> Game {
    let mut s = State::new(p, seed);
    match setup.first {
        Some(i) => s.take(i),
        None => {
            let offer = s.draw_instruments(false);
            if let Some(i) = pol.pick_instrument(&s, &offer, 0) {
                s.take(i);
            }
        }
    }
    let mut pending = 0;
    let mut advanced_seen = 0;
    let (mut seen, mut played) = (Vec::new(), Vec::new());
    loop {
        while pending > 0 {
            pending -= 1;
            advanced_seen += 1;
            let forced = setup.second.filter(|i| advanced_seen == 1 && !s.holds(*i));
            match forced {
                Some(i) => s.take(i),
                None => {
                    let offer = s.draw_instruments(true);
                    if let Some(i) = pol.pick_instrument(&s, &offer, pending) {
                        s.take(i);
                    }
                }
            }
        }
        if s.round > LAST_ROUND {
            break;
        }
        if s.round <= POTION_ROUNDS {
            let (hand, pick) = pol.potion_round(&mut s);
            seen.extend(hand);
            played.extend(pick);
        }
        pending = s.end_round();
    }
    Game { score: s.score(), held: s.held.iter().map(|h| h.0).collect(), seen, played }
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Summary {
    pub games: u64,
    /// Mean board score at the end of round 13.
    pub mean: f64,
    /// Standard error of the mean.
    pub se: f64,
    pub p10: i64,
    pub median: i64,
    pub p90: i64,
    /// Share of runs whose board reaches `rainbow_board`.
    pub rainbow: f64,
    /// Per potion (Potion::ALL order): times shown in a hand, times played.
    #[serde(skip)]
    pub potions: Vec<(u64, u64)>,
}

pub fn simulate(p: Params, pol: &Policy, games: u64, seed: u64, setup: Setup) -> Summary {
    let idx = |x: &Potion| Potion::ALL.iter().position(|p| p == x).unwrap_or(0);
    let runs: Vec<(i64, Vec<(u64, u64)>)> = (0..games)
        .into_par_iter()
        .map(|g| {
            let game = play_game(p, pol, seed ^ g.wrapping_mul(0xA24B_AED4_963E_E407), setup);
            let mut c = vec![(0u64, 0u64); Potion::ALL.len()];
            for x in &game.seen {
                c[idx(x)].0 += 1;
            }
            for x in &game.played {
                c[idx(x)].1 += 1;
            }
            (game.score, c)
        })
        .collect();
    let mut potions = vec![(0u64, 0u64); Potion::ALL.len()];
    for (_, c) in &runs {
        for (k, (a, b)) in c.iter().enumerate() {
            potions[k].0 += a;
            potions[k].1 += b;
        }
    }
    let mut scores: Vec<i64> = runs.iter().map(|r| r.0).collect();
    scores.sort_unstable();
    let n = scores.len().max(1) as f64;
    let mean = scores.iter().map(|&x| x as f64).sum::<f64>() / n;
    let var = scores.iter().map(|&x| (x as f64 - mean).powi(2)).sum::<f64>() / n;
    let q = |f: f64| scores.get(((scores.len() as f64 - 1.0) * f) as usize).copied().unwrap_or(0);
    Summary {
        games,
        mean,
        se: (var / n).sqrt(),
        p10: q(0.1),
        median: q(0.5),
        p90: q(0.9),
        rainbow: scores.iter().filter(|&&x| x >= p.rainbow_board).count() as f64 / n,
        potions,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn same_seed_same_run() {
        let pol = Policy { inst_samples: 2, ..Policy::default() };
        let a = play_game(Params::default(), &pol, 42, Setup::default());
        let b = play_game(Params::default(), &pol, 42, Setup::default());
        assert_eq!(a.score, b.score);
        assert_eq!(a.held, b.held);
    }

    #[test]
    fn a_run_holds_at_most_three_instruments() {
        let pol = Policy { inst_samples: 1, hand_samples: 1, ..Policy::default() };
        for seed in 0..30 {
            assert!(play_game(Params::default(), &pol, seed, Setup::default()).held.len() <= 3);
        }
    }
}
