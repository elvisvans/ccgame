# Generate high-detail pixel rooms (FRLG-style interiors / park)
from pathlib import Path

OUT = Path(__file__).resolve().parent
PX = 2
W, H = 320, 220  # logical pixels
VW, VH = W * PX, H * PX


def R(x, y, w, h, c):
    return f'<rect x="{x*PX}" y="{y*PX}" width="{w*PX}" height="{h*PX}" fill="{c}"/>'


def blit(rows, ox, oy, pal):
    out = []
    for j, row in enumerate(rows):
        i = 0
        while i < len(row):
            ch = row[i]
            if ch == "." or ch not in pal:
                i += 1
                continue
            n = 1
            while i + n < len(row) and row[i + n] == ch:
                n += 1
            out.append(R(ox + i, oy + j, n, 1, pal[ch]))
            i += n
    return out


def wood_floor():
    parts = [R(0, 92, W, H - 92, "#c48a4a")]
    # plank rows
    colors = ["#c48a4a", "#b87c3e", "#d09a58", "#a86e34"]
    y = 92
    row = 0
    while y < H:
        h = 8 if row % 2 == 0 else 7
        c = colors[row % 4]
        parts.append(R(0, y, W, h, c))
        # plank seams
        shift = 18 if row % 2 else 0
        x = shift
        while x < W:
            parts.append(R(x, y, 1, h, "#8a5528"))
            x += 36
        parts.append(R(0, y + h - 1, W, 1, "#9a6230"))
        y += h
        row += 1
    return parts


def wall():
    parts = [
        R(0, 0, W, 18, "#4e8a62"),  # ceiling band
        R(0, 18, W, 3, "#3a6a4a"),
        R(0, 21, W, 71, "#efe0b4"),
        R(0, 89, W, 3, "#c9a56a"),
    ]
    # wall texture dots
    for y in range(26, 86, 10):
        for x in range(8 + (y % 20), W, 22):
            parts.append(R(x, y, 2, 2, "#e4d2a2"))
    return parts


WINDOW = [
    "AAAAAAAAAAAAAAAA",
    "ABBBBBBBBBBBBBBA",
    "ABCCCCCCCCCCCCBA",
    "ABCCDDCCCCCCCCBA",
    "ABCCDDCCCCCCCCBA",
    "ABCCCCCCCCCCCCBA",
    "ABEEEEEEEEEEEEBA",
    "ABCCCCCCCCCCCCBA",
    "ABCCCCCCCCCCCCBA",
    "ABCCCCCCCCCCCCBA",
    "ABCCCCCCCCCCCCBA",
    "ABBBBBBBBBBBBBBA",
    "AAAAAAAAAAAAAAAA",
]
WIN_PAL = {
    "A": "#6a4220",
    "B": "#8a5a30",
    "C": "#7ec4ef",
    "D": "#d8f0ff",
    "E": "#6a4220",
}

BOOKS = [
    "HHHHHHHHHHHH",
    "HrrrrbbggyyH",
    "HrrrrbbggyyH",
    "HHHHHHHHHHHH",
    "HppppooonnnH",
    "HppppooonnnH",
    "HHHHHHHHHHHH",
    "HyyyyrrbbggH",
    "HyyyyrrbbggH",
    "HHHHHHHHHHHH",
    "HnnnnooopppH",
    "HnnnnooopppH",
    "HHHHHHHHHHHH",
]
BOOK_PAL = {
    "H": "#7a4a22",
    "r": "#c94a4a",
    "b": "#3d74c9",
    "g": "#3f9a4a",
    "y": "#e6c14a",
    "p": "#9b5bb5",
    "o": "#d47a2a",
    "n": "#5a8aaa",
}

PLANT = [
    "..ggGG..",
    ".gGGGgg.",
    "ggGggGG.",
    ".GGggGG.",
    "..PPPP..",
    "..PppP..",
    "..PPPP..",
]
PLANT_PAL = {"g": "#2f8a38", "G": "#56b85f", "P": "#8a5528", "p": "#c98442"}

TV = [
    "NNNNNNNNNNNN",
    "NkkkkkkkkkkN",
    "NksssssssskN",
    "NksswssssskN",
    "NksssssssskN",
    "NksssssssskN",
    "NkkkkkkkkkkN",
    "NNNNNNNNNNNN",
    "..nn....nn..",
]
TV_PAL = {"N": "#4a4a4a", "k": "#2a2a2a", "s": "#5a8aaa", "w": "#cfe8f8", "n": "#6a6a6a"}

BED = [
    "wwwwwwwwwwwwwwwwwwwwwwww",
    "wWWWWWWWWWWWWWWWWWWWWWWw",
    "RRwwwwwwwwwwwwwwwwwwwwww",
    "RRWWWWWWWWWWWWWWWWWWWWWW",
    "RRbbbbbbbbbbbbbbbbbbbbbb",
    "RRbbbbbbbbbbbbbbbbbbbbbb",
    "RRbbbbbbbbbbbbbbbbbbbbbb",
    "RRbbbbbbbbbbbbbbbbbbbbbb",
    "hhWWWWWWWWWWWWWWWWWWWWWh",
    "hhhhhhhhhhhhhhhhhhhhhhhh",
    "h......................h",
]
BED_PAL = {
    "w": "#f4f0e8",
    "W": "#fffaf2",
    "R": "#d45a5a",
    "b": "#4f9ad4",
    "h": "#8a5528",
}

DOOR = [
    "DDDDDDDDDDDD",
    "DddddddddddD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmkmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DdmmmmmmmmdD",
    "DddddddddddD",
    "DDDDDDDDDDDD",
]
DOOR_PAL = {"D": "#5a3214", "d": "#7a4a22", "m": "#c98442", "k": "#e6c14a"}

TABLE = [
    "tttttttttttttttttttt",
    "tTTTTTTTTTTTTTTTTTTt",
    "tttttttttttttttttttt",
    ".ll..............ll.",
    ".ll..............ll.",
    ".ll..............ll.",
    ".ll..............ll.",
]
TABLE_PAL = {"t": "#8a5528", "T": "#c98442", "l": "#6e421e"}

CHAIR = [
    ".ccccc.",
    ".cCCCc.",
    ".ccccc.",
    "cc...cc",
    "cc...cc",
    "cc...cc",
]
CHAIR_PAL = {"c": "#8a5528", "C": "#c98442"}

LAMP = [
    ".yyyy.",
    "yYYYYy",
    "yYwwYy",
    "yyyyyy",
    "..nn..",
    "..nn..",
    "..nn..",
    ".nnnn.",
]
LAMP_PAL = {"y": "#e6c14a", "Y": "#ffe066", "w": "#fff3a8", "n": "#6e421e"}

APPLE = [
    "..g.",
    ".rrr",
    "rRrr",
    "rrrr",
    ".rr.",
]
APPLE_PAL = {"g": "#3f9a4a", "r": "#e04b4b", "R": "#ff7a7a"}

BALL = [
    ".wwrr.",
    "wwbbrr",
    "wwbbrr",
    "rrbbww",
    "rrbbww",
    ".rrww.",
]
BALL_PAL = {"w": "#f4f4f4", "r": "#e04b4b", "b": "#3d7cc9"}

RUG = [
    "....rrrrrrrrrrrrrrrrrrrr....",
    "..rrRRRRRRRRRRRRRRRRRRRRrr..",
    ".rRRyyyyyyyyyyyyyyyyyyyyRRr.",
    "rRRyyyyyyyyyyyyyyyyyyyyyyRRr",
    "rRRyyyyyyyyyyyyyyyyyyyyyyRRr",
    "rRRyyyyyyyyyyyyyyyyyyyyyyRRr",
    ".rRRyyyyyyyyyyyyyyyyyyyyRRr.",
    "..rrRRRRRRRRRRRRRRRRRRRRrr..",
    "....rrrrrrrrrrrrrrrrrrrr....",
]
RUG_PAL = {"r": "#a84444", "R": "#c75a5a", "y": "#e8d29a"}

NIGHT = [
    "nnnnnn",
    "nNNNNn",
    "nNnnNn",
    "nNNNNN",
    "nnnnnn",
]
NIGHT_PAL = {"n": "#6e421e", "N": "#a86a32"}


def home_svg():
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">' % (VW, VH)]
    parts += wall()
    parts += wood_floor()
    parts += blit(WINDOW, 14, 28, WIN_PAL)
    parts += blit(BOOKS, 78, 36, BOOK_PAL)
    parts += blit(PLANT, 118, 52, PLANT_PAL)
    parts += blit(TV, 148, 48, TV_PAL)
    parts += blit(DOOR, 268, 28, DOOR_PAL)
    parts += blit(RUG, 118, 148, RUG_PAL)
    parts += blit(BED, 8, 108, BED_PAL)
    parts += blit(NIGHT, 78, 128, NIGHT_PAL)
    parts += blit(LAMP, 78, 100, LAMP_PAL)
    parts += blit(TABLE, 150, 122, TABLE_PAL)
    parts += blit(CHAIR, 196, 128, CHAIR_PAL)
    parts += blit(APPLE, 168, 114, APPLE_PAL)
    parts += blit(BALL, 128, 162, BALL_PAL)
    # small picture frame on wall
    parts += [R(230, 32, 22, 18, "#8a5528"), R(232, 34, 18, 14, "#7ec4ef"), R(236, 38, 6, 6, "#ffe066")]
    parts.append("</svg>")
    return "\n".join(parts)


# --- playground ---
TREE = [
    "......GGGG......",
    "....GGGggGGG....",
    "...GGggGGggGG...",
    "..GGggGGGgggGG..",
    "..GgGGgggGGggG..",
    ".GGggGGGGGggGG.",
    ".GggGGgggGGggG.",
    "..GGGggGGggGG..",
    "...GGttttGG....",
    ".....tttt......",
    ".....tTTt......",
    ".....tTTt......",
    ".....tTTt......",
    ".....tTTt......",
    "....ttTTtt.....",
]
TREE_PAL = {"G": "#2f8a38", "g": "#56b85f", "t": "#8a5528", "T": "#a86a32"}

SLIDE = [
    "ss..........",
    "ssBBBBBB....",
    "ss....BBBB..",
    "ss......BBB.",
    "ss.......BB.",
    "ss........BB",
    "ss.........B",
    "ss..........",
    "ss..........",
    "ss..........",
    "ss..........",
    "ss..........",
]
SLIDE_PAL = {"s": "#c9a06a", "B": "#3d7cc9"}

SWING = [
    "pppppppppppppppp",
    "p..............p",
    "p.ll........ll.p",
    "p.ll........ll.p",
    "p.ll........ll.p",
    "p.ll........ll.p",
    "p.ll........ll.p",
    "p.llllllllllll.p",
    "p....rrrrrr....p",
    "p..............p",
    "p..............p",
    "p..............p",
    "pp............pp",
]
SWING_PAL = {"p": "#6e421e", "l": "#555555", "r": "#e04b4b"}

FLOWER = [
    ".pp.",
    "pYYp",
    "pYYp",
    ".gg.",
    ".gg.",
    ".gg.",
]
FLOWER_PAL = {"p": "#e85a8c", "Y": "#ffe066", "g": "#3f9a4a"}

HAT = [
    "..kkkk..",
    ".kKKKKk.",
    ".kKrrKk.",
    ".kKKKKk.",
    "kkkkkkkk",
]
HAT_PAL = {"k": "#2a2a2a", "K": "#3d3d3d", "r": "#e04b4b"}

BENCH = [
    "nnnnnnnnnnnnnnnnnn",
    "nNNNNNNNNNNNNNNNNn",
    "nnnnnnnnnnnnnnnnnn",
    ".ll............ll.",
    ".ll............ll.",
    ".ll............ll.",
]
BENCH_PAL = {"n": "#6e421e", "N": "#a86a32", "l": "#5a3214"}


def playground_svg():
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">' % (VW, VH)]
    # sky
    parts.append(R(0, 0, W, 88, "#6ec4f0"))
    parts.append(R(0, 0, W, 16, "#5ab4e6"))
    # sun
    parts += [R(286, 8, 18, 18, "#ffe066"), R(290, 12, 10, 10, "#fff3a0")]
    # clouds
    for cx, cy in ((22, 16), (200, 20), (120, 10)):
        parts += [R(cx, cy + 4, 28, 8, "#fff"), R(cx + 6, cy, 16, 8, "#fff")]
    # distant trees / hedge
    parts.append(R(0, 72, W, 16, "#3d8b42"))
    for x, h in ((4, 18), (22, 22), (44, 16), (240, 20), (268, 18), (292, 22)):
        parts.append(R(x, 72 - h + 16, 16, h, "#4aa24e" if x % 8 == 0 else "#2f8a38"))
    # fence
    parts.append(R(0, 86, W, 4, "#c9a06a"))
    for x in range(6, W, 14):
        parts.append(R(x, 80, 3, 14, "#b8894e"))
    # grass
    parts.append(R(0, 90, W, H - 90, "#6fc45e"))
    for y in range(90, H, 10):
        parts.append(R(0, y + 6, W, 1, "#5aad4c"))
    for x, y in ((16, 100), (70, 150), (210, 118), (280, 170), (40, 190), (250, 140)):
        parts.append(R(x, y, 6, 4, "#8ed97c"))
    # path
    parts += [R(108, 148, 104, 16, "#e2c48a"), R(116, 164, 88, 8, "#d4b06e")]
    parts += blit(TREE, 8, 70, TREE_PAL)
    parts += blit(SLIDE, 78, 108, SLIDE_PAL)
    parts += blit(SWING, 168, 78, SWING_PAL)
    parts += blit(BENCH, 232, 142, BENCH_PAL)
    parts += blit(HAT, 244, 126, HAT_PAL)
    parts += blit(FLOWER, 64, 168, FLOWER_PAL)
    parts += blit(FLOWER, 78, 176, FLOWER_PAL)
    parts += blit(BALL, 132, 172, BALL_PAL)
    parts.append("</svg>")
    return "\n".join(parts)


def main():
    (OUT / "home.svg").write_text(home_svg(), encoding="utf-8")
    (OUT / "playground.svg").write_text(playground_svg(), encoding="utf-8")
    print("wrote", OUT / "home.svg", OUT / "playground.svg")


if __name__ == "__main__":
    main()
