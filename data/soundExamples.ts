import { getIpaSoundProfile } from './characterProfiles'
import { getLanguageMetadata } from './languageMetadata'
import {
  loadLanguageWords,
  type LanguageWords,
  type Word,
} from './words'

export interface SoundExample {
  key: string
  word: string
  meaning: string
  ipa: string
  languageCode: string
  languageName: string
  speechLocale: string
  spelling?: string
}

const languageWords = new Map<string, Promise<LanguageWords>>()

const curatedExamples: Record<string, Record<string, {
  word: string
  meaning: string
  ipa: string
  spelling: string
}>> = {
  cs: {
    'ɛ': {
      word: 'meč',
      meaning: 'sword',
      ipa: 'mɛtʃ',
      spelling: 'e',
    },
    'ɛː': {
      word: 'péče',
      meaning: 'care',
      ipa: 'ˈpɛːtʃɛ',
      spelling: 'é',
    },
  },
  pt: {
    'ĩ': {
      word: 'fim',
      meaning: 'end',
      ipa: 'fĩ',
      spelling: 'im',
    },
    'ẽ': {
      word: 'gente',
      meaning: 'people',
      ipa: 'ˈʒẽtɨ',
      spelling: 'en',
    },
  },
  ru: {
    'e': {
      word: 'день',
      meaning: 'day',
      ipa: 'dʲenʲ',
      spelling: 'е',
    },
    'ɨ': {
      word: 'мы',
      meaning: 'we',
      ipa: 'mɨ',
      spelling: 'ы',
    },
  },
}

function loadWords(languageCode: string) {
  const existing = languageWords.get(languageCode)
  if (existing) return existing

  const request = loadLanguageWords(languageCode)
  languageWords.set(languageCode, request)
  return request
}

function getFocusedSound(word: Word): string {
  return word.ipaFocus
    .map(([start, end]) => word.ipa.slice(start, end))
    .join('')
    .replace(/[ˈˌ˥˦˧˨˩ˀ]/gu, '')
}

function containsSound(ipa: string, symbol: string): boolean {
  const normalizedIpa = ipa.normalize('NFC')
  const normalizedSound = symbol.normalize('NFC')
  let index = normalizedIpa.indexOf(normalizedSound)

  while (index !== -1) {
    const nextCharacter = normalizedIpa[index + normalizedSound.length]
    if (
      normalizedSound.endsWith('ː')
      || normalizedSound.endsWith('\u0303')
      || !nextCharacter
      || !['ː', '\u0303', '\u032F'].includes(nextCharacter)
    ) {
      return true
    }
    index = normalizedIpa.indexOf(normalizedSound, index + normalizedSound.length)
  }

  return false
}

function createExample(
  languageCode: string,
  word: Word,
  spelling?: string,
): SoundExample {
  const metadata = getLanguageMetadata(languageCode)
  return {
    key: `${languageCode}:${word.word}`,
    word: word.word,
    meaning: word.meaning,
    ipa: word.ipa,
    languageCode,
    languageName: metadata.englishName,
    speechLocale: metadata.speechLocale,
    spelling,
  }
}

function createCuratedExample(
  languageCode: string,
  symbol: string,
): SoundExample | undefined {
  const example = curatedExamples[languageCode]?.[symbol]
  if (!example) return undefined

  const metadata = getLanguageMetadata(languageCode)
  return {
    key: `${languageCode}:${example.word}`,
    ...example,
    languageCode,
    languageName: metadata.englishName,
    speechLocale: metadata.speechLocale,
  }
}

export async function getIpaSoundExamples(symbol: string): Promise<SoundExample[]> {
  const sound = getIpaSoundProfile(symbol)
  if (!sound) return []

  return (await Promise.all(sound.languageCodes.map(async (languageCode) => {
    const words = (await loadWords(languageCode)).words
    const focusedWord = words.find(word => getFocusedSound(word) === sound.symbol)
    if (focusedWord) {
      return createExample(languageCode, focusedWord, focusedWord.choices[0])
    }

    const fallbackWord = words.find(word => containsSound(word.ipa, sound.symbol))
    return fallbackWord
      ? createExample(languageCode, fallbackWord)
      : createCuratedExample(languageCode, sound.symbol)
  }))).filter((example): example is SoundExample => Boolean(example))
}
