"""Готує фон 1080×1920 з фото 4:5: опускає чорну точку фону до ~#0A0A0A
і добудовує темний низ кадру тим самим тоном із легким зерном, щоб не було шва.
Використання: python3 prep916.py photos/in.jpg photos/out-916.png [зсув_фото_вниз]"""
import sys

import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0
W, H = 1080, 1920

im = Image.open(src).convert('RGB')
im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
a = np.asarray(im, dtype=np.float32)

# Чорна точка: темні ділянки тягнемо до нейтрального тону не світлішого за #0A0A0A
# (прибирає і сіруватий, і синюватий відтінок фону), світлі майже не чіпаємо.
lum = a.mean(axis=2, keepdims=True)
weight = np.clip(1 - lum / 90, 0, 1)
bg = a[-120:].reshape(-1, 3).mean(axis=0)
a = a - weight * (bg - min(bg.min(), 10))
a = np.clip(a, 0, 255)

canvas = np.zeros((H, W, 3), np.float32)
fill = a[-60:].reshape(-1, 3).mean(axis=0)
canvas[:] = fill
rng = np.random.default_rng(7)
canvas += rng.normal(0, 1.0, canvas.shape)
h = min(a.shape[0], H - offset)
canvas[offset:offset + h] = a[:h]
if offset:
    canvas[:offset] = fill + rng.normal(0, 1.0, (offset, W, 3))

Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).save(dst)
print(dst, 'fill', fill.round(1))
