# ТЕМНО-ЗЕЛЕНИЙ #0056 — рилс з фото

Вертикальне відео 1080×1920, ~14 с, зібране в [Remotion](https://remotion.dev) з шести архівних фото.
Сюжет: «Чорний?» → «Ні. Темно-зелений.» → на світлі → «Смарагд у тіні» → флакон #0056 і запис.

- `out/dark-green-0056-reels.mp4` — готовий ролик (без звуку: трек додається в Instagram)
- `out/covers/` — обкладинки «Я від цього відмовилася і тільки виграла» (лише руки), `src/Hands.tsx`
- `public/photos/` — фото в порядку появи; `graded/` — ті самі фото з підсиленим зеленим
- `public/logo-full.png`, `public/logo-km.png` — логотип для фіналу і маленький знак
- `scripts/green.py` — підсилює темно-зелений на нігтях, не чіпаючи шкіру й фон
- `src/Composition.tsx` — плани, наближення, титри

## Як працювати

```bash
npm i
npx remotion studio                                                   # попередній перегляд
npx remotion render GreenReel out/dark-green-0056-reels.mp4 --crf=16 --concurrency=1  # рендер
npx remotion still HandsCover out/covers/vidmovylasia-cover.jpg --jpeg-quality=95  # обкладинка
```
