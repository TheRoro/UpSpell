import { describe, expect, it } from 'vitest'
import {
  addMissedWord,
  getDailyIndex,
  getPreviousUtcDayKey,
  getUtcDayKey,
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

describe('UTC daily game', () => {
  it('changes days only at the documented UTC boundary', () => {
    expect(getUtcDayKey(new Date('2025-05-10T23:59:59.999Z'))).toBe('2025-05-10')
    expect(getUtcDayKey(new Date('2025-05-11T00:00:00.000Z'))).toBe('2025-05-11')
    expect(getPreviousUtcDayKey('2025-01-01')).toBe('2024-12-31')
  })

  it('selects one stable word index per UTC day', () => {
    expect(getDailyIndex(365, new Date('2025-02-01T01:00:00Z'))).toBe(
      getDailyIndex(365, new Date('2025-02-01T23:00:00Z')),
    )
    expect(getDailyIndex(365, new Date('2025-02-02T01:00:00Z'))).not.toBe(
      getDailyIndex(365, new Date('2025-02-01T23:00:00Z')),
    )
    expect(getDailyIndex(365, new Date('2024-12-31T12:00:00Z'))).not.toBe(
      getDailyIndex(365, new Date('2025-01-01T12:00:00Z')),
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
