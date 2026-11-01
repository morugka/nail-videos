# Turn the engraved-outline logo into solid glyphs: strokes come from local darkness,
# then regions are filled by even-odd depth (outside = 0, glyph body = 1, counter = 2 ...)
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("L")
a = np.asarray(im).astype(float)
b = np.asarray(im.filter(ImageFilter.GaussianBlur(6))).astype(float)
d = np.clip(b - a, 0, None)[170:750, 420:1000]
stroke = d > 5
stroke = ndi.binary_closing(stroke, iterations=2)
lab, n = ndi.label(~stroke)
outside = lab[0, 0]
depth = {outside: 0}
frontier = [outside]
while frontier:
    nxt = []
    for r in frontier:
        grown = ndi.binary_dilation(lab == r, iterations=4)
        for q in np.unique(lab[grown]):
            if q and q not in depth:
                depth[q] = depth[r] + 1
                nxt.append(q)
    frontier = nxt
fill = np.zeros_like(stroke)
for r, dep in depth.items():
    if dep % 2 == 1:
        fill |= lab == r
solid = fill | stroke
# soft alpha from the solid mask
alpha = Image.fromarray((solid * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.7))
ys, xs = np.nonzero(solid)
box = (xs.min() - 4, ys.min() - 4, xs.max() + 5, ys.max() + 5)
gold = Image.new("RGBA", alpha.size, (201, 163, 106, 0))
gold.putalpha(alpha)
gold.crop(box).save(out)
print(n, len(depth), box)
