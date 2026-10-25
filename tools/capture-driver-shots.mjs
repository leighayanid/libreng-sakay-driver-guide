import { chromium } from 'playwright-chromium'

/**
 * Re-shoots the driver screens straight out of the running app.
 *
 * The cockpit is a web app, so the whole shotlist is reproducible: seed the
 * state with seed-deck.php, drive the page here, and the deck's screenshots
 * can be regenerated whenever the UI changes instead of re-staged on a bus.
 *
 *   php artisan serve --env=e2e --port=8010      (in the librengsakay repo)
 *   php artisan reverb:start --env=e2e           (else a reconnect banner shows)
 *   node tools/capture-driver-shots.mjs <out-dir>
 */

const BASE = 'http://127.0.0.1:8010'
const DRIVER = 'juan.delacruz@driver.librengsakay.test'
const OUT = process.argv[2] || 'public/shots/driver'

// Abucay Municipal Hall — the trip's first stop. Without a position the
// cockpit sits on "Requesting…" and queues every tap into the offline sync.
const AT = { latitude: 14.7222765, longitude: 120.5354553 }

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 360, height: 780 },
  deviceScaleFactor: 3,            // 360 × 780 @3 = the 1080 × 2340 the deck uses
  colorScheme: 'dark',
  isMobile: true,
  hasTouch: true,
  locale: 'en-PH',
  timezoneId: 'Asia/Manila',
  geolocation: AT,
  permissions: ['geolocation'],
})
const page = await ctx.newPage()

const go = async (path) => {
  await page.goto(
    `${BASE}/__e2e/login?email=${encodeURIComponent(DRIVER)}&redirect=${encodeURIComponent(path)}`,
    { waitUntil: 'networkidle' },
  )
  await page.waitForTimeout(3000)   // map tiles + the GPS fix
}
const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}` })
  console.log('  ✓', name)
}

// ── 14 · the emergency controls, as the driver finds them ────────────────────
await go('/driver/trip')
const sos = page.getByRole('button', { name: /Emergency SOS/i }).first()
await sos.scrollIntoViewIfNeeded()
// Nudge the sheet so "Report an issue" clears the bottom edge.
await page.mouse.wheel(0, 120)
await page.waitForTimeout(900)
await shot('14-sos.png')

// ── 15 · the report form and its categories ──────────────────────────────────
await page.getByRole('button', { name: /Report an issue/i }).first().click()
await page.waitForTimeout(1400)
await shot('15-report-issue.png')
await page.keyboard.press('Escape')
await page.waitForTimeout(800)

// ── 13 · the undo window on the stop just marked ─────────────────────────────
// Undo refuses the trip's opening stop outright ("the starting stop cannot be
// undone") — it needs a second stop update behind it. So depart, then arrive,
// and the arrival is what the driver gets to take back.
await page.getByRole('button', { name: /Depart/i }).first().click()
await page.waitForSelector('[data-sonner-toast]', { timeout: 10_000 })
await page.waitForTimeout(2500)

await page.getByRole('button', { name: /Arrived next/i }).first().click()
// vue-sonner carries the Undo action; waiting on the toast beats guessing a
// delay, since the window closes on its own.
await page.waitForSelector('[data-sonner-toast]', { timeout: 10_000 })
await page.waitForTimeout(600)
await shot('13-undo.png')
const toast = await page.locator('[data-sonner-toast]').first().innerText().catch(() => '')
console.log('  toast:', JSON.stringify(toast.replace(/\s+/g, ' ')))

// ── 18 · what the undo gives back ──────────────────────────────────────
// The slide pairs the toast with the result, so the second frame has to be the
// same build of the cockpit — the old on-the-road shot predates this redesign.
await page.getByRole('button', { name: /^Undo$/i }).first().click()
await page.waitForTimeout(2500)
await shot('18-undo-done.png')

// ── 16 · a thread, the reply box in use, the mute control ────────────────────
await go('/driver/messages')
await page.getByText(/Trapiko sa Capitol/i).first().click()
await page.waitForTimeout(1600)
const box = page.locator('textarea, input[type=text]').last()
await box.click()
await box.fill('Malapit na kami sa Capitol, mga 5 minuto.')
await page.waitForTimeout(800)
await shot('16-messages-reply.png')

await browser.close()
console.log('done')
