<template>
  <div class="min-h-screen">
    <Transition name="toast">
      <div v-if="copyMessage" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-gray-900 text-white rounded-lg font-medium shadow-lg">
        {{ copyMessage }}
      </div>
    </Transition>
    <p class="sr-only" role="status" aria-live="polite">{{ copyMessage }}</p>
    <Banner :title="metadata.name" :sub-title="`Special Characters for ${metadata.englishName.toLowerCase()}`" />
    <div class="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-10 py-6">
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        @click="navigateTo('/')"
      >
        ← Back to languages
      </button>
      <button
        type="button"
        :aria-pressed="isUpperCase"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        @click="isUpperCase = !isUpperCase"
      >
        {{ isUpperCase ? 'Show lowercase' : 'Show uppercase' }}
      </button>
    </div>
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 pb-14">
      <CharCard
        v-for="char in displayChars"
        :key="char.name"
        :char="char"
        :language="metadata.code"
        @copied="onCopied"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getLanguageMetadata } from '~/data/languageMetadata'

interface CharItem {
  letter: string
  name: string
}

const props = defineProps<{
  chars: CharItem[]
  code: string
}>()

const metadata = getLanguageMetadata(props.code)
usePageSeo({
  title: `${metadata.englishName} special characters - UpSpell`,
  description: `Copy and learn the special characters used in ${metadata.name} (${metadata.englishName}).`,
  path: metadata.route,
})

const copyMessage = ref('')
const isUpperCase = ref(false)

const displayChars = computed(() => {
  if (!isUpperCase.value) return props.chars
  return props.chars.map(c => ({ ...c, letter: c.letter.toUpperCase() }))
})

function onCopied(success: boolean) {
  copyMessage.value = success
    ? 'Copied to clipboard ✓'
    : 'Could not copy the character.'
  setTimeout(() => { copyMessage.value = '' }, 2000)
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
