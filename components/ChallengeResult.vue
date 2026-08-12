<template>
  <div class="text-center">
    <AnswerFeedback
      :word="word"
      :blank="blank"
      :meaning="meaning"
      :correct-choice="correctChoice"
      :selected-choice="selectedChoice"
      :correct="correct"
      :accent-rule="accentRule"
      :language-code="languageCode"
      :language-name="languageName"
      :speech-status="speechStatus"
      @speak="$emit('speak')"
    />

    <button
      class="share-discovery mt-6 rounded-lg px-6 py-3 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6F9692]/40"
      @click="$emit('share')"
    >
      {{ shareText }}
    </button>

    <p v-if="!practiceMode" class="mt-4 text-gray-600 dark:text-[#D7C3A3]">
      Come back tomorrow for a new word!
    </p>

    <div class="mt-6 flex flex-wrap justify-center gap-4">
      <button
        v-if="practiceMode && missedCount"
        type="button"
        class="practice-action"
        @click="$emit('practice-another')"
      >
        Practice another missed word
      </button>
      <button
        v-else-if="!practiceMode && missedCount"
        type="button"
        class="practice-action"
        @click="$emit('start-practice')"
      >
        Practice missed words ({{ missedCount }})
      </button>
      <p v-else-if="practiceMode" class="practice-complete">
        You cleared every missed word!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
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
  shareText: string
  practiceMode: boolean
  missedCount: number
}>()

defineEmits<{
  speak: []
  share: []
  'practice-another': []
  'start-practice': []
}>()
</script>

<style scoped>
.share-discovery {
  border: 1px solid rgb(53 110 105 / 72%);
  background: rgb(238 224 193);
  box-shadow:
    3px 5px 0 rgb(120 53 15 / 13%),
    inset 0 0 0 2px rgb(255 255 255 / 26%);
  color: rgb(36 78 77);
  transition: background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.share-discovery:hover {
  background: rgb(230 213 178);
  box-shadow:
    4px 6px 0 rgb(120 53 15 / 16%),
    inset 0 0 0 2px rgb(255 255 255 / 26%);
  transform: translateY(-0.12rem);
}

.practice-action,
.practice-complete {
  color: var(--atlas-accent-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.practice-action:hover {
  text-decoration: underline;
}

.practice-action:focus-visible {
  border-radius: 0.25rem;
  outline: 2px solid var(--atlas-focus);
  outline-offset: 3px;
}

html.dark .share-discovery {
  border-color: rgb(111 150 146 / 70%);
  background: var(--atlas-flag-background);
  box-shadow:
    3px 5px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 2px rgb(209 190 162 / 5%);
  color: var(--atlas-accent-text);
}

html.dark .share-discovery:hover {
  background: rgb(58 42 31);
  box-shadow:
    4px 6px 0 rgb(0 0 0 / 28%),
    inset 0 0 0 2px rgb(209 190 162 / 5%);
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
