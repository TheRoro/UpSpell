<template>
  <div class="min-h-screen">
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    <Banner title="UpSpell" sub-title="Learn the spelling. Hear the difference." />

    <!-- Language selector -->
    <div v-if="!selectedLang" class="px-5 py-8 sm:px-10 sm:py-10">
      <section class="daily-intro mx-auto max-w-5xl">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div class="max-w-2xl">
            <p class="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Today’s UpSpell</p>
            <h2 class="mt-2 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
              Choose the language you want to practice.
            </h2>
            <p class="mt-3 text-gray-600 dark:text-gray-300">
              One word completes your daily challenge. Explore more languages only when you feel like it.
            </p>
          </div>

          <div
            class="daily-status-card"
            :class="hasCompletedToday
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
              : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30'"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
              :class="hasCompletedToday
                ? 'bg-emerald-500 text-white'
                : 'bg-blue-500 text-white'"
              aria-hidden="true"
            >
              {{ hasCompletedToday ? '✓' : '✦' }}
            </span>
            <span>
              <strong class="block text-sm font-black text-gray-900 dark:text-white">
                {{ hasCompletedToday ? 'Daily challenge complete' : 'Your daily word is ready' }}
              </strong>
              <small class="mt-1 block text-xs text-gray-600 dark:text-gray-300">
                {{ hasCompletedToday && nextChallengeIn ? `Fresh challenge in ${nextChallengeIn}` : 'Pick any language to begin.' }}
              </small>
            </span>
          </div>
        </div>

        <div v-if="hasCompletedToday" class="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span class="text-lg" aria-hidden="true">🎉</span>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            You showed up today. That counts. Continue for fun or come back for tomorrow’s word.
          </p>
        </div>
      </section>

      <div class="mx-auto mt-10 max-w-5xl">
        <div class="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Language passport</p>
            <h2 class="mt-1 text-2xl font-black text-gray-900 dark:text-white">Choose your next challenge</h2>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Your progress stays on this device.</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DailyLanguageCard
            v-for="(lang, index) in languages"
            :key="lang.code"
            :name="lang.name"
            :english-name="getLanguageMetadata(lang.code).englishName"
            :flag="lang.flag"
            :word-count="lang.words.length"
            :index="index"
            v-bind="getLanguageProgress(lang.code)"
            @select="openLanguage(lang.code)"
          />
        </div>
      </div>

      <nav class="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2" aria-label="UpSpell resources">
        <button
          class="resource-card group border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          @click="navigateTo('/stats')"
        >
          <span class="resource-icon bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300" aria-hidden="true">📊</span>
          <span>
            <strong class="text-gray-900 dark:text-white">Your Stats</strong>
            <small class="text-gray-500 dark:text-gray-400">See accuracy and streaks across every language</small>
          </span>
          <span class="resource-arrow" aria-hidden="true">→</span>
        </button>
        <button
          class="resource-card group border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          @click="navigateTo('/reference')"
        >
          <span class="resource-icon bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300" aria-hidden="true">á</span>
          <span>
            <strong class="text-gray-900 dark:text-white">Character Reference</strong>
            <small class="text-gray-500 dark:text-gray-400">Explore and copy special characters</small>
          </span>
          <span class="resource-arrow" aria-hidden="true">→</span>
        </button>
      </nav>
    </div>

    <!-- Quiz -->
    <div v-else class="px-6 sm:px-10 py-8 max-w-lg mx-auto">
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium mb-6"
        @click="goBack"
      >
        ← Back to languages
      </button>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <!-- Streak -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLangData?.name }} · {{ practiceMode ? 'Practice' : 'Daily word' }}
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
          <p class="text-gray-500 dark:text-gray-400 text-lg italic">{{ todayWord?.meaning }}</p>
        </div>

        <!-- Choices -->
        <div v-if="!answered" class="grid grid-cols-2 gap-3">
          <button
            v-for="choice in shuffledChoices"
            :key="choice"
            class="text-2xl py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                   hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30
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
            class="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl
                   transition-all duration-200 hover:scale-105 shadow-md"
            @click="shareResult"
          >
            {{ shareText }}
          </button>

          <p v-if="!practiceMode" class="text-gray-600 dark:text-gray-300 mt-4">
            Come back tomorrow for a new word!
          </p>

          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <button
              v-if="practiceMode && missedWords.length"
              type="button"
              class="text-sm font-medium text-purple-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-purple-400"
              @click="practiceAnother"
            >
              Practice another missed word
            </button>
            <button
              v-else-if="!practiceMode && missedWords.length"
              type="button"
              class="text-sm font-medium text-purple-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-purple-400"
              @click="startPractice"
            >
              Practice missed words ({{ missedWords.length }})
            </button>
            <p v-else-if="practiceMode" class="text-sm font-medium text-purple-700 dark:text-purple-300">
              You cleared every missed word!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { languages, type Word } from '~/data/words'
import { getLanguageMetadata } from '~/data/languageMetadata'
import {
  addMissedWord,
  getDailyIndex,
  getUtcDayKey,
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
const nextChallengeIn = ref('')
const progressRevision = ref(0)
const progressReady = ref(false)
let countdownTimer: ReturnType<typeof setInterval> | undefined

interface LanguageProgress {
  status: 'play' | 'completed' | 'practice'
  mastery: number
  played: number
  streak: number
  missed: number
}

const currentLangData = computed(() => {
  return languages.find(l => l.code === selectedLang.value)
})

const todayWord = computed(() => {
  if (!currentLangData.value) return null
  if (practiceMode.value) {
    return practiceWord.value
  }
  const idx = getDailyIndex(currentLangData.value.words.length)
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
    : getUtcDayKey()
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
    const playedToday = storageGet(getLastPlayedKey(language.code)) === getUtcDayKey()
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

const hasCompletedToday = computed(() =>
  Object.values(languageProgress.value).some(progress => progress.status !== 'play'),
)

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

function updateCountdown() {
  const now = new Date()
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const remainingMinutes = Math.max(0, Math.ceil((tomorrow - now.getTime()) / 60_000))
  const hours = Math.floor(remainingMinutes / 60)
  const minutes = remainingMinutes % 60
  nextChallengeIn.value = hours ? `${hours}h ${minutes}m` : `${minutes}m`
}

onMounted(() => {
  progressReady.value = true
  progressRevision.value++
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 60_000)
})

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

function getStreakKey(code: string) {
  return `upspell-streak-${code}`
}

function getLastPlayedKey(code: string) {
  return `upspell-lastplayed-${code}`
}

function getStreak(code: string): number {
  if (!import.meta.client) return 0
  return parseStoredCount(storageGet(getStreakKey(code)))
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
  if (lastPlayed === getUtcDayKey()) {
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

  const today = getUtcDayKey()
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

const shareText = ref('📋 Share result')

const langFlags: Record<string, string> = {
  fr: '🇫🇷', es: '🇪🇸', pt: '🇵🇹', it: '🇮🇹', ro: '🇷🇴', de: '🇩🇪',
  ru: '🇷🇺', tr: '🇹🇷', pl: '🇵🇱', cs: '🇨🇿', vi: '🇻🇳', is: '🇮🇸',
}

async function shareResult() {
  const flag = langFlags[selectedLang.value || ''] || '🌍'
  const result = correct.value ? '✅' : '❌'
  const streak = currentStreak.value > 0 ? ` 🔥${currentStreak.value}` : ''
  const label = practiceMode.value ? 'Practice' : getUtcDayKey()
  const text = `UpSpell ${flag} ${label}\n${result}${streak}\nhttps://upspell.vercel.app`

  const copied = await copyText(text)
  shareText.value = copied ? '✓ Copied!' : 'Copy failed'
  announcement.value = copied
    ? 'Result copied to the clipboard.'
    : 'The result could not be copied.'
  setTimeout(() => { shareText.value = '📋 Share result' }, 2000)
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
}

.daily-intro {
  animation: dashboard-arrival 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.daily-status-card {
  display: flex;
  max-width: 20rem;
  align-items: center;
  gap: 0.75rem;
  border-width: 1px;
  border-radius: 1rem;
  padding: 1rem;
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

@keyframes dashboard-arrival {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .daily-intro {
    animation: none;
  }

  .resource-card,
  .resource-arrow {
    transition-duration: 0ms;
  }
}
</style>
