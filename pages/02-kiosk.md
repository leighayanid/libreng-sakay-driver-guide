---
layout: center
class: section section-kiosk
routeAlias: kiosk
---

<div class="split">
<div>

<div class="modnum">Module 02</div>

# Bus Kiosk

<p class="lede" style="max-width:37.22rem">The device that counts everyone who boards.</p>

</div>

<Fan kiosk pos :h="588" :shots="[
  'kiosk/02-enroll-code.png',
  'kiosk/05-tap-board.png',
  'kiosk/07-tap-denied.png',
]" />

</div>

<!--
Second module. This is the device in the bus that counts everyone who boards.
-->

---
class: kiosk-page
clicks: 3
---

<div class="eyebrow">Kiosk · Setup</div>

## Enroll the kiosk to the bus

<Walk kiosk pos :frames="[
  { src: 'kiosk/01-enroll.png', cap: 'Blank — button is dead' },
  { src: 'kiosk/02-enroll-code.png', cap: 'Code from the admin',
    ring: { x: 50, y: 60.5, w: 93.2, h: 11.2 }, tap: { x: 50.1, y: 73.1 } },
  { src: 'kiosk/04-waiting.png', cap: 'Bound to the bus',
    ring: { x: 50, y: 51.1, w: 78.1, h: 15, tone: 'good' } },
]" />

<div class="hint warn">A code works once only. Rejected? Ask for a new one.</div>

<!--
A code works once only, and it comes from the admin.
Rejected? Do not keep retrying it — ask for a new one.
-->

---
class: tint kiosk-page
clicks: 1
---

<div class="eyebrow">Kiosk · Before the trip</div>

## Two waiting screens

<Walk kiosk pos :frames="[
  { src: 'kiosk/03-no-shift.png', cap: 'No shift for this bus today' },
  { src: 'kiosk/04-waiting.png', cap: 'Shift set — waiting for the driver' },
]" />

<div class="hint">Nothing to press here. Just wait for the driver.</div>

<!--
Nothing to press here, so there is nothing for them to worry about.
If it says no shift, that is a schedule problem, not a kiosk problem.
-->

---
class: kiosk-page
clicks: 2
---

<div class="eyebrow">Kiosk · Boarding</div>

## Tap your pass to board

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', cap: 'Hold the phone to the pad', tap: { x: 50, y: 36.8 } },
  { src: 'kiosk/06-tap-ok.png', cap: 'Welcome aboard',
    ring: { x: 50, y: 71.2, w: 87.4, h: 19.7, tone: 'good', text: 'Name · type · time' } },
]" />

<div class="hint">It returns to the tap screen on its own. Nothing to press.</div>

<!--
Hold the back of the phone to the pad. It returns to the tap screen on its own —
neither the passenger nor the driver has to press anything.
-->

---
class: tint kiosk-page
clicks: 2
---

<div class="eyebrow">Kiosk · Not allowed</div>

## Ride denied

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', cap: 'Same tap', tap: { x: 50, y: 36.8 } },
  { src: 'kiosk/07-tap-denied.png', cap: 'Nothing recorded',
    ring: { x: 50, y: 60, w: 91.2, h: 15.2, tone: 'stop', text: 'The reason' } },
]" />

<div class="hint">Read the reason on the screen before answering the passenger.</div>

<!--
Read the reason on the screen first before answering the passenger.
The reasons differ: expired, not yet verified, wrong pass type.
-->

---
class: kiosk-page
clicks: 1
---

<div class="eyebrow">Kiosk · Two more results</div>

## Already boarded, and tapped out

<Walk kiosk pos :frames="[
  { src: 'kiosk/10-already-boarded.png', cap: 'Tapped again — not counted' },
  { src: 'kiosk/11-tapped-out.png', cap: 'Tap out — count goes down' },
]" />

<!--
Two results you will see often.
Tapped again right away — the count does not double, that is protected.
Tap out — the count goes down, and you can see how long they were aboard.
-->

---
class: tint kiosk-page
---

<div class="eyebrow">Kiosk · Too early</div>

## Trip not started

<Walk kiosk pos :frames="[
  { src: 'kiosk/08-trip-not-started.png', cap: 'Driver has not started yet' },
]" />

<div class="hint">Nothing verified, nothing recorded. Just have them wait.</div>

<!--
The driver has not started the trip yet. Nothing verified, nothing recorded.
Just have the passenger wait — it is not broken.
-->

---
class: kiosk-page
clicks: 3
---

<div class="eyebrow">Kiosk · The bottom strip</div>

## Count, sound, and bus

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', tour: [
    { x: 42.6, y: 85.5, w: 21.2, h: 6.2, text: 'Onboard now', at: 'left' },
    { x: 59.4, y: 85.4, w: 15.2, h: 6.1, text: 'Sound', at: 'right' },
    { x: 50, y: 93.7, w: 95.3, h: 9.2, text: 'Bus · route', at: 'bottom' },
  ] },
]" />

<!--
Three things along the bottom: how many are aboard now, sound on or off,
and which bus and route. This is what you check to confirm the device is on the right bus.
-->

---
class: tint kiosk-page
---

<div class="eyebrow">Kiosk · Connection</div>

## Losing signal

<Walk kiosk pos :frames="[
  { src: 'kiosk/13-connected.png', cap: 'Connected — synced' },
]" />

<div class="hint warn">Do not switch the kiosk off in a dead zone — the taps are held inside it.</div>

<!--
This one matters. With no signal the kiosk holds the taps itself,
then sends them all at once on the way out of the dead zone.
So do not switch the kiosk off in a dead zone — the taps it has not sent yet are still in there.
-->
