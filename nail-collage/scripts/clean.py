"""Darkened background + livelier skin, nails left exactly as shot.
usage: clean.py src.mp4 start end dst.mp4 [clutter_from]   (clutter_from: 0..1 of height, below it non-skin is darkened too)"""
import sys, subprocess, numpy as np, cv2

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
    hue_ok = np.clip(1 - np.abs(((h + 180) % 360 - 180) - 18) / 22, 0, 1)
    m = hue_ok * np.clip((sat - 0.12) / 0.08, 0, 1) * np.clip((v - 0.2) / 0.15, 0, 1)
    return cv2.GaussianBlur(m, (21,21), 0)

def grade(f, fg):
    x = f.astype(np.float32)/255
    skin = skin_mask(x)[...,None]
    # skin only: a touch more colour, warmer, slightly brighter
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    hsv[...,1] = np.clip(hsv[...,1]*1.18, 0, 1)
    s = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    s = np.clip(s*np.array([0.97, 1.0, 1.05], np.float32)*1.04, 0, 1)
    x = x*(1-skin) + s*skin          # nails keep their original pixels
    m = fg[...,None]
    # the wall stays, just pushed down into a deep, slightly cool shadow
    bg = x*np.array([0.34, 0.31, 0.29], np.float32)
    return (np.clip(x*m + bg*(1-m), 0, 1)*255).astype(np.uint8)

src, t0, t1, dst = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
clutter = float(sys.argv[5]) if len(sys.argv) > 5 else None
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
W, H = int(cap.get(3)), int(cap.get(4))
cap.set(cv2.CAP_PROP_POS_MSEC, t0*1000)
ff = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(fps),"-i","-",
  "-c:v","libx264","-crf","14","-preset","medium","-pix_fmt","yuv420p",dst], stdin=subprocess.PIPE)
yy = np.mgrid[0:H,0:W][0].astype(np.float32)
bottom = np.clip((yy - H*clutter)/(H*0.08), 0, 1) if clutter else None
ema = None; n = 0
while cap.get(cv2.CAP_PROP_POS_MSEC) < t1*1000:
    ok, f = cap.read()
    if not ok: break
    fg = 1 - wall_mask(f)
    if bottom is not None:
        fg = fg*(1-bottom) + fg*bottom*np.clip(skin_mask(f.astype(np.float32)/255)*1.5, 0, 1)
    ema = fg if ema is None else 0.65*fg + 0.35*ema
    ff.stdin.write(grade(f, ema).tobytes()); n += 1
ff.stdin.close(); ff.wait(); print(dst, "frames", n)
