import { describe, expect, it } from 'vitest'
import {
  getCharacterExamples,
  getCharacterProfile,
  getIpaSoundPath,
  getIpaSoundProfile,
  getIpaSoundProfiles,
  getLanguageCharacters,
  getLanguagePhoneticCharacters,
  languageVowelInventories,
} from '../data/characterProfiles'
import { getIpaSoundExamples } from '../data/soundExamples'
import { loadLanguageWords } from '../data/words'

const expectedCounts: Record<string, number> = {
  fr: 14,
  es: 7,
  pt: 12,
  it: 6,
  ro: 5,
  de: 4,
  ru: 33,
  tr: 7,
  pl: 10,
  cs: 15,
  vi: 42,
  is: 10,
}

const expectedVowelCounts: Record<string, number> = {
  fr: 14,
  es: 5,
  pt: 14,
  it: 7,
  ro: 7,
  de: 16,
  ru: 6,
  tr: 8,
  pl: 8,
  cs: 10,
  vi: 9,
  is: 8,
}

describe('character pronunciation profiles', () => {
  it('provides a complete profile for every listed character', () => {
    for (const [code, expectedCount] of Object.entries(expectedCounts)) {
      const characters = getLanguageCharacters(code)
      expect(characters).toHaveLength(expectedCount)

      for (const character of getLanguagePhoneticCharacters(code)) {
        const profile = getCharacterProfile(code, character.letter)
        expect(profile?.name).toBe(character.name)
        expect(profile?.soundNote).toBeTruthy()
        expect(profile?.commonMistake).toBeTruthy()
        expect(profile?.regionalVariants).toBeTruthy()
        for (const sound of profile?.sounds ?? []) {
          expect(sound.symbol).toBeTruthy()
          expect(sound.name).toBeTruthy()
          expect(sound.name).not.toBe('IPA sound')
          expect(sound.articulation).toBeTruthy()
        }
      }
    }
  })

  it('excludes Spanish punctuation from character and phonetics collections', () => {
    expect(getLanguageCharacters('es').map(character => character.letter))
      .not.toEqual(expect.arrayContaining(['¿', '¡']))
    expect(getLanguagePhoneticCharacters('es').map(character => character.letter))
      .not.toEqual(expect.arrayContaining(['¿', '¡']))
    expect(getCharacterProfile('es', '¿')).toBeUndefined()
    expect(getCharacterProfile('es', '¡')).toBeUndefined()
  })

  it('organizes phonetics around unique IPA sounds', () => {
    const sounds = getIpaSoundProfiles()
    const symbols = sounds.map(sound => sound.symbol)

    expect(new Set(symbols).size).toBe(symbols.length)
    expect(sounds.every(sound => sound.category === 'Vowels')).toBe(true)
    for (const sound of sounds) {
      expect(getIpaSoundProfile(sound.symbol)).toEqual(sound)
      expect(getIpaSoundPath(sound.symbol)).toBe(
        `/phonetics/sounds/${encodeURIComponent(sound.symbol)}`,
      )
      expect(sound.languageCodes.length).toBeGreaterThan(0)
      expect(sound.spellings.every(spelling =>
        sound.languageCodes.includes(spelling.languageCode),
      )).toBe(true)
    }
  })

  it('uses complete language vowel inventories instead of marked characters', () => {
    for (const [code, expectedCount] of Object.entries(expectedVowelCounts)) {
      expect(languageVowelInventories[code]).toHaveLength(expectedCount)
      expect(getIpaSoundProfiles(code)).toHaveLength(expectedCount)
    }
    expect(languageVowelInventories.ro).toEqual([
      'i',
      'ɨ',
      'u',
      'e',
      'o',
      'a',
      'ə',
    ])
    expect(getIpaSoundProfiles('es').map(sound => ({
      symbol: sound.symbol,
      spellings: sound.spellings.map(spelling => spelling.letter),
    }))).toEqual([
      { symbol: 'a', spellings: ['a'] },
      { symbol: 'e', spellings: ['e'] },
      { symbol: 'i', spellings: ['i'] },
      { symbol: 'o', spellings: ['o'] },
      { symbol: 'u', spellings: ['u'] },
    ])
  })

  it('selects unique matching example words', () => {
    const examples = getCharacterExamples([
      {
        word: 'café',
        blank: 'caf_',
        position: 3,
        choices: ['é', 'è'],
        meaning: 'coffee',
        ipa: 'kafe',
        ipaFocus: [[3, 4]],
      },
      {
        word: 'été',
        blank: '_té',
        position: 0,
        choices: ['é', 'è'],
        meaning: 'summer',
        ipa: 'ete',
        ipaFocus: [[0, 1]],
      },
    ], 'é', 'fr-FR')

    expect(examples).toEqual([
      { word: 'café', meaning: 'coffee', ipa: 'kafe', focusedIpa: 'e' },
      { word: 'été', meaning: 'summer', ipa: 'ete', focusedIpa: 'e' },
    ])
  })

  it('has a destination for every daily challenge character', async () => {
    const missingProfiles: string[] = []
    for (const code of Object.keys(expectedCounts)) {
      const language = await loadLanguageWords(code)
      for (const word of language.words) {
        if (!getCharacterProfile(code, word.choices[0])) {
          missingProfiles.push(`${code}:${word.choices[0]}`)
        }
        for (const sound of getCharacterProfile(code, word.choices[0])?.sounds ?? []) {
          expect(getIpaSoundPath(sound.symbol)).toMatch(/^\/phonetics\/sounds\//)
        }
      }
    }
    expect([...new Set(missingProfiles)].sort()).toEqual([])
  })

  it('provides one example for every language using each vowel', async () => {
    const missingExamples: string[] = []

    for (const sound of getIpaSoundProfiles()) {
      const examples = await getIpaSoundExamples(sound.symbol)
      const exampleLanguages = new Set(examples.map(example => example.languageCode))
      for (const languageCode of sound.languageCodes) {
        if (!exampleLanguages.has(languageCode)) {
          missingExamples.push(`${languageCode}:/${sound.symbol}/`)
        }
      }
    }

    expect(missingExamples).toEqual([])
  })
})
