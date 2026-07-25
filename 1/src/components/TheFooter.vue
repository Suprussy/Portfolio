<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const year = new Date().getFullYear()
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <template v-if="isHome">
    <footer id="contact" class="scroll-mt-20 border-t border-neutral-200 px-4 py-10 text-center text-sm text-neutral-600 sm:px-6 dark:border-neutral-800 dark:text-neutral-400">
      <p>&copy; {{ year }} Your Name. All rights reserved.</p>
    </footer>

    <p class="fixed bottom-6 left-6 z-30 text-[12px] text-black opacity-40 dark:text-neutral-100">&copy; SUPRUSSY All rights reserved.</p>
  </template>
</template>
