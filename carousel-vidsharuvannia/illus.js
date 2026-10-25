// Лінійні ілюстрації життєвих ситуацій (золото на чорному). Усі в полотні 480×440.

// Палець: капсула від основи (0,0) вгору на довжину len, ніготь на кінчику.
// opts.nail: 'ok' | 'lift' | 'chip' | 'crack'
function finger(x, y, len, w, rot = 0, opts = {}) {
  const r = w / 2;
  const top = -len + r;
  const nw = w * 0.7;
  const nh = Math.min(len * 0.42, w * 1.25);
  const nt = -len + w * 0.08;
  const nb = nt + nh;
  const nail = `M${-nw / 2},${nb} L${-nw / 2},${nt + nw / 2} Q${-nw / 2},${nt} 0,${nt} Q${nw / 2},${nt} ${nw / 2},${nt + nw / 2} L${nw / 2},${nb} Q0,${nb + nw * 0.22} ${-nw / 2},${nb} Z`;
  let extra = '';
  if (opts.nail === 'lift')
    extra = `<path d="M${-nw / 2 - 4},${nb - 6} Q0,${nb + nw * 0.22 + 14} ${nw / 2 + 4},${nb - 6}" class="il-accent"/><circle cx="${nw / 2 + 16}" cy="${nb + 4}" r="3" class="il-dot"/>`;
  if (opts.nail === 'chip')
    extra = `<path d="M${-nw / 4},${nt + 3} l6,10 l7,-7 l6,9" class="il-accent"/>`;
  if (opts.nail === 'crack')
    extra = `<path d="M${-nw * 0.05},${nt + nh * 0.25} l${nw * 0.12},${nh * 0.2} l${-nw * 0.14},${nh * 0.16} l${nw * 0.1},${nh * 0.2}" class="il-accent"/>`;
  return `<g transform="translate(${x},${y}) rotate(${rot})">
    <path d="M${-r},0 L${-r},${top} A${r},${r} 0 0 1 ${r},${top} L${r},0" class="il-skin"/>
    <path d="${nail}" class="il-nail"/>
    <path d="M${-r * 0.45},${-len * 0.32} q${r * 0.45},${r * 0.18} ${r * 0.9},0" class="il-thin"/>
    ${extra}
  </g>`;
}

const sparkle = (x, y, s = 1) =>
  `<path d="M${x},${y - 14 * s} Q${x + 2 * s},${y - 2 * s} ${x + 14 * s},${y} Q${x + 2 * s},${y + 2 * s} ${x},${y + 14 * s} Q${x - 2 * s},${y + 2 * s} ${x - 14 * s},${y} Q${x - 2 * s},${y - 2 * s} ${x},${y - 14 * s} Z" class="il-spark"/>`;
const drop = (x, y, s = 1) =>
  `<path d="M${x},${y} q${-10 * s},${15 * s} 0,${22 * s} q${10 * s},${-7 * s} 0,${-22 * s} Z" class="il-drop"/>`;
const bubble = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="il-bubble"/>`;

// Рука тильною стороною, пальці вгору.
function hand(x, y, s = 1, special = {}) {
  const f = (dx, dy, len, w, rot, key) =>
    finger(dx, dy, len, w, rot, { nail: special[key] || 'ok' });
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${f(-84, 130, 140, 50, -38, 'thumb')}
    <path d="M-92,30 Q-104,140 -70,230 L70,230 Q104,140 96,30 Z" class="il-skin"/>
    ${f(-66, 40, 150, 40, -8, 'little')}
    ${f(-24, 34, 205, 44, -3, 'ring')}
    ${f(22, 34, 220, 45, 2, 'middle')}
    ${f(66, 42, 190, 43, 7, 'index')}
    <path d="M-60,200 q60,18 120,0" class="il-thin"/>
  </g>`;
}

const scenes = {
  // Обкладинка: рука, на одному нігті — відшарування під лупою.
  cover: () => `
    ${hand(220, 210, 0.92, { middle: 'lift' })}
    <circle cx="246" cy="98" r="78" class="il-lens"/>
    <path d="M300,152 L360,214" class="il-handle"/>
    ${sparkle(360, 70, 1.1)}${sparkle(110, 120, 0.7)}`,

  // Кутикула: кінчик пальця крупно і пушер майстра.
  cuticle: () => `
    ${finger(220, 470, 400, 200, 0, { nail: 'lift' })}
    <g transform="translate(400,40) rotate(38)">
      <rect x="-9" y="0" width="18" height="300" rx="9" class="il-tool"/>
      <path d="M-9,300 Q0,338 9,300" class="il-tool"/>
      <path d="M-6,60 h12 M-6,74 h12 M-6,88 h12" class="il-thin"/>
    </g>
    ${bubble(290, 228, 5)}${bubble(302, 212, 3)}`,

  // Торець: вода з крана потрапляє під скол на краю.
  tip: () => `
    <path d="M40,40 H200 Q236,40 236,76 V96" class="il-tool"/>
    <rect x="216" y="96" width="40" height="22" rx="4" class="il-tool"/>
    <path d="M226,124 Q222,180 230,236 M246,124 Q250,180 242,236" class="il-water"/>
    ${finger(240, 470, 300, 170, 0, { nail: 'chip' })}
    ${drop(180, 240)}${drop(310, 262, 0.8)}${drop(150, 310, 0.7)}${drop(330, 330, 0.6)}`,

  // Боки: тонкий ніготь гнеться, коли друкуєш на клавіатурі.
  sides: () => `
    <path d="M20,330 L460,330 L470,420 L10,420 Z" class="il-tool"/>
    ${[40, 120, 200, 280, 360].map((kx) => `<rect x="${kx}" y="346" width="66" height="54" rx="8" class="il-key"/>`).join('')}
    ${finger(250, 60, 280, 120, 172, { nail: 'crack' })}
    <path d="M178,318 q-18,-20 -10,-46 M322,318 q18,-20 10,-46" class="il-accent"/>
    ${sparkle(410, 90, 0.8)}`,

  // Вода й хімія: миття посуду під краном без рукавичок.
  water: () => `
    <path d="M60,30 H250 Q290,30 290,70 V86" class="il-tool"/>
    <rect x="268" y="86" width="44" height="22" rx="4" class="il-tool"/>
    <path d="M282,112 Q278,160 286,206 M300,112 Q304,160 296,206" class="il-water"/>
    <ellipse cx="270" cy="300" rx="190" ry="60" class="il-plate"/>
    <ellipse cx="270" cy="300" rx="110" ry="32" class="il-thin"/>
    <path d="M-20,262 Q50,256 82,284 L92,404 Q40,432 -20,424 Z" class="il-skin"/>
    ${finger(60, 300, 150, 44, 78)}
    ${finger(70, 340, 150, 44, 84)}
    ${finger(80, 380, 140, 42, 90)}
    <rect x="330" y="214" width="96" height="58" rx="14" class="il-sponge"/>
    ${bubble(360, 196, 12)}${bubble(392, 182, 8)}${bubble(420, 200, 14)}${bubble(246, 236, 7)}${bubble(214, 252, 10)}
    ${drop(330, 120, 0.7)}${drop(244, 150, 0.6)}`,

  // Нігті як інструмент: підчепити ключ-кільце банки.
  crack: () => `
    <path d="M70,150 V430 M330,150 V430" class="il-tool"/>
    <ellipse cx="200" cy="150" rx="130" ry="36" class="il-tool"/>
    <ellipse cx="200" cy="150" rx="112" ry="28" class="il-thin"/>
    <path d="M160,148 Q200,120 240,140 Q250,152 236,160 Q200,170 166,160 Z" class="il-tool"/>
    <circle cx="186" cy="150" r="8" class="il-thin"/>
    ${finger(470, 120, 250, 58, -78, { nail: 'chip' })}
    ${sparkle(224, 104, 1)}
    <path d="M120,250 h160 M120,290 h160" class="il-thin"/>`,

  // Організм: блістер таблеток, склянка води, місяць — безсонні ночі й стрес.
  whole: () => `
    <g transform="translate(60,140) rotate(-8)">
      <rect width="230" height="150" rx="16" class="il-tool"/>
      ${[0, 1, 2].map((c) => [0, 1].map((r) => `<ellipse cx="${46 + c * 70}" cy="${44 + r * 62}" rx="24" ry="17" class="il-pill"/>`).join('')).join('')}
    </g>
    <path d="M330,180 L346,410 H426 L442,180 Z" class="il-tool"/>
    <path d="M336,250 L436,250" class="il-water"/>
    ${drop(386, 300, 0.7)}
    <path d="M160,40 a46,46 0 1 0 46,64 a36,36 0 1 1 -46,-64 Z" class="il-spark"/>
    ${sparkle(260, 60, 0.6)}${sparkle(90, 90, 0.5)}`,

  // Метод: пилка майстра запечатує торець.
  method: () => `
    ${finger(190, 460, 330, 160, 0)}
    <g transform="translate(70,90) rotate(-20)">
      <rect width="360" height="34" rx="17" class="il-tool"/>
      <path d="M30,17 H330" class="il-thin"/>
    </g>
    ${sparkle(350, 190, 1)}${sparkle(80, 260, 0.6)}`,
};

module.exports = (name) =>
  `<svg viewBox="0 0 480 440" class="illus" xmlns="http://www.w3.org/2000/svg">${scenes[name]()}</svg>`;
module.exports.icons = {
  master: `<svg viewBox="0 0 48 48" class="ico"><rect x="6" y="20" width="36" height="8" rx="4" transform="rotate(-35 24 24)" class="il-tool"/></svg>`,
  you: `<svg viewBox="0 0 48 48" class="ico">${drop(24, 8, 1.4)}</svg>`,
  body: `<svg viewBox="0 0 48 48" class="ico"><rect x="6" y="16" width="36" height="16" rx="8" class="il-tool"/><path d="M24,16 V32" class="il-thin"/></svg>`,
};
