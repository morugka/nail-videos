# PEACOCK — котяче око (Reels)

Манікюр «котяче око»: смарагд і кобальт, перо павича, чорне мереживо.

- `out/peacock-reels.mp4` — вертикальний ролик 1080×1920, ~20 с, з титрами
- `out/clips/` — короткі кліпи 8–10 с без титрів (для сторіз / каруселі)
- `out/peacock-full-graded.mp4` — все відео (3 хв) з кольорокорекцією, 1080×1920, 30 к/с
- `src/Composition.tsx` — монтаж: плани, наближення, титри
- `scripts/grade.py` — кольорокорекція під референсні фото: чорний фон,
  кобальтова смуга «котячого ока» на смарагдовій основі, теплий тон шкіри
- `scripts/process.py` — обробка вихідного відео

Вихідне відео (4K, 548 МБ) в репозиторій не входить — воно лежить на Google Drive.

## Як працювати

```bash
pip install opencv-python-headless numpy
python3 scripts/process.py source.mp4 public/graded.mp4     # кольорокорекція (~15 хв)

npm i
npx remotion studio                                          # попередній перегляд
npx remotion render NailReel out/peacock-reels.mp4 --crf=16  # рендер
```
