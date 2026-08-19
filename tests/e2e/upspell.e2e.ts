import { expect, test, type Page } from '@playwright/test'
import french from '../../data/words/fr'
import {
  getCharacterProfile,
  getIpaSoundPath,
} from '../../data/characterProfiles'
import { getDailyIndexForDayKey } from '../../utils/game'

const testDay = '2026-09-04'
const dailyWord = french.words[getDailyIndexForDayKey(french.words.length, testDay)]
const correctChoice = dailyWord.choices[0]
const wrongChoice = dailyWord.choices.find(choice => choice !== correctChoice)
const focusedIpa = dailyWord.ipaFocus
  .map(([start, end]) => dailyWord.ipa.slice(start, end))
  .join('')
const dailySound = getCharacterProfile('fr', correctChoice)?.sounds[0]

if (!wrongChoice || !dailySound) {
  throw new Error('French test data requires an incorrect choice and IPA sound')
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
  await expect(page.getByRole('link', {
    name: `Study /${dailySound.symbol}/`,
  })).toHaveAttribute(
    'href',
    getIpaSoundPath(dailySound.symbol),
  )
  await expect(page.getByRole('link', {
    name: 'Phonetics',
    exact: true,
  })).toHaveAttribute('href', '/phonetics/fr')
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
  await expect(page.getByRole('link', {
    name: `Study /${dailySound.symbol}/`,
  })).toBeVisible()
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
  await page.getByRole('link', { name: 'Stats', exact: true }).click()
  await expect(page).toHaveURL('/stats')
  await expect(page.getByRole('heading', { name: 'Stats', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Back to the map' }).click()

  await page.getByRole('link', { name: 'Characters', exact: true }).click()
  await expect(page).toHaveURL('/reference')
  await expect(page.getByRole('heading', { name: 'Characters', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Phonetics', exact: true }).click()
  await expect(page).toHaveURL('/phonetics')
  await expect(page.getByRole('heading', { name: 'Phonetics', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Map', exact: true }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Choose your next language' })).toBeVisible()
})

test('opens an IPA sound profile and plays an example', async ({ page }) => {
  await page.addInitScript(() => {
    const recorded: string[] = []
    class MockUtterance {
      lang = ''
      rate = 1
      voice = null
      onstart: (() => void) | null = null
      onend: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor(public text: string) {}
    }

    Object.defineProperty(window, '__upspellProfileSpeech', {
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
          recorded.push(utterance.text)
          utterance.onstart?.()
          utterance.onend?.()
        },
      },
    })
  })

  await openAppAt(page)
  await page.goto('/phonetics/fr')
  await waitForHydration(page)
  await page.getByRole('link', {
    name: 'Open IPA vowel /e/',
  }).click()

  await expect(page).toHaveURL('/phonetics/sounds/e')
  await expect(page.getByRole('heading', { name: 'How this sound is written' })).toBeVisible()
  await expect(page.getByRole('heading', {
    name: 'close-mid front unrounded vowel',
    exact: true,
  })).toBeVisible()
  await expect(page.getByRole('link', {
    name: 'Characters',
    exact: true,
  })).toHaveAttribute('href', '/reference')
  await expect(page.getByRole('link', {
    name: 'Phonetics',
    exact: true,
  })).toHaveAttribute('aria-current', 'page')

  const exampleButton = page.getByRole('button', { name: /^Hear .+ pronounced in .+$/ }).first()
  await exampleButton.click()
  const spoken = await page.evaluate(() => (
    window as typeof window & { __upspellProfileSpeech: string[] }
  ).__upspellProfileSpeech)
  expect(spoken).toHaveLength(1)
})

test('shows the complete Romanian vowel inventory without a scrolling filter row', async ({ page }) => {
  await openAppAt(page)
  await page.goto('/phonetics')
  await waitForHydration(page)
  const directoryWidth = await page.locator('.atlas-panel').evaluate(element =>
    element.getBoundingClientRect().width,
  )
  const directoryHeadingOffset = await page.locator('.phonetics-directory-heading').evaluate((element) => {
    const panel = element.closest('.atlas-panel')
    return element.getBoundingClientRect().top - (panel?.getBoundingClientRect().top ?? 0)
  })
  const directoryTitleStyle = await page.locator('.phonetics-directory-heading h2').evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      marginTop: style.marginTop,
    }
  })

  await page.goto('/phonetics/ro')
  await waitForHydration(page)
  const languageWidth = await page.locator('.atlas-panel').evaluate(element =>
    element.getBoundingClientRect().width,
  )
  const languageHeadingOffset = await page.locator('.phonetics-directory-heading').evaluate((element) => {
    const panel = element.closest('.atlas-panel')
    return element.getBoundingClientRect().top - (panel?.getBoundingClientRect().top ?? 0)
  })
  const languageTitleStyle = await page.locator('.phonetics-directory-heading h2').evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      marginTop: style.marginTop,
    }
  })

  expect(directoryWidth).toBe(languageWidth)
  expect(languageHeadingOffset).toBe(directoryHeadingOffset)
  expect(languageTitleStyle).toEqual(directoryTitleStyle)
  await expect(page.locator('.sound-card')).toHaveCount(7)
  for (const symbol of ['i', 'ɨ', 'u', 'e', 'o', 'a', 'ə']) {
    await expect(page.getByRole('link', {
      name: `Open IPA vowel /${symbol}/`,
    })).toBeVisible()
  }

  const filterDimensions = await page.locator('.language-switcher').evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(filterDimensions.scrollWidth).toBeLessThanOrEqual(filterDimensions.clientWidth)
  const filterWidths = await page.locator('.language-switcher a').evaluateAll(links =>
    links.map(link => link.getBoundingClientRect().width),
  )
  expect(new Set(filterWidths).size).toBe(1)
  const cardText = await page.locator('.sound-card').allTextContents()
  expect(cardText.join(' ')).not.toContain('unrounded vowel')
  expect(cardText.join(' ')).not.toContain('rounded vowel')
})

test('copies a special character directly from its character card', async ({ page }) => {
  await page.addInitScript(() => {
    const copied: string[] = []
    Object.defineProperty(window, '__upspellCopiedCharacters', {
      configurable: true,
      value: copied,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        async writeText(text: string) {
          copied.push(text)
        },
      },
    })
  })

  await openAppAt(page)
  await page.goto('/fr')
  await waitForHydration(page)
  await page.getByRole('button', {
    name: 'Copy é, E accent aigu',
  }).click()

  await expect(page.locator('.copy-toast')).toContainText('Character copied to your clipboard.')
  const copied = await page.evaluate(() => (
    window as typeof window & { __upspellCopiedCharacters: string[] }
  ).__upspellCopiedCharacters)
  expect(copied).toEqual(['é'])
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
