# CURSE OF THE DEEP — колаж (Reels)

Вертикальний колаж 1080×1920, 13 с, зібраний у [Remotion](https://remotion.dev).
Три панелі: зверху великий палець, посередині безіменний з кальмаром, знизу по черзі
вказівний (зелений), середній (фіолетове плетіння) і мізинець (мідний дріт).

- `out/nail-collage-reels.mp4` — готовий ролик (для телефону та Instagram)
- `source/` — вихідні відео (з релізу `Deep`)
- `public/*.mp4` — вирізані фрагменти: фон затемнено, шкіру оживлено, колір нігтів не змінено
- `src/Composition.tsx` — монтаж: кадрування кожної панелі, золоті лінії, титри
- `scripts/clean.py` — затемнення фону (Python + OpenCV)

| Панель | Файл | Звідки |
| --- | --- | --- |
| великий | `thumb.mp4` | `v58` 0–13.2 с |
| кальмар | `squid-a.mp4`, `squid-b.mp4` | `v48` 3–12.8 с, `v55` 10.3–14.3 с |
| інші три | `green.mp4`, `purple.mp4`, `copper.mp4` | `v58` 16.8–21.8 с, `v58` 37.3–42.3 с, `v49` 11.3–16.3 с |

## Як працювати

```bash
npm i
npx remotion studio                                          # попередній перегляд
npx remotion render NailCollage out/nail-collage-reels.mp4 --crf=16   # рендер
```

Повторна обробка фрагмента (потрібні `pip install opencv-python-headless numpy`):

```bash
python3 scripts/clean.py source/v48.mp4 3 12.8 public/squid-a.mp4 0.85
```
