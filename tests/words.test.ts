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
      }
    }
  })
})
