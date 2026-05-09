<template>
  <figure
    class="group relative max-w-full w-72 bg-white dark:bg-gray-800 rounded-xl m-auto mt-14 py-16 cursor-pointer
           hover:scale-105 hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
    @click="copyChar"
  >
    <div class="space-y-4">
      <p class="text-6xl font-semibold text-center text-gray-900 dark:text-white">
        {{ char.letter }}
      </p>
    </div>
    <div class="pt-6 space-y-4">
      <p class="text-lg font-semibold text-center text-gray-700 dark:text-gray-300">
        {{ char.name }}
      </p>
    </div>
    <span class="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400 dark:text-gray-500
                 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      Click to copy
    </span>
  </figure>
</template>

<script setup lang="ts">
interface Char {
  letter: string
  name: string
}

const props = defineProps<{
  char: Char
}>()

const emit = defineEmits<{
  copied: []
}>()

function copyChar() {
  navigator.clipboard.writeText(props.char.letter)
  emit('copied')
}
</script>
