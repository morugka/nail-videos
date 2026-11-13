"""Grade a span of the source video into 1080x1920 / 30 fps.

usage: python3 process.py SRC OUT [START_S DURATION_S]
"""
import subprocess
import sys

import numpy as np

from grade import grade_u8, vignette

W, H, FPS = 1080, 1920, 30

src, out = sys.argv[1], sys.argv[2]
span = ["-ss", sys.argv[3], "-t", sys.argv[4]] if len(sys.argv) > 4 else []

dec = subprocess.Popen(
    ["ffmpeg", "-v", "error", *span, "-i", src, "-an",
     "-vf", f"fps={FPS},scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
    stdout=subprocess.PIPE,
)
enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
     "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "15",
     "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
    stdin=subprocess.PIPE,
)
vig = vignette(W, H)
n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    enc.stdin.write(grade_u8(f, vig).tobytes())
    n += 1
enc.stdin.close()
enc.wait()
dec.wait()
print(f"{out}: {n} frames")
