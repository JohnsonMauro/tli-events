//! The game's pieces: beasts, rarities, cells, instruments, incidents and the
//! run state. Everything is `Copy` and fixed-size, so a state clones with a
//! plain memcpy (the policy clones it for every look-ahead).

use crate::rng::Rng;

pub const CELLS: usize = 16;
/// Cell 01, the Interrogation Room: the warden starts here and it never holds an inmate.
pub const OFFICE: usize = 0;

pub const NORMAL: u8 = 0;
pub const MAGIC: u8 = 1;
pub const RARE: u8 = 2;
pub const LEGENDARY: u8 = 3;
pub const SUPREME: u8 = 4;
pub const RAINBOW: u8 = 5;
pub const TIER_NAMES: [&str; 6] = ["Normal", "Magic", "Rare", "Legendary", "Supreme", "Rainbow"];

pub const MAMMOTH: u8 = 0;
pub const LION: u8 = 1;
pub const WOLF: u8 = 2;
pub const RAT: u8 = 3;
pub const BEAST_NAMES: [&str; 4] = ["Mammoth", "Lion", "Wolf", "Rat"];

/// Base counters (in-game rules page, tlidb "Counter"): Mammoth > Lion > Wolf > Rat > Mammoth.
/// Bit b set = eats beast b.
pub const FIRST_MEAL: [u8; 4] = [1 << LION, 1 << WOLF, 1 << RAT, 1 << MAMMOTH];
/// Second meals: Mammoth also eats Wolf, Lion also eats Rat (from `Params::second_meal_from`).
pub const SECOND_MEAL: [u8; 4] = [1 << WOLF, 1 << RAT, 0, 0];

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Inmate {
    pub beast: u8,
    pub tier: u8,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CellKind {
    Office,
    /// Locked door; `Cell::inmate` is who is behind it (rolled when the cell seals).
    Sealed,
    Open,
}

#[derive(Clone, Copy, Debug)]
pub struct Cell {
    pub kind: CellKind,
    pub inmate: Inmate,
    pub event: Option<Incident>,
    /// The warden walked past it, so its event shows.
    pub event_seen: bool,
    /// Its rarity shows on the door (Crow Whispers, "Treasure" Hunt, Scales, Scratch Marks).
    pub revealed: bool,
    /// Scratch Marks (Filthy Claws).
    pub scratch: bool,
    /// Tusk (Iron Tongs): replacing this inmate raises 4 random inmates.
    pub tusk: bool,
    /// Rat Nest (Squirming Iron Box): mornings left before it hatches; 0 = none.
    pub nest: u8,
}

impl Cell {
    pub fn is_open(&self) -> bool {
        self.kind == CellKind::Open
    }
    pub fn is_sealed(&self) -> bool {
        self.kind == CellKind::Sealed
    }
}

macro_rules! tools {
    ($($v:ident = $id:literal, $name:literal;)*) => {
        #[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
        #[repr(u8)]
        pub enum Tool { $($v,)* }
        impl Tool {
            pub const ALL: &'static [Tool] = &[$(Tool::$v,)*];
            pub fn id(self) -> &'static str { match self { $(Tool::$v => $id,)* } }
            pub fn name(self) -> &'static str { match self { $(Tool::$v => $name,)* } }
            pub fn from_id(id: &str) -> Option<Tool> { match id { $($id => Some(Tool::$v),)* _ => None } }
            pub fn bit(self) -> u64 { 1u64 << (self as u8) }
        }
    };
}

// Ids match `data/tartarus_data.json` (`tools`, `live.toolOffers`).
tools! {
    Revenge = "revenge", "Avenger's Casket";
    Muzzle = "muzzle", "Raging Beast's Agonizing Muzzle";
    Saw = "saw", "Rusty Saw";
    Keys = "keys", "Lost Ring of Keys";
    Rope = "rope", "Hangman's Noose";
    Fire = "fire", "Searing Branding Iron";
    IronBox = "ironbox", "Squirming Iron Box: Colossal Rat";
    Skewer = "skewer", "Skewered Rat Heads: Colossal Rat";
    Hook = "hook", "Sorting Hook";
    Pestle = "pestle", "Iron Pestle";
    Scales = "scales", "Warden's Scales";
    Tongs = "tongs", "Iron Tongs of Lust: Mammoth";
    Guillotine = "guillotine", "Fanged Guillotine: Alpha Wolf";
    Axe = "axe", "Gaoler's Execution Axe";
    Shackles = "shackles", "Long-Chained Shackles";
    Collar = "collar", "Maddened Beast's Barbed Collar";
    Forged = "forged", "Forged Key";
    DogTag = "dogtag", "Felon's Dog Tag";
    Cage = "cage", "Crowded Beastcage";
    Blacklist = "blacklist", "Executioner's Blacklist";
    ShortChain = "shortchain", "Short-Chained Shackles";
    Maiden = "maiden", "Severed Iron Maiden";
    Whip = "whip", "Barbed Whip";
    Ravenous = "ravenous", "Ferocious Beast's Ravenous Chains";
    Scapegoat = "scapegoat", "Scapegoat's Guillotine";
    Stake = "stake", "Burning Stake";
    Coin = "coin", "Kin's Coin of Fate";
    Crown = "crown", "Iron Crown of the Prison King: Berserk Lion";
    Maul = "maul", "Elephant-Foot Maul: Mammoth";
    Claws = "claws", "Filthy Claws: Alpha Wolf";
    Trap = "trap", "Blood-Stained Trap: Berserk Lion";
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Incident {
    ChainReaction,
    Execution,
    BehindClosedDoors,
    RavenousAppetite,
    HighRiskConvict,
    CrowWhispers,
    TasteOfFreedom,
    /// Usurpation I..IV: stage 1..=4.
    Usurpation(u8),
    SewerRatway,
    TreasureHunt,
    SharedFortune,
    Archenemy,
    /// Extra Portion (live card, print 93): up to 3 random inmates +1.
    ExtraPortion,
    /// Transfer of Convicts (live card, print 132): the warden's inmate copied into a random locked cell, which
    /// opens (print 133).
    TransferOfConvicts,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Treasure {
    CrimsonVintage,
    ThumbRing,
    BrassHorn,
    BrandOfOriginalSin,
}

impl Treasure {
    pub const ALL: [Treasure; 4] = [
        Treasure::CrimsonVintage,
        Treasure::ThumbRing,
        Treasure::BrassHorn,
        Treasure::BrandOfOriginalSin,
    ];
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Objective {
    /// King of the Caged: an inmate reaches Supreme.
    King,
    /// Prison Walk: move 18 tiles.
    Walk,
    /// Survival of the Fittest: consume 4 times.
    Consume,
    /// Undercurrents: trigger a Prison Incident 2 times.
    Undercurrents,
    /// Behind Cell Doors: open 10 cells.
    Doors,
}

impl Objective {
    pub const ALL: [Objective; 5] = [
        Objective::King,
        Objective::Walk,
        Objective::Consume,
        Objective::Undercurrents,
        Objective::Doors,
    ];
    pub fn need(self) -> u16 {
        match self {
            Objective::King => 1,
            Objective::Walk => 18,
            Objective::Consume => 4,
            Objective::Undercurrents => 2,
            Objective::Doors => 10,
        }
    }
    pub fn id(self) -> &'static str {
        match self {
            Objective::King => "king",
            Objective::Walk => "walk",
            Objective::Consume => "consume",
            Objective::Undercurrents => "undercurrents",
            Objective::Doors => "doors",
        }
    }
    pub fn from_id(id: &str) -> Option<Objective> {
        Objective::ALL.into_iter().find(|o| o.id() == id)
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum StartCard {
    None,
    CageFight,
    IronLaw,
    Tyranny,
    /// "You can make 2 additional choices when obtaining Warden's Treasure" (a player's print, quoted by the
    /// community simulator, 2026-10-17 — not printed by us; owner's call 2026-10-18 to use it).
    Opulence,
}

impl StartCard {
    pub const ALL: [StartCard; 5] = [
        StartCard::None,
        StartCard::CageFight,
        StartCard::IronLaw,
        StartCard::Tyranny,
        StartCard::Opulence,
    ];
    pub fn id(self) -> &'static str {
        match self {
            StartCard::None => "none",
            StartCard::CageFight => "cagefight",
            StartCard::IronLaw => "ironlaw",
            StartCard::Tyranny => "tyranny",
            StartCard::Opulence => "opulence",
        }
    }
    pub fn from_id(id: &str) -> Option<StartCard> {
        StartCard::ALL.into_iter().find(|c| c.id() == id)
    }
}

/// Prey mark (Blood-Stained Trap): the Lion in `lion` and its prey in `prey`.
#[derive(Clone, Copy, Debug)]
pub struct Prey {
    pub lion: u8,
    pub prey: u8,
    pub rounds: u8,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct Stats {
    pub opened: u32,
    pub consumes: u32,
    pub bites: u32,
    pub replaces: u32,
    pub incidents: u32,
    pub tools_earned: u32,
}

#[derive(Clone, Copy, Debug)]
pub struct State {
    pub cells: [Cell; CELLS],
    pub warden: u8,
    pub day: u8,
    pub max_days: u8,
    pub vault: u8,
    pub tools: u64,
    pub start_card: StartCard,
    pub objective: Objective,
    pub objective_progress: u16,
    pub objective_done: bool,
    pub consumed_today: bool,
    pub replaced_today: bool,
    /// Chain Reaction: the next patrol opens every sealed door on its way.
    pub chain_next: bool,
    /// The next Usurpation stage: 1 = I can be drawn; 2..=4 = the next incident triggered is that stage;
    /// 5 = all used.
    pub usurp_stage: u8,
    /// `Params::first_incident`, used up by the first incident triggered.
    pub first_incident: Option<Incident>,
    pub prey: Option<Prey>,
    /// Instrument picks and Warden's Treasures waiting to be chosen.
    pub pending_tools: u8,
    pub pending_treasures: u8,
    pub rng: Rng,
    pub stats: Stats,
}

impl State {
    pub fn has(&self, tool: Tool) -> bool {
        self.tools & tool.bit() != 0
    }

    pub fn inmate_at(&self, n: usize) -> Option<Inmate> {
        let c = &self.cells[n];
        c.is_open().then_some(c.inmate)
    }

    pub fn open_cells(&self) -> impl Iterator<Item = usize> + '_ {
        (0..CELLS).filter(|&n| self.cells[n].is_open())
    }

    pub fn sealed_cells(&self) -> impl Iterator<Item = usize> + '_ {
        (0..CELLS).filter(|&n| self.cells[n].is_sealed())
    }

    pub fn open_count(&self) -> usize {
        self.open_cells().count()
    }

    pub fn sealed_count(&self) -> usize {
        self.sealed_cells().count()
    }

    pub fn cage_fight(&self) -> bool {
        self.start_card == StartCard::CageFight
    }
}
