<template>
  <AtlasPageShell>
    <Transition name="toast">
      <div v-if="copyMessage" class="copy-toast">
        <span aria-hidden="true">{{ copySucceeded ? '✓' : '!' }}</span>
        {{ copyMessage }}
      </div>
    </Transition>
    <p class="sr-only" role="status" aria-live="polite">{{ copyMessage }}</p>

    <AtlasHero
      :title="metadata.name"
      :subtitle="`Copy special characters for ${metadata.englishName.toLowerCase()}`"
      :language="metadata.code"
    />

    <AtlasPanel class="mx-auto my-6 max-w-7xl px-5 py-7 sm:my-10 sm:px-10 sm:py-9">
      <AtlasNavigation
        back-label="Back to characters"
        back-to="/reference"
        forward-label="Pronunciation guide"
        :forward-to="`/phonetics/${metadata.code}`"
        label="Character reference navigation"
      />

      <section class="guide-summary mx-auto mt-7 max-w-6xl">
        <p class="rule-note">{{ metadata.accentRule }} Select any card to copy its character.</p>

        <div class="collection-controls">
          <span class="collection-count">
            {{ displayChars.length }} {{ displayChars.length === 1 ? 'character' : 'characters' }}
          </span>
          <button
            type="button"
            :aria-pressed="isUpperCase"
            class="case-toggle"
            @click="isUpperCase = !isUpperCase"
          >
            {{ isUpperCase ? 'Show lowercase' : 'Show uppercase' }}
          </button>
        </div>
      </section>

      <section class="mx-auto mt-7 max-w-6xl" aria-label="Characters">
        <div class="character-grid">
          <CharCard
            v-for="char in displayChars"
            :key="char.name"
            :char="char"
            :language="metadata.code"
            @copied="onCopied"
          />
        </div>
      </section>
    </AtlasPanel>
  </AtlasPageShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
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
  title: `${metadata.englishName} Character Guide | UpSpell`,
  description: `Explore and copy the special characters used in ${metadata.name} through the UpSpell language atlas.`,
  path: metadata.route,
})

const copyMessage = ref('')
const copySucceeded = ref(false)
const isUpperCase = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | undefined

const displayChars = computed(() => {
  if (!isUpperCase.value) return props.chars
  return props.chars.map(character => ({
    ...character,
    letter: character.letter.toLocaleUpperCase(metadata.code),
  }))
})

function onCopied(success: boolean) {
  copySucceeded.value = success
  copyMessage.value = success
    ? 'Character copied to your clipboard.'
    : 'The character could not be copied.'

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
.coordinate-label {
  font-family: 'Overpass Mono', monospace;
}

.guide-summary,
.collection-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.case-toggle:focus-visible {
  border-radius: 0.3rem;
  outline: 3px solid rgb(42 103 110 / 45%);
  outline-offset: 3px;
}

.guide-summary {
  align-items: flex-end;
  border-bottom: 1px solid rgb(120 53 15 / 18%);
  padding-bottom: 1.25rem;
}

.rule-note {
  max-width: 42rem;
  color: rgb(87 65 49);
  line-height: 1.6;
}

.collection-controls {
  flex-shrink: 0;
  gap: 0.75rem;
}

.collection-count {
  color: rgb(87 65 49);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.case-toggle {
  border: 1px solid rgb(120 53 15 / 20%);
  border-radius: 0.45rem;
  background: rgb(255 251 235 / 80%);
  padding: 0.65rem 0.85rem;
  color: rgb(32 91 98);
  font-size: 0.78rem;
  font-weight: 700;
  box-shadow: 1px 2px 0 rgb(120 53 15 / 8%);
  transition: background 180ms ease;
  white-space: nowrap;
}

.case-toggle:hover {
  background: rgb(255 251 235);
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.copy-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 0.45rem;
  background: rgb(25 52 56);
  padding: 0.75rem 1rem;
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 24px rgb(20 29 28 / 30%);
  transform: translateX(-50%);
}

.copy-toast span {
  display: grid;
  height: 1.5rem;
  width: 1.5rem;
  place-items: center;
  border-radius: 9999px;
  background: rgb(159 208 206);
  color: rgb(25 52 56);
  font-size: 0.75rem;
  font-weight: 900;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.5rem);
}

html.dark {
  --guide-dark-accent: rgb(209 190 162);
  --guide-dark-accent-strong: rgb(240 228 207);
}

html.dark .guide-summary {
  border-color: rgb(106 74 50);
}

html.dark .rule-note,
html.dark .collection-count {
  color: rgb(205 187 157);
}

html.dark .case-toggle {
  border-color: rgb(106 74 50);
  background: rgb(56 37 26);
  color: var(--guide-dark-accent);
}

html.dark .case-toggle:hover {
  background: rgb(67 48 34);
}

html.dark .case-toggle:focus-visible {
  outline-color: rgb(209 190 162 / 55%);
}

html.dark .copy-toast span {
  background: var(--guide-dark-accent);
  color: rgb(56 37 26);
}

@media (max-width: 1050px) {
  .character-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .character-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .guide-summary {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
  }

  .collection-controls {
    width: 100%;
  }

}

@media (max-width: 440px) {
  .collection-controls {
    align-items: flex-start;
    flex-direction: column;
  }

  .character-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .case-toggle,
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
