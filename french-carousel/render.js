// Карусель «Види френчу» 4:5 (1080×1350): зліва фото, справа текст на темному фоні.
// node render.js [slides.json] — PNG у out/. Фото кладіть у photos/ під іменами з slides.json.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const data = JSON.parse(fs.readFileSync(path.resolve(process.argv[2] || path.join(dir, 'slides.json')), 'utf8'));
const W = 1080;
const H = 1350;
const PHOTO_W = 560; // ширина фото зліва

const font = (fam, file, weight) => ['cyrillic', 'latin'].map((s) =>
  `@font-face { font-family: ${fam}; font-weight: ${weight}; src: url('file://${dir}/fonts/${file.replace('%', s)}.woff2'); unicode-range: ${s === 'cyrillic'
    ? 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'
    : 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'}; }`).join('\n');

const css = `
${font('CG', 'cormorant-garamond-%-400-normal', 400)}
${font('CG', 'cormorant-garamond-%-500-normal', 500)}
${font('M', 'montserrat-%-300-normal', 300)}
${font('M', 'montserrat-%-400-normal', 400)}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden; background: #0a0a0a; color: #f2ece2; font-variant-numeric: lining-nums; }
.photo { position: absolute; left: 0; top: 0; width: ${PHOTO_W}px; height: ${H}px; object-fit: cover; }
.photo.ph { background: #2a2622; }
/* м'який перехід фото в темну панель */
.fade { position: absolute; left: ${PHOTO_W - 90}px; top: 0; width: 90px; height: ${H}px; background: linear-gradient(90deg, rgba(10,10,10,0), #0a0a0a); }
.panel { position: absolute; left: ${PHOTO_W}px; right: 0; top: 0; bottom: 0; padding: 0 64px 0 44px; display: flex; flex-direction: column; justify-content: center; }
.top { position: absolute; left: ${PHOTO_W + 44}px; right: 64px; top: 72px; display: flex; justify-content: space-between; align-items: center;
  font-family: M, sans-serif; font-weight: 400; font-size: 20px; letter-spacing: 6px; text-transform: uppercase; color: rgba(242,236,226,.5); }
.num { font-family: CG, serif; font-weight: 500; font-size: 150px; line-height: .8; color: #c9a45c; margin-bottom: 36px; }
.tag { font-family: M, sans-serif; font-weight: 400; font-size: 20px; letter-spacing: 6px; text-transform: uppercase; color: #c9a45c; margin-bottom: 18px; }
h1 { font-family: CG, serif; font-weight: 500; font-size: 76px; line-height: .98; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; }
h1.big { font-size: 104px; }
.acc { color: #c9a45c; }
.rule { position: relative; width: 300px; height: 14px; margin: 38px 0 34px; }
.rule::before { content: ''; position: absolute; left: 0; right: 0; top: 6.5px; height: 1px; background: #c9a45c; }
.rule i { position: absolute; left: 50%; top: 0; width: 14px; height: 14px; margin-left: -7px; background: #c9a45c; transform: rotate(45deg) scale(.7); box-shadow: 0 0 0 6px #0a0a0a; }
p { font-family: M, sans-serif; font-weight: 300; font-size: 29px; line-height: 1.5; color: #e9e4dc; }
ul { list-style: none; margin-top: 34px; }
li { font-family: M, sans-serif; font-weight: 400; font-size: 22px; letter-spacing: 3px; text-transform: uppercase; color: #e9e4dc; padding: 10px 0 10px 32px; position: relative; }
li::before { content: ''; position: absolute; left: 4px; top: 50%; width: 9px; height: 9px; margin-top: -5px; background: #c9a45c; transform: rotate(45deg); }
.sub { font-family: M, sans-serif; font-weight: 400; font-size: 24px; letter-spacing: 6px; text-transform: uppercase; color: #e9e4dc; line-height: 1.6; }
.hint { position: absolute; left: ${PHOTO_W + 44}px; right: 64px; bottom: 72px; font-family: M, sans-serif; font-weight: 400; font-size: 20px; letter-spacing: 6px; text-transform: uppercase; color: #c9a45c; }
.logo { width: 150px; margin-bottom: 70px; }
`;

const photo = (p) => {
  const f = path.join(dir, p);
  return fs.existsSync(f) ? `<img class="photo" src="file://${f}">` : '<div class="photo ph"></div>';
};
const rule = '<div class="rule"><i></i></div>';
const total = data.slides.length;
const pad = (n) => String(n).padStart(2, '0');

const pages = [];
const c = data.cover;
pages.push(`${photo(c.photo)}<div class="fade"></div>
<div class="panel"><img class="logo" src="file://${dir}/assets/km-logo.png">
<div class="tag">${c.kicker}</div><h1 class="big">${c.title}</h1>${rule}<div class="sub">${c.sub}</div></div>
<div class="hint">${c.hint}</div>`);
data.slides.forEach((s, i) => {
  pages.push(`${photo(s.photo)}<div class="fade"></div>
<div class="top"><span>Види френчу</span><span>${pad(i + 1)} / ${pad(total)}</span></div>
<div class="panel"><div class="num">${pad(i + 1)}</div><div class="tag">${s.tag}</div><h1>${s.title}</h1>${rule}
<p>${s.text}</p>${s.points?.length ? `<ul>${s.points.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}</div>`);
});
const e = data.end;
pages.push(`${photo(e.photo)}<div class="fade"></div>
<div class="panel"><h1 class="big">${e.title}</h1>${rule}<p>${e.text}</p></div>
<div class="hint">${e.hint}</div>`);

(async () => {
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  for (const [i, body] of pages.entries()) {
    const tmp = path.join(dir, 'tmp-slide.html');
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    // довгі назви зменшуємо, доки не вмістяться в ширину панелі
    await page.evaluate(() => document.querySelectorAll('h1').forEach((h) => {
      let size = parseFloat(getComputedStyle(h).fontSize);
      while (h.scrollWidth > h.clientWidth && size > 40) h.style.fontSize = `${(size -= 2)}px`;
    }));
    const out = path.join(dir, 'out', `${pad(i + 1)}.png`);
    await page.screenshot({ path: out });
    console.log(out);
  }
  fs.unlinkSync(path.join(dir, 'tmp-slide.html'));
  await browser.close();
})();
