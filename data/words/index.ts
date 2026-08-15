import type { LanguageWords } from './types'

export type { LanguageWords, Word } from './types'

export interface LanguageSummary {
  code: string
  name: string
  flag: string
  featuredMarks: string[]
  featuredWords: string[]
}

export const languages: LanguageSummary[] = [
  {
    "code": "fr",
    "name": "Français",
    "flag": "/flags/fr.svg",
    "featuredMarks": [
      "é",
      "è",
      "ê",
      "ë",
      "à"
    ],
    "featuredWords": [
      "café",
      "étagère",
      "fenêtre"
    ]
  },
  {
    "code": "es",
    "name": "Español",
    "flag": "/flags/es.svg",
    "featuredMarks": [
      "á",
      "é",
      "í",
      "ó",
      "ú"
    ],
    "featuredWords": [
      "mamá",
      "café",
      "maíz"
    ]
  },
  {
    "code": "pt",
    "name": "Português",
    "flag": "/flags/pt.svg",
    "featuredMarks": [
      "á",
      "â",
      "í",
      "à",
      "ã"
    ],
    "featuredWords": [
      "água",
      "trânsito",
      "mínimo"
    ]
  },
  {
    "code": "it",
    "name": "Italiano",
    "flag": "/flags/it.svg",
    "featuredMarks": [
      "à",
      "ù",
      "ì",
      "è",
      "é"
    ],
    "featuredWords": [
      "città",
      "virtù",
      "lunedì"
    ]
  },
  {
    "code": "ro",
    "name": "Română",
    "flag": "/flags/ro.svg",
    "featuredMarks": [
      "ă",
      "â",
      "î",
      "ș",
      "ț"
    ],
    "featuredWords": [
      "apă",
      "mână",
      "înger"
    ]
  },
  {
    "code": "de",
    "name": "Deutsch",
    "flag": "/flags/de.svg",
    "featuredMarks": [
      "ä",
      "ö",
      "ü",
      "ß",
      "Ä"
    ],
    "featuredWords": [
      "Mädchen",
      "öffnen",
      "über"
    ]
  },
  {
    "code": "ru",
    "name": "Русский",
    "flag": "/flags/ru.svg",
    "featuredMarks": [
      "ё"
    ],
    "featuredWords": [
      "ёлка",
      "ёж",
      "ёжик"
    ]
  },
  {
    "code": "tr",
    "name": "Türkçe",
    "flag": "/flags/tr.svg",
    "featuredMarks": [
      "ç",
      "ğ",
      "ı",
      "İ",
      "ö"
    ],
    "featuredWords": [
      "çiçek",
      "çiğdem",
      "çarşı"
    ]
  },
  {
    "code": "pl",
    "name": "Polski",
    "flag": "/flags/pl.svg",
    "featuredMarks": [
      "ą",
      "ć",
      "ę",
      "ł",
      "ń"
    ],
    "featuredWords": [
      "mąka",
      "wąchać",
      "kręcić"
    ]
  },
  {
    "code": "cs",
    "name": "Čeština",
    "flag": "/flags/cz.svg",
    "featuredMarks": [
      "á",
      "č",
      "ď",
      "é",
      "ě"
    ],
    "featuredWords": [
      "máma",
      "pláč",
      "ďábel"
    ]
  },
  {
    "code": "vi",
    "name": "Tiếng Việt",
    "flag": "/flags/vn.svg",
    "featuredMarks": [
      "đ",
      "ă",
      "ắ",
      "ằ",
      "ặ"
    ],
    "featuredWords": [
      "đẹp",
      "ăn",
      "đắng"
    ]
  },
  {
    "code": "is",
    "name": "Íslenska",
    "flag": "/flags/is.svg",
    "featuredMarks": [
      "þ",
      "ð",
      "ó",
      "ö",
      "é"
    ],
    "featuredWords": [
      "þakka",
      "þráður",
      "þjófur"
    ]
  }
]

const languageLoaders: Record<string, () => Promise<LanguageWords>> = {
  fr: () => import('./fr').then(module => module.default),
  es: () => import('./es').then(module => module.default),
  pt: () => import('./pt').then(module => module.default),
  it: () => import('./it').then(module => module.default),
  ro: () => import('./ro').then(module => module.default),
  de: () => import('./de').then(module => module.default),
  ru: () => import('./ru').then(module => module.default),
  tr: () => import('./tr').then(module => module.default),
  pl: () => import('./pl').then(module => module.default),
  cs: () => import('./cs').then(module => module.default),
  vi: () => import('./vi').then(module => module.default),
  is: () => import('./is').then(module => module.default),
}

export async function loadLanguageWords(code: string): Promise<LanguageWords> {
  const loader = languageLoaders[code]
  if (!loader) throw new Error(`Unsupported language code: ${code}`)
  return loader()
}
