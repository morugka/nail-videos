"""Builds the cat-typing script: keystroke timeline (JSON for Remotion) + matching key-click track (WAV).

Run from the project root:  python3 scripts/cat_typing.py
Edit STEPS to change the text. Each step: ("type", text) | ("pause", seconds) | ("erase", n_chars) | ("mash", text)
"""
import json
import random
import wave

import numpy as np

FPS = 30
SR = 44100
START = 0.5  # seconds before the first key

STEPS = [
    ("type", "Дарагі дівчатка!!"),
    ("pause", 0.5),
    ("type", "\nзапесуйтесь до мами на манікюрь і педекюр"),
    ("pause", 0.35),
    ("mash", "ффждлфф"),
    ("pause", 0.3),
    ("erase", 7),
    ("type", "\nшоб вона купила мєні консерви"),
    ("pause", 0.4),
    ("type", "\nі рибку на новій рік"),
    ("pause", 0.5),
    ("type", "\nпешіть мамі в дірєкт"),
    ("pause", 0.35),
    ("type", "\nмяу"),
]

random.seed(7)
events = []  # (time_s, text_after)
text, t = "", START
for kind, arg in STEPS:
    if kind == "pause":
        t += arg
    elif kind in ("type", "mash"):
        for ch in arg:
            text += ch
            events.append((t, text))
            gap = 0.045 if kind == "mash" else random.uniform(0.045, 0.085)
            if ch == " " and kind == "type" and random.random() < 0.15:
                gap += 0.12  # hesitation between words
            t += gap
    elif kind == "erase":
        for _ in range(arg):
            text = text[:-1]
            events.append((t, text))
            t += 0.05

frames = [{"f": round(tt * FPS), "text": tx} for tt, tx in events]
json.dump({"frames": frames, "end": round(t * FPS)}, open("src/cat/script.json", "w"), ensure_ascii=False, indent=0)

# soft key-click track
dur = t + 4
audio = np.zeros(int(SR * dur))
for tt, _ in events:
    n = int(SR * 0.035)
    env = np.exp(-np.linspace(0, 9, n))
    click = (np.random.uniform(-1, 1, n) * 0.6 + np.sin(np.linspace(0, 2 * np.pi * random.uniform(1800, 2600) * 0.035, n)) * 0.4) * env
    i = int(tt * SR)
    audio[i:i + n] += click * random.uniform(0.18, 0.28)
pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
with wave.open("public/cat/keys.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{len(events)} keystrokes, typing ends at {t:.1f}s")
