#!/usr/bin/env python3
"""Download the game's own Mistville icons for the play sheet.

The icons are game-client textures (WebP, 116–512 px) mirrored by tlidb.com's
CDN. The ICONS table below is the record of where each piece of art comes from;
the script writes:

  art/<id>.webp     one file per icon, transparent margin trimmed to a square
                    (the cell textures are mostly empty space; read by
                    src/sheets/ss4/PlaySheet.astro)
  art/SOURCES.md    the same table, readable: id, what, source URL

Needs Pillow (like SS14's game_art.py). Run by hand when an icon is added;
the 6-hourly workflow does not run it (it only runs update_data.py).

Usage:  python3 -I scripts/game_art.py
"""
import io
import os
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "art")
CDN = "https://cdn.tlidb.com/UI/Textures/Common/Icon/"
GP = "GamePlay/UI_S6Gameplay_"
MAX_SIDE = 256  # the sheet draws icons at <=128 CSS px (2x = 256)

# id, path under CDN, what (EN name as the client shows it)
ICONS = [
    # board cells
    ("tile-bench", GP + "Tile_bench.webp", "Place of Awakening (bench + lantern)"),
    ("tile-clock", GP + "Tile_Exit1.webp", "Clock Tower"),
    ("tile-clock-locked", GP + "Tile_Exit2.webp", "Clock Tower, locked (Month 7, day 9+)"),
    ("tile-bank", GP + "Tile_Bank1.webp", "Bank"),
    ("tile-sanatorium", GP + "Tile_Hospital1.webp", "Sanatorium"),
    ("tile-trader", GP + "Tile_Shop.webp", "Mistville Trader"),
    ("tile-workshop", GP + "Tile_Furnace1.webp", "Alchemy Workshop"),
    ("tile-folklore", GP + "Tile_Encounter.webp", "Folklores"),
    ("tile-oldstuff", GP + "Tile_Relic.webp", "Unknown Old Stuff"),
    ("tile-food", GP + "Tile_Item.webp", "Unknown Food"),
    ("tile-tentacle", GP + "Tile_Trap.webp", "Tentacle"),
    ("tile-ruins", GP + "Tile_Ruin.webp", "Ruins"),
    ("tile-watchtower", GP + "Tile_Tower1.webp", "Watch Tower"),
    ("stele-blank", GP + "Tile_Monster0.webp", "Blank Stele"),
    ("stele-blindness", GP + "Tile_Monster1.webp", "Bad Omen Stele - Blindness"),
    ("stele-anxiety", GP + "Tile_Monster2.webp", "Bad Omen Stele - Anxiety"),
    ("stele-poverty", GP + "Tile_Monster3.webp", "Bad Omen Stele - Poverty"),
    ("stele-anorexia", GP + "Tile_Monster4.webp", "Bad Omen Stele - Anorexia"),
    # currencies and the season pactspirit
    ("intel", "GamePlay/UI_Item_S6Gameplay_TalentCurrency_Icon_128.webp", "Mistville Intel"),
    ("essence", "GamePlay/UI_Item_S6Gameplay_TalentCurrency2_Icon_128.webp", "Mist Essence"),
    ("orphan", "Pet/116_192/UI_Pet_SSR_ShuangMianYeCha_01_116.webp", "Mistville Orphan (pactspirit)"),
    # Old Stuff
    ("os-fork", GP + "relic30_Icon_128.webp", "Gourmet's Knife and Fork"),
    ("os-medal-food", GP + "relic18_Icon_128.webp", "Guild Medal - Food"),
    ("os-statue", GP + "relic19_Icon_128.webp", "Chief Trader's Statue"),
    ("os-purse", GP + "relic63_Icon_128.webp", "Watchful Purse"),
    ("os-iou", GP + "relic22_Icon_128.webp", "Banker's IOU"),
    ("os-wages", GP + "relic47_Icon_128.webp", "Filth Eater's Wages"),
    ("os-amulet-poverty", GP + "relic45_Icon_128.webp", "Amulet: Poverty"),
    ("os-horn-poverty", GP + "relic41_Icon_128.webp", "Poor Black Goat's Horn"),
    ("os-map-poverty", GP + "relic37_Icon_128.webp", "Map: Bad Omen Stele - Poverty"),
    ("os-amulet-anxiety", GP + "relic44_Icon_128.webp", "Amulet: Anxiety"),
    ("os-horn-anxiety", GP + "relic40_Icon_128.webp", "Anxious Black Goat's Horn"),
    ("os-misfortune", GP + "relic10_Icon_128.webp", "Mr. Misfortune"),
    ("os-grumpy", GP + "relic34_Icon_128.webp", "Ms. Grumpy"),
    ("os-bear", GP + "relic66_Icon_128.webp", "Baby Bear"),
    ("os-burnt-map", GP + "relic14_Icon_128.webp", "Burnt Map"),
    ("os-torn-map", GP + "relic57_Icon_128.webp", "Torn Map"),
    ("os-purse-carto", GP + "relic16_Icon_128.webp", "Cartographer's Purse"),
    ("os-stool", GP + "relic65_Icon_128.webp", "Cartographer's Stool"),
    ("os-bottle", GP + "relic09_Icon_128.webp", "Cartographer's Medicine Bottle"),
    ("os-cartographer", GP + "relic73_Icon_128.webp", '"Cartographer"'),
    ("os-glasses", GP + "relic12_Icon_128.webp", "Explorer's Glasses"),
    ("os-gaze", GP + "relic55_Icon_128.webp", "Uncanny Tales: Gaze"),
    ("os-shackles", GP + "relic51_Icon_128.webp", "First Bank's Shackles"),
    ("os-nail", GP + "relic52_Icon_128.webp", "Rusty Cranial Nail"),
    ("os-key", GP + "relic53_Icon_128.webp", "Amnesia Patient's Key"),
    # Food (Mistville Trader)
    ("food-cheese", GP + "item22_Icon_128.webp", "Golden Worm Cheese"),
    ("food-sashimi", GP + "item34_Icon_128.webp", "Dreamfish Sashimi"),
    ("food-pate", GP + "item21_Icon_128.webp", "Rich Pork Pate"),
    ("food-mistfish", GP + "item40_Icon_128.webp", "Dried Mistfish"),
    ("food-moth-soup", GP + "item59_Icon_128.webp", "Fluorescent Moth Soup"),
    ("food-candy", GP + "item01_Icon_128.webp", "Clock Tower Sleeping Candy"),
    ("food-coin-soup", GP + "item32_Icon_128.webp", "Coin Soup"),
    ("food-grapes", GP + "item33_Icon_128.webp", "Wally's Grapes"),
    ("food-pudding", GP + "item31_Icon_128.webp", "Night Pudding"),
    # Deduction Record talents
    ("talent-mistosis", GP + "talent11_Icon_128.webp", "Wally's Mistosis Section"),
    ("talent-relic", GP + "talent09_Icon_128.webp", "Wally's Relic Pouch"),
    ("talent-lunch", GP + "talent10_Icon_128.webp", "Wally's Special Lunch Box"),
    ("talent-chest", GP + "talent05_Icon_128.webp", "Legends of the Mist Monsters"),
]


def fetch(url):
    # The CDN (Cloudflare) has hotlink protection: without a tlidb.com Referer only already-cached files answer;
    # the rest get 403 (seen 2026-10-17).
    req = urllib.request.Request(url, headers={"User-Agent": "tli-events game_art.py", "Referer": "https://tlidb.com/"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
    except urllib.error.HTTPError as e:
        raise ValueError(f"HTTP {e.code}: {url}") from e
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError(f"not a WebP: {url}")
    return data


def trim(data):
    """Crop to the visible pixels (alpha > 0), centred on a square canvas with a small margin."""
    im = Image.open(io.BytesIO(data)).convert("RGBA")
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if box:
        im = im.crop(box)
    side = round(max(im.size) * 1.06)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    canvas.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return canvas


def main():
    os.makedirs(ART, exist_ok=True)
    rows = []
    for ident, path, what in ICONS:
        url = CDN + path
        trim(fetch(url)).save(os.path.join(ART, ident + ".webp"), "WEBP", quality=90, method=6)
        rows.append(f"| {ident} | {what} | {url} |")
        time.sleep(0.3)  # be gentle with a fan site's CDN
    with open(os.path.join(ART, "SOURCES.md"), "w", encoding="utf-8") as f:
        f.write(
            "# Game art — sources\n\n"
            "Generated by `scripts/game_art.py` — edit the ICONS table there, not this file.\n"
            "Game-client icons as mirrored by tlidb.com's CDN (current build, SS13/SS14), transparent margin trimmed.\n\n"
            "| id | what | source |\n|---|---|---|\n" + "\n".join(rows) + "\n"
        )
    print(f"{len(rows)} icons → {ART}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # noqa: BLE001 — report and fail the run
        print(f"error: {e}", file=sys.stderr)
        sys.exit(1)
