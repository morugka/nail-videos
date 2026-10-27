"""Puts the person from a photo on a near-black background, the way the feed's covers look.

Usage: python dark_cover.py photo.jpg mask.png out.jpg
The mask comes from rembg (u2net_human_seg, only_mask=True).
"""
import sys

import cv2
import numpy as np

W, H = 1080, 1920
SCALE = 1.0  # of the 1080-wide fit; at 1.0 the whole figure fits under the title
BLACK = 0.03

src, mask_path, out = sys.argv[1:4]

img = cv2.imread(src).astype(np.float32) / 255
mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
# pull the edge in a little and soften it: no light halo from the sky, hair does not look cut out
mask = cv2.erode(mask, np.ones((3, 3), np.uint8), iterations=2)
mask = cv2.GaussianBlur(mask, (0, 0), 2.0)

# background: colourless, blurred, very dark — railing and trees are only hinted
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)[..., None].repeat(3, axis=2)
bg = cv2.GaussianBlur(gray, (0, 0), 5) * 0.16 * np.array([0.85, 0.95, 1.1], np.float32)

# person: a touch more contrast and warmth
fg = np.clip((img - 0.5) * 1.06 + 0.5, 0, 1) * np.array([0.96, 1.0, 1.04], np.float32)
comp = fg * mask[..., None] + bg * (1 - mask[..., None])

# scale, then centre the frame on the person
s = W / img.shape[1] * SCALE
pw, ph = int(img.shape[1] * s), int(img.shape[0] * s)
comp = cv2.resize(comp, (pw, ph), interpolation=cv2.INTER_LANCZOS4)
mres = cv2.resize(mask, (pw, ph))
cols = np.where(mres.max(axis=0) > 0.5)[0]
cx = int((cols.min() + cols.max()) / 2)
# pad with the dark background if the photo is not wider than the frame, then cut it around the person
pad = W // 2
comp = cv2.copyMakeBorder(comp, 0, 0, pad, pad, cv2.BORDER_REPLICATE)
mres = cv2.copyMakeBorder(mres, 0, 0, pad, pad, cv2.BORDER_CONSTANT, value=0)
x0 = int(cx + pad - W / 2)
comp = comp[:, x0 : x0 + W]

canvas = np.full((H, W, 3), BLACK, np.float32)
top = H - ph
canvas[top:] = comp
# fade the photo's top edge into black
fade = np.clip(np.arange(ph) / 300.0, 0, 1)[:, None, None]
canvas[top:] = canvas[top:] * fade + BLACK * (1 - fade)

# vignette on the background only, so the edges melt into black
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.62) / (H * 0.5)) ** 2)
vig = np.clip(1.15 - d, 0, 1)[..., None]
mcanvas = np.zeros((H, W), np.float32)
mcanvas[top:] = mres[:, x0 : x0 + W]
mc = mcanvas[..., None]
canvas = canvas * mc + (canvas * vig + BLACK * (1 - vig)) * (1 - mc)

cv2.imwrite(out, np.clip(canvas * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
