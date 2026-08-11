import type { Word } from '~/data/words'

const DAY_MS = 86_400_000

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function formatDayKey(year: number, month: number, day: number): string {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
}

function parseDayKey(dayKey: string): [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return [year, month, day]
}

export function getLocalDayKey(date = new Date()): string {
  return formatDayKey(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
}

export function getPreviousLocalDayKey(dayKey: string): string {
  const parts = parseDayKey(dayKey)
  if (!parts) return ''

  const previous = new Date(Date.UTC(
    parts[0],
    parts[1] - 1,
    parts[2] - 1,
  ))
  return formatDayKey(
    previous.getUTCFullYear(),
    previous.getUTCMonth() + 1,
    previous.getUTCDate(),
  )
}

export function getDailyIndex(wordCount: number, date = new Date()): number {
  return getDailyIndexForDayKey(wordCount, getLocalDayKey(date))
}

export function getDailyIndexForDayKey(
  wordCount: number,
  dayKey: string,
): number {
  if (!Number.isInteger(wordCount) || wordCount <= 0) {
    throw new Error('wordCount must be a positive integer')
  }
  const parts = parseDayKey(dayKey)
  if (!parts) throw new Error('dayKey must use YYYY-MM-DD format')

  const epochDay = Math.floor(Date.UTC(
    parts[0],
    parts[1] - 1,
    parts[2],
  ) / DAY_MS)
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
  return lastPlayed === getPreviousLocalDayKey(today) ? currentStreak + 1 : 1
}

export function getActiveStreak(
  currentStreak: number,
  lastPlayed: string | null,
  today: string,
): number {
  if (!Number.isFinite(currentStreak) || currentStreak <= 0) return 0
  if (lastPlayed === today || lastPlayed === getPreviousLocalDayKey(today)) {
    return currentStreak
  }
  return 0
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
