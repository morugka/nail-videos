// Renders flyer.html to a print-ready PDF and a PNG preview: node render.js
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(__dirname, "flyer.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(__dirname, "flyer-A4.pdf"), width: "297mm", height: "210mm", printBackground: true });
  await page.screenshot({ path: path.join(__dirname, "flyer-preview.png") });
  await browser.close();
})();
