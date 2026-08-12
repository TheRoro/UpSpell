<template>
  <AtlasPageShell>
    <AtlasHero
      title="Stats"
      subtitle="Review your accuracy, streaks, and progress across every language."
    />

    <AtlasPanel class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <AtlasNavigation
        class="mb-8"
        back-label="Back to the map"
        back-to="/"
        label="Stats navigation"
      />

      <StatsSummary
        class="mx-auto max-w-5xl"
        :total-played="totalPlayed"
        :accuracy="accuracy"
        :overall-best-streak="overallBestStreak"
        :languages-explored="languagesExplored"
        :language-count="langStats.length"
      />

      <section class="relative z-10 mx-auto mt-12 max-w-5xl" aria-labelledby="route-records">
        <div class="routes-heading">
          <h2 id="route-records" class="text-2xl font-black">
            Language progress
          </h2>
        </div>

        <div v-if="totalPlayed === 0" class="empty-log mt-6">
          <span class="empty-log-mark" aria-hidden="true">⌖</span>
          <h3>Your stats are waiting for their first entry.</h3>
          <p>Choose a destination and complete one daily word to begin charting progress.</p>
          <button type="button" @click="navigateTo('/')">Explore a language</button>
        </div>

        <div v-else class="route-grid mt-6">
          <LanguageProgressCard
            v-for="(stat, index) in langStats"
            :key="stat.code"
            v-bind="stat"
            :index="index"
          />
        </div>
      </section>
    </AtlasPanel>
  </AtlasPageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getLanguageMetadata } from '~/data/languageMetadata'
import { languages } from '~/data/words'
import { getActiveStreak, parseStoredCount } from '~/utils/game'

usePageSeo({
  title: 'Your stats - UpSpell',
  description: 'Review your UpSpell accuracy and spelling streaks across all 12 supported languages.',
  path: '/stats',
})

interface LangStat {
  code: string
  name: string
  englishName: string
  flag: string
  played: number
  won: number
  accuracy: number
  currentStreak: number
  bestStreak: number
}

const langStats = ref<LangStat[]>([])
const currentDayKey = useLocalDayKey()

function loadStats() {
  langStats.value = languages.map((language) => {
    const played = readCount(`upspell-played-${language.code}`)
    const won = readCount(`upspell-won-${language.code}`)
    const metadata = getLanguageMetadata(language.code)

    return {
      code: language.code,
      name: language.name,
      englishName: metadata.englishName,
      flag: language.flag,
      played,
      won,
      accuracy: played > 0 ? Math.round((won / played) * 100) : 0,
      currentStreak: getActiveStreak(
        readCount(`upspell-streak-${language.code}`),
        readValue(`upspell-lastplayed-${language.code}`),
        currentDayKey.value,
      ),
      bestStreak: readCount(`upspell-best-${language.code}`),
    }
  })
}

onMounted(loadStats)
watch(currentDayKey, loadStats)

function readCount(key: string): number {
  return parseStoredCount(readValue(key))
}

function readValue(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const totalPlayed = computed(() => langStats.value.reduce((sum, stat) => sum + stat.played, 0))
const totalWon = computed(() => langStats.value.reduce((sum, stat) => sum + stat.won, 0))
const accuracy = computed(() => totalPlayed.value > 0 ? Math.round((totalWon.value / totalPlayed.value) * 100) : 0)
const overallBestStreak = computed(() => Math.max(0, ...langStats.value.map(stat => stat.bestStreak)))
const languagesExplored = computed(() => langStats.value.filter(stat => stat.played > 0).length)
</script>

<style scoped>
.routes-heading {
  position: relative;
  border-bottom: 1px solid var(--atlas-panel-inner-border);
  padding-bottom: 1.25rem;
}

.routes-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  width: 4.5rem;
  border-radius: 9999px;
  background: var(--atlas-accent-strong);
  content: '';
}

.routes-heading h2,
.empty-log h3 {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2.5rem;
}

.empty-log {
  border: 1px solid var(--atlas-card-border);
  border-radius: var(--atlas-radius-card);
  background: var(--atlas-card);
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: var(--atlas-card-shadow);
}

.empty-log-mark {
  display: grid;
  height: 3.5rem;
  width: 3.5rem;
  place-items: center;
  margin: 0 auto;
  border: 1px solid var(--atlas-focus);
  border-radius: 9999px;
  color: var(--atlas-accent-text);
  font-size: 1.5rem;
}

.empty-log h3 {
  margin-top: 1rem;
  font-size: 1.4rem;
  font-weight: 800;
}

.empty-log p {
  max-width: 30rem;
  margin: 0.5rem auto 0;
  color: var(--atlas-muted);
}

.empty-log button {
  margin-top: 1.25rem;
  border-radius: 0.35rem;
  background: var(--atlas-accent-strong);
  padding: 0.7rem 1rem;
  color: rgb(255 255 255);
  font-weight: 800;
  box-shadow: 2px 3px 0 rgb(20 55 59 / 25%);
}

.empty-log button:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 3px;
}

html.dark .empty-log button {
  color: rgb(30 24 20);
}

@media (max-width: 900px) {
  .route-grid {
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .route-grid {
    grid-template-columns: 1fr;
  }
}
</style>
