---
theme: default
title: Libreng Sakay — Driver & Kiosk
info: |
  ## Libreng Sakay — Driver & Kiosk
  How the driver app and the bus kiosk work. One operation per slide.

  Prepared by Leigh Dinaya — Computer Programmer, Provincial Government of Bataan.
author: Leigh Dinaya
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1920
transition: slide-left
fonts:
  sans: Plus Jakarta Sans
  mono: JetBrains Mono
  # Slidev loads 200,400,600 by default — without 700/800 the headings and the
  # eyebrow labels were being faked by the browser's synthetic bold.
  weights: '200,400,600,700,800'
drawings:
  persist: false
class: cover
---

<div class="split">
<div>

<div class="eyebrow">Bataan Province · Libreng Sakay</div>

# Driver App<br>and Bus Kiosk

<p class="lede" style="max-width:41.14rem;margin-top:1.57rem">
What happens when you press it. One operation per slide.
</p>

</div>

<Fan :h="647" :pos="[2]" :shots="[
  'driver/03-next-shift.png',
  'driver/05-on-the-road.png',
  'kiosk/06-tap-ok.png',
]" />

</div>

<!--
Good morning. There are only two devices we are talking about today:
the app on the driver's phone, and the kiosk mounted in the bus.
-->

---
class: tint
routeAlias: contents
---

<div class="eyebrow">Two modules</div>

## What's in this guide

<div class="mods">
  <div class="mod mod-driver">
    <span class="tag">Module 01</span>
    <h3>Driver App</h3>
    <p>Sign in, start the trip, mark the stops, end the shift.</p>
    <Fan :h="470" :shots="[
      'driver/03-next-shift.png',
      'driver/05-on-the-road.png',
      'driver/08-trip-completed.png',
    ]" />
  </div>
  <div class="mod mod-kiosk">
    <span class="tag">Module 02</span>
    <h3>Bus Kiosk</h3>
    <p>Enroll it to the bus, accept the taps, count who boards.</p>
    <Fan kiosk pos :h="470" :shots="[
      'kiosk/04-waiting.png',
      'kiosk/05-tap-board.png',
      'kiosk/06-tap-ok.png',
    ]" />
  </div>
</div>

<div class="hint">The two are linked — the trip will not start without an online kiosk.</div>

<!--
The two are linked. The trip will not start without an online kiosk —
that is the most common problem, so we will come back to it.
-->

---
src: ./pages/01-driver.md
---

---
src: ./pages/02-kiosk.md
---
