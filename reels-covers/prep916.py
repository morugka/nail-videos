"""Готує фон 1080×1920 з фото 4:5: опускає чорну точку фону до ~#0A0A0A
і добудовує темний низ кадру тим самим тоном із легким зерном, щоб не було шва.
Використання: python3 prep916.py photos/in.jpg photos/out-916.png [зсув_вниз] [масштаб] [x_початку_кадру]
Масштаб і x — у пікселях оригіналу; без них фото вписується по ширині."""
import sys

import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0
W, H = 1080, 1920

im = Image.open(src).convert('RGB')
scale = float(sys.argv[4]) if len(sys.argv) > 4 else W / im.width
x0 = int(sys.argv[5]) if len(sys.argv) > 5 else 0
im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
im = im.crop((round(x0 * scale), 0, round(x0 * scale) + W, im.height))
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
top = max(offset, 0)
h = min(a.shape[0] + min(offset, 0), H - top)
canvas[top:top + h] = a[-min(offset, 0):-min(offset, 0) + h]
if offset > 0:
    canvas[:offset] = fill + rng.normal(0, 1.0, (offset, W, 3))

Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).save(dst)
print(dst, 'fill', fill.round(1))
