<script setup lang="ts">
import BigLetterS from '../components/BigLetterS.vue'
import IntroVideo from '../components/IntroVideo.vue'
import WordList from '../components/WordList.vue'
import VerseSlider from '../components/VerseSlider.vue'
import BioIntro from '../components/BioIntro.vue'
import LogoGrid from '../components/LogoGrid.vue'
import CareerSection from '../components/CareerSection.vue'
import ExperienceLink from '../components/ExperienceLink.vue'
import ProjectSlider from '../components/ProjectSlider.vue'
</script>

<template>
  <div class="bg-white dark:bg-neutral-950">
    <h1 class="sr-only">About</h1>

    <!-- 큰 대문자 S -->
    <BigLetterS />

    <!-- 비디오 -->
    <IntroVideo />

    <!-- 단어 나열 + 슬라이더 -->
    <section class="bg-white px-6 pt-0 dark:bg-neutral-950 sm:px-10" style="padding-bottom: calc(29vmin + 9vmax)">
      <WordList />
      <VerseSlider />
    </section>

    <!-- 소개글 + 로고 + 경력 -->
    <section class="bg-white px-6 pb-24 dark:bg-neutral-950 sm:px-10 sm:pb-32">
      <BioIntro />
      <LogoGrid />
      <CareerSection />
    </section>

    <!-- 링크 -->
    <ExperienceLink />

    <!-- 프로젝트 리뷰 슬라이더 -->
    <section class="relative">
      <h2
        class="relative z-10 px-6 leading-tight text-black dark:text-neutral-100 sm:px-10"
        style="font-size: 9.15vw; font-weight: 700; margin-bottom: -6vw"
      >
        Where Amazing Happens<br />This Is Why We Play
      </h2>
      <ProjectSlider class="relative z-0" />
    </section>
  </div>
</template>
