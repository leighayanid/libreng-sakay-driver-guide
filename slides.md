---
theme: default
title: Libreng Sakay — Driver & Kiosk
info: |
  ## Libreng Sakay — Driver & Kiosk
  Paano gumagana ang driver app at ang bus kiosk. Isang operation kada slide.

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
Ano ang mangyayari kapag pinindot. Isang operation kada slide.
</p>

</div>

<Fan :h="647" :pos="[2]" :shots="[
  'driver/03-next-shift.png',
  'driver/05-on-the-road.png',
  'kiosk/06-tap-ok.png',
]" />

</div>

<!--
Magandang umaga. Dalawang device lang ang pag-uusapan natin ngayon:
ang app sa telepono ng driver, at ang kiosk na nakakabit sa bus.
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
    <p>Sign in, simulan ang trip, markahan ang mga hintuan, tapusin ang shift.</p>
    <Fan :h="470" :shots="[
      'driver/03-next-shift.png',
      'driver/05-on-the-road.png',
      'driver/08-trip-completed.png',
    ]" />
  </div>
  <div class="mod mod-kiosk">
    <span class="tag">Module 02</span>
    <h3>Bus Kiosk</h3>
    <p>I-enroll sa bus, tanggapin ang mga tap, bilangin ang sumasakay.</p>
    <Fan kiosk pos :h="470" :shots="[
      'kiosk/04-waiting.png',
      'kiosk/05-tap-board.png',
      'kiosk/06-tap-ok.png',
    ]" />
  </div>
</div>

<div class="hint">Magkadugtong ang dalawa — hindi magsisimula ang trip kung walang online na kiosk.</div>

<!--
Magkadugtong ang dalawa. Hindi magsisimula ang trip kung walang online na kiosk —
iyan ang pinakamadalas na problema, kaya diinan natin mamaya.
-->

---
src: ./pages/01-driver.md
---

---
src: ./pages/02-kiosk.md
---

---
clicks: 4
---

<div class="eyebrow">How they connect</div>

## One trip, two devices

<Flow />

<div class="hint">Ang driver ang nagbubukas at nagsasara. Ang kiosk ang sumusunod.</div>

<!--
Buod ng lahat. Ang driver ang nagbubukas at nagsasara ng trip. Ang kiosk ang sumusunod.
Apat na hakbang lang, paulit-ulit sa buong shift.
-->
