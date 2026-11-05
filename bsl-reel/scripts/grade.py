"""Page look for a phone clip: deep dark surroundings, warm lively skin, nails untouched,
soft vignette, KM mark top left. Sound is dropped.
usage: grade.py src.mp4 logo-km.png dst.mp4"""
import sys, subprocess, numpy as np, cv2

W, H, FPS = 1080, 1920, 30
src, logo_path, dst = sys.argv[1:4]

def skin_mask(x):
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[...,0], hsv[...,1], hsv[...,2]
    hue_ok = np.clip(1 - np.abs(((h + 180) % 360 - 180) - 20) / 22, 0, 1)
    m = hue_ok * np.clip((s - 0.15) / 0.1, 0, 1) * np.clip((v - 0.25) / 0.15, 0, 1)
    return cv2.GaussianBlur(m, (0, 0), 6)

def nail_mask(x):
    """dark navy lacquer: blue hue, dark, some colour (denim is much lighter)"""
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[...,0], hsv[...,1], hsv[...,2]
    hue_ok = np.clip(1 - np.abs(h - 215) / 35, 0, 1)
    m = hue_ok * np.clip((s - 0.18) / 0.1, 0, 1) * np.clip((0.42 - v) / 0.08, 0, 1)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 3)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vig = (1 - 0.32 * np.clip(((xx - W/2) / (W*0.62))**2 + ((yy - H*0.5) / (H*0.6))**2, 0, 1))[..., None]

def grade(f):
    x = f.astype(np.float32) / 255
    skin = skin_mask(x)[..., None]
    nails = nail_mask(x)[..., None]
    # surroundings (wall, glove, denim): quieter colour, deeper shadows
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    hsv[..., 1] *= 0.8
    rest = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    rest = np.clip(rest, 0, 1) ** 1.25 * 0.92
    # skin: warmer, a touch richer and brighter
    hsv = cv2.cvtColor(x, cv2.COLOR_BGR2HSV)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.12, 0, 1)
    sk = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR) * np.array([0.96, 1.0, 1.05], np.float32) * 1.03
    out = rest * (1 - skin) + sk * skin
    out = np.clip(out * vig, 0, 1)
    out = out * (1 - nails) + x * nails  # lacquer keeps its original colour
    return out

# KM mark, as in the other reels: 92 px high, 48 px from the left, 110 px from the top, soft shadow
logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
lh = 92; lw = round(logo.shape[1] * lh / logo.shape[0])
logo = cv2.resize(logo, (lw, lh), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
lx, ly, pad = 48, 110, 30
alpha = np.zeros((lh + 2*pad, lw + 2*pad), np.float32); alpha[pad:pad+lh, pad:pad+lw] = logo[..., 3]
shadow = np.clip(cv2.GaussianBlur(alpha, (0, 0), 8) * 1.4, 0, 0.85)[..., None]

def stamp(x):
    y0, x0 = ly - pad, lx - pad
    reg = x[y0:y0+lh+2*pad, x0:x0+lw+2*pad]
    reg *= 1 - shadow
    a = logo[..., 3:4]
    r = reg[pad:pad+lh, pad:pad+lw]
    r[:] = r * (1 - a) + logo[..., :3] * a
    return x

dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-an",
    "-vf", f"fps={FPS},scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
    stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
    "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-profile:v", "high",
    "-level", "4.1", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst],
    stdin=subprocess.PIPE)
n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    enc.stdin.write((stamp(grade(f)) * 255 + 0.5).astype(np.uint8).tobytes()); n += 1
enc.stdin.close(); enc.wait(); print(dst, "frames", n)
