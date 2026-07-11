<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import VideoSections from './components/VideoSections.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white dark:focus:bg-neutral-100 dark:focus:text-neutral-900"
  >
    Skip to content
  </a>

  <TheHeader />

  <main id="main-content" tabindex="-1" class="focus:outline-none">
    <VideoSections />
  </main>

  <TheFooter />
</template>
