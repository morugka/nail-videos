import numpy as np, cv2
def wall_mask(f):
    """1 where pixel looks like the smooth neutral-gray wall."""
    x = f.astype(np.float32)/255
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    s, v = hsv[...,1], hsv[...,2]
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.float32)/255
    mu = cv2.blur(g,(7,7)); var = cv2.blur(g*g,(7,7)) - mu*mu
    tex = np.sqrt(np.maximum(var,0))
    low_sat = np.clip((0.16 - s)/0.06, 0, 1)
    smooth = np.clip((0.035 - tex)/0.02, 0, 1)
    in_range = np.clip((v-0.12)/0.08,0,1)*np.clip((0.85-v)/0.1,0,1)
    w = low_sat*smooth*in_range
    w = cv2.morphologyEx(w, cv2.MORPH_OPEN, np.ones((5,5),np.uint8))
    w = cv2.morphologyEx(w, cv2.MORPH_CLOSE, np.ones((9,9),np.uint8))
    w = cv2.dilate(w, np.ones((5,5),np.uint8))
    return cv2.GaussianBlur(w,(7,7),0)
def skin_mask(x):
    """Soft mask of warm skin tones (x: float BGR 0..1)."""
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    h, sat, v = hsv[...,0], hsv[...,1], hsv[...,2]
    hue_ok = np.clip(1 - np.abs(((h + 180) % 360 - 180) - 18) / 22, 0, 1)  # around orange
    m = hue_ok * np.clip((sat - 0.12) / 0.08, 0, 1) * np.clip((v - 0.2) / 0.15, 0, 1)
    return cv2.GaussianBlur(m, (21,21), 0)
def grade(f, fg, vig):
    x = f.astype(np.float32)/255
    skin = skin_mask(x)[...,None]
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    # skin: livelier and warmer; everything else (the nails): richer colour
    hsv[...,1] = np.clip(hsv[...,1] * (1.15 + 0.05*skin[...,0]), 0, 1)
    x = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    x = x * (1 + skin * np.array([-0.03, 0.0, 0.05], np.float32))  # BGR: warm up skin
    x = np.clip(x * 1.03, 0, 1)
    # nails: brighter + crisper detail
    nails = np.clip(fg[...,None] - skin, 0, 1)
    blur = cv2.GaussianBlur(x, (0,0), 2.0)
    sharp = np.clip(x + 0.35*(x - blur), 0, 1)
    bright = np.clip(sharp * 1.12 + 0.01, 0, 1)
    x = x*(1-nails) + bright*nails
    x = np.clip((x - 0.025) * 1.06, 0, 1)
    m = fg[...,None]
    out = x*m + x*0.03*(1-m)
    return (np.clip(out*vig,0,1)*255).astype(np.uint8)
def vignette(W,H):
    yy, xx = np.mgrid[0:H,0:W]
    v = 1 - 0.18*np.clip(((xx-W/2)/(W*0.65))**2 + ((yy-H*0.45)/(H*0.62))**2, 0, 1)
    return v[...,None].astype(np.float32)
def fg_from(f, seg):
    w = wall_mask(f)
    nonwall = 1 - w
    # trust segmentation where it is confident, otherwise the colour/texture key
    fg = np.maximum(seg*0.0 + nonwall*(1-0.0), seg) if seg is not None else nonwall
    return np.clip(fg,0,1)
