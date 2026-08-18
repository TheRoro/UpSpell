import confetti from 'canvas-confetti'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getLanguageMetadata } from '~/data/languageMetadata'
import {
  languages,
  loadLanguageWords,
  type LanguageWords,
  type Word,
} from '~/data/words'
import { copyText } from '~/utils/clipboard'
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
import {
  getPronunciationPlayback,
  type PronunciationMode,
} from '~/utils/pronunciation'

interface LanguageProgress {
  status: 'play' | 'completed' | 'practice'
  mastery: number
  played: number
  streak: number
  missed: number
}

const langFlags: Record<string, string> = {
  fr: '🇫🇷',
  es: '🇪🇸',
  pt: '🇵🇹',
  it: '🇮🇹',
  ro: '🇷🇴',
  de: '🇩🇪',
  ru: '🇷🇺',
  tr: '🇹🇷',
  pl: '🇵🇱',
  cs: '🇨🇿',
  vi: '🇻🇳',
  is: '🇮🇸',
}

const languageCardDetails = Object.fromEntries(
  languages.map(language => [language.code, {
    featuredMarks: language.featuredMarks.slice(0, 3),
    featuredWords: language.featuredWords,
  }]),
)

export function useHomeGame() {
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
  const activePronunciation = ref<PronunciationMode | null>(null)
  const announcement = ref('')
  const shareText = ref('Share result')
  const progressRevision = ref(0)
  const progressReady = ref(false)
  const loadingLanguageCode = ref<string | null>(null)
  const currentLangData = ref<LanguageWords | null>(null)
  const currentDayKey = useLocalDayKey()
  let languageRequest = 0
  let speechRequest = 0
  let shareResetTimer: ReturnType<typeof setTimeout> | undefined

  const todayWord = computed(() => {
    if (!currentLangData.value) return null
    if (practiceMode.value) return practiceWord.value

    const index = getDailyIndexForDayKey(
      currentLangData.value.words.length,
      currentDayKey.value,
    )
    return currentLangData.value.words[index]
  })

  const wordSegments = computed(() => todayWord.value?.blank.split(/(_)/) ?? [])

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
      return Object.fromEntries(languages.map(language => [language.code, emptyProgress()]))
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

  function emptyProgress(): LanguageProgress {
    return {
      status: 'play',
      mastery: 0,
      played: 0,
      streak: 0,
      missed: 0,
    }
  }

  function getLanguageProgress(code: string): LanguageProgress {
    return languageProgress.value[code] ?? emptyProgress()
  }

  function getStreakKey(code: string) {
    return `upspell-streak-${code}`
  }

  function getLastPlayedKey(code: string) {
    return `upspell-lastplayed-${code}`
  }

  function getMissedKey(code: string) {
    return `upspell-missed-${code}`
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
    cancelPronunciation()
    selectedLang.value = code
    currentStreak.value = getStreak(code)
    practiceMode.value = false
    practiceIndex.value = 0
    practiceAttempt.value = 0
    practiceWord.value = null
    selectedChoice.value = ''
    const storedMissedWords = readMissedWords(storageGet(getMissedKey(code)))
    missedWords.value = storedMissedWords.flatMap((storedWord) => {
      const currentWord = currentLangData.value?.words.find(
        word => word.word === storedWord.word,
      )
      return currentWord ? [currentWord] : []
    })

    if (storageGet(getLastPlayedKey(code)) === currentDayKey.value) {
      answered.value = true
      correct.value = storageGet(`upspell-correct-${code}`) === '1'
      selectedChoice.value = storageGet(`upspell-choice-${code}`)
        || (correct.value ? todayWord.value?.choices[0] || '' : '')
    } else {
      answered.value = false
    }
  }

  async function openLanguage(code: string) {
    const request = ++languageRequest
    loadingLanguageCode.value = code
    announcement.value = `Loading ${getLanguageMetadata(code).englishName} challenge.`

    try {
      const language = await loadLanguageWords(code)
      if (request !== languageRequest) return

      currentLangData.value = language
      const shouldPractice = getLanguageProgress(code).status === 'practice'
      selectLanguage(code)
      if (shouldPractice) startPractice()
    } catch {
      if (request !== languageRequest) return
      announcement.value = 'The language challenge could not be loaded. Please try again.'
    } finally {
      if (request === languageRequest) loadingLanguageCode.value = null
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

    if (correct.value) celebrate()

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
    const bestStreak = Math.max(
      currentStreak.value,
      parseStoredCount(storageGet(`upspell-best-${code}`)),
    )
    storageSet(`upspell-played-${code}`, String(played))
    storageSet(`upspell-won-${code}`, String(won))
    storageSet(`upspell-best-${code}`, String(bestStreak))
    progressRevision.value++
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
    if (shareResetTimer) clearTimeout(shareResetTimer)
    shareResetTimer = setTimeout(() => {
      shareText.value = 'Share result'
    }, 2000)
  }

  function goBack() {
    cancelPronunciation()
    languageRequest++
    loadingLanguageCode.value = null
    selectedLang.value = null
    currentLangData.value = null
    answered.value = false
    practiceMode.value = false
    practiceAttempt.value = 0
    practiceWord.value = null
    selectedChoice.value = ''
    progressRevision.value++
  }

  function startPractice() {
    if (!missedWords.value.length) return
    cancelPronunciation()
    practiceMode.value = true
    practiceIndex.value = 0
    practiceAttempt.value = 0
    practiceWord.value = missedWords.value[0] ?? null
    answered.value = false
    selectedChoice.value = ''
  }

  function practiceAnother() {
    if (!missedWords.value.length) {
      goBack()
      return
    }
    cancelPronunciation()
    practiceIndex.value = correct.value
      ? practiceIndex.value % missedWords.value.length
      : (practiceIndex.value + 1) % missedWords.value.length
    practiceAttempt.value++
    practiceWord.value = missedWords.value[practiceIndex.value] ?? null
    answered.value = false
    selectedChoice.value = ''
  }

  function cancelPronunciation() {
    speechRequest++
    activePronunciation.value = null
    if (import.meta.client && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  function speakWord(mode: PronunciationMode = 'word') {
    if (!todayWord.value || !import.meta.client || !('speechSynthesis' in window)) {
      announcement.value = 'Pronunciation is not supported by this browser.'
      return
    }

    cancelPronunciation()
    const request = speechRequest
    const word = todayWord.value
    const metadata = selectedMetadata.value
    const playback = getPronunciationPlayback(
      word.word,
      metadata.englishName,
      mode,
    )
    const utterance = new SpeechSynthesisUtterance(playback.text)
    const locale = metadata.speechLocale.toLowerCase()
    const language = locale.split('-')[0]
    const voices = window.speechSynthesis.getVoices()
    utterance.voice = voices.find(voice => voice.lang.toLowerCase() === locale)
      ?? voices.find(voice => voice.lang.toLowerCase().split('-')[0] === language)
      ?? null
    utterance.lang = metadata.speechLocale
    utterance.rate = playback.rate
    utterance.onstart = () => {
      if (request !== speechRequest) return
      activePronunciation.value = mode
      announcement.value = playback.playingStatus
    }
    utterance.onend = () => {
      if (request !== speechRequest) return
      activePronunciation.value = null
      announcement.value = playback.finishedStatus
    }
    utterance.onerror = (event) => {
      if (request !== speechRequest || event.error === 'canceled') return
      activePronunciation.value = null
      announcement.value = 'The pronunciation could not be played.'
    }
    activePronunciation.value = mode
    announcement.value = playback.preparingStatus
    window.speechSynthesis.speak(utterance)
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

  onMounted(() => {
    progressReady.value = true
    progressRevision.value++
  })

  onBeforeUnmount(() => {
    if (shareResetTimer) clearTimeout(shareResetTimer)
    cancelPronunciation()
  })

  watch(currentDayKey, () => {
    progressRevision.value++
    if (selectedLang.value && !practiceMode.value) {
      selectLanguage(selectedLang.value)
    }
  })

  return {
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
  }
}
