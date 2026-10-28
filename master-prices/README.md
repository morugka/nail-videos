# Майстри зажралися, або...? — крик душі майстра (Reels)

Вертикальне відео 1080×1920, ~109 с; звук лише у фінальному кадрі з сурком (музику додати в Instagram). Зібране в [Remotion](https://remotion.dev).

- `out/master-prices-reels.mp4` — готовий ролик
- `src/numbers.ts` — **усі цифри**: ціна, кількість клієнток, години, статті витрат «до» і «після» подорожчання. Решта (зарплата, ₴/год, −%, «чесна» ціна) перераховується сама
- `src/Composition.tsx` — сцени й тексти (відповіді на закиди — масив `OBJECTIONS`)

## Як працювати

```bash
npm i
npx remotion studio                                                         # попередній перегляд
npx remotion render PriceReel out/master-prices-reels.mp4 --crf=18 --pixel-format=yuv420p
```
