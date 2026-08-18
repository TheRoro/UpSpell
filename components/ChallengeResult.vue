<template>
  <div class="text-center">
    <AnswerFeedback
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
      :language-name="languageName"
      :active-pronunciation="activePronunciation"
      @speak="mode => $emit('speak', mode)"
    />

    <footer class="result-action-buttons mt-5">
      <button
        class="share-discovery rounded-lg px-5 py-3 font-bold"
        @click="$emit('share')"
      >
        {{ shareText }}
      </button>
      <button
        v-if="practiceMode && missedCount"
        type="button"
        class="practice-action"
        @click="$emit('practice-another')"
      >
        Practice another
      </button>
      <button
        v-else-if="!practiceMode && missedCount"
        type="button"
        class="practice-action"
        @click="$emit('start-practice')"
      >
        Practice missed words ({{ missedCount }})
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { IpaFocusRange } from '~/data/words'
import type { PronunciationMode } from '~/utils/pronunciation'

defineProps<{
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
  shareText: string
  practiceMode: boolean
  missedCount: number
}>()

defineEmits<{
  speak: [mode: PronunciationMode]
  share: []
  'practice-another': []
  'start-practice': []
}>()
</script>

<style scoped>
.result-action-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
}

.share-discovery {
  border: 1px solid rgb(113 56 31 / 88%);
  background: rgb(145 76 43);
  box-shadow:
    3px 5px 0 rgb(94 44 22 / 20%),
    inset 0 0 0 1px rgb(255 255 255 / 20%);
  color: rgb(255 248 232);
  transition: background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.share-discovery:hover {
  background: rgb(124 62 34);
  box-shadow:
    4px 6px 0 rgb(94 44 22 / 24%),
    inset 0 0 0 1px rgb(255 255 255 / 20%);
  transform: translateY(-0.12rem);
}

.share-discovery:focus-visible {
  outline: 3px solid rgb(185 111 63 / 48%);
  outline-offset: 3px;
}

.practice-action,
.practice-complete {
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.5rem;
  background: var(--atlas-flag-background);
  padding: 0.7rem 1rem;
  color: var(--atlas-accent-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.practice-action:hover {
  border-color: var(--atlas-accent-strong);
  background: rgb(111 150 146 / 13%);
}

.practice-action:focus-visible {
  border-radius: 0.25rem;
  outline: 2px solid var(--atlas-focus);
  outline-offset: 3px;
}

html.dark .share-discovery {
  border-color: rgb(225 166 105 / 78%);
  background: rgb(176 104 57);
  box-shadow:
    3px 5px 0 rgb(0 0 0 / 28%),
    inset 0 0 0 1px rgb(255 244 224 / 18%);
  color: rgb(255 248 232);
}

html.dark .share-discovery:hover {
  background: rgb(198 123 72);
  box-shadow:
    4px 6px 0 rgb(0 0 0 / 32%),
    inset 0 0 0 1px rgb(255 244 224 / 20%);
}

@media (prefers-reduced-motion: reduce) {
  .share-discovery {
    transition: none;
  }

  .share-discovery:hover {
    transform: none;
  }
}
</style>
