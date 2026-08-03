<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import BibleWordsSection from '../components/BibleWordsSection.vue'
import BioSection from '../components/BioSection.vue'

// Local dev serves from public/videos; production points at a CDN/object
// store (e.g. Cloudflare R2) via VITE_VIDEO_BASE_URL since the raw clips
// aren't committed to the repo.
const videoBaseUrl = (import.meta.env.VITE_VIDEO_BASE_URL ?? '/videos').replace(/\/$/, '')

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapper')
const letterRef = useTemplateRef<HTMLSpanElement>('letter')

// The "S" glyph is scaled up (both axes, so its proportions stay correct)
// until it spans the full width of its container — a single character never
// naturally spans edge-to-edge, so the exact factor is measured against the
// rendered glyph rather than guessed.
//
// Poppins Thin's "S" only fills ~73% of its own line box (measured via
// canvas measureText: actualBoundingBoxAscent/Descent vs. a 1-line-height
// box) — the rest is font-metric whitespace above/below the glyph, exposed
// because `leading-none` shrinks the box below the font's natural line
// height. TOP_GAP_RATIO/BOTTOM_GAP_RATIO trim that away with negative
// margins so the ink itself (not the invisible box) hugs the edges.
const TOP_GAP_RATIO = 0.131
const BOTTOM_GAP_RATIO = 0.134

// A `transform` doesn't grow the layout box it's applied to, so once scaled
// up the glyph is far taller than its own box; the wrapper's height is set to
// match the trimmed, scaled-up glyph minus the intended overlap — otherwise
// it would visually bury the video/footer below instead of just slightly
// overlapping the video.
const OVERLAP_PX = 48

function fitLetterToWidth() {
  const wrapper = wrapperRef.value
  const letter = letterRef.value
  if (!wrapper || !letter) return
  letter.style.transform = ''
  letter.style.marginTop = ''
  letter.style.marginBottom = ''
  wrapper.style.height = ''
  const naturalWidth = letter.getBoundingClientRect().width
  const targetWidth = wrapper.getBoundingClientRect().width
  if (naturalWidth === 0) return
  const scale = targetWidth / naturalWidth
  letter.style.transform = `scale(${scale})`
  const rawScaledHeight = letter.getBoundingClientRect().height
  const topGapPx = TOP_GAP_RATIO * rawScaledHeight
  const bottomGapPx = BOTTOM_GAP_RATIO * rawScaledHeight
  letter.style.marginTop = `${-topGapPx}px`
  letter.style.marginBottom = `${-bottomGapPx}px`
  const inkHeight = rawScaledHeight - topGapPx - bottomGapPx
  wrapper.style.height = `${Math.max(0, inkHeight - OVERLAP_PX)}px`
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  fitLetterToWidth()
  document.fonts?.ready.then(fitLetterToWidth)
  resizeObserver = new ResizeObserver(fitLetterToWidth)
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-950">
    <h1 class="sr-only">About</h1>

    <section class="relative">
      <div
        ref="wrapper"
        class="relative z-20 w-full overflow-visible select-none leading-none text-black dark:text-neutral-100"
        aria-hidden="true"
      >
        <span ref="letter" class="font-logo inline-block origin-top-left font-thin" style="font-size: 40vw">S</span>
      </div>

      <div class="relative z-10 w-full">
        <video
          class="block w-full"
          :src="`${videoBaseUrl}/hoyeon.mp4`"
          autoplay
          muted
          loop
          playsinline
        />
      </div>
    </section>

    <BibleWordsSection />
    <BioSection />
  </div>
</template>
