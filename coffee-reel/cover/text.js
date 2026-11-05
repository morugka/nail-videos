// Напис для Reels про пінку: логотип зліва вгорі, заголовок + золотий підзаголовок. → overlay.png (прозорий 1080×1920)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SUB = process.argv[2] || 'догляд, що пахне капучино';
const F = path.join(__dirname, '../../reels-covers/fonts');
const face = (w) => ['cyrillic', 'latin']
  .map((s) => `@font-face { font-family: CG; src: url('file://${F}/cormorant-garamond-${s}-${w}-normal.woff2'); font-weight: ${w}; unicode-range: ${s === 'cyrillic' ? 'U+0400-045F, U+0490-0491' : 'U+0000-00FF, U+2000-206F'}; }`)
  .join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${face(500)}
* { margin: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; background: transparent; }
.logo { position: absolute; left: 80px; top: 90px; width: 170px; }
.t { position: absolute; left: 80px; right: 120px; top: 300px; text-align: right; color: #fff; font-family: CG, serif;
     text-shadow: 0 0 3px rgba(0,0,0,.6), 0 2px 22px rgba(0,0,0,.85); }
.t::before { content: ''; position: absolute; left: -40px; right: -140px; top: -80px; bottom: -70px; z-index: -1;
     background: radial-gradient(closest-side, rgba(0,0,0,.55), rgba(0,0,0,.3) 55%, rgba(0,0,0,0)); }
h1 { font-weight: 500; font-size: 80px; line-height: .98; white-space: nowrap; letter-spacing: 3px; text-transform: uppercase; }
.sub { font-weight: 500; font-size: 44px; letter-spacing: 3px; text-transform: uppercase; color: #e2c07e; margin-top: 16px; }
.orn { display: flex; flex-direction: row-reverse; align-items: center; gap: 16px; margin: 22px 0 0 auto; width: 380px; }
.orn i { width: 14px; height: 14px; background: #c9a45c; transform: rotate(45deg) scale(.75); flex: none; }
.orn span { flex: 1; height: 1.5px; background: linear-gradient(270deg, #c9a45c, rgba(201,164,92,0)); }
</style></head><body>
<img class="logo" src="file://${path.join(__dirname, '../../cat-eye-reel/overlays/km-logo.png')}">
<div class="t"><h1>Манікюр<br>з ароматом кави</h1><div class="sub">${SUB}</div><div class="orn"><i></i><span></span></div></div>
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp.html');
  fs.writeFileSync(f, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + f);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, 'text.png'), omitBackground: true });
  await b.close();
  fs.unlinkSync(f);
})();
