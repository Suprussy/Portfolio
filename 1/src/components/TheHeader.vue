<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const isMenuOpen = ref(false)
const menuButton = useTemplateRef('menuButton')

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
  menuButton.value?.focus()
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50"
    @keydown.escape="closeMenu"
  >
    <nav aria-label="Primary" class="relative mx-auto flex h-[84px] max-w-4xl items-center justify-between px-6">
      <a
        href="#"
        class="rounded-sm font-logo text-2xl font-normal tracking-[0.01em] text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100 dark:focus-visible:outline-neutral-100"
      >
        SUPRUSSY
      </a>

      <button
        ref="menuButton"
        type="button"
        class="flex h-[34px] w-[34px] items-center justify-center border-2 border-black bg-white text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-nav-menu"
        @click="toggleMenu"
      >
        <span class="sr-only">{{ isMenuOpen ? 'Close menu' : 'Open menu' }}</span>
        <svg v-if="!isMenuOpen" class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h14M3 15h14" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15L15 5M5 5l10 10" />
        </svg>
      </button>

      <ul
        id="primary-nav-menu"
        :class="[
          'absolute inset-x-0 top-full flex-col gap-1 border-t border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 shadow-lg sm:static sm:flex sm:flex-row sm:gap-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400',
          isMenuOpen ? 'flex' : 'hidden',
        ]"
      >
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="block rounded-sm px-2 py-2 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:px-0 sm:py-0 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
