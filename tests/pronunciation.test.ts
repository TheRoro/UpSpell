import { describe, expect, it } from 'vitest'
import {
  getFocusedIpa,
  getPronunciationPlayback,
  getSpeechVoice,
} from '../utils/pronunciation'

describe('pronunciation playback', () => {
  it('collects every highlighted IPA range in order', () => {
    expect(getFocusedIpa('băp˧˥', [[1, 2], [3, 5]])).toBe('ă˧˥')
  })

  it('creates distinct natural and slow playback', () => {
    const natural = getPronunciationPlayback('café', 'French', 'word')
    const slow = getPronunciationPlayback('café', 'French', 'slow')

    expect(natural).toMatchObject({ text: 'café', rate: 0.9 })
    expect(slow).toMatchObject({ text: 'café', rate: 0.58 })
  })

  it('prefers an exact speech locale before a language match', () => {
    const voices = [
      { lang: 'fr-CA' },
      { lang: 'fr-FR' },
      { lang: 'en-US' },
    ] as SpeechSynthesisVoice[]

    expect(getSpeechVoice(voices, 'fr-FR')).toBe(voices[1])
    expect(getSpeechVoice(voices, 'fr-BE')).toBe(voices[0])
    expect(getSpeechVoice(voices, 'de-DE')).toBeNull()
  })
})
