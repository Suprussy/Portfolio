<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="grid bg-white px-6 text-black dark:bg-neutral-950 dark:text-neutral-100 sm:grid-cols-3 sm:px-10"
    style="padding-top: calc(14vmin + 4vmax); padding-bottom: calc(14vmin + 4vmax); gap: 6vmin"
  >
    <div>
      <a
        href="https://www.instagram.com/nuevayork_01"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block"
        style="font-size: calc(1.8vw + 10px); font-weight: 700"
      >
        Instagram
      </a>
      <address class="not-italic" style="margin-top: 4vmin; font-size: calc(1.6vw + 8px); font-weight: 200">
        SUPRUSSY,<br />
        11 Olympic-ro 35ga-gil,<br />
        Songpa-gu, Seoul<br />
        Republic of Korea
      </address>
    </div>

    <div>
      <a href="mailto:suprussy73@gmail.com" class="block" style="font-size: calc(1.8vw + 10px); font-weight: 700">
        suprussy73@gmail.com
      </a>
      <a
        href="tel:+821031099789"
        class="block"
        style="margin-top: 4vmin; font-size: calc(1.6vw + 8px); font-weight: 200"
      >
        +82. 10. 3109. 9789
      </a>
    </div>

    <div class="flex items-end sm:justify-end">
      <small style="font-size: calc(1.2vw + 8px); font-weight: 200">© {{ year }} Suprussy. All rights reserved.</small>
    </div>
  </footer>
</template>
