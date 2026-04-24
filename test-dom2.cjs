const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://cesarkali.github.io/portifolio/', { waitUntil: 'networkidle0' });
    
    const heroTitleVisibility = await page.evaluate(() => {
        const h1s = document.querySelectorAll('h1');
        const heroH1 = h1s[1]; // The second h1
        if (!heroH1) return 'heroH1 not found';
        const rect = heroH1.getBoundingClientRect();
        const style = window.getComputedStyle(heroH1);
        const parent = heroH1.parentElement;
        const parentStyle = window.getComputedStyle(parent);
        return {
            text: heroH1.textContent.trim(),
            rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
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
