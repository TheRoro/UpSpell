<template>
  <div class="bg-blue-500 dark:bg-blue-700 sm:py-12 py-8 px-4 transition-colors duration-300">
    <div class="container mx-auto text-center">
      <h1 class="sm:text-5xl text-3xl text-white font-black">
        {{ title }}
      </h1>
      <p class="sm:text-xl text-base text-white/90 font-medium mt-2">
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subTitle: string
}>()
</script>
