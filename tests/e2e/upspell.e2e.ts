import { expect, test, type Page } from '@playwright/test'
import french from '../../data/words/fr'
import {
  getCharacterProfile,
  getIpaSoundProfile,
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
  await expect(page.getByRole('button', { name: 'Back to challenges' })).toBeVisible()
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
  await page.getByRole('button', { name: 'Back to challenges' }).click()
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
  await expect(page.locator('.bottom-navigation-link > span:last-child')).toHaveText([
    'Challenge',
    'Phonetics',
    'Characters',
    'Stats',
  ])
  const phoneticsGlyph = await page.locator('.phonetics-glyph').evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(phoneticsGlyph.scrollWidth).toBeLessThanOrEqual(phoneticsGlyph.clientWidth)
  await page.getByRole('link', { name: 'Stats', exact: true }).click()
  await expect(page).toHaveURL('/stats')
  await expect(page.getByRole('heading', { name: 'Stats', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Challenge', exact: true }).click()

  await page.getByRole('link', { name: 'Characters', exact: true }).click()
  await expect(page).toHaveURL('/reference')
  await expect(page.getByRole('heading', { name: 'Characters', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Phonetics', exact: true }).click()
  await expect(page).toHaveURL('/phonetics')
  await expect(page.getByRole('heading', { name: 'Phonetics', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Challenge', exact: true }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Choose a language to begin' })).toBeVisible()
})

test('cycles through the main pages with the header arrows', async ({ page }) => {
  await openAppAt(page)

  const clockwise = [
    { button: 'Phonetics', path: '/phonetics' },
    { button: 'Characters', path: '/reference' },
    { button: 'Stats', path: '/stats' },
    { button: 'Challenge', path: '/' },
  ]
  for (const step of clockwise) {
    await page.getByRole('button', { name: step.button, exact: true }).click()
    await expect(page).toHaveURL(step.path)
  }

  const counterclockwise = [
    { button: 'Stats', path: '/stats' },
    { button: 'Characters', path: '/reference' },
    { button: 'Phonetics', path: '/phonetics' },
    { button: 'Challenge', path: '/' },
  ]
  for (const step of counterclockwise) {
    await page.getByRole('button', { name: step.button, exact: true }).click()
    await expect(page).toHaveURL(step.path)
  }
})

test('uses the same section header styling across the main pages', async ({ page }) => {
  await openAppAt(page)

  const pages = [
    {
      path: '/',
      eyebrow: '12 languages, one daily challenge',
      heroTitle: 'Daily Spelling Challenge',
      title: 'Choose a language to begin',
    },
    {
      path: '/phonetics',
      eyebrow: 'UpSpell Language Atlas',
      heroTitle: 'Phonetics',
      title: 'Explore sounds',
    },
    {
      path: '/reference',
      eyebrow: 'UpSpell Language Atlas',
      heroTitle: 'Characters',
      title: 'Choose a language',
    },
    {
      path: '/stats',
      eyebrow: 'UpSpell Language Atlas',
      heroTitle: 'Stats',
      title: 'Your progress',
    },
  ]
  const headerStyles = []
  const pageLayouts = []

  for (const destination of pages) {
    await page.goto(destination.path)
    await waitForHydration(page)
    await expect(page.locator('.atlas-hero').getByText(destination.eyebrow, {
      exact: true,
    })).toBeVisible()
    await expect(page.getByRole('heading', {
      name: destination.heroTitle,
      exact: true,
      level: 1,
    })).toBeVisible()
    await expect(page.getByRole('heading', {
      name: destination.title,
      exact: true,
    })).toBeVisible()

    headerStyles.push(await page.locator('.atlas-section-heading').evaluate((element) => {
      const heading = element.querySelector('h2')
      const eyebrow = element.querySelector('.atlas-section-eyebrow')
      const description = element.querySelector('.atlas-section-description')
      const headingStyle = heading ? window.getComputedStyle(heading) : null
      const eyebrowStyle = eyebrow ? window.getComputedStyle(eyebrow) : null
      const descriptionStyle = description ? window.getComputedStyle(description) : null
      const headerStyle = window.getComputedStyle(element)
      const accentStyle = window.getComputedStyle(element, '::after')

      return {
        title: {
          fontFamily: headingStyle?.fontFamily,
          fontSize: headingStyle?.fontSize,
          fontWeight: headingStyle?.fontWeight,
          lineHeight: headingStyle?.lineHeight,
          marginTop: headingStyle?.marginTop,
        },
        eyebrow: {
          fontFamily: eyebrowStyle?.fontFamily,
          fontSize: eyebrowStyle?.fontSize,
          fontWeight: eyebrowStyle?.fontWeight,
          letterSpacing: eyebrowStyle?.letterSpacing,
        },
        description: {
          fontFamily: descriptionStyle?.fontFamily,
          fontSize: descriptionStyle?.fontSize,
          lineHeight: descriptionStyle?.lineHeight,
          marginTop: descriptionStyle?.marginTop,
        },
        divider: {
          borderWidth: headerStyle.borderBottomWidth,
          paddingBottom: headerStyle.paddingBottom,
          accentWidth: accentStyle.width,
          accentHeight: accentStyle.height,
          accentColor: accentStyle.backgroundColor,
        },
      }
    }))

    pageLayouts.push(await page.evaluate(() => {
      const hero = document.querySelector('.atlas-hero')
      const panel = document.querySelector('.atlas-panel')
      const panelBody = document.querySelector('.atlas-panel-body')
      const heading = document.querySelector('.atlas-section-heading')
      const navigation = document.querySelector('.atlas-navigation')
      const heroTitle = hero?.querySelector('h1')
      const heroSubtitle = hero?.querySelector('p:last-child')

      if (!hero || !panel || !panelBody || !heading || !heroTitle || !heroSubtitle) {
        throw new Error('Expected the shared page layout to be present')
      }

      const heroRect = hero.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()
      const panelBodyRect = panelBody.getBoundingClientRect()
      const headingRect = heading.getBoundingClientRect()
      const navigationRect = navigation?.getBoundingClientRect()
      const heroTitleStyle = window.getComputedStyle(heroTitle)
      const heroSubtitleStyle = window.getComputedStyle(heroSubtitle)

      return {
        heroHeight: Math.round(heroRect.height),
        heroTitleLines: Math.round(
          heroTitle.getBoundingClientRect().height / Number.parseFloat(heroTitleStyle.lineHeight),
        ),
        heroSubtitleLines: Math.round(
          heroSubtitle.getBoundingClientRect().height / Number.parseFloat(heroSubtitleStyle.lineHeight),
        ),
        panelGap: Math.round(panelRect.top - heroRect.bottom),
        bodyWidth: Math.round(panelBodyRect.width),
        bodyLeftInset: Math.round(panelBodyRect.left - panelRect.left),
        headingLeftOffset: Math.round(headingRect.left - panelBodyRect.left),
        navigationLeftOffset: navigationRect
          ? Math.round(navigationRect.left - panelBodyRect.left)
          : null,
        navigationHeadingGap: navigationRect
          ? Math.round(headingRect.top - navigationRect.bottom)
          : null,
      }
    }))
  }

  expect(new Set(headerStyles.map(style => JSON.stringify(style))).size).toBe(1)
  expect(new Set(pageLayouts.map(layout => layout.heroHeight)).size).toBe(1)
  expect(pageLayouts.every(layout => layout.heroTitleLines === 1)).toBe(true)
  expect(pageLayouts.every(layout => layout.heroSubtitleLines === 1)).toBe(true)
  expect(new Set(pageLayouts.map(layout => layout.panelGap)).size).toBe(1)
  expect(new Set(pageLayouts.map(layout => layout.bodyWidth)).size).toBe(1)
  expect(new Set(pageLayouts.map(layout => layout.bodyLeftInset)).size).toBe(1)
  expect(pageLayouts.every(layout => layout.headingLeftOffset === 0)).toBe(true)

  const pagesWithNavigation = pageLayouts.filter(
    layout => layout.navigationLeftOffset !== null,
  )
  expect(pagesWithNavigation.every(layout => layout.navigationLeftOffset === 0)).toBe(true)
  expect(new Set(pagesWithNavigation.map(layout => layout.navigationHeadingGap)).size).toBe(1)
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
  const examplesTop = await page.getByRole('heading', { name: 'Example words' }).evaluate(element =>
    element.getBoundingClientRect().top,
  )
  const spellingsTop = await page.getByRole('heading', { name: 'How this sound is written' }).evaluate(element =>
    element.getBoundingClientRect().top,
  )
  expect(examplesTop).toBeLessThan(spellingsTop)
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
  const exampleLanguages = await page.locator('.example-language').allTextContents()
  expect(new Set(exampleLanguages).size).toBe(exampleLanguages.length)
  expect(exampleLanguages).toHaveLength(getIpaSoundProfile('e')?.languageCodes.length ?? 0)

  const exampleButton = page.getByRole('button', { name: /^Hear .+ pronounced in .+$/ }).first()
  await exampleButton.click()
  const spoken = await page.evaluate(() => (
    window as typeof window & { __upspellProfileSpeech: string[] }
  ).__upspellProfileSpeech)
  expect(spoken).toHaveLength(1)

  await page.getByRole('link', { name: 'Stats', exact: true }).click()
  await expect(page.getByText('Vowels explored', { exact: true }).first()).toBeVisible()
  await expect(page.locator('.route-card').filter({ hasText: 'French' }))
    .toContainText('1/14')
})

test('uses ordinary Spanish vowel spellings in phonetics', async ({ page }) => {
  await openAppAt(page)
  await page.goto('/phonetics/es')
  await waitForHydration(page)

  for (const symbol of ['a', 'e', 'i', 'o', 'u']) {
    const card = page.getByRole('link', {
      name: `Open IPA vowel /${symbol}/`,
    })
    await expect(card).toContainText(`Written as ${symbol}`)
  }
  const symbolAlignment = await page.locator('.sound-symbol').first().evaluate((element) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    const textRect = range.getBoundingClientRect()
    const containerRect = element.getBoundingClientRect()
    return Math.abs(
      (textRect.top + textRect.height / 2)
      - (containerRect.top + containerRect.height / 2),
    )
  })
  expect(symbolAlignment).toBeLessThan(2)
  const spanishCardText = await page.locator('.sound-card').allTextContents()
  expect(spanishCardText.join(' ')).not.toMatch(/[áéíóú]/u)
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

test('uses the character card hover treatment on reference cards', async ({ page }) => {
  async function readHoverStyle(path: string, selector: string) {
    await page.goto(path)
    await waitForHydration(page)
    const card = page.locator(selector).first()
    await card.hover()
    return card.evaluate((element) => {
      const style = window.getComputedStyle(element)
      return {
        borderColor: style.borderColor,
        boxShadow: style.boxShadow,
        transform: style.transform,
        accentColor: window.getComputedStyle(element, '::before').backgroundColor,
      }
    })
  }

  await openAppAt(page)
  const lightReferenceStyle = await readHoverStyle('/reference', '.language-guide-card')
  const lightCharacterStyle = await readHoverStyle('/es', '.character-card')
  expect(lightReferenceStyle).toEqual(lightCharacterStyle)
  const lightSoundStyle = await readHoverStyle('/phonetics/es', '.sound-card')
  expect(lightSoundStyle).toEqual(lightCharacterStyle)

  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  const darkCharacterStyle = await readHoverStyle('/es', '.character-card')
  const darkReferenceStyle = await readHoverStyle('/reference', '.language-guide-card')
  expect(darkReferenceStyle).toEqual(darkCharacterStyle)
  const darkSoundStyle = await readHoverStyle('/phonetics/es', '.sound-card')
  expect(darkSoundStyle).toEqual(darkCharacterStyle)
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
