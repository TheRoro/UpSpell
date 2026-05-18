export interface LanguageMetadata {
  code: string
  name: string
  englishName: string
  flag: string
  route: string
  speechLocale: string
  accentRule: string
}

export const languageMetadata: LanguageMetadata[] = [
  {
    code: 'fr',
    name: 'Français',
    englishName: 'French',
    flag: '/flags/fr.svg',
    route: '/fr',
    speechLocale: 'fr-FR',
    accentRule: 'French accents and ligatures can change pronunciation or distinguish otherwise similar spellings.',
  },
  {
    code: 'es',
    name: 'Español',
    englishName: 'Spanish',
    flag: '/flags/es.svg',
    route: '/es',
    speechLocale: 'es-ES',
    accentRule: 'Spanish acute accents mark stressed syllables that do not follow the usual stress rules or distinguish meanings.',
  },
  {
    code: 'pt',
    name: 'Português',
    englishName: 'Portuguese',
    flag: '/flags/pt.svg',
    route: '/pt',
    speechLocale: 'pt-PT',
    accentRule: 'Portuguese marks stress, vowel quality, and nasal sounds with acute, circumflex, grave, and tilde forms.',
  },
  {
    code: 'it',
    name: 'Italiano',
    englishName: 'Italian',
    flag: '/flags/it.svg',
    route: '/it',
    speechLocale: 'it-IT',
    accentRule: 'Italian commonly marks final stressed vowels and sometimes distinguishes open and closed vowel sounds.',
  },
  {
    code: 'ro',
    name: 'Română',
    englishName: 'Romanian',
    flag: '/flags/ro.svg',
    route: '/ro',
    speechLocale: 'ro-RO',
    accentRule: 'Romanian diacritics represent distinct sounds and letters, so they are part of the spelling rather than optional marks.',
  },
  {
    code: 'de',
    name: 'Deutsch',
    englishName: 'German',
    flag: '/flags/de.svg',
    route: '/de',
    speechLocale: 'de-DE',
    accentRule: 'German umlauts change vowel sounds, while ß represents a sharp s and follows language-specific spelling rules.',
  },
  {
    code: 'ru',
    name: 'Русский',
    englishName: 'Russian',
    flag: '/flags/ru.svg',
    route: '/ru',
    speechLocale: 'ru-RU',
    accentRule: 'Russian uses the Cyrillic alphabet; each character choice represents a distinct letter or orthographic sign.',
  },
  {
    code: 'tr',
    name: 'Türkçe',
    englishName: 'Turkish',
    flag: '/flags/tr.svg',
    route: '/tr',
    speechLocale: 'tr-TR',
    accentRule: 'Turkish dotted and dotless i are separate letters, as are ç, ğ, ö, ş, and ü.',
  },
  {
    code: 'pl',
    name: 'Polski',
    englishName: 'Polish',
    flag: '/flags/pl.svg',
    route: '/pl',
    speechLocale: 'pl-PL',
    accentRule: 'Polish diacritics form distinct letters that encode specific consonant and vowel sounds.',
  },
  {
    code: 'cs',
    name: 'Čeština',
    englishName: 'Czech',
    flag: '/flags/cz.svg',
    route: '/cs',
    speechLocale: 'cs-CZ',
    accentRule: 'Czech acute marks indicate vowel length, while háček and the ring distinguish specific letters and sounds.',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    englishName: 'Vietnamese',
    flag: '/flags/vn.svg',
    route: '/vi',
    speechLocale: 'vi-VN',
    accentRule: 'Vietnamese combines vowel marks with tone marks; both are essential to pronunciation and meaning.',
  },
  {
    code: 'is',
    name: 'Íslenska',
    englishName: 'Icelandic',
    flag: '/flags/is.svg',
    route: '/is',
    speechLocale: 'is-IS',
    accentRule: 'Icelandic accented vowels and the letters ð, þ, æ, and ö are distinct parts of its alphabet.',
  },
]

export function getLanguageMetadata(code: string): LanguageMetadata {
  const language = languageMetadata.find(item => item.code === code)
  if (!language) throw new Error(`Unsupported language code: ${code}`)
  return language
}
