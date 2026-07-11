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
const videoRefs = ref<(HTMLVideoElement | null)[]>([])
const activeExtendedIndex = ref(1)

const displayIndex = computed(() => ((activeExtendedIndex.value - 1 + realCount) % realCount) + 1)

function bindSectionRef(el: Element | null, index: number) {
  if (el instanceof HTMLElement) sectionRefs.value[index] = el
}

function bindVideoRef(el: Element | null, index: number) {
  videoRefs.value[index] = el instanceof HTMLVideoElement ? el : null
}

function jumpTo(extendedIndex: number) {
  const container = containerRef.value
  const target = sectionRefs.value[extendedIndex]
  if (!container || !target) return
  container.style.scrollBehavior = 'auto'
  container.scrollTop = target.offsetTop
  container.style.scrollBehavior = ''
}

// Only the active section actually mounts a <video src>, so the browser
// never has more than one of these (large, locally hosted) clips loaded
// at a time.
function setActiveVideo(extendedIndex: number) {
  activeExtendedIndex.value = extendedIndex
  nextTick(() => {
    const video = videoRefs.value[extendedIndex]
    if (video) video.play().catch(() => {})
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
})

onBeforeUnmount(() => {
  observer?.disconnect()
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
    <div ref="containerRef" class="scrollbar-hide h-svh snap-y snap-mandatory overflow-y-auto scroll-smooth bg-black">
      <section
        v-for="(section, index) in extendedSections"
        :key="`${section.name}-${index}`"
        :ref="(el) => bindSectionRef(el as Element | null, index)"
        aria-hidden="true"
        class="relative h-svh w-full snap-start snap-always overflow-hidden"
      >
        <video
          v-if="index === activeExtendedIndex"
          :ref="(el) => bindVideoRef(el as Element | null, index)"
          :src="`${videoBaseUrl}/${section.name}.mp4`"
          class="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsinline
          autoplay
        />
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
