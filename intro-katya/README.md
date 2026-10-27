# Знайомство з Катею — Reels для інтенсиву

Вертикальне відео 1080×1920, ~16 с, зібране в [Remotion](https://remotion.dev) з прогулянки в платті (алея → перила → набережна → вода).
Стиль сторінки: заголовки Cinzel, підписи Cormorant (без курсиву), золото `#c9a36a` і слонова кістка `#f2ece2`, знак KM у кутку, повний логотип у фіналі.

- `out/intro-katya-reels.mp4` — готовий ролик (без звуку: трек додається в Instagram)
- `source/original.mp4` — вихідне відео (720×1280, 53 с)
- `scripts/grade.sh` — 1080×1920, легке шумозаглушення, світліші тіні, тепліша шкіра, різкість → `public/clean.mp4`
- `src/Composition.tsx` — плани й титри (масив `SCENES`)
- `caption.md` — підпис до посту

## Як працювати

```bash
npm i
./scripts/grade.sh                                         # public/clean.mp4 (не в git)
npx remotion studio                                        # попередній перегляд
npx remotion render IntroReel out/intro-katya.mp4 --crf=16 --concurrency=2
```
