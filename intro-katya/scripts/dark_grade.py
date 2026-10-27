"""Dark, muted grade of a whole photo for the feed — colour work only, no cut-out, no spotlight.

Usage: python dark_grade.py photo.jpg out.jpg
A graduated darkening from the top (like an ND filter) takes the sky down, saturated blues and
greens are muted gently, skin and the white dress keep their tone; the corners get a soft falloff.
"""
import sys

import cv2
import numpy as np

src, out = sys.argv[1:3]
img = cv2.imread(src)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
h, s, v = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255


def band(lo, hi, soft=8):
    """0..1 weight for hues in [lo, hi] (OpenCV hue 0..180), soft edges."""
    return np.clip((h - lo + soft) / soft, 0, 1) * np.clip((hi - h + soft) / soft, 0, 1)


# only coloured pixels count: the white dress and grey stone keep their tone
colourful = np.clip((s - 0.22) / 0.2, 0, 1)
blue = band(88, 130) * colourful
green = band(28, 88) * colourful

v = v * (1 - blue * 0.3) * (1 - green * 0.25)
s = s * (1 - blue * 0.55) * (1 - green * 0.35)
# everything a little lower and more contrasty
v = np.clip((v - 0.5) * 1.06 + 0.46, 0, 1)
s = s * 0.85

hsv[..., 1], hsv[..., 2] = s * 255, v * 255
res = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) / 255
# warm, like the gold of the page
res *= np.array([0.93, 0.99, 1.05], np.float32)

H, W = res.shape[:2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# graduated filter: strongest at the top edge, gone by the middle of the frame
grad = np.clip(1 - yy / (H * 0.5), 0, 1) ** 1.3
res *= (1 - 0.68 * grad)[..., None]

# soft wide vignette
d = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.75)) ** 2)
res *= (1 - 0.45 * np.clip(d - 0.4, 0, 1) ** 1.2)[..., None]

cv2.imwrite(out, np.clip(res * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
