export interface Word {
  word: string
  blank: string
  position: number
  choices: string[]
  meaning: string
  ipa: string
  ipaFocus: IpaFocusRange[]
}

export type IpaFocusRange = [start: number, end: number]

export type StoredWord = Omit<Word, 'ipa' | 'ipaFocus'> & {
  ipa?: string
  ipaFocus?: IpaFocusRange[]
}

export interface LanguageWords {
  code: string
  name: string
  flag: string
  words: Word[]
}
