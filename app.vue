<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function applyDark(dark: boolean) {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', dark)
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  applyDark(isDark.value)
  localStorage.setItem('upspell-dark', isDark.value ? '1' : '0')
}

onMounted(() => {
  // Sync with the inline script that already applied the class
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>
