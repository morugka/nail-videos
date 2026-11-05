"""Обробка відео з пінкою: рівний чорний фон без мерехтіння і природніший (менш жовтий) тон шкіри.
1) ffmpeg: часове шумозаглушення (прибирає «кипіння» шуму й блоків у темряві);
2) стабілізація яскравості фону: по чистій темній зоні вгорі кадру кожен кадр зводиться до однакового рівня;
3) м'яке «притискання» тіней до глибокого чорного з збереженням відтінку (сині нігті лишаються синіми);
4) шкіра: у Lab зменшуємо жовтизну (b) і трохи — помаранчевість, лише в зоні теплих насичених тонів;
5) нігті (темно-синє покриття): повертаємо реальний колір DENIM 20 — світліший сіро-синій, як на фото бренду.
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
# колір DENIM 20 з фото бренду (Lab OpenCV 0–255): L≈32, a≈131, b≈116
NAIL_L, NAIL_A, NAIL_B = 31.0, 2.0, -9.0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)

    # маска нігтів до будь-яких змін: темні пікселі з помітною перевагою синього
    lab0 = cv2.cvtColor(f.astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    nail = ((f[..., 0] - f[..., 2] > 11) & (lab0[..., 0] < 40)).astype(np.uint8)
    nail = cv2.morphologyEx(nail, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    n_cnt, n_lab, n_st, _ = cv2.connectedComponentsWithStats(nail)
    keep = np.zeros(n_cnt, bool)
    keep[1:] = n_st[1:, cv2.CC_STAT_AREA] > 2500          # нігті — великі суцільні плями, тіні джинсу — дрібні
    nail = keep[n_lab].astype(np.uint8)
    nail = cv2.dilate(nail, np.ones((9, 9), np.uint8))   # разом із бліками на краях
    nail = cv2.GaussianBlur(nail.astype(np.float32), (0, 0), 4)
    # усередині маски — лише справді темні синюваті пікселі, щоб не фарбувати шкіру й піну на межі
    nail *= np.clip((60 - lab0[..., 0]) / 25, 0, 1) * np.clip((f[..., 0] - f[..., 2] + 2) / 8, 0, 1)
    nail_base = lab0[..., 0][nail > 0.9]

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

    # 5) нігті: працюємо від вихідного (до притемнення) кольору
    if nail_base.size > 500:
        L0 = lab0[..., 0]
        lift = NAIL_L - np.median(nail_base)              # підняти тіло нігтя до рівня еталона
        L1 = L0 + lift * (1 - np.clip((L0 - 60) / 90, 0, 1))   # бліки не пересвічуємо
        nl = np.dstack([L1, 128 + (lab0[..., 1] - 128) * 0.35 + NAIL_A, 128 + (lab0[..., 2] - 128) * 0.35 + NAIL_B])
        lab = lab * (1 - nail[..., None]) + nl * nail[..., None]
    f = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)

    enc.stdin.write(f.tobytes())

enc.stdin.close()
enc.wait()
dec.wait()
