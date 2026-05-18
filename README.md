<p align="center">
  <img width="96" height="96" src="./public/upspell_logo.png" alt="UpSpell logo">
</p>

# UpSpell

[UpSpell](https://upspell.vercel.app/) is a free daily spelling game for practicing accented characters, distinctive letters, and unfamiliar alphabets. Choose a language, complete one word, and build a streak without creating an account.

## Features

- One deterministic word per language every day at **00:00 UTC**
- 4,380 validated prompts: 365 words in each of 12 languages
- Shuffled answer positions that remain stable for the day
- Per-language streaks, accuracy, and best-streak statistics
- Practice mode for words you missed
- Pronunciation playback, spelling guidance, meanings, and answer explanations
- Search-free character reference with one-click copy
- Installable PWA with locally cached flags and offline navigation
- Light and dark themes

## Supported languages

| Language | Reference | Language | Reference |
| --- | --- | --- | --- |
| French | [/fr](https://upspell.vercel.app/fr) | Spanish | [/es](https://upspell.vercel.app/es) |
| Portuguese | [/pt](https://upspell.vercel.app/pt) | Italian | [/it](https://upspell.vercel.app/it) |
| Romanian | [/ro](https://upspell.vercel.app/ro) | German | [/de](https://upspell.vercel.app/de) |
| Russian | [/ru](https://upspell.vercel.app/ru) | Turkish | [/tr](https://upspell.vercel.app/tr) |
| Polish | [/pl](https://upspell.vercel.app/pl) | Czech | [/cs](https://upspell.vercel.app/cs) |
| Vietnamese | [/vi](https://upspell.vercel.app/vi) | Icelandic | [/is](https://upspell.vercel.app/is) |

## How it works

The UTC day selects one of the 365 prompts for each language. A seeded Fisher-Yates shuffle uses the day, language, and word to produce a stable choice order without revealing the answer position. Completed daily games, streaks, stats, theme preference, and missed-word practice queues are stored only in the browser's local storage.

UpSpell does not use accounts, analytics, or a backend. Clearing site data resets local progress.

## Local development

Requirements:

- Node.js 20 (see [`.nvmrc`](./.nvmrc))
- npm

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Nuxt development server |
| `npm test` | Run gameplay, dataset, and accessibility regression tests |
| `npm run typecheck` | Run Nuxt and Vue TypeScript checks |
| `npm run build` | Create the production server build |
| `npm run generate` | Generate the static site and service worker |
| `npm run check` | Run tests, type checking, and static generation |
| `npm run preview` | Preview a production build |

## Project structure

```text
components/       Shared game, navigation, and character cards
composables/      Shared route metadata
data/             Language metadata and the validated prompt dataset
pages/            Daily game, stats, reference, and language routes
public/           Local flags, icons, and social artwork
tests/            Gameplay, content-integrity, and accessibility tests
utils/            Date, shuffle, progress-recovery, and clipboard logic
```

## Deployment

The repository includes [`vercel.json`](./vercel.json) for Vercel's Nuxt integration. Connect the repository to Vercel and keep the detected Node version aligned with `.nvmrc`. Pull requests and pushes run the GitHub Actions workflow in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml), which validates tests, types, static generation, PWA output, and high-severity dependency advisories.

## Content and browser notes

- Pronunciation uses the browser's Web Speech API, so voice quality and language availability depend on the operating system and browser.
- Clipboard actions use the modern Clipboard API with a legacy browser fallback.
- The interface is designed for current versions of Chrome, Edge, Firefox, and Safari.
- Language tips are concise learning guidance, not a substitute for a complete grammar reference.

Made with 🦔 by **Rodrigo Ramirez**.
