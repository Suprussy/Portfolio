<script setup lang="ts">
// Drop image files into src/assets/projects/ and they show up here
// automatically — no code change needed.
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

const modules = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// Add an entry here when a filename's auto-derived alt text (below) isn't
// right — e.g. player names need capitalization title-casing can't produce.
const ALT_OVERRIDES: Record<string, string> = {
  '01_iverson.avif': 'Allen Iverson',
  '02_jordan.jpg': 'Michael Jordan',
  '03_lebron.webp': 'LeBron James',
  '04_sga.avif': 'Shai Gilgeous-Alexander',
}

// Filenames like "01_iverson.avif" become the alt text "Iverson" — strip the
// ordering prefix and extension, then title-case the rest.
function altFromPath(path: string) {
  const filename = path.split('/').pop() ?? ''
  if (filename in ALT_OVERRIDES) return ALT_OVERRIDES[filename]
  const name = filename.replace(/\.[^.]+$/, '').replace(/^\d+[_-]?/, '')
  return name
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const images = Object.keys(modules)
  .sort()
  .map((path) => ({ src: modules[path], alt: altFromPath(path) }))

const trackRef = useTemplateRef<HTMLDivElement>('track')
const activeIndex = ref(0)

// While a click-triggered smooth scroll is in flight, the track passes
// through the intermediate slides' snap points — updateActiveIndex would
// otherwise light up each one along the way. Ignoring scroll updates until
// the scroll settles keeps the clicked item active the whole time.
let ignoringScroll = false
let ignoringScrollTimer: ReturnType<typeof setTimeout> | null = null

function updateActiveIndex() {
  if (ignoringScroll) return
  const track = trackRef.value
  if (!track || track.clientWidth === 0) return
  activeIndex.value = Math.round(track.scrollLeft / track.clientWidth)
}

function stopIgnoringScroll() {
  ignoringScroll = false
  if (ignoringScrollTimer) {
    clearTimeout(ignoringScrollTimer)
    ignoringScrollTimer = null
  }
}

onMounted(() => {
  trackRef.value?.addEventListener('scroll', updateActiveIndex, { passive: true })
  trackRef.value?.addEventListener('scrollend', stopIgnoringScroll, { passive: true })
})

onBeforeUnmount(() => {
  trackRef.value?.removeEventListener('scroll', updateActiveIndex)
  trackRef.value?.removeEventListener('scrollend', stopIgnoringScroll)
  if (ignoringScrollTimer) clearTimeout(ignoringScrollTimer)
})

function goToSlide(i: number) {
  const track = trackRef.value
  if (!track) return
  ignoringScroll = true
  activeIndex.value = i
  track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
  // Fallback in case the browser never fires `scrollend` (e.g. the scroll
  // distance is 0 and no scroll event fires at all).
  if (ignoringScrollTimer) clearTimeout(ignoringScrollTimer)
  ignoringScrollTimer = setTimeout(stopIgnoringScroll, 800)
}
</script>

<template>
  <div>
    <div ref="track" class="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
      <img
        v-for="image in images"
        :key="image.src"
        :src="image.src"
        :alt="image.alt"
        class="aspect-square w-full shrink-0 snap-center object-cover"
      />
    </div>

    <div class="flex items-center justify-center bg-transparent" style="margin-top: 6vmin; gap: 20px">
      <button
        v-for="(image, i) in images"
        :key="image.src"
        type="button"
        class="box-border bg-transparent"
        :aria-label="`${i + 1}번째 이미지로 이동`"
        :style="{
          width: '16px',
          height: '16px',
          border: i === activeIndex ? '6px solid #db1010' : '4px solid #ddd',
          transition: 'border-color .45s ease, border-width .2s ease',
        }"
        @click="goToSlide(i)"
      />
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
