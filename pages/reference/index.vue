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
        <h1 class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">Characters</h1>
        <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
          Browse special characters for every language.
        </p>
      </div>
    </header>

    <main class="field-guide mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <button
        type="button"
        class="back-link relative z-10 mb-8 inline-flex items-center gap-2 font-bold"
        @click="navigateTo('/')"
      >
        <span aria-hidden="true">←</span>
        Back to the map
      </button>

      <section class="relative z-10 mx-auto max-w-5xl" aria-labelledby="language-guides">
        <div class="collection-heading">
          <p class="coordinate-label text-sm font-black uppercase tracking-[0.2em] text-sky-800 dark:text-[#D1BEA2]">
            Character collection
          </p>
          <h2 id="language-guides" class="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
            Choose a language
          </h2>
          <p class="mt-3 max-w-2xl text-stone-600 dark:text-[#D7C3A3]">
            View each language’s special characters and copy any mark.
          </p>
        </div>

        <div class="guide-grid mt-8">
          <NuxtLink
            v-for="(language, index) in languageGuides"
            :key="language.code"
            :to="language.route"
            :aria-label="`Open ${language.englishName} character reference`"
            class="language-guide-card group"
            :style="{ '--card-delay': `${index * 45}ms` }"
          >
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
              <span>View characters</span>
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
  title: 'Characters - UpSpell',
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
  background-color: rgb(139 74 47);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(255 239 208 / 7%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(45 18 9 / 22%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(255 239 208 / 1.8%) 9px, transparent 10px 17px),
    repeating-linear-gradient(94deg, transparent 0 12px, rgb(54 22 12 / 2.5%) 13px, transparent 14px 23px),
    linear-gradient(135deg, rgb(157 91 56), rgb(102 48 31));
  background-size: 8px 10px, 11px 9px, auto, auto, auto;
  box-shadow:
    inset 8px 0 16px rgb(30 8 16 / 20%),
    inset -8px 0 16px rgb(30 8 16 / 20%);
}

.field-guide-hero {
  position: relative;
  overflow: hidden;
  border-bottom: 5px double rgb(217 179 106);
  background:
    radial-gradient(ellipse at 20% 15%, rgb(255 239 208 / 10%) 0, transparent 24%),
    radial-gradient(ellipse at 80% 85%, rgb(45 18 9 / 24%) 0, transparent 32%),
    repeating-linear-gradient(18deg, transparent 0 5px, rgb(255 239 208 / 2.2%) 6px, transparent 7px 13px),
    linear-gradient(135deg, rgb(137 75 47), rgb(70 31 21));
  box-shadow: inset 0 -12px 28px rgb(34 14 10 / 22%);
}

.field-guide-hero h1,
.collection-heading h2,
.language-guide-card strong {
  font-family: 'Source Serif 4', Georgia, serif;
}

.coordinate-label,
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
  background: rgb(244 235 207);
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

.collection-heading {
  position: relative;
  border-bottom: 1px solid rgb(120 53 15 / 20%);
  padding-bottom: 1.25rem;
}

.collection-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  width: 4.5rem;
  border-radius: 9999px;
  background: rgb(42 103 110);
  content: '';
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
  transform: translateY(-0.25rem);
}

.language-guide-card:hover::before {
  transform: scaleX(1);
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
  border: 1px solid rgb(139 94 61 / 48%);
  border-radius: 0.25rem;
  background: rgb(238 224 193);
  padding: 0.35rem;
  box-shadow: 1px 2px 0 rgb(120 53 15 / 10%);
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
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

html.dark .field-guide-page {
  background-color: rgb(58 36 26);
  background-image:
    radial-gradient(circle at 20% 18%, rgb(196 154 74 / 4%) 0 0.7px, transparent 1px),
    radial-gradient(circle at 72% 63%, rgb(0 0 0 / 25%) 0 0.8px, transparent 1px),
    repeating-linear-gradient(22deg, transparent 0 8px, rgb(196 154 74 / 1.5%) 9px, transparent 10px 17px),
    linear-gradient(135deg, rgb(73 45 31), rgb(41 27 21));
  background-size: 8px 10px, 11px 9px, auto, auto;
}

html.dark .field-guide-hero {
  background:
    radial-gradient(circle at 50% 125%, rgb(95 143 145 / 24%), transparent 48%),
    linear-gradient(135deg, rgb(35 65 65), rgb(20 42 46));
}

html.dark .field-guide {
  border-color: rgb(106 74 50);
  background: rgb(47 32 24);
  box-shadow:
    0 16px 40px rgb(0 0 0 / 34%),
    inset 0 0 50px rgb(0 0 0 / 16%);
}

html.dark .field-guide::before {
  border-color: rgb(196 154 74 / 16%);
}

html.dark .back-link {
  color: rgb(232 216 188);
}

html.dark .back-link:hover {
  color: rgb(240 228 207);
}

html.dark .language-guide-card {
  border-color: rgb(106 74 50);
  background: rgb(56 37 26 / 90%);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 18%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .collection-heading {
  border-bottom-color: rgb(196 154 74 / 16%);
}

html.dark .collection-heading::after {
  background: rgb(209 190 162);
}

html.dark .card-heading strong {
  color: rgb(250 244 232);
}

html.dark .card-heading small,
html.dark .rule-note {
  color: rgb(205 187 157);
}

html.dark .flag-frame {
  border-color: rgb(209 190 162 / 30%);
  background: rgb(47 33 25);
  box-shadow: 1px 2px 0 rgb(0 0 0 / 20%);
}

html.dark .character-specimens {
  border-color: rgb(106 74 50);
  background: rgb(67 48 34 / 65%);
}

html.dark .character-specimens span {
  color: rgb(240 228 207);
}

html.dark .card-footer {
  border-color: rgb(106 74 50);
  color: rgb(209 190 162);
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

  .guide-grid {
    grid-template-columns: 1fr;
  }

  .language-guide-card {
    min-height: 18rem;
  }

}

@media (prefers-reduced-motion: reduce) {
  .language-guide-card {
    animation: none;
    transition: none;
  }

  .language-guide-card:hover {
    transform: none;
  }

  .back-link,
  .card-arrow {
    transition: none;
  }
}
</style>
