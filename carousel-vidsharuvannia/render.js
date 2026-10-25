// Збирає slides.html із slides.js і рендерить кожен слайд у out/NN.png (1080×1350).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { handle, slides } = require('./slides');
const illus = require('./illus');

const W = 1080;
const H = 1350;
const total = String(slides.length).padStart(2, '0');

const ornament = '<div class="orn"><span></span><i>✦</i><span></span></div>';

// Схема нігтя з підсвіченою зоною, де відходить покриття.
const NAIL = 'M52,262 L52,118 Q52,22 100,12 Q148,22 148,118 L148,262 Q100,284 52,262 Z';
const zones = {
  cuticle: '<rect x="40" y="214" width="120" height="80" class="hl"/>',
  tip: '<rect x="40" y="0" width="120" height="64" class="hl"/>',
  sides:
    '<rect x="40" y="60" width="26" height="220" class="hl"/><rect x="134" y="60" width="26" height="220" class="hl"/>' +
    '<path d="M100,110 L92,140 L106,165 L95,195" class="crk"/>',
  water: '<rect x="40" y="0" width="120" height="300" class="hl soft"/>',
  crack: '<path d="M78,22 L90,48 L80,66 L94,92" class="crk"/><rect x="40" y="0" width="120" height="50" class="hl soft"/>',
  whole: '<rect x="40" y="0" width="120" height="300" class="hl"/>',
};
const drops = (zone) =>
  zone === 'water'
    ? [
        [20, 70],
        [190, 120],
        [16, 190],
        [186, 230],
      ]
        .map(([x, y]) => `<path d="M${x},${y} q-9,14 0,20 q9,-6 0,-20 Z" class="drop"/>`)
        .join('')
    : '';
const nailSvg = (zone) => `
<svg viewBox="-10 0 220 340" class="nail">
  <defs>
    <clipPath id="c-${zone}"><path d="${NAIL}"/></clipPath>
    <linearGradient id="g-${zone}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a241d"/><stop offset="1" stop-color="#15120f"/>
    </linearGradient>
  </defs>
  <path d="M30,150 Q30,96 100,92 Q170,96 170,150 L176,340 L24,340 Z" class="finger"/>
  <path d="${NAIL}" fill="url(#g-${zone})"/>
  <g clip-path="url(#c-${zone})">${zones[zone]}</g>
  <path d="${NAIL}" class="edge"/>
  ${drops(zone)}
</svg>`;

const head = (i) => `
<div class="top">
  <div class="logo">K<span>M</span><small>nail artist</small></div>
  <div class="pg">${String(i + 1).padStart(2, '0')} / ${total}</div>
</div>`;

const swipe = '<div class="swipe">гортай <span>⟶</span></div>';

const render = {
  cover: (s) => `
    <div class="glow"></div>
    <div class="cover-text">
      <h1>${s.lines.join('<br>')}</h1>
      ${ornament}
      <p class="sub">${s.sub}</p>
    </div>
    <div class="cover-illus">${illus('cover')}</div>`,
  intro: (s) => `
    <h2>${s.title}</h2>
    ${ornament}
    <p class="body">${s.body}</p>
    <ul class="dots">${s.list.map((l, i) => `<li>${illus.icons[['master', 'you', 'body'][i]]}${l}</li>`).join('')}</ul>
    <p class="hint">Перевірте, що з цього — про вас</p>`,
  reason: (s) => `
    <div class="tag">Причина ${s.n} <i>·</i> ${s.who}</div>
    <h2>${s.title}</h2>
    ${ornament}
    <p class="body">${s.body}</p>
    <div class="bottom">
      ${illus(s.zone)}
      <div class="side">
        ${nailSvg(s.zone)}
        <div class="sign"><b>Як впізнати</b>${s.sign}</div>
      </div>
    </div>`,
  method: (s) => `
    <div class="method-head">
      <div><div class="kicker">${s.kicker}</div><h2 class="big">${s.title}</h2></div>
      ${illus('method')}
    </div>
    ${ornament}
    <p class="body">${s.lead}</p>
    <ol class="steps">${s.list.map((l, i) => `<li><span>0${i + 1}</span>${l}</li>`).join('')}</ol>
    <p class="note">${s.note}</p>`,
  cta: (s) => `
    <h2>${s.title}</h2>
    ${ornament}
    <div class="opts">${s.options.map((o) => `<div>${o}</div>`).join('')}</div>
    <p class="body center">${s.body}</p>
    <div class="foot">${s.foot.map((f) => `<span>${f}</span>`).join('<i>✦</i>')}</div>`,
};

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const html = `<!doctype html><html lang="uk"><head><meta charset="utf-8"><style>${css}</style></head><body>
${slides
  .map(
    (s, i) => `<section class="slide ${s.type}" id="s${i}">
  ${head(i)}
  <div class="content">${render[s.type](s)}</div>
  ${i < slides.length - 1 ? swipe : ''}
  <div class="handle">@${handle}</div>
</section>`,
  )
  .join('\n')}
</body></html>`;

const htmlPath = path.join(__dirname, 'slides.html');
fs.writeFileSync(htmlPath, html);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  for (let i = 0; i < slides.length; i++) {
    const file = path.join(__dirname, 'out', `${String(i + 1).padStart(2, '0')}.png`);
    await page.locator(`#s${i}`).screenshot({ path: file });
    console.log(file);
  }
  await browser.close();
})();
