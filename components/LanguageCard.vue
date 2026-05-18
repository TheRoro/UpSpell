<template>
  <NuxtLink
    :to="route"
    :aria-label="`Open ${name} character reference`"
    class="max-w-full w-72 bg-white dark:bg-gray-800 rounded-xl m-auto p-8 mt-14 px-2 cursor-pointer
           hover:scale-105 hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700
           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60"
  >
    <img class="w-32 h-32 rounded-full mx-auto object-cover" :src="imageUrl" :alt="name">
    <div class="pt-6 space-y-4">
      <p class="text-lg font-semibold text-center text-gray-900 dark:text-white">
        {{ name }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  imageUrl: string
  name: string
  route: string
}>()
</script>
