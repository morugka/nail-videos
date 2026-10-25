# CURSE OF THE DEEP — нейл-інсталяція (Reels)

Вертикальне відео 1080×1920, 15 с, зібране в [Remotion](https://remotion.dev).

- `out/curse-of-the-deep-reels.mp4` — готовий ролик (для телефону та Instagram)
- `source/original.mp4` — вихідне відео
- `public/clean.mp4` — вихідне відео з прибраним фоном і кольорокорекцією
- `src/Composition.tsx` — монтаж: плани, наближення, титри
- `scripts/` — обробка фону (Python + OpenCV)

## Як працювати

```bash
npm i
npx remotion studio                                   # попередній перегляд
npx remotion render NailReel out/curse-of-the-deep.mp4 --crf=16   # рендер
```

Повторна обробка фону (потрібні `pip install opencv-python-headless numpy`):

```bash
python3 scripts/process.py source/original.mp4 public/clean.mp4 scripts
```
