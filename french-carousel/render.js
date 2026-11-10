// Карусель «Види френчу» 4:5 (1080×1350): зліва фото (одне або два одне над одним), справа текст на темному фоні.
// node render.js [slides.json] — PNG у out/. Фото готує scripts/process.py (source/ → photos/).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const data = JSON.parse(fs.readFileSync(path.resolve(process.argv[2] || path.join(dir, 'slides.json')), 'utf8'));
const W = 1080;
const H = 1350;
const PHOTO_W = 540; // ширина фото зліва: половина висоти = рівно 4:5
const GAP = 6; // проміжок між двома фото

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
.ph { position: absolute; left: 0; width: ${PHOTO_W}px; overflow: hidden; background: #1a1816; }
.ph img { width: 100%; height: 100%; object-fit: cover; }
.lbl { position: absolute; left: 0; right: 0; bottom: 0; padding: 60px 20px 18px; background: linear-gradient(rgba(10,10,10,0), rgba(10,10,10,.75));
  font-family: M, sans-serif; font-weight: 400; font-size: 16px; letter-spacing: 4px; text-transform: uppercase; color: #f2ece2; }
/* м'який перехід фото в темну панель */
.fade { position: absolute; left: ${PHOTO_W - 70}px; top: 0; width: 70px; height: ${H}px; background: linear-gradient(90deg, rgba(10,10,10,0), #0a0a0a); }
.panel { position: absolute; left: ${PHOTO_W}px; right: 0; top: 0; bottom: 0; padding: 70px 56px 70px 40px; display: flex; flex-direction: column; justify-content: center; }
.top { position: absolute; left: ${PHOTO_W + 40}px; right: 56px; top: 64px; display: flex; justify-content: space-between;
  font-family: M, sans-serif; font-weight: 400; font-size: 18px; letter-spacing: 5px; text-transform: uppercase; color: rgba(242,236,226,.45); }
.num { font-family: CG, serif; font-weight: 500; font-size: 112px; line-height: .8; color: #c9a45c; margin-bottom: 30px; }
.tag { font-family: M, sans-serif; font-weight: 400; font-size: 18px; letter-spacing: 5px; text-transform: uppercase; color: #c9a45c; margin-bottom: 16px; }
h1 { font-family: CG, serif; font-weight: 500; font-size: 68px; line-height: .98; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; white-space: nowrap; }
h1.big { font-size: 100px; }
.acc { color: #c9a45c; }
.rule { position: relative; width: 260px; height: 14px; margin: 30px 0 28px; }
.rule::before { content: ''; position: absolute; left: 0; right: 0; top: 6.5px; height: 1px; background: #c9a45c; }
.rule i { position: absolute; left: 50%; top: 0; width: 14px; height: 14px; margin-left: -7px; background: #c9a45c; transform: rotate(45deg) scale(.7); box-shadow: 0 0 0 6px #0a0a0a; }
p { font-family: M, sans-serif; font-weight: 300; font-size: 25px; line-height: 1.5; color: #f2ece2; }
.who { margin-top: 30px; padding-left: 20px; border-left: 1px solid rgba(201,164,92,.55); }
.who + .who { margin-top: 22px; }
.who b { display: block; font-family: M, sans-serif; font-weight: 400; font-size: 16px; letter-spacing: 5px; text-transform: uppercase; color: #c9a45c; margin-bottom: 6px; }
.who span { font-family: M, sans-serif; font-weight: 300; font-size: 21px; line-height: 1.45; color: rgba(242,236,226,.82); }
.sub { font-family: M, sans-serif; font-weight: 400; font-size: 21px; letter-spacing: 5px; text-transform: uppercase; color: #e9e4dc; line-height: 1.7; }
.hint { position: absolute; left: ${PHOTO_W + 40}px; right: 56px; bottom: 64px; font-family: M, sans-serif; font-weight: 400; font-size: 18px; letter-spacing: 5px; text-transform: uppercase; color: #c9a45c; }
.logo { width: 140px; margin-bottom: 60px; }
/* фінальний слайд без фото */
.bleed { position: absolute; }
.shade-l { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,10,10,.82) 0px, rgba(10,10,10,.6) 380px, rgba(10,10,10,0) 560px); }
.solo { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 140px; }
.solo .rule { margin: 40px auto 36px; width: 320px; }
.solo h1 { font-size: 130px; }
.solo p { font-size: 30px; }
.solo .hint { position: static; margin-top: 70px; }
.solo .logo { margin: 0 0 80px; }
.icons { display: flex; gap: 70px; margin-top: 80px; }
.ic { display: flex; flex-direction: column; align-items: center; gap: 22px; }
.ic svg { width: 64px; height: 64px; fill: none; stroke: #c9a45c; stroke-width: 1.2; stroke-linejoin: round; stroke-linecap: round; }
.ic span { font-family: M, sans-serif; font-weight: 400; font-size: 18px; letter-spacing: 5px; text-transform: uppercase; color: #e9e4dc; }
`;

// фото вставляються як є, прямокутником, без масштабування понад кадр (інакше втрачається різкість).
// Розкладка за кількістю: 1 — на всю висоту, 2 — одне над одним (4:5), 3 — три смуги,
// layout "1+2" — зверху одне 4:5, знизу два вузькі поруч, 4 — сітка 2×2.
// pos — object-position, fit: "none" — фрагмент у натуральному розмірі (крупний план без втрати різкості), label — підпис у кутку фото
const rects = (n, layout, pw) => {
  const half = (H - GAP) / 2;
  if (layout === '1+2') {
    const w = (pw - GAP) / 2;
    return [[0, 0, pw, half], [0, half + GAP, w, half], [w + GAP, half + GAP, w, half]];
  }
  const cols = n === 4 ? 2 : 1;
  const rows = n / cols;
  const w = (pw - GAP * (cols - 1)) / cols;
  const h = (H - GAP * (rows - 1)) / rows;
  return Array.from({ length: n }, (_, i) => [(i % cols) * (w + GAP), Math.floor(i / cols) * (h + GAP), w, h]);
};
const photos = (list, pw = PHOTO_W, fade = false, layout) => rects(list.length, layout, pw).map(([x, y, w, h], i) => {
  const p = list[i];
  const label = p.label ? `<div class="lbl">${p.label}</div>` : '';
  return `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img src="file://${path.join(dir, p.src)}" style="object-position:${p.pos || '50% 50%'};object-fit:${p.fit || 'cover'}">${label}</div>`;
}).join('') + (fade ? `<div class="fade" style="left:${pw - 70}px"></div>` : '');
const rule = '<div class="rule"><i></i></div>';
const logo = `<img class="logo" src="file://${dir}/assets/km-logo.png">`;
const total = data.slides.length;
const pad = (n) => String(n).padStart(2, '0');

const pages = [];
const c = data.cover;
const cw = c.photoW || PHOTO_W;
pages.push(`${photos(c.photos, cw, true)}
<div class="panel" style="left:${cw}px">${logo}<div class="tag">${c.kicker}</div><h1 class="big">${c.title}</h1>${rule}<div class="sub">${c.sub}</div></div>
<div class="hint" style="left:${cw + 40}px">${c.hint}</div>`);
data.slides.forEach((s, i) => {
  const text = `<div class="num">${pad(i + 1)}</div><div class="tag">${s.tag}</div><h1>${s.title}</h1>${rule}<p>${s.text}</p>
<div class="who"><b>Клієнткам</b><span>${s.client}</span></div>
<div class="who"><b>Майстрам</b><span>${s.master}</span></div>`;
  const top = `<span>Види френчу</span><span>${pad(i + 1)} / ${pad(total)}</span>`;
  if (s.bleed) {
    // фото на темному фоні праворуч, нігті заходять під текст ліворуч
    const b = s.bleed;
    pages.push(`<img class="bleed" src="file://${path.join(dir, b.src)}" style="height:${b.height}px;right:${b.right || 0}px;top:${b.top || 0}px">
<div class="shade-l"></div>
<div class="top" style="left:56px;right:${W - PHOTO_W + 40}px">${top}</div>
<div class="panel" style="left:0;right:auto;width:${W - PHOTO_W}px;padding:70px 40px 70px 56px">${text}</div>`);
    return;
  }
  pages.push(`${photos(s.photos, PHOTO_W, false, s.layout)}
<div class="top">${top}</div>
<div class="panel">${text}</div>`);
});
const e = data.end;
pages.push(`<div class="solo">${logo}<h1>${e.title}</h1>${rule}<p>${e.text}</p>${e.hint ? `<div class="hint">${e.hint}</div>` : ''}</div>`);

// останній слайд: «Сподобалось?» з іконками «зберегти», «вподобати», «поділитися»
const icon = {
  save: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  like: '<path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z"/>',
  share: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
};
const o = data.outro;
if (o) {
  const icons = o.icons.map((x) => `<div class="ic"><svg viewBox="0 0 24 24">${icon[x.icon]}</svg><span>${x.label}</span></div>`).join('');
  pages.push(`<div class="solo">${logo}<h1>${o.title}</h1>${rule}<p>${o.text}</p><div class="icons">${icons}</div></div>`);
}

(async () => {
  fs.mkdirSync(path.join(dir, 'out'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const tmp = path.join(dir, 'tmp-slide.html');
  for (const [i, body] of pages.entries()) {
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    // довгі назви зменшуємо, доки не вмістяться в ширину панелі
    await page.evaluate(() => document.querySelectorAll('h1').forEach((h) => {
      const box = h.parentElement;
      const max = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) - parseFloat(getComputedStyle(box).paddingRight);
      let size = parseFloat(getComputedStyle(h).fontSize);
      const r = document.createRange();
      r.selectNodeContents(h);
      while (r.getBoundingClientRect().width > max && size > 40) h.style.fontSize = `${(size -= 2)}px`;
    }));
    const overflow = await page.evaluate(() => {
      const p = document.querySelector('.panel');
      return p ? p.scrollHeight > p.clientHeight : false;
    });
    const out = path.join(dir, 'out', `${pad(i + 1)}.png`);
    await page.screenshot({ path: out });
    console.log(out, overflow ? '— ТЕКСТ НЕ ВМІЩАЄТЬСЯ' : '');
  }
  fs.unlinkSync(tmp);
  await browser.close();
})();
