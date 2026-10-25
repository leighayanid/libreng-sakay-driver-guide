import { chromium } from 'playwright-chromium'
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage()
await p.goto('http://localhost:3030/4?clicks=2', { waitUntil: 'networkidle' })
await p.waitForTimeout(3500)
await p.screenshot({ path: '.chk/slide4.png' })
await b.close(); console.log('ok')
