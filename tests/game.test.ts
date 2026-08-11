import { describe, expect, it } from 'vitest'
import {
  addMissedWord,
  getActiveStreak,
  getDailyIndex,
  getDailyIndexForDayKey,
  getLocalDayKey,
  getPreviousLocalDayKey,
  nextStreak,
  parseStoredCount,
  readMissedWords,
  removeMissedWord,
  shuffleChoices,
} from '../utils/game'

const word = {
  word: 'café',
  blank: 'caf_',
  position: 3,
  choices: ['é', 'e', 'è', 'ê'],
  meaning: 'coffee',
}

describe('local daily game', () => {
  it('changes days at the user’s local midnight', () => {
    expect(getLocalDayKey(new Date(2025, 4, 10, 23, 59, 59, 999))).toBe('2025-05-10')
    expect(getLocalDayKey(new Date(2025, 4, 11, 0, 0, 0, 0))).toBe('2025-05-11')
    expect(getPreviousLocalDayKey('2025-01-01')).toBe('2024-12-31')
    expect(getPreviousLocalDayKey('not-a-date')).toBe('')
  })

  it('selects one stable word index per local day', () => {
    expect(getDailyIndex(365, new Date(2025, 1, 1, 1))).toBe(
      getDailyIndex(365, new Date(2025, 1, 1, 23)),
    )
    expect(getDailyIndex(365, new Date(2025, 1, 2, 1))).not.toBe(
      getDailyIndex(365, new Date(2025, 1, 1, 23)),
    )
    expect(getDailyIndex(365, new Date(2024, 11, 31, 12))).not.toBe(
      getDailyIndex(365, new Date(2025, 0, 1, 12)),
    )
    expect(getDailyIndexForDayKey(365, '2025-02-01')).toBe(
      getDailyIndexForDayKey(365, '2025-02-01'),
    )
  })

  it('shuffles deterministically while varying the answer position', () => {
    const choices = ['é', 'e', 'è', 'ê']
    expect(shuffleChoices(choices, '2025-01-01:fr')).toEqual(
      shuffleChoices(choices, '2025-01-01:fr'),
    )
    expect(choices).toEqual(['é', 'e', 'è', 'ê'])

    const positions = new Set(
      Array.from({ length: 20 }, (_, day) =>
        shuffleChoices(choices, `2025-01-${String(day + 1).padStart(2, '0')}:fr`)
          .indexOf('é'),
      ),
    )
    expect(positions.size).toBeGreaterThan(1)
  })

  it('advances, resets, and restarts streaks', () => {
    expect(nextStreak(4, '2025-05-09', '2025-05-10', true)).toBe(5)
    expect(nextStreak(4, '2025-05-08', '2025-05-10', true)).toBe(1)
    expect(nextStreak(4, '2025-05-09', '2025-05-10', false)).toBe(0)
    expect(nextStreak(4, '2025-05-10', '2025-05-10', true)).toBe(4)
  })

  it('expires current streaks after a missed local day', () => {
    expect(getActiveStreak(4, '2025-05-10', '2025-05-10')).toBe(4)
    expect(getActiveStreak(4, '2025-05-09', '2025-05-10')).toBe(4)
    expect(getActiveStreak(4, '2025-05-08', '2025-05-10')).toBe(0)
    expect(getActiveStreak(4, null, '2025-05-10')).toBe(0)
  })
})

describe('local progress recovery', () => {
  it('recovers invalid counters as zero', () => {
    expect(parseStoredCount(null)).toBe(0)
    expect(parseStoredCount('not-a-number')).toBe(0)
    expect(parseStoredCount('-4')).toBe(0)
    expect(parseStoredCount('12')).toBe(12)
  })

  it('recovers malformed practice data and maintains a unique queue', () => {
    expect(readMissedWords('{broken')).toEqual([])
    expect(readMissedWords('{"word":"no-array"}')).toEqual([])
    expect(readMissedWords(JSON.stringify([word]))).toEqual([word])
    expect(addMissedWord([word], word)).toEqual([word])
    expect(removeMissedWord([word], word)).toEqual([])
  })
})
