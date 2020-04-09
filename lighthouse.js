// const lighthouse = require('lighthouse');
// const config = {
//   extends: 'lighthouse:default',
//   settings: {
//     onlyAudits: [
//       'first-meaningful-paint',
//       'speed-index',
//       'first-cpu-idle',
//       'interactive',
//     ],
//   }
// };

const path = require('path');
const fs = require('fs');
const util = require('util');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');

const lighthouseConfig = {
  extends: 'lighthouse:default',
  output: 'json',
  logLevel: 'info',
};

async function runTest() {
  const url = 'https://lenta.ru/';

// Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
  const browser = await puppeteer.launch({
    defaultViewport: null,
  });

// Lighthouse will open URL. Puppeteer observes `targetchanged` and sets up network conditions.
// Possible race condition.
  const { lhr } = await lighthouse(url, {
    ...lighthouseConfig,
    port: (new URL(browser.wsEndpoint())).port,
  });

  await writeResult(lhr);

  await browser.close();
}

async function writeResult(lhrResult) {
  const formatedData = {
    'performance': [{
      date: lhrResult.fetchTime,
      score: lhrResult.categories['performance'].score
    }],
    'accessibility': [{
      date: lhrResult.fetchTime,
      score: lhrResult.categories['accessibility'].score
    }],
    'best-practices': [{
      date: lhrResult.fetchTime,
      score: lhrResult.categories['best-practices'].score
    }],
    'seo': [{
      date: lhrResult.fetchTime,
      score: lhrResult.categories['seo'].score
    }],
    'pwa': [{
      date: lhrResult.fetchTime,
      score: lhrResult.categories['pwa'].score
    }]
  };
  const reader = util.promisify(fs.readFile);
  const writter = util.promisify(fs.writeFile);

  console.log('writing');

  let resultsDb = await reader(path.join('.', 'results.json'), 'utf8');
  resultsDb = (resultsDb) ? JSON.parse(resultsDb) : {};

  Object.keys(formatedData).forEach(key => {
    if (resultsDb[key]) {
      formatedData[key] = formatedData[key].concat(resultsDb[key]);
    }
  });

  await writter(path.join('.', 'results.json'), JSON.stringify(formatedData));
}

setInterval(runTest, 30000);