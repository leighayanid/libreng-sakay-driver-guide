---
layout: center
class: section section-driver
routeAlias: driver
---

<div class="split">
<div>

<div class="modnum">Module 01</div>

# Driver App

<p class="lede" style="max-width:37.22rem">Sign in, simulan ang trip, markahan ang hintuan, tapusin ang shift.</p>

</div>

<Fan :h="588" :shots="[
  'driver/01-login.png',
  'driver/05-on-the-road.png',
  'driver/08-trip-completed.png',
]" />

</div>

<!--
Dalawang module tayo. Simulan sa driver app — ito ang hawak nila araw-araw.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · Sign in</div>

## Sign in with Bataeño Pass

<Walk :frames="[
  { src: 'driver/01-login.png', cap: 'Buksan ang app', tap: { x: 50, y: 71.5 } },
  { src: 'driver/02-standby.png', cap: 'Standby — walang shift pa',
    ring: { x: 50, y: 93.4, w: 99.2, h: 9.6, text: 'Limang tab' } },
]" />

<!--
Iisa lang ang login: Bataeño Pass. Walang hiwalay na password para sa driver app.
Hindi makapasok? Tingnan muna kung naka-assign siya sa isang bus — hindi password ang madalas na problema.
Limang tab sa ilalim. Babalikan natin lahat.
-->

---
class: tint
clicks: 2
---

<div class="eyebrow">Driver · Starting the trip</div>

## Hold to start trip

<Walk :frames="[
  { src: 'driver/03-next-shift.png', cap: 'Next shift', tap: { x: 50.8, y: 83.6, hold: true } },
  { src: 'driver/05-on-the-road.png', cap: 'On the road',
    ring: { x: 35.4, y: 68.6, w: 62.4, h: 13.5, tone: 'good', text: 'Tumatakbo na' } },
]" />

<div class="hint">Hold, hindi tap — para hindi magsimula habang nasa bulsa.</div>

<!--
Hold, hindi tap — pansinin ang umiikot na singsing. Ganoon kahaba.
Sadya itong ginawang mahirap: hindi dapat magsimula ang trip habang nasa bulsa ang telepono.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · When it will not start</div>

## An online kiosk is required

<Walk :frames="[
  { src: 'driver/03-next-shift.png', cap: 'Hawak ang button', tap: { x: 50.8, y: 83.6, hold: true } },
  { src: 'driver/04-no-kiosk.png', cap: 'Keep holding to start…',
    ring: { x: 50, y: 17, w: 91.7, h: 7.8, tone: 'stop', text: 'Walang kiosk' } },
]" />

<div class="hint warn">Walang kiosk, walang mabibilang na pasahero sa buong trip.</div>

<!--
Ito ang pinakamadalas na tawag sa support.
Walang online na kiosk, walang masisimulan. Dapat naka-bukas at naka-enroll na ang kiosk bago pa man.
Itanong sa kanila: sino ang nagbubukas ng kiosk sa umaga?
-->

---
class: tint
clicks: 4
---

<div class="eyebrow">Driver · On the road</div>

## The cockpit on the road

<Walk :frames="[
  { src: 'driver/05-on-the-road.png', tour: [
    { x: 21.1, y: 67.4, w: 23.4, h: 3.2, text: 'On time', at: 'left' },
    { x: 48.3, y: 67.4, w: 26.9, h: 3.2, text: 'Mula sa kiosk', at: 'right' },
    { x: 46, y: 82.1, w: 91.2, h: 11.4, text: 'Current · next stop', at: 'left' },
    { x: 50, y: 93.1, w: 91.7, h: 7.4, tone: 'good', text: 'Susunod na gagawin', at: 'right' },
  ] },
]" />

<!--
Apat na bagay lang ang nasa screen: on-time status, bilang galing sa kiosk, current at next stop,
at ang susunod na gagawin. Huwag nang hanapin ang iba — wala na.
-->

---
clicks: 4
---

<div class="eyebrow">Driver · Stops</div>

## Depart, then Arrive

<Walk :frames="[
  { src: 'driver/05-on-the-road.png', cap: 'Depart <stop>', tap: { x: 50, y: 93.6 } },
  { src: 'driver/06-departure-recorded.png', cap: 'Departure recorded',
    ring: { x: 50, y: 16.4, w: 91.7, h: 8.8, tone: 'good' }, tap: { x: 50, y: 92.8 } },
  { src: 'driver/07-arrival-recorded.png', cap: 'Arrival recorded',
    ring: { x: 25.3, y: 71.7, w: 31.9, h: 3.2, tone: 'good', text: '13 min ahead' } },
]" />

<div class="hint">Ginagamit ng passenger tracker ang mga oras na ito. I-tap agad.</div>

<!--
Ito ang pinakaimportanteng slide. Ang oras na ito mismo ang nakikita ng pasahero sa tracker.
I-tap agad pagdating at pag-alis — hindi mamaya, hindi sabay-sabay sa dulo ng biyahe.
-->

---
class: tint
clicks: 2
---

<div class="eyebrow">Driver · Ending the trip</div>

## Hold to end trip

<Walk :frames="[
  { src: 'driver/07-arrival-recorded.png', cap: 'Huling hintuan', tap: { x: 50, y: 93.6, hold: true } },
  { src: 'driver/08-trip-completed.png', cap: 'Trip completed',
    ring: { x: 28.4, y: 34.9, w: 48.4, h: 12.9, tone: 'good', text: 'Minuto · hintuan · pasahero' } },
]" />

<div class="hint warn">Laging tapusin. Kung hindi, nasa daan pa rin ang bus sa system.</div>

<!--
Laging tapusin ang trip. Kung hindi, nasa daan pa rin ang bus sa system,
at mali ang ETA na nakikita ng mga naghihintay na pasahero.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · After the trip</div>

## Next leg, or end of shift?

<Walk :frames="[
  { src: 'driver/08-trip-completed.png', tour: [
    { x: 50, y: 83.3, w: 90.6, h: 6.9, tone: 'good', text: 'Hold to start next leg', at: 'right' },
    { x: 50, y: 72.6, w: 90.6, h: 5.7, text: 'End shift', at: 'left' },
  ] },
]" />

<div class="hint">Ang pagtapos ng isang leg ay hindi pagtapos ng shift.</div>

<!--
Linawin ito: ang pagtapos ng isang leg ay hindi pagtapos ng shift. Dalawang magkaibang button.
May susunod pang byahe? Hold to start next leg. Uwian na? End shift.
-->

---
class: tint
clicks: 2
---

<div class="eyebrow">Driver · Wrong tap</div>

## Undo — take back a wrong mark

<Walk :frames="[
  { src: 'driver/13-undo.png', cap: 'Undo sa toast', tap: { x: 84.4, y: 94.3 } },
  { src: 'driver/18-undo-done.png', cap: 'Nabawi ang marka',
    ring: { x: 50, y: 94.6, w: 90.6, h: 6.5, tone: 'good', text: 'Undone' } },
]" />

<div class="hint warn">Ang huli lang ang mababawi, at hindi kasama ang panimulang hintuan — doon, tapusin na lang ang trip.</div>

<!--
Toast lang ito — may window, mga labinlimang segundo, tapos mawawala.
Lumipas na? Mag-message na lang sa dispatch.
At hindi mababawi ang panimulang hintuan — kung mali ang pagsisimula, tapusin na lang ang trip.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · Emergency</div>

## SOS and Report issue

<Walk :frames="[
  { src: 'driver/14-sos.png', tour: [
    { x: 50, y: 91.9, w: 90, h: 4.8, tone: 'stop', text: 'SOS — agad na alerto', at: 'left' },
    { x: 50, y: 97.2, w: 35.3, h: 3.5, text: 'Report issue', at: 'right' },
  ] },
]" />

<div class="hint warn">Aksidente o emergency? Tumawag pa rin. Huwag umasa sa app lang.</div>

<!--
SOS para sa panganib. Report issue para sa trapiko, sirang kalsada, o makina.
Pero sa totoong aksidente — tumawag pa rin. Huwag umasa sa app lang.
-->

---
class: tint
clicks: 1
---

<div class="eyebrow">Driver · Messages</div>

## Replies are in

<Walk :frames="[
  { src: 'driver/09-messages.png', cap: 'Mula sa dispatch' },
  { src: 'driver/16-messages-reply.png', cap: 'Sagot at mute',
    ring: { x: 43.9, y: 87.6, w: 80.6, h: 4.9, tone: 'good', text: 'Sagot dito' } },
]" />

<div class="hint warn">Huwag magbasa habang nagmamaneho. Nandiyan pa rin ito pagtigil niyo.</div>

<!--
Bago ito: pwede na silang sumagot, hindi na basa lang. May quick replies para mabilis.
May mute din kung masyadong maingay.
Ulitin: huwag magbasa habang nagmamaneho. Nandiyan pa rin iyan pagtigil.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · The other tabs</div>

## Schedule and History

<Walk :frames="[
  { src: 'driver/10-schedule.png', cap: 'Schedule — All · AM · PM', tap: { x: 70.4, y: 92 } },
  { src: 'driver/11-history.png', cap: 'History — tagal at pasahero' },
]" />

<!--
Schedule — ang mga paparating na shift. History — ang mga tapos na, kasama ang tagal at bilang ng pasahero.
Dito nila matitingnan ang sarili nilang record.
-->

---
class: tint
---

<div class="eyebrow">Driver · Settings</div>

## Settings

<Walk :frames="[
  { src: 'driver/12-settings.png', cap: 'Profile · app version · sign out' },
]" />

<div class="hint warn">Huwag mag-sign out sa gitna ng shift — hindi nito tinatapos ang trip.</div>

<!--
Profile, app version, sign out.
Diinan: huwag mag-sign out sa gitna ng shift. Hindi nito tinatapos ang trip — iiwan lang itong bukas sa system.
-->
