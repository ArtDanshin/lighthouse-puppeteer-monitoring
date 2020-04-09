const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
    width: 1280,
    height: 1024,
    deviceScaleFactor: 1,
  });
  await page.goto('https://lenta.ru');
  await page.screenshot({path: 'lenta.jpg'});

  await browser.close();
})();