<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface SectionItem {
  name: string
}

const sections: SectionItem[] = [{ name: 'yeram' }, { name: 'you_got_me' }, { name: 'iverson' }]

// Local dev serves from public/videos; production points at a CDN/object
// store (e.g. Cloudflare R2) via VITE_VIDEO_BASE_URL since the raw clips
// aren't committed to the repo.
const videoBaseUrl = (import.meta.env.VITE_VIDEO_BASE_URL ?? '/videos').replace(/\/$/, '')

const realCount = sections.length

// [clone of last, ...real sections, clone of first] so scrolling past either
// end lands on a visually identical clone, which we then jump past invisibly
// to fake an infinite loop.
const extendedSections = [
  { ...sections[realCount - 1], clone: true },
  ...sections.map((s) => ({ ...s, clone: false })),
  { ...sections[0], clone: true },
]

const containerRef = ref<HTMLElement | null>(null)
const sectionRefs = ref<HTMLElement[]>([])
const coverRefs = ref<HTMLElement[]>([])
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
const activeExtendedIndex = ref(1)

const displayIndex = computed(() => ((activeExtendedIndex.value - 1 + realCount) % realCount) + 1)

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function bindSectionRef(el: Element | null, index: number) {
  if (el instanceof HTMLElement) sectionRefs.value[index] = el
}

function bindCoverRef(el: Element | null, index: number) {
  if (el instanceof HTMLElement) coverRefs.value[index] = el
}

function bindVideoRef(el: Element | null, index: number) {
  videoRefs.value[index] = el instanceof HTMLVideoElement ? el : null
}

function jumpTo(extendedIndex: number) {
  const container = containerRef.value
  const target = sectionRefs.value[extendedIndex]
  if (!container || !target) return
  const offset = target.offsetTop

  // Reaching here mid-way through the button/scroll-snap's own smooth
  // animation can leave that animation still in flight; it then keeps
  // nudging scrollTop by a few px right after our "instant" jump. Turning
  // off snapping and re-asserting the offset next frame forces it to land
  // exactly on the boundary instead of a few px short.
  container.style.scrollSnapType = 'none'
  container.style.scrollBehavior = 'auto'
  container.scrollTop = offset
  requestAnimationFrame(() => {
    container.scrollTop = offset
    container.style.scrollBehavior = ''
    container.style.scrollSnapType = ''
    updateParallax()
  })
}

// The active section plus its immediate neighbors mount a <video src>, so at
// most 3 (large, locally hosted) clips are loaded at once — enough for the
// leaving section to still be visible underneath while the next one covers it.
function isMounted(index: number) {
  return Math.abs(index - activeExtendedIndex.value) <= 1
}

// Tracks scroll direction so we know, at any instant, which of the two
// straddled sections is "arriving" vs "leaving" — the pin logic below is
// direction-dependent, not just a function of position.
let lastScrollTop = 0
let lastDirection: 'down' | 'up' = 'down'

// How much of the leaving section's own scroll-linked motion gets cancelled.
// 1 = fully frozen (doesn't read as "leaving", just static); 0 = no lag at
// all (normal scroll, no cover effect). 0.6 keeps it visibly drifting out,
// just slower than the incoming section covering it.
const OUTGOING_LAG = 0.6

// The cover effect: the section currently being scrolled away from lags
// behind (partially cancels its own scroll-linked motion) while the next one
// slides over it at native scroll speed — so the incoming section arrives
// at full speed and the outgoing one visibly, slowly, gets covered up.
//
// This is applied to an inner "cover" wrapper, never to the <section> itself
// — the IntersectionObserver below watches the sections to decide what's
// active, and it measures each element's rendered (post-transform) box. A
// transform on the section would make a frozen/leaving section keep
// reporting as fully visible, confusing that detection and misfiring the
// infinite-loop jump.
function updateParallax() {
  if (prefersReducedMotion) return
  const container = containerRef.value
  if (!container) return
  const viewportHeight = container.clientHeight || 1
  const scrollTop = container.scrollTop

  if (scrollTop !== lastScrollTop) {
    lastDirection = scrollTop > lastScrollTop ? 'down' : 'up'
    lastScrollTop = scrollTop
  }

  sectionRefs.value.forEach((section, index) => {
    const cover = coverRefs.value[index]
    if (!section || !cover) return
    const progress = (section.offsetTop - scrollTop) / viewportHeight
    const clamped = Math.max(-1, Math.min(1, progress))
    const isLeaving = lastDirection === 'down' ? clamped < 0 : clamped > 0
    const offset = isLeaving ? -clamped * viewportHeight * OUTGOING_LAG : 0

    cover.style.transform = offset ? `translate3d(0, ${offset}px, 0)` : ''
    cover.style.zIndex = String(Math.round((1 - Math.abs(clamped)) * 100))
  })
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateParallax()
    ticking = false
  })
}

// Only the active section's video actually plays; the mounted neighbors
// (kept around so their content parallax-shifts into view) sit paused on a
// single frame — full decode/playback cost stays at 1 video, not 3.
function setActiveVideo(extendedIndex: number) {
  activeExtendedIndex.value = extendedIndex
  nextTick(() => {
    videoRefs.value.forEach((video, i) => {
      if (!video) return
      if (i === extendedIndex) video.play().catch(() => {})
      else video.pause()
    })
    updateParallax()
  })
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  jumpTo(1)
  setActiveVideo(1)

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.98) continue
        const index = sectionRefs.value.indexOf(entry.target as HTMLElement)
        if (index === -1) continue
        setActiveVideo(index)

        if (index === 0) {
          jumpTo(realCount)
          setActiveVideo(realCount)
        } else if (index === extendedSections.length - 1) {
          jumpTo(1)
          setActiveVideo(1)
        }
      }
    },
    { root: containerRef.value, threshold: 0.98 },
  )
  sectionRefs.value.forEach((el) => observer?.observe(el))

  containerRef.value?.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateParallax)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  containerRef.value?.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateParallax)
})

function goTo(extendedIndex: number) {
  sectionRefs.value[extendedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goPrev() {
  goTo(activeExtendedIndex.value - 1)
}

function goNext() {
  goTo(activeExtendedIndex.value + 1)
}
</script>

<template>
  <div class="relative">
    <div
      ref="containerRef"
      class="scrollbar-hide isolate h-svh snap-y snap-mandatory overflow-y-auto scroll-smooth bg-black"
    >
      <section
        v-for="(section, index) in extendedSections"
        :key="`${section.name}-${index}`"
        :ref="(el) => bindSectionRef(el as Element | null, index)"
        aria-hidden="true"
        class="relative h-svh w-full snap-start snap-always overflow-hidden"
      >
        <div
          :ref="(el) => bindCoverRef(el as Element | null, index)"
          class="absolute inset-0 h-full w-full will-change-transform"
        >
          <video
            v-if="isMounted(index)"
            :ref="(el) => bindVideoRef(el as Element | null, index)"
            :src="`${videoBaseUrl}/${section.name}.mp4`"
            :preload="index === activeExtendedIndex ? 'auto' : 'metadata'"
            class="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsinline
          />
        </div>
      </section>
    </div>

    <div
      class="fixed right-4 bottom-4 z-40 flex flex-col items-center gap-2 rounded-full bg-black/40 px-2 py-3 text-white backdrop-blur sm:right-6 sm:bottom-6"
    >
      <button
        type="button"
        class="rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Previous section"
        @click="goPrev"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      <span class="text-xs font-medium tabular-nums" aria-live="polite">
        {{ displayIndex }} / {{ realCount }}
      </span>

      <button
        type="button"
        class="rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Next section"
        @click="goNext"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
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
