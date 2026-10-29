import cv2, numpy as np, subprocess, sys
from rembg import new_session, remove

W, PH, GAP = 1080, 636, 6
H = 3 * PH + 2 * GAP
T = np.array([13, 11, 11], np.float32)  # background + dividers, BGR (RGB 11,11,13)
CROPS = [  # letterboxed sources: picture area cropped to the 1080x636 panel ratio
    'crop=1208:677:476:741,crop=1150:677',
    'crop=2160:1306:0:1268,crop=2160:1272',
    'crop=2040:1201:90:1392',
]
ISNET, U2NET = new_session('isnet-general-use'), new_session('u2net')

def frames(path, crop):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf',
                          f'{crop},scale={W}:{PH}:flags=lanczos,fps=30', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'],
                         stdout=subprocess.PIPE)
    while True:
        buf = p.stdout.read(W * PH * 3)
        if len(buf) < W * PH * 3:
            return
        yield np.frombuffer(buf, np.uint8).reshape(PH, W, 3)

def fill_holes(m):
    ff = m.copy()
    cv2.floodFill(ff, np.zeros((m.shape[0] + 2, m.shape[1] + 2), np.uint8), (0, 0), 255)
    return m | cv2.bitwise_not(ff)

def bottle_mask(f):
    # isnet keeps the brush handle, u2net keeps the label body; together they cover the whole bottle
    rgb = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
    a = remove(rgb, session=ISNET, only_mask=True)
    b = remove(rgb, session=U2NET, only_mask=True)
    return np.maximum(a, b).astype(np.float32) / 255

def hand_mask(f):
    # the wall is neutral grey; skin, denim, label and nails all carry colour
    b = cv2.GaussianBlur(f, (0, 0), 2).astype(np.int16)
    m = ((b.max(2) - b.min(2)) > 16).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_TOP] + st[i, cv2.CC_STAT_HEIGHT] >= PH - 1:
            keep[lab == i] = 255
    return refine(f, fill_holes(keep) > 0)

def refine(f, m):
    # nail areas that mirror the grey wall have no colour; GrabCut recovers them from the hand's colour model
    fs = cv2.resize(f, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_AREA)
    m = cv2.resize(m.astype(np.uint8), (fs.shape[1], fs.shape[0]), interpolation=cv2.INTER_NEAREST)
    g = np.full(m.shape, cv2.GC_PR_BGD, np.uint8)
    g[m > 0] = cv2.GC_PR_FGD
    g[cv2.erode(m, np.ones((15, 15), np.uint8)) > 0] = cv2.GC_FGD
    g[cv2.dilate(m, np.ones((61, 61), np.uint8)) == 0] = cv2.GC_BGD
    cv2.grabCut(fs, g, None, np.zeros((1, 65)), np.zeros((1, 65)), 4, cv2.GC_INIT_WITH_MASK)
    r = ((g == cv2.GC_FGD) | (g == cv2.GC_PR_FGD)).astype(np.uint8) * 255
    return (fill_holes(cv2.resize(r, (W, PH))) > 127).astype(np.float32)

def flatten(f, m):
    # outside the mask: flat T; inside, grey wall/backdrop left in gaps is pushed to T too
    px = f.astype(np.float32)
    lum = px.mean(2, keepdims=True)
    chroma = px.max(2, keepdims=True) - px.min(2, keepdims=True)
    greyish = np.clip((14 - chroma) / 4, 0, 1) * np.clip((100 - lum) / 10, 0, 1)
    band = cv2.GaussianBlur((m < 0.98).astype(np.float32), (0, 0), 12)[..., None]
    band = np.clip(band * 3, 0, 1)
    inside = px + band * greyish * (np.minimum(px, T) - px)
    M = cv2.GaussianBlur(m, (0, 0), 1.5)[..., None]
    return M * inside + (1 - M) * T

def sharpen(f):
    px = f.astype(np.float32)
    fine = px - cv2.GaussianBlur(px, (0, 0), 1.2)
    local = px - cv2.GaussianBlur(px, (0, 0), 5)
    return px + 1.0 * fine + 0.35 * local

def main(top, mid, bot, dst):
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}',
                            '-r', '30', '-i', '-', '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
                            '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
                            '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
    rng = np.random.default_rng(0)
    ema_t = ema_m = None
    for a, b, c in zip(frames(top, CROPS[0]), frames(mid, CROPS[1]), frames(bot, CROPS[2])):
        mt, mm = bottle_mask(a), hand_mask(b)
        ema_t = mt if ema_t is None else 0.5 * ema_t + 0.5 * mt
        ema_m = mm if ema_m is None else 0.5 * ema_m + 0.5 * mm
        out = np.empty((H, W, 3), np.float32)
        out[:] = T
        out[0:PH] = flatten(a, ema_t)
        out[PH + GAP:2 * PH + GAP] = flatten(b, ema_m)
        out[2 * PH + 2 * GAP:] = sharpen(c)
        out += rng.normal(0, 0.8, (H, W, 1)).astype(np.float32)
        enc.stdin.write(np.clip(out + 0.5, 0, 255).astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()

if __name__ == '__main__':
    main(*sys.argv[1:5])
