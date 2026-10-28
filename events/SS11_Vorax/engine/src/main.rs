//! Command line: `vorax <eval|tools> [options]` (see README.md).

use std::process::ExitCode;
use std::time::Instant;

use vorax::cards::Instrument;
use vorax::params::Params;
use vorax::policy::Policy;
use vorax::run::{Setup, Summary, simulate};

const DEFAULT_OUT: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../data/engine_results.json");

const USAGE: &str = "usage: vorax <eval|tools|export> [options]
  eval    full runs played by the policy: board score, its spread, rainbow share
  tools   each basic instrument taken in round 1, against the policy's own pick
  export  base run, every first instrument, every advanced one, every pair and each potion's pick rate,
          written to --out (default ../data/engine_results.json)
options:
  --games N        runs per test (default 20000)
  --seed WORD      batch seed (default LAB)
  --threads N      worker threads (default: 40% of the logical cores)
  --first KEY      eval: instrument taken in round 1 (chrysalis, sac, claws, …)
  --second KEY     eval: instrument taken at the first threshold
  --out PATH       export: where to write the results
  --set KEY=VALUE  any rule (params.rs) or policy setting (inst_samples, hand_samples, refresh_margin, potion_samples, potion_top, lookahead)";

struct Opts {
    cmd: String,
    games: u64,
    seed: u64,
    threads: usize,
    setup: Setup,
    p: Params,
    pol: Policy,
    out: String,
}

fn seed_of(word: &str) -> u64 {
    word.parse::<u64>().unwrap_or_else(|_| {
        word.bytes().fold(0xCBF2_9CE4_8422_2325u64, |h, b| (h ^ b as u64).wrapping_mul(0x100_0000_01B3))
    })
}

fn instrument(key: &str) -> Result<Instrument, String> {
    Instrument::from_key(key).ok_or_else(|| format!("unknown instrument {key}"))
}

fn parse(args: &[String]) -> Result<Opts, String> {
    let cores = std::thread::available_parallelism().map_or(4, |n| n.get());
    let mut o = Opts {
        cmd: args.first().cloned().ok_or(USAGE)?,
        games: 20_000,
        seed: seed_of("LAB"),
        threads: (cores * 2 / 5).max(1),
        setup: Setup::default(),
        p: Params::default(),
        pol: Policy::default(),
        out: DEFAULT_OUT.to_string(),
    };
    let mut it = args[1..].iter();
    while let Some(flag) = it.next() {
        let mut val = || it.next().cloned().ok_or_else(|| format!("{flag} needs a value"));
        match flag.as_str() {
            "--games" => o.games = val()?.parse().map_err(|_| "--games: not a number")?,
            "--seed" => o.seed = seed_of(&val()?),
            "--threads" => o.threads = val()?.parse().map_err(|_| "--threads: not a number")?,
            "--first" => o.setup.first = Some(instrument(&val()?)?),
            "--second" => o.setup.second = Some(instrument(&val()?)?),
            "--out" => o.out = val()?,
            "--set" => {
                let kv = val()?;
                if !o.pol.set(&kv)? {
                    o.p.set(&kv)?;
                }
            }
            _ => return Err(format!("unknown option {flag}\n{USAGE}")),
        }
    }
    Ok(o)
}

fn line(label: &str, s: &Summary) {
    println!(
        "{label:<28} mean {:>9.0} ±{:>6.0}  p10 {:>8}  median {:>8}  p90 {:>9}  rainbow {:>5.1}%",
        s.mean,
        1.96 * s.se,
        s.p10,
        s.median,
        s.p90,
        100.0 * s.rainbow
    );
}

fn stat(s: &Summary) -> serde_json::Value {
    serde_json::json!({ "mean": s.mean.round(), "se": s.se.round(), "rainbow": (s.rainbow * 1000.0).round() / 1000.0 })
}

/// Everything the play sheet reads, from our runs only.
fn export(o: &Opts) -> Result<(), String> {
    let run = |setup: Setup| simulate(o.p, &o.pol, o.games, o.seed, setup);
    let base = run(Setup::default());
    line("base", &base);
    let basic: Vec<Instrument> = Instrument::ALL.iter().copied().filter(|i| !i.advanced()).collect();
    let advanced: Vec<Instrument> = Instrument::ALL.iter().copied().filter(|i| i.advanced()).collect();
    let mut first = serde_json::Map::new();
    for &i in &basic {
        let s = run(Setup { first: Some(i), second: None });
        line(i.name(), &s);
        first.insert(i.key().into(), serde_json::json!({ "name": i.name(), "cn": i.cn(), "stat": stat(&s) }));
    }
    let mut second = serde_json::Map::new();
    for &i in &advanced {
        let s = run(Setup { first: None, second: Some(i) });
        line(i.name(), &s);
        second.insert(i.key().into(), serde_json::json!({ "name": i.name(), "cn": i.cn(), "stat": stat(&s) }));
    }
    let mut pairs = Vec::new();
    for &a in &basic {
        for &b in &advanced {
            let s = run(Setup { first: Some(a), second: Some(b) });
            pairs.push(serde_json::json!([a.key(), b.key(), s.mean.round(), (s.rainbow * 1000.0).round() / 1000.0]));
        }
        eprintln!("pairs with {} done", a.name());
    }
    let potions: Vec<serde_json::Value> = vorax::cards::Potion::ALL
        .iter()
        .zip(&base.potions)
        .map(|(p, &(shown, played))| {
            serde_json::json!({
                "name": p.name(), "cn": p.cn(), "tier": format!("{:?}", p.tier()),
                "shown": shown, "played": played,
                "rate": if shown > 0 { (played as f64 / shown as f64 * 1000.0).round() / 1000.0 } else { 0.0 },
            })
        })
        .collect();
    let out = serde_json::json!({
        "generated": std::env::var("VORAX_DATE").unwrap_or_default(),
        "games": o.games,
        "rainbowBoard": o.p.rainbow_board,
        "odds": { "tier": o.p.tier_w, "start": o.p.start_w, "added": o.p.rarity_w, "supreme": o.p.supreme_chance },
        "base": stat(&base),
        "first": first,
        "second": second,
        "pairs": pairs,
        "potions": potions,
    });
    let text = serde_json::to_string_pretty(&out).map_err(|e| e.to_string())?;
    std::fs::write(&o.out, text + "\n").map_err(|e| format!("{}: {e}", o.out))?;
    eprintln!("wrote {}", o.out);
    Ok(())
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let o = match parse(&args) {
        Ok(o) => o,
        Err(e) => {
            eprintln!("{e}");
            return ExitCode::FAILURE;
        }
    };
    if let Err(e) = rayon::ThreadPoolBuilder::new().num_threads(o.threads).build_global() {
        eprintln!("thread pool: {e}");
        return ExitCode::FAILURE;
    }
    let t = Instant::now();
    match o.cmd.as_str() {
        "eval" => line("run", &simulate(o.p, &o.pol, o.games, o.seed, o.setup)),
        "tools" => {
            line("policy's own pick", &simulate(o.p, &o.pol, o.games, o.seed, Setup::default()));
            let mut rows: Vec<(Instrument, Summary)> = Instrument::ALL
                .iter()
                .filter(|i| !i.advanced())
                .map(|&i| (i, simulate(o.p, &o.pol, o.games, o.seed, Setup { first: Some(i), ..o.setup })))
                .collect();
            rows.sort_by(|a, b| b.1.mean.total_cmp(&a.1.mean));
            for (i, s) in rows {
                line(i.name(), &s);
            }
        }
        "export" => {
            if let Err(e) = export(&o) {
                eprintln!("export: {e}");
                return ExitCode::FAILURE;
            }
        }
        _ => {
            eprintln!("{USAGE}");
            return ExitCode::FAILURE;
        }
    }
    eprintln!("{} games/test, {} threads, {:.1}s", o.games, o.threads, t.elapsed().as_secs_f64());
    ExitCode::SUCCESS
}
