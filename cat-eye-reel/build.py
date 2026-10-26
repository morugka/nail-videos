"""Монтаж Reels «Котяче око»: вибрані шматки кліпів, ніготь у тій самій точці кадру,
темна обробка фону, написи. Результат: out/cat-eye-reel.mp4 (1080×1920, 30 fps, без звуку).

Кожен шматок: кліп, початок/кінець (с), швидкість, якір = центр кутикули й ширина нігтя
в пікселях кадру на початку шматка. Далі палець відстежується по шаблону (шкіра над кутикулою),
і кадр зсувається так, щоб кутикула завжди була в ANCHOR_OUT, а ніготь мав ширину NAIL_OUT."""
import subprocess
import sys

import cv2
import numpy as np

W, H, FPS = 1080, 1920, 30
ANCHOR_OUT = (540, 830)
NAIL_OUT = 270
CLIPS = 'clips/'

SEGMENTS = [
    # (кліп, t0, t1, швидкість, (cx, cy, ширина нігтя), напис)
    ('VID_20261009_125241_835_bsl.mp4', 0.0, 2.2, 1.0, (484, 757, 192), 'hook'),
    ('VID_20261007_195956.mp4', 5.5, 7.0, 1.0, (1057, 1472, 280), 's1'),
    ('VID_20261007_195956.mp4', 11.0, 17.0, 2.0, (1190, 1500, 293), 's2'),
    ('VID_20261007_203932.mp4', 0.0, 6.5, 1.3, (984, 1300, 405), 's3'),
    ('VID_20261007_203932.mp4', 8.0, 11.0, 1.0, (1053, 1531, 306), 'cta'),
]


def pick_frames(path, t0, t1, speed):
    """Кадри для виходу 30 fps: найближчий кадр джерела до кожного цільового моменту."""
    n = int(round((t1 - t0) / speed * FPS))
    targets = [t0 + i * speed / FPS for i in range(n)]
    cap = cv2.VideoCapture(path)
    out, prev, prev_t, i = [], None, -1.0, 0
    while i < n:
        ok, fr = cap.read()
        if not ok:
            break
        t = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
        while i < n and t >= targets[i]:
            # беремо ближчий із двох сусідніх кадрів
            out.append(fr if prev is None or abs(t - targets[i]) <= abs(prev_t - targets[i]) else prev)
            i += 1
        prev, prev_t = fr, t
    while len(out) < n:
        out.append(out[-1])
    return out


def track(frames, cx, cy, w):
    """Позиція кутикули в кожному кадрі: шаблон шкіри над кутикулою, пошук поблизу."""
    ds = 0.25 if frames[0].shape[1] > 1500 else 0.5
    g = [cv2.cvtColor(cv2.resize(f, None, fx=ds, fy=ds, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY) for f in frames]
    x0, x1 = int((cx - 0.9 * w) * ds), int((cx + 0.9 * w) * ds)
    y0, y1 = int((cy - 1.3 * w) * ds), int((cy + 0.2 * w) * ds)
    tpl = g[0][y0:y1, x0:x1]
    off = np.array([cx * ds - x0, cy * ds - y0])
    pos, last = [], np.array([x0, y0], float)
    r = int(0.9 * w * ds)
    for im in g:
        sx0, sy0 = max(int(last[0]) - r, 0), max(int(last[1]) - r, 0)
        win = im[sy0:int(last[1]) + tpl.shape[0] + r, sx0:int(last[0]) + tpl.shape[1] + r]
        res = cv2.matchTemplate(win, tpl, cv2.TM_CCOEFF_NORMED)
        _, score, _, loc = cv2.minMaxLoc(res)
        if score > 0.35:
            last = np.array([sx0 + loc[0], sy0 + loc[1]], float)
        pos.append((last + off) / ds)
    pos = np.array(pos)
    # згладжування, щоб прибрати тремтіння трекера
    k = cv2.getGaussianKernel(9, 2.0).ravel()
    pad = np.pad(pos, ((4, 4), (0, 0)), mode='edge')
    return np.stack([np.convolve(pad[:, j], k, mode='valid') for j in range(2)], 1)


# Маска темної обробки: світла еліпсна зона навколо нігтя й кінчика пальця, решта приглушена.
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - 540) / 330) ** 2 + ((yy - 1130) / 560) ** 2)
KEEP = np.clip((1.55 - d) / 0.9, 0, 1) ** 1.5
_t = np.clip((yy - 600) / 260, 0, 1)
TOP = 0.16 + 0.84 * _t * _t * (3 - 2 * _t)             # верх кадру майже чорний — там написи


def grade(fr):
    f = fr.astype(np.float32)
    mx, mn = f.max(2), f.min(2)
    sat = (mx - mn) / (mx + 1)
    satw = np.clip(sat / 0.35, 0, 1)
    dim = 0.28 + 0.3 * satw                              # сірі рукавичка й стіна темнішають сильніше за шкіру
    m = KEEP + (1 - KEEP) * dim
    f *= (m * TOP)[..., None]
    f = 255 * (np.clip(f, 0, 255) / 255) ** 1.07         # трохи глибші тіні
    return np.clip(f - 3, 0, 255).astype(np.uint8)


def load_overlay(name):
    o = cv2.imread(f'overlays/{name}.png', cv2.IMREAD_UNCHANGED).astype(np.float32)
    return o[..., :3], o[..., 3:] / 255


def main(out='out/cat-eye-reel.mp4'):
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}',
                           '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
                           '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for clip, t0, t1, sp, (cx, cy, w), ov in SEGMENTS:
        frames = pick_frames(CLIPS + clip, t0, t1, sp)
        pos = track(frames, cx, cy, w)
        k = NAIL_OUT / w
        rgb, a = load_overlay(ov)
        n = len(frames)
        for i, (fr, (px, py)) in enumerate(zip(frames, pos)):
            M = np.float32([[k, 0, ANCHOR_OUT[0] - k * px], [0, k, ANCHOR_OUT[1] - k * py]])
            o = cv2.warpAffine(fr, M, (W, H), flags=cv2.INTER_AREA if k < 1 else cv2.INTER_CUBIC,
                               borderMode=cv2.BORDER_REPLICATE)
            o = grade(o).astype(np.float32)
            # напис плавно з'являється за 6 кадрів і зникає за 4 до кінця шматка
            fade = min(1.0, i / 6, (n - 1 - i) / 4) if ov != 'cta' else min(1.0, i / 6)
            al = a * max(fade, 0)
            o = o * (1 - al) + rgb * al
            ff.stdin.write(o.astype(np.uint8).tobytes())
        print(clip, t0, t1, 'кадрів', n, 'зсув кутикули', np.ptp(pos, 0).round(0), file=sys.stderr)
    ff.stdin.close()
    ff.wait()


if __name__ == '__main__':
    main(*sys.argv[1:])
