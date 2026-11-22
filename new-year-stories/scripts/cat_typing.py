"""Builds the cat-typing script: keystroke timeline (JSON for Remotion) + matching typewriter sound track (WAV).

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
    ("type", "\nі говядінку на новій рік"),
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

# typewriter sound: a sharp metallic "clack" per key, bell + carriage-return ratchet on each new line
rng = np.random.default_rng(3)
dur = t + 4
audio = np.zeros(int(SR * dur))


def add(sig, at):
    i = int(at * SR)
    audio[i:i + len(sig)] += sig[: max(0, len(audio) - i)]


def clack():
    n = int(SR * 0.09)
    tt = np.arange(n) / SR
    noise = rng.uniform(-1, 1, n)
    hi = np.diff(noise, prepend=0)  # crude high-pass: bright strike
    strike = hi * np.exp(-tt * 160)
    body = np.sin(2 * np.pi * rng.uniform(170, 230) * tt) * np.exp(-tt * 55) * 0.8  # wooden thud
    ring = np.sin(2 * np.pi * rng.uniform(3200, 3900) * tt) * np.exp(-tt * 90) * 0.25  # metal type bar
    return (strike * 0.9 + body + ring) * rng.uniform(0.32, 0.42)


def bell():
    n = int(SR * 0.9)
    tt = np.arange(n) / SR
    f = 2100
    s_ = sum(a * np.sin(2 * np.pi * f * m * tt) for m, a in ((1, 1), (2.76, 0.4), (5.4, 0.15)))
    return s_ * np.exp(-tt * 5) * 0.22


def carriage():
    n = int(SR * 0.32)
    tt = np.arange(n) / SR
    clicks = np.zeros(n)
    for k in range(14):  # ratchet teeth
        i = int((0.012 + k * 0.019) * SR)
        m = int(SR * 0.006)
        clicks[i:i + m] += rng.uniform(-1, 1, m) * np.exp(-np.arange(m) / SR * 600)
    slide = rng.uniform(-1, 1, n) * 0.08 * np.sin(np.pi * tt / tt[-1])
    thunk = np.sin(2 * np.pi * 140 * tt) * np.exp(-(tt - tt[-1]) ** 2 * 4000) * 0.6
    return (clicks * 0.45 + slide + thunk) * 0.7


prev = ""
for tt, tx in events:
    if len(tx) > len(prev) and tx.endswith("\n"):
        add(bell(), tt - 0.12)
        add(carriage(), tt)
    else:
        add(clack(), tt)
    prev = tx

audio /= max(1.0, np.abs(audio).max() / 0.9)
pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
with wave.open("public/cat/keys.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{len(events)} keystrokes, typing ends at {t:.1f}s")
