//! Command line: `tartarus <eval|tools> [options]` (see README.md).

use std::process::ExitCode;
use std::time::Instant;

use tartarus::model::{StartCard, Tool};
use tartarus::params::Params;
use tartarus::policy::Weights;
use tartarus::run::{Setup, Summary, simulate};

const DEFAULT_DATA: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../data/tartarus_data.json");
const DEFAULT_OUT: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/../data/engine_results.json");

const USAGE: &str = "usage: tartarus <eval|tools|export> [options]
  eval    full runs: Rainbows per run, its spread and what the player did
  tools   each instrument held from day 1 against none (rewards off unless --rewards on)
  export  base, every instrument and every pair (rewards off) plus a full run (rewards on),
          written to --out (default ../data/engine_results.json)
options:
  --games N        runs per test (default 100000)
  --seed WORD      batch seed (default LAB)
  --threads N      worker threads (default: 40% of the logical cores)
  --data PATH      tartarus_data.json for the live odds (default ../data/tartarus_data.json)
  --rewards on|off start pick, objective pick and Warden's Treasures
  --tool ID[,ID]   instruments held from day 1 (eval)
  --start CARD     cagefight | ironlaw | tyranny
  --set KEY=VALUE  any rule (params.rs) or policy weight (w_tier, w_rainbow, w_event, w_objective, w_chain, samples)
  --out PATH       export: where to write the results";

struct Opts {
    cmd: String,
    games: u64,
    seed: u64,
    seed_word: String,
    out: String,
    threads: usize,
    data: String,
    rewards: Option<bool>,
    tools: u64,
    start: StartCard,
    sets: Vec<String>,
}

fn seed_of(word: &str) -> u64 {
    word.parse::<u64>().unwrap_or_else(|_| {
        word.bytes().fold(0xCBF2_9CE4_8422_2325u64, |h, b| {
            (h ^ b as u64).wrapping_mul(0x100_0000_01B3)
        })
    })
}

fn parse(args: &[String]) -> Result<Opts, String> {
    let mut o = Opts {
        cmd: args.first().cloned().ok_or(USAGE)?,
        games: 100_000,
        seed: seed_of("LAB"),
        seed_word: "LAB".into(),
        out: DEFAULT_OUT.to_string(),
        threads: 0,
        data: DEFAULT_DATA.to_string(),
        rewards: None,
        tools: 0,
        start: StartCard::None,
        sets: Vec::new(),
    };
    let mut it = args[1..].iter();
    while let Some(flag) = it.next() {
        let mut val = || it.next().cloned().ok_or(format!("{flag} needs a value"));
        match flag.as_str() {
            "--games" => o.games = val()?.parse().map_err(|_| "--games: not a number")?,
            "--seed" => {
                o.seed_word = val()?;
                o.seed = seed_of(&o.seed_word);
            }
            "--out" => o.out = val()?,
            "--threads" => o.threads = val()?.parse().map_err(|_| "--threads: not a number")?,
            "--data" => o.data = val()?,
            "--rewards" => o.rewards = Some(val()? == "on"),
            "--tool" => {
                for id in val()?.split(',') {
                    o.tools |= Tool::from_id(id)
                        .ok_or(format!("--tool: unknown instrument `{id}`"))?
                        .bit();
                }
            }
            "--start" => {
                o.start = match val()?.as_str() {
                    "cagefight" => StartCard::CageFight,
                    "ironlaw" => StartCard::IronLaw,
                    "tyranny" => StartCard::Tyranny,
                    s => return Err(format!("--start: unknown card `{s}`")),
                }
            }
            "--set" => o.sets.push(val()?),
            "-h" | "--help" => return Err(USAGE.into()),
            f => return Err(format!("unknown option `{f}`\n{USAGE}")),
        }
    }
    Ok(o)
}

fn line(label: &str, s: &Summary, base: Option<f64>) -> String {
    let delta = base
        .map(|b| format!("  ({:+.4})", s.mean() - b))
        .unwrap_or_default();
    format!(
        "{label:<46} {:.4} ± {:.4} Rainbows/run{delta}",
        s.mean(),
        s.se()
    )
}

/// Share of the logical cores used when `--threads` is not given, so the
/// machine stays usable while a batch runs.
const DEFAULT_CPU_SHARE: f64 = 0.4;

fn default_threads() -> usize {
    let cores = std::thread::available_parallelism().map_or(1, |n| n.get());
    ((cores as f64 * DEFAULT_CPU_SHARE) as usize).max(1)
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    match run(&args) {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("{e}");
            ExitCode::FAILURE
        }
    }
}

fn run(args: &[String]) -> Result<(), String> {
    let o = parse(args)?;
    let threads = if o.threads > 0 {
        o.threads
    } else {
        default_threads()
    };
    rayon::ThreadPoolBuilder::new()
        .num_threads(threads)
        .build_global()
        .map_err(|e| e.to_string())?;
    let json = std::fs::read_to_string(&o.data).map_err(|e| format!("{}: {e}", o.data))?;
    let mut p = Params::from_data(&json)?;
    let mut w = Weights::default();
    for kv in &o.sets {
        if !w.set(kv)? {
            p.set(kv)?;
        }
    }
    let setup = Setup {
        tools: o.tools,
        start_card: o.start,
    };
    let threads = rayon::current_num_threads();
    let t0 = Instant::now();
    match o.cmd.as_str() {
        "eval" => {
            p.rewards = o.rewards.unwrap_or(true);
            let s = simulate(&p, &w, o.games, o.seed, setup);
            let secs = t0.elapsed().as_secs_f64();
            println!(
                "eval: {} runs on {threads} threads, rewards {}",
                o.games,
                if p.rewards { "on" } else { "off" }
            );
            println!("{}", line("Rainbows per run", &s, None));
            println!(
                "median {} · zero {:.1}% · Supremes left {:.2}",
                s.median(),
                100.0 * s.hist[0] as f64 / s.games as f64,
                s.per_run(s.supremes)
            );
            println!(
                "per run: {:.1} doors opened · {:.1} consumes ({:.2} bites each) · {:.1} replaces",
                s.per_run(s.opened),
                s.per_run(s.consumes),
                s.bites / s.consumes.max(1.0),
                s.per_run(s.replaces)
            );
            let top = s.hist.iter().rposition(|&n| n > 0).unwrap_or(0);
            let dist: Vec<String> = (0..=top)
                .map(|k| format!("{k}:{:.1}%", 100.0 * s.hist[k] as f64 / s.games as f64))
                .collect();
            println!("spread {}", dist.join(" "));
            println!("{:.1}s, {:.0} runs/s", secs, o.games as f64 / secs);
        }
        "tools" => {
            p.rewards = o.rewards.unwrap_or(false);
            println!(
                "tools: {} runs per test on {threads} threads, rewards {}",
                o.games,
                if p.rewards { "on" } else { "off" }
            );
            let base = simulate(&p, &w, o.games, o.seed, setup);
            let mut rows: Vec<(Tool, Summary)> = Tool::ALL
                .iter()
                .map(|&t| {
                    (
                        t,
                        simulate(
                            &p,
                            &w,
                            o.games,
                            o.seed,
                            Setup {
                                tools: setup.tools | t.bit(),
                                ..setup
                            },
                        ),
                    )
                })
                .collect();
            rows.sort_by(|a, b| b.1.mean().total_cmp(&a.1.mean()));
            println!("{}", line("no instrument", &base, None));
            for (t, s) in &rows {
                println!("{}", line(t.name(), s, Some(base.mean())));
            }
            let secs = t0.elapsed().as_secs_f64();
            let runs = o.games as f64 * (rows.len() + 1) as f64;
            println!("{:.1}s, {:.0} runs/s", secs, runs / secs);
        }
        "export" => export(&o, &json, p, &w, setup)?,
        c => return Err(format!("unknown command `{c}`\n{USAGE}")),
    }
    Ok(())
}

/// Today's UTC date as YYYY-MM-DD (civil-from-days, no date crate needed).
fn today() -> String {
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let z = (secs / 86_400) as i64 + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = yoe + era * 400 + i64::from(m <= 2);
    format!("{y:04}-{m:02}-{d:02}")
}

fn round3(x: f64) -> f64 {
    (x * 1000.0).round() / 1000.0
}

/// Every number the play sheet shows, from our engine.
fn export(o: &Opts, data: &str, mut p: Params, w: &Weights, setup: Setup) -> Result<(), String> {
    let t0 = Instant::now();
    let with = |tools: u64| Setup { tools, ..setup };
    p.rewards = false;
    let base = simulate(&p, w, o.games, o.seed, setup);
    let mut tools = serde_json::Map::new();
    for &t in Tool::ALL {
        let s = simulate(&p, w, o.games, o.seed, with(t.bit()));
        tools.insert(
            t.id().into(),
            serde_json::json!({ "name": t.name(), "value": round3(s.mean()), "se": round3(s.se()) }),
        );
        eprint!(".");
    }
    eprintln!(" {} instruments", Tool::ALL.len());
    let mut pairs: Vec<(Tool, Tool, f64)> = Vec::new();
    for (i, &a) in Tool::ALL.iter().enumerate() {
        for &b in &Tool::ALL[i + 1..] {
            let s = simulate(&p, w, o.games, o.seed, with(a.bit() | b.bit()));
            pairs.push((a, b, round3(s.mean())));
        }
        eprint!(".");
    }
    eprintln!(" {} pairs", pairs.len());
    pairs.sort_by(|x, y| y.2.total_cmp(&x.2));
    p.rewards = true;
    let full = simulate(&p, w, o.games, o.seed, setup);
    let live: serde_json::Value = serde_json::from_str(data).map_err(|e| e.to_string())?;
    let out = serde_json::json!({
        "generated": today(),
        "engine": concat!("tartarus-engine ", env!("CARGO_PKG_VERSION")),
        "seed": o.seed_word,
        "gamesPerTest": o.games,
        "liveLatest": live.pointer("/live/latest"),
        "rules": {
            "secondMealFrom": p.second_meal_from,
            "muzzleMax": p.muzzle_max,
            "maidenAnyTime": p.maiden_any_time,
            "collarFirstBite": p.collar_first_bite,
            "skewerExtra": p.skewer_extra,
            "oppressBase": p.oppress_base,
            "oppressStep": p.oppress_step,
            "tuskPersists": p.tusk_persists,
            "instigateCount": p.instigate_count,
            "rainbowCap": p.rainbow_cap,
        },
        "base": round3(base.mean()),
        "tools": tools,
        "pairs": pairs.iter().map(|(a, b, v)| serde_json::json!([a.id(), b.id(), v])).collect::<Vec<_>>(),
        "run": {
            "mean": round3(full.mean()),
            "se": round3(full.se()),
            "median": full.median(),
            "zeroShare": round3(full.hist[0] as f64 / full.games as f64),
        },
    });
    let text = serde_json::to_string_pretty(&out).map_err(|e| e.to_string())? + "\n";
    std::fs::write(&o.out, text).map_err(|e| format!("{}: {e}", o.out))?;
    println!(
        "export: {} tests x {} runs in {:.0}s -> {}",
        2 + Tool::ALL.len() + pairs.len(),
        o.games,
        t0.elapsed().as_secs_f64(),
        o.out
    );
    Ok(())
}
