// Обкладинка Reels 9:16 за брифом KM Nail Artist.
// node cover916.js <фон 1080×1920> <out.png> — текст і позиції нижче.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const bg = path.resolve(process.argv[2]);
const textTop = Number(process.argv[4] || 1190);
const shadeEnd = Number(process.argv[5] || 800);
const out = path.resolve(process.argv[3]);

const LOGO = { left: 80, top: 290, width: 200 };
const title = '<span class="acc">3</span> ЕТАПИ,';
const subtitle = 'які я більше не роблю';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: C; src: url('fonts/Cormorant.ttf'); font-weight: 300 700; }
@font-face { font-family: I; src: url('fonts/Inter-Regular.otf'); }
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1920px; position: relative; overflow: hidden; background: #0a0a0a; }
.bg { position: absolute; inset: 0; width: 1080px; height: 1920px; }
/* притемнення під логотипом */
.shade { position: absolute; left: 0; right: 0; top: 0; height: ${shadeEnd}px;
  background: linear-gradient(#0a0a0a 0px, #0a0a0a 505px, rgba(10,10,10,.6) ${505 + (shadeEnd - 505) * 0.45}px, rgba(10,10,10,0) ${shadeEnd}px); }
.logo { position: absolute; left: ${LOGO.left}px; top: ${LOGO.top}px; width: ${LOGO.width}px; }
.t { position: absolute; left: 80px; right: 200px; top: ${textTop}px; color: #fff; font-family: C, serif; font-variant-numeric: lining-nums; }
h1 { font-size: 150px; font-weight: 500; line-height: 1; letter-spacing: 3px; text-transform: uppercase; }
.acc { color: #c9a45c; }
.rule { position: relative; width: 420px; height: 14px; margin: 42px 0 36px; }
.rule::before { content: ''; position: absolute; left: 0; right: 0; top: 6.5px; height: 1px; background: #c9a45c; }
.rule i { position: absolute; left: 50%; top: 0; width: 14px; height: 14px; margin-left: -7px; background: #c9a45c; transform: rotate(45deg) scale(.7); box-shadow: 0 0 0 6px #0a0a0a; }
.sub { font-family: I, sans-serif; font-size: 34px; letter-spacing: 7px; text-transform: uppercase; color: #e9e4dc; }
</style></head><body>
<img class="bg" src="file://${bg}">
<div class="shade"></div>
<img class="logo" src="file://${path.join(__dirname, 'assets/km-logo.png')}">
<div class="t"><h1>${title}</h1><div class="rule"><i></i></div><div class="sub">${subtitle}</div></div>
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp-916.html');
  fs.writeFileSync(f, html);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  await browser.close();
  fs.unlinkSync(f);
  console.log(out);
})();
