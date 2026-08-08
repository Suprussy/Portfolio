<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { bibleWordEntries } from '../data/bibleWords'

const AUTOPLAY_INTERVAL_MS = 4500

const trackRef = useTemplateRef<HTMLDivElement>('track')
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let autoplayIndex = 0

function stopAutoplay() {
  if (autoplayTimer === null) return
  clearInterval(autoplayTimer)
  autoplayTimer = null
}

function startAutoplay() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  autoplayTimer = setInterval(() => {
    const track = trackRef.value
    if (!track) return
    autoplayIndex = (autoplayIndex + 1) % bibleWordEntries.length
    track.scrollTo({ left: autoplayIndex * track.clientWidth, behavior: 'smooth' })
  }, AUTOPLAY_INTERVAL_MS)
}

onMounted(() => {
  startAutoplay()
  // A real user swipe/drag always starts with a pointerdown on the track;
  // our own autoplay-driven scrollTo never fires one. That makes it a clean,
  // one-time signal to permanently hand control over to the user.
  trackRef.value?.addEventListener('pointerdown', stopAutoplay, { once: true })
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <div
    ref="track"
    class="scrollbar-hide -mx-6 flex snap-x snap-mandatory overflow-x-auto scroll-smooth sm:-mx-10"
  >
    <div
      v-for="entry in bibleWordEntries"
      :key="entry.word"
      class="flex w-full shrink-0 snap-center justify-center px-6"
    >
      <div class="w-full max-w-xl text-left text-[9px] text-black sm:text-[11px] dark:text-neutral-100">
        <p class="mb-4" style="font-size: 1.75em; font-weight: 700">{{ entry.word }}</p>
        <p style="font-size: 1.75em">
          {{ entry.verse }} <span class="whitespace-nowrap">({{ entry.reference }})</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
