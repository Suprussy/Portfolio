<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheHero from './components/TheHero.vue'
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
    <TheHero />

    <section id="about" aria-labelledby="about-heading" class="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 id="about-heading" class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">About</h2>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">
        Write a bit about your background, skills, and experience here.
      </p>
    </section>

    <section id="projects" aria-labelledby="projects-heading" class="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 id="projects-heading" class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Projects</h2>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">
        List your projects here.
      </p>
    </section>
  </main>

  <TheFooter />
</template>
