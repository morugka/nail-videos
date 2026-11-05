# Піна — короткий ролик (Reels)

Вертикальне відео 1080×1920, 30 к/с, ~5 с, без звуку.

- `out/bsl-reels.mp4` — готовий ролик
- `source/original.mp4` — вихідне відео (1440×2560, 60 к/с, зі звуком)
- `assets/logo-km.png` — знак KM (той самий, що в рилсі #0056)
- `scripts/grade.py` — обробка в стилі сторінки: глибше тло, спокійніші кольори навколо,
  тепла жива шкіра, віньєтка, знак KM зліва вгорі; колір нігтів не змінюється, звук прибрано

```bash
pip install opencv-python-headless numpy
python3 scripts/grade.py source/original.mp4 assets/logo-km.png out/bsl-reels.mp4
```
