<template>
  <AtlasPageShell>
    <AtlasHero
      title="Phonetics"
      subtitle="Browse speech sounds first, then see how languages write and use them."
    />

    <AtlasPanel class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <AtlasNavigation
        class="mb-8"
        back-label="Back to the map"
        back-to="/"
        forward-label="Copy characters"
        forward-to="/reference"
        label="Phonetics navigation"
      />

      <section class="sound-directory" aria-labelledby="sound-directory-heading">
        <PhoneticsDirectoryHeader
          heading-id="sound-directory-heading"
          kicker="International Phonetic Alphabet"
          title="Explore sounds"
          description="Start with an IPA sound, learn how it is produced, then compare the characters and words that use it."
          :count="sounds.length"
        />

        <nav class="language-filters" aria-label="Filter sounds by language">
          <NuxtLink to="/phonetics" aria-current="page">All sounds</NuxtLink>
          <NuxtLink
            v-for="language in languageMetadata"
            :key="language.code"
            :to="`/phonetics/${language.code}`"
          >
            <img :src="language.flag" alt="" />
            {{ language.englishName }}
          </NuxtLink>
        </nav>

        <section class="sound-group" aria-labelledby="vowel-sounds">
          <div class="group-heading">
            <h3 id="vowel-sounds">Vowels</h3>
            <span>{{ sounds.length }}</span>
          </div>
          <div class="sound-grid">
            <IpaSoundCard
              v-for="sound in sounds"
              :key="sound.symbol"
              :sound="sound"
            />
          </div>
        </section>
      </section>
    </AtlasPanel>
  </AtlasPageShell>
</template>

<script setup lang="ts">
import { getIpaSoundProfiles } from '~/data/characterProfiles'
import { languageMetadata } from '~/data/languageMetadata'

usePageSeo({
  title: 'IPA Vowel Atlas | UpSpell',
  description: 'Explore IPA vowels with articulation guidance, spellings, and spoken examples.',
  path: '/phonetics',
})

const sounds = getIpaSoundProfiles()
</script>

<style scoped>
.language-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.15rem 0.1rem;
}

.language-filters a {
  display: inline-flex;
  min-height: 2.5rem;
  flex: 0 0 8.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 9999px;
  background: var(--atlas-flag-background);
  padding: 0.55rem 0.8rem;
  color: var(--atlas-muted);
  font-size: 0.72rem;
  font-weight: 750;
  text-decoration: none;
}

.language-filters a[aria-current='page'],
.language-filters a:hover {
  border-color: var(--atlas-accent-strong);
  color: var(--atlas-accent-text);
}

.language-filters a:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 2px;
}

.language-filters img {
  width: 1.35rem;
  height: 0.9rem;
  border-radius: 0.1rem;
  object-fit: cover;
}

.sound-group {
  margin-top: 2rem;
}

.group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 0.65rem;
}

.group-heading h3 {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 800;
}

.group-heading span {
  color: var(--atlas-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.sound-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .sound-grid {
    grid-template-columns: 1fr;
  }
}
</style>
