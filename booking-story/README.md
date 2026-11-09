# Сторіс про запис

Дві вертикальні сторіс 1080×1920, зібрані в [Remotion](https://remotion.dev). Публікувати по черзі:

1. `out/1-divchata.mp4` — «Дівчата!»: вікон стає менше, працюю навіть без світла (11 с)
2. `out/2-booking-reminder.mp4` — «Записуйтесь заздалегідь» і кнопка «Напишіть «ЗАПИС» у Direct» (13 с)

Поруч лежать статичні версії (`.png`).

- `src/Hype.tsx` — перша сторіс
- `src/Story.tsx` — друга сторіс і спільні елементи (кольори, логотип, золота лінія з ромбом)

## Як працювати

```bash
npm i
npx remotion studio                                                     # попередній перегляд
npx remotion render HypeStory out/1-divchata.mp4 --crf=16 --pixel-format=yuv420p
npx remotion render BookingStory out/2-booking-reminder.mp4 --crf=16 --pixel-format=yuv420p
```
