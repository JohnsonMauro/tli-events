#!/usr/bin/env python3
"""Refresh the Tartarus (SS14) data snapshot from the fan simulator.

Downloads the simulator's data files and its live telemetry (rates.json:
odds measured from boards players shared) as text only, nothing is executed.
Extracts odds, rules, instrument values and pair combos, then writes:

  data/tartarus_data.json        data for the Astro site (src/sheets/ss14)
  data/snapshots/sim_<stamp>_<ver>.json  frozen copy whenever something changed
  instrument_combos.csv          all solos + pairs, sorted
  CHANGELOG.md                   appends a dated entry when something changed

Usage:  python3 -I scripts/update_data.py [--dry-run]   (or `pnpm data` from the repo root)
"""
import csv
import datetime as dt
import glob
import json
import os
import re
import sys
import urllib.request

BASE = "https://blahdot3h.github.io/tartarus-simulator/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
SNAP = os.path.join(DATA, "snapshots")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
TIERS = ["Normal", "Magic", "Rare", "Legendary", "Supreme", "Rainbow"]
TOOL_DELTA = 0.05  # Rainbows/run change worth logging
# Sections of the simulator's guide-data.js kept for the record (nothing on the site reads them). Each is optional:
# upstream dropped `challenge` in 20261018p, and a missing key broke every run until 2026-10-19.
GUIDE_KEYS = ("headline", "habits", "stairs", "compare", "challenge")


RATES = "https://raw.githubusercontent.com/blahdot3h/tartarus-simulator/HEAD/beta/data/rates.json"


def get(path):
    url = path if path.startswith("https://") else BASE + path
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def block(src, name):
    """Return the body of `const NAME = { ... };` (top-level, 2-space indent)."""
    m = re.search(r"const %s = \{\n(.*?)\n  \};" % name, src, re.S)
    if not m:
        raise ValueError("block not found: " + name)
    return m.group(1)


def entries(body, with_text=True):
    q = r"(['\"])(.*?)(?<!\\)\{q}"
    pat = r"^\s+(\w+): \{ name: " + q.format(q=2)
    if with_text:
        pat += r",[^\n]*?text: " + q.format(q=4)
    out = {}
    for m in re.finditer(pat, body, re.M):
        out[m.group(1)] = {"name": m.group(3)}
        if with_text:
            out[m.group(1)]["text"] = m.group(5)
    return out


def parse_params(body):
    out = {}
    for m in re.finditer(r"^\s+(\w+): (\[[^\]]*\]|true|false|-?[\d.]+),", body, re.M):
        k, v = m.group(1), m.group(2)
        out[k] = json.loads(v)
    return out


def parse_js_json(src, var):
    start = src.index(var + " = ") + len(var) + 3
    return json.JSONDecoder().raw_decode(src, start)[0]


def live_summary(r):
    """Keep the measured-in-game numbers from the simulator's telemetry (rates.json)."""
    rows = lambda sec: {x["name"]: round(x["share"], 4) for x in sec["rows"]}
    share = lambda sec: {k: sec[k] for k in ("n", "count", "share", "low", "high", "sim") if k in sec}
    offers = r.get("toolOffers", {})
    return {
        "latest": r.get("latest"),
        "boards": r.get("boards"),
        "runs": r.get("runs"),
        "doorTiers": {"n": r["doors"]["tiers"]["n"], "share": rows(r["doors"]["tiers"])},
        "doorBeasts": {"n": r["doors"]["beasts"]["n"], "share": rows(r["doors"]["beasts"])},
        "replaceTiers": {"n": r["swaps"]["tiers"]["n"], "share": rows(r["swaps"]["tiers"])},
        "keyRing": share(r["sideDoors"]["keyRing"]),
        "eventDoorsDay1": share(r["events"]["dayOneDoorsWithEvents"]),
        "fewerDoorMornings": share(r["mornings"]["fewerDoors"]),
        "devours": {k: r["devours"].get(k) for k in ("n", "meanBites", "meanExtraTiers")},
        "beastChangedAfterBite": share(r["devours"]["beastChanged"]),
        "toolOffers": {"n": offers.get("n"), "counts": offers.get("counts", {})},
    }


def build():
    index = get("index.html")
    ver = re.search(r"\?v=(\w+)", index).group(1)
    engine = get("js/engine.js")
    guide = parse_js_json(get("js/guide-data.js"), "TARTARUS_GUIDE")
    combos = parse_js_json(get("js/tool-combos.js"), "TARTARUS_COMBOS")["single"]

    params = parse_params(block(engine, "DEFAULT_PARAMS"))
    tools = entries(block(engine, "TOOLS"))
    for t in guide["tools"]:
        tools.setdefault(t["id"], {"name": t["name"]})["value"] = round(t["value"], 3)
    ids = combos["ids"]
    pairs = []
    for k, val in combos["v"].items():
        if len(k) == 2:
            pairs.append([ids[ord(k[0]) - 97], ids[ord(k[1]) - 97], round(val, 3)])
    pairs.sort(key=lambda p: -p[2])

    try:
        live = live_summary(json.loads(get(RATES)))
    except Exception as exc:  # telemetry is optional; keep the sim data usable
        print("warning: live telemetry unavailable:", exc)
        live = None

    return {
        "simVersion": ver,
        "live": live,
        "fetched": dt.date.today().isoformat(),
        "source": BASE,
        "tiers": TIERS,
        "odds": {
            "door": params.get("tierWeights"),
            "replace": params.get("swapWeights"),
            "beast": params.get("beastWeights"),
            "eventChancePct": params.get("eventChance"),
            "doubleEatTier": params.get("doubleEatTier"),
        },
        "params": params,
        "tools": tools,
        "baseNoTools": combos["base"],
        "pairs": pairs,
        "events": entries(block(engine, "EVENTS"), with_text=False),
        "objectives": entries(block(engine, "OBJECTIVES")),
        "startCards": entries(block(engine, "START_EVENTS")),
        "gifts": {g["id"]: {**entries(block(engine, "GIFTS")).get(g["id"], {}), "value": round(g["value"], 3)}
                  for g in guide["gifts"] if g["id"] in entries(block(engine, "GIFTS"))},
        **{k: guide[k] for k in GUIDE_KEYS if guide.get(k) is not None and k != "challenge"},
        **({"challenge": {k: guide["challenge"][k] for k in ("headline", "habits") if k in guide["challenge"]}}
           if guide.get("challenge") else {}),
    }


def diff(old, new):
    notes = []
    for key in ("door", "replace", "beast", "eventChancePct", "doubleEatTier"):
        if old["odds"].get(key) != new["odds"].get(key):
            notes.append(f"Odds `{key}`: {old['odds'].get(key)} → {new['odds'].get(key)}")
    ot, nt = old["tools"], new["tools"]
    for tid in sorted(set(nt) - set(ot)):
        notes.append(f"New instrument: **{nt[tid]['name']}** — {nt[tid].get('text', '')}")
    for tid in sorted(set(ot) - set(nt)):
        notes.append(f"Instrument removed: {ot[tid]['name']}")
    for tid in sorted(set(ot) & set(nt)):
        a, b = ot[tid], nt[tid]
        if a.get("text") != b.get("text"):
            notes.append(f"Rule changed — {b['name']}: \"{a.get('text')}\" → \"{b.get('text')}\"")
        va, vb = a.get("value"), b.get("value")
        if va is not None and vb is not None and abs(va - vb) >= TOOL_DELTA:
            notes.append(f"Value {b['name']}: {va} → {vb} Rainbows/run")
    for kind in ("events", "objectives", "startCards"):
        for k in sorted(set(new[kind]) - set(old[kind])):
            notes.append(f"New {kind}: {new[kind][k]['name']}")
    otop = old["pairs"][0] if old["pairs"] else None
    ntop = new["pairs"][0] if new["pairs"] else None
    if otop and ntop and otop[:2] != ntop[:2]:
        notes.append(f"Best pair changed: {otop} → {ntop}")
    oh, nh = (old.get("headline") or {}).get("rainbowsPerRun"), (new.get("headline") or {}).get("rainbowsPerRun")
    if oh is not None and nh is not None and abs(oh - nh) >= TOOL_DELTA:
        notes.append(f"Rainbows/run (tuned strategy): {oh} → {nh}")
    for k in GUIDE_KEYS:
        if old.get(k) and not new.get(k):
            notes.append(f"The simulator's guide no longer has `{k}`")
    ol, nl = old.get("live") or {}, new.get("live") or {}
    p = lambda x: "new" if x is None else f"{x * 100:.1f}%"
    for key in ("doorTiers", "doorBeasts", "replaceTiers"):
        a, b = (ol.get(key) or {}).get("share", {}), (nl.get(key) or {}).get("share", {})
        moved = {k: (a.get(k), b[k]) for k in b if a.get(k) is None or abs(a[k] - b[k]) >= 0.01}
        if moved:
            notes.append(f"Live `{key}` (n={nl[key]['n']}): "
                         + ", ".join(f"{k} {p(x)}→{p(y)}" for k, (x, y) in moved.items()))
    for key in ("keyRing", "eventDoorsDay1", "fewerDoorMornings"):
        a, b = (ol.get(key) or {}).get("share"), (nl.get(key) or {}).get("share")
        if b is not None and (a is None or abs(a - b) >= 0.01):
            notes.append(f"Live `{key}`: {p(a)} → {p(b)} (n={nl[key]['n']})")
    for k in sorted(set(new["params"]) - set(old["params"])):
        notes.append(f"New engine parameter: `{k}` = {new['params'][k]}")
    for k in sorted(set(new["params"]) & set(old["params"])):
        if k not in ("tierWeights", "swapWeights", "beastWeights", "eventChance", "doubleEatTier") \
                and new["params"][k] != old["params"][k]:
            notes.append(f"Parameter `{k}`: {old['params'][k]} → {new['params'][k]}")
    return notes


def latest_snapshot():
    snaps = sorted(glob.glob(os.path.join(SNAP, "sim_*.json")), key=os.path.getmtime)
    if not snaps:
        return None
    with open(snaps[-1]) as f:
        return json.load(f)


def write_csv(d):
    names = {k: v["name"] for k, v in d["tools"].items()}
    rows = [[v.get("value"), round(v.get("value", 0) / d["baseNoTools"], 2), k, v["name"], "", ""]
            for k, v in d["tools"].items() if v.get("value") is not None]
    rows += [[p[2], round(p[2] / d["baseNoTools"], 2), p[0], names.get(p[0], p[0]), p[1], names.get(p[1], p[1])]
             for p in d["pairs"]]
    rows.sort(key=lambda r: -r[0])
    with open(os.path.join(ROOT, "instrument_combos.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["rainbows_per_run", "x_vs_no_instrument", "id1", "instrument1", "id2", "instrument2"])
        w.writerows(rows)


def main():
    dry = "--dry-run" in sys.argv
    new = build()
    old = latest_snapshot()
    notes = diff(old, new) if old else ["Initial snapshot."]
    print(f"Simulator version {new['simVersion']} — {len(notes)} change(s)")
    for n in notes:
        print(" -", n)
    if dry:
        return
    os.makedirs(SNAP, exist_ok=True)
    if notes:  # one frozen copy per change, so history survives same-version telemetry updates
        stamp = dt.datetime.now().strftime("%Y%m%d-%H%M")
        with open(os.path.join(SNAP, f"sim_{stamp}_{new['simVersion']}.json"), "w") as f:
            json.dump(new, f, ensure_ascii=False, indent=1)
    with open(os.path.join(DATA, "tartarus_data.json"), "w") as f:
        json.dump(new, f, ensure_ascii=False, indent=1)
    write_csv(new)
    if notes and old:
        path = os.path.join(ROOT, "CHANGELOG.md")
        entry = f"\n## {new['fetched']} — simulator {old['simVersion']} → {new['simVersion']} (automatic)\n\n"
        entry += "\n".join(f"- {n}" for n in notes) + "\n"
        with open(path, "a") as f:
            f.write(entry)
        print("CHANGELOG.md updated.")


if __name__ == "__main__":
    main()
