import type { Word } from '~/data/words'

const DAY_MS = 86_400_000

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function getUtcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function getPreviousUtcDayKey(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00.000Z`)
  return getUtcDayKey(new Date(date.getTime() - DAY_MS))
}

export function getDailyIndex(wordCount: number, date = new Date()): number {
  if (!Number.isInteger(wordCount) || wordCount <= 0) {
    throw new Error('wordCount must be a positive integer')
  }
  const epochDay = Math.floor(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ) / DAY_MS,
  )
  return ((epochDay % wordCount) + wordCount) % wordCount
}

function hashSeed(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRandom(seed: number): () => number {
  return () => {
    seed += 0x6D2B79F5
    let value = seed
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

export function shuffleChoices(
  choices: string[],
  seedValue: string,
): string[] {
  const shuffled = [...choices]
  const random = seededRandom(hashSeed(seedValue))
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ]
  }
  return shuffled
}

export function nextStreak(
  currentStreak: number,
  lastPlayed: string | null,
  today: string,
  correct: boolean,
): number {
  if (!correct) return 0
  if (lastPlayed === today) return currentStreak
  return lastPlayed === getPreviousUtcDayKey(today) ? currentStreak + 1 : 1
}

export function parseStoredCount(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function readMissedWords(value: string | null): Word[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Word => {
      if (!item || typeof item !== 'object') return false
      const word = item as Partial<Word>
      return (
        typeof word.word === 'string' &&
        typeof word.blank === 'string' &&
        typeof word.position === 'number' &&
        typeof word.meaning === 'string' &&
        Array.isArray(word.choices) &&
        word.choices.every(choice => typeof choice === 'string')
      )
    })
  } catch {
    return []
  }
}

export function addMissedWord(words: Word[], missed: Word): Word[] {
  return [missed, ...words.filter(word => word.word !== missed.word)].slice(0, 50)
}

export function removeMissedWord(words: Word[], completed: Word): Word[] {
  return words.filter(word => word.word !== completed.word)
}
