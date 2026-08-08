<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink
    to="/experience"
    class="flex h-screen flex-col items-center justify-center bg-white px-6 text-center text-black dark:bg-neutral-950 dark:text-neutral-100 sm:px-10"
  >
    <span class="block leading-none" style="font-size: 15vw; font-weight: 700">eXperience</span>
    <span class="flex items-center justify-center gap-4" style="margin-top: 6.4vw">
      <span style="font-size: 3.3vw; font-weight: 700">View Project Review</span>
      <svg
        width="30"
        height="22"
        viewBox="0 0 30 22"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M2 11H26M18 3L26 11L18 19" />
      </svg>
    </span>
  </RouterLink>
</template>
