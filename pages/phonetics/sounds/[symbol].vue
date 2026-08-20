<template>
  <AtlasPageShell>
    <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

    <AtlasHero
      :title="`/${sound.symbol}/`"
      :subtitle="sound.name"
    />

    <AtlasPanel class="mx-auto my-6 max-w-6xl px-5 py-7 sm:my-10 sm:px-10 sm:py-9">
      <AtlasNavigation
        back-label="Back to IPA sounds"
        back-to="/phonetics"
        forward-label="Copy characters"
        forward-to="/reference"
        label="IPA sound profile navigation"
      />

      <header class="sound-heading">
        <span class="sound-specimen">/{{ sound.symbol }}/</span>
        <span>
          <p class="profile-kicker">{{ sound.category }}</p>
          <h2>{{ sound.name }}</h2>
          <p>{{ sound.articulation }}</p>
          <a
            :href="officialIpaChartUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ipa-source-link"
          >
            View the official IPA chart
            <span aria-hidden="true">↗</span>
          </a>
        </span>
      </header>

      <section class="profile-section" aria-labelledby="examples-heading">
        <div class="section-heading">
          <span>
            <p class="profile-kicker">Listen in context</p>
            <h2 id="examples-heading">Example words</h2>
          </span>
          <span class="section-count">{{ examples.length }} examples</span>
        </div>

        <div v-if="examples.length" class="example-grid">
          <article
            v-for="example in examples"
            :key="`${example.languageCode}-${example.word}`"
            class="example-card"
          >
            <span>
              <span class="example-language">{{ example.languageName }}</span>
              <strong :lang="example.languageCode">{{ example.word }}</strong>
              <small>/{{ example.ipa }}/</small>
              <p>{{ example.meaning }}</p>
            </span>
            <button
              type="button"
              class="example-audio"
              :class="{ 'example-audio-active': activeExample === example.key }"
              :aria-label="`Hear ${example.word} pronounced in ${example.languageName}`"
              :aria-pressed="activeExample === example.key"
              @click="speakExample(example)"
            >
              <span aria-hidden="true">▶</span>
            </button>
          </article>
        </div>
        <p v-else class="empty-examples">
          No matching spoken example is currently available.
        </p>
      </section>

      <section class="profile-section" aria-labelledby="spellings-heading">
        <div class="section-heading">
          <span>
            <p class="profile-kicker">Across languages</p>
            <h2 id="spellings-heading">How this sound is written</h2>
          </span>
          <span class="section-count">
            {{ sound.languageCodes.length }}
            {{ sound.languageCodes.length === 1 ? 'language' : 'languages' }}
          </span>
        </div>

        <div class="spelling-grid">
          <article
            v-for="language in enrichedLanguages"
            :key="language.code"
            class="spelling-card"
          >
            <div class="spelling-heading">
              <span class="language-flag">
                <img :src="language.flag" alt="" />
              </span>
              <span>
                <strong>{{ language.englishName }}</strong>
                <NuxtLink :to="`/phonetics/${language.code}`">
                  View {{ language.englishName }} vowels
                </NuxtLink>
              </span>
            </div>
            <p v-if="language.spellings.length" class="language-spellings">
              Written here as
              <span
                v-for="letter in language.spellings"
                :key="letter"
                :lang="language.code"
              >{{ letter }}</span>
            </p>
            <p v-else>
              See the example word above for a spelling connection.
            </p>
          </article>
        </div>
      </section>
    </AtlasPanel>
  </AtlasPageShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  getIpaSoundProfile,
  officialIpaChartUrl,
} from '~/data/characterProfiles'
import { getLanguageMetadata } from '~/data/languageMetadata'
import {
  getIpaSoundExamples,
  type SoundExample,
} from '~/data/soundExamples'
import { getSpeechVoice } from '~/utils/pronunciation'

const route = useRoute()
const symbol = String(route.params.symbol)
const sound = getIpaSoundProfile(symbol)

if (!sound) {
  throw createError({
    statusCode: 404,
    statusMessage: 'IPA sound profile not found',
  })
}
const resolvedSound = sound

const { data: soundExamples } = await useAsyncData(
  `ipa-sound-${resolvedSound.symbol}`,
  () => getIpaSoundExamples(resolvedSound.symbol),
)
const examples = computed(() => soundExamples.value ?? [])
const enrichedLanguages = computed(() =>
  sound.languageCodes.map((code) => {
    const metadata = getLanguageMetadata(code)
    const markedSpellings = sound.spellings
      .filter(spelling => spelling.languageCode === code)
      .map(spelling => spelling.letter)
    const exampleSpellings = examples.value
      .filter(example => example.languageCode === code)
      .flatMap(example => example.spelling ? [example.spelling] : [])

    return {
      ...metadata,
      spellings: [...new Set([...markedSpellings, ...exampleSpellings])].slice(0, 6),
    }
  }),
)
const activeExample = ref('')
const announcement = ref('')
let speechRequest = 0

usePageSeo({
  title: `/${sound.symbol}/ ${sound.name} | UpSpell`,
  description: `Learn how to articulate the IPA sound /${sound.symbol}/ and compare its spellings and examples across languages.`,
  path: `/phonetics/sounds/${encodeURIComponent(sound.symbol)}`,
})

function cancelSpeech() {
  speechRequest++
  activeExample.value = ''
  if (import.meta.client && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

function speakExample(example: SoundExample) {
  if (!import.meta.client || !('speechSynthesis' in window)) {
    announcement.value = 'Pronunciation is not supported by this browser.'
    return
  }

  cancelSpeech()
  const request = speechRequest
  const utterance = new SpeechSynthesisUtterance(example.word)
  utterance.lang = example.speechLocale
  utterance.rate = 0.82
  utterance.voice = getSpeechVoice(
    window.speechSynthesis.getVoices(),
    example.speechLocale,
  )
  utterance.onstart = () => {
    if (request !== speechRequest) return
    activeExample.value = example.key
    announcement.value = `Playing ${example.word} in ${example.languageName}.`
  }
  utterance.onend = () => {
    if (request !== speechRequest) return
    activeExample.value = ''
    announcement.value = `Finished playing ${example.word}.`
  }
  utterance.onerror = (event) => {
    if (request !== speechRequest || event.error === 'canceled') return
    activeExample.value = ''
    announcement.value = `The pronunciation of ${example.word} could not be played.`
  }
  activeExample.value = example.key
  window.speechSynthesis.speak(utterance)
}

onBeforeUnmount(cancelSpeech)
</script>

<style scoped>
.sound-heading {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 2rem;
}

.sound-specimen {
  display: grid;
  min-width: 8rem;
  min-height: 7rem;
  place-items: center;
  border: 1px solid var(--atlas-card-border);
  border-radius: 1rem;
  background: var(--atlas-card);
  color: var(--atlas-accent-text);
  font-family: 'Segoe UI', 'Noto Sans', sans-serif;
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 800;
  box-shadow: var(--atlas-card-shadow);
}

.profile-kicker {
  color: var(--atlas-accent-text);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sound-heading h2,
.profile-section h2 {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 800;
  text-transform: capitalize;
}

.sound-heading h2 {
  margin-top: 0.25rem;
  font-size: clamp(1.65rem, 4vw, 2.35rem);
}

.sound-heading p:not(.profile-kicker) {
  max-width: 46rem;
  margin-top: 0.55rem;
  color: var(--atlas-muted);
  line-height: 1.65;
}

.ipa-source-link {
  display: inline-flex;
  gap: 0.35rem;
  margin-top: 0.75rem;
  color: var(--atlas-accent-text);
  font-size: 0.75rem;
  font-weight: 800;
}

.ipa-source-link:focus-visible,
.spelling-card a:focus-visible,
.example-audio:focus-visible {
  border-radius: 0.2rem;
  outline: 3px solid var(--atlas-focus);
  outline-offset: 3px;
}

.profile-section {
  margin-top: 1.5rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.85rem;
  background: var(--atlas-card);
  padding: 1.35rem;
  box-shadow: var(--atlas-card-shadow);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 0.85rem;
}

.section-heading h2 {
  margin-top: 0.2rem;
  font-size: 1.35rem;
}

.section-count {
  flex-shrink: 0;
  color: var(--atlas-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.spelling-grid,
.example-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1rem;
}

.spelling-card,
.example-card {
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.7rem;
  background: var(--atlas-flag-background);
  padding: 1rem;
}

.spelling-heading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.language-flag {
  display: grid;
  width: 3.5rem;
  height: 3rem;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.55rem;
  background: var(--atlas-card);
  padding: 0.35rem;
}

.language-flag img {
  width: 2.6rem;
  height: 1.7rem;
  border-radius: 0.12rem;
  object-fit: cover;
}

.spelling-heading strong,
.spelling-heading a {
  display: block;
}

.spelling-heading strong {
  color: var(--atlas-text);
  font-size: 0.85rem;
}

.spelling-heading a {
  margin-top: 0.15rem;
  color: var(--atlas-accent-text);
  font-size: 0.7rem;
  font-weight: 750;
}

.spelling-card > p {
  margin-top: 0.7rem;
  color: var(--atlas-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.language-spellings span {
  margin-left: 0.35rem;
  color: var(--atlas-accent-text);
  font-size: 0.92rem;
  font-weight: 800;
}

.example-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.example-language,
.example-card strong,
.example-card small {
  display: block;
}

.example-language {
  color: var(--atlas-muted);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.example-card strong {
  margin-top: 0.15rem;
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.15rem;
}

.example-card small {
  margin-top: 0.1rem;
  color: var(--atlas-accent-text);
  font-family: 'Segoe UI', 'Noto Sans', sans-serif;
  font-size: 0.8rem;
}

.example-card p,
.empty-examples {
  margin-top: 0.3rem;
  color: var(--atlas-muted);
  font-size: 0.76rem;
}

.example-audio {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--atlas-card-border);
  border-radius: 9999px;
  background: var(--atlas-card);
  color: var(--atlas-accent-text);
}

.example-audio-active {
  border-color: var(--atlas-accent-strong);
  background: var(--atlas-accent-strong);
  color: rgb(255 250 238);
}

.empty-examples {
  padding-top: 0.7rem;
}

@media (max-width: 720px) {
  .sound-heading {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .sound-specimen {
    margin-inline: auto;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .spelling-grid,
  .example-grid {
    grid-template-columns: 1fr;
  }
}
</style>
