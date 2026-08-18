<template>
  <AtlasPageShell>
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

    <AtlasHero
      title="Explore words through spelling and sound."
      subtitle="Choose a language, discover today’s word, and chart what you learn."
    />

    <AtlasPanel v-if="!selectedLang" class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <section class="relative z-10 mx-auto max-w-5xl">
        <div class="destinations-heading mb-8">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-sky-800 dark:text-[#D1BEA2]">
            Mapped destinations
          </p>
          <h2 class="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
            Choose your next language
          </h2>
          <p class="mt-3 text-stone-600 dark:text-[#D7C3A3]">
            Your discoveries stay on this device.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-x-10">
          <MapDestinationCard
            v-for="(lang, index) in languages"
            :key="lang.code"
            :name="lang.name"
            :english-name="getLanguageMetadata(lang.code).englishName"
            :language-code="lang.code"
            :flag="lang.flag"
            :featured-marks="languageCardDetails[lang.code].featuredMarks"
            :featured-words="languageCardDetails[lang.code].featuredWords"
            :index="index"
            :disabled="Boolean(loadingLanguageCode)"
            :loading="loadingLanguageCode === lang.code"
            v-bind="getLanguageProgress(lang.code)"
            @select="openLanguage(lang.code)"
          />
        </div>
      </section>

      <AtlasResourceNavigation class="relative z-10 mx-auto mt-8 max-w-5xl" />
    </AtlasPanel>

    <DailyChallenge
      v-else-if="todayWord && selectedLang"
      :english-language-name="selectedMetadata.englishName"
      :language-code="selectedLang"
      :practice-mode="practiceMode"
      :current-streak="currentStreak"
      :word="todayWord.word"
      :blank="todayWord.blank"
      :meaning="todayWord.meaning"
      :ipa="todayWord.ipa"
      :ipa-focus="todayWord.ipaFocus"
      :correct-choice="todayWord.choices[0]"
      :word-segments="wordSegments"
      :choices="shuffledChoices"
      :answered="answered"
      :selected-choice="selectedChoice"
      :correct="correct"
      :accent-rule="selectedMetadata.accentRule"
      :active-pronunciation="activePronunciation"
      :share-text="shareText"
      :missed-count="missedWords.length"
      @back="goBack"
      @guess="guess"
      @speak="speakWord"
      @share="shareResult"
      @practice-another="practiceAnother"
      @start-practice="startPractice"
    />
  </AtlasPageShell>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'UpSpell | Daily Language Atlas',
  description: 'Explore words, spelling, and special characters across 12 languages, one daily discovery at a time.',
  path: '/',
})

const {
  activePronunciation,
  announcement,
  answered,
  correct,
  currentLangData,
  currentStreak,
  getLanguageMetadata,
  getLanguageProgress,
  goBack,
  guess,
  languageCardDetails,
  languages,
  loadingLanguageCode,
  missedWords,
  openLanguage,
  practiceAnother,
  practiceMode,
  selectedChoice,
  selectedLang,
  selectedMetadata,
  shareResult,
  shareText,
  shuffledChoices,
  speakWord,
  startPractice,
  todayWord,
  wordSegments,
} = useHomeGame()
</script>

<style scoped>
.destinations-heading {
  position: relative;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 1.25rem;
}

.destinations-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  width: 4.5rem;
  border-radius: 9999px;
  background: var(--atlas-accent-strong);
  content: '';
}
</style>
