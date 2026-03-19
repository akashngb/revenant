const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const htmlPath = path.resolve(__dirname, "deck.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 2000));

  const slides = await page.$$(".slide");
  for (let i = 4; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.resolve(__dirname, `slide-${i + 1}.png`) });
  }
  console.log("Done");
  await browser.close();
})();
