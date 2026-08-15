export interface Word {
  word: string
  blank: string
  position: number
  choices: string[]
  meaning: string
}

export interface LanguageWords {
  code: string
  name: string
  flag: string
  words: Word[]
}
