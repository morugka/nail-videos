// Прозорі PNG-написи 1080×1920 для Reels у стилі KM: Cormorant Garamond, білий + золото, ромбик з лінією.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const F = path.join(__dirname, '../reels-covers/fonts');
const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const LAT = 'U+0000-00FF, U+2000-206F';
const face = (w) =>
  `@font-face { font-family: CG; src: url('file://${F}/cormorant-garamond-cyrillic-${w}-normal.woff2'); font-weight: ${w}; unicode-range: ${CYR}; }
   @font-face { font-family: CG; src: url('file://${F}/cormorant-garamond-latin-${w}-normal.woff2'); font-weight: ${w}; unicode-range: ${LAT}; }`;
const orn = '<div class="orn"><i></i><span></span></div>';

const overlays = {
  hook: `<div class="t" style="top:330px"><h1>Котяче око</h1><div class="sub">від бази до ефекту</div>${orn}</div>`,
  s1: `<div class="t" style="top:330px"><div class="lab"><b>01</b>База</div>${orn}</div>`,
  s2: `<div class="t" style="top:330px"><div class="lab"><b>02</b>Колір</div>${orn}</div>`,
  s3: `<div class="t" style="top:330px"><div class="lab"><b>03</b>Магніт</div>${orn}</div>`,
  s4: `<div class="t" style="top:330px"><div class="lab"><b>04</b>Ефект</div>${orn}</div>`,
  cta: `<img class="logo" src="file://${path.join(__dirname, 'overlays/km-logo.png')}">
        <div class="t" style="top:330px"><h1 style="font-size:104px">Хочете таке?</h1><div class="sub">Запис у директ</div>${orn}</div>`,
};

const html = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>
${face(400)}${face(500)}
* { margin: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; background: transparent; }
.t::before { content: ''; position: absolute; left: -120px; right: -60px; top: -70px; bottom: -70px; z-index: -1;
  background: radial-gradient(closest-side, rgba(0,0,0,.5), rgba(0,0,0,.28) 55%, rgba(0,0,0,0)); }
.t { position: absolute; left: 80px; right: 120px; color: #fff; font-family: CG, serif; text-shadow: 0 0 3px rgba(0,0,0,.6), 0 2px 22px rgba(0,0,0,.85), 0 0 46px rgba(0,0,0,.6); }
h1 { font-weight: 500; font-size: 120px; line-height: .95; letter-spacing: 3px; text-transform: uppercase; }
.sub { font-weight: 500; font-size: 56px; letter-spacing: 4px; text-transform: uppercase; color: #e2c07e; margin-top: 18px; }
.lab { font-weight: 500; font-size: 84px; letter-spacing: 4px; text-transform: uppercase; line-height: 1; }
.lab b { font-weight: 500; color: #e2c07e; margin-right: 26px; font-variant-numeric: lining-nums; }
.orn { display: flex; align-items: center; gap: 16px; margin-top: 26px; width: 380px; }
.orn i { width: 14px; height: 14px; background: #c9a45c; transform: rotate(45deg) scale(.75); flex: none; }
.orn span { flex: 1; height: 1.5px; background: linear-gradient(90deg, #c9a45c, rgba(201,164,92,0)); }
.logo { position: absolute; left: 80px; top: 90px; width: 170px; }
</style></head><body>${body}</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [k, body] of Object.entries(overlays)) {
    const f = path.join(__dirname, `tmp-${k}.html`);
    fs.writeFileSync(f, html(body));
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, 'overlays', `${k}.png`), omitBackground: true });
    fs.unlinkSync(f);
  }
  await browser.close();
})();
