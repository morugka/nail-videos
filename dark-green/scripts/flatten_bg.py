"""Even out a dark studio backdrop: near-black pixels are pulled to one flat black,
brighter or warm detail (hand, nails, dried stems, lace) stays as is.

    python3 scripts/flatten_bg.py public/photos/7-branch.jpg public/photos/graded/7-branch.jpg
"""
import sys

import numpy as np
from PIL import Image

TARGET = np.array([9, 9, 11], dtype=float)  # close to the reel backdrop #0b0b0d
LOW, HIGH = 12, 24  # 8-bit luminance: fully flattened below LOW, untouched above HIGH
# the backdrop is neutral to bluish; dried stems and shadowed skin are warm (red > blue)
WARM_LOW, WARM_HIGH = 2, 7


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def flatten(src, dst):
    im = np.asarray(Image.open(src).convert("RGB")).astype(float)
    dark = 1 - smoothstep(LOW, HIGH, im.mean(axis=2))
    neutral = 1 - smoothstep(WARM_LOW, WARM_HIGH, im[..., 0] - im[..., 2])
    w = (dark * neutral)[..., None]
    out = im * (1 - w) + TARGET * w
    Image.fromarray(out.round().clip(0, 255).astype("uint8")).save(dst, quality=93)


if __name__ == "__main__":
    flatten(sys.argv[1], sys.argv[2])
