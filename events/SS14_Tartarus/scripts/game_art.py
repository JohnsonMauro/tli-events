#!/usr/bin/env python3
"""Cut the game's own art out of the screenshots in images/ for the site.

Every crop is a plain rectangle from an image already indexed in
images/INDEX.md (source, date, transcription). The CROPS table below is the
record of where each piece of art comes from; the script writes:

  art/<id>.webp     one file per crop (read by src/pages/ss14/index.astro)
  art/SOURCES.md    the same table, readable: id, source image, box

Needs Pillow (not stdlib, unlike update_data.py). Run by hand when a crop
changes; the 6-hourly workflow does not run it.

Usage:  python3 -I scripts/game_art.py
"""
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, "images")
ART = os.path.join(ROOT, "art")
MAX_SIDE = 480  # downscale anything bigger; the site shows icons at <=120 px

# id, source image in images/, (x, y, w, h) in source pixels, note
BOARD = "45_live_board_day1.webp"
VOD_CHAIN = "55_vod_food_chain_all_color.jpg"
CROPS = [
    # board and its pieces (live client, day 1 of a 30-day run)
    ("board", BOARD, (520, 80, 1500, 900), "board background; cells 4/6/8/11 hold inmates in the shot; warden marker covered (PATCHES)"),
    ("office", BOARD, (582, 118, 219, 193), "cell 1, the Interrogation Room (office)"),
    ("tile-locked", BOARD, (1520, 118, 206, 193), "cell 5, locked"),
    ("tile-open", BOARD, (1520, 118, 206, 118), "cell 5 without its lock band, stands in for an opened empty cell"),
    ("warden", BOARD, (789, 265, 66, 67), "warden marker"),
    ("incident", BOARD, (757, 565, 34, 64), "Prison Incident marker (cell 15)"),
    ("fangs", BOARD, (1846, 488, 60, 44), "red fangs = has a target it can consume (cell 8)"),
    ("door", BOARD, (767, 1022, 103, 120), "destination card 'Go to Cell 3', locked door"),
    # the four inmates (official preview VOD, 1:45)
    ("mammoth", VOD_CHAIN, (220, 98, 146, 176), "Mammoth"),
    ("lion", VOD_CHAIN, (474, 98, 146, 176), "Berserk Lion"),
    ("wolf", VOD_CHAIN, (474, 340, 146, 176), "Alpha Wolf"),
    ("rat", VOD_CHAIN, (220, 340, 146, 176), "Colossal Rat"),
    # in-client rules screen: counters + rarity ranking
    ("rules-counters", "47_live_rules_inmate_info_counters.webp", (308, 409, 958, 538), "Devouring Relationship + Rarity Ranking"),
    # daily decision buttons (official preview VOD ~1:21)
    ("act-consume", "27_vod_board_numbering_decision_menu.jpg", (563, 758, 100, 100), "Consume"),
    ("act-replace", "27_vod_board_numbering_decision_menu.jpg", (908, 758, 100, 100), "Replace"),
    ("act-end", "27_vod_board_numbering_decision_menu.jpg", (1253, 758, 100, 100), "End"),
    # Torture Instruments: card art (ids match data/tartarus_data.json "tools")
    ("tool-revenge", "44_live_instrument_offer.webp", (484, 353, 300, 280), "Avenger's Casket"),
    ("tool-keys", "44_live_instrument_offer.webp", (1123, 353, 300, 280), "Lost Ring of Keys"),
    ("tool-shackles", "44_live_instrument_offer.webp", (1761, 361, 300, 275), "Long-Chained Shackles"),
    ("tool-cage", "67_live_objective_reward_cage_whip_coin.webp", (484, 353, 300, 280), "Crowded Beastcage"),
    ("tool-coin", "67_live_objective_reward_cage_whip_coin.webp", (1761, 361, 300, 275), "Kin's Coin of Fate"),
    ("tool-claws", "66_live_instrument_offer_saw_stake_claws.webp", (1761, 361, 300, 275), "Filthy Claws: Alpha Wolf (not in the simulator yet, so the site doesn't list it)"),
    ("tool-shortchain", "69_live_instrument_short_chained_shackles.webp", (210, 230, 300, 260), "Short-Chained Shackles"),
    ("tool-muzzle", "34_vod_torture_set_casket_muzzle_saw.jpg", (847, 270, 220, 165), "Raging Beast's Agonizing Muzzle"),
    ("tool-saw", "34_vod_torture_set_casket_muzzle_saw.jpg", (1327, 270, 220, 165), "Rusty Saw"),
    ("tool-scales", "35_vod_torture_set_scales_noose_pestle.jpg", (367, 270, 220, 165), "Warden's Scales"),
    ("tool-rope", "35_vod_torture_set_scales_noose_pestle.jpg", (847, 270, 220, 165), "Hangman's Noose"),
    ("tool-pestle", "35_vod_torture_set_scales_noose_pestle.jpg", (1327, 270, 220, 165), "Iron Pestle"),
    ("tool-whip", "73_live_instrument_offer_maiden_whip_shackles.webp", (893, 260, 300, 260), "Barbed Whip (live; replaces the VOD crop)"),
    ("tool-stake", "36_vod_torture_set_whip_stake_key.jpg", (847, 270, 220, 165), "Burning Stake"),
    ("tool-forged", "36_vod_torture_set_whip_stake_key.jpg", (1327, 270, 220, 165), "Forged Key"),
    ("tool-tongs", "37_vod_torture_set_tongs_ratheads_guillotine.jpg", (367, 270, 220, 165), "Iron Tongs of Lust: Mammoth"),
    ("tool-skewer", "37_vod_torture_set_tongs_ratheads_guillotine.jpg", (847, 270, 220, 165), "Skewered Rat Heads: Colossal Rat"),
    ("tool-hook", "71_live_instrument_offer_fire_hook_axe.webp", (787, 170, 300, 260), "Sorting Hook"),
    ("tool-axe", "71_live_instrument_offer_fire_hook_axe.webp", (1440, 175, 300, 260), "Gaoler's Execution Axe"),
    ("tool-collar", "72_live_instrument_offer_hook_collar_shackles.webp", (498, 135, 180, 150), "Maddened Beast's Barbed Collar"),
    ("tool-maiden", "73_live_instrument_offer_maiden_whip_shackles.webp", (250, 254, 300, 260), "Severed Iron Maiden"),
    ("tool-ironbox", "38_vod_squirming_iron_box_rat_nest.jpg", (87, 328, 74, 100), "Squirming Iron Box: Colossal Rat (small icon from the left Torture Instrument panel)"),
    ("tool-dogtag", "70_live_objective_reward_dogtag_guillotine_fire.webp", (236, 240, 300, 250), "Felon's Dog Tag"),
    ("tool-guillotine", "70_live_objective_reward_dogtag_guillotine_fire.webp", (873, 240, 300, 250), "Fanged Guillotine: Alpha Wolf (live; replaces the VOD crop)"),
    ("tool-fire", "70_live_objective_reward_dogtag_guillotine_fire.webp", (1510, 240, 300, 250), "Searing Branding Iron"),
    # Warden's Treasures (official preview VOD ~3:59; ids match "gifts")
    ("gift-ring", "39_vod_wardens_treasure_chromatic.jpg", (200, 260, 220, 200), "Three-Headed Thumb Ring"),
    ("gift-horn", "39_vod_wardens_treasure_chromatic.jpg", (635, 260, 220, 200), "Brass Horn of Strife"),
    ("gift-wine", "39_vod_wardens_treasure_chromatic.jpg", (1075, 265, 220, 200), "Crimson Vintage"),
    ("gift-brand", "39_vod_wardens_treasure_chromatic.jpg", (1515, 260, 220, 200), "Brand of Original Sin"),
    # Prison Incident cards: the illustration (ids match "events"; "shared" is not in the simulator)
    ("event-trickster", "58_live_incident_behind_closed_doors.webp", (240, 128, 1118, 1118), "Behind Closed Doors"),
    ("event-shared", "59_live_incident_shared_fortune.webp", (240, 128, 1118, 1118), "Shared Fortune"),
    ("event-hunt", "60_live_incident_treasure_hunt.webp", (240, 128, 1118, 1118), "\"Treasure\" Hunt"),
    ("event-freedom", "61_live_incident_taste_of_freedom.webp", (240, 128, 1118, 1118), "Taste of Freedom"),
    ("event-ratway", "62_live_incident_sewer_ratway.webp", (240, 128, 1118, 1118), "Sewer Ratway"),
    ("event-convict", "64_live_incident_high_risk_convict.webp", (240, 128, 1118, 1118), "High-Risk Convict (same art as Taste of Freedom)"),
    ("event-appetite", "68_live_incident_ravenous_appetite.webp", (240, 128, 1118, 1118), "Ravenous Appetite"),
    ("event-chain", "32_vod_incident_chain_reaction.jpg", (150, 100, 760, 760), "Chain Reaction"),
    ("event-execution", "33_vod_incident_execution_efficiency.jpg", (150, 100, 760, 760), "Execution Efficiency"),
    # run start (live client)
    ("compass-1", "42_live_entry_mode_compass.webp", (1864, 260, 148, 213), "Darkiron Shackles compass"),
    ("compass-2", "42_live_entry_mode_compass.webp", (2031, 260, 144, 213), "Mercury Shackles compass"),
    ("compass-3", "42_live_entry_mode_compass.webp", (2197, 260, 144, 213), "Redgold Shackles compass"),
    ("card-ironlaw", "46_live_start_card_iron_law.webp", (1174, 208, 199, 199), "Iron Law"),
]


# The board shot has the warden marker at the 1/16/2 corner; the site draws its
# own marker, so that corner is covered with its mirror image from the 6/7 corner.
# id -> list of (x1, y1, x2, y2) boxes in crop pixels, mirrored left-right.
PATCHES = {"board": [(258, 178, 342, 262)]}


def patch(ident, piece):
    for x1, y1, x2, y2 in PATCHES.get(ident, []):
        w = piece.width
        mirror = piece.crop((w - x2, y1, w - x1, y2)).transpose(Image.FLIP_LEFT_RIGHT)
        piece.paste(mirror, (x1, y1))
    return piece


def main():
    os.makedirs(ART, exist_ok=True)
    rows = []
    for ident, src, (x, y, w, h), note in CROPS:
        im = Image.open(os.path.join(IMAGES, src))
        if x + w > im.width or y + h > im.height:
            raise ValueError(f"{ident}: box {x},{y},{w},{h} outside {src} ({im.width}x{im.height})")
        piece = patch(ident, im.convert("RGB").crop((x, y, x + w, y + h)))
        if max(piece.size) > MAX_SIDE and ident != "board":
            piece.thumbnail((MAX_SIDE, MAX_SIDE))
        piece.save(os.path.join(ART, ident + ".webp"), quality=88)
        rows.append(f"| `{ident}` | {note} | [{src}](../images/{src}) | {x},{y} {w}×{h} |")
    with open(os.path.join(ART, "SOURCES.md"), "w", encoding="utf-8") as f:
        f.write("# Game art — sources\n\n")
        f.write("Generated by `scripts/game_art.py` — edit the CROPS table there, not this file.\n")
        f.write("Each piece is a rectangle cut from an image indexed in [images/INDEX.md](../images/INDEX.md); box = x,y w×h in source pixels.\n\n")
        f.write("| id | what | source image | box |\n|---|---|---|---|\n")
        f.write("\n".join(rows) + "\n")
    print(f"{len(rows)} crops -> {ART}")


if __name__ == "__main__":
    main()
