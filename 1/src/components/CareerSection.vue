<script setup lang="ts">
const career = [
  { year: '2026', title: '끼니', desc: '집밥구독 끼니 배송기사' },
  { year: '2025', title: '자격증 취득', desc: '화물운송 종사자격증 취득' },
  { year: '2024', title: '프리랜서', desc: '프리랜서 웹퍼블리셔' },
  { year: '2023', title: '바른웹', desc: '바른웹 웹퍼블리셔' },
  { year: '2016', title: '바른웹', desc: '바른웹 웹퍼블리셔' },
]
</script>

<template>
  <div class="flex flex-col" style="margin-top: calc(29vmin + 9vmax); gap: 6vmin">
    <div v-for="entry in career" :key="entry.year + entry.title">
      <p class="text-black dark:text-neutral-100" style="font-size: 3.5vw; font-weight: 700">
        {{ entry.year }} {{ entry.title }}
      </p>
      <p class="text-black dark:text-neutral-100" style="font-size: 3.5vw; font-weight: 200">
        {{ entry.desc }}
      </p>
    </div>
  </div>
</template>
