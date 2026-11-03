// Renders one print PDF (front + back, 210x99 mm) per procedure, plus PNG previews.
// Usage: node render.js
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const SERVICES = ["manicure", "manicure-gel", "manicure-design", "pedicure-toes", "pedicure-full", "pedicure-full-gel"];

(async () => {
  const dir = __dirname;
  fs.mkdirSync(path.join(dir, "print"), { recursive: true });
  fs.mkdirSync(path.join(dir, "preview"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 900, height: 900 } });

  for (const s of SERVICES) {
    await page.goto("file://" + path.join(dir, "certificate.html") + "?service=" + s);
    await page.evaluate(() => document.fonts.ready);
    const cards = await page.$$(".card");
    if (s === SERVICES[0]) await cards[0].screenshot({ path: path.join(dir, "preview", "front.png") });
    await cards[1].screenshot({ path: path.join(dir, "preview", `back-${s}.png`) });
    await page.pdf({
      path: path.join(dir, "print", `certificate-${s}.pdf`),
      width: "210mm",
      height: "99mm",
      printBackground: true,
    });
  }
  await browser.close();
})();
