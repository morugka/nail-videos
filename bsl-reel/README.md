# Манікюр з ароматом кави — короткий ролик (Reels)

Вертикальне відео 1080×1920, 30 к/с, ~5 с, без звуку.
Хук: «Манікюр з ароматом кави» (пінка BIBLIOTEKA Clean Care, аромат Coffiton).

- `out/manikiur-z-aromatom-kavy.mp4` — готовий ролик: твоя обробка (`source/edit.mp4`) + знак KM + хук
- `out/bsl-reels.mp4` — альтернатива без хука: моя обробка з `scripts/grade.py`
- `source/original.mp4` — вихідне відео з телефона; `source/edit.mp4` — твоя обробка (зі звуком)
- `public/edit.mp4` — твоя обробка без звуку, основа ролика
- `src/Composition.tsx` — знак KM і хук
- `scripts/grade.py` — обробка в стилі сторінки (глибше тло, тепла шкіра, колір нігтів не змінюється)

## Як працювати

```bash
npm i
npx remotion studio                                                      # попередній перегляд
npx remotion render FoamReel out/manikiur-z-aromatom-kavy.mp4 --crf=16   # рендер
```
