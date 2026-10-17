//! Rule values. Defaults are the live measurements where we have them
//! (`data/tartarus_data.json` → `live`, refreshed every 6 h) and the card
//! text otherwise. Rules no source settles yet are parameters too, so a new
//! print changes a value, not the code (see README.md → "Open rules").

use serde_json::Value;

use crate::model::Tool;

#[derive(Clone, Debug)]
pub struct Params {
    pub days: u8,
    /// Doors offered each morning, before the instruments that take one away.
    pub destinations: u8,
    /// Destinations come from this many cells clockwise ahead of the warden.
    pub patrol_range: u8,
    /// Chance a morning offers one door fewer (live 16.9%, n=8,592).
    pub fewer_doors: f64,
    /// Rarity odds behind a door, Normal..Supreme (live n=7,191).
    pub door_tiers: [f64; 5],
    /// Rarity odds for a Replace, Normal..Rainbow (live n=696; 0.3% Rainbow).
    pub replace_tiers: [f64; 6],
    /// Beast odds for any new inmate (live doors).
    pub beasts: [f64; 4],
    /// Chance a sealed cell hides an incident (live: 6.4% of day-1 doors).
    pub event_chance: f64,
    /// Incidents added by Instigate (in-game rules: 1).
    pub instigate_count: u8,
    /// Incident cards have only Confirm on live; true lets the policy skip.
    pub can_skip_incidents: bool,
    /// From this rarity up Mammoths also eat Wolves and Lions eat Rats.
    /// Open: the rules diagram and tlidb "Counter" draw them at every rarity,
    /// live boards suggested Legendary+ (guide §4). 0 = always, 5 = never.
    pub second_meal_from: u8,
    /// Most Rainbows a run can vault (rules: a limit exists; ~10 seen live).
    pub rainbow_cap: u8,
    /// Lost Ring of Keys: card 80%, live 62.8% (n=199).
    pub keys_chance: f64,
    /// Agonizing Muzzle: most inmates left on the block (VOD card print 34: "no more
    /// than 3 inmates on the board, after Devouring"; community sim 4).
    pub muzzle_max: u8,
    /// Severed Iron Maiden: the live card (print 73) names no trigger, only the
    /// state ("Higher-Tier and Lower-Tier Inmates are equal"). true = checked
    /// whenever the warden's inmate changes (door, Replace, bite); false = after a
    /// Replace only (community sim).
    pub maiden_any_time: bool,
    /// Skewered Rat Heads extra tiers (live card print 78: +2).
    pub skewer_extra: u8,
    /// Oppress (Fanged Guillotine, tlidb): base rise chance and the loss per tier of gap.
    pub oppress_base: f64,
    pub oppress_step: f64,
    /// Scratch Marks extra tiers (tlidb: +2 on top of the bite's +1).
    pub scratch_extra: u8,
    /// Barbed Collar (live card print 72: "When an Inmate Chain Consumes"): true =
    /// every bite of a consume, false = bites after the first (community sim).
    pub collar_first_bite: bool,
    /// Execution takes lower-rarity prey (card); true = same rarity too.
    pub execution_same_tier: bool,
    pub prey_rounds: u8,
    pub nest_days: u8,
    pub tusk_count: u8,
    /// Tusk stays on the cell after the Replace it fires on, until the cell
    /// empties (tlidb: it goes "when there is no Inmate in this room"; content
    /// creator ALannister, 2026-10-17: it only clears when the inmate is eaten
    /// or reaches Chromatic).
    pub tusk_persists: bool,
    /// Run rewards: a start pick, the objective's pick, a Warden's Treasure per Rainbow.
    pub rewards: bool,
    pub start_picks: u8,
    /// Weight of each instrument in an offer (live offer counts + 1, by `Tool as usize`).
    pub offer_weights: Vec<f64>,
    /// Policy's ranking of instruments (Rainbows/run held alone; higher = better).
    pub tool_value: Vec<f64>,
}

impl Default for Params {
    fn default() -> Self {
        let n = Tool::ALL.len();
        Params {
            days: 20,
            destinations: 3,
            patrol_range: 6,
            fewer_doors: 0.1686,
            door_tiers: [41.76, 35.91, 11.39, 9.15, 1.79],
            replace_tiers: [42.24, 33.33, 14.51, 7.33, 2.30, 0.29],
            beasts: [24.11, 23.21, 26.30, 26.38],
            event_chance: 0.064,
            instigate_count: 1,
            can_skip_incidents: false,
            second_meal_from: 3,
            rainbow_cap: 10,
            keys_chance: 0.628,
            muzzle_max: 3,
            maiden_any_time: true,
            skewer_extra: 2,
            oppress_base: 1.0,
            oppress_step: 0.05,
            scratch_extra: 2,
            collar_first_bite: true,
            execution_same_tier: false,
            prey_rounds: 3,
            nest_days: 2,
            tusk_count: 4,
            tusk_persists: true,
            rewards: true,
            start_picks: 1,
            offer_weights: vec![1.0; n],
            tool_value: vec![1.0; n],
        }
    }
}

fn num(v: &Value, path: &[&str]) -> Option<f64> {
    path.iter().try_fold(v, |v, k| v.get(*k))?.as_f64()
}

impl Params {
    /// Defaults, then the live odds and instrument data from `tartarus_data.json`.
    pub fn from_data(json: &str) -> Result<Params, String> {
        let v: Value =
            serde_json::from_str(json).map_err(|e| format!("tartarus_data.json: {e}"))?;
        let mut p = Params::default();
        let live = v.get("live").ok_or("tartarus_data.json: no `live`")?;
        for (i, t) in ["Normal", "Magic", "Rare", "Legendary", "Supreme"]
            .iter()
            .enumerate()
        {
            if let Some(x) = num(live, &["doorTiers", "share", t]) {
                p.door_tiers[i] = x * 100.0;
            }
        }
        for (i, t) in ["Normal", "Magic", "Rare", "Legendary", "Supreme", "Rainbow"]
            .iter()
            .enumerate()
        {
            if let Some(x) = num(live, &["replaceTiers", "share", t]) {
                p.replace_tiers[i] = x * 100.0;
            }
        }
        for (i, b) in ["Mammoth", "Lion", "Wolf", "Rat"].iter().enumerate() {
            if let Some(x) = num(live, &["doorBeasts", "share", b]) {
                p.beasts[i] = x * 100.0;
            }
        }
        if let Some(x) = num(live, &["keyRing", "share"]) {
            p.keys_chance = x;
        }
        if let Some(x) = num(live, &["eventDoorsDay1", "share"]) {
            p.event_chance = x;
        }
        if let Some(x) = num(live, &["fewerDoorMornings", "share"]) {
            p.fewer_doors = x;
        }
        for t in Tool::ALL {
            let i = *t as usize;
            // +1 so an instrument never seen in an offer can still show up.
            p.offer_weights[i] = num(live, &["toolOffers", "counts", t.id()]).unwrap_or(0.0) + 1.0;
            if let Some(x) = num(&v, &["tools", t.id(), "value"]) {
                p.tool_value[i] = x;
            }
        }
        Ok(p)
    }

    /// `key=value` override from the command line.
    pub fn set(&mut self, kv: &str) -> Result<(), String> {
        let (k, val) = kv
            .split_once('=')
            .ok_or_else(|| format!("--set {kv}: expected key=value"))?;
        let f = || {
            val.parse::<f64>()
                .map_err(|_| format!("--set {k}: `{val}` is not a number"))
        };
        let b = || match val {
            "true" | "on" | "1" => Ok(true),
            "false" | "off" | "0" => Ok(false),
            _ => Err(format!("--set {k}: `{val}` is not true/false")),
        };
        let list = |n: usize| -> Result<Vec<f64>, String> {
            let xs: Result<Vec<f64>, _> = val.split(',').map(str::parse::<f64>).collect();
            let xs = xs.map_err(|_| format!("--set {k}: `{val}` is not a list of numbers"))?;
            if xs.len() == n {
                Ok(xs)
            } else {
                Err(format!("--set {k}: needs {n} numbers"))
            }
        };
        match k {
            "days" => self.days = f()? as u8,
            "destinations" => self.destinations = f()? as u8,
            "patrol_range" => self.patrol_range = f()? as u8,
            "fewer_doors" => self.fewer_doors = f()?,
            "door_tiers" => self.door_tiers.copy_from_slice(&list(5)?),
            "replace_tiers" => self.replace_tiers.copy_from_slice(&list(6)?),
            "beasts" => self.beasts.copy_from_slice(&list(4)?),
            "event_chance" => self.event_chance = f()?,
            "instigate_count" => self.instigate_count = f()? as u8,
            "can_skip_incidents" => self.can_skip_incidents = b()?,
            "second_meal_from" => self.second_meal_from = f()? as u8,
            "rainbow_cap" => self.rainbow_cap = f()? as u8,
            "keys_chance" => self.keys_chance = f()?,
            "muzzle_max" => self.muzzle_max = f()? as u8,
            "maiden_any_time" => self.maiden_any_time = b()?,
            "skewer_extra" => self.skewer_extra = f()? as u8,
            "oppress_base" => self.oppress_base = f()?,
            "oppress_step" => self.oppress_step = f()?,
            "scratch_extra" => self.scratch_extra = f()? as u8,
            "collar_first_bite" => self.collar_first_bite = b()?,
            "execution_same_tier" => self.execution_same_tier = b()?,
            "prey_rounds" => self.prey_rounds = f()? as u8,
            "nest_days" => self.nest_days = f()? as u8,
            "tusk_count" => self.tusk_count = f()? as u8,
            "tusk_persists" => self.tusk_persists = b()?,
            "rewards" => self.rewards = b()?,
            "start_picks" => self.start_picks = f()? as u8,
            _ => return Err(format!("--set: unknown key `{k}`")),
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_live_odds_from_the_data_file() {
        let json = r#"{"live":{"doorTiers":{"share":{"Normal":0.5,"Magic":0.5}},"keyRing":{"share":0.6},
            "toolOffers":{"counts":{"rope":8}}},"tools":{"rope":{"value":2.2}}}"#;
        let p = Params::from_data(json).unwrap();
        assert_eq!(p.door_tiers[0], 50.0);
        assert_eq!(p.keys_chance, 0.6);
        assert_eq!(p.offer_weights[Tool::Rope as usize], 9.0);
        assert_eq!(p.offer_weights[Tool::Crown as usize], 1.0);
        assert_eq!(p.tool_value[Tool::Rope as usize], 2.2);
    }

    #[test]
    fn set_rejects_unknown_keys_and_bad_values() {
        let mut p = Params::default();
        assert!(p.set("oppress_step=0.1").is_ok());
        assert_eq!(p.oppress_step, 0.1);
        assert!(p.set("nope=1").is_err());
        assert!(p.set("muzzle_max=x").is_err());
        assert!(p.set("beasts=1,2").is_err());
    }
}
