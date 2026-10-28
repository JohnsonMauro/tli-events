//! The simulated player. Potions: the move whose round ends with the best board (one step ahead, the round-end
//! instruments included); a Potion Kit is valued by opening sample kits. Instruments: each offered one is played
//! out to the end of the run `inst_samples` times with that potion rule, best average wins. It never peeks: every
//! look ahead runs on a copy whose dice are re-seeded.

use crate::cards::{Instrument, Potion, Target};
use crate::rules::{LAST_ROUND, POTION_ROUNDS, State};

#[derive(Clone, Copy, Debug)]
pub struct Policy {
    /// Play-outs per offered instrument.
    pub inst_samples: u32,
    /// Sample kits opened to value a Potion Kit, and sample hands to value a refresh.
    pub hand_samples: u32,
    /// Refresh when the sample hands beat the best move by this share of the board.
    pub refresh_margin: f64,
    /// Play-outs per potion move (0 = one step ahead only); only the `potion_top` best one-step moves get them.
    pub potion_samples: u32,
    pub potion_top: usize,
    /// How a move is judged one step ahead: 0 = the board when this round ends; 1 = that board carried to the
    /// end of round 13 by the instruments alone (no more potions), which rewards building what they feed on.
    pub lookahead: u32,
}

impl Default for Policy {
    fn default() -> Self {
        Policy { inst_samples: 8, hand_samples: 4, refresh_margin: 0.05, potion_samples: 0, potion_top: 4, lookahead: 1 }
    }
}

impl Policy {
    pub fn set(&mut self, kv: &str) -> Result<bool, String> {
        let Some((k, v)) = kv.split_once('=') else { return Ok(false) };
        let bad = || format!("--set {kv}: not a number");
        match k {
            "inst_samples" => self.inst_samples = v.parse().map_err(|_| bad())?,
            "hand_samples" => self.hand_samples = v.parse().map_err(|_| bad())?,
            "refresh_margin" => self.refresh_margin = v.parse().map_err(|_| bad())?,
            "potion_samples" => self.potion_samples = v.parse().map_err(|_| bad())?,
            "potion_top" => self.potion_top = v.parse().map_err(|_| bad())?,
            "lookahead" => self.lookahead = v.parse().map_err(|_| bad())?,
            _ => return Ok(false),
        }
        Ok(true)
    }
}

/// A copy of the state with fresh dice: what the player can imagine, not what will happen.
fn imagine(s: &State, salt: u64) -> State {
    let mut c = s.clone();
    let seed = c.rng.next_u64() ^ salt.wrapping_mul(0x9E37_79B9_7F4A_7C15);
    c.rng = crate::rng::Rng::new(seed);
    c
}

/// The potions a kit opens into.
fn open_kit(s: &mut State, kit: Potion, n: usize) -> Vec<Potion> {
    if kit == Potion::KitRare { s.draw_rare_kit(n) } else { s.draw_potions(n, false) }
}

/// The board after this move and the round end (with `lookahead` 1, carried to the end by the instruments).
fn after(s: &State, potion: Potion, targets: &[usize], salt: u64, lookahead: u32) -> f64 {
    let mut c = imagine(s, salt);
    c.play(potion, targets);
    c.end_round();
    if lookahead >= 1 {
        while c.round <= LAST_ROUND {
            c.end_round();
        }
    }
    c.score() as f64
}

/// The best way to play one non-kit potion, and its value.
fn best_targets(s: &State, potion: Potion, lookahead: u32) -> (Vec<usize>, f64) {
    s.targets(potion)
        .into_iter()
        .enumerate()
        .map(|(k, t)| {
            let v = after(s, potion, &t, k as u64 + 1, lookahead);
            (t, v)
        })
        .max_by(|a, b| a.1.total_cmp(&b.1))
        .unwrap_or((vec![], s.score() as f64))
}

impl Policy {
    /// Value of a kit: open sample kits, best move in each, averaged.
    fn kit_value(&self, s: &State, kit: Potion, n: usize) -> f64 {
        let k = self.hand_samples.max(1);
        (0..k)
            .map(|j| {
                let mut c = imagine(s, 1000 + j as u64);
                let opened = open_kit(&mut c, kit, n);
                opened.iter().map(|&p| best_targets(&c, p, self.lookahead).1).fold(f64::MIN, f64::max)
            })
            .sum::<f64>()
            / k as f64
    }

    fn best_in(&self, s: &State, hand: &[Potion]) -> Option<(usize, Vec<usize>, f64)> {
        hand.iter()
            .enumerate()
            .map(|(k, &p)| match p.target() {
                Target::Kit(n) => (k, vec![], self.kit_value(s, p, n)),
                _ => {
                    let (t, v) = best_targets(s, p, self.lookahead);
                    (k, t, v)
                }
            })
            .max_by(|a, b| a.2.total_cmp(&b.2))
    }

    /// Every move of a hand with its one-step value: (card, targets, value); a kit is one move.
    fn moves(&self, s: &State, hand: &[Potion]) -> Vec<(usize, Vec<usize>, f64)> {
        let mut v = Vec::new();
        for (k, &p) in hand.iter().enumerate() {
            match p.target() {
                Target::Kit(n) => v.push((k, vec![], self.kit_value(s, p, n))),
                _ => {
                    for (j, t) in s.targets(p).into_iter().enumerate() {
                        let val = after(s, p, &t, j as u64 + 1, self.lookahead);
                        v.push((k, t, val));
                    }
                }
            }
        }
        v
    }

    /// Plays a move on `s` (a kit opens and its best one-step potion is played).
    fn apply(&self, s: &mut State, p: Potion, targets: &[usize]) {
        if let Target::Kit(n) = p.target() {
            let opened = open_kit(s, p, n);
            if let Some((j, t, _)) = self.best_in(s, &opened) {
                s.play(opened[j], &t);
            }
        } else {
            s.play(p, targets);
        }
    }

    /// The move to play: the best one-step move, or with `potion_samples`, the best average play-out among the
    /// `potion_top` best one-step moves.
    fn choose(&self, s: &State, hand: &[Potion]) -> Option<(usize, Vec<usize>, f64)> {
        let mut moves = self.moves(s, hand);
        moves.sort_by(|a, b| b.2.total_cmp(&a.2));
        if self.potion_samples == 0 || moves.len() < 2 {
            return moves.into_iter().next();
        }
        let n = self.potion_samples;
        let quick = Policy { potion_samples: 0, hand_samples: 0, ..*self };
        moves
            .into_iter()
            .take(self.potion_top.max(1))
            .map(|(k, t, _)| {
                let mean = (0..n)
                    .map(|j| {
                        let mut c = imagine(s, 5000 + j as u64);
                        quick.apply(&mut c, hand[k], &t);
                        let pending = c.end_round();
                        quick.play_out(c, pending) as f64
                    })
                    .sum::<f64>()
                    / n as f64;
                (k, t, mean)
            })
            .max_by(|a, b| a.2.total_cmp(&b.2))
    }

    /// One potion round: refreshes while worth it (judged one step ahead), then plays. Returns every card the
    /// hands showed and the one played (a kit counts as played; what it opened is not recorded).
    pub fn potion_round(&self, s: &mut State) -> (Vec<Potion>, Option<Potion>) {
        let mut hand = s.draw_potions(3, true);
        let mut seen = hand.clone();
        loop {
            let Some((_, _, value)) = self.best_in(s, &hand) else { return (seen, None) };
            if s.potion_refreshes > 0 && self.hand_samples > 0 {
                let samples = self.hand_samples;
                let fresh = (0..samples)
                    .map(|j| {
                        let mut c = imagine(s, 2000 + j as u64);
                        let h = c.draw_potions(3, true);
                        self.best_in(&c, &h).map_or(f64::MIN, |b| b.2)
                    })
                    .sum::<f64>()
                    / samples as f64;
                if fresh > value + self.refresh_margin * (s.score().max(1) as f64) {
                    s.potion_refreshes -= 1;
                    hand = s.draw_potions(3, true);
                    seen.extend_from_slice(&hand);
                    continue;
                }
            }
            let played = self.choose(s, &hand).map(|(k, targets, _)| {
                self.apply(s, hand[k], &targets);
                hand[k]
            });
            return (seen, played);
        }
    }

    /// Plays the rest of the run from `s` (potions by the one-step rule; instruments at random), final score.
    pub fn play_out(&self, mut s: State, mut pending: u32) -> i64 {
        loop {
            while pending > 0 {
                let offer = s.draw_instruments(true);
                if !offer.is_empty() {
                    let pick = offer[s.rng.below(offer.len())];
                    s.take(pick);
                }
                pending -= 1;
            }
            if s.round > LAST_ROUND {
                return s.score();
            }
            if s.round <= POTION_ROUNDS {
                let quick = Policy { hand_samples: 0, potion_samples: 0, ..*self };
                let _ = quick.potion_round(&mut s);
            }
            pending = s.end_round();
        }
    }

    /// The offered instrument with the best average play-out (`pending` = offers still due after this one).
    pub fn pick_instrument(&self, s: &State, offer: &[Instrument], pending: u32) -> Option<Instrument> {
        let n = self.inst_samples.max(1);
        offer
            .iter()
            .map(|&inst| {
                let mean = (0..n)
                    .map(|j| {
                        let mut c = imagine(s, 3000 + j as u64);
                        c.take(inst);
                        self.play_out(c, pending) as f64
                    })
                    .sum::<f64>()
                    / n as f64;
                (inst, mean)
            })
            .max_by(|a, b| a.1.total_cmp(&b.1))
            .map(|(i, _)| i)
    }
}
