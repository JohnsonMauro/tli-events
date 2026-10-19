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
    ("tool-revenge", "124_live_tw_instrument_revenge.webp", (226, 137, 275, 275), "Avenger's Casket (art of the Traditional Chinese live client card, print 124)"),
    ("tool-keys", "44_live_instrument_offer.webp", (1161, 374, 253, 253), "Lost Ring of Keys"),
    ("tool-shackles", "128_live_tw_instrument_shackles.webp", (174, 134, 268, 268), "Long-Chained Shackles (art of the Traditional Chinese live client card, print 128)"),
    ("tool-cage", "109_live_tw_instrument_cage.webp", (178, 137, 274, 274), "Crowded Beastcage (art of the Traditional Chinese live client card, print 109)"),
    ("tool-coin", "111_live_tw_instrument_coin.webp", (186, 138, 277, 277), "Kin's Coin of Fate (art of the Traditional Chinese live client card, print 111)"),
    ("tool-claws", "110_live_tw_instrument_claws.webp", (196, 139, 277, 277), "Filthy Claws: Alpha Wolf (art of the Traditional Chinese live client card, print 110)"),
    ("tool-shortchain", "69_live_instrument_short_chained_shackles.webp", (251, 242, 259, 259), "Short-Chained Shackles"),
    ("tool-muzzle", "122_live_tw_instrument_muzzle.webp", (220, 139, 277, 277), "Raging Beast's Agonizing Muzzle (art of the Traditional Chinese live client card, print 122)"),
    ("tool-saw", "126_live_tw_instrument_saw.webp", (192, 134, 267, 267), "Rusty Saw (art of the Traditional Chinese live client card, print 126)"),
    ("tool-scales", "127_live_tw_instrument_scales.webp", (220, 131, 262, 262), "Warden's Scales (art of the Traditional Chinese live client card, print 127)"),
    ("tool-rope", "125_live_tw_instrument_rope.webp", (230, 137, 274, 274), "Hangman's Noose (art of the Traditional Chinese live client card, print 125)"),
    ("tool-pestle", "74_live_objective_reward_scapegoat_pestle_fire.webp", (913, 254, 260, 260), "Iron Pestle (live; replaces the VOD crop)"),
    ("tool-crown", "113_live_tw_instrument_crown.webp", (192, 133, 266, 266), "Iron Crown of the Prison King: Berserk Lion (art of the Traditional Chinese live client card, print 113)"),
    ("tool-blacklist", "108_live_tw_instrument_blacklist.webp", (192, 133, 265, 265), "Executioner's Blacklist (art of the Traditional Chinese live client card, print 108)"),
    ("tool-ravenous", "123_live_tw_instrument_ravenous.webp", (191, 131, 261, 261), "Ferocious Beast's Ravenous Chains (art of the Traditional Chinese live client card, print 123)"),
    ("tool-trap", "130_live_tw_instrument_trap.webp", (148, 101, 202, 202), "Blood-Stained Trap: Berserk Lion (art of the Traditional Chinese live client card, print 130)"),
    ("tool-whip", "131_live_tw_instrument_whip.webp", (196, 137, 274, 274), "Barbed Whip (art of the Traditional Chinese live client card, print 131)"),
    ("tool-stake", "129_live_tw_instrument_stake.webp", (186, 132, 263, 263), "Burning Stake (art of the Traditional Chinese live client card, print 129)"),
    ("tool-forged", "116_live_tw_instrument_forged.webp", (201, 133, 265, 265), "Forged Key (art of the Traditional Chinese live client card, print 116)"),
    ("tool-tongs", "37_vod_torture_set_tongs_ratheads_guillotine.jpg", (378, 272, 213, 213), "Iron Tongs of Lust: Mammoth"),
    ("tool-skewer", "78_live_instrument_skewered_rat_heads.webp", (150, 108, 270, 270), "Skewered Rat Heads: Colossal Rat (live; replaces the VOD crop)"),
    ("tool-hook", "118_live_tw_instrument_hook.webp", (194, 133, 265, 265), "Sorting Hook (art of the Traditional Chinese live client card, print 118)"),
    ("tool-axe", "107_live_tw_instrument_axe.webp", (196, 136, 272, 272), "Gaoler's Execution Axe (art of the Traditional Chinese live client card, print 107)"),
    ("tool-collar", "112_live_tw_instrument_collar.webp", (178, 137, 273, 273), "Maddened Beast's Barbed Collar (art of the Traditional Chinese live client card, print 112)"),
    ("tool-maiden", "120_live_tw_instrument_maiden.webp", (199, 132, 264, 264), "Severed Iron Maiden (art of the Traditional Chinese live client card, print 120)"),
    ("tool-scapegoat", "74_live_objective_reward_scapegoat_pestle_fire.webp", (250, 234, 300, 300), "Scapegoat's Guillotine"),
    ("tool-ironbox", "119_live_tw_instrument_ironbox.webp", (206, 133, 266, 266), "Squirming Iron Box: Colossal Rat (art of the Traditional Chinese live client card, print 119)"),
    ("tool-dogtag", "114_live_tw_instrument_dogtag.webp", (178, 138, 275, 275), "Felon's Dog Tag (art of the Traditional Chinese live client card, print 114)"),
    ("tool-guillotine", "117_live_tw_instrument_guillotine.webp", (173, 137, 275, 275), "Fanged Guillotine: Alpha Wolf (art of the Traditional Chinese live client card, print 117)"),
    ("tool-fire", "115_live_tw_instrument_fire.webp", (176, 137, 273, 273), "Searing Branding Iron (art of the Traditional Chinese live client card, print 115)"),
    ("tool-maul", "121_live_tw_instrument_maul.webp", (181, 131, 262, 262), "Elephant-Foot Maul: Mammoth (art of the Traditional Chinese live client card, print 121)"),
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
    ("event-portion", "93_live_incident_extra_portion.webp", (240, 128, 1118, 1118), "Extra Portion"),
    ("event-crow", "97_live_incident_crow_whispers.webp", (240, 128, 1118, 1118), "Crow Whispers"),
    ("event-usurp", "102_live_incident_usurpation_1.webp", (240, 128, 1118, 1118), "Usurpation I-III (IV shows Liliah and Lilim)"),
    ("event-transfer", "132_live_incident_transfer_of_convicts.webp", (200, 200, 1000, 1000), "Transfer of Convicts (same art as Usurpation I-III; box lowered: a game toast covers the top)"),
    ("event-ratway", "62_live_incident_sewer_ratway.webp", (240, 128, 1118, 1118), "Sewer Ratway"),
    ("event-convict", "64_live_incident_high_risk_convict.webp", (240, 128, 1118, 1118), "High-Risk Convict (same art as Taste of Freedom)"),
    ("event-appetite", "68_live_incident_ravenous_appetite.webp", (240, 128, 1118, 1118), "Ravenous Appetite"),
    ("event-archenemy", "75_live_incident_archenemy.webp", (240, 128, 1118, 1118), "Archenemy (not in the simulator)"),
    ("event-chain", "32_vod_incident_chain_reaction.jpg", (150, 100, 760, 760), "Chain Reaction"),
    ("event-execution", "33_vod_incident_execution_efficiency.jpg", (150, 100, 760, 760), "Execution Efficiency"),
    # run start (live client)
    ("compass-1", "42_live_entry_mode_compass.webp", (1864, 260, 148, 213), "Darkiron Shackles compass"),
    ("compass-2", "42_live_entry_mode_compass.webp", (2031, 260, 144, 213), "Mercury Shackles compass"),
    ("compass-3", "42_live_entry_mode_compass.webp", (2197, 260, 144, 213), "Redgold Shackles compass"),
    ("card-ironlaw", "46_live_start_card_iron_law.webp", (1174, 208, 199, 199), "Iron Law"),
    ("card-cagefight", "95_live_start_card_cage_fight.webp", (271, 58, 145, 145), "Cage Fight"),
    ("card-tyranny", "106_live_start_card_tyranny.webp", (1174, 208, 199, 199), "Tyranny"),
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
