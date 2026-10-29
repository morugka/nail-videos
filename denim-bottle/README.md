# Denim bottle — dark background

Source clips: release "Колаж" (`lv_0_20261029081352.mp4`, `VID_20261028_231429_862_bsl.mp4`).

Output (1080×1920, 9:16):
- `out/denim-bottle-black.mp4` — from `lv_0_20261029081352.mp4` (30 fps, audio kept)
- `out/denim-bottle-brush.mp4` — from `VID_20261028_231429_862_bsl.mp4` (60 fps)

What the script does:
- Bottle is cut out with the rembg `isnet-general-use` model; everything else, shadows included, becomes one even dark tone (RGB 12,12,15) with light grain.
- Bottle label in the brush clip is matched to the denim blue of the black-background clip.
- Polish (jar, brush) is left untouched.

Re-run: `pip install opencv-python-headless numpy "rembg[cpu]"`, then from `scripts/`:
`python3 process.py <lv_0...mp4> <VID_...mp4> ../out/denim-bottle-black.mp4 ../out/denim-bottle-brush.mp4`

## Vertical collage

`out/denim-collage.mp4` — 1080×1920, 30 fps, 4.4 s, no audio. Three 1080×636 panels with 6 px dark dividers:
top — bottle with brush (`lv_0_20261029084516.mp4`), middle — nails (`lv_0_20261029090017.mp4`),
bottom — polish with brush (`lv_0_20261029090247.mp4`). Each source is cropped out of its letterbox and
scaled to fill its panel; length follows the shortest clip.
