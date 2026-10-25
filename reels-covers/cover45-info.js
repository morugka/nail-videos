// Обкладинка поста 4:5 (1080×1350): логотип у вільному куті, внизу заголовок + золота лінія + підзаголовок.
// node cover45-info.js <фото> <out.png> <json-налаштування>
// напр.: '{"title":"Quiet Luxury","sub":"А ви з якої команди?","subStyle":"cg","textTop":930,"logo":{"right":50,"top":60,"width":160}}'
// subStyle: "" — Montserrat Regular капсом, "light" — Montserrat Light, "cg" — Cormorant Garamond золотом,
//           "ref" — як на референсі: усе Oranienbaum, золотий рядок під назвою, ромбик з лінією внизу
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [photo, out, cfgJson] = process.argv.slice(2);
const cfg = JSON.parse(cfgJson);
const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
const LAT = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const face = (fam, file, w) =>
  [['cyrillic', CYR], ['latin', LAT]]
    .map(([s, r]) => `@font-face { font-family: ${fam}; src: url('fonts/${file}-${s}-${w}-normal.woff2'); font-weight: ${w}; unicode-range: ${r}; }`)
    .join('\n');
const logo = cfg.logo;
const logoCss = logo.right != null ? `right: ${logo.right}px;` : `left: ${logo.left}px;`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${face('CG', 'cormorant-garamond', 400)}
${face('CG', 'cormorant-garamond', 500)}
${face('M', 'montserrat', 300)}
${face('M', 'montserrat', 400)}
${face('O', 'oranienbaum', 400)}
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1350px; position: relative; overflow: hidden; background: #0a0a0a; }
.ph { position: absolute; inset: 0; width: 1080px; height: 1350px; object-fit: cover; }
.logo { position: absolute; ${logoCss} top: ${logo.top}px; width: ${logo.width}px; }
.t { position: absolute; left: 80px; right: 80px; top: ${cfg.textTop}px; color: #fff; }
h1 { font-family: CG, serif; font-weight: 500; font-size: ${cfg.size || 100}px; line-height: 1; letter-spacing: 3px; text-transform: uppercase; }
.rule { position: relative; width: 380px; height: 14px; margin: 30px 0 26px; }
.rule::before { content: ''; position: absolute; left: 0; right: 0; top: 6.5px; height: 1px; background: #c9a45c; }
.rule i { position: absolute; left: 50%; top: 0; width: 14px; height: 14px; margin-left: -7px; background: #c9a45c; transform: rotate(45deg) scale(.7); box-shadow: 0 0 0 6px #0a0a0a; }
.sub { font-family: M, sans-serif; font-weight: 400; font-size: 26px; letter-spacing: 6px; text-transform: uppercase; color: #e9e4dc; }
/* підзаголовок-акцент: Cormorant Garamond, звичайний регістр, золото */
.sub.cg { font-family: CG, serif; font-weight: 400; font-size: 56px; letter-spacing: 1px; text-transform: none; color: #c9a45c; }
/* стиль за референсом «ЗАНАДТО ЯСКРАВИЙ, щоб програти»: Oranienbaum, золотий рядок під назвою, ромбик з лінією внизу */
.ref h1 { font-family: O, serif; font-weight: 400; letter-spacing: 1px; line-height: 0.95; }
.ref .sub { font-family: O, serif; font-size: ${Math.round((cfg.size || 100) * 0.62)}px; letter-spacing: 0.5px; text-transform: none; color: #c9a45c; margin-top: 14px; }
.ref .orn { display: flex; align-items: center; gap: 18px; margin-top: 30px; width: 420px; }
.ref .orn i { width: 14px; height: 14px; background: #c9a45c; transform: rotate(45deg) scale(.75); flex: none; }
.ref .orn span { flex: 1; height: 1px; background: linear-gradient(90deg, #c9a45c, rgba(201,164,92,0)); }
/* підзаголовок тонким Montserrat Light, звичайний регістр */
.sub.light { font-weight: 300; font-size: 32px; letter-spacing: 1.5px; text-transform: none; }
</style></head><body>
<img class="ph" src="file://${path.resolve(photo)}">
<img class="logo" src="file://${path.join(__dirname, 'assets/km-logo.png')}">
${cfg.subStyle === 'ref'
  ? `<div class="t ref"><h1>${cfg.title}</h1><div class="sub">${cfg.sub}</div><div class="orn"><i></i><span></span></div></div>`
  : `<div class="t"><h1>${cfg.title}</h1><div class="rule"><i></i></div><div class="sub ${cfg.subStyle || ''}">${cfg.sub}</div></div>`}
</body></html>`;

(async () => {
  const f = path.join(__dirname, 'tmp-45i.html');
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
