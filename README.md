# Libreng Sakay — Driver & Kiosk

A presentational walkthrough of the Libreng Sakay driver app and bus kiosk.
The screens are the guide: each slide shows the tap, then the screen that
answers it, side by side.

```bash
npm install
npm run dev     # http://localhost:3030
npm run build   # static site into dist/
npm run export  # PDF (waits 4s a slide — without it the pages export blank)
npm run check   # every slide's `clicks:` against what its frames actually need
```

## How a slide is built

One component, `Walk`, takes the screens as data and animates the rest. There
are no step lists and no instruction columns — a slide is a title and a row of
screens.

```html
<Walk :frames="[
  { src: 'driver/05-on-the-road.png', cap: 'Depart <stop>', tap: { x: 50, y: 94 } },
  { src: 'driver/06-departure-recorded.png', cap: 'Departure recorded',
    ring: { x: 50, y: 16.4, w: 94, h: 8, tone: 'good' }, tap: { x: 50, y: 92.8 } },
  { src: 'driver/07-arrival-recorded.png', cap: 'Arrival recorded',
    ring: { x: 25.5, y: 71.75, w: 36, h: 4.5, tone: 'good', text: '13 min ahead' } },
]" />
```

### Frame fields

| | |
|---|---|
| `src`  | path under `public/shots` |
| `cap`  | two or three words under the screen — not a sentence |
| `tap`  | `{ x, y, hold? }` — the tap that moves on from **this** screen. `hold` draws a filling ring for the press-and-hold buttons |
| `ring` | `{ x, y, w, h, text?, tone?, at? }` — what changed; appears with the screen under a spotlight |
| `tour` | an array of the same marks, revealed one per click, for walking around a single screen |

`kiosk` on `<Walk>` switches the accent from violet to cyan.

`Fan` is the other component — a tilted stack of three screens for the cover and
the module dividers. It plays on slide arrival rather than on click, so it costs
the presenter nothing.

All coordinates are **percentages of the screenshot**, not pixels, so they hold
at any deck scale. `at` places a mark's label (`top`/`bottom` sit over the
screen, `left`/`right` hang outside the phone on a leader line) — set it
whenever two marks would otherwise stack their labels.

### Clicks

`Walk` derives its own steps from the data: a screen with a `tap` costs two
clicks (the tap, then the reveal), one that changes on its own costs one, and
each `tour` mark costs one more. **Set the slide's `clicks:` frontmatter to that
total** — Slidev needs it to know how far the slide goes.

### How the animation works

The whole slide is a single paused [GSAP](https://gsap.com) timeline with a
label per step, and the click count drives the playhead. That is what makes it
safe to jump backwards, or land mid-deck from the presenter view, and still get
exactly the frame that step is supposed to show.

## Type and ground

Two things in `style.css` and the headmatter are load-bearing:

- **`fonts.weights` includes 700 and 800.** Slidev imports `200,400,600` by
  default, so anything asking for 700 was getting the browser's synthetic bold.
  With the real weights loaded, in-between values round differently — which is
  why `h2` and `.mod h3` say `600` outright rather than `650`. Change one of
  those to `650` and every title quietly gets heavier.
- **The background is a gradient, not a flat fill**, with a 5px rule along the
  top in the module's colour (`--slide-accent`, violet for driver, cyan for
  kiosk via the `kiosk-page` class). Kiosk content slides carry that class in
  their frontmatter; the dividers get it from `.section-kiosk`.

The slide label (`.eyebrow`, and `.modnum` on the dividers) is 1.75rem/800,
deliberately heavier than the title it sits above. It is also why the slide's
top padding and `.wk` height are a little tighter than the screens alone would
need — a taller label pushes the captions down into the hint line, and
`.wk`/`AVAIL_H` are the counterweight. If you resize the label, re-check that.

## The POS terminal

The kiosk does not run on a phone — it runs on a handheld Android POS terminal
with a thermal printer and the NFC pad on the orange housing. Every kiosk
screen in the deck is drawn inside it.

`public/shots/pos-frame.png` is that terminal on transparency with its display
cut out, generated from the product photo by `tools/make-pos-frame.py`. Pass
`pos` to `Walk`, and `pos` (or a list of shot indexes) to `Fan`:

```html
<Walk kiosk pos :frames="[ ... ]" />
<Fan kiosk pos :h="588" :shots="[ ... ]" />
<Fan :h="647" :pos="[2]" :shots="[ ... ]" />   <!-- only the third is a kiosk -->
```

Two things to know before changing it:

- **The display is 16:9, the screenshots are 19.5:9.** The shot is fitted by
  height and letterboxed against a black panel, because the alternative — fitting
  by width — crops 22% of the screenshot, and that includes the bus/route strip
  the "Count, sound, and bus" slide puts a callout on.
- **Marks still work unchanged.** `ring`/`tap`/`tour` percentages are measured
  against `.wk-art`, which tracks the screenshot's own box rather than the slot,
  so a mark at 94% means 94% down the screenshot in both modes.

The frame geometry (where the display sits inside the terminal) is duplicated as
a `POS` constant in `Walk.vue` and `Fan.vue`, and printed by
`tools/make-pos-frame.py` whenever it regenerates the asset.

## Canvas size

`canvasWidth: 1920` in the headmatter, and every length in `style.css` plus the
row geometry in `Walk.vue` is sized to that canvas. It is not cosmetic.

Slidev scales the whole slide with a CSS transform. At the old `canvasWidth:
980` the deck was laid out at 980px and stretched ~2x on a 1080p screen, and
Chrome rasterises an image at its *layout* size — so every screenshot was a
~360px texture blown up to fill ~720px. Measured against a clean downscale of
the same PNG, the screens were carrying 35% of the detail they should. Authoring
at 1920 puts the scale at ~1 and takes that to 60%, which is the difference you
can see.

So: if you change `canvasWidth`, scale the lengths with it, or the screenshots
go soft again. There is also no `will-change` in `style.css` on purpose, and
`gsap.defaults({ force3D: false })` in both components — both would promote a
layer and pin its raster back to the pre-transform size.

## Tooling

`tools/` holds the bits that keep the deck honest:

| | |
|---|---|
| `check-clicks.mjs` | re-derives each slide's click count from its frame data and compares it to the `clicks:` frontmatter — a wrong one stalls or overshoots mid-presentation |
| `seed-deck.php` | puts the librengsakay e2e database into the deck's demo data |
| `capture-driver-shots.mjs` | drives the running cockpit and writes the driver PNGs |
| `make-pos-frame.py` | turns the POS product photo into the cut-out device frame |
| `snap-marks.py` | re-derives ring/tour/tap coordinates from the screenshots (**run once** — see its header) |
| `check-alignment.mjs` | every mark, at every click, against the screen it points at (`npm run check:align`, needs the dev server up) |

The driver app is a web app, so its screenshots are reproducible rather than
staged — see [SHOTLIST.md](./SHOTLIST.md).

## Screenshots

`public/shots/driver/` and `public/shots/kiosk/`. A path with no file behind it
renders as a dashed placeholder showing the filename, so slides can be written
before the shots exist. See [SHOTLIST.md](./SHOTLIST.md) for what is missing.

Coordinates were read off the real 1080 × 2340 shots. If you re-take one and the
layout moves, the marks on that slide need re-checking.

## Language

Taglish, matching `libreng-sakay-guide`: Tagalog for the explanation, English
kept verbatim for anything actually printed on a button.
