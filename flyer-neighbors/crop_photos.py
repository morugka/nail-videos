# Crops each work photo to a 6:5 tile so the nails fill the same share of every tile.
# Usage: python3 crop_photos.py        -> photos/       (dark flyer)
#        python3 crop_photos.py light  -> photos-light/ (light flyer)
# box = nail area as fractions of the original (x0, x1, y0, y1); zoom evens out nail size between photos.
import os, sys
from PIL import Image
FILL = 0.78
PHOTOS = {
    "3-nude":     (1.27, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/0f132a87-image.jpg", (0.42, 0.74, 0.25, 0.58)),
    "1-cateye":   (1.08, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/9f1e43fc-image.jpg", (0.33, 0.80, 0.21, 0.69)),
    "2-lavender": (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/2d3c188a-image.png", (0.21, 0.80, 0.43, 0.79)),
    "4-orange":   (0.68, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/2f270f65-image.jpg", (0.47, 0.87, 0.51, 0.71)),
    "6-black":    (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/4329541a-image.jpg", (0.29, 0.85, 0.26, 0.63)),
    "5-violet":   (0.95, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/9015da72-image.jpg", (0.34, 0.81, 0.41, 0.65)),
}
LIGHT = {
    "red":       (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/0e14f453-image.jpg", (0.17, 0.77, 0.18, 0.53)),
    "lightblue": (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/25848f47-image.jpg", (0.30, 0.70, 0.27, 0.58)),
    "navy":      (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/d897d3c6-image.jpg", (0.12, 0.82, 0.31, 0.75)),
    "stiletto":  (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/fb7ec19d-image.jpg", (0.23, 0.78, 0.22, 0.59)),
    "coral":     (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/8e0fe90d-image.jpg", (0.12, 0.69, 0.10, 0.81)),
    "blueart":   (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/e7ab64d4-image.jpg", (0.09, 0.88, 0.08, 0.66)),
    "pinkbear":  (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/2716fe98-image.jpg", (0.27, 0.79, 0.27, 0.64)),
    "greensnake":(1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/3aae2cdb-image.jpg", (0.22, 0.76, 0.19, 0.80)),
}
light = len(sys.argv) > 1 and sys.argv[1] == "light"
R = 0.8 if light else 1.2  # tile width / height: portrait 4:5 for the light flyer, 6:5 for the dark one
OUT = "photos-light" if light else "photos"
os.makedirs(OUT, exist_ok=True)
for name, (zoom, src, (x0, x1, y0, y1)) in (LIGHT if light else PHOTOS).items():
    im = Image.open(src).convert("RGB"); W, H = im.size
    bw, bh = (x1 - x0) * W, (y1 - y0) * H
    w = max(bw / FILL, bh / FILL * R) / zoom; h = w / R
    if w > W: w, h = W, W / R
    if h > H: h, w = H, H * R
    cx, cy = (x0 + x1) / 2 * W, (y0 + y1) / 2 * H
    x = max(0, min(cx - w / 2, W - w)); y = max(0, min(cy - h / 2, H - h))
    c = im.crop((int(x), int(y), int(x + w), int(y + h))); c.thumbnail((1000, 1000))
    c.save(f"{OUT}/{name}.jpg", quality=92); print(name, c.size)
