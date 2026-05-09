<template>
  <div :class="{ dark: isDark }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button
        class="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700
               hover:scale-110 transition-transform duration-200"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleDark"
      >
        <span v-if="isDark" class="text-xl">☀️</span>
        <span v-else class="text-xl">🌙</span>
      </button>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  if (import.meta.client) {
    localStorage.setItem('upspell-dark', isDark.value ? '1' : '0')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('upspell-dark')
  if (saved === '1') {
    isDark.value = true
  } else if (saved === null) {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>
