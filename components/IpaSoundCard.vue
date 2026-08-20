<template>
  <NuxtLink
    :to="soundPath"
    :aria-label="`Open IPA vowel /${sound.symbol}/`"
    class="sound-card"
    @click="recordSound"
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
import { recordExploredVowel } from '~/utils/progress'

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

function recordSound() {
  if (!props.language || !import.meta.client) return

  try {
    recordExploredVowel(localStorage, props.language, props.sound.symbol)
  } catch {
    // Navigation remains available when storage is disabled or full.
  }
}
</script>

<style scoped>
.sound-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  min-height: 7.25rem;
  overflow: hidden;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.75rem;
  background: var(--atlas-card);
  padding: 1rem 1.15rem;
  color: inherit;
  text-decoration: none;
  box-shadow: var(--atlas-card-shadow);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.sound-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 0.22rem;
  background: var(--atlas-accent);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.sound-card:hover {
  border-color: rgb(42 103 110 / 45%);
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
  transform: translateY(-0.25rem);
}

.sound-card:hover::before {
  transform: scaleX(1);
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
  line-height: 1;
  transform: translateY(-0.08rem);
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

html.dark .sound-card::before {
  background: var(--atlas-accent-strong);
}

html.dark .sound-card:hover {
  border-color: rgb(209 190 162 / 55%);
  box-shadow:
    4px 7px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

@media (prefers-reduced-motion: reduce) {
  .sound-card,
  .sound-card::before,
  .sound-arrow {
    transition: none;
  }

  .sound-card:hover,
  .sound-card:hover .sound-arrow {
    transform: none;
  }

  .sound-card:hover::before {
    transform: scaleX(0);
  }
}
</style>
