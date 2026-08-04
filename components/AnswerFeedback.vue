<template>
  <Transition name="feedback" appear>
    <article
      class="feedback-card relative mt-6 overflow-hidden rounded-2xl border p-5 text-left sm:p-6"
      :class="correct
        ? 'feedback-card-correct border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30'
        : 'feedback-card-incorrect border-rose-200 bg-rose-50/80 dark:border-rose-800 dark:bg-rose-950/30'"
      :aria-labelledby="feedbackTitleId"
    >
      <div v-if="correct" class="sparkles" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
      </div>

      <header class="relative flex items-center gap-4">
        <span
          class="result-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm"
          :class="correct
            ? 'bg-emerald-500 text-white'
            : 'bg-rose-500 text-white'"
          aria-hidden="true"
        >
          {{ correct ? '✓' : '↗' }}
        </span>
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em]" :class="correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'">
            {{ correct ? 'Discovery recorded' : 'Field note added' }}
          </p>
          <h2 :id="feedbackTitleId" class="mt-1 text-2xl font-black text-gray-900 dark:text-white">
            {{ correct ? 'Perfect choice!' : 'Almost there!' }}
          </h2>
        </div>
      </header>

      <div class="relative mt-6 rounded-xl bg-white/80 p-5 text-center shadow-sm dark:bg-gray-900/60">
        <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Correct spelling
        </p>
        <p :lang="languageCode" class="word-reveal mt-2 text-4xl font-black tracking-wide text-gray-900 dark:text-white">
          {{ wordBefore }}<mark class="rounded-md bg-emerald-200 px-1 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-50">{{ correctChoice }}</mark>{{ wordAfter }}
        </p>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {{ meaning }}
        </p>
      </div>

      <div v-if="!correct" class="relative mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
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

      <div class="relative mt-4 grid gap-3 sm:grid-cols-2">
        <section class="rounded-xl border border-white/70 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Why this character?</h3>
          <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ accentRule }}
          </p>
        </section>

        <section class="rounded-xl border border-white/70 bg-white/70 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Lock it into memory</h3>
          <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <strong :lang="languageCode" class="text-gray-900 dark:text-white">{{ word }}</strong>
            means “{{ meaning }}” in English.
          </p>
        </section>
      </div>

      <button
        type="button"
        class="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        @click="$emit('speak')"
      >
        <span class="speaker-icon" aria-hidden="true">🔊</span>
        Hear {{ languageName }} pronunciation
      </button>
      <p v-if="speechStatus" class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300" role="status">
        {{ speechStatus }}
      </p>
    </article>
  </Transition>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  word: string
  blank: string
  meaning: string
  correctChoice: string
  selectedChoice: string
  correct: boolean
  accentRule: string
  languageCode: string
  languageName: string
  speechStatus: string
}>()

defineEmits<{
  speak: []
}>()

const feedbackTitleId = useId()
const blankIndex = computed(() => props.blank.indexOf('_'))
const wordBefore = computed(() => props.blank.slice(0, blankIndex.value))
const wordAfter = computed(() => props.blank.slice(blankIndex.value + 1))
</script>

<style scoped>
.feedback-card {
  isolation: isolate;
}

.feedback-card::after {
  position: absolute;
  inset: 0.6rem;
  z-index: -1;
  border: 1px dashed currentColor;
  border-radius: 0.8rem;
  content: '';
  opacity: 0.12;
  pointer-events: none;
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

.speaker-icon {
  display: inline-block;
  animation: speaker-pulse 1.8s ease-in-out infinite;
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

@keyframes speaker-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.14); }
}

@media (prefers-reduced-motion: reduce) {
  .feedback-card-correct,
  .feedback-card-incorrect,
  .result-icon,
  .word-reveal mark,
  .sparkles span,
  .speaker-icon {
    animation: none;
  }

  .feedback-enter-active,
  .feedback-leave-active {
    transition: opacity 150ms ease;
  }
}
</style>

<style>
html.dark .answer-chip-wrong {
  background: rgb(136 19 55 / 35%);
  color: rgb(253 164 175);
}

html.dark .answer-chip-correct {
  background: rgb(6 78 59 / 45%);
  color: rgb(110 231 183);
}
</style>
