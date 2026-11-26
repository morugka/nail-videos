"""Brand-style cover for a still photo: deep black background + gold serif titles.
Nails and skin are left untouched: only near-neutral dark pixels (the backdrop) are changed.

usage: python3 scripts/photo_cover.py IN.png OUT_DIR
"""
import sys, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

src, out_dir = sys.argv[1], sys.argv[2]
FONTS = os.path.join(os.path.dirname(__file__), "..", "public", "fonts")
GOLD = (201, 164, 107)
GOLD_LIGHT = (226, 196, 140)
IVORY = (236, 230, 218)

im = cv2.imread(src).astype(np.float32)
H, W = im.shape[:2]

# --- backdrop mask: dark AND colourless (skin & nails always carry colour) ---
chroma = im.max(2) - im.min(2)
lum = im.mean(2)
bg = np.clip((14 - chroma) / 8, 0, 1) * np.clip((70 - lum) / 25, 0, 1)
bg = cv2.morphologyEx(bg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
bg = cv2.GaussianBlur(bg, (0, 0), 3)
# hard guard: never touch anything with visible colour
protect = cv2.dilate((chroma > 16).astype(np.float32), np.ones((9, 9), np.uint8))
protect = cv2.GaussianBlur(protect, (0, 0), 3)
bg = bg * (1 - protect)

# backdrop → deep near-black with a slight warm-neutral tint, like the feed
target = np.array([9, 10, 11], np.float32)  # BGR
deep = target + (im - im.mean(2, keepdims=True)) * 0.3 + (lum[..., None] - 25) * 0.25
deep = np.clip(deep, 0, 255)
out = im * (1 - bg[..., None]) + deep * bg[..., None]
cv2.imwrite(os.path.join(out_dir, "mask_debug.png"), (bg * 255).astype(np.uint8))

clean = Image.fromarray(cv2.cvtColor(out.astype(np.uint8), cv2.COLOR_BGR2RGB))
clean.save(os.path.join(out_dir, "photo_clean.jpg"), quality=96)

# --- typography ---
def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)

def spaced(d, xy, text, f, fill, spacing, anchor_left=True):
    x, y = xy
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + spacing * (len(text) - 1)
    if not anchor_left:
        x -= total / 2
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + spacing
    return total

def divider(d, cx, y, half, col):
    d.line([(cx - half, y), (cx + half, y)], fill=col, width=2)
    r = 5
    d.polygon([(cx, y - r), (cx + r, y), (cx, y + r), (cx - r, y)], fill=col)

cover = clean.copy()
d = ImageDraw.Draw(cover)
s = W / 1080

# logo, top-left (KM / NAIL ARTIST)
lx, ly = int(48 * s), int(40 * s)
fk = font("Cormorant.ttf", int(58 * s))
d.text((lx, ly), "K", font=fk, fill=GOLD_LIGHT)
kw = d.textlength("K", font=fk)
d.text((lx + kw - 8 * s, ly + 14 * s), "M", font=fk, fill=GOLD_LIGHT)
fs = font("Cinzel.ttf", int(11 * s))
logo_w = kw + d.textlength("M", font=fk) - 8 * s
tw = spaced(d, (lx + logo_w / 2, ly + 84 * s), "NAIL ARTIST", fs, GOLD, 2 * s, anchor_left=False)
divider(d, lx + logo_w / 2, ly + 108 * s, tw / 2 + 4, GOLD)

# title block, top-left free area
tx = int(60 * s)
ft = font("Cinzel.ttf", int(64 * s))
spaced(d, (tx, int(215 * s)), "ICE", ft, IVORY, 6 * s)
fi = font("Cormorant-Italic.ttf", int(70 * s))
d.text((tx, int(278 * s)), "Queen", font=fi, fill=GOLD_LIGHT)
fsub = font("Cormorant.ttf", int(19 * s))
spaced(d, (tx + 2, int(380 * s)), "НАРОЩУВАННЯ · СТИЛЕТ", fsub, GOLD, 3 * s)
d.line([(tx + 2, int(418 * s)), (tx + 2 + 90 * s, int(418 * s))], fill=GOLD, width=2)

cover.save(os.path.join(out_dir, "photo_cover.jpg"), quality=96)
# 4:5 Instagram post size
cover.resize((1080, int(round(1080 * H / W))), Image.LANCZOS).save(
    os.path.join(out_dir, "photo_cover_1080.jpg"), quality=95)
print("ok", W, H)
