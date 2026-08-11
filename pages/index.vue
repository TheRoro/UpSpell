<template>
  <div class="atlas-page min-h-screen">
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

    <header class="atlas-hero">
      <div class="atlas-route-line" aria-hidden="true" />
      <div class="atlas-compass" aria-hidden="true">
        <span>N</span>
        <strong>✦</strong>
      </div>
      <div class="relative mx-auto max-w-5xl px-6 py-10 text-center sm:py-14">
        <p class="text-xs font-black uppercase tracking-[0.28em] text-amber-200">UpSpell Language Atlas</p>
        <h1 class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">Explore words through spelling and sound.</h1>
        <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
          Choose a language, discover today’s word, and chart what you learn.
        </p>
      </div>
    </header>

    <!-- Language map -->
    <main v-if="!selectedLang" class="atlas-map mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <section class="relative z-10 mx-auto max-w-5xl">
        <div class="destinations-heading mb-8">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.24em] text-sky-800 dark:text-[#D1BEA2]">Mapped destinations</p>
            <h2 class="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">Choose your next language</h2>
            <p class="mt-3 text-stone-600 dark:text-[#D7C3A3]">Your discoveries stay on this device.</p>
          </div>
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
            v-bind="getLanguageProgress(lang.code)"
            @select="openLanguage(lang.code)"
          />
        </div>
      </section>

      <nav class="relative z-10 mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2" aria-label="UpSpell resources">
        <button
          class="resource-card group border border-amber-900/20 bg-amber-50/85 dark:border-[#6A4A32] dark:bg-[#38251A]"
          @click="navigateTo('/stats')"
        >
          <span class="resource-icon bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-[#F0E4CF]" aria-hidden="true">⌁</span>
          <span>
            <strong class="text-stone-900 dark:text-white">Stats</strong>
            <small class="text-stone-500 dark:text-[#CDBB9D]">Review accuracy, streaks, and past discoveries</small>
          </span>
          <span class="resource-arrow" aria-hidden="true">→</span>
        </button>
        <button
          class="resource-card group border border-amber-900/20 bg-amber-50/85 dark:border-[#6A4A32] dark:bg-[#38251A]"
          @click="navigateTo('/reference')"
        >
          <span class="resource-icon bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300" aria-hidden="true">á</span>
          <span>
            <strong class="text-stone-900 dark:text-white">Characters</strong>
            <small class="text-stone-500 dark:text-[#CDBB9D]">Study and copy special characters</small>
          </span>
          <span class="resource-arrow" aria-hidden="true">→</span>
        </button>
      </nav>
    </main>

    <!-- Field challenge -->
    <main v-else class="field-sheet mx-auto my-6 max-w-xl px-6 py-8 sm:my-10 sm:px-10">
      <button
        class="relative z-10 mb-6 flex items-center gap-2 font-medium text-stone-600 transition-colors hover:text-sky-800 dark:text-[#E8D8BC] dark:hover:text-[#F0E4CF]"
        @click="goBack"
      >
        ← Back to the map
      </button>

      <div class="field-note-card relative z-10 rounded-2xl border border-amber-900/20 bg-amber-50/90 p-8 shadow-lg dark:border-[#6A4A32] dark:bg-[#38251A]">
        <!-- Streak -->
        <div class="flex justify-between items-center mb-6">
          <span class="entry-label text-sm text-gray-500 dark:text-[#E2C99A]">
            Field note · {{ currentLangData?.name }} · {{ practiceMode ? 'Revisit' : 'Daily word' }}
          </span>
          <span class="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full font-medium">
            🔥 Streak: {{ currentStreak }}
          </span>
        </div>

        <!-- Word display -->
        <div class="text-center mb-8">
          <p class="text-5xl font-bold text-gray-800 dark:text-white tracking-wide mb-4">
            <span v-for="(segment, i) in wordSegments" :key="i">
              <span v-if="segment === '_'" class="inline-block w-8 border-b-4 border-blue-500 dark:border-blue-400 mx-0.5"
                :class="{
                  'answer-letter border-green-500 text-green-600 dark:border-green-400 dark:text-green-400': answered && correct,
                  'answer-letter border-red-500 text-red-600 dark:border-red-400 dark:text-red-400': answered && !correct,
                }"
              >{{ answered ? selectedChoice || todayWord?.choices[0] : '\u00a0' }}</span>
              <span v-else>{{ segment }}</span>
            </span>
          </p>
          <p class="text-gray-500 dark:text-[#D7C3A3] text-lg italic">{{ todayWord?.meaning }}</p>
        </div>

        <!-- Choices -->
        <div v-if="!answered" class="grid grid-cols-2 gap-3">
          <button
            v-for="choice in shuffledChoices"
            :key="choice"
            class="choice-marker rounded-xl border-2 border-solid border-stone-300 bg-white py-4 text-2xl dark:border-[#8B6542] dark:bg-[#4A3122]
                   hover:border-sky-700 dark:hover:border-[#82B8B8] hover:bg-sky-50 dark:hover:bg-[#533A29]
                   transition-all duration-150 font-bold text-gray-800 dark:text-white"
            @click="guess(choice)"
          >
            {{ choice }}
          </button>
        </div>

        <!-- Result -->
        <div v-else class="text-center">
          <AnswerFeedback
            v-if="todayWord"
            :word="todayWord.word"
            :blank="todayWord.blank"
            :meaning="todayWord.meaning"
            :correct-choice="todayWord.choices[0]"
            :selected-choice="selectedChoice"
            :correct="correct"
            :accent-rule="selectedMetadata.accentRule"
            :language-code="selectedLang || 'en'"
            :language-name="selectedMetadata.englishName"
            :speech-status="speechStatus"
            @speak="speakWord"
          />

          <!-- Share button -->
          <button
            class="share-discovery mt-6 rounded-lg px-6 py-3 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6F9692]/40"
            @click="shareResult"
          >
            {{ shareText }}
          </button>

          <p v-if="!practiceMode" class="text-gray-600 dark:text-[#D7C3A3] mt-4">
            Come back tomorrow for a new word!
          </p>

          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <button
              v-if="practiceMode && missedWords.length"
              type="button"
              class="text-sm font-medium text-purple-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-[#D1BEA2]"
              @click="practiceAnother"
            >
              Practice another missed word
            </button>
            <button
              v-else-if="!practiceMode && missedWords.length"
              type="button"
              class="text-sm font-medium text-purple-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-[#D1BEA2]"
              @click="startPractice"
            >
              Practice missed words ({{ missedWords.length }})
            </button>
            <p v-else-if="practiceMode" class="text-sm font-medium text-purple-700 dark:text-[#D1BEA2]">
              You cleared every missed word!
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { languages, type Word } from '~/data/words'
import { getLanguageMetadata } from '~/data/languageMetadata'
import {
  addMissedWord,
  getActiveStreak,
  getDailyIndexForDayKey,
  nextStreak,
  parseStoredCount,
  readMissedWords,
  removeMissedWord,
  shuffleChoices,
} from '~/utils/game'
import { copyText } from '~/utils/clipboard'
import confetti from 'canvas-confetti'

usePageSeo({
  title: 'UpSpell - Daily spelling practice',
  description: 'Practice accented characters and distinctive letters with a free daily word game across 12 languages.',
  path: '/',
})

const selectedLang = ref<string | null>(null)
const answered = ref(false)
const correct = ref(false)
const selectedChoice = ref('')
const currentStreak = ref(0)
const practiceMode = ref(false)
const practiceIndex = ref(0)
const practiceAttempt = ref(0)
const practiceWord = ref<Word | null>(null)
const missedWords = ref<Word[]>([])
const speechStatus = ref('')
const announcement = ref('')
const progressRevision = ref(0)
const progressReady = ref(false)
const currentDayKey = useLocalDayKey()

interface LanguageProgress {
  status: 'play' | 'completed' | 'practice'
  mastery: number
  played: number
  streak: number
  missed: number
}

interface LanguageCardDetails {
  featuredMarks: string[]
  featuredWords: string[]
}

function createLanguageCardDetails(words: Word[]): LanguageCardDetails {
  const featuredMarks = [...new Set(words.map(word => word.choices[0]).filter(Boolean))].slice(0, 3)
  const featuredWords: string[] = []

  for (const mark of featuredMarks) {
    const sample = words.find(word => word.word.includes(mark) && !featuredWords.includes(word.word))
    if (sample) featuredWords.push(sample.word)
  }

  for (const word of words) {
    if (featuredWords.length === 3) break
    if (!featuredWords.includes(word.word)) featuredWords.push(word.word)
  }

  return { featuredMarks, featuredWords }
}

const languageCardDetails: Record<string, LanguageCardDetails> = Object.fromEntries(
  languages.map(language => [language.code, createLanguageCardDetails(language.words)]),
)

const currentLangData = computed(() => {
  return languages.find(l => l.code === selectedLang.value)
})

const todayWord = computed(() => {
  if (!currentLangData.value) return null
  if (practiceMode.value) {
    return practiceWord.value
  }
  const idx = getDailyIndexForDayKey(
    currentLangData.value.words.length,
    currentDayKey.value,
  )
  return currentLangData.value.words[idx]
})

const wordSegments = computed(() => {
  if (!todayWord.value) return []
  return todayWord.value.blank.split(/(_)/)
})

const shuffledChoices = computed(() => {
  if (!todayWord.value || !selectedLang.value) return []
  const mode = practiceMode.value
    ? `practice:${practiceAttempt.value}`
    : currentDayKey.value
  return shuffleChoices(
    todayWord.value.choices,
    `${mode}:${selectedLang.value}:${todayWord.value.word}`,
  )
})

const selectedMetadata = computed(() =>
  getLanguageMetadata(selectedLang.value ?? 'fr'),
)

const languageProgress = computed<Record<string, LanguageProgress>>(() => {
  progressRevision.value
  if (!progressReady.value) {
    return Object.fromEntries(languages.map(language => [language.code, {
      status: 'play',
      mastery: 0,
      played: 0,
      streak: 0,
      missed: 0,
    } satisfies LanguageProgress]))
  }
  return Object.fromEntries(languages.map((language) => {
    const played = parseStoredCount(storageGet(`upspell-played-${language.code}`))
    const won = parseStoredCount(storageGet(`upspell-won-${language.code}`))
    const missed = readMissedWords(storageGet(getMissedKey(language.code))).length
    const playedToday = storageGet(getLastPlayedKey(language.code)) === currentDayKey.value
    const wonToday = storageGet(`upspell-correct-${language.code}`) === '1'
    return [language.code, {
      status: !playedToday ? 'play' : wonToday ? 'completed' : 'practice',
      mastery: played ? Math.round((won / played) * 100) : 0,
      played,
      streak: getStreak(language.code),
      missed,
    }]
  }))
})

function getLanguageProgress(code: string): LanguageProgress {
  return languageProgress.value[code] ?? {
    status: 'play',
    mastery: 0,
    played: 0,
    streak: 0,
    missed: 0,
  }
}

function openLanguage(code: string) {
  const shouldPractice = getLanguageProgress(code).status === 'practice'
  selectLanguage(code)
  if (shouldPractice) startPractice()
}

onMounted(() => {
  progressReady.value = true
  progressRevision.value++
})

watch(currentDayKey, () => {
  progressRevision.value++
  if (selectedLang.value && !practiceMode.value) {
    selectLanguage(selectedLang.value)
  }
})

function getStreakKey(code: string) {
  return `upspell-streak-${code}`
}

function getLastPlayedKey(code: string) {
  return `upspell-lastplayed-${code}`
}

function getStreak(code: string): number {
  if (!import.meta.client) return 0
  return getActiveStreak(
    parseStoredCount(storageGet(getStreakKey(code))),
    storageGet(getLastPlayedKey(code)),
    currentDayKey.value,
  )
}

function selectLanguage(code: string) {
  selectedLang.value = code
  currentStreak.value = getStreak(code)
  practiceMode.value = false
  practiceIndex.value = 0
  practiceAttempt.value = 0
  practiceWord.value = null
  speechStatus.value = ''
  selectedChoice.value = ''
  missedWords.value = readMissedWords(storageGet(getMissedKey(code)))

  const lastPlayed = storageGet(getLastPlayedKey(code))
  if (lastPlayed === currentDayKey.value) {
    answered.value = true
    const savedCorrect = storageGet(`upspell-correct-${code}`)
    correct.value = savedCorrect === '1'
    selectedChoice.value = storageGet(`upspell-choice-${code}`) || (correct.value ? todayWord.value?.choices[0] || '' : '')
  } else {
    answered.value = false
  }
}

function guess(choice: string) {
  if (!todayWord.value || !selectedLang.value) return
  answered.value = true
  selectedChoice.value = choice

  correct.value = choice === todayWord.value.choices[0]
  announcement.value = correct.value
    ? `Correct. The word is ${todayWord.value.word}.`
    : `Incorrect. The correct answer is ${todayWord.value.choices[0]}.`

  if (correct.value) {
    celebrate()
  }

  const code = selectedLang.value
  if (practiceMode.value) {
    if (correct.value) {
      missedWords.value = removeMissedWord(missedWords.value, todayWord.value)
    }
    storageSet(getMissedKey(code), JSON.stringify(missedWords.value))
    return
  }

  const today = currentDayKey.value
  const lastPlayed = storageGet(getLastPlayedKey(code))
  currentStreak.value = nextStreak(
    currentStreak.value,
    lastPlayed,
    today,
    correct.value,
  )
  if (!correct.value) {
    missedWords.value = addMissedWord(missedWords.value, todayWord.value)
    storageSet(getMissedKey(code), JSON.stringify(missedWords.value))
  }

  storageSet(getStreakKey(code), String(currentStreak.value))
  storageSet(getLastPlayedKey(code), today)
  storageSet(`upspell-correct-${code}`, correct.value ? '1' : '0')
  storageSet(`upspell-choice-${code}`, choice)

  const played = parseStoredCount(storageGet(`upspell-played-${code}`)) + 1
  const won = parseStoredCount(storageGet(`upspell-won-${code}`)) + (correct.value ? 1 : 0)
  const bestStreak = Math.max(currentStreak.value, parseStoredCount(storageGet(`upspell-best-${code}`)))
  storageSet(`upspell-played-${code}`, String(played))
  storageSet(`upspell-won-${code}`, String(won))
  storageSet(`upspell-best-${code}`, String(bestStreak))
  progressRevision.value++
}

const shareText = ref('Share result')

const langFlags: Record<string, string> = {
  fr: '🇫🇷', es: '🇪🇸', pt: '🇵🇹', it: '🇮🇹', ro: '🇷🇴', de: '🇩🇪',
  ru: '🇷🇺', tr: '🇹🇷', pl: '🇵🇱', cs: '🇨🇿', vi: '🇻🇳', is: '🇮🇸',
}

async function shareResult() {
  const flag = langFlags[selectedLang.value || ''] || '🌍'
  const result = correct.value ? '✅' : '❌'
  const streak = currentStreak.value > 0 ? ` 🔥${currentStreak.value}` : ''
  const label = practiceMode.value ? 'Practice' : currentDayKey.value
  const text = `UpSpell ${flag} ${label}\n${result}${streak}\nhttps://upspell.vercel.app`

  const copied = await copyText(text)
  shareText.value = copied ? '✓ Copied!' : 'Copy failed'
  announcement.value = copied
    ? 'Result copied to the clipboard.'
    : 'The result could not be copied.'
  setTimeout(() => { shareText.value = 'Share result' }, 2000)
}

function getMissedKey(code: string) {
  return `upspell-missed-${code}`
}

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // The quiz remains usable when storage is disabled or full.
  }
}

function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

function goBack() {
  selectedLang.value = null
  answered.value = false
  practiceMode.value = false
  practiceAttempt.value = 0
  practiceWord.value = null
  speechStatus.value = ''
  selectedChoice.value = ''
  progressRevision.value++
}

function startPractice() {
  if (!missedWords.value.length) return
  practiceMode.value = true
  practiceIndex.value = 0
  practiceAttempt.value = 0
  practiceWord.value = missedWords.value[0] ?? null
  answered.value = false
  speechStatus.value = ''
  selectedChoice.value = ''
}

function practiceAnother() {
  if (!missedWords.value.length) {
    goBack()
    return
  }
  practiceIndex.value = correct.value
    ? practiceIndex.value % missedWords.value.length
    : (practiceIndex.value + 1) % missedWords.value.length
  practiceAttempt.value++
  practiceWord.value = missedWords.value[practiceIndex.value] ?? null
  answered.value = false
  speechStatus.value = ''
  selectedChoice.value = ''
}

function speakWord() {
  if (!todayWord.value || !import.meta.client || !('speechSynthesis' in window)) {
    speechStatus.value = 'Pronunciation is not supported by this browser.'
    announcement.value = speechStatus.value
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(todayWord.value.word)
  utterance.lang = selectedMetadata.value.speechLocale
  utterance.onstart = () => {
    speechStatus.value = `Playing ${selectedMetadata.value.englishName} pronunciation.`
    announcement.value = speechStatus.value
  }
  utterance.onerror = () => {
    speechStatus.value = 'The pronunciation could not be played.'
    announcement.value = speechStatus.value
  }
  speechStatus.value = 'Preparing pronunciation…'
  window.speechSynthesis.speak(utterance)
}
</script>

<style scoped>
.atlas-page {
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

.atlas-hero h1,
.atlas-page h2,
.atlas-page .entry-label,
.atlas-page .resource-card strong {
  font-family: 'Source Serif 4', Georgia, serif;
}

.atlas-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-bottom: 5px double rgb(217 179 106);
  background:
    radial-gradient(ellipse at 20% 15%, rgb(255 239 208 / 10%) 0, transparent 24%),
    radial-gradient(ellipse at 80% 85%, rgb(45 18 9 / 24%) 0, transparent 32%),
    repeating-linear-gradient(18deg, transparent 0 5px, rgb(255 239 208 / 2.2%) 6px, transparent 7px 13px),
    linear-gradient(135deg, rgb(137 75 47), rgb(70 31 21));
  box-shadow: inset 0 -12px 28px rgb(34 14 10 / 22%);
}

.atlas-hero::after {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  border: 1px dashed rgb(232 204 145 / 38%);
  border-radius: 0.4rem;
  content: '';
}

.atlas-route-line {
  position: absolute;
  left: 8%;
  top: 68%;
  width: 84%;
  border-top: 2px dashed rgb(253 230 138 / 22%);
  transform: rotate(-2deg);
}

.atlas-compass {
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

.atlas-compass::before,
.atlas-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.atlas-compass::before {
  height: 120%;
  width: 1px;
}

.atlas-compass::after {
  height: 1px;
  width: 120%;
}

.atlas-compass span {
  position: absolute;
  top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
}

.atlas-compass strong {
  font-size: 1.5rem;
}

.atlas-map,
.field-sheet {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgb(146 64 14 / 30%);
  border-radius: 0.45rem;
  background-color: rgb(243 226 189);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(255 255 255 / 45%), transparent 30%),
    linear-gradient(135deg, rgb(255 245 220), rgb(231 207 161));
  box-shadow:
    0 24px 55px rgb(35 14 8 / 38%),
    inset 0 0 38px rgb(120 53 15 / 12%);
}

.atlas-map::after,
.field-sheet::after {
  position: absolute;
  inset: 0.75rem;
  z-index: 4;
  border: 1px solid rgb(57 75 74 / 22%);
  box-shadow: inset 0 0 0 3px rgb(163 75 60 / 5%);
  content: '';
  pointer-events: none;
}

.field-sheet {
  max-width: 38rem;
}

.destinations-heading {
  position: relative;
  border-bottom: 1px solid rgb(120 53 15 / 20%);
  padding-bottom: 1.25rem;
}

.destinations-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  width: 4.5rem;
  border-radius: 9999px;
  background: rgb(42 103 110);
  content: '';
}

.field-note-card {
  isolation: isolate;
}

.field-note-card::after {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  border: 1px dashed rgb(120 53 15 / 22%);
  border-radius: 0.7rem;
  content: '';
  pointer-events: none;
}

.choice-marker:hover,
.choice-marker:focus-visible {
  transform: translateY(-0.15rem);
}

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

html.dark .share-discovery {
  border-color: rgb(111 150 146 / 70%);
  background: rgb(47 33 25);
  box-shadow:
    3px 5px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 2px rgb(209 190 162 / 5%);
  color: rgb(240 228 207);
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

.passport-cover-stage {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 2rem 1rem;
  perspective: 1400px;
}

.passport-closed-cover {
  position: relative;
  display: flex;
  width: min(23rem, calc(100vw - 2.5rem));
  aspect-ratio: 0.72;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid rgb(205 150 91 / 36%);
  border-radius: 0.75rem 1.25rem 1.25rem 0.75rem;
  background-color: rgb(139 74 47);
  background-image:
    radial-gradient(ellipse at 22% 16%, rgb(255 239 208 / 11%) 0, transparent 25%),
    radial-gradient(ellipse at 82% 88%, rgb(45 18 9 / 28%) 0, transparent 34%),
    radial-gradient(circle at 30% 42%, rgb(54 22 12 / 20%) 0 0.7px, transparent 1px),
    repeating-linear-gradient(20deg, transparent 0 7px, rgb(255 239 208 / 2%) 8px, transparent 9px 16px),
    linear-gradient(135deg, rgb(157 91 56), rgb(102 48 31));
  background-size: auto, auto, 8px 10px, auto, auto;
  box-shadow:
    -0.7rem 0.8rem 0 rgb(61 27 19),
    -1rem 1.2rem 2.5rem rgb(27 10 6 / 55%),
    inset 1rem 0 1.5rem rgb(47 17 9 / 18%),
    inset -0.25rem 0 0.6rem rgb(255 225 177 / 9%);
  transform: rotateY(-3deg) rotateZ(-0.5deg);
}

.passport-closed-cover::before {
  position: absolute;
  inset: 0.8rem;
  border: 1px dashed rgb(235 199 127 / 52%);
  border-radius: 0.35rem 0.75rem 0.75rem 0.35rem;
  content: '';
  pointer-events: none;
}

.passport-closed-cover::after {
  position: absolute;
  inset-block: 0;
  left: 1.15rem;
  width: 2px;
  background: linear-gradient(rgb(255 255 255 / 8%), rgb(44 16 9 / 30%), rgb(255 255 255 / 7%));
  box-shadow: 3px 0 5px rgb(43 15 8 / 18%);
  content: '';
}

.passport-cover-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem 1rem;
  text-align: center;
}

.passport-cover-label {
  color: rgb(242 205 128);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.passport-cover-emblem {
  display: grid;
  height: 7rem;
  width: 7rem;
  margin-top: 2rem;
  place-items: center;
  border: 4px double rgb(224 181 99 / 76%);
  border-radius: 9999px;
  color: rgb(239 201 123);
  box-shadow:
    inset 0 0 0 0.45rem rgb(224 181 99 / 7%),
    0 0 0 0.3rem rgb(224 181 99 / 6%);
}

.passport-cover-emblem span {
  font-family: Georgia, serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.passport-cover-content h1 {
  margin-top: 1.6rem;
  color: rgb(247 216 151);
  font-family: Georgia, serif;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 0 rgb(255 244 210 / 20%), 0 -1px 0 rgb(56 21 11 / 35%);
}

.passport-cover-subtitle {
  margin-top: 0.75rem;
  color: rgb(248 224 177 / 84%);
  font-size: 0.9rem;
  line-height: 1.6;
}

.passport-cover-owner {
  margin-top: 2rem;
  border-top: 1px solid rgb(232 194 119 / 35%);
  padding-top: 0.7rem;
  color: rgb(239 205 139 / 70%);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.open-passport-button {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 2rem 2rem;
  border: 1px solid rgb(255 232 184 / 55%);
  border-radius: 0.5rem;
  background: rgb(244 218 164 / 14%);
  padding: 0.85rem 1rem;
  color: rgb(255 231 180);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background 200ms ease, transform 200ms ease;
}

.open-passport-button:hover {
  background: rgb(244 218 164 / 24%);
  transform: translateY(-0.12rem);
}

.open-passport-button:focus-visible {
  outline: 3px solid rgb(251 191 36 / 65%);
  outline-offset: 3px;
}

.passport-book-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgb(146 64 14 / 20%);
  padding: 0.25rem 0.75rem 1rem;
}

.passport-book-heading p {
  color: rgb(146 64 14 / 70%);
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.passport-book-heading h1 {
  margin-top: 0.15rem;
  color: rgb(67 42 28);
  font-family: Georgia, serif;
  font-size: 1.8rem;
  font-weight: 900;
}

.passport-book-heading span {
  display: block;
  margin-top: 0.15rem;
  color: rgb(107 86 68);
  font-size: 0.75rem;
}

.passport-book-heading button {
  flex-shrink: 0;
  border: 1px dashed rgb(146 64 14 / 38%);
  border-radius: 0.35rem;
  padding: 0.45rem 0.7rem;
  color: rgb(120 53 15);
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(1deg);
}

.passport-book-heading button:hover {
  background: rgb(254 243 199 / 70%);
}

.passport-book-heading-compact {
  align-items: center;
}

.passport-unfold-enter-active,
.passport-unfold-leave-active {
  transition:
    opacity 420ms ease,
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left center;
}

.passport-unfold-enter-from {
  opacity: 0;
  transform: perspective(1400px) rotateY(52deg) scale(0.92);
}

.passport-unfold-leave-to {
  opacity: 0;
  transform: perspective(1400px) rotateY(-65deg) scale(0.9);
}

.passport-page {
  border-right: clamp(0.3rem, 0.8vw, 0.75rem) solid rgb(74 33 23);
  border-left: clamp(0.3rem, 0.8vw, 0.75rem) solid rgb(74 33 23);
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

.passport-spread {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgb(180 83 9 / 28%);
  border-radius: 0.7rem 1.1rem 1.1rem 0.7rem;
  background-color: rgb(243 226 189);
  background-image:
    repeating-radial-gradient(ellipse at 18% 30%, transparent 0 11px, rgb(30 64 175 / 4%) 12px 13px, transparent 14px 25px),
    repeating-radial-gradient(ellipse at 82% 72%, transparent 0 13px, rgb(159 18 57 / 3.5%) 14px 15px, transparent 16px 29px),
    linear-gradient(90deg, rgb(255 245 220), rgb(237 219 179) 49.4%, rgb(201 171 121) 50%, rgb(244 229 194) 50.8%, rgb(255 247 230));
  box-shadow:
    0 24px 55px rgb(35 9 18 / 38%),
    0 4px 0 rgb(218 196 150),
    0 8px 0 rgb(132 88 61),
    inset 0 0 35px rgb(120 53 15 / 8%);
}

.passport-spread::before {
  position: absolute;
  inset-block: 0;
  left: 50%;
  z-index: -1;
  width: 1.4rem;
  background: linear-gradient(90deg, transparent, rgb(92 58 34 / 14%), rgb(255 255 255 / 35%), rgb(92 58 34 / 12%), transparent);
  content: '';
  transform: translateX(-50%);
}

.passport-spread::after {
  position: absolute;
  inset: 0.8rem;
  z-index: 3;
  border: 1px solid rgb(30 64 175 / 16%);
  border-radius: 0.4rem 0.75rem 0.75rem 0.4rem;
  box-shadow: inset 0 0 0 3px rgb(159 18 57 / 4%);
  content: '';
  pointer-events: none;
}

.passport-spread > * {
  position: relative;
  z-index: 1;
}

.passport-game-spread::before {
  opacity: 0.4;
}

.passport-paper {
  position: relative;
  border: 0;
  border-left: 4px double rgb(30 64 175 / 35%);
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 42%);
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgb(120 53 15 / 5%);
}

.passport-quiz-card {
  position: relative;
  isolation: isolate;
}

.passport-quiz-card::after {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  border: 1px dashed rgb(180 83 9 / 20%);
  border-radius: 0.7rem;
  content: '';
  pointer-events: none;
}

.entry-label {
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.choice-stamp:nth-child(odd) {
  transform: rotate(-0.7deg);
}

.choice-stamp:nth-child(even) {
  transform: rotate(0.7deg);
}

.choice-stamp:hover,
.choice-stamp:focus-visible {
  transform: rotate(0deg) translateY(-0.15rem);
}

.share-stamp {
  transform: rotate(-1deg);
}

.answer-letter {
  animation: answer-letter-pop 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
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

@media (prefers-reduced-motion: reduce) {
  .answer-letter {
    animation: none;
  }

  .choice-stamp,
  .share-stamp {
    transform: none;
  }
}

.resource-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: left;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
  transition: transform 250ms ease, box-shadow 250ms ease;
}

.resource-card:hover {
  transform: translateY(-0.2rem);
  box-shadow: 0 12px 24px rgb(15 23 42 / 10%);
}

.resource-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgb(59 130 246 / 35%);
}

.resource-icon {
  display: flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  font-weight: 900;
}

.resource-card strong,
.resource-card small {
  display: block;
}

.resource-card strong {
  font-size: 1rem;
}

.resource-card small {
  margin-top: 0.2rem;
  font-size: 0.75rem;
}

.resource-arrow {
  color: rgb(156 163 175);
  transition: transform 250ms ease;
}

.resource-card:hover .resource-arrow {
  transform: translateX(0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .resource-card,
  .resource-arrow {
    transition-duration: 0ms;
  }

  .passport-unfold-enter-active,
  .passport-unfold-leave-active {
    transition: opacity 150ms ease;
  }
}
</style>

<style>
html.dark .atlas-page {
  background-color: rgb(58 36 26);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(196 154 74 / 4%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 25%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(196 154 74 / 1.5%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(73 45 31), rgb(41 27 21));
  background-size: 8px 10px, 11px 9px, auto, auto;
}

html.dark .atlas-page .atlas-hero {
  background:
    radial-gradient(circle at 50% 125%, rgb(95 143 145 / 24%), transparent 48%),
    linear-gradient(135deg, rgb(35 65 65), rgb(20 42 46));
}

html.dark .atlas-page .atlas-map,
html.dark .atlas-page .field-sheet {
  border-color: rgb(251 191 36 / 18%);
  background-color: rgb(43 27 20);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(139 101 66 / 10%), transparent 30%),
    linear-gradient(135deg, rgb(56 37 26), rgb(43 27 20));
  box-shadow: 0 24px 55px rgb(0 0 0 / 48%), inset 0 0 38px rgb(0 0 0 / 18%);
}

html.dark .atlas-page .destinations-heading {
  border-bottom-color: rgb(196 154 74 / 16%);
}

html.dark .atlas-page .destinations-heading::after {
  background: rgb(209 190 162);
}

html.dark .passport-page {
  border-right-color: rgb(40 17 12);
  border-left-color: rgb(40 17 12);
  background-color: rgb(61 27 19);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(255 255 255 / 3%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 24%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(255 255 255 / 0.8%) 9px, transparent 10px 17px),
    repeating-linear-gradient(94deg, transparent 0 12px, rgb(0 0 0 / 3%) 13px, transparent 14px 23px),
    linear-gradient(135deg, rgb(83 40 26), rgb(42 18 13));
  background-size: 8px 10px, 11px 9px, auto, auto, auto;
}

html.dark .passport-page .passport-paper {
  border-color: rgb(251 191 36 / 16%);
  border-left-color: rgb(96 165 250 / 40%);
  background: rgb(31 41 55 / 72%);
}

html.dark .passport-page .passport-spread {
  border-color: rgb(251 191 36 / 18%);
  background-color: rgb(31 41 55);
  background-image:
    repeating-radial-gradient(ellipse at 18% 30%, transparent 0 11px, rgb(96 165 250 / 4%) 12px 13px, transparent 14px 25px),
    repeating-radial-gradient(ellipse at 82% 72%, transparent 0 13px, rgb(251 113 133 / 3%) 14px 15px, transparent 16px 29px),
    linear-gradient(90deg, rgb(35 45 59), rgb(25 34 47) 49.4%, rgb(13 19 29) 50%, rgb(28 38 51) 50.8%, rgb(36 46 60));
}

@media (max-width: 639px) {
  .atlas-compass {
    left: -2rem;
    opacity: 0.6;
  }

  .atlas-map,
  .field-sheet {
    margin-right: 0.65rem;
    margin-left: 0.65rem;
  }

  .passport-spread {
    margin-right: 0.65rem;
    margin-left: 0.65rem;
    background-image:
      repeating-radial-gradient(ellipse at 18% 30%, transparent 0 11px, rgb(30 64 175 / 4%) 12px 13px, transparent 14px 25px),
      linear-gradient(90deg, rgb(255 245 220), rgb(240 222 185));
  }

  .passport-spread::before {
    display: none;
  }

  html.dark .passport-page .passport-spread {
    background-image:
      repeating-radial-gradient(ellipse at 18% 30%, transparent 0 11px, rgb(96 165 250 / 4%) 12px 13px, transparent 14px 25px),
      linear-gradient(90deg, rgb(35 45 59), rgb(26 35 48));
  }
}
</style>
