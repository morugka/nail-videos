// Фото-обкладинка поста 4:5 (1080×1350): лише назва колекції англійською, без логотипа.
// node cover45-photo.js <фото 1080×1350> <out.png> "<назва>" [верх_тексту] [розмір_шрифту] [logo]
// logo — додати логотип за брифом: 200 px завширшки, 80 px зліва, 70 px зверху.
// shift — опустити фото на N px (верх кадру має бути чорним, щоб не було шва).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [photo, out, name, top = '120', size = '112', logo, shift = '0'] = process.argv.slice(2);
const latin = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: CG; src: url('fonts/cormorant-garamond-latin-400-normal.woff2'); font-weight: 400; unicode-range: ${latin}; }
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1350px; position: relative; overflow: hidden; background: #0a0a0a; }
.logo { position: absolute; left: 80px; top: 70px; width: 200px; height: auto; }
.ph { position: absolute; left: 0; top: ${shift}px; width: 1080px; height: 1350px; object-fit: cover; }
h1 { position: absolute; left: 80px; right: 80px; top: ${top}px; color: #fff; font-family: CG, serif; font-weight: 400;
  font-size: ${size}px; line-height: 0.98; letter-spacing: 6px; text-transform: uppercase; }
</style></head><body>
<img class="ph" src="file://${path.resolve(photo)}">
${logo ? `<img class="logo" src="file://${path.join(__dirname, 'assets/km-logo.png')}">` : ''}
<h1>${name.replace(/ /g, '<br>')}</h1>
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp-45.html');
  fs.writeFileSync(f, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.resolve(out) });
  await browser.close();
  fs.unlinkSync(f);
  console.log(path.resolve(out));
})();
