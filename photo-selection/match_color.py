"""Вирівнює колір нюдового покриття під фото-еталон, не чіпаючи газету, сорочку й чорний фон.
Маска плавна: відбирає рожево-коричневі тони покриття (кут відтінку ~37° у Lab), шкіра
(жовтіша, ~48°) зачіпається слабко. Переносимо середній колір (a/b) і частину яскравості.
Використання: python3 match_color.py еталон.jpg вхід.jpg вихід.jpg [сила 0..1]"""
import sys

import numpy as np
from PIL import Image


def srgb_to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def lab_to_srgb(lab):
    fy = (lab[..., 0] + 16) / 116
    f = np.stack([fy + lab[..., 1] / 500, fy, fy - lab[..., 2] / 200], -1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * np.array([0.95047, 1.0, 1.08883])
    m = np.array([[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]])
    c = xyz @ m.T
    c = np.where(c > 0.0031308, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - 0.055, 12.92 * c)
    return np.clip(c * 255, 0, 255)


def nail_mask(lab):
    """Плавна вага покриття: насичені рожево-коричневі середні тони."""
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    chroma = np.hypot(a, b)
    hue = np.degrees(np.arctan2(b, a))
    w = np.clip((chroma - 10) / 8, 0, 1)            # газета, сорочка, фон — малонасичені
    w *= np.clip((L - 15) / 10, 0, 1) * np.clip((80 - L) / 10, 0, 1)
    w *= np.exp(-((hue - 37) / 8) ** 2)
    return w


ref_path, src_path, dst = sys.argv[1:4]
strength = float(sys.argv[4]) if len(sys.argv) > 4 else 0.85

ref = srgb_to_lab(np.asarray(Image.open(ref_path).convert('RGB'), np.float64))
src_rgb = np.asarray(Image.open(src_path).convert('RGB'), np.float64)
src = srgb_to_lab(src_rgb)

wr, ws = nail_mask(ref), nail_mask(src)
sel_r, sel_s = wr > 0.6, ws > 0.6
out = src.copy()
for ch in (1, 2):
    out[..., ch] = src[..., ch] + ref[..., ch][sel_r].mean() - src[..., ch][sel_s].mean()
# яскравість — половина різниці, щоб не ламати світлотінь кадру
out[..., 0] = src[..., 0] + 0.5 * (ref[..., 0][sel_r].mean() - src[..., 0][sel_s].mean())

w = (ws * strength)[..., None]
res = src_rgb * (1 - w) + lab_to_srgb(out) * w
Image.fromarray(res.round().astype(np.uint8)).save(dst, quality=95, subsampling=0, optimize=True)
print(dst, 'Lab до:', src[sel_s].mean(0).round(1), 'еталон:', ref[sel_r].mean(0).round(1))
