<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Transition name="toast">
      <div v-if="showCopied" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-green-500 text-white rounded-lg font-medium shadow-lg">
        Copied to clipboard ✓
      </div>
    </Transition>
    <Banner :title="originalName" :sub-title="`Special Characters for ${name.toLowerCase()}`" />
    <div class="px-10 py-6">
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
        @click="navigateTo('/')"
      >
        ← Back to languages
      </button>
    </div>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 pb-14">
      <CharCard
        v-for="char in displayChars"
        :key="char.name"
        :char="char"
        @copied="onCopied"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CharItem {
  letter: string
  name: string
}

const props = defineProps<{
  chars: CharItem[]
  originalName: string
  name: string
  imageUrl: string
}>()

useHead({
  title: `${props.name} UpSpell`,
  meta: [
    { name: 'description', content: `${props.name} | ${props.originalName} UpSpell - Special Characters` },
    { property: 'og:description', content: `${props.name} | ${props.originalName} UpSpell - Special Characters` },
    { property: 'og:image', content: props.imageUrl },
  ],
})

const showCopied = ref(false)
const isUpperCase = ref(false)

const displayChars = computed(() => {
  if (!isUpperCase.value) return props.chars
  return props.chars.map(c => ({ ...c, letter: c.letter.toUpperCase() }))
})

function onCopied() {
  showCopied.value = true
  setTimeout(() => { showCopied.value = false }, 1500)
}

// Toggle case on Shift/CapsLock
if (import.meta.client) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' || e.key === 'CapsLock') {
      isUpperCase.value = !isUpperCase.value
    }
  })
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
