# Обробка фону: рука, нігті й рукав лишаються як є, фон розмивається, приглушується й темнішає.
# python3 process.py — з source/ у photos/. Маски з masks.py (isnet-general-use) + детекція шкіри,
# щоб друга рука чи пальці на краю кадру не потрапили у фон.
import pathlib
import cv2
import numpy as np

root = pathlib.Path(__file__).resolve().parent.parent
MODEL = 'isnet-general-use'

# name: (яскравість фону, насиченість фону, додати маску шкіри); None — фон уже темний, лише копія
PHOTOS = {
    '01': None,
    '02': None,  # фон — біла сорочка, вже чистий
    '03': None,
    '04': (0.40, 0.30, False),
    '05': (0.40, 0.35, False),
    '06': (0.40, 0.40, False),
    '07': (0.42, 0.35, False),
    '08': (0.45, 0.40, False),
    '09': (0.40, 0.35, True),
    '10': (0.42, 0.35, True),
}


def skin_mask(img):
    ycc = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(ycc)
    m = ((cr > 138) & (cr < 175) & (cb > 85) & (cb < 128) & (y > 70)).astype(np.uint8) * 255
    k = max(3, img.shape[1] // 300)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((k, k), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] > 0.004 * m.size:
            keep[lab == i] = 255
    return keep


def subject_mask(name, img, skin):
    m = cv2.imread(str(root / 'masks' / f'{name}-{MODEL}.png'), cv2.IMREAD_GRAYSCALE)
    m = cv2.resize(m, (img.shape[1], img.shape[0]))
    if skin:
        m = np.maximum(m, skin_mask(img))
        # закриваємо щілини між пальцями й кінчиками нігтів (білі краї не схожі на шкіру)
        c = img.shape[1] // 25
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (c, c)))
    # трохи розширюємо, щоб краї нігтів точно лишились незмінними
    r = max(5, img.shape[1] // 300)
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r, r)))
    m = cv2.GaussianBlur(m, (0, 0), r / 2)
    return m.astype(np.float32)[..., None] / 255


def process(name, bright, sat, skin):
    src = next((root / 'source').glob(f'{name}.*'))
    img = cv2.imread(str(src))
    out = root / 'photos' / f'{name}.jpg'
    if bright is None:
        cv2.imwrite(str(out), img, [cv2.IMWRITE_JPEG_QUALITY, 95])
        return
    a = subject_mask(name, img, skin)
    f = img.astype(np.float32)
    # розмиття лише фону (без «ореолу» шкіри навколо руки)
    s = img.shape[1] / 90
    w = cv2.GaussianBlur(1 - a, (0, 0), s)[..., None] + 1e-4
    bg = cv2.GaussianBlur(f * (1 - a), (0, 0), s) / w
    grey = bg.mean(2, keepdims=True)
    bg = (grey + (bg - grey) * sat) * bright
    bg = bg * np.array([0.96, 0.98, 1.0], np.float32)  # легкий теплий відтінок, як у бренді
    res = f * a + bg * (1 - a)
    cv2.imwrite(str(out), np.clip(res, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])


if __name__ == '__main__':
    (root / 'photos').mkdir(exist_ok=True)
    for name, cfg in PHOTOS.items():
        process(name, *(cfg or (None, None, False)))
        print(name, flush=True)
