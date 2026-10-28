//! The board: six tanks, each empty or holding one monster group.

pub const TANKS: usize = 6;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Arch {
    Pest,
    BoneSentry,
    Agito,
    Aemberon,
}

impl Arch {
    pub const ALL: [Arch; 4] = [Arch::Pest, Arch::BoneSentry, Arch::Agito, Arch::Aemberon];
    pub fn name(self) -> &'static str {
        match self {
            Arch::Pest => "Pest",
            Arch::BoneSentry => "Bone Sentry",
            Arch::Agito => "Agito",
            Arch::Aemberon => "Aemberon",
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Rarity {
    Normal,
    Magic,
    Rare,
    Boss,
}

impl Rarity {
    pub const ALL: [Rarity; 4] = [Rarity::Normal, Rarity::Magic, Rarity::Rare, Rarity::Boss];
    /// Base Activity × Quantity of a new group of this rarity.
    pub fn base(self) -> (i64, i64) {
        match self {
            Rarity::Normal => (1, 36),
            Rarity::Magic => (5, 24),
            Rarity::Rare => (15, 12),
            Rarity::Boss => (300, 1),
        }
    }
    /// One tier up; Boss stays Boss.
    pub fn up(self) -> Rarity {
        match self {
            Rarity::Normal => Rarity::Magic,
            Rarity::Magic => Rarity::Rare,
            _ => Rarity::Boss,
        }
    }
    /// Activity gained when awakening into this rarity.
    pub fn awaken_bonus(self) -> i64 {
        match self {
            Rarity::Normal => 0,
            Rarity::Magic => 60,
            _ => 120,
        }
    }
    pub fn name(self) -> &'static str {
        match self {
            Rarity::Normal => "Normal",
            Rarity::Magic => "Magic",
            Rarity::Rare => "Rare",
            Rarity::Boss => "Boss",
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Monster {
    pub arch: Arch,
    pub rarity: Rarity,
    pub act: i64,
    pub qty: i64,
}

impl Monster {
    pub fn new(arch: Arch, rarity: Rarity) -> Monster {
        let (act, qty) = rarity.base();
        Monster { arch, rarity, act, qty }
    }
    /// This group's share of the score.
    pub fn total(&self) -> i64 {
        self.act * self.qty
    }
}

pub type Board = [Option<Monster>; TANKS];

/// Ultimate Activity: Activity × Quantity summed over the tanks.
pub fn score(board: &Board) -> i64 {
    board.iter().flatten().map(Monster::total).sum()
}

pub fn count(board: &Board, f: impl Fn(&Monster) -> bool) -> usize {
    board.iter().flatten().filter(|m| f(m)).count()
}

/// Indices of the tanks that hold a monster.
pub fn filled(board: &Board) -> Vec<usize> {
    (0..TANKS).filter(|&i| board[i].is_some()).collect()
}

/// Something that happened on the board; reactive instruments answer these.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Event {
    Add { tank: usize },
    /// The monster that left (removed, fused away or devoured).
    Remove { arch: Arch, rarity: Rarity },
    Mutate { tank: usize, to: Arch },
    Awaken { tank: usize },
    /// An add with every tank full: nothing is added.
    Overflow,
}
