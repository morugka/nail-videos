import sys, numpy as np, cv2, subprocess
sys.path.insert(0, sys.argv[3]); from grade import *
src, dst = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS)
W, H = int(cap.get(3)), int(cap.get(4))
ff = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r","20","-i","-",
  "-c:v","libx264","-crf","14","-preset","medium","-pix_fmt","yuv420p",dst], stdin=subprocess.PIPE)
vig = vignette(W,H)
yy = np.mgrid[0:H,0:W][0].astype(np.float32)
bottom = np.clip((yy - H*0.80)/(H*0.08), 0, 1)  # clutter zone
ema=None; i=0
while True:
    ok, f = cap.read()
    if not ok: break
    t = i/20
    fg = fg_from(f, None)
    if t < 11.8:
        s = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)[...,1].astype(np.float32)/255
        skin = cv2.GaussianBlur(np.clip((s-0.15)/0.08,0,1),(15,15),0)
        fg = fg*(1-bottom) + fg*bottom*skin
    ema = fg if ema is None else 0.65*fg + 0.35*ema
    ff.stdin.write(grade(f, ema, vig).tobytes()); i+=1
ff.stdin.close(); ff.wait(); print("frames", i)
