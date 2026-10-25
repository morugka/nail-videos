"""Точкова ретуш: кутик нігтя (низ біля вільного краю) вийшов блідішим і сірішим за решту покриття.
Підтягуємо колір (a/b у Lab) ділянки до кольору того ж стовпчика трохи вище, яскравість не чіпаємо —
так зберігається світлотінь і блиск. Маска м'яка, фон і ланцюжок відсікаються.
Використання: python3 fix_corner.py вхід.jpg вихід.jpg x0 x1 y0 y1 ref_y0 ref_y1"""
import sys

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, __file__.rsplit('/', 1)[0])
from match_color_lib import lab_to_srgb, srgb_to_lab  # noqa: E402

src, dst = sys.argv[1], sys.argv[2]
x0, x1, y0, y1, ry0, ry1 = map(int, sys.argv[3:9])

img = Image.open(src).convert('RGB')
rgb = np.asarray(img, np.float64)
lab = srgb_to_lab(rgb)
smooth = srgb_to_lab(np.asarray(img.filter(ImageFilter.GaussianBlur(2)), np.float64))
H, W = lab.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]


def ramp(v, a, b, f):
    """1 всередині [a, b], плавно до 0 за f px назовні (smoothstep)."""
    t = np.clip(np.minimum(v - a, b - v) / f + 1, 0, 1)
    return t * t * (3 - 2 * t)


chroma = np.hypot(lab[..., 1], lab[..., 2])
nail = np.clip((lab[..., 0] - 20) / 8, 0, 1) * np.clip((chroma - 8) / 5, 0, 1)
w = ramp(xx, x0, x1, 6) * ramp(yy, y0, y1, 10) * nail

ref = np.median(smooth[ry0:ry1], axis=0)          # колір кожного стовпчика вище по нігтю
out = lab.copy()
out[..., 1:] += ref[None, :, 1:] - smooth[..., 1:]
res = rgb * (1 - w[..., None]) + lab_to_srgb(out) * w[..., None]
Image.fromarray(res.round().astype(np.uint8)).save(dst, quality=95, subsampling=0, optimize=True)
print(dst)
