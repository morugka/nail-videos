# Denim bottle — dark background

Source clips: release "Колаж" (`lv_0_20261029081352.mp4`, `VID_20261028_231429_862_bsl.mp4`).

Output (1080×1920, 9:16):
- `out/denim-bottle-black.mp4` — from `lv_0_20261029081352.mp4` (30 fps, audio kept)
- `out/denim-bottle-brush.mp4` — from `VID_20261028_231429_862_bsl.mp4` (60 fps)

What the script does:
- Background replaced with an even dark tone (RGB 12,12,15) with light grain; shadows and dust are flattened.
- Bottle label in the brush clip is matched to the denim blue of the black-background clip.
- Polish (jar, brush) is left untouched.

Re-run: `pip install opencv-python-headless numpy`, then from `scripts/`:
`python3 process.py <lv_0...mp4> <VID_...mp4> ../out/denim-bottle-black.mp4 ../out/denim-bottle-brush.mp4`
