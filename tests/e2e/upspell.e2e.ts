import { expect, test, type Page } from '@playwright/test'
import french from '../../data/words/fr'
import { getDailyIndexForDayKey } from '../../utils/game'

const testDay = '2026-09-04'
const dailyWord = french.words[getDailyIndexForDayKey(french.words.length, testDay)]
const correctChoice = dailyWord.choices[0]
const wrongChoice = dailyWord.choices.find(choice => choice !== correctChoice)
const focusedIpa = dailyWord.ipaFocus
  .map(([start, end]) => dailyWord.ipa.slice(start, end))
  .join('')

if (!wrongChoice) {
  throw new Error('French test data requires at least one incorrect choice')
}

async function waitForHydration(page: Page) {
  await expect(page.locator('[data-app-ready="true"]')).toBeVisible()
}

async function openAppAt(page: Page, time = '2026-09-04T12:00:00-07:00') {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install({
    time: new Date(time),
  })
  await page.goto('/')
  await waitForHydration(page)
}

async function openFrenchChallenge(page: Page) {
  await page.getByRole('button', { name: /French challenge$/ }).click()
  await expect(page.getByRole('button', { name: 'Back to the map' })).toBeVisible()
}

test('records and restores the daily result', async ({ page }) => {
  await openAppAt(page)
  await openFrenchChallenge(page)
  await page.getByRole('button', { name: correctChoice, exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Perfect choice!' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Share result' })).toBeVisible()
  await expect(page.locator('.ipa-transcription')).toContainText(dailyWord.ipa)
  await expect(page.locator('.ipa-focus')).toHaveText(focusedIpa)

  await page.reload()
  await waitForHydration(page)
  await openFrenchChallenge(page)

  await expect(page.getByRole('heading', { name: 'Perfect choice!' })).toBeVisible()
  await expect(page.locator('.word-reveal')).toHaveText(dailyWord.word)
})

test('offers missed words as practice', async ({ page }) => {
  await openAppAt(page)
  await openFrenchChallenge(page)
  await page.getByRole('button', { name: wrongChoice, exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Almost there!' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to the map' }).click()
  await page.getByRole('button', { name: 'Revisit route French challenge' }).click()

  await expect(page.getByRole('button', { name: correctChoice, exact: true })).toBeVisible()
})

test('offers natural and slow pronunciation playback', async ({ page }) => {
  await page.addInitScript(() => {
    interface RecordedSpeech {
      text: string
      lang: string
      rate: number
    }

    const recorded: RecordedSpeech[] = []
    class MockUtterance {
      text: string
      lang = ''
      rate = 1
      voice = null
      onstart: (() => void) | null = null
      onend: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor(text: string) {
        this.text = text
      }
    }

    Object.defineProperty(window, '__upspellSpeech', {
      configurable: true,
      value: recorded,
    })
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockUtterance,
    })
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel() {},
        getVoices() {
          return []
        },
        speak(utterance: MockUtterance) {
          recorded.push({
            text: utterance.text,
            lang: utterance.lang,
            rate: utterance.rate,
          })
          utterance.onstart?.()
          utterance.onend?.()
        },
      },
    })
  })

  await openAppAt(page)
  await openFrenchChallenge(page)
  await page.getByRole('button', { name: correctChoice, exact: true }).click()

  await page.getByRole('button', {
    name: `Hear ${dailyWord.word} at a natural pace`,
  }).click()
  await page.getByRole('button', {
    name: `Hear ${dailyWord.word} slowly`,
  }).click()
  const spoken = await page.evaluate(() => (
    window as typeof window & {
      __upspellSpeech: Array<{ text: string; lang: string; rate: number }>
    }
  ).__upspellSpeech)

  expect(spoken).toEqual([
    { text: dailyWord.word, lang: 'fr-FR', rate: 0.9 },
    { text: dailyWord.word, lang: 'fr-FR', rate: 0.58 },
  ])
})

test('navigates between the map, stats, and character collection', async ({ page }) => {
  await openAppAt(page)
  await page.getByRole('button', { name: /^Stats/ }).click()
  await expect(page).toHaveURL('/stats')
  await expect(page.getByRole('heading', { name: 'Stats', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to the map' }).click()

  await page.getByRole('button', { name: /^Characters/ }).click()
  await expect(page).toHaveURL('/reference')
  await expect(page.getByRole('heading', { name: 'Characters', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to the map' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Choose your next language' })).toBeVisible()
})

test('persists the selected theme', async ({ page }) => {
  await openAppAt(page)
  const themeToggle = page.getByRole('button', { name: 'Switch to dark mode' })
  await themeToggle.click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
})

test('refreshes an open daily challenge after local midnight', async ({ page }) => {
  await openAppAt(page, '2026-09-04T23:59:59-07:00')
  await openFrenchChallenge(page)
  await page.getByRole('button', { name: correctChoice, exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Perfect choice!' })).toBeVisible()

  await page.clock.fastForward(1_200)

  await expect(page.getByRole('heading', { name: 'Perfect choice!' })).toBeHidden()
  await expect(page.locator('.choice-marker')).toHaveCount(4)
})
