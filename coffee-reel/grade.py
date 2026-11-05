"""Обробка відео з пінкою: рівний чорний фон без мерехтіння і природніший (менш жовтий) тон шкіри.
1) ffmpeg: часове шумозаглушення (прибирає «кипіння» шуму й блоків у темряві);
2) стабілізація яскравості фону: по чистій темній зоні вгорі кадру кожен кадр зводиться до однакового рівня;
3) м'яке «притискання» тіней до глибокого чорного з збереженням відтінку (сині нігті лишаються синіми);
4) шкіра: у Lab зменшуємо жовтизну (b) і трохи — помаранчевість, лише в зоні теплих насичених тонів.
Використання: python3 grade.py вхід.mp4 overlay.png вихід.mp4"""
import subprocess
import sys

import cv2
import numpy as np

src, overlay, dst = sys.argv[1:4]
W, H = 1080, 1920
fps = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate',
                      '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip()

dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-vf', 'hqdn3d=2:2:9:9', '-f', 'rawvideo',
                        '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}',
                        '-r', fps, '-i', '-', '-i', src, '-loop', '1', '-i', overlay,
                        '-filter_complex', '[2]format=rgba,fade=in:st=0:d=0.4:alpha=1[o];[0][o]overlay=0:0:shortest=1,format=yuv420p',
                        '-map', '1:a?', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-c:a', 'copy',
                        '-shortest', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)

BG_TARGET = 9.0          # рівень фону після обробки (≈ #090909)
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)

    # 2) рівень фону цього кадру (верх кадру — завжди чистий фон)
    lvl = np.median(f[60:600:4, 60:1020:4].mean(2))
    gain = BG_TARGET / max(lvl, 1.0)

    # 3) тіні: яскравість Y < ~40 плавно множиться на gain (фон -> BG_TARGET), світлі тони не чіпаємо
    Y = f @ np.array([0.114, 0.587, 0.299], np.float32)
    t = np.clip((Y - 18) / 30, 0, 1)
    t = t * t * (3 - 2 * t)
    k = gain * (1 - t) + t
    f *= k[..., None]
    # нейтралізація: фон стає рівно сірочорним, без синювато-коричневих плям
    neutral = (1 - t)[..., None] * np.clip(1 - (f.max(2, keepdims=True) - f.min(2, keepdims=True)) / 12, 0, 1)
    f = f * (1 - neutral) + f.mean(2, keepdims=True) * neutral

    # 4) шкіра: менше жовтого
    lab = cv2.cvtColor(np.clip(f, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    a, b = lab[..., 1] - 128, lab[..., 2] - 128
    hue = np.degrees(np.arctan2(b, a))
    skin = np.clip((np.hypot(a, b) - 10) / 8, 0, 1) * np.exp(-((hue - 55) / 20) ** 2) * np.clip((lab[..., 0] - 50) / 20, 0, 1)
    skin = cv2.GaussianBlur(skin, (0, 0), 3)
    lab[..., 2] -= 12 * skin          # жовтизна
    lab[..., 1] -= 2 * skin        # трохи менше помаранчевого
    f = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)

    enc.stdin.write(f.tobytes())

enc.stdin.close()
enc.wait()
dec.wait()
