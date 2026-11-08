# Запис на грудень — сторіс

Вертикальна сторіс 1080×1920, 14 с, зібрана в [Remotion](https://remotion.dev).

- `out/booking-story-december.mp4` — анімована сторіс
- `out/booking-story-december.png` — статична версія (останній кадр)
- `src/Story.tsx` — місяць, вільні дні (`FREE_DAYS`), тексти

## Як працювати

```bash
npm i
npx remotion studio                                                       # попередній перегляд
npx remotion render BookingStory out/booking-story-december.mp4 --crf=16 --pixel-format=yuv420p
npx remotion still BookingStory out/booking-story-december.png --frame=380
```
