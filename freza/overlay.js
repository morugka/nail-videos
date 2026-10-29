// Прозорий оверлей 1080×1920 з написом для низу кадру (стиль обкладинок KM Nail Artist).
// node overlay.js <out.png>
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const out = path.resolve(process.argv[2] || path.join(__dirname, 'overlay.png'));
const fonts = path.join(__dirname, 'fonts');

// низ затемнюється від SHADE_TOP, текст опущено на темну решітку внизу кадру
const SHADE_TOP = 1360;
const TEXT_BOTTOM = 1920 - 110;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: CG; src: url('${fonts}/cormorant-garamond-cyrillic-500-normal.woff2'); font-weight: 500; unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: CG; src: url('${fonts}/cormorant-garamond-latin-500-normal.woff2'); font-weight: 500; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: M; src: url('${fonts}/montserrat-cyrillic-400-normal.woff2'); font-weight: 400; unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: M; src: url('${fonts}/montserrat-latin-400-normal.woff2'); font-weight: 400; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
* { margin: 0; box-sizing: border-box; }
html, body { background: transparent; }
body { width: 1080px; height: 1920px; position: relative; overflow: hidden; }
.shade { position: absolute; left: 0; right: 0; top: ${SHADE_TOP}px; bottom: 0;
  background: linear-gradient(rgba(10,10,10,0) 0px, rgba(10,10,10,.72) 260px, rgba(10,10,10,.88) 100%); }
.t { position: absolute; left: 80px; right: 120px; bottom: ${1920 - TEXT_BOTTOM}px; text-align: left; }
h1 { font-family: CG, serif; font-size: 104px; font-weight: 500; line-height: 0.98; letter-spacing: 2px;
  text-transform: uppercase; color: #fff; }
.rule { position: relative; width: 420px; height: 14px; margin: 34px 0 28px; }
.rule::before { content: ''; position: absolute; left: 0; right: 0; top: 6.5px; height: 1px; background: #c9a45c; }
.rule i { position: absolute; left: 50%; top: 0; width: 14px; height: 14px; margin-left: -7px; background: #c9a45c;
  transform: rotate(45deg) scale(.7); box-shadow: 0 0 0 6px #0d0d0d; }
.sub { font-family: CG, serif; font-weight: 500; font-size: 58px; letter-spacing: 3px; text-transform: uppercase; color: #e6c47c;
  text-shadow: 0 0 18px rgba(230,196,124,.25); }
</style></head><body>
<div class="shade"></div>
<div class="t"><h1>Я від цього<br>відмовилася</h1><div class="rule"><i></i></div><div class="sub">і тільки виграла</div></div>
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp-overlay.html');
  fs.writeFileSync(f, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, omitBackground: true });
  await browser.close();
  fs.unlinkSync(f);
  console.log(out);
})();
