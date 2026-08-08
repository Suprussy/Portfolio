<script setup lang="ts">
import { bibleWordEntries } from '../data/bibleWords'
</script>

<template>
  <ul class="relative z-20 -mt-12 mb-16 flex flex-col gap-4 sm:mb-24 sm:gap-6">
    <li
      v-for="entry in bibleWordEntries"
      :key="entry.word"
      class="leading-none text-black dark:text-neutral-100"
      style="font-size: 10.5vw; font-weight: 300"
    >
      {{ entry.word }}
    </li>
  </ul>
</template>
