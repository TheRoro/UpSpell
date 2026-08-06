<template>
  <div class="travel-log-page min-h-screen">
    <header class="travel-log-hero">
      <div class="hero-route-line" aria-hidden="true" />
      <div class="hero-compass" aria-hidden="true">
        <span>N</span>
        <strong>✦</strong>
      </div>

      <div class="relative mx-auto max-w-5xl px-6 py-10 text-center sm:py-14">
        <p class="coordinate-label text-xs font-black uppercase tracking-[0.28em] text-amber-200">
          UpSpell Language Atlas
        </p>
        <h1 class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">Travel Log</h1>
        <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
          A record of every word discovered, route revisited, and streak carried forward.
        </p>
      </div>
    </header>

    <main class="logbook mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <div class="map-contours" aria-hidden="true" />
      <div class="logbook-compass" aria-hidden="true">
        <span>N</span>
        <strong>✦</strong>
        <small>S</small>
      </div>

      <button
        type="button"
        class="back-link relative z-10 mb-8 inline-flex items-center gap-2 font-bold"
        @click="navigateTo('/')"
      >
        <span aria-hidden="true">←</span>
        Back to the map
      </button>

      <section class="relative z-10 mx-auto max-w-5xl" aria-labelledby="expedition-summary">
        <div class="summary-heading">
          <div>
            <p class="coordinate-label text-sm font-black uppercase tracking-[0.2em] text-sky-800 dark:text-sky-300">
              Expedition record
            </p>
            <h2 id="expedition-summary" class="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
              Your discoveries at a glance
            </h2>
          </div>
          <p class="summary-note">
            Stored privately on this device
          </p>
        </div>

        <div class="summary-grid mt-7">
          <article class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z" />
                <path d="M7 4.5v15M9.5 8h5M9.5 11h4" />
              </svg>
            </span>
            <span>
              <strong>{{ totalPlayed }}</strong>
              <small>Words explored</small>
            </span>
          </article>

          <article class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
              </svg>
            </span>
            <span>
              <strong>{{ accuracy }}%</strong>
              <small>Overall accuracy</small>
            </span>
          </article>

          <article class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3.5c.7 3.5 4.2 4.5 4.2 8.4a4.2 4.2 0 0 1-8.4 0c0-2.2 1.2-3.8 2.7-5.3.1 2 1 3.1 1.5 3.5.8-1.8.5-4.2 0-6.6z" />
              </svg>
            </span>
            <span>
              <strong>{{ overallBestStreak }}</strong>
              <small>Best streak</small>
            </span>
          </article>

          <article class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 18.5c4.5-1 5.5-5 8-7s4.5-1 8-6" />
                <circle cx="4" cy="18.5" r="1.5" />
                <circle cx="12" cy="11.5" r="1.5" />
                <circle cx="20" cy="5.5" r="1.5" />
              </svg>
            </span>
            <span>
              <strong>{{ languagesExplored }}<em>/{{ langStats.length }}</em></strong>
              <small>Routes charted</small>
            </span>
          </article>
        </div>
      </section>

      <section class="relative z-10 mx-auto mt-12 max-w-5xl" aria-labelledby="route-records">
        <div class="routes-heading">
          <div>
            <p class="coordinate-label text-sm font-black uppercase tracking-[0.2em] text-sky-800 dark:text-sky-300">
              Mapped destinations
            </p>
            <h2 id="route-records" class="mt-1 text-2xl font-black text-stone-900 dark:text-white">
              Route records
            </h2>
          </div>
          <p class="text-sm text-stone-500 dark:text-[#D4C1A4]">
            Accuracy reflects daily discoveries
          </p>
        </div>

        <div v-if="totalPlayed === 0" class="empty-log mt-6">
          <span class="empty-log-mark" aria-hidden="true">⌖</span>
          <h3>Your travel log is waiting for its first entry.</h3>
          <p>Choose a destination and complete one daily word to begin charting progress.</p>
          <button type="button" @click="navigateTo('/')">Explore a language</button>
        </div>

        <div v-else class="route-grid mt-6">
          <article
            v-for="(stat, index) in langStats"
            :key="stat.code"
            class="route-card"
            :class="{ 'route-card-uncharted': stat.played === 0 }"
            :style="{ '--card-delay': `${index * 45}ms` }"
          >
            <div class="route-card-header">
              <span class="flag-frame">
                <img :src="stat.flag" alt="" />
              </span>
              <span class="min-w-0">
                <strong :lang="stat.code">{{ stat.name }}</strong>
                <small>{{ stat.englishName }}</small>
              </span>
              <span v-if="stat.played === 0" class="uncharted-label">Uncharted</span>
              <span
                v-else
                class="accuracy-seal"
                :style="{ '--accuracy': `${stat.accuracy * 3.6}deg` }"
                :aria-label="`${stat.accuracy}% accuracy in ${stat.englishName}`"
              >
                <span>{{ stat.accuracy }}<small>%</small></span>
              </span>
            </div>

            <div class="route-progress">
              <div class="route-progress-label">
                <span>{{ stat.played }} {{ stat.played === 1 ? 'word' : 'words' }} explored</span>
                <span>{{ stat.won }} correct</span>
              </div>
              <div
                class="route-progress-track"
                role="progressbar"
                :aria-label="`${stat.englishName} accuracy`"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="stat.accuracy"
              >
                <span :style="{ width: `${stat.accuracy}%` }" />
              </div>
            </div>

            <dl class="route-details">
              <div>
                <dt>Current streak</dt>
                <dd>{{ stat.currentStreak }} <span aria-hidden="true">🔥</span></dd>
              </div>
              <div>
                <dt>Best streak</dt>
                <dd>{{ stat.bestStreak }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getLanguageMetadata } from '~/data/languageMetadata'
import { languages } from '~/data/words'

usePageSeo({
  title: 'Your travel log - UpSpell',
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

onMounted(() => {
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
      currentStreak: readCount(`upspell-streak-${language.code}`),
      bestStreak: readCount(`upspell-best-${language.code}`),
    }
  })
})

function readCount(key: string): number {
  try {
    const value = Number.parseInt(localStorage.getItem(key) ?? '', 10)
    return Number.isFinite(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}

const totalPlayed = computed(() => langStats.value.reduce((sum, stat) => sum + stat.played, 0))
const totalWon = computed(() => langStats.value.reduce((sum, stat) => sum + stat.won, 0))
const accuracy = computed(() => totalPlayed.value > 0 ? Math.round((totalWon.value / totalPlayed.value) * 100) : 0)
const overallBestStreak = computed(() => Math.max(0, ...langStats.value.map(stat => stat.bestStreak)))
const languagesExplored = computed(() => langStats.value.filter(stat => stat.played > 0).length)
</script>

<style scoped>
.travel-log-page {
  display: flow-root;
  border-right: clamp(0.3rem, 0.8vw, 0.75rem) solid rgb(74 33 23);
  border-left: clamp(0.3rem, 0.8vw, 0.75rem) solid rgb(74 33 23);
  background-color: rgb(139 74 47);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(255 239 208 / 7%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(45 18 9 / 22%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(255 239 208 / 1.8%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(157 91 56), rgb(102 48 31));
  background-size: 8px 10px, 11px 9px, auto, auto;
  box-shadow:
    inset 8px 0 16px rgb(30 8 16 / 20%),
    inset -8px 0 16px rgb(30 8 16 / 20%);
}

.travel-log-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgb(224 180 99 / 35%);
  background:
    radial-gradient(circle at 50% 125%, rgb(183 128 70 / 30%), transparent 48%),
    linear-gradient(135deg, rgb(50 78 77), rgb(25 52 56));
}

.travel-log-hero h1,
.summary-heading h2,
.routes-heading h2,
.summary-card strong,
.route-card-header strong,
.empty-log h3 {
  font-family: 'Source Serif 4', Georgia, serif;
}

.coordinate-label,
.summary-note,
.route-progress-label,
.route-details,
.uncharted-label {
  font-family: 'Overpass Mono', monospace;
}

.hero-route-line {
  position: absolute;
  top: 50%;
  left: -5%;
  width: 110%;
  border-top: 1px dashed rgb(255 237 190 / 22%);
  transform: rotate(-3deg);
}

.hero-compass {
  position: absolute;
  top: 50%;
  left: 8%;
  display: grid;
  height: 6rem;
  width: 6rem;
  place-items: center;
  border: 1px solid rgb(255 237 190 / 18%);
  border-radius: 9999px;
  color: rgb(255 237 190 / 32%);
  transform: translateY(-50%) rotate(-12deg);
}

.hero-compass::before,
.hero-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.hero-compass::before {
  height: 120%;
  width: 1px;
}

.hero-compass::after {
  height: 1px;
  width: 120%;
}

.hero-compass span {
  position: absolute;
  top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
}

.hero-compass strong {
  font-size: 1.5rem;
}

.logbook {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(120 53 15 / 24%);
  border-radius: 0.65rem;
  background-color: rgb(244 235 207);
  background-image:
    linear-gradient(rgb(120 53 15 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(120 53 15 / 5%) 1px, transparent 1px);
  background-size: 30px 30px;
  box-shadow:
    0 16px 40px rgb(38 14 8 / 24%),
    inset 0 0 50px rgb(120 53 15 / 8%);
}

.logbook::before {
  position: absolute;
  inset: 0.65rem;
  border: 1px solid rgb(120 53 15 / 16%);
  border-radius: 0.35rem;
  content: '';
  pointer-events: none;
}

.map-contours {
  position: absolute;
  inset: 0;
  background-image:
    repeating-radial-gradient(ellipse at 82% 14%, transparent 0 24px, rgb(120 53 15 / 7%) 25px 26px, transparent 27px 46px),
    repeating-radial-gradient(ellipse at 8% 76%, transparent 0 31px, rgb(42 103 110 / 7%) 32px 33px, transparent 34px 58px);
  pointer-events: none;
}

.logbook-compass {
  position: absolute;
  right: 3.5rem;
  bottom: 3rem;
  display: grid;
  height: 8rem;
  width: 8rem;
  place-items: center;
  border: 1px solid rgb(120 53 15 / 10%);
  border-radius: 9999px;
  color: rgb(120 53 15 / 11%);
  transform: rotate(8deg);
}

.logbook-compass::before,
.logbook-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.logbook-compass::before {
  height: 115%;
  width: 1px;
}

.logbook-compass::after {
  height: 1px;
  width: 115%;
}

.logbook-compass span,
.logbook-compass small {
  position: absolute;
  font-size: 0.7rem;
  font-weight: 800;
}

.logbook-compass span {
  top: 0.4rem;
}

.logbook-compass small {
  bottom: 0.4rem;
}

.logbook-compass strong {
  font-size: 2rem;
}

.back-link {
  color: rgb(87 65 49);
  transition: color 180ms ease, transform 180ms ease;
}

.back-link:hover {
  color: rgb(32 91 98);
  transform: translateX(-0.2rem);
}

.back-link:focus-visible,
.empty-log button:focus-visible {
  border-radius: 0.25rem;
  outline: 3px solid rgb(42 103 110 / 45%);
  outline-offset: 3px;
}

.summary-heading,
.routes-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.summary-note {
  border-bottom: 1px solid rgb(120 53 15 / 30%);
  padding: 0.25rem 0;
  color: rgb(87 65 49);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transform: rotate(-1deg);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.summary-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgb(120 53 15 / 18%);
  border-radius: 0.45rem;
  background: rgb(255 251 235 / 76%);
  padding: 1rem;
  box-shadow:
    2px 3px 0 rgb(120 53 15 / 10%),
    inset 0 0 0 2px rgb(255 255 255 / 24%);
}

.summary-icon {
  display: grid;
  height: 2.75rem;
  width: 2.75rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9999px;
  background: rgb(42 103 110 / 12%);
  color: rgb(32 91 98);
}

.summary-icon svg {
  height: 1.45rem;
  width: 1.45rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.summary-card strong {
  display: block;
  color: rgb(41 37 36);
  font-size: clamp(1.6rem, 3vw, 2.15rem);
  font-weight: 800;
  line-height: 1;
}

.summary-card strong em {
  color: rgb(120 113 108);
  font-family: 'Overpass', sans-serif;
  font-size: 0.8rem;
  font-style: normal;
}

.summary-card small {
  display: block;
  margin-top: 0.35rem;
  color: rgb(87 83 78);
  font-size: 0.75rem;
  font-weight: 700;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2.5rem;
}

.route-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(120 53 15 / 18%);
  border-radius: 0.55rem;
  background: rgb(255 251 235 / 80%);
  padding: 1.15rem;
  box-shadow:
    2px 3px 0 rgb(120 53 15 / 9%),
    inset 0 0 0 2px rgb(255 255 255 / 20%);
  animation: card-arrive 420ms calc(var(--card-delay)) ease both;
}

.route-card::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0.22rem;
  background: rgb(42 103 110);
  content: '';
}

.route-card-uncharted {
  opacity: 0.72;
}

.route-card-uncharted::before {
  background: rgb(120 113 108);
}

.route-card-header {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  gap: 0.8rem;
}

.flag-frame {
  display: grid;
  height: 2.8rem;
  width: 3.5rem;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid rgb(120 113 108 / 55%);
  border-radius: 0.25rem;
  background: white;
  padding: 0.35rem;
  box-shadow: 1px 2px 0 rgb(120 53 15 / 10%);
  transform: rotate(-1.5deg);
}

.flag-frame img {
  height: 1.8rem;
  width: 2.7rem;
  border-radius: 0.15rem;
  object-fit: cover;
}

.route-card-header strong {
  display: block;
  overflow: hidden;
  color: rgb(41 37 36);
  font-size: 1.15rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-card-header small {
  display: block;
  margin-top: 0.1rem;
  color: rgb(87 83 78);
  font-size: 0.75rem;
}

.accuracy-seal {
  display: grid;
  height: 3.35rem;
  width: 3.35rem;
  flex-shrink: 0;
  place-items: center;
  margin-left: auto;
  border-radius: 9999px;
  background: conic-gradient(rgb(42 103 110) var(--accuracy), rgb(214 203 172) 0);
}

.accuracy-seal > span {
  display: grid;
  height: 2.65rem;
  width: 2.65rem;
  place-items: center;
  border-radius: 9999px;
  background: rgb(255 251 235);
  color: rgb(32 91 98);
  font-size: 0.9rem;
  font-weight: 800;
}

.accuracy-seal small {
  display: inline;
  font-size: 0.58rem;
}

.uncharted-label {
  margin-left: auto;
  border-bottom: 1px solid rgb(120 53 15 / 30%);
  color: rgb(120 53 15 / 65%);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.route-progress {
  margin-top: 1rem;
}

.route-progress-label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgb(87 65 49);
  font-size: 0.66rem;
}

.route-progress-track {
  height: 0.42rem;
  overflow: hidden;
  margin-top: 0.45rem;
  border-radius: 9999px;
  background: rgb(214 203 172);
}

.route-progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgb(32 91 98), rgb(74 130 128));
  transition: width 600ms ease;
}

.route-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1rem;
  border-top: 1px solid rgb(120 53 15 / 16%);
  padding-top: 0.8rem;
}

.route-details > div + div {
  border-left: 1px solid rgb(120 53 15 / 16%);
  padding-left: 1rem;
}

.route-details dt {
  color: rgb(120 113 108);
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.route-details dd {
  margin-top: 0.2rem;
  color: rgb(68 64 60);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 800;
}

.empty-log {
  border: 1px solid rgb(120 53 15 / 20%);
  border-radius: 0.55rem;
  background: rgb(255 251 235 / 76%);
  padding: 2.5rem 1.5rem;
  text-align: center;
  box-shadow: 2px 3px 0 rgb(120 53 15 / 9%);
}

.empty-log-mark {
  display: grid;
  height: 3.5rem;
  width: 3.5rem;
  place-items: center;
  margin: 0 auto;
  border: 1px solid rgb(42 103 110 / 30%);
  border-radius: 9999px;
  color: rgb(32 91 98);
  font-size: 1.5rem;
}

.empty-log h3 {
  margin-top: 1rem;
  color: rgb(41 37 36);
  font-size: 1.4rem;
  font-weight: 800;
}

.empty-log p {
  max-width: 30rem;
  margin: 0.5rem auto 0;
  color: rgb(87 83 78);
}

.empty-log button {
  margin-top: 1.25rem;
  border-radius: 0.35rem;
  background: rgb(32 91 98);
  padding: 0.7rem 1rem;
  color: white;
  font-weight: 800;
  box-shadow: 2px 3px 0 rgb(20 55 59 / 25%);
}

@keyframes card-arrive {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

html.dark .travel-log-page {
  border-color: rgb(42 25 18);
  background-color: rgb(58 36 26);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(196 154 74 / 4%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 25%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(196 154 74 / 1.5%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(73 45 31), rgb(41 27 21));
}

html.dark .travel-log-hero {
  background:
    radial-gradient(circle at 50% 125%, rgb(95 143 145 / 24%), transparent 48%),
    linear-gradient(135deg, rgb(35 65 65), rgb(20 42 46));
}

html.dark .logbook {
  border-color: rgb(106 74 50);
  background-color: rgb(47 32 24);
  background-image:
    linear-gradient(rgb(196 154 74 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(196 154 74 / 6%) 1px, transparent 1px);
  box-shadow:
    0 16px 40px rgb(0 0 0 / 34%),
    inset 0 0 50px rgb(0 0 0 / 16%);
}

html.dark .logbook::before {
  border-color: rgb(196 154 74 / 16%);
}

html.dark .map-contours {
  background-image:
    repeating-radial-gradient(ellipse at 82% 14%, transparent 0 24px, rgb(196 154 74 / 8%) 25px 26px, transparent 27px 46px),
    repeating-radial-gradient(ellipse at 8% 76%, transparent 0 31px, rgb(95 143 145 / 9%) 32px 33px, transparent 34px 58px);
}

html.dark .logbook-compass {
  color: rgb(196 154 74 / 12%);
}

html.dark .back-link {
  color: rgb(232 216 188);
}

html.dark .back-link:hover {
  color: rgb(159 208 206);
}

html.dark .summary-note {
  border-color: rgb(196 154 74 / 30%);
  color: rgb(205 187 157);
}

html.dark .summary-card,
html.dark .route-card,
html.dark .empty-log {
  border-color: rgb(106 74 50);
  background: rgb(56 37 26 / 88%);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 18%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .summary-icon {
  background: rgb(95 143 145 / 15%);
  color: rgb(159 208 206);
}

html.dark .summary-card strong,
html.dark .route-card-header strong,
html.dark .empty-log h3 {
  color: rgb(250 244 232);
}

html.dark .summary-card strong em,
html.dark .summary-card small,
html.dark .route-card-header small,
html.dark .empty-log p {
  color: rgb(205 187 157);
}

html.dark .flag-frame {
  border-color: rgb(139 101 66);
  background: rgb(40 29 23);
  box-shadow: 1px 2px 0 rgb(0 0 0 / 20%);
}

html.dark .accuracy-seal {
  background: conic-gradient(rgb(130 184 184) var(--accuracy), rgb(83 62 45) 0);
}

html.dark .accuracy-seal > span {
  background: rgb(56 37 26);
  color: rgb(183 222 218);
}

html.dark .uncharted-label {
  border-color: rgb(196 154 74 / 35%);
  color: rgb(218 191 140);
}

html.dark .route-progress-label {
  color: rgb(205 187 157);
}

html.dark .route-progress-track {
  background: rgb(83 62 45);
}

html.dark .route-progress-track span {
  background: linear-gradient(90deg, rgb(95 143 145), rgb(130 184 184));
}

html.dark .route-details,
html.dark .route-details > div + div {
  border-color: rgb(106 74 50);
}

html.dark .route-details dt {
  color: rgb(185 165 134);
}

html.dark .route-details dd {
  color: rgb(244 229 197);
}

html.dark .empty-log-mark {
  border-color: rgb(130 184 184 / 35%);
  color: rgb(159 208 206);
}

html.dark .empty-log button {
  background: rgb(95 143 145);
  color: rgb(30 24 20);
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .route-grid {
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .hero-compass {
    left: -2rem;
    opacity: 0.6;
  }

  .summary-heading,
  .routes-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.65rem;
  }

  .summary-grid,
  .route-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 0.9rem;
  }

  .logbook-compass {
    right: -3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-card {
    animation: none;
  }

  .back-link,
  .route-progress-track span {
    transition: none;
  }
}
</style>
