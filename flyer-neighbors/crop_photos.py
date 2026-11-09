# Crops each work photo to a 6:5 tile so the nails fill the same share of every tile.
# box = nail area as fractions of the original (x0, x1, y0, y1); zoom evens out nail size between photos.
from PIL import Image
R, FILL = 1.2, 0.78
PHOTOS = {
    "3-nude":     (1.27, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/0f132a87-image.jpg", (0.42, 0.74, 0.25, 0.58)),
    "1-blue":     (1.25, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/9f1e43fc-image.jpg", (0.33, 0.80, 0.21, 0.69)),
    "2-lavender": (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/2d3c188a-image.png", (0.21, 0.80, 0.43, 0.79)),
    "4-orange":   (0.68, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/2f270f65-image.jpg", (0.47, 0.87, 0.51, 0.71)),
    "6-black":    (1.0, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/4329541a-image.jpg", (0.29, 0.85, 0.26, 0.63)),
    "5-violet":   (0.95, "/root/.claude/uploads/b5200142-a841-52fb-b455-56b14ba612ff/9015da72-image.jpg", (0.34, 0.81, 0.41, 0.65)),
}
for name, (zoom, src, (x0, x1, y0, y1)) in PHOTOS.items():
    im = Image.open(src).convert("RGB"); W, H = im.size
    bw, bh = (x1 - x0) * W, (y1 - y0) * H
    w = max(bw / FILL, bh / FILL * R) / zoom; h = w / R
    if w > W: w, h = W, W / R
    if h > H: h, w = H, H * R
    cx, cy = (x0 + x1) / 2 * W, (y0 + y1) / 2 * H
    x = max(0, min(cx - w / 2, W - w)); y = max(0, min(cy - h / 2, H - h))
    c = im.crop((int(x), int(y), int(x + w), int(y + h))); c.thumbnail((1000, 1000))
    c.save(f"photos/{name}.jpg", quality=92); print(name, c.size)
