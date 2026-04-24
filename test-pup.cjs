const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('response', response => {
        if (!response.ok()) console.log('FAILED URL:', response.url(), response.status());
    });
    await page.goto('https://cesarkali.github.io/portifolio/', { waitUntil: 'networkidle0' });
    await browser.close();
})();
