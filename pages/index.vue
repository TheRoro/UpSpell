<template>
  <div class="min-h-screen">
    <Banner title="UpSpell" sub-title="Daily accent challenge. Pick the right character!" />

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
        @click="selectedLang = null; answered = false"
      >
        ← Back to languages
      </button>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <!-- Streak -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ currentLangData?.name }}
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

          <p class="text-gray-600 dark:text-gray-300 mt-4">
            Come back tomorrow for a new word!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { languages } from '~/data/words'
import confetti from 'canvas-confetti'

useHead({
  title: 'UpSpell',
  meta: [
    { name: 'description', content: 'Daily accent quiz — pick the right special character for 11 languages!' },
  ],
})

const selectedLang = ref<string | null>(null)
const answered = ref(false)
const correct = ref(false)
const currentStreak = ref(0)

function getTodayIndex(wordCount: number): number {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  return dayOfYear % wordCount
}

const currentLangData = computed(() => {
  return languages.find(l => l.code === selectedLang.value)
})

const todayWord = computed(() => {
  if (!currentLangData.value) return null
  const idx = getTodayIndex(currentLangData.value.words.length)
  return currentLangData.value.words[idx]
})

const wordSegments = computed(() => {
  if (!todayWord.value) return []
  return todayWord.value.blank.split(/(_)/)
})

const shuffledChoices = computed(() => {
  if (!todayWord.value) return []
  const choices = [...todayWord.value.choices]
  const seed = getTodayIndex(1000)
  for (let i = choices.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) + 7) % (i + 1)
    ;[choices[i], choices[j]] = [choices[j], choices[i]]
  }
  return choices
})

function getStreakKey(code: string) {
  return `upspell-streak-${code}`
}

function getLastPlayedKey(code: string) {
  return `upspell-lastplayed-${code}`
}

function getStreak(code: string): number {
  if (!import.meta.client) return 0
  return parseInt(localStorage.getItem(getStreakKey(code)) || '0')
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function selectLanguage(code: string) {
  selectedLang.value = code
  currentStreak.value = getStreak(code)

  const lastPlayed = localStorage.getItem(getLastPlayedKey(code))
  if (lastPlayed === getTodayStr()) {
    answered.value = true
    const savedCorrect = localStorage.getItem(`upspell-correct-${code}`)
    correct.value = savedCorrect === '1'
  } else {
    answered.value = false
  }
}

function guess(choice: string) {
  if (!todayWord.value || !selectedLang.value) return
  answered.value = true

  correct.value = choice === todayWord.value.choices[0]

  if (correct.value) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const code = selectedLang.value
  const today = getTodayStr()

  if (correct.value) {
    const lastPlayed = localStorage.getItem(getLastPlayedKey(code))
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (lastPlayed === yesterday) {
      currentStreak.value++
    } else if (lastPlayed !== today) {
      currentStreak.value = 1
    }
  } else {
    currentStreak.value = 0
  }

  localStorage.setItem(getStreakKey(code), String(currentStreak.value))
  localStorage.setItem(getLastPlayedKey(code), today)
  localStorage.setItem(`upspell-correct-${code}`, correct.value ? '1' : '0')

  // Track stats
  const played = parseInt(localStorage.getItem(`upspell-played-${code}`) || '0') + 1
  const won = parseInt(localStorage.getItem(`upspell-won-${code}`) || '0') + (correct.value ? 1 : 0)
  const bestStreak = Math.max(currentStreak.value, parseInt(localStorage.getItem(`upspell-best-${code}`) || '0'))
  localStorage.setItem(`upspell-played-${code}`, String(played))
  localStorage.setItem(`upspell-won-${code}`, String(won))
  localStorage.setItem(`upspell-best-${code}`, String(bestStreak))
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
  const dayNum = getTodayIndex(365)
  const text = `UpSpell ${flag} Day ${dayNum}\n${result}${streak}\nupspell.vercel.app`

  await navigator.clipboard.writeText(text)
  shareText.value = '✓ Copied!'
  setTimeout(() => { shareText.value = '📋 Share result' }, 2000)
}
</script>
