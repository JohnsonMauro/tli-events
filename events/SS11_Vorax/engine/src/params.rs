//! Every rule the card texts don't settle, with its default and where it comes from. Change one from the command
//! line with `--set key=value`; when a source settles it, change the default here and in README.md.

use crate::model::Rarity;

#[derive(Clone, Copy, Debug)]
pub struct Params {
    /// Groups on the board when a run starts (inclusive range). Fan simulator (MIT): 3–4.
    pub start_min: usize,
    pub start_max: usize,
    /// Rarity weights of the starting groups, Normal/Magic/Rare/Boss: our count on CN and EN footage (44 groups,
    /// SS13–SS14, runs without Scavengers): 26/12/6/0.
    pub start_w: [f64; 4],
    /// Rarity weights of a group added at random. Not measured; fan simulator (MIT): 30/40/20/10.
    pub rarity_w: [f64; 4],
    /// Draw weight of one potion card by its tier, Normal/Magic/Rare (kits count as Rare): our count of offered
    /// hands per card — CN SS13–SS14 (135 hands) 0.042/0.028/0.014, EN SS14 (89 hands) 0.040/0.027/0.016 — = 3/2/1.
    pub tier_w: [f64; 3],
    /// Rare Potion Kit: "more likely to hold high-rarity potions" (card text); tier weights inside it, not measured.
    pub rare_kit_w: [f64; 3],
    /// Chance that a potion slot draws from the Supreme pool. Fan simulator (MIT): 1%.
    pub supreme_chance: f64,
    /// Ultimate Activity that brings the 2nd and 3rd instrument offer (checked when a round ends).
    pub threshold1: i64,
    pub threshold2: i64,
    pub potion_refreshes: u32,
    /// Instrument refreshes: Intern Shelley Lv 2–3 gives +1, Lv 4–6 +2 (tlidb).
    pub instrument_refreshes: u32,
    /// 1 = reactive instruments (on add / remove / mutate) answer each event when it happens; 0 = they answer the
    /// round's events in one batch when the round ends (the fan simulator's reading).
    pub reactive_now: bool,
    /// "Mutates into a random monster": 1 = random race and random rarity; 0 = random race, rarity kept.
    pub mutate_rerolls_rarity: bool,
    /// Lady of the Plague Quarter, "each rarity: 1 random group awakens": 1 = the four are drawn before any of them
    /// awakens (one awakening per group); 0 = rarity by rarity, so a group just awakened can be drawn again in the
    /// next rarity (the fan simulator's reading: Normal → Boss in one go).
    pub lady_snapshot: bool,
    /// The board score counted as a rainbow run before the battle bonus (community solver's target: 840,000).
    pub rainbow_board: i64,
}

impl Default for Params {
    fn default() -> Self {
        Params {
            start_min: 3,
            start_max: 4,
            start_w: [26.0, 12.0, 6.0, 0.0],
            rarity_w: [30.0, 40.0, 20.0, 10.0],
            tier_w: [3.0, 2.0, 1.0],
            rare_kit_w: [1.0, 2.0, 3.0],
            supreme_chance: 0.01,
            threshold1: 8_000,
            threshold2: 28_000,
            potion_refreshes: 3,
            instrument_refreshes: 2,
            reactive_now: true,
            mutate_rerolls_rarity: true,
            lady_snapshot: true,
            rainbow_board: 840_000,
        }
    }
}

impl Params {
    pub fn rarity_weight(&self, r: Rarity) -> f64 {
        self.rarity_w[r as usize]
    }

    /// `key=value`; booleans take 0/1.
    pub fn set(&mut self, kv: &str) -> Result<(), String> {
        let (k, v) = kv.split_once('=').ok_or_else(|| format!("--set {kv}: expected key=value"))?;
        let f = || v.parse::<f64>().map_err(|_| format!("--set {kv}: not a number"));
        let n = || v.parse::<i64>().map_err(|_| format!("--set {kv}: not an integer"));
        let b = || match v {
            "0" => Ok(false),
            "1" => Ok(true),
            _ => Err(format!("--set {kv}: use 0 or 1")),
        };
        match k {
            "start_min" => self.start_min = n()? as usize,
            "start_max" => self.start_max = n()? as usize,
            "w_normal" => self.rarity_w[0] = f()?,
            "w_magic" => self.rarity_w[1] = f()?,
            "w_rare" => self.rarity_w[2] = f()?,
            "w_boss" => self.rarity_w[3] = f()?,
            "start_normal" => self.start_w[0] = f()?,
            "start_magic" => self.start_w[1] = f()?,
            "start_rare" => self.start_w[2] = f()?,
            "start_boss" => self.start_w[3] = f()?,
            "tier_normal" => self.tier_w[0] = f()?,
            "tier_magic" => self.tier_w[1] = f()?,
            "tier_rare" => self.tier_w[2] = f()?,
            "supreme_chance" => self.supreme_chance = f()?,
            "threshold1" => self.threshold1 = n()?,
            "threshold2" => self.threshold2 = n()?,
            "potion_refreshes" => self.potion_refreshes = n()? as u32,
            "instrument_refreshes" => self.instrument_refreshes = n()? as u32,
            "reactive_now" => self.reactive_now = b()?,
            "mutate_rerolls_rarity" => self.mutate_rerolls_rarity = b()?,
            "rainbow_board" => self.rainbow_board = n()?,
            "lady_snapshot" => self.lady_snapshot = b()?,
            _ => return Err(format!("--set {kv}: unknown key")),
        }
        if self.start_min > self.start_max || self.start_max > crate::model::TANKS {
            return Err(format!("--set {kv}: start_min..start_max must fit 0..=6"));
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_changes_a_rule_and_rejects_unknown_keys() {
        let mut p = Params::default();
        p.set("w_boss=5").unwrap();
        assert_eq!(p.rarity_w[3], 5.0);
        p.set("reactive_now=0").unwrap();
        assert!(!p.reactive_now);
        assert!(p.set("nope=1").is_err());
        assert!(p.set("reactive_now=2").is_err());
        assert!(p.set("start_min=5").is_err());
    }
}
