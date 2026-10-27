"""Lift the dark green of the nails so it doesn't read as black on a phone screen.

Only dark green/teal pixels are touched (weighted by hue, saturation and value),
so skin, the silver ring and the grey sleeve stay as they are.

    python3 scripts/green.py public/photos/2-fist.jpg public/photos/graded/2-fist.jpg
    # 5-edge.jpg was graded cold, its nails sit at ~200°: aim wider and push harder
    python3 scripts/green.py public/photos/5-edge.jpg public/photos/graded/5-edge.jpg 185 30 2.2
"""
import sys

import numpy as np
from PIL import Image

HUE_CENTER = 150  # degrees; the nails sit at 155–175 in the photos, the bottle label at ~125
HUE_WIDTH = 45
TARGET_HUE = 140  # pull the teal cast toward the real shade of #0056
SAT_GAIN = 1.6
VAL_GAIN = 1.45


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def grade(src, dst, center=HUE_CENTER, width=HUE_WIDTH, sat_gain=SAT_GAIN):
    im = Image.open(src).convert("RGB")
    hsv = np.asarray(im.convert("HSV")).astype(float)
    h = hsv[..., 0] * 360 / 255
    s = hsv[..., 1] / 255
    v = hsv[..., 2] / 255

    hue_w = 1 - smoothstep(width * 0.5, width, np.abs(h - center))
    sat_w = smoothstep(0.12, 0.3, s)  # near-neutral backdrop and sleeve stay put
    val_w = smoothstep(0.02, 0.06, v) * (1 - smoothstep(0.35, 0.6, v))  # dark tones only
    w = hue_w * sat_w * val_w

    h2 = h + (TARGET_HUE - h) * 0.5 * w
    s2 = np.clip(s * (1 + (sat_gain - 1) * w), 0, 1)
    v2 = np.clip(v * (1 + (VAL_GAIN - 1) * w), 0, 1)

    out = np.dstack([h2 * 255 / 360, s2 * 255, v2 * 255]).round().astype("uint8")
    Image.fromarray(out, "HSV").convert("RGB").save(dst, quality=92)


if __name__ == "__main__":
    extra = [float(x) for x in sys.argv[3:]]
    grade(sys.argv[1], sys.argv[2], *extra)
