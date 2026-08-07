<template>
  <div class="field-guide-page min-h-screen">
    <header class="field-guide-hero">
      <div class="hero-route-line" aria-hidden="true" />
      <div class="hero-compass" aria-hidden="true">
        <span>N</span>
        <strong>✦</strong>
      </div>

      <div class="relative mx-auto max-w-5xl px-6 py-10 text-center sm:py-14">
        <p class="coordinate-label text-xs font-black uppercase tracking-[0.28em] text-amber-200">
          UpSpell Language Atlas
        </p>
        <h1 class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">Explorer’s Field Guide</h1>
        <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
          Study the marks, letters, and symbols that give each language its character.
        </p>
      </div>
    </header>

    <main class="field-guide mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <div class="map-contours" aria-hidden="true" />
      <svg class="guide-route" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
        <path d="M70 110 C 235 35, 300 205, 465 145 S 735 95, 910 220 S 760 410, 555 365 S 315 520, 95 655" />
        <circle cx="70" cy="110" r="6" />
        <circle cx="465" cy="145" r="6" />
        <circle cx="910" cy="220" r="6" />
        <circle cx="555" cy="365" r="6" />
        <circle cx="95" cy="655" r="6" />
      </svg>
      <div class="guide-compass" aria-hidden="true">
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

      <section class="guide-intro relative z-10 mx-auto max-w-5xl">
        <div class="intro-copy">
          <p class="coordinate-label text-sm font-black uppercase tracking-[0.2em] text-sky-800 dark:text-sky-300">
            Character collection
          </p>
          <h2 class="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
            Choose a language to examine
          </h2>
          <p class="mt-3 max-w-2xl text-stone-600 dark:text-[#D7C3A3]">
            Open a field guide to learn each character’s name, compare uppercase forms, and copy any mark for immediate use.
          </p>
        </div>

        <aside class="guide-note">
          <span class="guide-note-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z" />
              <path d="M7 4.5v15M9.5 8h5M9.5 11h4" />
            </svg>
          </span>
          <span>
            <strong>12 field guides</strong>
            <small>Tap any character inside a guide to copy it.</small>
          </span>
        </aside>
      </section>

      <section class="relative z-10 mx-auto mt-10 max-w-5xl" aria-labelledby="language-guides">
        <div class="section-heading">
          <div>
            <p class="coordinate-label text-sm font-black uppercase tracking-[0.2em] text-sky-800 dark:text-sky-300">
              Indexed by destination
            </p>
            <h2 id="language-guides" class="mt-1 text-2xl font-black text-stone-900 dark:text-white">
              Language field guides
            </h2>
          </div>
          <p class="text-sm text-stone-500 dark:text-[#D4C1A4]">Select a card to open its collection</p>
        </div>

        <div class="guide-grid mt-6">
          <NuxtLink
            v-for="(language, index) in languageGuides"
            :key="language.code"
            :to="language.route"
            :aria-label="`Open ${language.englishName} character reference`"
            class="language-guide-card group"
            :style="{
              '--card-delay': `${index * 45}ms`,
              '--card-tilt': `${index % 2 === 0 ? -0.35 : 0.35}deg`,
            }"
          >
            <span class="card-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>

            <span class="card-heading">
              <span class="flag-frame">
                <img :src="language.flag" alt="" />
              </span>
              <span class="min-w-0">
                <strong :lang="language.code">{{ language.name }}</strong>
                <small>{{ language.englishName }}</small>
              </span>
            </span>

            <span class="character-specimens" :lang="language.code" aria-hidden="true">
              <span v-for="character in language.featuredCharacters" :key="character">{{ character }}</span>
            </span>

            <span class="rule-note">{{ language.accentRule }}</span>

            <span class="card-footer">
              <span>Open field guide</span>
              <span class="card-arrow" aria-hidden="true">→</span>
            </span>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { languageMetadata } from '~/data/languageMetadata'
import { languages } from '~/data/words'

usePageSeo({
  title: 'Character reference - UpSpell',
  description: 'Copy and learn special characters for all 12 languages supported by UpSpell.',
  path: '/reference',
})

const languageGuides = computed(() =>
  languageMetadata.map((metadata) => {
    const words = languages.find(language => language.code === metadata.code)?.words ?? []
    const featuredCharacters = [...new Set(words.map(word => word.choices[0]).filter(Boolean))].slice(0, 5)

    return {
      ...metadata,
      featuredCharacters,
    }
  }),
)
</script>

<style scoped>
.field-guide-page {
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

.field-guide-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgb(224 180 99 / 35%);
  background:
    radial-gradient(circle at 50% 125%, rgb(183 128 70 / 30%), transparent 48%),
    linear-gradient(135deg, rgb(50 78 77), rgb(25 52 56));
}

.field-guide-hero h1,
.guide-intro h2,
.section-heading h2,
.language-guide-card strong,
.guide-note strong {
  font-family: 'Source Serif 4', Georgia, serif;
}

.coordinate-label,
.card-index,
.card-footer {
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

.field-guide {
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

.field-guide::before {
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

.guide-route {
  position: absolute;
  inset: 7rem 0 auto;
  height: 45rem;
  width: 100%;
  fill: none;
  opacity: 0.12;
  pointer-events: none;
  stroke: rgb(42 103 110);
  stroke-dasharray: 7 9;
  stroke-linecap: round;
  stroke-width: 2;
}

.guide-route circle {
  fill: rgb(244 235 207);
  stroke-dasharray: none;
}

.guide-compass {
  position: absolute;
  right: 3rem;
  bottom: 2.5rem;
  display: grid;
  height: 8rem;
  width: 8rem;
  place-items: center;
  border: 1px solid rgb(120 53 15 / 10%);
  border-radius: 9999px;
  color: rgb(120 53 15 / 11%);
  transform: rotate(8deg);
}

.guide-compass::before,
.guide-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.guide-compass::before {
  height: 115%;
  width: 1px;
}

.guide-compass::after {
  height: 1px;
  width: 115%;
}

.guide-compass span,
.guide-compass small {
  position: absolute;
  font-size: 0.7rem;
  font-weight: 800;
}

.guide-compass span {
  top: 0.4rem;
}

.guide-compass small {
  bottom: 0.4rem;
}

.guide-compass strong {
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
.language-guide-card:focus-visible {
  border-radius: 0.35rem;
  outline: 3px solid rgb(42 103 110 / 45%);
  outline-offset: 3px;
}

.guide-intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}

.guide-note {
  display: flex;
  max-width: 19rem;
  flex-shrink: 0;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgb(120 53 15 / 18%);
  border-radius: 0.45rem;
  background: rgb(255 251 235 / 72%);
  padding: 0.9rem;
  box-shadow: 2px 3px 0 rgb(120 53 15 / 9%);
  transform: rotate(0.5deg);
}

.guide-note-icon {
  display: grid;
  height: 2.6rem;
  width: 2.6rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9999px;
  background: rgb(42 103 110 / 12%);
  color: rgb(32 91 98);
}

.guide-note-icon svg {
  height: 1.35rem;
  width: 1.35rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.guide-note strong {
  display: block;
  color: rgb(41 37 36);
  font-size: 1rem;
  font-weight: 800;
}

.guide-note small {
  display: block;
  margin-top: 0.15rem;
  color: rgb(87 83 78);
  font-size: 0.72rem;
  line-height: 1.35;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem 1.5rem;
}

.language-guide-card {
  position: relative;
  display: flex;
  min-height: 20rem;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(120 53 15 / 20%);
  border-radius: 0.55rem;
  background: rgb(255 251 235 / 82%);
  padding: 1.25rem;
  box-shadow:
    2px 3px 0 rgb(120 53 15 / 10%),
    inset 0 0 0 2px rgb(255 255 255 / 22%);
  transform: rotate(var(--card-tilt));
  transition: box-shadow 220ms ease, transform 220ms ease;
  animation: card-arrive 420ms calc(var(--card-delay)) ease both;
}

.language-guide-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 0.22rem;
  background: rgb(42 103 110);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.language-guide-card:hover {
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 22%);
  transform: rotate(0deg) translateY(-0.25rem);
}

.language-guide-card:hover::before {
  transform: scaleX(1);
}

.card-index {
  position: absolute;
  top: 0.85rem;
  right: 1rem;
  color: rgb(120 53 15 / 30%);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-right: 1.5rem;
}

.flag-frame {
  display: grid;
  height: 3rem;
  width: 3.75rem;
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
  height: 1.9rem;
  width: 2.85rem;
  border-radius: 0.15rem;
  object-fit: cover;
}

.card-heading strong {
  display: block;
  overflow: hidden;
  color: rgb(41 37 36);
  font-size: 1.2rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-heading small {
  display: block;
  margin-top: 0.1rem;
  color: rgb(87 83 78);
  font-size: 0.75rem;
}

.character-specimens {
  display: flex;
  min-height: 4.2rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  border-top: 1px solid rgb(120 53 15 / 13%);
  border-bottom: 1px solid rgb(120 53 15 / 13%);
  background: rgb(229 219 187 / 36%);
}

.character-specimens span {
  color: rgb(30 78 83);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.55rem;
  font-weight: 700;
  transition: transform 180ms ease;
}

.character-specimens span:nth-child(even) {
  transform: translateY(0.18rem);
}

.language-guide-card:hover .character-specimens span {
  transform: translateY(-0.08rem);
}

.rule-note {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 1rem;
  color: rgb(87 65 49);
  font-size: 0.78rem;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid rgb(120 53 15 / 16%);
  padding-top: 0.9rem;
  color: rgb(32 91 98);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.card-arrow {
  font-family: 'Overpass', sans-serif;
  font-size: 1rem;
  transition: transform 180ms ease;
}

.language-guide-card:hover .card-arrow {
  transform: translateX(0.25rem);
}

@keyframes card-arrive {
  from {
    opacity: 0;
    transform: rotate(var(--card-tilt)) translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: rotate(var(--card-tilt)) translateY(0);
  }
}

html.dark .field-guide-page {
  border-color: rgb(42 25 18);
  background-color: rgb(58 36 26);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(196 154 74 / 4%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 25%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(196 154 74 / 1.5%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(73 45 31), rgb(41 27 21));
}

html.dark .field-guide-hero {
  background:
    radial-gradient(circle at 50% 125%, rgb(95 143 145 / 24%), transparent 48%),
    linear-gradient(135deg, rgb(35 65 65), rgb(20 42 46));
}

html.dark .field-guide {
  border-color: rgb(106 74 50);
  background-color: rgb(47 32 24);
  background-image:
    linear-gradient(rgb(196 154 74 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(196 154 74 / 6%) 1px, transparent 1px);
  box-shadow:
    0 16px 40px rgb(0 0 0 / 34%),
    inset 0 0 50px rgb(0 0 0 / 16%);
}

html.dark .field-guide::before {
  border-color: rgb(196 154 74 / 16%);
}

html.dark .map-contours {
  background-image:
    repeating-radial-gradient(ellipse at 82% 14%, transparent 0 24px, rgb(196 154 74 / 8%) 25px 26px, transparent 27px 46px),
    repeating-radial-gradient(ellipse at 8% 76%, transparent 0 31px, rgb(95 143 145 / 9%) 32px 33px, transparent 34px 58px);
}

html.dark .guide-route {
  stroke: rgb(130 184 184);
}

html.dark .guide-route circle {
  fill: rgb(47 32 24);
}

html.dark .guide-compass {
  color: rgb(196 154 74 / 12%);
}

html.dark .back-link {
  color: rgb(232 216 188);
}

html.dark .back-link:hover {
  color: rgb(159 208 206);
}

html.dark .guide-note,
html.dark .language-guide-card {
  border-color: rgb(106 74 50);
  background: rgb(56 37 26 / 90%);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 18%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .guide-note-icon {
  background: rgb(95 143 145 / 15%);
  color: rgb(159 208 206);
}

html.dark .guide-note strong,
html.dark .card-heading strong {
  color: rgb(250 244 232);
}

html.dark .guide-note small,
html.dark .card-heading small,
html.dark .rule-note {
  color: rgb(205 187 157);
}

html.dark .card-index {
  color: rgb(196 154 74 / 32%);
}

html.dark .flag-frame {
  border-color: rgb(139 101 66);
  background: rgb(40 29 23);
  box-shadow: 1px 2px 0 rgb(0 0 0 / 20%);
}

html.dark .character-specimens {
  border-color: rgb(106 74 50);
  background: rgb(67 48 34 / 65%);
}

html.dark .character-specimens span {
  color: rgb(183 222 218);
}

html.dark .card-footer {
  border-color: rgb(106 74 50);
  color: rgb(159 208 206);
}

@media (max-width: 900px) {
  .guide-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-compass {
    left: -2rem;
    opacity: 0.6;
  }

  .guide-intro,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.8rem;
  }

  .guide-note {
    max-width: none;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }

  .language-guide-card {
    min-height: 18rem;
  }

  .guide-compass {
    right: -3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .language-guide-card {
    animation: none;
    transition: none;
  }

  .language-guide-card:hover {
    transform: rotate(var(--card-tilt));
  }

  .back-link,
  .card-arrow,
  .character-specimens span {
    transition: none;
  }
}
</style>
