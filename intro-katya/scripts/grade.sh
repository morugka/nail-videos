#!/usr/bin/env bash
# Upscale to 1080x1920, light denoise, lift shadows, warm the skin, gentle sharpening
set -euo pipefail
ffmpeg -y -i "${1:-source/original.mp4}" -an -r 30 \
  -vf "scale=1080:1920:flags=lanczos,hqdn3d=1.5:1.5:3:3,curves=master='0/0.02 0.25/0.30 0.6/0.64 1/0.98',eq=saturation=1.12:contrast=1.03,colorbalance=rs=0.03:bs=-0.03:rm=0.02:bm=-0.02,unsharp=5:5:0.6:5:5:0" \
  -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -movflags +faststart "${2:-public/clean.mp4}"
