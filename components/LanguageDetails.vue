<template>
  <div class="language-guide-page min-h-screen">
    <Transition name="toast">
      <div v-if="copyMessage" class="copy-toast">
        <span aria-hidden="true">{{ copySucceeded ? '✓' : '!' }}</span>
        {{ copyMessage }}
      </div>
    </Transition>
    <p class="sr-only" role="status" aria-live="polite">{{ copyMessage }}</p>

    <header class="language-guide-hero">
      <div class="hero-route-line" aria-hidden="true" />
      <div class="hero-compass" aria-hidden="true">
        <span>N</span>
        <strong>✦</strong>
      </div>

      <div class="relative mx-auto max-w-5xl px-6 py-10 text-center sm:py-14">
        <p class="coordinate-label text-xs font-black uppercase tracking-[0.28em] text-amber-200">
          UpSpell Language Atlas
        </p>
        <h1 :lang="metadata.code" class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">
          {{ metadata.name }}
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
          Special characters for {{ metadata.englishName.toLowerCase() }}
        </p>
      </div>
    </header>

    <main class="specimen-sheet mx-auto my-6 max-w-7xl px-5 py-7 sm:my-10 sm:px-10 sm:py-9">
      <nav class="guide-navigation" aria-label="Character guide navigation">
        <button type="button" class="back-link" @click="navigateTo('/reference')">
          <span aria-hidden="true">←</span>
          Back to field guides
        </button>
        <button type="button" class="map-link" @click="navigateTo('/')">
          Daily map
          <span aria-hidden="true">→</span>
        </button>
      </nav>

      <section class="guide-summary mx-auto mt-7 max-w-6xl">
        <p class="rule-note">{{ metadata.accentRule }}</p>

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
    </main>
  </div>
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
  title: `${metadata.englishName} special characters - UpSpell`,
  description: `Copy and learn the special characters used in ${metadata.name} (${metadata.englishName}).`,
  path: metadata.route,
})

const copyMessage = ref('')
const copySucceeded = ref(false)
const isUpperCase = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | undefined

const displayChars = computed(() => {
  if (!isUpperCase.value) return props.chars
  return props.chars.map(character => ({ ...character, letter: character.letter.toUpperCase() }))
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
.language-guide-page {
  display: flow-root;
  background-color: rgb(139 74 47);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(255 239 208 / 7%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(45 18 9 / 22%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(255 239 208 / 1.8%) 9px, transparent 10px 17px),
    repeating-linear-gradient(94deg, transparent 0 12px, rgb(54 22 12 / 2.5%) 13px, transparent 14px 23px),
    linear-gradient(135deg, rgb(157 91 56), rgb(102 48 31));
  background-size: 8px 10px, 11px 9px, auto, auto, auto;
  box-shadow:
    inset 8px 0 16px rgb(30 8 16 / 20%),
    inset -8px 0 16px rgb(30 8 16 / 20%);
}

.language-guide-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 5px double rgb(217 179 106);
  background:
    radial-gradient(ellipse at 20% 15%, rgb(255 239 208 / 10%) 0, transparent 24%),
    radial-gradient(ellipse at 80% 85%, rgb(45 18 9 / 24%) 0, transparent 32%),
    repeating-linear-gradient(18deg, transparent 0 5px, rgb(255 239 208 / 2.2%) 6px, transparent 7px 13px),
    linear-gradient(135deg, rgb(137 75 47), rgb(70 31 21));
  box-shadow: inset 0 -12px 28px rgb(34 14 10 / 22%);
}

.language-guide-hero h1 {
  font-family: 'Source Serif 4', Georgia, serif;
}

.coordinate-label {
  font-family: 'Overpass Mono', monospace;
}

.hero-route-line {
  position: absolute;
  top: 50%;
  left: -5%;
  width: 110%;
  border-top: 1px dashed rgb(255 237 190 / 22%);
  transform: rotate(-3deg);
}

.hero-compass {
  position: absolute;
  top: 50%;
  left: 8%;
  display: grid;
  height: 6rem;
  width: 6rem;
  place-items: center;
  border: 1px solid rgb(255 237 190 / 18%);
  border-radius: 9999px;
  color: rgb(255 237 190 / 32%);
  transform: translateY(-50%) rotate(-12deg);
}

.hero-compass::before,
.hero-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.hero-compass::before {
  height: 120%;
  width: 1px;
}

.hero-compass::after {
  height: 1px;
  width: 120%;
}

.hero-compass span {
  position: absolute;
  top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
}

.hero-compass strong {
  font-size: 1.5rem;
}

.specimen-sheet {
  border: 1px solid rgb(120 53 15 / 20%);
  border-radius: 0.65rem;
  background: rgb(244 235 207);
  box-shadow:
    0 16px 40px rgb(38 14 8 / 24%),
    inset 0 0 35px rgb(120 53 15 / 5%);
}

.guide-navigation,
.guide-summary,
.collection-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.back-link,
.map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(87 65 49);
  font-weight: 700;
  transition: color 180ms ease;
}

.back-link:hover,
.map-link:hover {
  color: rgb(32 91 98);
}

.back-link:focus-visible,
.map-link:focus-visible,
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

html.dark .language-guide-page {
  --guide-dark-accent: rgb(209 190 162);
  --guide-dark-accent-strong: rgb(240 228 207);
  background-color: rgb(58 36 26);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(196 154 74 / 4%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 25%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(196 154 74 / 1.5%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(73 45 31), rgb(41 27 21));
  background-size: 8px 10px, 11px 9px, auto, auto;
}

html.dark .language-guide-hero {
  background:
    radial-gradient(circle at 50% 125%, rgb(95 143 145 / 24%), transparent 48%),
    linear-gradient(135deg, rgb(35 65 65), rgb(20 42 46));
}

html.dark .specimen-sheet {
  border-color: rgb(106 74 50);
  background: rgb(47 32 24);
  box-shadow:
    0 16px 40px rgb(0 0 0 / 34%),
    inset 0 0 35px rgb(0 0 0 / 12%);
}

html.dark .back-link,
html.dark .map-link {
  color: rgb(232 216 188);
}

html.dark .back-link:hover,
html.dark .map-link:hover {
  color: var(--guide-dark-accent);
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

html.dark .back-link:focus-visible,
html.dark .map-link:focus-visible,
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
  .hero-compass {
    left: -2rem;
    opacity: 0.6;
  }

  .guide-navigation {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }

  .collection-controls {
    align-items: flex-start;
    flex-direction: column;
  }

  .character-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .map-link,
  .case-toggle,
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
