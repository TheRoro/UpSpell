<template>
  <NuxtLink
    :to="soundPath"
    :aria-label="`Open IPA vowel /${sound.symbol}/`"
    class="sound-card"
  >
    <span class="sound-symbol">/{{ sound.symbol }}/</span>
    <span class="sound-content">
      <span class="spelling-list">
        <template v-if="visibleSpellings.length">
          Written as
          <span
            v-for="spelling in visibleSpellings"
            :key="`${spelling.languageCode}-${spelling.letter}`"
            :lang="spelling.languageCode"
          >{{ spelling.letter }}</span>
        </template>
        <template v-else>
          Used in {{ sound.languageCodes.length }}
          {{ sound.languageCodes.length === 1 ? 'language' : 'languages' }}
        </template>
      </span>
    </span>
    <span class="sound-arrow" aria-hidden="true">→</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getIpaSoundPath,
  type IpaSoundProfile,
} from '~/data/characterProfiles'

const props = defineProps<{
  sound: IpaSoundProfile
  language?: string
}>()

const soundPath = computed(() => getIpaSoundPath(props.sound.symbol))
const visibleSpellings = computed(() =>
  props.language
    ? props.sound.spellings.filter(spelling => spelling.languageCode === props.language)
    : props.sound.spellings.slice(0, 5),
)
</script>

<style scoped>
.sound-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  min-height: 7.25rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.75rem;
  background: var(--atlas-card);
  padding: 1rem 1.15rem;
  color: inherit;
  text-decoration: none;
  box-shadow: var(--atlas-card-shadow);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.sound-card:hover {
  border-color: rgb(42 103 110 / 52%);
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
  transform: translateY(-0.18rem);
}

.sound-card:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 3px;
}

.sound-symbol {
  display: grid;
  min-width: 4.5rem;
  min-height: 3.75rem;
  place-items: center;
  border-radius: 0.7rem;
  background: rgb(111 150 146 / 16%);
  color: var(--atlas-accent-text);
  font-family: 'Segoe UI', 'Noto Sans', sans-serif;
  font-size: 1.45rem;
  font-weight: 800;
}

.spelling-list {
  display: block;
}

.spelling-list {
  color: var(--atlas-muted);
  font-size: 0.8rem;
  font-weight: 650;
}

.spelling-list span {
  margin-left: 0.3rem;
  color: var(--atlas-accent-text);
  font-size: 0.9rem;
  font-weight: 800;
}

.sound-arrow {
  color: var(--atlas-accent-text);
  font-weight: 800;
  transition: transform 180ms ease;
}

.sound-card:hover .sound-arrow {
  transform: translateX(0.2rem);
}

html.dark .sound-symbol {
  background: rgb(111 150 146 / 18%);
}

@media (prefers-reduced-motion: reduce) {
  .sound-card,
  .sound-arrow {
    transition: none;
  }

  .sound-card:hover,
  .sound-card:hover .sound-arrow {
    transform: none;
  }
}
</style>
