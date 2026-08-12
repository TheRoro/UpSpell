<template>
  <AtlasPageShell>
    <AtlasHero
      title="Characters"
      subtitle="Browse special characters for every language."
    />

    <AtlasPanel class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <AtlasNavigation
        class="mb-8"
        back-label="Back to the map"
        back-to="/"
        label="Character collection navigation"
      />

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
    </AtlasPanel>
  </AtlasPageShell>
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
.collection-heading h2,
.language-guide-card strong {
  font-family: 'Source Serif 4', Georgia, serif;
}

.coordinate-label,
.card-footer {
  font-family: 'Overpass Mono', monospace;
}

.language-guide-card:focus-visible {
  border-radius: 0.35rem;
  outline: 3px solid var(--atlas-focus);
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

  .card-arrow {
    transition: none;
  }
}
</style>
