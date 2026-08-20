<template>
  <AtlasPageShell :language-code="selectedLang">
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

    <AtlasHero
      eyebrow="12 languages, one daily challenge"
      title="Daily Spelling Challenge"
      subtitle="Choose a language, solve today’s word, and explore how it sounds and is written."
    />

    <AtlasPanel v-if="!selectedLang" class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <AtlasPanelBody>
        <AtlasCarouselNavigation
          class="mb-8"
          current-section="challenge"
        />

        <section aria-labelledby="challenge-languages">
          <AtlasSectionHeader
            class="mb-8"
            heading-id="challenge-languages"
            eyebrow="Daily language challenge"
            title="Choose a language to begin"
            description="Solve today’s word, then explore its pronunciation, vowels, and characters."
          />

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
      </AtlasPanelBody>
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
  title: 'UpSpell | Daily Spelling Challenge',
  description: 'Complete a daily spelling challenge and explore pronunciation, vowels, and special characters across 12 languages.',
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
