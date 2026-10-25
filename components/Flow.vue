<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

/**
 * The one slide that couples the two apps: what the driver does on the left,
 * what the kiosk does about it on the right. Lights up a stage per click, so
 * the pairing is watched rather than asserted.
 */
const { clicks } = useNav()

const stages = [
  { driver: 'Hold to start trip', kiosk: 'Trip started · lumipat sa tap screen' },
  { driver: 'On the road', kiosk: 'Tap your pass to board' },
  { driver: 'Depart · Arrive', kiosk: 'Bawat tap, dagdag sa bilang' },
  { driver: 'Hold to end trip', kiosk: 'Trip ended · nag-unbind' },
]

const on = computed(() => (i: number) => clicks.value >= i + 1)
</script>

<template>
  <div class="flow">
    <div class="flow-lane">
      <span class="flow-tag flow-tag-driver">Driver app</span>
      <span class="flow-tag flow-tag-kiosk">Bus kiosk</span>
    </div>

    <div
      v-for="(s, i) in stages"
      :key="s.driver"
      class="flow-col"
      :class="{ 'is-on': on(i) }"
    >
      <div class="flow-cell flow-cell-driver">{{ s.driver }}</div>
      <div class="flow-arrow"><span /></div>
      <div class="flow-cell flow-cell-kiosk">{{ s.kiosk }}</div>
    </div>
  </div>
</template>
