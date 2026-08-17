<template>
  <AtlasPanel class="mx-auto my-6 max-w-xl px-6 py-8 sm:my-10 sm:px-10">
    <AtlasNavigation
      class="mb-6"
      back-label="Back to the map"
      label="Challenge navigation"
      @back="$emit('back')"
    />

    <div class="field-note-card relative rounded-2xl border p-8">
      <div class="mb-6 flex items-center justify-between">
        <span class="entry-label text-sm">
          Field note · {{ languageName }} · {{ practiceMode ? 'Revisit' : 'Daily word' }}
        </span>
        <span class="streak-label rounded-full px-3 py-1 text-sm font-medium">
          🔥 Streak: {{ currentStreak }}
        </span>
      </div>

      <div class="mb-8 text-center">
        <p class="mb-4 text-5xl font-bold tracking-wide text-gray-800 dark:text-white">
          <span v-for="(segment, index) in wordSegments" :key="index">
            <span
              v-if="segment === '_'"
              class="answer-slot mx-0.5 inline-block w-8 border-b-4"
              :class="{
                'answer-letter answer-letter-correct': answered && correct,
                'answer-letter answer-letter-incorrect': answered && !correct,
              }"
            >{{ answered ? selectedChoice || correctChoice : '\u00a0' }}</span>
            <span v-else>{{ segment }}</span>
          </span>
        </p>
        <p class="text-lg italic text-gray-500 dark:text-[#D7C3A3]">{{ meaning }}</p>
      </div>

      <div v-if="!answered" class="grid grid-cols-2 gap-3">
        <button
          v-for="choice in choices"
          :key="choice"
          class="choice-marker rounded-xl border-2 border-solid py-4 text-2xl font-bold"
          @click="$emit('guess', choice)"
        >
          {{ choice }}
        </button>
      </div>

      <ChallengeResult
        v-else
        :word="word"
        :blank="blank"
        :meaning="meaning"
        :ipa="ipa"
        :ipa-focus="ipaFocus"
        :correct-choice="correctChoice"
        :selected-choice="selectedChoice"
        :correct="correct"
        :accent-rule="accentRule"
        :language-code="languageCode"
        :language-name="englishLanguageName"
        :speech-status="speechStatus"
        :share-text="shareText"
        :practice-mode="practiceMode"
        :missed-count="missedCount"
        @speak="$emit('speak')"
        @share="$emit('share')"
        @practice-another="$emit('practice-another')"
        @start-practice="$emit('start-practice')"
      />
    </div>
  </AtlasPanel>
</template>

<script setup lang="ts">
import type { IpaFocusRange } from '~/data/words'

defineProps<{
  languageName: string
  englishLanguageName: string
  languageCode: string
  practiceMode: boolean
  currentStreak: number
  word: string
  blank: string
  meaning: string
  ipa: string
  ipaFocus: IpaFocusRange[]
  correctChoice: string
  wordSegments: string[]
  choices: string[]
  answered: boolean
  selectedChoice: string
  correct: boolean
  accentRule: string
  speechStatus: string
  shareText: string
  missedCount: number
}>()

defineEmits<{
  back: []
  guess: [choice: string]
  speak: []
  share: []
  'practice-another': []
  'start-practice': []
}>()
</script>

<style scoped>
.field-note-card {
  isolation: isolate;
  border-color: var(--atlas-card-border);
  background: var(--atlas-card);
  box-shadow: var(--atlas-card-shadow);
}

.field-note-card::after {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  border: 1px dashed var(--atlas-panel-inner-border);
  border-radius: 0.7rem;
  content: '';
  pointer-events: none;
}

.entry-label {
  color: var(--atlas-muted);
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.streak-label {
  background: rgb(254 249 195);
  color: rgb(161 98 7);
}

.answer-slot {
  border-color: var(--atlas-accent);
}

.answer-letter-correct {
  border-color: rgb(34 197 94);
  color: rgb(22 163 74);
}

.answer-letter-incorrect {
  border-color: rgb(239 68 68);
  color: rgb(220 38 38);
}

.choice-marker {
  border-color: rgb(214 211 209);
  background: rgb(255 251 235);
  color: rgb(31 41 55);
  transition: background-color 150ms ease, border-color 150ms ease, transform 150ms ease;
}

.choice-marker:hover,
.choice-marker:focus-visible {
  border-color: var(--atlas-accent-strong);
  background: rgb(240 253 250);
  transform: translateY(-0.15rem);
}

.answer-letter {
  animation: answer-letter-pop 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

html.dark .streak-label {
  background: rgb(113 63 18);
  color: rgb(253 224 71);
}

html.dark .choice-marker {
  border-color: rgb(139 101 66);
  background: rgb(74 49 34);
  color: rgb(255 255 255);
}

html.dark .choice-marker:hover,
html.dark .choice-marker:focus-visible {
  border-color: rgb(130 184 184);
  background: rgb(83 58 41);
}

@keyframes answer-letter-pop {
  0% {
    opacity: 0;
    transform: translateY(-0.75rem) scale(1.5);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 520px) {
  .field-note-card {
    padding: 1.35rem;
  }

  .field-note-card > div:first-child {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .answer-letter {
    animation: none;
  }

  .choice-marker {
    transition: none;
  }

  .choice-marker:hover,
  .choice-marker:focus-visible {
    transform: none;
  }
}
</style>
