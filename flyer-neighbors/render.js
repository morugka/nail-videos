// Renders a flyer page to a print-ready PDF and a PNG preview.
//   node render.js              -> flyer.html       -> flyer-A4.pdf / flyer-preview.png
//   node render.js flyer-light  -> flyer-light.html -> flyer-light-A4.pdf / flyer-light-preview.png
const { chromium } = require("playwright");
const path = require("path");
const name = process.argv[2] || "flyer";
const out = name === "flyer" ? "flyer" : name;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(__dirname, name + ".html"));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(__dirname, out + "-A4.pdf"), width: "210mm", height: "297mm", printBackground: true });
  await page.screenshot({ path: path.join(__dirname, out + "-preview.png") });
  await browser.close();
})();
