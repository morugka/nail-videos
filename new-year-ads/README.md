# Новорічна реклама — 3 рілси

Вертикальні відео 1080×1920 без звуку (музику додати в Instagram), зібрані в [Remotion](https://remotion.dev).

- `out/ny-designs.mp4` — новорічний дизайн
- `out/ny-extensions.mp4` — нарощування до свят
- `out/ny-short.mp4` — короткі нігті
- `public/media/<designs|extensions|short>/` — фото/відео робіт (.jpg/.png або .mp4); список файлів і підписи — масив `ADS` у `src/Composition.tsx`
- `public/km-logo.png` — логотип у верхньому лівому куті

## Як працювати

```bash
npm i
npx remotion studio
npx remotion render NY-designs out/ny-designs.mp4 --crf=18 --pixel-format=yuv420p
```
