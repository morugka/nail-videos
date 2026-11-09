# Нагадування про запис — сторіс

Вертикальна сторіс 1080×1920, 13 с, зібрана в [Remotion](https://remotion.dev).

- `out/booking-reminder.mp4` — анімована сторіс
- `out/booking-reminder.png` — статична версія (останній кадр)
- `src/Story.tsx` — тексти (`POINTS`, заголовок, кнопка)

## Як працювати

```bash
npm i
npx remotion studio                                                       # попередній перегляд
npx remotion render BookingStory out/booking-reminder.mp4 --crf=16 --pixel-format=yuv420p
npx remotion still BookingStory out/booking-reminder.png --frame=380
```
