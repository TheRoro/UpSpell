<template>
  <Transition name="feedback" appear>
    <article
      class="feedback-card relative text-left"
      :class="correct ? 'feedback-card-correct' : 'feedback-card-incorrect'"
      :aria-labelledby="feedbackTitleId"
    >
      <div v-if="correct" class="sparkles" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      <header class="result-header relative flex flex-wrap items-center gap-4">
        <span
          class="result-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm"
          :class="correct
            ? 'bg-emerald-500 text-white'
            : 'bg-rose-500 text-white'"
          aria-hidden="true"
        >
          {{ correct ? '✓' : '↗' }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold uppercase tracking-[0.18em]" :class="correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'">
            {{ correct ? 'Discovery recorded' : 'Field note added' }}
          </p>
          <h2 :id="feedbackTitleId" class="mt-1 text-2xl font-black text-gray-900 dark:text-white">
            {{ correct ? 'Perfect choice!' : 'Almost there!' }}
          </h2>
        </div>
      </header>

      <div v-if="!correct" class="answer-correction relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border p-3">
        <div class="answer-chip answer-chip-wrong">
          <span class="answer-label">Your choice</span>
          <strong :lang="languageCode">{{ selectedChoice || '—' }}</strong>
        </div>
        <span class="text-xl text-gray-400" aria-hidden="true">→</span>
        <div class="answer-chip answer-chip-correct">
          <span class="answer-label">Correct</span>
          <strong :lang="languageCode">{{ correctChoice }}</strong>
        </div>
      </div>

      <div class="learning-grid relative mt-5">
        <section class="word-study feedback-surface rounded-xl border p-5 sm:p-6">
          <p class="section-label">Word</p>
          <p :lang="languageCode" class="word-reveal mt-2 font-black tracking-wide text-gray-900 dark:text-white">
            {{ wordBefore }}<mark class="rounded-md bg-emerald-200 px-1 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-50">{{ correctChoice }}</mark>{{ wordAfter }}
          </p>
          <p class="word-meaning mt-2 text-gray-600 dark:text-gray-300">
            {{ meaning }}
          </p>
        </section>

        <section class="pronunciation-study feedback-surface rounded-xl border p-5 sm:p-6">
          <p class="section-label">Pronunciation · IPA</p>
          <p class="ipa-transcription">
            <span aria-hidden="true">/<template
                v-for="(segment, index) in ipaSegments"
                :key="`${segment.text}-${index}`"
              ><mark v-if="segment.focus" class="ipa-focus">{{ segment.text }}</mark><span v-else>{{ segment.text }}</span></template>/</span>
            <span class="sr-only">
              International Phonetic Alphabet pronunciation: {{ ipa }}.
              The highlighted sound corresponds to {{ correctChoice }}.
            </span>
          </p>
          <p class="ipa-connection">
            <span :lang="languageCode" class="spelling-focus">{{ correctChoice }}</span>
            <span aria-hidden="true">→</span>
            <span class="ipa-focus-text">/{{ focusedIpa }}/</span>
          </p>
        </section>
      </div>

      <section class="spelling-insight feedback-surface relative mt-4 rounded-xl border px-4 py-4 sm:px-5">
        <h3 class="section-label">Why this character?</h3>
        <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {{ accentRule }}
        </p>
      </section>

      <section class="pronunciation-studio relative mt-4 pt-5">
        <div class="text-center">
          <p class="pronunciation-heading">Listen closely in {{ languageName }}</p>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Hear the word naturally or slow it down to notice each sound.
          </p>
        </div>

        <div class="pronunciation-controls mx-auto mt-4 grid max-w-xl grid-cols-2 gap-3">
          <button
            v-for="control in pronunciationControls"
            :key="control.mode"
            type="button"
            class="pronunciation-button"
            :class="{ 'pronunciation-button-active': activePronunciation === control.mode }"
            :aria-label="control.ariaLabel"
            :aria-pressed="activePronunciation === control.mode"
            @click="$emit('speak', control.mode)"
          >
            <span class="pronunciation-icon" aria-hidden="true">{{ control.icon }}</span>
            <span>
              <strong>{{ control.label }}</strong>
              <small>{{ control.detail }}</small>
            </span>
          </button>
        </div>
      </section>
    </article>
  </Transition>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import type { IpaFocusRange } from '~/data/words'
import {
  getFocusedIpa,
  type PronunciationMode,
} from '~/utils/pronunciation'

const props = defineProps<{
  word: string
  blank: string
  meaning: string
  ipa: string
  ipaFocus: IpaFocusRange[]
  correctChoice: string
  selectedChoice: string
  correct: boolean
  accentRule: string
  languageCode: string
  languageName: string
  activePronunciation: PronunciationMode | null
}>()

defineEmits<{
  speak: [mode: PronunciationMode]
}>()

const feedbackTitleId = useId()
const blankIndex = computed(() => props.blank.indexOf('_'))
const wordBefore = computed(() => props.blank.slice(0, blankIndex.value))
const wordAfter = computed(() => props.blank.slice(blankIndex.value + 1))
const ipaSegments = computed(() => {
  const segments: Array<{ text: string; focus: boolean }> = []
  let cursor = 0

  for (const [start, end] of props.ipaFocus) {
    if (start > cursor) {
      segments.push({ text: props.ipa.slice(cursor, start), focus: false })
    }
    segments.push({ text: props.ipa.slice(start, end), focus: true })
    cursor = end
  }

  if (cursor < props.ipa.length) {
    segments.push({ text: props.ipa.slice(cursor), focus: false })
  }

  return segments
})
const focusedIpa = computed(() => getFocusedIpa(props.ipa, props.ipaFocus))
const pronunciationControls = computed<Array<{
  mode: PronunciationMode
  label: string
  detail: string
  icon: string
  ariaLabel: string
}>>(() => [
  {
    mode: 'word',
    label: 'Word',
    detail: 'Natural pace',
    icon: '▶',
    ariaLabel: `Hear ${props.word} at a natural pace`,
  },
  {
    mode: 'slow',
    label: 'Slow',
    detail: 'Hear each sound',
    icon: '½×',
    ariaLabel: `Hear ${props.word} slowly`,
  },
])
</script>

<style scoped>
.result-header {
  min-height: 3.5rem;
}

.learning-grid {
  display: grid;
  gap: 1rem;
}

.feedback-surface {
  border-color: var(--atlas-card-border);
  background: rgb(239 225 194 / 72%);
  box-shadow:
    2px 3px 0 rgb(120 53 15 / 7%),
    inset 0 0 0 1px rgb(255 255 255 / 24%);
}

.word-study {
  display: flex;
  min-height: 13rem;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.pronunciation-study {
  display: flex;
  min-height: 13rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.section-label {
  color: var(--atlas-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.word-reveal {
  font-size: clamp(2.75rem, 7vw, 4.5rem);
  line-height: 1.05;
}

.word-meaning {
  font-size: 1.15rem;
  font-style: italic;
}

.ipa-transcription {
  margin-top: 0.45rem;
  color: var(--atlas-text);
  font-family: 'Segoe UI', 'Noto Sans', 'DejaVu Sans', sans-serif;
  font-size: clamp(1.55rem, 4vw, 2rem);
  font-weight: 650;
  letter-spacing: 0.04em;
}

.ipa-focus {
  border-radius: 0.28rem;
  background: rgb(111 150 146 / 24%);
  padding: 0.05em 0.12em;
  color: var(--atlas-accent-text);
  box-shadow: inset 0 -2px 0 rgb(53 110 105 / 45%);
}

.ipa-connection {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: var(--atlas-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.spelling-focus,
.ipa-focus-text {
  color: var(--atlas-accent-text);
}

.spelling-focus {
  display: inline-grid;
  min-width: 1.8rem;
  place-items: center;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.3rem;
  background: var(--atlas-flag-background);
  padding: 0.12rem 0.35rem;
  font-size: 1rem;
}

.answer-correction {
  border-color: var(--atlas-card-border);
  background: rgb(255 251 235 / 48%);
}

.pronunciation-studio {
  border-top: 1px solid var(--atlas-card-border);
}

.pronunciation-heading {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1rem;
  font-weight: 800;
}

.pronunciation-button {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.65rem;
  background: var(--atlas-flag-background);
  padding: 0.7rem 0.8rem;
  color: var(--atlas-accent-text);
  text-align: left;
  transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.pronunciation-button strong,
.pronunciation-button small {
  display: block;
}

.pronunciation-button strong {
  font-size: 0.88rem;
}

.pronunciation-button small {
  margin-top: 0.12rem;
  color: var(--atlas-muted);
  font-size: 0.67rem;
  line-height: 1.2;
}

.pronunciation-icon {
  display: inline-grid;
  width: 1.75rem;
  min-width: 1.75rem;
  height: 1.75rem;
  place-items: center;
  border-radius: 9999px;
  background: rgb(111 150 146 / 20%);
  font-size: 0.78rem;
  font-weight: 900;
}

.pronunciation-button:hover,
.pronunciation-button:focus-visible {
  border-color: rgb(139 91 54 / 68%);
  background: rgb(111 150 146 / 16%);
  box-shadow:
    2px 3px 0 rgb(35 14 8 / 10%),
    inset 0 0 0 1px rgb(255 255 255 / 12%);
  outline: none;
  transform: translateY(-0.1rem);
}

.pronunciation-button:focus-visible {
  box-shadow:
    0 0 0 4px rgb(111 150 146 / 28%),
    2px 3px 0 rgb(35 14 8 / 10%);
}

.pronunciation-button-active {
  border-color: var(--atlas-accent-strong);
  background: var(--atlas-accent-strong);
  box-shadow:
    3px 4px 0 rgb(35 14 8 / 16%),
    inset 0 0 0 1px rgb(255 255 255 / 12%);
  color: rgb(255 250 238);
}

.pronunciation-button-active small {
  color: rgb(239 229 209);
}

.pronunciation-button-active .pronunciation-icon {
  background: rgb(255 255 255 / 15%);
}

@media (min-width: 768px) {
  .learning-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .spelling-insight {
    display: grid;
    grid-template-columns: 11rem minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
  }

  .spelling-insight p {
    margin-top: 0;
  }
}

@media (max-width: 639px) {
  .word-study,
  .pronunciation-study {
    min-height: auto;
  }
}

.feedback-card-correct {
  animation: correct-arrival 650ms cubic-bezier(0.16, 1, 0.3, 1);
}

.feedback-card-incorrect {
  animation: incorrect-arrival 520ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.result-icon {
  animation: icon-pop 600ms 120ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.word-reveal mark {
  display: inline-block;
  animation: letter-reveal 700ms 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.sparkles span {
  position: absolute;
  z-index: -1;
  color: rgb(16 185 129 / 45%);
  font-size: 2rem;
  animation: sparkle 1.8s ease-in-out infinite;
}

.sparkles span:nth-child(1) {
  right: 8%;
  top: 5%;
}

.sparkles span:nth-child(2) {
  right: 21%;
  top: 18%;
  animation-delay: 280ms;
}

.sparkles span:nth-child(3) {
  right: 4%;
  top: 31%;
  animation-delay: 560ms;
}

.answer-chip {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.75rem;
  padding: 0.75rem;
  text-align: center;
}

.answer-chip strong {
  font-size: 1.5rem;
}

.answer-chip-wrong {
  background: rgb(254 226 226 / 85%);
  color: rgb(159 18 57);
}

.answer-chip-correct {
  background: rgb(209 250 229 / 85%);
  color: rgb(6 95 70);
}

.answer-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.feedback-enter-active,
.feedback-leave-active {
  transition: opacity 300ms ease, transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
  transform: translateY(1.25rem) scale(0.96);
}

@keyframes correct-arrival {
  0% { box-shadow: 0 0 0 0 rgb(16 185 129 / 0%); }
  45% { box-shadow: 0 0 0 0.6rem rgb(16 185 129 / 14%); }
  100% { box-shadow: 0 0 0 0 rgb(16 185 129 / 0%); }
}

@keyframes incorrect-arrival {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-0.45rem); }
  40% { transform: translateX(0.35rem); }
  60% { transform: translateX(-0.2rem); }
  80% { transform: translateX(0.1rem); }
}

@keyframes icon-pop {
  0% { opacity: 0; transform: scale(0.3) rotate(-18deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes letter-reveal {
  0% { opacity: 0; transform: translateY(-0.7rem) scale(1.6); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(18deg); }
}

@media (prefers-reduced-motion: reduce) {
  .feedback-card-correct,
  .feedback-card-incorrect,
  .result-icon,
  .word-reveal mark,
  .sparkles span {
    animation: none;
  }

  .feedback-enter-active,
  .feedback-leave-active {
    transition: opacity 150ms ease;
  }

  .pronunciation-button {
    transition: none;
  }

  .pronunciation-button:hover {
    transform: none;
  }
}
</style>

<style>
html.dark .feedback-surface {
  border-color: rgb(209 190 162 / 22%);
  background: rgb(47 34 25 / 84%);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 16%),
    inset 0 0 0 1px rgb(209 190 162 / 5%);
}

html.dark .answer-correction {
  border-color: rgb(209 190 162 / 22%);
  background: rgb(47 34 25 / 72%);
}

html.dark .pronunciation-button {
  border-color: rgb(209 190 162 / 28%);
  background: rgb(47 33 25);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 20%),
    inset 0 0 0 1px rgb(240 228 207 / 9%);
  color: var(--atlas-accent-text);
}

html.dark .pronunciation-button:hover,
html.dark .pronunciation-button:focus-visible {
  border-color: rgb(209 190 162 / 48%);
  background: rgb(58 43 32);
  box-shadow:
    3px 4px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 1px rgb(240 228 207 / 9%);
}

html.dark .pronunciation-button-active {
  border-color: rgb(130 184 184 / 72%);
  background: rgb(53 110 105);
  color: rgb(255 250 238);
}

html.dark .answer-chip-wrong {
  background: rgb(136 19 55 / 35%);
  color: rgb(253 164 175);
}

html.dark .answer-chip-correct {
  background: rgb(6 78 59 / 45%);
  color: rgb(110 231 183);
}
</style>
