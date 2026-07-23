<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const links = [
  { label: 'eXperience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// King James Version (public domain)
const verses = [
  'The LORD is my shepherd; I shall not want. — Psalm 23:1',
  'I can do all things through Christ which strengtheneth me. — Philippians 4:13',
  'For God so loved the world, that he gave his only begotten Son. — John 3:16',
  'Trust in the LORD with all thine heart. — Proverbs 3:5',
  'Be strong and of a good courage; be not afraid. — Joshua 1:9',
  'This is the day which the LORD hath made; we will rejoice and be glad in it. — Psalm 118:24',
  'And we know that all things work together for good to them that love God. — Romans 8:28',
  'Fear thou not; for I am with thee. — Isaiah 41:10',
  'But they that wait upon the LORD shall renew their strength. — Isaiah 40:31',
  'Let all that you do be done in love. — 1 Corinthians 16:14',
  'Rejoice in the Lord alway: and again I say, Rejoice. — Philippians 4:4',
  'In all thy ways acknowledge him, and he shall direct thy paths. — Proverbs 3:6',
  'Come unto me, all ye that labour and are heavy laden, and I will give you rest. — Matthew 11:28',
  'The LORD is my light and my salvation; whom shall I fear? — Psalm 27:1',
  'Be still, and know that I am God. — Psalm 46:10',
  'Cast all your care upon him; for he careth for you. — 1 Peter 5:7',
  'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace. — Jeremiah 29:11',
  'Let not your heart be troubled: ye believe in God, believe also in me. — John 14:1',
  'Give thanks in every thing: for this is the will of God. — 1 Thessalonians 5:18',
  'Blessed are the pure in heart: for they shall see God. — Matthew 5:8',
  'The joy of the LORD is your strength. — Nehemiah 8:10',
  'Love suffereth long, and is kind; love envieth not. — 1 Corinthians 13:4',
  'Delight thyself also in the LORD; and he shall give thee the desires of thine heart. — Psalm 37:4',
  'Whatsoever ye do, do it heartily, as to the Lord. — Colossians 3:23',
  'Be not conformed to this world: but be ye transformed by the renewing of your mind. — Romans 12:2',
  'Ask, and it shall be given you; seek, and ye shall find. — Matthew 7:7',
  'The LORD bless thee, and keep thee. — Numbers 6:24',
  'Perfect love casteth out fear. — 1 John 4:18',
  'My grace is sufficient for thee: for my strength is made perfect in weakness. — 2 Corinthians 12:9',
  'Commit thy way unto the LORD; trust also in him. — Psalm 37:5',
]

function getDailyVerse() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
  return verses[dayOfYear % verses.length]
}

const dailyVerse = getDailyVerse()
// ~50px/s at text-sm: (chars + gap-equivalent chars) / chars-per-second
const marqueeDuration = `${Math.max(10, (dailyVerse.length + 9) / 6.8)}s`

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
    <nav aria-label="Primary" class="relative mx-auto flex h-[84px] max-w-4xl items-center px-6">
      <a
        href="#"
        class="relative z-50 shrink-0 rounded-sm font-logo text-2xl font-normal tracking-[0.01em] text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100 dark:focus-visible:outline-neutral-100"
      >
        SUPRUSSY
      </a>

      <div
        class="mx-4 flex h-full min-w-0 flex-1 items-center overflow-hidden"
        :class="{ invisible: isMenuOpen }"
        role="text"
        :aria-label="dailyVerse"
      >
        <div
          class="verse-track flex shrink-0 items-center whitespace-nowrap text-sm text-black"
          :style="{ animationDuration: marqueeDuration }"
          aria-hidden="true"
        >
          <span class="pr-16">{{ dailyVerse }}</span>
          <span class="pr-16">{{ dailyVerse }}</span>
        </div>
      </div>

      <button
        ref="menuButton"
        type="button"
        class="relative z-50 flex h-[34px] w-[34px] shrink-0 items-center justify-center border-2 border-black bg-white text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="primary-nav-menu"
        @click="toggleMenu"
      >
        <span class="sr-only">{{ isMenuOpen ? 'Close menu' : 'Open menu' }}</span>
        <span class="menu-bars" :class="{ 'is-open': isMenuOpen }" aria-hidden="true">
          <span class="menu-bar menu-bar--top"></span>
          <span class="menu-bar menu-bar--bottom"></span>
        </span>
      </button>

      <ul
        id="primary-nav-menu"
        :class="[
          'fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-white/95 font-nav text-[15.5vw] font-bold text-black opacity-0 transition-opacity duration-300 ease-in-out dark:bg-neutral-950/95 dark:text-neutral-100',
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none',
          'sm:static sm:inset-auto sm:z-auto sm:flex sm:shrink-0 sm:flex-row sm:gap-6 sm:bg-transparent sm:font-sans sm:text-sm sm:font-normal sm:text-neutral-600 sm:opacity-100 sm:pointer-events-auto dark:sm:bg-transparent dark:sm:text-neutral-400',
        ]"
      >
        <li v-for="(link, index) in links" :key="link.href" class="overflow-hidden sm:overflow-visible">
          <a
            :href="link.href"
            :class="[
              'block rounded-sm px-2 py-2 transition-transform duration-500 ease-out hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:translate-y-0 sm:px-0 sm:py-0 sm:transition-none dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100',
              isMenuOpen ? 'translate-y-0' : 'translate-y-full',
            ]"
            :style="{ transitionDelay: isMenuOpen ? `${index * 80}ms` : '0ms' }"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
@keyframes verse-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.verse-track {
  animation-name: verse-marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.menu-bars {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
}

.menu-bar {
  position: absolute;
  left: 3px;
  width: 14px;
  height: 2px;
  background: currentColor;
  transition: top 0.3s ease, transform 0.3s ease;
}

.menu-bar--top {
  top: 4px;
}

.menu-bar--bottom {
  top: 14px;
}

.menu-bars.is-open .menu-bar--top {
  top: 9px;
  transform: rotate(45deg);
}

.menu-bars.is-open .menu-bar--bottom {
  top: 9px;
  transform: rotate(-45deg);
}
</style>
