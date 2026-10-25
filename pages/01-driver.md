---
layout: center
class: section section-driver
routeAlias: driver
---

<div class="split">
<div>

<div class="modnum">Module 01</div>

# Driver App

<p class="lede" style="max-width:37.22rem">Sign in, start the trip, mark the stops, end the shift.</p>

</div>

<Fan :h="588" :shots="[
  'driver/01-login.png',
  'driver/05-on-the-road.png',
  'driver/08-trip-completed.png',
]" />

</div>

<!--
Two modules. We start with the driver app — this is the one they hold every day.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · Sign in</div>

## Sign in with Bataeño Pass

<Walk :frames="[
  { src: 'driver/01-login.png', cap: 'Open the app', tap: { x: 50, y: 71.5 } },
  { src: 'driver/02-standby.png', cap: 'Standby — no shift yet',
    ring: { x: 50, y: 93.4, w: 99.2, h: 9.6, text: 'Five tabs' } },
]" />

<!--
There is only one login: Bataeño Pass. No separate password for the driver app.
Cannot get in? Check first whether they are assigned to a bus — the password is rarely the problem.
Five tabs along the bottom. We will come back to all of them.
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
    ring: { x: 35.4, y: 68.6, w: 62.4, h: 13.5, tone: 'good', text: 'Trip is running' } },
]" />

<div class="hint">Hold, not tap — so it cannot start while in a pocket.</div>

<!--
Hold, not tap — watch the ring fill. That is how long it takes.
It was made awkward on purpose: the trip must not start while the phone is in a pocket.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · When it will not start</div>

## An online kiosk is required

<Walk :frames="[
  { src: 'driver/03-next-shift.png', cap: 'Holding the button', tap: { x: 50.8, y: 83.6, hold: true } },
  { src: 'driver/04-no-kiosk.png', cap: 'Keep holding to start…',
    ring: { x: 50, y: 17, w: 91.7, h: 7.8, tone: 'stop', text: 'No kiosk' } },
]" />

<div class="hint warn">No kiosk, no passenger count for the whole trip.</div>

<!--
This is the most common call to support.
No online kiosk, nothing to start. The kiosk has to be switched on and enrolled beforehand.
Ask them: who switches the kiosk on in the morning?
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
    { x: 48.3, y: 67.4, w: 26.9, h: 3.2, text: 'From the kiosk', at: 'right' },
    { x: 46, y: 82.1, w: 91.2, h: 11.4, text: 'Current · next stop', at: 'left' },
    { x: 50, y: 93.1, w: 91.7, h: 7.4, tone: 'good', text: 'What to do next', at: 'right' },
  ] },
]" />

<!--
Only four things on the screen: on-time status, the count from the kiosk, current and next stop,
and what to do next. Do not look for anything else — there is nothing else.
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

<div class="hint">The passenger tracker runs on these times. Tap them right away.</div>

<!--
This is the most important slide. These exact times are what passengers see in the tracker.
Tap on arrival and on departure right away — not later, not all at once at the end of the run.
-->

---
class: tint
clicks: 2
---

<div class="eyebrow">Driver · Ending the trip</div>

## Hold to end trip

<Walk :frames="[
  { src: 'driver/07-arrival-recorded.png', cap: 'Last stop', tap: { x: 50, y: 93.6, hold: true } },
  { src: 'driver/08-trip-completed.png', cap: 'Trip completed',
    ring: { x: 28.4, y: 34.9, w: 48.4, h: 12.9, tone: 'good', text: 'Minutes · stops · passengers' } },
]" />

<div class="hint warn">Always end it. Otherwise the bus is still on the road in the system.</div>

<!--
Always end the trip. Otherwise the bus is still on the road in the system,
and the ETA waiting passengers see is wrong.
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

<div class="hint">Ending a leg is not ending the shift.</div>

<!--
Make this clear: ending a leg is not ending the shift. They are two different buttons.
Another run to make? Hold to start next leg. Going home? End shift.
-->

---
class: tint
clicks: 2
---

<div class="eyebrow">Driver · Wrong tap</div>

## Undo — take back a wrong mark

<Walk :frames="[
  { src: 'driver/13-undo.png', cap: 'Undo in the toast', tap: { x: 84.4, y: 94.3 } },
  { src: 'driver/18-undo-done.png', cap: 'Mark taken back',
    ring: { x: 50, y: 94.6, w: 90.6, h: 6.5, tone: 'good', text: 'Undone' } },
]" />

<div class="hint warn">Only the last mark can be taken back, and never the starting stop — there, just end the trip.</div>

<!--
It is only a toast — a window of about fifteen seconds, then it is gone.
Missed it? Message dispatch instead.
And the starting stop cannot be taken back — if the trip started wrong, just end it.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · Emergency</div>

## SOS and Report issue

<Walk :frames="[
  { src: 'driver/14-sos.png', tour: [
    { x: 50, y: 91.9, w: 90, h: 4.8, tone: 'stop', text: 'SOS — alerts at once', at: 'left' },
    { x: 50, y: 97.2, w: 35.3, h: 3.5, text: 'Report issue', at: 'right' },
  ] },
]" />

<div class="hint warn">Accident or emergency? Still make the call. Do not rely on the app alone.</div>

<!--
SOS is for danger. Report issue is for traffic, a broken road, or the engine.
But in a real accident — still make the call. Do not rely on the app alone.
-->

---
class: tint
clicks: 1
---

<div class="eyebrow">Driver · Messages</div>

## Replies are in

<Walk :frames="[
  { src: 'driver/09-messages.png', cap: 'From dispatch' },
  { src: 'driver/16-messages-reply.png', cap: 'Reply and mute',
    ring: { x: 43.9, y: 87.6, w: 80.6, h: 4.9, tone: 'good', text: 'Reply here' } },
]" />

<div class="hint warn">Do not read while driving. It will still be there when you stop.</div>

<!--
This is new: they can reply now, not just read. There are quick replies to keep it fast.
There is a mute as well if it gets too noisy.
Say it again: do not read while driving. It will still be there when you stop.
-->

---
clicks: 2
---

<div class="eyebrow">Driver · The other tabs</div>

## Schedule and History

<Walk :frames="[
  { src: 'driver/10-schedule.png', cap: 'Schedule — All · AM · PM', tap: { x: 70.4, y: 92 } },
  { src: 'driver/11-history.png', cap: 'History — duration and passengers' },
]" />

<!--
Schedule — the shifts coming up. History — the finished ones, with duration and passenger count.
This is where they can check their own record.
-->

---
class: tint
---

<div class="eyebrow">Driver · Settings</div>

## Settings

<Walk :frames="[
  { src: 'driver/12-settings.png', cap: 'Profile · app version · sign out' },
]" />

<div class="hint warn">Do not sign out mid-shift — it does not end the trip.</div>

<!--
Profile, app version, sign out.
Stress this: do not sign out in the middle of a shift. It does not end the trip — it just leaves it open in the system.
-->
