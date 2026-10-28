# Майстри зажралися, або...? — крик душі майстра (Reels)

Вертикальне відео 1080×1920, ~107 с, без звуку (музику додати в Instagram). Зібране в [Remotion](https://remotion.dev).

- `out/master-prices-reels.mp4` — готовий ролик
- `src/numbers.ts` — **усі цифри**: ціна, кількість клієнток, години, статті витрат «до» і «після» подорожчання. Решта (зарплата, ₴/год, −%, «чесна» ціна) перераховується сама
- `src/Composition.tsx` — сцени й тексти (відповіді на закиди — масив `OBJECTIONS`)
- `public/photos/` — фонові фото для обкладинки, «Куди ви піднімаєте ціни?!» і фіналу (зараз тимчасово кадри з CURSE OF THE DEEP; замінити — константи `PHOTO_*`)

## Як працювати

```bash
npm i
npx remotion studio                                                         # попередній перегляд
npx remotion render PriceReel out/master-prices-reels.mp4 --crf=18 --pixel-format=yuv420p
```
