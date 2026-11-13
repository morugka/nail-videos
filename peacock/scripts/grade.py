"""Colour grade for the peacock cat-eye footage.

Target look (from the reference photos): near-black backdrop, cat-eye nails with a
cobalt-blue light band over a deep emerald body, warm skin, low-key contrast.
All functions take/return float32 BGR in 0..1.
"""
import cv2
import numpy as np


def _smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def backdrop_mask(x):
    """1 on the flat grey backdrop (low saturation, low texture, mid/low brightness)."""
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    s, v = hsv[..., 1], hsv[..., 2]
    g = cv2.cvtColor(x, cv2.COLOR_BGR2GRAY)
    small = cv2.resize(g, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_AREA)
    mu = cv2.blur(small, (5, 5))
    var = cv2.blur(small * small, (5, 5)) - mu * mu
    tex = cv2.resize(np.sqrt(np.maximum(var, 0)), (g.shape[1], g.shape[0]))
    m = (1 - _smooth(0.14, 0.26, s)) * (1 - _smooth(0.04, 0.09, tex)) * (1 - _smooth(0.62, 0.8, v))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 3)


def skin_mask(hsv):
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    d = np.abs(((h - 22 + 180) % 360) - 180)
    m = np.clip(1 - d / 25, 0, 1) * _smooth(0.12, 0.22, s) * _smooth(0.18, 0.32, v)
    return cv2.GaussianBlur(m, (0, 0), 3)


def nail_mask(hsv):
    """Teal/cyan polish: hue ~150..215 with real saturation."""
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    d = np.abs(((h - 182 + 180) % 360) - 180)
    m = np.clip(1 - (d - 25) / 15, 0, 1) * _smooth(0.22, 0.38, s) * _smooth(0.05, 0.12, v)
    return cv2.GaussianBlur(m, (0, 0), 1.5)


def vignette(w, h):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = ((xx - w * 0.55) / (w * 0.75)) ** 2 + ((yy - h * 0.5) / (h * 0.6)) ** 2
    return (1 - 0.55 * np.clip(r, 0, 1) ** 1.2)[..., None].astype(np.float32)


def grade(x, vig):
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    nails = nail_mask(hsv)
    skin = skin_mask(hsv)
    bg = backdrop_mask(x) * (1 - nails) * (1 - skin)

    # Nails: light band -> cobalt blue, body -> deep emerald
    light = _smooth(0.20, 0.55, v)
    target_h = 158 + (224 - 158) * light
    nh = h + (target_h - h) * 0.85
    ns = np.clip((s * 1.3 + 0.08) * (1 - 0.12 * light), 0, 1)
    nv = np.clip(v * (0.55 + 0.8 * light), 0, 1)  # darker body, punchy band
    hsv[..., 0] = h + (nh - h) * nails
    hsv[..., 1] = s + (ns - s) * nails
    hsv[..., 2] = v + (nv - v) * nails

    # Peacock eye / feathers keep their colour but get richer
    other = np.clip(1 - nails - skin - bg, 0, 1)
    hsv[..., 1] = np.clip(hsv[..., 1] * (1 + 0.25 * other) * (1 - 0.22 * skin), 0, 1)
    y = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    # Skin: calmer and a touch rosier (less orange), slightly darker against the black
    sk = skin[..., None]
    y = y * (1 + sk * np.array([0.04, 0.0, 0.01], np.float32)) * (1 - 0.05 * sk)

    # Backdrop: crush to near black
    y = y * (1 - bg[..., None] * 0.95)

    # Low-key S-curve
    y = np.clip(y, 0, 1)
    y = np.clip((y - 0.03) / 0.97, 0, 1)
    y = y * y * (3 - 2 * y) * 0.45 + y * 0.55
    # Crisp detail on the polish
    blur = cv2.GaussianBlur(y, (0, 0), 2.0)
    y = y + 0.4 * (y - blur) * (nails[..., None] * 0.7 + 0.3)
    return np.clip(y * vig, 0, 1)


def grade_u8(frame, vig):
    return (grade(frame.astype(np.float32) / 255, vig) * 255 + 0.5).astype(np.uint8)
