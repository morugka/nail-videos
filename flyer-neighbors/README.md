# Листівка для під'їзду — манікюр та педикюр

A4 вертикальна, українською, для кольорового принтера (під скло в під'їзді).

- `flyer-A4.pdf` — файл для друку (друкувати «за розміром сторінки», без масштабування)
- `flyer-preview.png` — превʼю
- `flyer.html` — сам макет: текст і кольори правляться тут
- `instagram-card.png` — QR-картка Instagram (@moruga_nailart), вирізана з оригіналу
- `telegram-card.png` — QR-картка Telegram (@gremuchka), вирізана з оригіналу
- `photos/` — фото робіт для смуги внизу (кадрування — `object-position` у `flyer.html`)

Перезібрати PDF і PNG після правок:

```bash
NODE_PATH=$(npm root -g) node render.js
```
