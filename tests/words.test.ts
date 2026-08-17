import { describe, expect, it } from 'vitest'
import { languages, loadLanguageWords } from '../data/words'
import { languageMetadata } from '../data/languageMetadata'

describe('word dataset', () => {
  it('contains 365 unique, valid prompts for every language', async () => {
    expect(languages).toHaveLength(12)
    expect(languages.map(language => language.code).sort()).toEqual(
      languageMetadata.map(language => language.code).sort(),
    )

    for (const summary of languages) {
      const language = await loadLanguageWords(summary.code)
      expect(language.words, `${language.code} word count`).toHaveLength(365)
      expect(
        new Set(language.words.map(word => word.word)).size,
        `${language.code} unique words`,
      ).toBe(365)

      for (const prompt of language.words) {
        expect(
          prompt.blank.split('_').length - 1,
          `${language.code}: ${prompt.word} has one blank`,
        ).toBe(1)
        expect(
          prompt.blank.replace('_', prompt.choices[0]),
          `${language.code}: ${prompt.word} reconstructs`,
        ).toBe(prompt.word)
        expect(
          prompt.blank.indexOf('_'),
          `${language.code}: ${prompt.word} position`,
        ).toBe(prompt.position)
        expect(
          new Set(prompt.choices).size,
          `${language.code}: ${prompt.word} unique choices`,
        ).toBe(prompt.choices.length)
        expect(prompt.ipa, `${language.code}: ${prompt.word} IPA`).not.toBe('')
        expect(
          prompt.ipa.normalize('NFC'),
          `${language.code}: ${prompt.word} normalized IPA`,
        ).toBe(prompt.ipa)
        expect(
          prompt.ipa,
          `${language.code}: ${prompt.word} IPA engine artifacts`,
        ).not.toMatch(/[\u0000-\u001F\u007F\uFFFD\d_|]|(?:\([a-z]{2,3}\))/u)
        expect(
          prompt.ipaFocus.length,
          `${language.code}: ${prompt.word} IPA focus`,
        ).toBeGreaterThan(0)

        let previousEnd = -1
        for (const [start, end] of prompt.ipaFocus) {
          expect(start, `${language.code}: ${prompt.word} IPA focus order`).toBeGreaterThanOrEqual(previousEnd)
          expect(start, `${language.code}: ${prompt.word} IPA focus start`).toBeGreaterThanOrEqual(0)
          expect(end, `${language.code}: ${prompt.word} IPA focus end`).toBeLessThanOrEqual(prompt.ipa.length)
          expect(end, `${language.code}: ${prompt.word} IPA focus content`).toBeGreaterThan(start)
          expect(
            prompt.ipa.slice(start, end),
            `${language.code}: ${prompt.word} highlighted IPA`,
          ).not.toBe('')
          previousEnd = end
        }
      }
    }
  })
})
