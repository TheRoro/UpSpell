import type { Word } from './words'

export interface IpaSoundDefinition {
  symbol: string
  name: string
  articulation: string
}

export interface CharacterSummary {
  letter: string
  name: string
}

export interface CharacterProfile extends CharacterSummary {
  sounds: IpaSoundDefinition[]
  soundNote: string
  commonMistake: string
  regionalVariants: string
}

export interface CharacterExample {
  word: string
  meaning: string
  ipa: string
  focusedIpa: string
}

export type IpaSoundCategory = 'Vowels' | 'Consonants' | 'Tones'

export interface SoundSpelling {
  languageCode: string
  letter: string
  characterName: string
  soundNote: string
  commonMistake: string
  regionalVariants: string
}

export interface IpaSoundProfile extends IpaSoundDefinition {
  category: IpaSoundCategory
  languageCodes: string[]
  spellings: SoundSpelling[]
}

interface CharacterSeed extends CharacterSummary {
  ipa?: string[]
  phonetic?: boolean
  soundNote?: string
  commonMistake?: string
  regionalVariants?: string
}

interface LanguageGuidance {
  commonMistake: string
  regionalVariants: string
}

export const officialIpaChartUrl = 'https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html'

const soundDefinitions: Record<string, Omit<IpaSoundDefinition, 'symbol'>> = {
  'a': {
    name: 'open front unrounded vowel',
    articulation: 'Open the mouth widely, keep the tongue low and forward, and leave the lips unrounded.',
  },
  'aː': {
    name: 'long open front unrounded vowel',
    articulation: 'Use an open, low front vowel and hold it longer without turning it into a glide.',
  },
  'ă': {
    name: 'short open central vowel',
    articulation: 'Open the mouth for a central a sound, but keep the vowel noticeably short.',
  },
  'ɑ': {
    name: 'open back unrounded vowel',
    articulation: 'Keep the tongue low and farther back than for a front a sound, with relaxed lips.',
  },
  'ɑ̃': {
    name: 'nasal open back unrounded vowel',
    articulation: 'Keep the tongue low and back with relaxed lips while allowing part of the airflow through the nose.',
  },
  'au̯': {
    name: 'open to close back diphthong',
    articulation: 'Begin with an open a sound and glide smoothly toward u without adding another syllable.',
  },
  'b': {
    name: 'voiced bilabial plosive',
    articulation: 'Close both lips, build a little pressure, then release while vibrating the vocal folds.',
  },
  'c': {
    name: 'voiceless palatal plosive',
    articulation: 'Press the middle of the tongue against the hard palate and release without voicing.',
  },
  'd': {
    name: 'voiced alveolar plosive',
    articulation: 'Touch the tongue near the upper teeth ridge, release it, and keep the voice on.',
  },
  'e': {
    name: 'close-mid front unrounded vowel',
    articulation: 'Raise the front of the tongue to a close-mid position and keep the lips unrounded.',
  },
  'eː': {
    name: 'long close-mid front unrounded vowel',
    articulation: 'Hold a steady close-mid front vowel without turning it into an English-style glide.',
  },
  'f': {
    name: 'voiceless labiodental fricative',
    articulation: 'Rest the lower lip lightly against the upper teeth and let air pass without voicing.',
  },
  'ɡ': {
    name: 'voiced velar plosive',
    articulation: 'Raise the back of the tongue to the soft palate, then release with voicing.',
  },
  'i': {
    name: 'close front unrounded vowel',
    articulation: 'Raise the front of the tongue close to the palate and spread the lips slightly.',
  },
  'iː': {
    name: 'long close front unrounded vowel',
    articulation: 'Hold a steady high front vowel with unrounded lips and no added glide.',
  },
  'ĩ': {
    name: 'nasal close front unrounded vowel',
    articulation: 'Use a high front unrounded vowel while allowing voiced air to resonate through the nose.',
  },
  'ɪ': {
    name: 'near-close near-front unrounded vowel',
    articulation: 'Use a short, relaxed high front vowel with the tongue slightly lower than for i.',
  },
  'j': {
    name: 'voiced palatal approximant',
    articulation: 'Raise the tongue toward the hard palate as in the beginning of English yes.',
  },
  'ja': {
    name: 'palatal glide plus open vowel',
    articulation: 'Begin with a brief y-like glide and move directly into an open a vowel.',
  },
  'jɛ': {
    name: 'palatal glide plus open-mid front vowel',
    articulation: 'Begin with a brief y-like glide, then settle into an open-mid front vowel.',
  },
  'jɛː': {
    name: 'palatal glide plus long open-mid front vowel',
    articulation: 'Begin with a y-like glide and sustain the following open-mid front vowel.',
  },
  'je': {
    name: 'palatal glide plus close-mid front vowel',
    articulation: 'Begin with a brief y-like glide and move into a pure close-mid e vowel.',
  },
  'jo': {
    name: 'palatal glide plus close-mid back vowel',
    articulation: 'Begin with a brief y-like glide and move into a rounded o vowel.',
  },
  'ju': {
    name: 'palatal glide plus close back vowel',
    articulation: 'Begin with a brief y-like glide and move into a rounded u vowel.',
  },
  'k': {
    name: 'voiceless velar plosive',
    articulation: 'Raise the back of the tongue to the soft palate, then release without voicing.',
  },
  'l': {
    name: 'voiced alveolar lateral approximant',
    articulation: 'Touch the tongue tip near the upper teeth ridge and let air flow around its sides.',
  },
  'lʲ': {
    name: 'palatalized voiced alveolar lateral',
    articulation: 'Make an l while also raising the middle of the tongue toward the hard palate.',
  },
  'm': {
    name: 'voiced bilabial nasal',
    articulation: 'Close both lips and let the voiced air escape through the nose.',
  },
  'n': {
    name: 'voiced alveolar nasal',
    articulation: 'Touch the tongue near the upper teeth ridge and let voiced air pass through the nose.',
  },
  'nʲ': {
    name: 'palatalized voiced alveolar nasal',
    articulation: 'Make an n while raising the middle of the tongue toward the hard palate.',
  },
  'o': {
    name: 'close-mid back rounded vowel',
    articulation: 'Raise the back of the tongue to a close-mid position and round the lips.',
  },
  'oː': {
    name: 'long close-mid back rounded vowel',
    articulation: 'Hold a steady rounded close-mid back vowel without adding a glide.',
  },
  'ou̯': {
    name: 'close-mid back diphthong',
    articulation: 'Begin with a rounded o and glide smoothly toward u in one syllable.',
  },
  'p': {
    name: 'voiceless bilabial plosive',
    articulation: 'Close both lips, build pressure, and release without vibrating the vocal folds.',
  },
  'r': {
    name: 'voiced alveolar trill',
    articulation: 'Let the tongue tip vibrate briefly against the upper teeth ridge.',
  },
  'r̝': {
    name: 'raised alveolar non-sonorant trill',
    articulation: 'Begin with a tongue-tip trill while narrowing the airflow enough to add friction.',
  },
  's': {
    name: 'voiceless alveolar fricative',
    articulation: 'Bring the tongue close to the upper teeth ridge and send a narrow stream of air forward.',
  },
  't': {
    name: 'voiceless alveolar plosive',
    articulation: 'Touch the tongue near the upper teeth ridge and release it without voicing.',
  },
  't͡s': {
    name: 'voiceless alveolar affricate',
    articulation: 'Start with a t closure and release directly into an s sound.',
  },
  't͡ɕ': {
    name: 'voiceless alveolo-palatal affricate',
    articulation: 'Start with a soft t-like closure and release into a hiss with the tongue raised toward the palate.',
  },
  't͡ʃ': {
    name: 'voiceless postalveolar affricate',
    articulation: 'Start with a t closure just behind the teeth ridge and release into a sh sound.',
  },
  'u': {
    name: 'close back rounded vowel',
    articulation: 'Raise the back of the tongue and round the lips while keeping the vowel steady.',
  },
  'uː': {
    name: 'long close back rounded vowel',
    articulation: 'Hold a steady high back rounded vowel without turning it into a glide.',
  },
  'ũ': {
    name: 'nasal close back rounded vowel',
    articulation: 'Use a high back rounded vowel while allowing voiced air to resonate through the nose.',
  },
  'ʊ': {
    name: 'near-close near-back rounded vowel',
    articulation: 'Use a short, relaxed high back vowel with gentle lip rounding.',
  },
  'v': {
    name: 'voiced labiodental fricative',
    articulation: 'Rest the lower lip against the upper teeth and let voiced air pass continuously.',
  },
  'w': {
    name: 'voiced labial-velar approximant',
    articulation: 'Round the lips while raising the back of the tongue, then glide quickly into the next vowel.',
  },
  'x': {
    name: 'voiceless velar fricative',
    articulation: 'Raise the back of the tongue near the soft palate and let unvoiced air create friction.',
  },
  'y': {
    name: 'close front rounded vowel',
    articulation: 'Hold the tongue position for i while rounding the lips as for u.',
  },
  'yː': {
    name: 'long close front rounded vowel',
    articulation: 'Hold a high front vowel with tightly rounded lips.',
  },
  'z': {
    name: 'voiced alveolar fricative',
    articulation: 'Use the tongue position for s while vibrating the vocal folds.',
  },
  'ð': {
    name: 'voiced dental fricative',
    articulation: 'Place the tongue lightly between or against the teeth and let voiced air pass.',
  },
  'ø': {
    name: 'close-mid front rounded vowel',
    articulation: 'Hold the tongue position for e while rounding the lips.',
  },
  'øː': {
    name: 'long close-mid front rounded vowel',
    articulation: 'Hold a steady close-mid front vowel with rounded lips.',
  },
  'ŋ': {
    name: 'voiced velar nasal',
    articulation: 'Raise the back of the tongue to the soft palate and let voiced air pass through the nose.',
  },
  'œ': {
    name: 'open-mid front rounded vowel',
    articulation: 'Hold the tongue position for an open e while rounding the lips.',
  },
  'œː': {
    name: 'long open-mid front rounded vowel',
    articulation: 'Sustain an open-mid front vowel while keeping the lips rounded.',
  },
  'ɐ': {
    name: 'near-open central vowel',
    articulation: 'Keep the tongue low and central with relaxed, unrounded lips.',
  },
  'ɐ̃': {
    name: 'nasal near-open central vowel',
    articulation: 'Use a low central vowel while allowing part of the airflow through the nose.',
  },
  'ə': {
    name: 'mid central vowel',
    articulation: 'Relax the tongue in the center of the mouth and keep the sound short and unstressed.',
  },
  'ɛ': {
    name: 'open-mid front unrounded vowel',
    articulation: 'Lower the front of the tongue from e and keep the lips unrounded.',
  },
  'ɛː': {
    name: 'long open-mid front unrounded vowel',
    articulation: 'Hold an open-mid front vowel steadily with unrounded lips.',
  },
  'ɛ̃': {
    name: 'nasal open-mid front vowel',
    articulation: 'Use an open-mid front vowel while allowing air to resonate through the nose.',
  },
  'ẽ': {
    name: 'nasal close-mid front unrounded vowel',
    articulation: 'Use a close-mid front vowel while allowing voiced air to resonate through the nose.',
  },
  'ɟ': {
    name: 'voiced palatal plosive',
    articulation: 'Press the middle of the tongue against the hard palate and release with voicing.',
  },
  'ɨ': {
    name: 'close central unrounded vowel',
    articulation: 'Raise the center of the tongue while keeping the lips neutral and the tongue away from the front teeth.',
  },
  'ɤ': {
    name: 'close-mid back unrounded vowel',
    articulation: 'Raise the back of the tongue to a close-mid position while keeping the lips unrounded.',
  },
  'ɯ': {
    name: 'close back unrounded vowel',
    articulation: 'Use the tongue position for u but keep the lips completely unrounded.',
  },
  'ɲ': {
    name: 'voiced palatal nasal',
    articulation: 'Press the middle of the tongue toward the hard palate and let voiced air pass through the nose.',
  },
  'ɔ': {
    name: 'open-mid back rounded vowel',
    articulation: 'Lower the back of the tongue from o and keep the lips rounded.',
  },
  'ɔ̃': {
    name: 'nasal open-mid back vowel',
    articulation: 'Use an open-mid rounded back vowel while allowing airflow through the nose.',
  },
  'ɕ': {
    name: 'voiceless alveolo-palatal fricative',
    articulation: 'Raise the tongue toward the hard palate and produce a soft, high-pitched sh sound.',
  },
  'ɕː': {
    name: 'long voiceless alveolo-palatal fricative',
    articulation: 'Sustain a soft sh sound with the tongue raised toward the hard palate.',
  },
  'ʂ': {
    name: 'voiceless retroflex fricative',
    articulation: 'Curl or retract the tongue slightly and produce a firm, dark sh sound.',
  },
  'ʃ': {
    name: 'voiceless postalveolar fricative',
    articulation: 'Raise the tongue just behind the teeth ridge and let unvoiced air pass with friction.',
  },
  'ʏ': {
    name: 'near-close front rounded vowel',
    articulation: 'Use a relaxed short i-like tongue position while keeping the lips rounded.',
  },
  'ʐ': {
    name: 'voiced retroflex fricative',
    articulation: 'Retract the tongue slightly for a dark zh sound and keep the voice on.',
  },
  'ʑ': {
    name: 'voiced alveolo-palatal fricative',
    articulation: 'Raise the tongue toward the hard palate for a soft zh sound with voicing.',
  },
  'ʒ': {
    name: 'voiced postalveolar fricative',
    articulation: 'Use the tongue position for sh while vibrating the vocal folds.',
  },
  'θ': {
    name: 'voiceless dental fricative',
    articulation: 'Place the tongue lightly between or against the teeth and let unvoiced air pass.',
  },
  'ɗ': {
    name: 'voiced alveolar implosive',
    articulation: 'Touch the tongue near the teeth ridge and release with voicing and a slight inward pressure.',
  },
  'õ': {
    name: 'nasal close-mid back rounded vowel',
    articulation: 'Use a rounded close-mid back vowel while allowing air to resonate through the nose.',
  },
  'ai̯': {
    name: 'open front to close front diphthong',
    articulation: 'Begin with an open a sound and glide toward i within one syllable.',
  },
  '˨˩': {
    name: 'low falling tone',
    articulation: 'Begin low in your pitch range and let the voice fall lower across the vowel.',
  },
  '˧˥': {
    name: 'mid rising tone',
    articulation: 'Begin near the middle of your pitch range and rise smoothly.',
  },
  '˧˩˧': {
    name: 'dipping tone',
    articulation: 'Start in the middle, dip low, and recover toward the middle.',
  },
  '˧ˀ˥': {
    name: 'broken rising tone',
    articulation: 'Use a rising contour with the characteristic constriction or interruption used in northern speech.',
  },
  '˧˨ˀ': {
    name: 'low constricted tone',
    articulation: 'Lower the pitch while adding the brief constricted ending associated with the tone.',
  },
}

const languageGuidance: Record<string, LanguageGuidance> = {
  fr: {
    commonMistake: 'Do not assume that every written accent creates a completely new vowel. Some marks distinguish spelling or meaning.',
    regionalVariants: 'Vowel contrasts vary across French-speaking regions, and several historical distinctions are merged in modern speech.',
  },
  es: {
    commonMistake: 'An acute accent usually marks stress or separates vowels. It does not turn the vowel into an English-style sound.',
    regionalVariants: 'The five vowel qualities are stable across major varieties, while consonant patterns and intonation vary by region.',
  },
  pt: {
    commonMistake: 'Do not ignore vowel openness or nasality. Both can distinguish words and are often carried by the written mark.',
    regionalVariants: 'European and Brazilian Portuguese differ substantially in vowel reduction, timing, and some consonant realizations.',
  },
  it: {
    commonMistake: 'Do not treat every accented vowel as a different sound. Many final accents primarily mark stress.',
    regionalVariants: 'Open and closed e and o vary by word and region, even when standard spelling does not mark the contrast.',
  },
  ro: {
    commonMistake: 'Treat each marked form as a separate Romanian letter rather than an optional decoration.',
    regionalVariants: 'Standard Romanian is relatively consistent, though vowel quality and consonant timing vary in regional speech.',
  },
  de: {
    commonMistake: 'Do not replace front rounded vowels with plain e, i, o, or u, and never read ß as the letter b.',
    regionalVariants: 'Vowel length and quality vary by region. Swiss Standard German normally writes ss instead of ß.',
  },
  ru: {
    commonMistake: 'Pay attention to consonant softness and vowel reduction instead of assigning one unchanging sound to every letter.',
    regionalVariants: 'This profile follows broad Standard Russian. Unstressed vowels and some consonants vary by position and dialect.',
  },
  tr: {
    commonMistake: 'Keep dotted and dotless i separate, and do not pronounce soft ğ as an ordinary hard g.',
    regionalVariants: 'The descriptions follow standard Istanbul Turkish. The realization of ğ varies with its neighboring vowels.',
  },
  pl: {
    commonMistake: 'Do not substitute the nearest English letter. Polish soft consonants and nasal vowels require distinct tongue positions.',
    regionalVariants: 'Nasal vowels change noticeably before different consonants and may lose nasality in some positions.',
  },
  cs: {
    commonMistake: 'Acute accents mark vowel length, not stress. Czech stress normally remains on the first syllable.',
    regionalVariants: 'The descriptions follow standard Czech. Everyday regional speech may merge or modify some vowel qualities.',
  },
  vi: {
    commonMistake: 'Treat the vowel mark and tone mark as separate layers. Both belong to the syllable and can change meaning.',
    regionalVariants: 'Tone contours and several consonants differ between northern, central, and southern Vietnamese.',
  },
  is: {
    commonMistake: 'Do not read accented vowels as merely longer versions of the plain letters. Several represent diphthongs.',
    regionalVariants: 'Modern Icelandic is comparatively uniform, though sound length and weakening depend on phonetic context.',
  },
}

const characterCatalog: Record<string, CharacterSeed[]> = {
  fr: [
    { letter: 'é', name: 'E accent aigu', ipa: ['e'], soundNote: 'Usually represents a close-mid e sound.' },
    { letter: 'à', name: 'A accent grave', ipa: ['a'], soundNote: 'Usually sounds like plain a; the accent often distinguishes meaning.' },
    { letter: 'è', name: 'E accent grave', ipa: ['ɛ'], soundNote: 'Usually represents an open-mid e sound.' },
    { letter: 'ù', name: 'U accent grave', ipa: ['y'], soundNote: 'In où, the accent distinguishes the word but does not create a new vowel quality.' },
    { letter: 'â', name: 'A accent circonflexe', ipa: ['a', 'ɑ'], soundNote: 'Often merged with plain a, with a backer quality retained by some speakers.' },
    { letter: 'ê', name: 'E accent circonflexe', ipa: ['ɛ'], soundNote: 'Usually represents an open-mid e sound.' },
    { letter: 'î', name: 'I accent circonflexe', ipa: ['i'], soundNote: 'Usually has the same vowel quality as plain i.' },
    { letter: 'ô', name: 'O accent circonflexe', ipa: ['o'], soundNote: 'Often marks a close-mid rounded o sound.' },
    { letter: 'û', name: 'U accent circonflexe', ipa: ['y'], soundNote: 'Uses the French high front rounded vowel.' },
    { letter: 'ç', name: 'Cédille', ipa: ['s'], soundNote: 'Makes c sound like s before a, o, or u.' },
    { letter: 'ë', name: 'E tréma', ipa: ['ə', 'e', 'ɛ'], soundNote: 'The diaeresis shows that e begins a separate syllable rather than joining the previous vowel.' },
    { letter: 'ï', name: 'I tréma', ipa: ['i'], soundNote: 'The diaeresis shows that i begins a separate syllable rather than joining the previous vowel.' },
    { letter: 'æ', name: 'A E ligature', ipa: ['e', 'ɛ'], soundNote: 'A rare ligature found mainly in learned words and names.' },
    { letter: 'œ', name: 'O E ligature', ipa: ['œ', 'e'], soundNote: 'A ligature whose vowel quality depends on the word and surrounding consonants.' },
  ],
  es: [
    { letter: 'á', name: 'A con tilde aguda', ipa: ['a'], soundNote: 'The accent marks stress; the vowel quality remains a.' },
    { letter: 'é', name: 'E con tilde aguda', ipa: ['e'], soundNote: 'The accent marks stress; the vowel quality remains e.' },
    { letter: 'í', name: 'I con tilde aguda', ipa: ['i'], soundNote: 'The accent marks stress and may separate a vowel sequence.' },
    { letter: 'ó', name: 'O con tilde aguda', ipa: ['o'], soundNote: 'The accent marks stress; the vowel quality remains o.' },
    { letter: 'ú', name: 'U con tilde aguda', ipa: ['u'], soundNote: 'The accent marks stress and may separate a vowel sequence.' },
    { letter: 'ü', name: 'U con diéresis', ipa: ['w'], soundNote: 'Shows that u is pronounced in güe and güi sequences.' },
    { letter: 'ñ', name: 'Eñe', ipa: ['ɲ'], soundNote: 'Represents a single palatal nasal consonant.' },
    {
      letter: '¿',
      name: 'Signo de interrogación invertido',
      phonetic: false,
      soundNote: 'This punctuation mark has no independent sound. It marks the beginning of a question.',
      commonMistake: 'Do not pronounce the mark or omit it in formal Spanish writing.',
    },
    {
      letter: '¡',
      name: 'Signo de exclamación invertido',
      phonetic: false,
      soundNote: 'This punctuation mark has no independent sound. It marks the beginning of an exclamation.',
      commonMistake: 'Do not pronounce the mark or omit it in formal Spanish writing.',
    },
  ],
  pt: [
    { letter: 'á', name: 'A com acento agudo', ipa: ['a'], soundNote: 'Marks a stressed open a vowel.' },
    { letter: 'à', name: 'A com acento grave', ipa: ['a'], soundNote: 'Marks crasis, the written fusion of two a forms, rather than a new phoneme.' },
    { letter: 'â', name: 'A com acento circunflexo', ipa: ['ɐ'], soundNote: 'Usually marks a stressed central vowel, with dialectal variation.' },
    { letter: 'ã', name: 'A com til', ipa: ['ɐ̃'], soundNote: 'Marks a nasal vowel or the nasal beginning of a diphthong.' },
    { letter: 'é', name: 'E com acento agudo', ipa: ['ɛ'], soundNote: 'Usually marks a stressed open e vowel.' },
    { letter: 'ê', name: 'E com acento circunflexo', ipa: ['e'], soundNote: 'Usually marks a stressed close e vowel.' },
    { letter: 'í', name: 'I com acento agudo', ipa: ['i'], soundNote: 'Marks a stressed i vowel.' },
    { letter: 'ó', name: 'O com acento agudo', ipa: ['ɔ'], soundNote: 'Usually marks a stressed open o vowel.' },
    { letter: 'ô', name: 'O com acento circunflexo', ipa: ['o'], soundNote: 'Usually marks a stressed close o vowel.' },
    { letter: 'õ', name: 'O com til', ipa: ['õ'], soundNote: 'Marks a nasal rounded vowel or nasal diphthong.' },
    { letter: 'ú', name: 'U com acento agudo', ipa: ['u'], soundNote: 'Marks a stressed u vowel.' },
    { letter: 'ç', name: 'C cedilha', ipa: ['s'], soundNote: 'Makes c represent s before a, o, or u.' },
  ],
  it: [
    { letter: 'à', name: 'A con accento grave', ipa: ['a'], soundNote: 'Usually marks stress on the a vowel.' },
    { letter: 'è', name: 'E con accento grave', ipa: ['ɛ'], soundNote: 'Marks an open stressed e.' },
    { letter: 'é', name: 'E con accento acuto', ipa: ['e'], soundNote: 'Marks a closed stressed e.' },
    { letter: 'ì', name: 'I con accento grave', ipa: ['i'], soundNote: 'Usually marks final stress on i.' },
    { letter: 'ò', name: 'O con accento grave', ipa: ['ɔ'], soundNote: 'Marks an open stressed o.' },
    { letter: 'ù', name: 'U con accento grave', ipa: ['u'], soundNote: 'Usually marks final stress on u.' },
  ],
  ro: [
    { letter: 'ă', name: 'A cu breve', ipa: ['ə'], soundNote: 'Represents a short central schwa-like vowel.' },
    { letter: 'â', name: 'A cu circumflex', ipa: ['ɨ'], soundNote: 'Represents the same central vowel as î, usually inside words.' },
    { letter: 'î', name: 'I cu circumflex', ipa: ['ɨ'], soundNote: 'Represents the same central vowel as â, often at word boundaries.' },
    { letter: 'ș', name: 'S cu virgulă', ipa: ['ʃ'], soundNote: 'Represents a voiceless sh sound.' },
    { letter: 'ț', name: 'T cu virgulă', ipa: ['t͡s'], soundNote: 'Represents a single ts affricate.' },
  ],
  de: [
    { letter: 'ä', name: 'A Umlaut', ipa: ['ɛ', 'ɛː'], soundNote: 'Represents short or long front e-like vowel qualities depending on the word.' },
    { letter: 'ö', name: 'O Umlaut', ipa: ['œ', 'øː'], soundNote: 'Represents short or long front rounded vowels.' },
    { letter: 'ü', name: 'U Umlaut', ipa: ['ʏ', 'yː'], soundNote: 'Represents short or long high front rounded vowels.' },
    {
      letter: 'ß',
      name: 'Eszett (scharfes S)',
      ipa: ['s'],
      soundNote: 'Represents a voiceless s sound and follows specific spelling rules after long vowels and diphthongs.',
      regionalVariants: 'Swiss Standard German uses ss instead of ß.',
    },
  ],
  ru: [
    { letter: 'а', name: 'A', ipa: ['a'] },
    { letter: 'б', name: 'Be', ipa: ['b'] },
    { letter: 'в', name: 'Ve', ipa: ['v'] },
    { letter: 'г', name: 'Ge', ipa: ['ɡ'] },
    { letter: 'д', name: 'De', ipa: ['d'] },
    { letter: 'е', name: 'Ye', ipa: ['je', 'e'], soundNote: 'Can begin with a y-like glide or mark softness on the preceding consonant.' },
    { letter: 'ё', name: 'Yo', ipa: ['jo', 'o'], soundNote: 'Can begin with a y-like glide or mark softness before o; it is always stressed.' },
    { letter: 'ж', name: 'Zhe', ipa: ['ʐ'] },
    { letter: 'з', name: 'Ze', ipa: ['z'] },
    { letter: 'и', name: 'I', ipa: ['i'], soundNote: 'Usually follows a soft consonant or helps mark consonant softness.' },
    { letter: 'й', name: 'Short I', ipa: ['j'] },
    { letter: 'к', name: 'Ka', ipa: ['k'] },
    { letter: 'л', name: 'El', ipa: ['l', 'lʲ'], soundNote: 'Has hard and soft realizations depending on the following letter.' },
    { letter: 'м', name: 'Em', ipa: ['m'] },
    { letter: 'н', name: 'En', ipa: ['n', 'nʲ'], soundNote: 'Has hard and soft realizations depending on the following letter.' },
    { letter: 'о', name: 'O', ipa: ['o', 'ɐ'], soundNote: 'Usually o when stressed and commonly reduced toward a central a-like vowel when unstressed.' },
    { letter: 'п', name: 'Pe', ipa: ['p'] },
    { letter: 'р', name: 'Er', ipa: ['r'] },
    { letter: 'с', name: 'Es', ipa: ['s'] },
    { letter: 'т', name: 'Te', ipa: ['t'] },
    { letter: 'у', name: 'U', ipa: ['u'] },
    { letter: 'ф', name: 'Ef', ipa: ['f'] },
    { letter: 'х', name: 'Kha', ipa: ['x'] },
    { letter: 'ц', name: 'Tse', ipa: ['t͡s'] },
    { letter: 'ч', name: 'Che', ipa: ['t͡ɕ'] },
    { letter: 'ш', name: 'Sha', ipa: ['ʂ'] },
    { letter: 'щ', name: 'Shcha', ipa: ['ɕː'] },
    {
      letter: 'ъ',
      name: 'Hard sign',
      soundNote: 'The hard sign has no sound of its own. It separates a consonant from a following iotated vowel.',
      commonMistake: 'Do not try to pronounce ъ as a vowel or consonant.',
    },
    { letter: 'ы', name: 'Yeru', ipa: ['ɨ'] },
    {
      letter: 'ь',
      name: 'Soft sign',
      soundNote: 'The soft sign has no sound of its own. It marks softness or separates sounds in specific words.',
      commonMistake: 'Do not pronounce ь separately; change the quality of the preceding consonant instead.',
    },
    { letter: 'э', name: 'E', ipa: ['e'], soundNote: 'Represents a non-iotated e vowel and does not soften a preceding consonant.' },
    { letter: 'ю', name: 'Yu', ipa: ['ju', 'u'], soundNote: 'Can begin with a y-like glide or mark softness on the preceding consonant.' },
    { letter: 'я', name: 'Ya', ipa: ['ja', 'a'], soundNote: 'Can begin with a y-like glide or mark softness on the preceding consonant.' },
  ],
  tr: [
    { letter: 'ç', name: 'Çe (C with cedilla)', ipa: ['t͡ʃ'] },
    {
      letter: 'ğ',
      name: 'Yumuşak ge (Soft G)',
      soundNote: 'Usually lengthens or connects neighboring vowels rather than producing a hard g sound.',
      regionalVariants: 'Its realization ranges from vowel lengthening to a weak glide depending on context and speaker.',
    },
    { letter: 'ı', name: 'Dotless I (lowercase)', ipa: ['ɯ'] },
    { letter: 'İ', name: 'Dotted İ (uppercase)', ipa: ['i'], soundNote: 'This is the uppercase form of dotted i.' },
    { letter: 'ö', name: 'Ö (O with umlaut)', ipa: ['ø'] },
    { letter: 'ş', name: 'Şe (S with cedilla)', ipa: ['ʃ'] },
    { letter: 'ü', name: 'Ü (U with umlaut)', ipa: ['y'] },
  ],
  pl: [
    { letter: 'ą', name: 'A ogonek', ipa: ['ɔ̃'], soundNote: 'A context-sensitive nasal vowel that often develops a glide or nasal consonant before other consonants.' },
    { letter: 'ć', name: 'C acute', ipa: ['t͡ɕ'] },
    { letter: 'ę', name: 'E ogonek', ipa: ['ɛ̃'], soundNote: 'A context-sensitive nasal vowel that may lose nasality or develop a glide.' },
    { letter: 'ł', name: 'L with stroke', ipa: ['w'] },
    { letter: 'ń', name: 'N acute', ipa: ['ɲ'] },
    { letter: 'ó', name: 'O acute', ipa: ['u'], soundNote: 'Pronounced like Polish u despite its spelling.' },
    { letter: 'ś', name: 'S acute', ipa: ['ɕ'] },
    { letter: 'ź', name: 'Z acute', ipa: ['ʑ'] },
    { letter: 'ż', name: 'Z with dot above', ipa: ['ʐ'] },
    { letter: 'z', name: 'Z', ipa: ['z'], soundNote: 'Represents the ordinary voiced z sound and contrasts with ź and ż.' },
  ],
  cs: [
    { letter: 'á', name: 'A with acute (dlouhé á)', ipa: ['aː'] },
    { letter: 'č', name: 'C with háček', ipa: ['t͡ʃ'] },
    { letter: 'ď', name: 'D with háček', ipa: ['ɟ'] },
    { letter: 'é', name: 'E with acute (dlouhé é)', ipa: ['eː'] },
    { letter: 'ě', name: 'E with háček', ipa: ['jɛ'], soundNote: 'Often introduces a y-like glide or marks palatalization after d, t, and n.' },
    { letter: 'í', name: 'I with acute (dlouhé í)', ipa: ['iː'] },
    { letter: 'ň', name: 'N with háček', ipa: ['ɲ'] },
    { letter: 'ó', name: 'O with acute (dlouhé ó)', ipa: ['oː'] },
    { letter: 'ř', name: 'R with háček (unique to Czech)', ipa: ['r̝'] },
    { letter: 'š', name: 'S with háček', ipa: ['ʃ'] },
    { letter: 'ť', name: 'T with háček', ipa: ['c'] },
    { letter: 'ú', name: 'U with acute', ipa: ['uː'] },
    { letter: 'ů', name: 'U with ring (kroužek)', ipa: ['uː'], soundNote: 'Has the same sound as ú but follows different spelling conventions.' },
    { letter: 'ý', name: 'Y with acute (dlouhé ý)', ipa: ['iː'] },
    { letter: 'ž', name: 'Z with háček', ipa: ['ʒ'] },
  ],
  vi: [
    { letter: 'ă', name: 'A breve', ipa: ['ă'], soundNote: 'Represents a shorter a quality and still carries any separately written tone mark.' },
    { letter: 'â', name: 'A circumflex', ipa: ['ə'], soundNote: 'Represents a short central vowel whose exact quality varies by dialect.' },
    { letter: 'đ', name: 'D with stroke', ipa: ['ɗ'], soundNote: 'Represents a distinct consonant from Vietnamese d.' },
    { letter: 'ê', name: 'E circumflex', ipa: ['e'] },
    { letter: 'ô', name: 'O circumflex', ipa: ['o'] },
    { letter: 'ơ', name: 'O with horn', ipa: ['ɤ'], soundNote: 'Represents an unrounded close-mid back vowel.' },
    { letter: 'ư', name: 'U with horn', ipa: ['ɯ'] },
    {
      letter: 'à',
      name: 'A with grave (huyền)',
      ipa: ['˨˩'],
      soundNote: 'The grave mark adds the huyền tone to the vowel.',
    },
    {
      letter: 'á',
      name: 'A with acute (sắc)',
      ipa: ['˧˥'],
      soundNote: 'The acute mark adds the sắc tone to the vowel.',
    },
    {
      letter: 'ả',
      name: 'A with hook (hỏi)',
      ipa: ['˧˩˧'],
      soundNote: 'The hook adds the hỏi tone; its contour varies significantly by region.',
    },
    {
      letter: 'ã',
      name: 'A with tilde (ngã)',
      ipa: ['˧ˀ˥'],
      soundNote: 'The tilde adds the ngã tone, often involving a rising contour and glottal interruption in northern speech.',
    },
    {
      letter: 'ạ',
      name: 'A with dot below (nặng)',
      ipa: ['˧˨ˀ'],
      soundNote: 'The dot below adds the nặng tone, commonly low and constricted in northern speech.',
    },
    ...createVietnameseToneSeries('A breve', 'ă', ['ắ', 'ằ', 'ẳ', 'ẵ', 'ặ']),
    ...createVietnameseToneSeries('A circumflex', 'ə', ['ấ', 'ầ', 'ẩ', 'ẫ', 'ậ']),
    ...createVietnameseToneSeries('E circumflex', 'e', ['ế', 'ề', 'ể', 'ễ', 'ệ']),
    ...createVietnameseToneSeries('O circumflex', 'o', ['ố', 'ồ', 'ổ', 'ỗ', 'ộ']),
    ...createVietnameseToneSeries('O with horn', 'ɤ', ['ớ', 'ờ', 'ở', 'ỡ', 'ợ']),
    ...createVietnameseToneSeries('U with horn', 'ɯ', ['ứ', 'ừ', 'ử', 'ữ', 'ự']),
  ],
  is: [
    { letter: 'á', name: 'A with acute', ipa: ['au̯'] },
    { letter: 'ð', name: 'Eth (voiced th)', ipa: ['ð'] },
    { letter: 'é', name: 'E with acute', ipa: ['jɛː'] },
    { letter: 'í', name: 'I with acute', ipa: ['iː'] },
    { letter: 'ó', name: 'O with acute', ipa: ['ou̯'] },
    { letter: 'ú', name: 'U with acute', ipa: ['uː'] },
    { letter: 'ý', name: 'Y with acute', ipa: ['iː'] },
    { letter: 'þ', name: 'Thorn (voiceless th)', ipa: ['θ'] },
    { letter: 'æ', name: 'Ash (ae ligature)', ipa: ['ai̯'] },
    { letter: 'ö', name: 'O with diaeresis', ipa: ['œ', 'œː'] },
  ],
}

export const languageVowelInventories: Record<string, string[]> = {
  fr: ['i', 'y', 'u', 'e', 'ø', 'o', 'ɛ', 'œ', 'ɔ', 'a', 'ə', 'ɛ̃', 'ɔ̃', 'ɑ̃'],
  es: ['i', 'e', 'a', 'o', 'u'],
  pt: ['i', 'ɨ', 'e', 'ɛ', 'a', 'ɐ', 'ɔ', 'o', 'u', 'ĩ', 'ẽ', 'ɐ̃', 'õ', 'ũ'],
  it: ['i', 'e', 'ɛ', 'a', 'ɔ', 'o', 'u'],
  ro: ['i', 'ɨ', 'u', 'e', 'o', 'a', 'ə'],
  de: ['iː', 'ɪ', 'yː', 'ʏ', 'eː', 'ɛ', 'ɛː', 'øː', 'œ', 'oː', 'ɔ', 'uː', 'ʊ', 'aː', 'a', 'ə'],
  ru: ['i', 'e', 'ɨ', 'a', 'o', 'u'],
  tr: ['i', 'y', 'ɯ', 'u', 'e', 'ø', 'o', 'a'],
  pl: ['i', 'ɨ', 'ɛ', 'a', 'ɔ', 'u', 'ɛ̃', 'ɔ̃'],
  cs: ['iː', 'ɪ', 'ɛː', 'ɛ', 'aː', 'a', 'oː', 'o', 'uː', 'u'],
  vi: ['i', 'e', 'ɛ', 'a', 'ɯ', 'ɨ', 'u', 'o', 'ɔ'],
  is: ['i', 'ɪ', 'e', 'ɛ', 'a', 'ɔ', 'o', 'u'],
}

export function getLanguageCharacters(code: string): CharacterSummary[] {
  return (characterCatalog[code] ?? []).map(({ letter, name }) => ({ letter, name }))
}

export function getLanguagePhoneticCharacters(code: string): CharacterSummary[] {
  return (characterCatalog[code] ?? [])
    .filter(character => character.phonetic !== false)
    .map(({ letter, name }) => ({ letter, name }))
}

export function getCharacterProfile(code: string, letter: string): CharacterProfile | undefined {
  const seed = characterCatalog[code]?.find(character => character.letter === letter)
    ?? characterCatalog[code]?.find(character =>
      character.letter.toLocaleLowerCase(code) === letter.toLocaleLowerCase(code),
    )
  const guidance = languageGuidance[code]
  if (!seed || seed.phonetic === false || !guidance) return undefined

  return {
    letter: seed.letter,
    name: seed.name,
    sounds: (seed.ipa ?? []).map(symbol => ({
      symbol,
      ...(soundDefinitions[symbol] ?? {
        name: 'IPA sound',
        articulation: 'Use the example audio and compare the sound carefully with the surrounding word.',
      }),
    })),
    soundNote: seed.soundNote ?? `This character commonly represents ${formatSoundList(seed.ipa ?? [])}.`,
    commonMistake: seed.commonMistake ?? guidance.commonMistake,
    regionalVariants: seed.regionalVariants ?? guidance.regionalVariants,
  }
}

export function getIpaSoundProfiles(languageCode?: string): IpaSoundProfile[] {
  const profiles = new Map<string, IpaSoundProfile>()
  const inventoryEntries = languageCode
    ? [[languageCode, languageVowelInventories[languageCode] ?? []] as const]
    : Object.entries(languageVowelInventories)

  for (const [code, symbols] of inventoryEntries) {
    for (const symbol of symbols) {
      const definition = soundDefinitions[symbol]
      if (!definition) continue
      const profile = profiles.get(symbol) ?? {
        symbol,
        ...definition,
        category: 'Vowels' as const,
        languageCodes: [],
        spellings: [],
      }
      if (!profile.languageCodes.includes(code)) {
        profile.languageCodes.push(code)
      }
      profiles.set(symbol, profile)
    }
  }

  const relevantCodes = new Set(inventoryEntries.map(([code]) => code))
  for (const [code, characters] of Object.entries(characterCatalog)) {
    if (!relevantCodes.has(code)) continue
    for (const character of characters) {
      const characterProfile = getCharacterProfile(code, character.letter)
      if (!characterProfile) continue

      for (const sound of characterProfile.sounds) {
        if (!languageVowelInventories[code]?.includes(sound.symbol)) continue
        const profile = profiles.get(sound.symbol)
        if (!profile) continue
        if (!profile.spellings.some(spelling =>
          spelling.languageCode === code && spelling.letter === character.letter,
        )) {
          profile.spellings.push({
            languageCode: code,
            letter: character.letter,
            characterName: character.name,
            soundNote: characterProfile.soundNote,
            commonMistake: characterProfile.commonMistake,
            regionalVariants: characterProfile.regionalVariants,
          })
        }
        profiles.set(sound.symbol, profile)
      }
    }
  }

  return [...profiles.values()].sort((left, right) =>
    left.symbol.localeCompare(right.symbol),
  )
}

export function getIpaSoundProfile(symbol: string): IpaSoundProfile | undefined {
  return getIpaSoundProfiles().find(profile => profile.symbol === symbol)
}

export function getIpaSoundPath(symbol?: string): string {
  return symbol
    ? `/phonetics/sounds/${encodeURIComponent(symbol)}`
    : '/phonetics'
}

export function getCharacterExamples(
  words: Word[],
  letter: string,
  locale: string,
  limit = 4,
): CharacterExample[] {
  const normalizedLetter = letter.toLocaleLowerCase(locale)
  const directMatches = words.filter(word =>
    word.choices[0]?.toLocaleLowerCase(locale) === normalizedLetter,
  )
  const candidates = directMatches.length
    ? directMatches
    : words.filter(word => word.word.toLocaleLowerCase(locale).includes(normalizedLetter))

  const seen = new Set<string>()
  const examples: CharacterExample[] = []
  for (const word of candidates) {
    if (seen.has(word.word)) continue
    seen.add(word.word)
    examples.push({
      word: word.word,
      meaning: word.meaning,
      ipa: word.ipa,
      focusedIpa: word.ipaFocus
        .map(([start, end]) => word.ipa.slice(start, end))
        .join(''),
    })
    if (examples.length === limit) break
  }
  return examples
}

function formatSoundList(symbols: string[]): string {
  if (!symbols.length) return 'no independent sound'
  return symbols.map(symbol => `/${symbol}/`).join(' or ')
}

function createVietnameseToneSeries(
  baseName: string,
  vowelIpa: string,
  letters: [string, string, string, string, string],
): CharacterSeed[] {
  const tones = [
    { name: 'acute (sắc)', ipa: '˧˥' },
    { name: 'grave (huyền)', ipa: '˨˩' },
    { name: 'hook (hỏi)', ipa: '˧˩˧' },
    { name: 'tilde (ngã)', ipa: '˧ˀ˥' },
    { name: 'dot below (nặng)', ipa: '˧˨ˀ' },
  ]

  return letters.map((letter, index) => ({
    letter,
    name: `${baseName} with ${tones[index].name}`,
    ipa: [vowelIpa, tones[index].ipa],
    soundNote: `Combines the ${baseName.toLowerCase()} vowel with the ${tones[index].name} tone.`,
  }))
}
