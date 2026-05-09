<template>
  <figure
    class="max-w-full w-72 bg-gray-100 rounded-xl m-auto mt-14 py-16 cursor-pointer hover:brightness-95 transition-all"
    @click="copyChar"
  >
    <div class="space-y-4">
      <p class="text-6xl font-semibold text-center">
        {{ char.letter }}
      </p>
    </div>
    <div class="pt-6 space-y-4">
      <p class="text-lg font-semibold text-center text-gray-700">
        {{ char.name }}
      </p>
    </div>
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
