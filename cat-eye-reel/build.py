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
    ('video_2026-10-26_12-54-31.mp4', 12.5, 16.0, 2.0, (393, 514, 110), 's3'),
    ('video_2026-10-26_12-54-31.mp4', 25.0, 29.0, 2.0, (362, 542, 104), 's3'),
    ('video_2026-10-26_12-54-31.mp4', 38.5, 43.5, 2.0, (372, 520, 99), 's4'),
    ('video_2026-10-26_12-54-31.mp4', 69.5, 77.0, 1.6, (349, 465, 99), 's5'),
    ('video_2026-10-26_12-54-31.mp4', 225.5, 230.5, 2.0, (440, 620, 116), 's5'),
    ('VID_20261007_203932.mp4', 0.0, 6.5, 1.4, (984, 1300, 405), 's6', 'silhouette'),
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


def _subpix(res, loc):
    """Уточнення максимуму кореляції до часток пікселя (парабола по сусідах)."""
    x, y = loc
    dx = dy = 0.0
    if 0 < x < res.shape[1] - 1:
        l, c, r = res[y, x - 1], res[y, x], res[y, x + 1]
        den = l - 2 * c + r
        dx = 0.5 * (l - r) / den if den else 0.0
    if 0 < y < res.shape[0] - 1:
        u, c, d = res[y - 1, x], res[y, x], res[y + 1, x]
        den = u - 2 * c + d
        dy = 0.5 * (u - d) / den if den else 0.0
    return x + dx, y + dy


def smooth(pos, sigma):
    """Гаусове згладження траєкторії з дзеркальними краями."""
    r = int(3 * sigma)
    k = cv2.getGaussianKernel(2 * r + 1, sigma).ravel()
    pad = np.pad(pos, ((r, r), (0, 0)), mode='reflect')
    return np.stack([np.convolve(pad[:, j], k, mode='valid') for j in range(pos.shape[1])], 1)


def track(frames, cx, cy, w):
    """Рух пальця відносно першого кадру шматка: точки текстури шкіри над кутикулою (оптичний потік),
    по них — зсув, поворот і масштаб (RANSAC). Ділянку нігтя не беремо: там пензлик і магніт.
    Повертає для кожного кадру (x, y, кут, масштаб) якоря кутикули після згладжування."""
    ds = min(1.0, 160 / w)
    g = [cv2.cvtColor(cv2.resize(f, None, fx=ds, fy=ds, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
         for f in frames]
    acx, acy, aw = cx * ds, cy * ds, w * ds
    mask = np.zeros_like(g[0])
    cv2.rectangle(mask, (int(acx - 0.8 * aw), int(acy - 1.8 * aw)), (int(acx + 0.8 * aw), int(acy - 0.05 * aw)), 255, -1)
    feat = dict(maxCorners=300, qualityLevel=0.005, minDistance=4, blockSize=5)
    lk = dict(winSize=(21, 21), maxLevel=3, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
    T = np.eye(3)                                        # кадр 0 -> поточний кадр
    pts = cv2.goodFeaturesToTrack(g[0], mask=mask, **feat)
    out = [(acx, acy, 0.0, 1.0)]
    for i in range(1, len(g)):
        if pts is not None and len(pts) >= 8:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(g[i - 1], g[i], pts, None, **lk)
            back, st2, _ = cv2.calcOpticalFlowPyrLK(g[i], g[i - 1], nxt, None, **lk)
            ok = (st.ravel() == 1) & (st2.ravel() == 1) & (np.linalg.norm(back - pts, axis=2).ravel() < 0.7)
            M, inl = (cv2.estimateAffinePartial2D(pts[ok], nxt[ok], method=cv2.RANSAC, ransacReprojThreshold=1.5)
                      if ok.sum() >= 8 else (None, None))
            if M is not None:
                T = np.vstack([M, [0, 0, 1]]) @ T
                pts = nxt[ok][inl.ravel() == 1].reshape(-1, 1, 2)
        if pts is None or len(pts) < 60:                 # доповнюємо точки в зоні шкіри, перенесеній поточним рухом
            m2 = cv2.warpAffine(mask, T[:2], mask.shape[::-1], flags=cv2.INTER_NEAREST)
            new = cv2.goodFeaturesToTrack(g[i], mask=m2, **feat)
            if new is not None:
                pts = new if pts is None else np.vstack([pts, new])
        p = T @ [acx, acy, 1]
        out.append((p[0], p[1], np.arctan2(T[1, 0], T[0, 0]), np.hypot(T[0, 0], T[1, 0])))
    out = np.array(out)
    out[:, :2] /= ds
    out[:, 3] = np.log(out[:, 3])
    out = smooth(out, sigma=4.0)
    out[:, 3] = np.exp(out[:, 3])
    return out


def track_silhouette(frames, cx, cy, w):
    """Для кадрів, де палець нахиляють і обертають (текстура шкіри змінюється):
    маска шкіри (теплий насичений тон), кутикула = нижня межа шкіри по центру пальця,
    масштаб — за шириною пальця над кутикулою. Рукавичка, стіна й темний ніготь у маску не потрапляють."""
    ds = min(1.0, 120 / w)
    pos, (px, py), fw0 = [], (cx * ds, cy * ds), None
    aw = w * ds
    for f in frames:
        sm = cv2.resize(f, None, fx=ds, fy=ds, interpolation=cv2.INTER_AREA)
        hsv = cv2.cvtColor(cv2.GaussianBlur(sm, (0, 0), 1.5), cv2.COLOR_BGR2HSV)
        skin = ((hsv[..., 0] < 25) & (hsv[..., 1] > 60) & (hsv[..., 2] > 90)).astype(np.uint8)
        skin = cv2.morphologyEx(skin, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        n, lab = cv2.connectedComponents(skin)
        seed = (int(py - 0.6 * aw), int(px))
        if 0 <= seed[0] < lab.shape[0] and lab[seed] > 0:
            comp = lab == lab[seed]
            row = comp[seed[0]]
            xs = np.where(row)[0]
            # суцільний відрізок рядка навколо центру = ширина пальця
            left = xs[xs <= px].max() if (xs <= px).any() else px
            l = left
            while l > 0 and row[l - 1]:
                l -= 1
            rr = int(px)
            while rr < len(row) - 1 and row[rr + 1]:
                rr += 1
            ncx = (l + rr) / 2
            fw = rr - l
            band = comp[:, int(ncx - 0.1 * aw):int(ncx + 0.1 * aw) + 1]
            ys = []
            for col in band.T:
                y = seed[0]
                while y < len(col) - 1 and col[y + 1]:
                    y += 1
                ys.append(y)
            ncy = float(np.median(ys))
            if fw > 0.5 * aw and abs(ncy - py) < 0.5 * aw and abs(ncx - px) < 0.5 * aw:
                px, py = ncx, ncy
                fw0 = fw0 or fw
                pos.append((px / ds, py / ds, 0.0, fw / fw0))
                continue
        pos.append((px / ds, py / ds, 0.0, pos[-1][3] if pos else 1.0))
    pos = np.array(pos)
    pos[:, 3] = np.log(pos[:, 3])
    pos = smooth(pos, sigma=5.0)
    pos[:, 3] = np.exp(pos[:, 3])
    return pos


# Маска темної обробки: світла еліпсна зона навколо нігтя й кінчика пальця, решта приглушена.
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - 540) / 330) ** 2 + ((yy - 1130) / 560) ** 2)
KEEP = np.clip((1.55 - d) / 0.9, 0, 1) ** 1.5
TOP = np.ones_like(yy)                                  # без окремого затемнення верху


def grade(fr):
    f = fr.astype(np.float32)
    mx, mn = f.max(2), f.min(2)
    sat = (mx - mn) / (mx + 1)
    satw = np.clip(sat / 0.35, 0, 1)
    dim = 0.62 + 0.23 * satw                              # легке приглушення: сірі рукавичка й стіна трохи темніші
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
    for si, (clip, t0, t1, sp, (cx, cy, w), ov, *mode) in enumerate(SEGMENTS):
        prev_ov = SEGMENTS[si - 1][5] if si else None
        next_ov = SEGMENTS[si + 1][5] if si + 1 < len(SEGMENTS) else None
        frames = pick_frames(CLIPS + clip, t0, t1, sp)
        pos = (track_silhouette if mode == ['silhouette'] else track)(frames, cx, cy, w)
        k = NAIL_OUT / w
        rgb, a = load_overlay(ov)
        n = len(frames)
        for i, (fr, (px, py, ang, sc)) in enumerate(zip(frames, pos)):
            # кутикула -> ANCHOR_OUT, поворот і масштаб пальця компенсуються
            kk = k / sc
            c, sn = kk * np.cos(-ang), kk * np.sin(-ang)
            M = np.float32([[c, -sn, ANCHOR_OUT[0] - (c * px - sn * py)],
                            [sn, c, ANCHOR_OUT[1] - (sn * px + c * py)]])
            o = cv2.warpAffine(fr, M, (W, H), flags=cv2.INTER_AREA if k < 1 else cv2.INTER_CUBIC,
                               borderMode=cv2.BORDER_REPLICATE)
            if k / sc > 1.6:
                blur = cv2.GaussianBlur(o, (0, 0), 2.2)
                o = cv2.addWeighted(o, 1.6, blur, -0.6, 0)
            o = grade(o).astype(np.float32)
            # напис плавно з'являється за 6 кадрів і зникає за 4 до кінця шматка
            # напис з'являється/зникає лише на межі етапів, усередині етапу тримається
            fade = 1.0
            if ov != prev_ov:
                fade = min(fade, i / 6)
            if ov != next_ov and next_ov is not None:
                fade = min(fade, (n - 1 - i) / 4)
            al = a * max(fade, 0)
            o = o * (1 - al) + rgb * al
            ff.stdin.write(o.astype(np.uint8).tobytes())
        print(clip, t0, t1, 'кадрів', n, 'зсув', np.ptp(pos[:, :2], 0).round(0), 'поворот°', np.degrees(np.ptp(pos[:, 2])).round(1), 'масштаб', pos[:, 3].min().round(2), pos[:, 3].max().round(2), file=sys.stderr)
    ff.stdin.close()
    ff.wait()


if __name__ == '__main__':
    main(*sys.argv[1:])
