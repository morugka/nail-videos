import cv2, numpy as np, subprocess, sys, json
from seg import fg_mask, label_mask, SW, SH
from rembg import new_session, remove

SESSION = new_session('isnet-general-use')

W, H = 1080, 1920
T = np.array([15, 12, 12], np.float32)  # target background, BGR (RGB 12,12,15)

def frames(path):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={W}:{H}:flags=lanczos',
                          '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    while True:
        buf = p.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        yield np.frombuffer(buf, np.uint8).reshape(H, W, 3)

def label_stats(path, vmin, dmin, step=10):
    vals = []
    for i, f in enumerate(frames(path)):
        if i % step:
            continue
        m = cv2.resize(label_mask(f, vmin, dmin), (W, H)) > 127
        m = cv2.erode(m.astype(np.uint8), np.ones((9, 9))) > 0
        px = f[m].astype(np.int16)
        px = px[(px.max(1) - px.min(1)) > 10]  # drop white lettering
        vals.append(cv2.cvtColor(px.astype(np.uint8)[None], cv2.COLOR_BGR2LAB)[0])
    return np.median(np.concatenate(vals), 0).astype(np.float32)

def up(m, sigma):
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
    return cv2.GaussianBlur(m, (0, 0), sigma)[..., None]

def object_mask(f, gamma):
    # the model only sees a brightened copy, so the black cap stays in the mask; shadows stay out
    lut = np.clip(255 * (np.arange(256) / 255) ** (1 / gamma), 0, 255).astype(np.uint8)
    m = remove(cv2.cvtColor(cv2.LUT(f, lut), cv2.COLOR_BGR2RGB), session=SESSION, only_mask=True)
    return cv2.resize(m, (SW, SH), interpolation=cv2.INTER_AREA).astype(np.float32) / 255

def run(src, dst, thr, gamma=1.0, recolor=None):
    fps = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                   'stream=r_frame_rate', '-of', 'csv=p=0', src]).decode().strip()
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24',
                            '-s', f'{W}x{H}', '-r', fps, '-i', '-', '-i', src, '-map', '0:v', '-map', '1:a?',
                            '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', dst],
                           stdin=subprocess.PIPE)
    rng = np.random.default_rng(0)
    ema_o = ema_l = None
    for f in frames(src):
        _, fit = fg_mask(f, thr)
        m = object_mask(f, gamma)
        ema_o = m if ema_o is None else 0.5 * ema_o + 0.5 * m
        Mo = up(ema_o, 2)
        px = f.astype(np.float32)
        lum = px.mean(2, keepdims=True)
        bgL = cv2.resize(fit.mean(2), (W, H))[..., None]
        chroma = px.max(2, keepdims=True) - px.min(2, keepdims=True)
        K = np.maximum(np.clip((chroma - 8) / 10, 0, 1), np.clip((lum - bgL - 4) / 12, 0, 1))
        inside = K * px + (1 - K) * np.minimum(px, T)
        out = Mo * inside + (1 - Mo) * T
        out += rng.normal(0, 1.0, (H, W, 1)).astype(np.float32) * (1 - Mo * K)
        if recolor is not None:
            ref, cur, vmin, dmin = recolor
            lm = cv2.dilate(label_mask(f, vmin, dmin), np.ones((7, 7), np.uint8)).astype(np.float32) / 255
            ema_l = lm if ema_l is None else 0.5 * ema_l + 0.5 * lm
            Lm = up(ema_l, 2) * np.clip((lum - 40) / 10, 0, 1)  # light label pixels only, never the polish
            lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32)
            lab[..., 0] *= ref[0] / cur[0]
            lab[..., 1:] += ref[1:] - cur[1:]
            rec = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
            out = Lm * rec + (1 - Lm) * out
        enc.stdin.write(np.clip(out + 0.5, 0, 255).astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()

if __name__ == '__main__':
    A, B, outA, outB = sys.argv[1:5]
    ref = label_stats(A, 25, 8)
    cur = label_stats(B, 75, 30)
    print('ref Lab', ref, 'cur Lab', cur)
    run(A, outA, 6, gamma=2.6)
    run(B, outB, 9, recolor=(ref, cur, 75, 30))
