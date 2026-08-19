<template>
  <AtlasPageShell>
    <AtlasHero
      :title="`${metadata.name} sounds`"
      :subtitle="`IPA sounds connected to ${metadata.englishName} spelling`"
      :language="metadata.code"
    />

    <AtlasPanel class="mx-auto my-6 max-w-6xl px-5 py-8 sm:my-10 sm:px-10 sm:py-10">
      <AtlasNavigation
        class="mb-8"
        back-label="All IPA sounds"
        back-to="/phonetics"
        forward-label="Copy characters"
        :forward-to="metadata.route"
        label="Language phonetics navigation"
      />

      <PhoneticsDirectoryHeader
        heading-id="language-sounds-heading"
        kicker="Language sound inventory"
        :title="`Explore ${metadata.englishName} sounds`"
        description="Sounds are grouped by IPA rather than by character. Open one to compare its spellings, articulation, and examples."
        :count="sounds.length"
      />

      <nav class="language-switcher" aria-label="Choose another language">
        <NuxtLink to="/phonetics">All sounds</NuxtLink>
        <NuxtLink
          v-for="language in languageMetadata"
          :key="language.code"
          :to="`/phonetics/${language.code}`"
          :aria-current="language.code === metadata.code ? 'page' : undefined"
        >
          <img :src="language.flag" alt="" />
          {{ language.englishName }}
        </NuxtLink>
      </nav>

      <section class="sound-group" aria-labelledby="language-vowels">
        <div class="group-heading">
          <h3 id="language-vowels">Vowels</h3>
          <span>{{ sounds.length }}</span>
        </div>
        <div class="sound-grid">
          <IpaSoundCard
            v-for="sound in sounds"
            :key="sound.symbol"
            :sound="sound"
            :language="metadata.code"
          />
        </div>
      </section>
    </AtlasPanel>
  </AtlasPageShell>
</template>

<script setup lang="ts">
import { getIpaSoundProfiles } from '~/data/characterProfiles'
import {
  getLanguageMetadata,
  languageMetadata,
} from '~/data/languageMetadata'

const route = useRoute()
const code = String(route.params.code)
const metadata = getLanguageMetadata(code)
const sounds = getIpaSoundProfiles(code)

usePageSeo({
  title: `${metadata.englishName} IPA Sounds | UpSpell`,
  description: `Explore IPA sounds, articulation, spellings, and examples connected to ${metadata.englishName}.`,
  path: `/phonetics/${code}`,
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.15rem 0.1rem;
}

.language-switcher a {
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

.language-switcher a[aria-current='page'],
.language-switcher a:hover {
  border-color: var(--atlas-accent-strong);
  color: var(--atlas-accent-text);
}

.language-switcher a:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 2px;
}

.language-switcher img {
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
