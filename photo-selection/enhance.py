"""Делікатне покращення фото для Instagram без «пластику».
- фон: нейтральний глибокий чорний (прибирає сірий/синій відтінок тіней);
- ледь помітна мікроконтрастність, щоб блиск і бокові лінії нігтів читались чіткіше;
- шкіру, колір покриття й розмір не чіпаємо (1080×1350 — рідний формат 4:5).
Використання: python3 enhance.py original/10.jpg enhanced/10.jpg [сила_різкості]"""
import sys

import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
amount = int(sys.argv[3]) if len(sys.argv) > 3 else 35

im = Image.open(src).convert('RGB')
a = np.asarray(im, dtype=np.float32)
lum = a.mean(axis=2, keepdims=True)

# Тіні до нейтрального тону ~#0B0B0B; вага плавно спадає до нуля на середніх тонах.
weight = np.clip(1 - lum / 80, 0, 1) ** 1.5
dark = a[lum[..., 0] < 35]
bg = np.median(dark, axis=0) if len(dark) else np.array([11, 11, 11])
a = a - weight * (bg - min(bg.min(), 11))
a = np.clip(a, 0, 255)

out = Image.fromarray(a.astype(np.uint8))
# М'яка мікроконтрастність: великий радіус, малий відсоток, поріг береже шкіру від зерна.
out = out.filter(ImageFilter.UnsharpMask(radius=2, percent=amount, threshold=3))
out.save(dst, quality=95, subsampling=0, optimize=True)
print(dst, 'bg', bg.round(1))
