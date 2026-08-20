export interface ProgressStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function getExploredVowelsKey(languageCode: string): string {
  return `upspell-vowels-${languageCode}`
}

export function readExploredVowels(value: string | null): string[] {
  if (!value) return []

  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return [...new Set(parsed.filter(
      (sound): sound is string => typeof sound === 'string' && sound.length > 0,
    ))]
  } catch {
    return []
  }
}

export function addExploredVowel(vowels: string[], symbol: string): string[] {
  return symbol && !vowels.includes(symbol)
    ? [...vowels, symbol]
    : vowels
}

export function recordExploredVowel(
  storage: ProgressStorage,
  languageCode: string,
  symbol: string,
) {
  const key = getExploredVowelsKey(languageCode)
  const vowels = addExploredVowel(
    readExploredVowels(storage.getItem(key)),
    symbol,
  )
  storage.setItem(key, JSON.stringify(vowels))
}
