<script setup lang="ts">
// Each logo's aspect ratio differs a lot (wordmarks vs. near-square marks), so
// fixing only height made wide ones read as thin banners next to compact
// square ones. Sizing width/height to hold area roughly constant (~100vmin²)
// keeps their visual footprint consistent while still respecting each
// logo's native proportions.
const logos = [
  { src: '/logos/oryun_community_church.jpg', alt: '오륜교회', width: '24.5vmin', height: '5.9vmin' },
  { src: '/logos/polo_sport.jpg', alt: 'Polo Sport', width: '23.5vmin', height: '6.1vmin' },
  { src: '/logos/nba.jpg', alt: 'NBA', width: '16vmin', height: '9vmin' },
  { src: '/logos/new_york_knicks.svg', alt: 'New York Knicks', width: '13.3vmin', height: '10.8vmin' },
  { src: '/logos/apple.png', alt: 'Apple', width: '10.8vmin', height: '13.3vmin' },
  { src: '/logos/kkini.jpg', alt: '끼니', width: '19.1vmin', height: '7.6vmin' },
]
</script>

<template>
  <div class="grid grid-cols-2 justify-items-center" style="margin-top: calc(29vmin + 9vmax); gap: 6vmin 8vmin">
    <div v-for="logo in logos" :key="logo.src" class="flex items-center justify-center" style="height: 14vmin">
      <img
        :src="logo.src"
        :alt="logo.alt"
        class="object-contain"
        :style="{ width: logo.width, height: logo.height }"
      />
    </div>
  </div>
</template>
