"""Фото кішки на чорному фоні: світлий розмитий фон і плед → чорний, кішка лишається як є,
вуса на фоні перетворюються на світлі лінії (з деталей зображення).
Використання: python3 blackbg.py cat.jpg cat-black.png"""
import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
img = cv2.imread(src).astype(np.float32)
hsv = cv2.cvtColor(cv2.GaussianBlur(img, (0, 0), 12).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)

# кішка: насичена тепло-коричнева й темніша за фон (по сильно розмитому кадру — без вусів)
sat, val = hsv[..., 1] / 255, hsv[..., 2] / 255
cat = np.clip((sat - 0.30) / 0.12, 0, 1) * np.clip((0.50 - val) / 0.12, 0, 1)   # плед: s≈0.15–0.26, v≈0.45–0.7
cat = cv2.GaussianBlur(cat, (0, 0), 6)
cat = np.clip((cat - 0.15) / 0.6, 0, 1)

# вуса й волоски на фоні: дрібні деталі будь-якого знаку → світлі лінії
gray = cv2.cvtColor(img.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
diff = gray - cv2.GaussianBlur(gray, (0, 0), 2.0)
# на світлому небі вуса темніші за фон, на пледі — світліші: беремо лише «свій» знак, інакше лінії двояться
bright = np.clip((val - 0.6) / 0.15, 0, 1)
detail = bright * np.maximum(-diff, 0) + (1 - bright) * np.maximum(diff, 0)
hair = np.clip((detail - 2.5) / 12, 0, 1) ** 0.8
# біля контуру кішки деталь — це перепад «шерсть/фон», а не волосок: там не малюємо, щоб не було ореолу
edge = cv2.GaussianBlur(cv2.dilate((cat > 0.05).astype(np.uint8), np.ones((15, 15), np.uint8)).astype(np.float32), (0, 0), 3)
hair *= 1 - edge * (1 - cat)
whisker = np.dstack([hair * 222, hair * 230, hair * 235])  # трохи холодний білий, як на фото

bg = np.full_like(img, 8)
out = img * cat[..., None] + (bg + whisker) * (1 - cat[..., None])
# легке поглиблення тіней на кішці під загальний темний стиль
out = 255 * (np.clip(out, 0, 255) / 255) ** 1.08
cv2.imwrite(dst, np.clip(out, 0, 255).astype(np.uint8))
