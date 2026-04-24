const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://cesarkali.github.io/portifolio/', { waitUntil: 'networkidle0' });
    
    const heroTitleVisibility = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return 'h1 not found';
        const rect = h1.getBoundingClientRect();
        const style = window.getComputedStyle(h1);
        const parent = h1.parentElement;
        const parentStyle = window.getComputedStyle(parent);
        return {
            text: h1.textContent.trim(),
            rect,
            opacity: style.opacity,
            color: style.color,
            fontSize: style.fontSize,
            parentOpacity: parentStyle.opacity,
            parentTransform: parentStyle.transform
        };
    });
    console.log('Hero Title Status:', heroTitleVisibility);
    
    await browser.close();
})();
