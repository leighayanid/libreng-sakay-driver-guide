---
layout: center
class: section section-kiosk
routeAlias: kiosk
---

<div class="split">
<div>

<div class="modnum">Module 02</div>

# Bus Kiosk

<p class="lede" style="max-width:37.22rem">Ang device na binibilang ang bawat sumasakay.</p>

</div>

<Fan kiosk pos :h="588" :shots="[
  'kiosk/02-enroll-code.png',
  'kiosk/05-tap-board.png',
  'kiosk/07-tap-denied.png',
]" />

</div>

<!--
Ikalawang module. Ito ang device sa bus na bumibilang ng bawat sumasakay.
-->

---
class: kiosk-page
clicks: 3
---

<div class="eyebrow">Kiosk · Setup</div>

## Enroll the kiosk to the bus

<Walk kiosk pos :frames="[
  { src: 'kiosk/01-enroll.png', cap: 'Blangko — patay ang button' },
  { src: 'kiosk/02-enroll-code.png', cap: 'Code mula sa admin',
    ring: { x: 50, y: 60.5, w: 93.2, h: 11.2 }, tap: { x: 50.1, y: 73.1 } },
  { src: 'kiosk/04-waiting.png', cap: 'Naka-bind na sa bus',
    ring: { x: 50, y: 51.1, w: 78.1, h: 15, tone: 'good' } },
]" />

<div class="hint warn">Isang beses lang magagamit ang code. Tinanggihan? Humingi ng bago.</div>

<!--
Isang beses lang magagamit ang code, at galing ito sa admin.
Tinanggihan? Huwag ulit-ulitin — humingi na ng bago.
-->

---
class: tint kiosk-page
clicks: 1
---

<div class="eyebrow">Kiosk · Before the trip</div>

## Two waiting screens

<Walk kiosk pos :frames="[
  { src: 'kiosk/03-no-shift.png', cap: 'Walang shift ang bus ngayon' },
  { src: 'kiosk/04-waiting.png', cap: 'May shift — hinihintay ang driver' },
]" />

<div class="hint">Walang pipindutin dito. Hintayin lang ang driver.</div>

<!--
Walang pipindutin dito, kaya huwag silang mag-alala.
Kung "no shift" ang nakalagay, problema iyon sa schedule, hindi sa kiosk.
-->

---
class: kiosk-page
clicks: 2
---

<div class="eyebrow">Kiosk · Boarding</div>

## Tap your pass to board

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', cap: 'Idikit sa likod ng telepono', tap: { x: 50, y: 36.8 } },
  { src: 'kiosk/06-tap-ok.png', cap: 'Welcome aboard',
    ring: { x: 50, y: 71.2, w: 87.4, h: 19.7, tone: 'good', text: 'Pangalan · uri · oras' } },
]" />

<div class="hint">Awtomatikong babalik sa tap screen. Walang pipindutin.</div>

<!--
Idikit sa likod ng telepono. Awtomatikong babalik sa tap screen —
walang kailangang pindutin ang pasahero o ang driver.
-->

---
class: tint kiosk-page
clicks: 2
---

<div class="eyebrow">Kiosk · Not allowed</div>

## Ride denied

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', cap: 'Parehong tap', tap: { x: 50, y: 36.8 } },
  { src: 'kiosk/07-tap-denied.png', cap: 'Walang naitala',
    ring: { x: 50, y: 60, w: 91.2, h: 15.2, tone: 'stop', text: 'Dahilan' } },
]" />

<div class="hint">Basahin ang dahilan sa screen bago sagutin ang pasahero.</div>

<!--
Basahin muna ang dahilan sa screen bago sagutin ang pasahero.
Iba-iba ang dahilan: expired, hindi pa verified, hindi tugma ang uri.
-->

---
class: kiosk-page
clicks: 1
---

<div class="eyebrow">Kiosk · Two more results</div>

## Already boarded, and tapped out

<Walk kiosk pos :frames="[
  { src: 'kiosk/10-already-boarded.png', cap: 'Na-tap ulit agad — hindi binibilang' },
  { src: 'kiosk/11-tapped-out.png', cap: 'Tap out — bumaba ang bilang' },
]" />

<!--
Dalawang resultang madalas makita.
Na-tap ulit agad — hindi doble ang bilang, protektado iyon.
Tap out — bumababa ang bilang, at makikita kung gaano siya katagal sakay.
-->

---
class: tint kiosk-page
---

<div class="eyebrow">Kiosk · Too early</div>

## Trip not started

<Walk kiosk pos :frames="[
  { src: 'kiosk/08-trip-not-started.png', cap: 'Hindi pa nagsisimula ang driver' },
]" />

<div class="hint">Walang na-verify, walang naitala. Paghintayin lang.</div>

<!--
Hindi pa nagsisimula ang driver. Walang na-verify, walang naitala.
Paghintayin lang ang pasahero — hindi ito sira.
-->

---
class: kiosk-page
clicks: 3
---

<div class="eyebrow">Kiosk · The bottom strip</div>

## Count, sound, and bus

<Walk kiosk pos :frames="[
  { src: 'kiosk/05-tap-board.png', tour: [
    { x: 42.6, y: 85.5, w: 21.2, h: 6.2, text: 'Onboard ngayon', at: 'left' },
    { x: 59.4, y: 85.4, w: 15.2, h: 6.1, text: 'Tunog', at: 'right' },
    { x: 50, y: 93.7, w: 95.3, h: 9.2, text: 'Bus · ruta', at: 'bottom' },
  ] },
]" />

<!--
Tatlong bagay sa ilalim: bilang ng nakasakay ngayon, tunog on o off,
at kung anong bus at ruta. Ito ang titingnan kung tama ba ang device sa tamang bus.
-->

---
class: tint kiosk-page
---

<div class="eyebrow">Kiosk · Connection</div>

## Losing signal

<Walk kiosk pos :frames="[
  { src: 'kiosk/13-connected.png', cap: 'Connected — nag-sync na' },
]" />

<div class="hint warn">Huwag patayin ang kiosk sa dead zone — doon nakaimbak ang mga tap.</div>

<!--
Mahalaga ito. Kapag walang signal, iniimbak muna ng kiosk ang mga tap,
tapos sabay-sabay ipapadala paglabas sa dead zone.
Kaya huwag patayin ang kiosk sa dead zone — nandoon pa ang mga hindi pa naipapadalang tap.
-->
