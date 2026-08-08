<script setup lang="ts">
// Local dev serves from public/videos; production points at a CDN/object
// store (e.g. Cloudflare R2) via VITE_VIDEO_BASE_URL since the raw clips
// aren't committed to the repo.
const videoBaseUrl = (import.meta.env.VITE_VIDEO_BASE_URL ?? '/videos').replace(/\/$/, '')
</script>

<template>
  <div class="relative z-10 w-full">
    <video class="block w-full" :src="`${videoBaseUrl}/hoyeon.mp4`" autoplay muted loop playsinline />
  </div>
</template>
