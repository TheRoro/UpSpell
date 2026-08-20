import { describe, expect, it } from 'vitest'
import {
  addExploredVowel,
  getExploredVowelsKey,
  readExploredVowels,
  recordExploredVowel,
} from '../utils/progress'

describe('phonetics progress', () => {
  it('recovers stored vowel progress safely', () => {
    expect(readExploredVowels(null)).toEqual([])
    expect(readExploredVowels('{broken')).toEqual([])
    expect(readExploredVowels(JSON.stringify(['e', 'e', '', 4, 'ɛ']))).toEqual([
      'e',
      'ɛ',
    ])
    expect(addExploredVowel(['e'], 'ɛ')).toEqual(['e', 'ɛ'])
    expect(addExploredVowel(['e'], 'e')).toEqual(['e'])
  })

  it('records unique vowels by language', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }

    recordExploredVowel(storage, 'fr', 'e')
    recordExploredVowel(storage, 'fr', 'e')
    recordExploredVowel(storage, 'fr', 'ɛ')

    expect(readExploredVowels(values.get(getExploredVowelsKey('fr')) ?? null))
      .toEqual(['e', 'ɛ'])
  })
})
