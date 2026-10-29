import cv2, numpy as np
SW, SH = 270, 480
yy, xx = np.mgrid[0:SH, 0:SW].astype(np.float32)
xx /= SW; yy /= SH
BASIS = np.stack([np.ones_like(xx), xx, yy, xx*xx, yy*yy, xx*yy], -1).reshape(-1, 6)

def bg_fit(small, init):
    sel = init.reshape(-1)
    pix = small.reshape(-1, 3)
    coef, *_ = np.linalg.lstsq(BASIS[sel], pix[sel], rcond=None)
    return (BASIS @ coef).reshape(SH, SW, 3)

def fill_holes(m):
    h, w = m.shape
    ff = m.copy()
    pad = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(ff, pad, (0, 0), 255)
    return m | cv2.bitwise_not(ff)

def fg_mask(frame, thr, min_area=0.01):
    small = cv2.resize(frame, (SW, SH), interpolation=cv2.INTER_AREA).astype(np.float32)
    small = cv2.GaussianBlur(small, (0, 0), 1.0)
    med = np.median(small.reshape(-1, 3), 0)
    init = np.linalg.norm(small - med, axis=2) < thr * 1.5
    for _ in range(3):
        fit = bg_fit(small, init)
        dist = np.linalg.norm(small - fit, axis=2)
        init = dist < thr
    lum = small.mean(2)
    chroma = small.max(2) - small.min(2)
    core = (dist >= thr) & ((lum < 0.55 * fit.mean(2)) | (chroma > 14))
    m = core.astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] > min_area * SW * SH:
            keep[lab == i] = 255
    keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    return fill_holes(keep), fit

def label_mask(frame, vmin, dmin):
    small = cv2.resize(frame, (SW, SH), interpolation=cv2.INTER_AREA).astype(np.int16)
    b, g, r = small[..., 0], small[..., 1], small[..., 2]
    m = ((small.max(2) > vmin) & (b - r > dmin)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2:
        return np.zeros_like(m)
    i = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    return fill_holes(((lab == i) * 255).astype(np.uint8))
