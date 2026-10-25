<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import gsap from 'gsap'

// force3D would re-add translateZ(0) and promote a layer again, undoing the
// reason there is no `will-change` in the stylesheet.
gsap.defaults({ force3D: false })

/**
 * A walkthrough: screens in a row, revealed one at a time, with the tap that
 * causes each reveal shown on the screen before it.
 *
 * The whole slide is one paused GSAP timeline with a label per step, and the
 * click count drives the playhead. That is what makes it safe to jump
 * backwards, or land mid-deck from the presenter view, and still get exactly
 * the frame that step is supposed to show — which toggling classes per click
 * does not give you.
 */

interface Mark {
  /** centre of the box, in % of the screen */
  x: number
  y: number
  /** its size, in % of the screen */
  w: number
  h: number
  /** two or three words, pinned to the box */
  text?: string
  /** which side of the box the label sits on — outside the phone for left/right */
  at?: 'top' | 'bottom' | 'left' | 'right'
  tone?: 'good' | 'stop'
}

export interface Frame {
  /** path under public/shots */
  src: string
  /** two or three words under the screen — not a sentence */
  cap?: string
  /** the tap that moves on from THIS screen, in % of the screen */
  tap?: { x: number, y: number, hold?: boolean }
  /** what changed here — appears with the screen, under a spotlight */
  ring?: Mark
  /** a walk around this screen — one box per click, no spotlight */
  tour?: Mark[]
}

const props = withDefaults(defineProps<{
  frames: Frame[]
  /** cyan kiosk accent instead of the violet driver one */
  kiosk?: boolean
  /** draw the screens inside the POS terminal the kiosk actually runs on */
  pos?: boolean
}>(), { kiosk: false, pos: false })

const { clicks } = useNav()

const root = ref<HTMLElement | null>(null)
let tl: gsap.core.Timeline | null = null
let ctx: gsap.Context | null = null
let scrub: gsap.core.Tween | null = null

/**
 * The POS frame, measured off the product photo (see tools/make-pos-frame.py).
 * The terminal's display is 16:9-ish while the shots are 19.5:9, so the screen
 * is fitted by height and sits letterboxed inside the display — which keeps
 * every pixel of the shot, and with it every mark coordinate on these slides.
 */
const POS = {
  aspect: 195 / 478,          // the terminal itself
  screen: { left: 0.138462, top: 0.351464, w: 0.8, h: 0.548117 },
}
const SHOT = 1080 / 2340

/** screen box at scale 1, and the gap between screens — the row is built from these */
const GAP = 74
/**
 * Slot height: the phone, or the whole terminal when the printer has to fit too.
 * Keep this close to AVAIL_H — the row is centred on its UNSCALED height, so a
 * slot much taller than the box stops centring and spills off the slide.
 */
const H = props.pos ? 820 : Math.round(364 * 2340 / 1080)
const W = props.pos ? Math.round(H * POS.aspect) : 364

/**
 * Where the shot actually lands inside the slot, as a share of it. The marks
 * are positioned against this rather than the slot, so a ring at 94% still
 * means 94% down the screenshot in both modes.
 */
const art = (() => {
  if (!props.pos) return { left: 0, top: 0, w: 1, h: 1 }
  const sc = POS.screen
  const wShare = (sc.h * SHOT) / POS.aspect      // shot width, as a share of slot width
  return { left: sc.left + (sc.w - wShare) / 2, top: sc.top, w: wShare, h: sc.h }
})()

/** the usable area inside the 1920 × 1080 canvas, once the title has taken its cut */
const AVAIL_W = 1724
const AVAIL_H = 832
const MAX = 1.2

const rowWidth = computed(() => props.frames.length * W + (props.frames.length - 1) * GAP)

/** how big the row can be while k of n screens are showing */
function scaleFor(k: number) {
  return Math.min(MAX, AVAIL_W / (k * W + (k - 1) * GAP), AVAIL_H / H)
}

/** x that keeps the k visible screens centred in a row sized for all of them */
function xFor(k: number, n: number) {
  return ((n - k) * (W + GAP)) / 2
}

/**
 * Steps are derived from the data, not counted by hand: a screen that is
 * tapped costs two clicks (the tap, then the reveal it causes), one that
 * changes on its own — the kiosk following the driver — costs one, and every
 * box in a `tour` costs one more.
 */
const steps = computed(() => {
  const out: Array<{ kind: 'tap' | 'show' | 'tour', i: number, j?: number }> = []
  props.frames.forEach((f, i) => {
    if (i > 0) {
      if (props.frames[i - 1].tap) out.push({ kind: 'tap', i: i - 1 })
      out.push({ kind: 'show', i })
    }
    f.tour?.forEach((_, j) => out.push({ kind: 'tour', i, j }))
  })
  return out
})

/** so a slide can set its `clicks:` from the data rather than by counting */
defineExpose({ steps })

/** the template positions the display panel from this */
const posGeom = POS

/**
 * A mark's box as CSS edges, in % of the screen.
 *
 * These used to be placed centre-first — `left: x%` plus a
 * `transform: translate(-50%, -50%)` in the stylesheet. gsap animates the
 * box's `scale`, so before its first tween it parses whatever transform the
 * element already has; on a slide that mounts while it is still hidden there
 * is no layout to parse against, and the -50% resolves against the viewport
 * instead of the box. That froze a translate of about half the window width
 * into the inline style, which is what slid every callout off its target —
 * hundreds of px left of the screen it belonged to, while the taps (0 × 0, so
 * -50% is 0 either way) stayed exactly where they should be.
 *
 * Edges need no transform at all, which leaves gsap only the scale to own.
 * Equivalent to the old centring because the reset makes these border-box.
 */
function box(m: Mark) {
  return {
    left: `${m.x - m.w / 2}%`,
    top: `${m.y - m.h / 2}%`,
    width: `${m.w}%`,
    height: `${m.h}%`,
  }
}

/** keyed by path — a screen with no file yet falls back to a labelled placeholder */
const missing = ref<Record<string, boolean>>({})

onMounted(() => {
  const el = root.value
  if (!el) return
  const n = props.frames.length

  ctx = gsap.context(() => {
    tl = gsap.timeline({ paused: true })

    const q = gsap.utils.selector(el)
    const screens = q('.wk-slot')
    const taps = q('.wk-tap')
    const rings = q('.wk-ring')
    const links = q('.wk-link')
    const spots = q('.wk-spot')

    /** gsap warns when a target list is empty, which single-screen slides hit a lot */
    const set = (t: Element[] | Element | null, v: gsap.TweenVars) => {
      if (Array.isArray(t) ? t.length : t) gsap.set(t as gsap.TweenTarget, v)
    }

    // opening state: the first screen alone, as large as it is allowed to get
    gsap.set('.wk-row', { x: xFor(1, n), scale: scaleFor(1) })
    set(screens.slice(1), { opacity: 0, scale: 0.86, xPercent: 24 })
    set(taps, { opacity: 0, scale: 0.4 })
    set(rings, { opacity: 0, scale: 1.3 })
    set(spots, { opacity: 1 })
    set(links, { opacity: 0, scaleX: 0, transformOrigin: 'left center' })

    tl.addLabel('s0')

    const ringEl = (i: number, key: string) => el.querySelector(`[data-ring="${i}:${key}"]`)
    const tapEl = (i: number) => el.querySelector(`[data-tap="${i}"]`)

    let k = 1
    steps.value.forEach((step, si) => {
      const at = `s${si + 1}`

      if (step.kind === 'tap') {
        // the finger arrives, settles, and stays until the screen answers
        tl.to(tapEl(step.i), { opacity: 1, scale: 1, duration: 0.34, ease: 'back.out(2.2)' })
      }

      else if (step.kind === 'show') {
        k++
        // the row makes room, and the new screen arrives into it
        tl.to('.wk-row', {
          x: xFor(k, n), scale: scaleFor(k),
          duration: 0.62, ease: 'power3.inOut',
        })
        tl.to(screens[step.i], {
          opacity: 1, scale: 1, xPercent: 0,
          duration: 0.62, ease: 'power3.out',
        }, '<')

        if (links[step.i - 1])
          tl.to(links[step.i - 1], { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, '<0.2')

        // the tap that caused it releases
        const prevTap = tapEl(step.i - 1)
        if (prevTap)
          tl.to(prevTap, { opacity: 0, scale: 0.8, duration: 0.26, ease: 'power2.in' }, '<')

        // the previous screen keeps its outline but gives up the spotlight, so
        // the dimming always marks the newest screen rather than every past one
        const prevSpot = el.querySelector(`[data-spot="${step.i - 1}"]`)
        if (prevSpot)
          tl.to(prevSpot, { opacity: 0, duration: 0.45, ease: 'power2.out' }, '<')

        // and what changed gets called out
        const r = ringEl(step.i, 'main')
        if (r) tl.to(r, { opacity: 1, scale: 1, duration: 0.44, ease: 'back.out(1.7)' }, '<0.3')
      }

      else {
        const r = ringEl(step.i, `t${step.j}`)
        if (r) tl.to(r, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' })
      }

      tl.addLabel(at, '>')
    })
  }, el)

  seekTo(clicks.value)
})

/** clicks drive the playhead; a one-step move is animated, a jump is instant */
function seekTo(c: number, animate = false) {
  if (!tl) return
  const label = `s${Math.max(0, Math.min(c, steps.value.length))}`
  scrub?.kill()
  if (animate) scrub = tl.tweenTo(label, { duration: 0.52, ease: 'power2.inOut' })
  else tl.seek(label)
}

watch(clicks, (c, prev) => seekTo(c, Math.abs(c - prev) === 1))

onBeforeUnmount(() => {
  scrub?.kill()
  ctx?.revert()
  tl = null
})
</script>

<template>
  <div
    ref="root"
    class="wk"
    :class="{ 'wk-kiosk': kiosk, 'wk-pos': pos }"
    :style="{ '--mark': art.h }"
  >
    <div class="wk-row" :style="{ width: `${rowWidth}px` }">
      <div v-for="(f, i) in frames" :key="`${f.src}-${i}`" class="wk-slot" :style="{ width: `${W}px` }">
        <!-- connector across the gap to the next screen -->
        <div class="wk-stack" :style="{ height: `${H}px` }">
          <!-- the connector lives in the stack, not the slot: the slot also
               contains the caption, and on the terminal the screen sits low in
               the body — anchoring to the slot put the arrow above the screen -->
          <span
            v-if="i < frames.length - 1"
            class="wk-link"
            :style="{ width: `${GAP}px`, left: '100%', top: `${(art.top + art.h / 2) * 100}%` }"
          ><i /></span>

          <!-- the display itself: the shot is 19.5:9 in a 16:9 panel, so the
               unused edges have to read as switched-off screen, not as slide -->
          <i
            v-if="pos"
            class="wk-panel"
            :style="{
              left: `${posGeom.screen.left * 100}%`, top: `${posGeom.screen.top * 100}%`,
              width: `${posGeom.screen.w * 100}%`, height: `${posGeom.screen.h * 100}%`,
            }"
          />

          <!-- the terminal, drawn over the screen so its bezel hides the seam -->
          <img v-if="pos" class="wk-device" src="/shots/pos-frame.png" alt="">

          <div
            class="wk-art"
            :style="pos ? {
              left: `${art.left * 100}%`, top: `${art.top * 100}%`,
              width: `${art.w * 100}%`, height: `${art.h * 100}%`,
            } : undefined"
          >
          <div class="wk-screen">
            <img
              v-if="!missing[f.src]"
              class="wk-img"
              :src="`/shots/${f.src}`"
              :alt="f.cap || f.src"
              @error="missing[f.src] = true"
            >
            <div v-else class="wk-ph"><span>{{ f.src }}</span></div>

            <i
              v-if="f.ring"
              class="wk-spot"
              :data-spot="i"
              :style="box(f.ring)"
            />
          </div>

          <!-- what changed, under a spotlight -->
          <span
            v-if="f.ring"
            class="wk-ring"
            :class="[f.ring.tone ? `wk-ring-${f.ring.tone}` : '', `wk-at-${f.ring.at || 'bottom'}`]"
            :data-ring="`${i}:main`"
            :style="box(f.ring)"
          ><b v-if="f.ring.text">{{ f.ring.text }}</b></span>

          <!-- a walk around the screen, one box per click -->
          <span
            v-for="(m, j) in f.tour"
            :key="`t${j}`"
            class="wk-ring"
            :class="[m.tone ? `wk-ring-${m.tone}` : '', `wk-at-${m.at || 'bottom'}`]"
            :data-ring="`${i}:t${j}`"
            :style="box(m)"
          ><b v-if="m.text">{{ m.text }}</b></span>

          <span
            v-if="f.tap"
            class="wk-tap"
            :class="{ 'wk-tap-hold': f.tap.hold }"
            :data-tap="i"
            :style="{ left: `${f.tap.x}%`, top: `${f.tap.y}%` }"
          >
            <i class="wk-tap-wave" />
            <i class="wk-tap-wave wk-tap-wave-2" />
            <i v-if="f.tap.hold" class="wk-tap-fill" />
            <i class="wk-tap-dot" />
          </span>
          </div>
        </div>

        <span v-if="f.cap" class="wk-cap">{{ f.cap }}</span>
      </div>
    </div>
  </div>
</template>
