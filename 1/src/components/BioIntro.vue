<script setup lang="ts">
const paragraphs = [
  '저는 생명공학을 전공했지만 졸업 후 다양한 길을 걸어왔습니다. 복지관에서 2년간 근무하며 사회 경험을 쌓았고, 그 과정에서 웹디자인에 관심을 갖게 되어 학원에서 공부를 시작했습니다. 이후 쇼핑몰과 에이전시를 거쳐 여러 직종을 경험했으며, 결국 웹퍼블리셔라는 일이 저와 가장 잘 맞는다는 확신을 가지게 되었습니다.',
  '웹퍼블리셔로 다시 경력을 이어갔지만, 나이와 환경의 벽으로 재취업은 쉽지 않았습니다. 구직이 길어지는 동안에도 공부를 계속했고, AI의 발전 속에서 웹퍼블리싱이 새로운 전환점을 맞이하고 있음을 체감했습니다. 신앙생활을 통해 1년의 유예기간을 가지며, 그동안 배운 것을 정리한 결과물이 바로 이 웹사이트입니다.',
  '현재는 생활비를 위해 파트타임으로 일하며, 내년에는 반드시 새로운 도전을 시작하기 위해 준비하고 있습니다. 걱정도 있지만, 기도와 노력으로 더 나은 변화를 만들어가고자 합니다.',
]
</script>

<template>
  <p
    class="leading-tight text-black dark:text-neutral-100"
    style="font-size: calc(4.5vw + 16px); font-weight: 300; margin-bottom: 12vmin"
  >
    Since 1984<br />구직중인 42세 남자
  </p>
  <div class="flex flex-col" style="gap: 6vmin">
    <p
      v-for="(paragraph, i) in paragraphs"
      :key="i"
      class="text-black dark:text-neutral-100"
      style="font-size: calc(2.5vw + 8px); font-weight: 200; opacity: 0.8"
    >
      {{ paragraph }}
    </p>
  </div>
</template>
