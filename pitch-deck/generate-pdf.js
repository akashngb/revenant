const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, "deck.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for fonts to load
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((r) => setTimeout(r, 2000));

  // Get slide count
  const slideCount = await page.evaluate(() => document.querySelectorAll(".slide").length);
  console.log(`Found ${slideCount} slides`);

  // Print to PDF — 1280x720 slides (16:9)
  const pdfPath = path.resolve(__dirname, "Omniate-Pitch-Deck.pdf");
  await page.pdf({
    path: pdfPath,
    width: "1280px",
    height: "720px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false,
  });

  console.log(`PDF saved to: ${pdfPath}`);
  await browser.close();
})();

