<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="grid bg-white text-black dark:bg-neutral-950 dark:text-neutral-100 sm:grid-cols-3"
    style="border-top: 1px solid #bdbdbd; padding: 20% 6vmin"
  >
    <div>
      <a
        href="https://www.instagram.com/nuevayork_01"
        target="_blank"
        rel="noopener noreferrer"
        class="block text-center"
        style="font-size: 7.4vmin; font-weight: 700"
      >
        Instagram
      </a>
      <address class="not-italic" style="margin-top: 20%; font-size: 4.2vw; font-weight: 400">
        SUPRUSSY,<br />
        11 Olympic-ro 35ga-gil,<br />
        Songpa-gu, Seoul<br />
        Republic of Korea
      </address>
    </div>

    <div style="margin-top: 20%; font-size: 4.2vw; font-weight: 400">
      <span class="block">E-mail</span>
      <a
        href="mailto:suprussy73@gmail.com"
        class="block"
        style="margin-bottom: 5%; font-size: 1.45em; font-weight: 700"
      >
        suprussy73@gmail.com
      </a>
      <span class="block">Phone</span>
      <a href="tel:+821031099789" class="block" style="font-size: 1.45em; font-weight: 700">
        +82. 10. 3109. 9789
      </a>
    </div>

    <div class="flex items-end sm:justify-end" style="margin-top: 20%">
      <small style="font-size: 3.5vw; font-weight: 700; opacity: 0.3">© {{ year }} Suprussy. All rights reserved.</small>
    </div>
  </footer>
</template>
