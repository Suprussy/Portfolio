<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

interface Entry {
  word: string
  verse: string
  reference: string
}

const entries: Entry[] = [
  { word: 'Faith', verse: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니', reference: '히브리서 11:1' },
  { word: 'Love', verse: '그런즉 믿음, 소망, 사랑 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라', reference: '고린도전서 13:13' },
  { word: 'Grace', verse: '너희가 그 은혜에 의하여 믿음으로 말미암아 구원을 받았나니', reference: '에베소서 2:8' },
  { word: 'Hope', verse: '소망의 하나님이 모든 기쁨과 평강을 믿음 안에서 너희에게 충만하게 하사', reference: '로마서 15:13' },
  { word: 'Truth', verse: '진리를 알지니 진리가 너희를 자유롭게 하리라', reference: '요한복음 8:32' },
  { word: 'Peace', verse: '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라', reference: '요한복음 14:27' },
  { word: 'Salvation', verse: '다른 이로써는 구원을 얻을 수 없나니', reference: '사도행전 4:12' },
  { word: 'Forgiveness', verse: '서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라', reference: '에베소서 4:32' },
  { word: 'Light', verse: '나는 세상의 빛이니 나를 따르는 자는 어둠에 다니지 아니하고 생명의 빛을 얻으리라', reference: '요한복음 8:12' },
  { word: 'Eternal Life', verse: '이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라', reference: '요한복음 3:16' },
]

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
    autoplayIndex = (autoplayIndex + 1) % entries.length
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
  <section class="bg-white px-6 pt-0 pb-24 dark:bg-neutral-950 sm:px-10 sm:pb-32">
    <ul class="relative z-20 -mt-12 mb-16 flex flex-col gap-4 sm:mb-24 sm:gap-6">
      <li
        v-for="entry in entries"
        :key="entry.word"
        class="leading-none text-neutral-900 dark:text-neutral-100"
        style="font-size: 10.5vw; font-weight: 300"
      >
        {{ entry.word }}
      </li>
    </ul>

    <div ref="track" class="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
      <div v-for="entry in entries" :key="entry.word" class="flex w-full shrink-0 snap-center justify-center px-6">
        <div class="w-full max-w-xl text-left text-[9px] text-neutral-900 sm:text-[11px] dark:text-neutral-100">
          <p class="mb-4" style="font-size: 1.75em; font-weight: 700">{{ entry.word }}</p>
          <p style="font-size: 1.75em">{{ entry.verse }} ({{ entry.reference }})</p>
        </div>
      </div>
    </div>
  </section>
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
