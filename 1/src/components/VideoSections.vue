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

// Drives goTo's scroll manually (instead of scrollIntoView's native smooth
// behavior) so its timing curve can match the page-number transition exactly
// — same duration, same easing — instead of drifting out of sync with it.
const NAV_TRANSITION_MS = 320

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

let scrollAnimationId: number | null = null
const isNavAnimating = ref(false)

function animateScrollTo(offset: number) {
  const container = containerRef.value
  if (!container) return
  if (scrollAnimationId !== null) cancelAnimationFrame(scrollAnimationId)

  const start = container.scrollTop
  const change = offset - start
  const startTime = performance.now()

  // The container also has CSS `scroll-behavior: smooth` (Tailwind's
  // scroll-smooth) for other native scrolling; left on here, every scrollTop
  // write below would itself get re-eased by the browser on top of our own
  // easing, compounding into a sluggish, delayed-feeling motion.
  container.style.scrollBehavior = 'auto'
  container.style.scrollSnapType = 'none'
  isNavAnimating.value = true

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / NAV_TRANSITION_MS)
    container!.scrollTop = start + change * easeOutCubic(t)
    if (t < 1) {
      scrollAnimationId = requestAnimationFrame(step)
    } else {
      scrollAnimationId = null
      container!.style.scrollSnapType = ''
      container!.style.scrollBehavior = ''
      isNavAnimating.value = false
    }
  }

  scrollAnimationId = requestAnimationFrame(step)
}

function jumpTo(extendedIndex: number) {
  const container = containerRef.value
  const target = sectionRefs.value[extendedIndex]
  if (!container || !target) return
  const offset = target.offsetTop

  // The infinite-loop wrap can land here while animateScrollTo's own rAF
  // loop is still mid-flight (its threshold-0.98 trigger and our
  // animation's tail end land around the same moment). Left running, that
  // loop would keep overwriting scrollTop from its now-stale start/target,
  // fighting this instant jump and making the scroll blow past several
  // sections at once.
  if (scrollAnimationId !== null) {
    cancelAnimationFrame(scrollAnimationId)
    scrollAnimationId = null
    isNavAnimating.value = false
  }

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
  if (scrollAnimationId !== null) cancelAnimationFrame(scrollAnimationId)
})

function goTo(extendedIndex: number) {
  const target = sectionRefs.value[extendedIndex]
  if (!target) return
  animateScrollTo(target.offsetTop)
}

const navDirection = ref<'next' | 'prev'>('next')

function goPrev() {
  if (isNavAnimating.value) return
  navDirection.value = 'prev'
  const target = activeExtendedIndex.value - 1
  setActiveVideo(target)
  goTo(target)
}

function goNext() {
  if (isNavAnimating.value) return
  navDirection.value = 'next'
  const target = activeExtendedIndex.value + 1
  setActiveVideo(target)
  goTo(target)
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

    <div class="fixed right-6 bottom-[25px] z-40 flex items-center gap-3">
      <div class="flex h-[68px] flex-col items-center justify-between text-black" aria-live="polite">
        <div class="relative h-4 w-4 overflow-hidden">
          <Transition :name="navDirection === 'next' ? 'slide-up' : 'slide-down'">
            <span
              :key="displayIndex"
              :style="{ transitionDuration: `${NAV_TRANSITION_MS}ms` }"
              class="absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums"
            >
              {{ displayIndex }}
            </span>
          </Transition>
        </div>
        <span class="h-[28px] w-px bg-black" aria-hidden="true"></span>
        <span class="text-xs font-medium tabular-nums">{{ realCount }}</span>
      </div>

      <div class="flex flex-col">
        <button
          type="button"
          class="flex h-[34px] w-[34px] items-center justify-center border-2 border-black bg-white text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          aria-label="Previous section"
          @click="goPrev"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l5-5 5 5" />
          </svg>
        </button>

        <button
          type="button"
          class="flex h-[34px] w-[34px] items-center justify-center border-2 border-t-0 border-black bg-white text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          aria-label="Next section"
          @click="goNext"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        </button>
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

.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
