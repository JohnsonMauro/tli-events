//! The cards of Surgical Preparation: potions (one of three each round, rounds 1–10) and Surgical Instruments
//! (three offered in round 1, again at each Ultimate Activity threshold).
//!
//! Pool and texts: the April 2026 card list of Moebing's fan simulator (MIT, github.com/Moebing/
//! Torchlight-Infinite-SS11-Vorax-simulator) — CN texts, our reading — until our own transcription from SS14
//! videos replaces it (../README.md → "Sources"). Checked against CN footage of SS13–SS14 (2026-08 → 10): every
//! instrument and 39 of 40 potions seen with the same numbers; 抱卵蝶 is new; 速效强心剂 not seen yet. `en` is the EN client name where an EN source shows it; empty
//! when not confirmed yet. The effects live in rules.rs.

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum Tier {
    Normal,
    Magic,
    Rare,
    Supreme,
}

/// Who the player points the potion at.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Target {
    None,
    One,
    OneOrTwo,
    /// A Potion Kit: opens into this many random potions (no kits, no Supreme), the player plays one.
    Kit(usize),
}

macro_rules! potions {
    ($($id:ident, $cn:literal, $en:literal, $tier:ident, $target:expr;)*) => {
        #[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
        pub enum Potion { $($id),* }
        impl Potion {
            pub const ALL: &'static [Potion] = &[$(Potion::$id),*];
            pub fn cn(self) -> &'static str { match self { $(Potion::$id => $cn),* } }
            pub fn en(self) -> &'static str { match self { $(Potion::$id => $en),* } }
            pub fn tier(self) -> Tier { match self { $(Potion::$id => Tier::$tier),* } }
            pub fn target(self) -> Target { match self { $(Potion::$id => $target),* } }
        }
    };
}

use Target::*;
potions! {
    ProbioticMold, "益生霉溶液", "Probiotic Enzyme Solution", Rare, None;
    Slough, "蜕生皮溶液", "Slough Solution", Rare, OneOrTwo;
    PiaMater, "软脑膜溶液", "Leptomeningeal Solution", Rare, One;
    Osteolytic, "化骨油膏", "Osteolytic Ointment", Rare, None;
    Debriding, "清疽油膏", "Cleansing Ointment", Rare, One;
    FreshSpinal, "鲜脊髓药粉", "Fresh Spinal Powder", Rare, None;
    PetrifiedSpinal, "石化脊髓溶液", "Petrified Spinal Solution", Rare, One;
    BroodHormone, "活性育卵激素", "Viviparous Hormone", Magic, None;
    Eggshell, "卵壳药粉", "Eggshell Powder", Magic, None;
    BrainFog, "脑雾酊剂", "Brain Fog Tincture", Magic, None;
    Osteogenic, "生骨药粉", "Osteogenic Powder", Magic, None;
    GrayMatter, "灰质脊髓溶液", "Gray Matter Spinal Solution", Magic, None;
    HollowSpinal, "空心脊髓溶液", "Hollow Spinal Solution", Magic, One;
    GreenBile, "青胆汁溶液", "Green Bile Solution", Magic, OneOrTwo;
    MixedLeech, "混合活蛭溶液", "Compound Leech Solution", Magic, One;
    DigestiveEnzyme, "消化酶溶液", "Digestive Enzyme Solution", Magic, One;
    Vivigenic, "活殖药粉", "Vivigenic Powder", Magic, None;
    PotentXenopurge, "强效祛异药粉", "Potent Xenopurge Powder", Magic, One;
    Xenopurge, "祛异药粉", "Xenopurge Powder", Magic, One;
    PureLeech, "纯粹活蛭溶液", "Pure Leech Solution", Magic, One;
    Bewitching, "迷魂酊剂", "Bewitching Tincture", Magic, One;
    Mutagenic, "诱变药粉", "Mutagenic Powder", Magic, OneOrTwo;
    ViscousBile, "黏稠胆汁溶液", "Viscous Bile Solution", Magic, One;
    SlimLimbPest, "细肢药粉-蛊虫", "Slender-Limb Powder - Pest", Normal, None;
    TwinPest, "孪生激素-蛊虫", "Twin Hormone - Pest", Normal, One;
    SpinalAgito, "脊髓溶液-觉醒者", "Spinal Solution - Agito", Normal, None;
    AnestheticAgito, "麻药酊剂-觉醒者", "Anesthetic Tincture - Agito", Normal, One;
    SlimLimbBone, "细肢药粉-骨卫兵", "Slender-Limb Powder - Bone Sentry", Normal, None;
    TwinBone, "孪生激素-骨卫兵", "Twin Hormone - Bone Sentry", Normal, One;
    AnestheticAemberon, "麻药酊剂-异魔", "Anesthetic Tincture - Aemberon", Normal, One;
    SpinalAemberon, "脊髓溶液-异魔", "Spinal Solution - Aemberon", Normal, None;
    XenoHormone, "异种激素", "Xeno-Hormone", Normal, OneOrTwo;
    TargetedXenoHormone, "靶向异种激素", "Targeted Xeno-Hormone", Normal, One;
    KitLarge, "药剂箱（大）", "Potion Kit (Large)", Rare, Kit(5);
    KitRare, "稀有药剂箱（小）", "Rare Potion Kit (Small)", Rare, Kit(3);
    KitSmall, "药剂箱（小）", "Potion Kit (Small)", Rare, Kit(3);
    CompoundPill, "复方焕生丸剂", "Compound Revitalizing Pill", Supreme, None;
    Cardiotonic, "速效强心剂", "", Supreme, None;
    PeatPoultice, "疫区泥炭敷料", "Plague Quarter Peat Poultice", Supreme, None;
    InsectAttractant, "诱虫剂", "Insect Attractant", Supreme, None;
    HolyWater, "至纯圣水", "", Supreme, None;
}

impl Potion {
    /// The name to print: EN when confirmed, else the CN name.
    pub fn name(self) -> &'static str {
        if self.en().is_empty() { self.cn() } else { self.en() }
    }
    pub fn is_kit(self) -> bool {
        matches!(self.target(), Kit(_))
    }
}

macro_rules! instruments {
    ($($id:ident, $key:literal, $cn:literal, $en:literal, $advanced:literal;)*) => {
        #[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
        pub enum Instrument { $($id),* }
        impl Instrument {
            pub const ALL: &'static [Instrument] = &[$(Instrument::$id),*];
            /// Short id for the command line and the export.
            pub fn key(self) -> &'static str { match self { $(Instrument::$id => $key),* } }
            pub fn cn(self) -> &'static str { match self { $(Instrument::$id => $cn),* } }
            pub fn en(self) -> &'static str { match self { $(Instrument::$id => $en),* } }
            /// Offered at the thresholds (8,000 / 28,000), not in round 1.
            pub fn advanced(self) -> bool { match self { $(Instrument::$id => $advanced),* } }
        }
    };
}

instruments! {
    Chrysalis, "chrysalis", "人蛹标本", "Chrysalis Specimen", false;
    IncubationSac, "sac", "孵化囊", "Incubation Sac", false;
    FrontalLobe, "frontal", "增生前额叶", "Hyperplastic Frontal Lobe", false;
    Pituitary, "pituitary", "肿大脑垂体", "Hypertrophic Pituitary", false;
    Metatarsals, "metatarsals", "粘连跖骨", "Adherent Metatarsals", false;
    Claws, "claws", "挛缩指爪", "Contracted Claws", false;
    Sprout, "sprout", "孽生肉芽", "Aberrant Sprout", false;
    Liver, "liver", "斑斓肝脏", "Prismatic Liver", false;
    ClusteredEggs, "eggs", "簇生虫卵", "Clustered Eggs", true;
    SloughedCortex, "cortex", "蜕生脑皮层", "Sloughed Cortex", true;
    SinewGarrote, "garrote", "兽筋绞肉索", "Sinew Garrote", true;
    VermicularCord, "cord", "蠕动脊髓", "Vermicular Spinal Cord", true;
    RawhideRestraint, "rawhide", "生皮革拘束带", "Rawhide Restraint", true;
    BlackGoatSuture, "suture", "黑山羊肠缝线", "Black Goat Gut Suture", true;
    BoneSaw, "saw", "生铁骨锯", "Pig Iron Bone Saw", true;
    SkullNail, "nail", "二寸颅骨钉", "Two-Inch Skull Nail", true;
    FouledScraper, "scraper", "脏污刮骨刀", "Fouled Scraper", true;
    TeethFile, "file", "犬牙锉刀", "Canine Teeth File", true;
    PlagueLady, "lady", "疫区圣母像", "Lady of the Plague Quarter", true;
    XenoStinger, "stinger", "异形蛰针", "Aberrant Stinger", true;
    TannedRestraint, "tanned", "鞣制皮革拘束带", "Tanned Leather Restraint", true;
    EyelidSpeculum, "speculum", "眼睑扩张器", "Eyelid Speculum", true;
    Beak, "beak", "二度降生者之喙", "Beak of the Twice-Born", true;
    NettleToggle, "nettle", "荨麻绳扣", "Nettle Toggle", true;
    BroodMoth, "moth", "抱卵蝶", "", true;
}

impl Instrument {
    pub fn name(self) -> &'static str {
        if self.en().is_empty() { self.cn() } else { self.en() }
    }
    pub fn from_key(key: &str) -> Option<Instrument> {
        Instrument::ALL.iter().copied().find(|i| i.key() == key)
    }
}
