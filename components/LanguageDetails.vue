<template>
  <div class="min-h-screen">
    <Transition name="fade">
      <div v-if="showCopied" class="fixed top-4 left-4 z-50 p-3 bg-yellow-300 rounded font-medium shadow-md">
        Copied to clipboard ✓
      </div>
    </Transition>
    <Banner :title="originalName" :sub-title="`Special Characters for ${name.toLowerCase()}`" />
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 py-14">
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
