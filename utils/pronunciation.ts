import type { IpaFocusRange } from '~/data/words'

export type PronunciationMode = 'word' | 'slow'

export interface PronunciationPlayback {
  text: string
  rate: number
  preparingStatus: string
  playingStatus: string
  finishedStatus: string
}

export function getFocusedIpa(
  ipa: string,
  ranges: IpaFocusRange[],
): string {
  return ranges.map(([start, end]) => ipa.slice(start, end)).join('')
}

export function getPronunciationPlayback(
  word: string,
  languageName: string,
  mode: PronunciationMode,
): PronunciationPlayback {
  if (mode === 'slow') {
    return {
      text: word,
      rate: 0.58,
      preparingStatus: 'Preparing slow pronunciation…',
      playingStatus: `Playing ${word} slowly.`,
      finishedStatus: `Finished the slow pronunciation of ${word}.`,
    }
  }

  return {
    text: word,
    rate: 0.9,
    preparingStatus: `Preparing ${languageName} pronunciation…`,
    playingStatus: `Playing ${word} at a natural pace.`,
    finishedStatus: `Finished the pronunciation of ${word}.`,
  }
}
