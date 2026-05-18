<template>
  <button
    type="button"
    :aria-label="`Copy ${char.letter}, ${char.name}`"
    class="group relative max-w-full w-72 bg-white dark:bg-gray-800 rounded-xl m-auto mt-14 py-16 cursor-pointer
           hover:scale-105 hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700
           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60"
    @click="copyChar"
  >
    <span class="block space-y-4">
      <span :lang="language" class="block text-6xl font-semibold text-center text-gray-900 dark:text-white">
        {{ char.letter }}
      </span>
    </span>
    <span class="block pt-6 space-y-4">
      <span class="block text-lg font-semibold text-center text-gray-700 dark:text-gray-300">
        {{ char.name }}
      </span>
    </span>
    <span class="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-500
                 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
      Copy character
    </span>
  </button>
</template>

<script setup lang="ts">
import { copyText } from '~/utils/clipboard'

interface Char {
  letter: string
  name: string
}

const props = defineProps<{
  char: Char
  language: string
}>()

const emit = defineEmits<{
  copied: [success: boolean]
}>()

async function copyChar() {
  emit('copied', await copyText(props.char.letter))
}
</script>
