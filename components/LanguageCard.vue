<template>
  <figure
    class="max-w-full w-72 bg-gray-100 rounded-xl m-auto p-8 mt-14 px-2 cursor-pointer hover:brightness-95 transition-all"
    @click="navigateTo(route)"
  >
    <img class="w-32 h-32 rounded-full mx-auto object-cover" :src="imageUrl" :alt="name">
    <div class="pt-6 space-y-4">
      <p class="text-lg font-semibold text-center">
        {{ name }}
      </p>
    </div>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  imageUrl: string
  name: string
  route: string
}>()
</script>
