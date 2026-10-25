// Обкладинки Reels 1080×1920. Використання: node render.js <фото> <назва>
// Текст тримаємо в зоні 3:4 (y 240–1680) — так його видно і в сітці профілю.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const photo = path.resolve(process.argv[2] || 'photos/3-etapy-preview.png');
const name = process.argv[3] || '3-etapy';

const variants = {
  // A — по центру, як на більшості ваших обкладинок
  a: `<div class="t center" style="top:300px">
        <div class="big">3 етапи,</div>
        <div class="it">які я більше не роблю</div>
        <div class="orn"><span></span><i>✦</i><span></span></div>
      </div>`,
  // B — велика золота трійка
  b: `<div class="t center" style="top:200px">
        <div class="num">3</div>
        <div class="big sm">етапи,</div>
        <div class="it">які я більше не роблю</div>
      </div>`,
  // C — зліва, з тонкою лінією
  c: `<div class="t left" style="top:330px">
        <div class="big">3 етапи,</div>
        <div class="it">які я більше<br>не роблю</div>
        <div class="line"></div>
      </div>`,
};

const html = (v) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: C; src: url('fonts/Cormorant.ttf'); font-weight: 300 700; }
@font-face { font-family: C; src: url('fonts/Cormorant-Italic.ttf'); font-weight: 300 700; font-style: italic; }
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1920px; background: #050505; position: relative; overflow: hidden; }
.ph { position: absolute; left: 0; bottom: 0; width: 1080px; height: 1300px; object-fit: cover; object-position: center bottom; }
.fade { position: absolute; left: 0; right: 0; top: 590px; height: 170px; background: linear-gradient(#050505 0%, #050505 20%, rgba(5,5,5,0)); }
.t { font-variant-numeric: lining-nums; position: absolute; left: 90px; right: 90px; color: #f4efe7; font-family: C, serif; }
.center { text-align: center; }
.big { font-size: 150px; font-weight: 500; text-transform: uppercase; line-height: 1; letter-spacing: 2px; }
.big.sm { font-size: 120px; letter-spacing: 6px; }
.num { font-size: 300px; line-height: 1; margin-bottom: 10px; color: #c9a46a; font-weight: 500; }
.it { font-style: italic; font-size: 92px; color: #d4b17a; line-height: 1.05; margin-top: 18px; }
.orn { display: flex; align-items: center; gap: 20px; width: 380px; margin: 44px auto 0; }
.orn span { flex: 1; height: 1.5px; background: linear-gradient(90deg, transparent, #c9a46a, transparent); }
.orn i { color: #c9a46a; font-style: normal; font-size: 26px; }
.line { width: 260px; height: 1.5px; background: #c9a46a; margin-top: 50px; }
</style></head><body>
<img class="ph" src="file://${photo}">
<div class="fade"></div>
${v}
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [k, v] of Object.entries(variants)) {
    const f = path.join(__dirname, `tmp-${k}.html`);
    fs.writeFileSync(f, html(v));
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(__dirname, 'out', `${name}-${k}.png`);
    await page.screenshot({ path: out });
    fs.unlinkSync(f);
    console.log(out);
  }
  await browser.close();
})();
