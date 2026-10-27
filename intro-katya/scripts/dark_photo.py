"""Low-key grade of a whole photo for the dark feed: no cut-out, the light stays on the person.

Usage: python dark_photo.py photo.jpg out.jpg [photo_height] [top_y] [centre_x]
photo_height — height of the photo in the 1080×1920 frame; top_y — where it starts (the black
above is for the title); centre_x — horizontal centre of the crop, 0..1 of the photo width.
"""
import sys

import cv2
import numpy as np

W, H = 1080, 1920
BLACK = 0.03

src, out = sys.argv[1:3]
ph = int(sys.argv[3]) if len(sys.argv) > 3 else 1520
top = int(sys.argv[4]) if len(sys.argv) > 4 else 400
cx = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5

img = cv2.imread(src).astype(np.float32) / 255
s = ph / img.shape[0]
pw = int(img.shape[1] * s)
img = cv2.resize(img, (pw, ph), interpolation=cv2.INTER_AREA)

# muted colour and a deeper contrast; skin keeps a little warmth
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
hsv[..., 1] *= 0.72
img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
img = np.clip((img - 0.5) * 1.1 + 0.47, 0, 1) * np.array([0.95, 1.0, 1.04], np.float32)

canvas = np.full((H, W, 3), BLACK, np.float32)
x = int(W / 2 - cx * pw)
cx0, cy0 = max(0, x), max(0, top)
cx1, cy1 = min(W, x + pw), min(H, top + ph)
canvas[cy0:cy1, cx0:cx1] = img[cy0 - top : cy1 - top, cx0 - x : cx1 - x]

# light only around the person: an ellipse over the figure, the rest sinks into black
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - W / 2) / (W * 0.27)) ** 2 + ((yy - (top + ph * 0.55)) / (ph * 0.55)) ** 2)
light = np.clip(1.2 - d, 0, 1) ** 1.6
light = 0.05 + 0.95 * light
# photo edges (top and sides) fade out completely
edge = np.clip((yy - top) / 280.0, 0, 1) * np.clip((xx - x) / 120.0, 0, 1) * np.clip((x + pw - xx) / 120.0, 0, 1)
k = (light * edge)[..., None]
canvas = canvas * k + BLACK * (1 - k)

cv2.imwrite(out, np.clip(canvas * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])
