import sys
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
shift = int(sys.argv[3]) if len(sys.argv) > 3 else 0  # push the photo down, cropping its bottom
W, H = 1080, 1920
IVORY, GOLD = (242, 236, 226), (201, 163, 106)
FONT = "/home/user/nail-videos/master-prices/public/fonts/Cormorant.ttf"

photo = Image.open(src).convert("RGB")
ph = round(photo.height * W / photo.width)
photo = photo.resize((W, ph), Image.LANCZOS)
top = H - ph + shift
# extend the background upward by stretching the photo's (near-black) top row
canvas = photo.crop((0, 0, W, 1)).resize((W, max(top, 1)))
canvas = canvas.resize((W, H)) if top <= 0 else canvas
full = Image.new("RGB", (W, H))
full.paste(canvas, (0, 0))
full.paste(photo, (0, top))
canvas = full
d = ImageDraw.Draw(canvas)

def font(size, wght):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([wght])
    return f

def spaced(text, y, f, fill, tracking):
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + tracking
    return total

title = font(104, 500)
y = 280
for line in ["КОЛІР З", "ХАРАКТЕРОМ"]:
    spaced(line, y, title, IVORY, 6)
    y += 112

# gold hairline divider with a diamond, as on the page covers
cy = y + 48
half = 230
for i in range(half - 14):
    a = int(255 * (i / (half - 14)))
    col = tuple(int(c * a / 255) for c in GOLD)
    d.line([(W / 2 - half + i, cy), (W / 2 - half + i + 1, cy)], fill=col, width=2)
    d.line([(W / 2 + half - i - 1, cy), (W / 2 + half - i, cy)], fill=col, width=2)
r = 8
d.polygon([(W / 2, cy - r), (W / 2 + r, cy), (W / 2, cy + r), (W / 2 - r, cy)], fill=GOLD)

spaced("DENIM", cy + 34, font(64, 600), GOLD, 22)
canvas.save(out, quality=95)
