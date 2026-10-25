/**
 * Every mark, at every click, against the screen it belongs to.
 *
 * The marks are percentages of the screenshot, so a change to the slot
 * geometry (a taller label, the POS frame, a new AVAIL_H) can silently slide
 * the connector or the tap pulse off its target without anything overflowing
 * or erroring. This catches that.
 *
 *   npm run dev          # in one terminal
 *   node tools/check-alignment.mjs
 */
import { chromium } from 'playwright-chromium'
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage()
const maxClicks = { 4:2,5:2,6:2,7:4,8:4,9:2,10:2,11:2,12:2,13:1,14:2,17:3,18:1,19:2,20:2,21:1,23:3 }
let bad = 0, checked = 0
for (let n = 3; n <= 25; n++) {
  const top = maxClicks[n] ?? 0
  for (let c = 0; c <= top; c++) {
    await p.goto(`http://localhost:3030/${n}?clicks=${c}`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1500)
    const issues = await p.evaluate(() => {
      const wk = [...document.querySelectorAll('.wk')].find(e => e.getBoundingClientRect().height > 10)
      if (!wk) return []
      const out = []
      const shown = (e) => parseFloat(getComputedStyle(e).opacity) > 0.3 && e.getBoundingClientRect().width > 1
      for (const slot of wk.querySelectorAll('.wk-slot')) {
        if (parseFloat(getComputedStyle(slot).opacity) < 0.3) continue
        const art = slot.querySelector('.wk-art'); if (!art) continue
        const a = art.getBoundingClientRect()
        const link = slot.querySelector('.wk-link')
        if (link && shown(link)) {
          const l = link.getBoundingClientRect()
          const off = (l.top + l.height / 2) - (a.top + a.height / 2)
          if (Math.abs(off) > 2) out.push(`link ${off.toFixed(0)}px off screen centre`)
        }
        for (const t of slot.querySelectorAll('.wk-tap')) {
          if (!shown(t)) continue
          const r = t.getBoundingClientRect()
          const wx = a.left + a.width * parseFloat(t.style.left) / 100
          const wy = a.top + a.height * parseFloat(t.style.top) / 100
          const dx = (r.left + r.width/2) - wx, dy = (r.top + r.height/2) - wy
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) out.push(`tap off by ${dx.toFixed(0)},${dy.toFixed(0)}`)
        }
        for (const g of slot.querySelectorAll('.wk-ring')) {
          if (!shown(g)) continue
          const r = g.getBoundingClientRect()
          // a ring's left/top are its own edges, not its centre — see box() in
          // Walk.vue. The tap above is still centred: it is a 0 × 0 point.
          const wx = a.left + a.width * parseFloat(g.style.left) / 100
          const wy = a.top + a.height * parseFloat(g.style.top) / 100
          const dx = r.left - wx, dy = r.top - wy
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) out.push(`ring "${(g.textContent||'').trim().slice(0,16)}" off by ${dx.toFixed(0)},${dy.toFixed(0)}`)
        }
      }
      return out
    })
    checked++
    if (issues.length) { bad++; console.log(`slide ${n} @${c}:`); [...new Set(issues)].forEach(i => console.log('   ', i)) }
  }
}
console.log(`\nchecked ${checked} click states — ${bad ? bad + ' misaligned' : 'all marks aligned'}`)
await b.close()
