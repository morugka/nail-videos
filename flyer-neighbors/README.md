# Листівка для під'їзду — манікюр та педикюр

A4 вертикальна, українською, для кольорового принтера (під скло в під'їзді).

- `flyer-A4.pdf` — темна версія для друку (друкувати в масштабі 100%)
- `flyer-light-A4.pdf` — світла версія, окремий шаблон: заголовок по центру, 3 пункти в ряд, 8 постановочних фото сіткою 4×2 (`flyer-light.html`, `flyer-light-preview.png`, фото в `photos-light/`)
- `flyer-preview.png` — превʼю
- `flyer.html` — сам макет: текст і кольори правляться тут
- `instagram-card.png` — QR-картка Instagram (@moruga_nailart), вирізана з оригіналу
- `telegram-card.png` — QR-картка Telegram (@gremuchka), вирізана з оригіналу
- `photos/` — 6 фото робіт; обрізаються скриптом `python3 crop_photos.py` (рамка нігтів + zoom, щоб нігті були одного розміру); світлі — `python3 crop_photos.py light`

Перезібрати PDF і PNG після правок:

```bash
NODE_PATH=$(npm root -g) node render.js              # темна
NODE_PATH=$(npm root -g) node render.js flyer-light  # світла
```
