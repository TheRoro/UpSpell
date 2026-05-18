<template>
  <div class="min-h-screen">
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    <Banner title="UpSpell" sub-title="Daily accent challenge. New words at 00:00 UTC." />

    <!-- Language selector -->
    <div v-if="!selectedLang" class="px-6 sm:px-10 py-8">
      <h2 class="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">Choose a language</h2>
      <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
          @click="selectLanguage(lang.code)"
        >
          <img :src="lang.flag" :alt="lang.name" class="w-12 h-8 rounded object-cover" />
          <span class="font-semibold text-lg text-gray-800 dark:text-white">{{ lang.name }}</span>
          <span v-if="getStreak(lang.code) > 0" class="ml-auto text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
            🔥 {{ getStreak(lang.code) }}
          </span>
        </button>
      </div>

      <!-- Link to reference -->
      <div class="text-center mt-8">
        <button
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors underline"
          @click="navigateTo('/reference')"
        >
          📋 Character Reference · copy special characters
        </button>
        <span class="text-gray-300 dark:text-gray-600 mx-2">|</span>
        <button
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors underline"
          @click="navigateTo('/stats')"
        >
          📊 Stats
        </button>
      </div>
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
                :class="{ 'border-green-500 dark:border-green-400': answered && correct, 'border-red-500 dark:border-red-400': answered && !correct }"
              >&nbsp;</span>
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
          <div class="mb-4">
            <span v-if="correct" class="text-6xl">✅</span>
            <span v-else class="text-6xl">❌</span>
          </div>
          <p class="text-3xl font-bold mb-2" :class="correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ todayWord?.word }}
          </p>
          <p v-if="!correct" class="text-gray-500 dark:text-gray-400 mb-4">
            The correct answer was <strong class="text-gray-800 dark:text-white">{{ todayWord?.choices[0] }}</strong>
          </p>

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

          <div class="mt-6 rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-left dark:border-purple-900/50 dark:bg-purple-950/20">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="font-semibold text-gray-900 dark:text-white">Learn from this word</h3>
              <button
                type="button"
                class="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-gray-800 dark:text-purple-300"
                @click="speakWord"
              >
                Hear pronunciation
              </button>
            </div>
            <p class="mt-3 text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">Spelling tip:</span> {{ selectedMetadata.accentRule }}
            </p>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">In context:</span> {{ todayWord?.word }} — {{ todayWord?.meaning }}
            </p>
            <ul class="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li v-for="choice in shuffledChoices" :key="choice">
                <span class="font-mono font-semibold">{{ choice }}</span>:
                {{ choice === todayWord?.choices[0] ? 'completes the standard spelling' : 'would produce a different spelling' }}.
              </li>
            </ul>
            <p v-if="speechStatus" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {{ speechStatus }}
            </p>
          </div>

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
import { ref, computed } from 'vue'
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
const currentStreak = ref(0)
const practiceMode = ref(false)
const practiceIndex = ref(0)
const practiceAttempt = ref(0)
const practiceWord = ref<Word | null>(null)
const missedWords = ref<Word[]>([])
const speechStatus = ref('')
const announcement = ref('')

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
  missedWords.value = readMissedWords(storageGet(getMissedKey(code)))

  const lastPlayed = storageGet(getLastPlayedKey(code))
  if (lastPlayed === getUtcDayKey()) {
    answered.value = true
    const savedCorrect = storageGet(`upspell-correct-${code}`)
    correct.value = savedCorrect === '1'
  } else {
    answered.value = false
  }
}

function guess(choice: string) {
  if (!todayWord.value || !selectedLang.value) return
  answered.value = true

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

  const played = parseStoredCount(storageGet(`upspell-played-${code}`)) + 1
  const won = parseStoredCount(storageGet(`upspell-won-${code}`)) + (correct.value ? 1 : 0)
  const bestStreak = Math.max(currentStreak.value, parseStoredCount(storageGet(`upspell-best-${code}`)))
  storageSet(`upspell-played-${code}`, String(played))
  storageSet(`upspell-won-${code}`, String(won))
  storageSet(`upspell-best-${code}`, String(bestStreak))
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
}

function startPractice() {
  if (!missedWords.value.length) return
  practiceMode.value = true
  practiceIndex.value = 0
  practiceAttempt.value = 0
  practiceWord.value = missedWords.value[0] ?? null
  answered.value = false
  speechStatus.value = ''
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
