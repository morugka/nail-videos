// Обкладинка Reels «Котяче око» з фото кішки: 1080×1920, логотип зліва вгорі, хук унизу.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const F = path.join(__dirname, '../../reels-covers/fonts');
const face = (w) => ['cyrillic', 'latin']
  .map((s) => `@font-face { font-family: CG; src: url('file://${F}/cormorant-garamond-${s}-${w}-normal.woff2'); font-weight: ${w}; unicode-range: ${s === 'cyrillic' ? 'U+0400-045F, U+0490-0491' : 'U+0000-00FF, U+2000-206F'}; }`)
  .join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${face(500)}
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1920px; position: relative; overflow: hidden; background: #080808; }
.bg { position: absolute; inset: 0; }
.logo { position: absolute; left: 80px; top: 310px; width: 200px; }
.t::before { content: ''; position: absolute; left: -140px; right: -40px; top: -90px; bottom: -80px; z-index: -1;
  background: radial-gradient(closest-side, rgba(0,0,0,.85), rgba(0,0,0,.6) 55%, rgba(0,0,0,0)); }
.t { position: absolute; left: 80px; right: 120px; top: 1330px; color: #fff; font-family: CG, serif;
     text-shadow: 0 0 3px rgba(0,0,0,.7), 0 2px 24px rgba(0,0,0,.9); }
h1 { font-weight: 500; font-size: 118px; line-height: .95; letter-spacing: 3px; text-transform: uppercase; }
.sub { font-weight: 500; font-size: 54px; letter-spacing: 4px; text-transform: uppercase; color: #e2c07e; margin-top: 16px; }
.orn { display: flex; align-items: center; gap: 16px; margin-top: 24px; width: 380px; }
.orn i { width: 14px; height: 14px; background: #c9a45c; transform: rotate(45deg) scale(.75); flex: none; }
.orn span { flex: 1; height: 1.5px; background: linear-gradient(90deg, #c9a45c, rgba(201,164,92,0)); }
</style></head><body>
<img class="bg" src="file://${path.join(__dirname, 'cat-916.png')}">
<img class="logo" src="file://${path.join(__dirname, '../overlays/km-logo.png')}">
<div class="t"><h1>Котяче око</h1><div class="sub">з нуля до WOW</div><div class="orn"><i></i><span></span></div></div>
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp.html');
  fs.writeFileSync(f, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + f);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, '../out/cat-eye-cover-cat.png') });
  await b.close();
  fs.unlinkSync(f);
})();
