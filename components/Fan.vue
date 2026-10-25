<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { onSlideEnter } from '@slidev/client'
import gsap from 'gsap'

// force3D would re-add translateZ(0) and promote a layer again, undoing the
// reason there is no `will-change` in the stylesheet.
gsap.defaults({ force3D: false })

/**
 * A fanned stack of screens, for the covers and dividers — a deck about screens
 * should show them before it starts explaining them.
 *
 * Plays on arrival rather than on click, so it costs the presenter nothing.
 */
const props = withDefaults(defineProps<{
  /** three paths under public/shots, middle one sits in front */
  shots: string[]
  /** cyan kiosk accent instead of the violet driver one */
  kiosk?: boolean
  /** screen height in px — large on a divider, small inside a card */
  h?: number
  /**
   * Draw screens inside the POS terminal, to match the kiosk walkthrough.
   * `true` for every shot, or the indexes of the ones that are kiosk screens —
   * the cover fans both apps and only one of them runs on the terminal.
   */
  pos?: boolean | number[]
}>(), { kiosk: false, h: 300, pos: false })

const isPos = (i: number) => Array.isArray(props.pos) ? props.pos.includes(i) : !!props.pos

/** same frame geometry the walkthrough uses — see tools/make-pos-frame.py */
const POS = {
  aspect: 195 / 478,
  screen: { left: 0.138462, top: 0.351464, w: 0.8, h: 0.548117 },
}
const SHOT = 1080 / 2340

/** the shot, letterboxed into the terminal's display, as a share of the card */
const art = (() => {
  const sc = POS.screen
  const wShare = (sc.h * SHOT) / POS.aspect
  return { left: sc.left + (sc.w - wShare) / 2, top: sc.top, w: wShare, h: sc.h }
})()
const pct = (n: number) => `${n * 100}%`

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let tl: gsap.core.Timeline | null = null

const missing = ref<Record<string, boolean>>({})

/** middle screen upright and forward, the outer two tilted away behind it */
const tilt = (i: number, n: number) => {
  const mid = (n - 1) / 2
  return (i - mid) * 9
}

function build() {
  const el = root.value
  if (!el) return
  ctx?.revert()
  ctx = gsap.context(() => {
    const cards = gsap.utils.selector(el)('.fan-i')
    if (!cards.length) return
    tl = gsap.timeline()
    tl.from(cards, {
      y: 46,
      opacity: 0,
      rotate: 0,
      scale: 0.94,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.09,
    })
  }, el)
}

onMounted(build)
onSlideEnter(build)
onBeforeUnmount(() => {
  tl?.kill()
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="fan" :class="{ 'fan-kiosk': kiosk }" :style="{ height: `${h}px` }">
    <span
      v-for="(s, i) in shots"
      :key="s"
      class="fan-i"
      :class="{ 'is-pos': isPos(i) }"
      :style="{
        '--rot': `${tilt(i, shots.length)}deg`,
        height: `${h}px`,
        zIndex: shots.length - Math.abs(i - (shots.length - 1) / 2),
        marginLeft: i ? `-${Math.round(h * (isPos(i) ? 0.06 : 0.1))}px` : '0',
      }"
    >
      <template v-if="isPos(i)">
        <i class="fan-panel" :style="{ left: pct(POS.screen.left), top: pct(POS.screen.top), width: pct(POS.screen.w), height: pct(POS.screen.h) }" />
        <img
          v-if="!missing[s]"
          class="fan-art"
          :style="{ left: pct(art.left), top: pct(art.top), width: pct(art.w), height: pct(art.h) }"
          :src="`/shots/${s}`"
          :alt="s"
          @error="missing[s] = true"
        >
        <span v-else class="fan-ph">{{ s }}</span>
        <img class="fan-device" src="/shots/pos-frame.png" alt="">
      </template>
      <template v-else>
        <img
          v-if="!missing[s]"
          :src="`/shots/${s}`"
          :alt="s"
          @error="missing[s] = true"
        >
        <span v-else class="fan-ph">{{ s }}</span>
      </template>
    </span>
  </div>
</template>
