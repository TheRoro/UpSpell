<template>
  <AtlasPanel
    class="challenge-shell mx-auto my-6 px-4 py-6 sm:my-10 sm:px-8 lg:px-10"
    :class="answered ? 'max-w-5xl' : 'max-w-xl'"
  >
    <div class="challenge-toolbar mb-6">
      <AtlasNavigation
        class="min-w-0 flex-1"
        back-label="Back to challenges"
        label="Challenge navigation"
        @back="$emit('back')"
      />
      <span class="streak-label rounded-full px-3 py-1 text-sm font-medium">
        🔥 Streak: {{ currentStreak }}
      </span>
    </div>

    <div class="challenge-content">
      <div v-if="!answered" class="mb-8 text-center">
        <p class="mb-4 text-5xl font-bold tracking-wide text-gray-800 dark:text-white">
          <span v-for="(segment, index) in wordSegments" :key="index">
            <span
              v-if="segment === '_'"
              class="answer-slot mx-0.5 inline-block w-8 border-b-4"
            >{{ '\u00a0' }}</span>
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
        :active-pronunciation="activePronunciation"
        :share-text="shareText"
        :practice-mode="practiceMode"
        :missed-count="missedCount"
        @speak="mode => $emit('speak', mode)"
        @share="$emit('share')"
        @practice-another="$emit('practice-another')"
        @start-practice="$emit('start-practice')"
      />
    </div>
  </AtlasPanel>
</template>

<script setup lang="ts">
import type { IpaFocusRange } from '~/data/words'
import type { PronunciationMode } from '~/utils/pronunciation'

defineProps<{
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
  activePronunciation: PronunciationMode | null
  shareText: string
  missedCount: number
}>()

defineEmits<{
  back: []
  guess: [choice: string]
  speak: [mode: PronunciationMode]
  share: []
  'practice-another': []
  'start-practice': []
}>()
</script>

<style scoped>
.challenge-shell {
  transition: max-width 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.challenge-content {
  padding: 0.25rem;
}

.challenge-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.streak-label {
  background: rgb(254 249 195);
  color: rgb(161 98 7);
}

.answer-slot {
  border-color: var(--atlas-accent);
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

@media (max-width: 520px) {
  .challenge-toolbar {
    align-items: flex-start;
  }

  .challenge-content {
    padding: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .challenge-shell {
    transition: none;
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
