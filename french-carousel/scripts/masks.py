# Маски «рука + рукав» для фото: rembg, результат у masks/<name>.png
import sys, pathlib
from PIL import Image
from rembg import new_session, remove

model = sys.argv[1]
root = pathlib.Path(__file__).resolve().parent.parent
sess = new_session(model)
for name in sys.argv[2:]:
    src = next((root / 'source').glob(f'{name}.*'))
    im = Image.open(src).convert('RGB')
    small = im.copy(); small.thumbnail((1600, 1600))
    m = remove(small, session=sess, only_mask=True).resize(im.size, Image.LANCZOS)
    m.save(root / 'masks' / f'{name}-{model}.png')
    print(name, flush=True)
