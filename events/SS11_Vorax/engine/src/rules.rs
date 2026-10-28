//! The rules: board operations, what each potion and instrument does, and how a round ends.
//! Each effect follows its card text (cards.rs); where the text leaves a choice open, params.rs names it.

use crate::cards::{Instrument, Potion, Target, Tier};
use crate::model::{Arch, Board, Event, Monster, Rarity, TANKS, count, filled, score};
use crate::params::Params;
use crate::rng::Rng;

pub const POTION_ROUNDS: u32 = 10;
pub const LAST_ROUND: u32 = 13;
/// How deep instruments may answer each other's events in one chain (Vermicular Cord → Sprout → …).
const MAX_DEPTH: u32 = 6;

#[derive(Clone, Debug)]
pub struct State {
    pub board: Board,
    pub round: u32,
    /// Instruments held, with the round each one was taken (periodic ones count from it).
    pub held: Vec<(Instrument, u32)>,
    pub potion_refreshes: u32,
    pub instrument_refreshes: u32,
    pub passed1: bool,
    pub passed2: bool,
    pub p: Params,
    pub rng: Rng,
    /// Events waiting for the round end (only when `p.reactive_now` is off).
    queue: Vec<Event>,
    depth: u32,
}

impl State {
    /// A new run: `start_min..=start_max` random groups in the leftmost tanks.
    pub fn new(p: Params, seed: u64) -> State {
        let mut s = State {
            board: [None; TANKS],
            round: 1,
            held: Vec::new(),
            potion_refreshes: p.potion_refreshes,
            instrument_refreshes: p.instrument_refreshes,
            passed1: false,
            passed2: false,
            p,
            rng: Rng::new(seed),
            queue: Vec::new(),
            depth: 0,
        };
        let n = p.start_min + s.rng.below(p.start_max - p.start_min + 1);
        for i in 0..n {
            let a = s.rand_arch();
            let r = Rarity::ALL[s.rng.weighted(&p.start_w).unwrap_or(0)];
            s.board[i] = Some(Monster::new(a, r));
        }
        s
    }

    pub fn score(&self) -> i64 {
        score(&self.board)
    }

    pub fn holds(&self, i: Instrument) -> bool {
        self.held.iter().any(|(h, _)| *h == i)
    }

    fn n_arch(&self, a: Arch) -> usize {
        count(&self.board, |m| m.arch == a)
    }

    // ---- randomness ----

    pub fn rand_arch(&mut self) -> Arch {
        self.rng.pick(&Arch::ALL)
    }

    pub fn rand_rarity(&mut self) -> Rarity {
        let w = self.p.rarity_w;
        Rarity::ALL[self.rng.weighted(&w).unwrap_or(0)]
    }

    /// Up to `k` distinct tanks among `from`, in random order.
    fn sample(&mut self, from: &[usize], k: usize) -> Vec<usize> {
        let mut v = from.to_vec();
        let k = k.min(v.len());
        for i in 0..k {
            let j = i + self.rng.below(v.len() - i);
            v.swap(i, j);
        }
        v.truncate(k);
        v
    }

    fn one_of(&mut self, from: &[usize]) -> Option<usize> {
        (!from.is_empty()).then(|| self.rng.pick(from))
    }

    fn tanks_where(&self, f: impl Fn(&Monster) -> bool) -> Vec<usize> {
        (0..TANKS).filter(|&i| self.board[i].as_ref().is_some_and(&f)).collect()
    }

    fn highest(&self) -> Option<usize> {
        filled(&self.board).into_iter().max_by_key(|&i| (self.m(i).total(), std::cmp::Reverse(i)))
    }

    fn lowest(&self, f: impl Fn(&Monster) -> bool) -> Option<usize> {
        self.tanks_where(f).into_iter().min_by_key(|&i| (self.m(i).total(), i))
    }

    fn m(&self, i: usize) -> &Monster {
        self.board[i].as_ref().expect("tank holds a monster")
    }

    fn mm(&mut self, i: usize) -> &mut Monster {
        self.board[i].as_mut().expect("tank holds a monster")
    }

    fn boost(&mut self, i: usize, act: i64, qty: i64) {
        let m = self.mm(i);
        m.act += act;
        m.qty += qty;
    }

    fn boost_all(&mut self, f: impl Fn(&Monster) -> bool, act: i64, qty: i64) {
        for i in self.tanks_where(f) {
            self.boost(i, act, qty);
        }
    }

    // ---- board operations; each one reports its event ----

    /// Into the leftmost empty tank; every tank full = Overflow, nothing added.
    pub fn add(&mut self, arch: Arch, rarity: Rarity, act: i64, qty: i64) -> Option<usize> {
        let Some(i) = (0..TANKS).find(|&i| self.board[i].is_none()) else {
            self.emit(Event::Overflow);
            return None;
        };
        let mut m = Monster::new(arch, rarity);
        m.act += act;
        m.qty += qty;
        self.board[i] = Some(m);
        self.emit(Event::Add { tank: i });
        Some(i)
    }

    fn add_random(&mut self, act: i64, qty: i64) -> Option<usize> {
        let (a, r) = (self.rand_arch(), self.rand_rarity());
        self.add(a, r, act, qty)
    }

    pub fn remove(&mut self, i: usize) -> Option<Monster> {
        let m = self.board[i].take()?;
        self.emit(Event::Remove { arch: m.arch, rarity: m.rarity });
        Some(m)
    }

    /// Changes race (random when `None`) and, per `mutate_rerolls_rarity`, rarity; Activity and Quantity stay.
    fn mutate(&mut self, i: usize, arch: Option<Arch>, rarity: Option<Rarity>) {
        if self.board[i].is_none() {
            return;
        }
        let a = arch.unwrap_or_else(|| self.rand_arch());
        let r = match rarity {
            Some(r) => r,
            None if self.p.mutate_rerolls_rarity => self.rand_rarity(),
            None => self.m(i).rarity,
        };
        let m = self.mm(i);
        m.arch = a;
        m.rarity = r;
        self.emit(Event::Mutate { tank: i, to: a });
    }

    /// Up to `to` (one tier when `None`; Boss stays Boss) with the awaken Activity bonus of the new rarity.
    fn awaken(&mut self, i: usize, to: Option<Rarity>) {
        if self.board[i].is_none() {
            return;
        }
        let r = to.unwrap_or_else(|| self.m(i).rarity.up());
        let m = self.mm(i);
        m.rarity = r;
        m.act += r.awaken_bonus();
        self.emit(Event::Awaken { tank: i });
    }

    /// The groups leave (each a Remove) and come back as one with their Activity and Quantity summed (an Add).
    fn fuse(&mut self, tanks: &[usize], arch: Arch, rarity: Rarity) -> Option<usize> {
        let (mut act, mut qty) = (0, 0);
        for &i in tanks {
            if let Some(m) = self.remove(i) {
                act += m.act;
                qty += m.qty;
            }
        }
        let (ba, bq) = rarity.base();
        self.add(arch, rarity, act - ba, qty - bq)
    }

    fn devour(&mut self, eater: usize, prey: usize) {
        if let Some(m) = self.remove(prey) {
            self.boost(eater, m.act, m.qty);
        }
    }

    fn emit(&mut self, e: Event) {
        if !self.p.reactive_now {
            self.queue.push(e);
            return;
        }
        if self.depth >= MAX_DEPTH {
            return;
        }
        self.depth += 1;
        self.react(e);
        self.depth -= 1;
    }

    // ---- potions ----

    /// Plays a potion on `targets` (tank indices, as its Target allows). Kits are opened by the caller.
    pub fn play(&mut self, potion: Potion, targets: &[usize]) {
        use Potion::*;
        let t0 = targets.first().copied().filter(|&i| self.board[i].is_some());
        match potion {
            ProbioticMold => {
                let x = self.n_arch(Arch::Pest) as i64;
                self.boost_all(|m| m.arch == Arch::Pest, 11 * x, 0);
            }
            Slough => {
                let ts: Vec<usize> = targets.iter().copied().filter(|&i| self.board[i].is_some()).collect();
                if let Some(r) = ts.iter().map(|&i| self.m(i).rarity).max() {
                    self.fuse(&ts, Arch::Pest, r);
                }
            }
            PiaMater => {
                if let Some(i) = t0 {
                    let m = *self.m(i);
                    let times = match (m.arch, m.rarity) {
                        (Arch::Agito, Rarity::Magic) => 2,
                        (Arch::Agito, Rarity::Rare | Rarity::Boss) => 3,
                        _ => 1,
                    };
                    self.boost(i, 30 * times, 0);
                }
            }
            Osteolytic => {
                if self.n_arch(Arch::BoneSentry) > 0 {
                    let others = self.tanks_where(|m| m.arch != Arch::BoneSentry);
                    let gone = self.sample(&others, 3);
                    for i in &gone {
                        self.remove(*i);
                    }
                    let n = gone.len() as i64;
                    self.boost_all(|_| true, 28 * n, 28 * n);
                }
            }
            Debriding => {
                if let Some(i) = t0 {
                    self.boost(i, 20, 0);
                    if self.m(i).arch == Arch::BoneSentry {
                        self.boost(i, 0, 41);
                        if i + 1 < TANKS {
                            self.remove(i + 1);
                        }
                    }
                }
            }
            FreshSpinal => {
                let others = self.tanks_where(|m| m.arch != Arch::Aemberon);
                for i in self.sample(&others, 3) {
                    self.mutate(i, Some(Arch::Aemberon), Some(self.m(i).rarity));
                    let aem = self.tanks_where(|m| m.arch == Arch::Aemberon);
                    for j in self.sample(&aem, 3) {
                        self.boost(j, 0, 42);
                    }
                }
            }
            PetrifiedSpinal => {
                if let Some(i) = t0 {
                    self.boost(i, 20, 0);
                    if self.m(i).arch != Arch::Aemberon {
                        let r = self.m(i).rarity;
                        self.mutate(i, Some(Arch::Aemberon), Some(r));
                        self.boost(i, 30, 0);
                    }
                }
            }
            BroodHormone => {
                let n = if self.rng.chance(0.5) { 3 } else { 1 };
                for _ in 0..n {
                    let r = self.rand_rarity();
                    self.add(Arch::Pest, r, 0, 0);
                }
            }
            Eggshell => {
                let all = filled(&self.board);
                if let Some(i) = self.one_of(&all) {
                    self.boost(i, 0, 25);
                    let m = *self.m(i);
                    if m.arch == Arch::Pest {
                        self.add(Arch::Pest, m.rarity, 0, 25);
                    }
                }
            }
            BrainFog => {
                let all = filled(&self.board);
                if let Some(i) = self.one_of(&all) {
                    self.boost(i, 41, 0);
                    let m = *self.m(i);
                    if m.arch == Arch::Agito && m.rarity < Rarity::Rare {
                        self.awaken(i, Some(Rarity::Rare));
                    }
                }
            }
            Osteogenic => {
                let all = filled(&self.board);
                if let Some(i) = self.one_of(&all) {
                    self.boost(i, 0, 40);
                    if self.m(i).arch == Arch::BoneSentry {
                        self.boost(i, 0, 127);
                        let others = self.tanks_where(|m| m.arch != Arch::BoneSentry);
                        if let Some(j) = self.one_of(&others) {
                            self.remove(j);
                        }
                    }
                }
            }
            GrayMatter => {
                let all = filled(&self.board);
                if let Some(i) = self.one_of(&all) {
                    self.boost(i, 41, 0);
                    self.mutate(i, None, None);
                    if self.rng.chance(0.5) {
                        self.mutate(i, Some(Arch::Aemberon), None);
                        self.boost(i, 30, 0);
                    }
                }
            }
            HollowSpinal => {
                if let Some(i) = t0 {
                    self.boost(i, 41, 0);
                    if self.rng.chance(0.5) {
                        self.mutate(i, Some(Arch::Aemberon), None);
                    }
                }
            }
            GreenBile => {
                for &i in targets.iter().take(2) {
                    if self.board[i].is_some() {
                        self.mutate(i, None, Some(Rarity::Magic));
                        self.boost(i, 31, 0);
                    }
                }
            }
            MixedLeech => {
                if let Some(i) = t0 {
                    let r = self.m(i).rarity;
                    let same = self.tanks_where(|m| m.rarity == r);
                    for j in self.sample(&same, 2) {
                        self.boost(j, 31, 0);
                    }
                }
            }
            DigestiveEnzyme => {
                if let Some(i) = t0 {
                    self.boost(i, 61, 0);
                    if i > 0 {
                        self.remove(i - 1);
                    }
                }
            }
            Vivigenic => {
                for r in Rarity::ALL {
                    let of = self.tanks_where(|m| m.rarity == r);
                    if let Some(i) = self.one_of(&of) {
                        self.boost(i, 0, 32);
                    }
                }
            }
            PotentXenopurge | Xenopurge => {
                if let Some(i) = t0 {
                    let (qty, n) = if potion == PotentXenopurge { (154, 2) } else { (127, 1) };
                    self.boost(i, 0, qty);
                    let a = self.m(i).arch;
                    let others = self.tanks_where(|m| m.arch != a);
                    for j in self.sample(&others, n) {
                        self.remove(j);
                    }
                }
            }
            PureLeech => {
                if let Some(i) = t0 {
                    let a = self.m(i).arch;
                    let same = self.tanks_where(|m| m.arch == a);
                    for j in self.sample(&same, 2) {
                        self.boost(j, 31, 0);
                    }
                }
            }
            Bewitching => {
                if let Some(i) = t0 {
                    self.awaken(i, None);
                }
            }
            Mutagenic => {
                for &i in targets.iter().take(2) {
                    if self.board[i].is_some() {
                        self.boost(i, 0, 52);
                        self.mutate(i, None, Some(Rarity::Rare));
                    }
                }
            }
            ViscousBile => {
                if let Some(i) = t0
                    && i + 1 < TANKS
                    && self.board[i + 1].is_some()
                {
                    let m = *self.m(i);
                    self.mutate(i + 1, Some(m.arch), Some(m.rarity));
                    self.boost(i, 31, 0);
                    self.boost(i + 1, 31, 0);
                }
            }
            SlimLimbPest => {
                let r = self.rand_rarity();
                self.add(Arch::Pest, r, 0, 73);
            }
            TwinPest => {
                if let Some(i) = t0 {
                    let r = self.m(i).rarity;
                    self.mutate(i, Some(Arch::Pest), Some(r));
                    self.add(Arch::Pest, r, 0, 0);
                }
            }
            SpinalAgito => {
                let r = self.rand_rarity();
                self.add(Arch::Agito, r, 31, 0);
            }
            AnestheticAgito => {
                if let Some(i) = t0 {
                    let r = self.m(i).rarity;
                    self.mutate(i, Some(Arch::Agito), Some(r));
                    if r < Rarity::Magic {
                        self.awaken(i, Some(Rarity::Magic));
                    }
                }
            }
            SlimLimbBone => {
                let r = self.rand_rarity();
                self.add(Arch::BoneSentry, r, 0, 73);
            }
            TwinBone => {
                if let Some(i) = t0 {
                    let r = self.m(i).rarity;
                    self.mutate(i, Some(Arch::BoneSentry), Some(r));
                    self.boost(i, 0, 62);
                }
            }
            AnestheticAemberon => {
                if let Some(i) = t0 {
                    let r = self.m(i).rarity;
                    self.mutate(i, Some(Arch::Aemberon), Some(r));
                    if self.rng.chance(0.5) {
                        let all = filled(&self.board);
                        if let Some(j) = self.one_of(&all) {
                            let r = self.m(j).rarity;
                            self.mutate(j, Some(Arch::Aemberon), Some(r));
                        }
                    }
                }
            }
            SpinalAemberon => {
                let r = self.rand_rarity();
                self.add(Arch::Aemberon, r, 31, 0);
            }
            XenoHormone => {
                for &i in targets.iter().take(2) {
                    self.remove(i);
                }
                for _ in 0..4 {
                    self.add_random(5, 0);
                }
            }
            TargetedXenoHormone => {
                if let Some(i) = t0 {
                    self.remove(i);
                    for _ in 0..2 {
                        let a = self.rand_arch();
                        self.add(a, Rarity::Magic, 0, 25);
                    }
                }
            }
            KitLarge | KitRare | KitSmall => {}
            CompoundPill => {
                for i in filled(&self.board) {
                    self.mutate(i, Some(Arch::Aemberon), None);
                    self.boost(i, 11, 0);
                    match self.m(i).rarity {
                        Rarity::Magic => self.boost(i, 11, 0),
                        Rarity::Rare | Rarity::Boss => self.boost(i, 0, 11),
                        Rarity::Normal => {}
                    }
                }
            }
            Cardiotonic => {
                if let Some(i) = self.lowest(|_| true) {
                    self.boost(i, 42, 42);
                }
            }
            PeatPoultice => {
                if self.n_arch(Arch::BoneSentry) > 0 {
                    let others = self.tanks_where(|m| m.arch != Arch::BoneSentry);
                    for &i in &others {
                        self.remove(i);
                    }
                    let n = others.len() as i64;
                    self.boost_all(|m| m.arch == Arch::BoneSentry, 20 * n, 39 * n);
                }
            }
            InsectAttractant => {
                let mut over = 0;
                for _ in 0..4 {
                    let r = self.rand_rarity();
                    if self.add(Arch::Pest, r, 0, 0).is_none() {
                        over += 1;
                    }
                }
                self.boost_all(|m| m.arch == Arch::Pest, 10 * over, 15 * over);
            }
            HolyWater => {
                for i in self.tanks_where(|m| m.arch == Arch::Agito) {
                    let r = self.m(i).rarity.up().up();
                    self.awaken(i, Some(r));
                }
            }
        }
    }

    // ---- instruments ----

    pub fn take(&mut self, i: Instrument) {
        if !self.holds(i) {
            self.held.push((i, self.round));
        }
    }

    /// Reactive instruments answering one event.
    fn react(&mut self, e: Event) {
        use Instrument::*;
        for k in 0..self.held.len() {
            let inst = self.held[k].0;
            match (inst, e) {
                (IncubationSac, Event::Add { .. }) if self.n_arch(Arch::Pest) >= 2 => {
                    self.boost_all(|_| true, 0, 45);
                }
                (VermicularCord, Event::Add { tank }) => {
                    if self.board[tank].is_some() && self.rng.chance(0.75) {
                        let r = self.m(tank).rarity;
                        self.mutate(tank, Some(Arch::Aemberon), Some(r));
                        self.boost(tank, 80, 0);
                    }
                }
                (Metatarsals, Event::Remove { .. }) if self.n_arch(Arch::BoneSentry) >= 2 => {
                    let all = filled(&self.board);
                    if let Some(i) = self.one_of(&all) {
                        self.boost(i, 0, 180);
                    }
                }
                (Claws, Event::Remove { arch, .. }) if arch != Arch::BoneSentry => {
                    let all = filled(&self.board);
                    if let Some(i) = self.one_of(&all) {
                        self.boost(i, 0, 150);
                    }
                }
                (EyelidSpeculum, Event::Remove { .. }) => {
                    if let Some(i) = self.highest() {
                        self.boost(i, 20, 20);
                    }
                }
                (Sprout, Event::Mutate { to: Arch::Aemberon, .. }) => self.boost_all(|_| true, 35, 0),
                (Liver, Event::Mutate { .. }) if self.n_arch(Arch::Aemberon) >= 2 => {
                    self.boost_all(|_| true, 20, 0)
                }
                (SkullNail, Event::Overflow) => {
                    if let Some(i) = self.lowest(|_| true) {
                        self.boost(i, 25, 25);
                    }
                }
                _ => {}
            }
        }
    }

    /// Round-end instruments, in the order they were taken.
    fn round_end_instruments(&mut self) {
        use Instrument::*;
        for k in 0..self.held.len() {
            let (inst, since) = self.held[k];
            let elapsed = self.round.saturating_sub(since);
            match inst {
                Chrysalis => {
                    let x = self.n_arch(Arch::Pest);
                    for _ in 0..x {
                        let all = filled(&self.board);
                        for i in self.sample(&all, x) {
                            self.boost(i, 0, 8);
                        }
                    }
                }
                FrontalLobe if self.n_arch(Arch::Agito) >= 2 => {
                    let rb = self.tanks_where(|m| m.rarity >= Rarity::Rare);
                    if let Some(i) = self.one_of(&rb) {
                        self.boost(i, 80, 0);
                    }
                }
                Pituitary if count(&self.board, |m| m.arch == Arch::Agito && m.rarity >= Rarity::Rare) > 0 => {
                    let all = filled(&self.board);
                    if let Some(i) = self.one_of(&all) {
                        self.boost(i, 80, 0);
                    }
                }
                ClusteredEggs if self.n_arch(Arch::Pest) >= 3 => {
                    let r = self.rand_rarity();
                    self.add(Arch::Pest, r, 0, 100);
                }
                SloughedCortex => {
                    let magic = self.tanks_where(|m| m.rarity == Rarity::Magic);
                    if magic.len() >= 2 {
                        let two = self.sample(&magic, 2);
                        self.fuse(&two, Arch::Agito, Rarity::Rare);
                    }
                }
                SinewGarrote if self.n_arch(Arch::BoneSentry) >= 2 => {
                    if let Some(i) = self.lowest(|m| m.arch != Arch::BoneSentry)
                        && let Some(m) = self.remove(i)
                    {
                        let bones = self.tanks_where(|m| m.arch == Arch::BoneSentry);
                        if let Some(j) = self.one_of(&bones) {
                            self.boost(j, m.act, m.qty);
                        }
                    }
                }
                RawhideRestraint if count(&self.board, |m| m.rarity == Rarity::Magic) >= 3 => {
                    if let Some(i) = self.highest() {
                        self.boost(i, 0, 100);
                    }
                }
                BlackGoatSuture => {
                    for r in [Rarity::Normal, Rarity::Magic, Rarity::Rare] {
                        let mut same = self.tanks_where(|m| m.rarity == r);
                        while same.len() >= 3 {
                            let three: Vec<usize> = same.drain(..3).collect();
                            let a = self.m(three[0]).arch;
                            self.fuse(&three, a, r.up());
                        }
                    }
                }
                BoneSaw => self.boost_all(|m| m.act > 150 && m.qty > 150, 15, 15),
                FouledScraper => self.boost_all(|m| m.qty > 275, 20, 0),
                TeethFile => self.boost_all(|m| m.act > 255, 0, 30),
                PlagueLady if elapsed > 0 && elapsed % 2 == 0 => {
                    let mut picked = Vec::new();
                    for r in Rarity::ALL {
                        let of = self.tanks_where(|m| m.rarity == r);
                        if let Some(i) = self.one_of(&of) {
                            if self.p.lady_snapshot {
                                picked.push(i);
                            } else {
                                self.awaken(i, None);
                            }
                        }
                    }
                    for i in picked {
                        self.awaken(i, None);
                    }
                }
                XenoStinger if elapsed > 0 && elapsed % 3 == 0 => {
                    for i in filled(&self.board) {
                        self.mutate(i, None, None);
                    }
                }
                TannedRestraint => {
                    // "Normal, Magic, and Elite monsters"; Elite = Rare or Boss (EN client, loading tip)
                    let has = |f: fn(Rarity) -> bool| count(&self.board, |m| f(m.rarity)) > 0;
                    if has(|r| r == Rarity::Normal) && has(|r| r == Rarity::Magic) && has(|r| r >= Rarity::Rare) {
                        self.boost_all(|_| true, 20, 0);
                    }
                }
                Beak => {
                    let n = filled(&self.board).len();
                    if (2..TANKS).contains(&n) {
                        self.add_random(0, 0);
                    } else if n == TANKS
                        && let (Some(h), Some(l)) = (self.highest(), self.lowest(|_| true))
                        && h != l
                    {
                        self.devour(h, l);
                    }
                }
                BroodMoth if elapsed > 0 && elapsed % 3 == 0 => {
                    let pests = self.tanks_where(|m| m.arch == Arch::Pest);
                    if pests.len() >= 2 {
                        let two = self.sample(&pests, 2);
                        let r = self.rand_rarity();
                        self.fuse(&two, Arch::Pest, r);
                    }
                }
                NettleToggle if count(&self.board, |m| m.rarity == Rarity::Normal) >= 3 => {
                    self.boost_all(|_| true, 0, 30);
                }
                _ => {}
            }
        }
    }

    /// Ends the round: queued events (batch mode), then the round-end instruments, then the thresholds.
    /// Returns how many advanced instrument offers the new score brings.
    pub fn end_round(&mut self) -> u32 {
        if !self.p.reactive_now {
            for _ in 0..4 {
                let events = std::mem::take(&mut self.queue);
                if events.is_empty() {
                    break;
                }
                for e in events {
                    self.react(e);
                }
            }
        }
        self.round_end_instruments();
        if !self.p.reactive_now {
            // what the round-end instruments set off answers now
            let events = std::mem::take(&mut self.queue);
            for e in events {
                self.react(e);
            }
            self.queue.clear();
        }
        let s = self.score();
        let mut offers = 0;
        if !self.passed1 && s >= self.p.threshold1 {
            self.passed1 = true;
            offers += 1;
        }
        if !self.passed2 && s >= self.p.threshold2 {
            self.passed2 = true;
            offers += 1;
        }
        self.round += 1;
        offers
    }

    // ---- offers ----

    /// `n` distinct potions, each card drawn by its tier weight; with `kits`, a slot is Supreme with
    /// `supreme_chance`. Inside a kit (`kits` off) no kits and no Supreme; `rare_kit` uses `rare_kit_w`.
    pub fn draw_potions(&mut self, n: usize, kits: bool) -> Vec<Potion> {
        self.draw_weighted(n, kits, self.p.tier_w)
    }

    pub fn draw_rare_kit(&mut self, n: usize) -> Vec<Potion> {
        self.draw_weighted(n, false, self.p.rare_kit_w)
    }

    fn draw_weighted(&mut self, n: usize, kits: bool, tier_w: [f64; 3]) -> Vec<Potion> {
        let mut hand: Vec<Potion> = Vec::with_capacity(n);
        for _ in 0..n {
            let supreme = kits && self.rng.chance(self.p.supreme_chance);
            let pool: Vec<Potion> = Potion::ALL
                .iter()
                .copied()
                .filter(|p| (p.tier() == Tier::Supreme) == supreme)
                .filter(|p| kits || !p.is_kit())
                .filter(|p| !hand.contains(p))
                .collect();
            let w: Vec<f64> = pool
                .iter()
                .map(|p| match p.tier() {
                    Tier::Normal => tier_w[0],
                    Tier::Magic => tier_w[1],
                    Tier::Rare => tier_w[2],
                    Tier::Supreme => 1.0,
                })
                .collect();
            let Some(k) = self.rng.weighted(&w) else { break };
            hand.push(pool[k]);
        }
        hand
    }

    /// Three instruments of the pool not held yet.
    pub fn draw_instruments(&mut self, advanced: bool) -> Vec<Instrument> {
        let pool: Vec<Instrument> =
            Instrument::ALL.iter().copied().filter(|i| i.advanced() == advanced && !self.holds(*i)).collect();
        let idx: Vec<usize> = (0..pool.len()).collect();
        self.sample(&idx, 3).into_iter().map(|k| pool[k]).collect()
    }

    /// Every way to play a potion: the tanks (or pairs of tanks) it can point at.
    pub fn targets(&self, potion: Potion) -> Vec<Vec<usize>> {
        let f = filled(&self.board);
        match potion.target() {
            Target::None | Target::Kit(_) => vec![vec![]],
            Target::One => f.iter().map(|&i| vec![i]).collect(),
            Target::OneOrTwo => {
                let mut v: Vec<Vec<usize>> = f.iter().map(|&i| vec![i]).collect();
                for (a, &i) in f.iter().enumerate() {
                    for &j in &f[a + 1..] {
                        v.push(vec![i, j]);
                    }
                }
                v
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn state(board: &[(Arch, Rarity, i64, i64)]) -> State {
        let mut s = State::new(Params::default(), 1);
        s.board = [None; TANKS];
        for (i, &(a, r, act, qty)) in board.iter().enumerate() {
            s.board[i] = Some(Monster { arch: a, rarity: r, act, qty });
        }
        s
    }

    #[test]
    fn a_new_run_starts_with_three_or_four_groups() {
        for seed in 0..200 {
            let n = filled(&State::new(Params::default(), seed).board).len();
            assert!((3..=4).contains(&n), "{n}");
        }
    }

    #[test]
    fn score_is_activity_times_quantity_summed() {
        let s = state(&[(Arch::Pest, Rarity::Normal, 2, 10), (Arch::Agito, Rarity::Rare, 15, 12)]);
        assert_eq!(s.score(), 2 * 10 + 15 * 12);
    }

    #[test]
    fn incubation_sac_needs_two_pests_and_answers_each_add() {
        let mut s = state(&[(Arch::Pest, Rarity::Normal, 1, 36)]);
        s.take(Instrument::IncubationSac);
        s.add(Arch::Agito, Rarity::Normal, 0, 0); // one Pest: nothing
        assert_eq!(s.m(0).qty, 36);
        s.add(Arch::Pest, Rarity::Normal, 0, 0); // second Pest: every group +45
        assert_eq!(s.m(0).qty, 36 + 45);
        assert_eq!(s.m(2).qty, 36 + 45);
    }

    #[test]
    fn an_add_with_six_full_tanks_fails_and_triggers_the_skull_nail_only() {
        let row = (Arch::Pest, Rarity::Normal, 1, 36);
        let mut s = state(&[row; 6]);
        s.take(Instrument::IncubationSac);
        s.take(Instrument::SkullNail);
        assert_eq!(s.add(Arch::Pest, Rarity::Normal, 0, 0), None);
        let qtys: Vec<i64> = (0..6).map(|i| s.m(i).qty).collect();
        assert_eq!(qtys, vec![36 + 25, 36, 36, 36, 36, 36]);
    }

    #[test]
    fn contracted_claws_answer_removals_except_bone_sentries() {
        let mut s = state(&[(Arch::Pest, Rarity::Normal, 1, 36), (Arch::BoneSentry, Rarity::Normal, 1, 36)]);
        s.take(Instrument::Claws);
        s.remove(1);
        assert_eq!(s.m(0).qty, 36);
        s.add(Arch::Agito, Rarity::Normal, 0, 0);
        s.remove(1);
        assert_eq!(s.m(0).qty, 36 + 150);
    }

    #[test]
    fn black_goat_suture_fuses_three_of_a_rarity_into_the_next() {
        let n = (Arch::Pest, Rarity::Normal, 1, 36);
        let mut s = state(&[n, n, n]);
        s.take(Instrument::BlackGoatSuture);
        s.end_round();
        let f = filled(&s.board);
        assert_eq!(f.len(), 1);
        let m = s.m(f[0]);
        assert_eq!((m.rarity, m.act, m.qty), (Rarity::Magic, 3, 108));
    }

    #[test]
    fn thresholds_bring_one_offer_each_once() {
        let mut s = state(&[(Arch::Agito, Rarity::Boss, 300, 100)]);
        assert_eq!(s.end_round(), 2); // 30,000 passes both
        assert_eq!(s.end_round(), 0);
    }

    #[test]
    fn normal_cards_come_three_times_as_often_as_rare_ones() {
        let mut s = State::new(Params::default(), 9);
        let (mut normal, mut rare) = (0.0f64, 0.0f64);
        for _ in 0..40_000 {
            for p in s.draw_potions(1, false) {
                match p.tier() {
                    Tier::Normal => normal += 1.0 / 10.0,
                    Tier::Rare => rare += 1.0 / 7.0,
                    _ => {}
                }
            }
        }
        assert!((normal / rare - 3.0).abs() < 0.25, "{}", normal / rare);
    }

    #[test]
    fn hands_are_three_distinct_cards() {
        let mut s = State::new(Params::default(), 3);
        for _ in 0..500 {
            let h = s.draw_potions(3, true);
            assert_eq!(h.len(), 3);
            assert!(h[0] != h[1] && h[1] != h[2] && h[0] != h[2]);
        }
    }
}
