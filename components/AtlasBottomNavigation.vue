<template>
  <footer class="bottom-navigation-shell">
    <nav class="bottom-navigation" aria-label="Primary navigation">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.section"
        :to="item.to"
        class="bottom-navigation-link"
        :class="{ 'bottom-navigation-link-active': isCurrent(item.section) }"
        :aria-current="isCurrent(item.section) ? 'page' : undefined"
      >
        <span class="bottom-navigation-icon" aria-hidden="true">
          <span v-if="item.icon === 'phonetics'" class="phonetics-glyph">/ə/</span>
          <AtlasBottomNavigationIcon v-else :section="item.icon" />
        </span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { languageMetadata } from '~/data/languageMetadata'
import {
  primaryNavigationItems,
  type PrimaryNavigationSection,
} from '~/data/primaryNavigation'

const props = defineProps<{
  languageCode?: string | null
}>()

const route = useRoute()
const supportedCodes = new Set(languageMetadata.map(language => language.code))
const routeLanguageCode = computed(() => {
  const parameterCode = typeof route.params.code === 'string'
    ? route.params.code
    : undefined
  if (parameterCode && supportedCodes.has(parameterCode)) return parameterCode

  const firstSegment = route.path.split('/').filter(Boolean)[0]
  return firstSegment && supportedCodes.has(firstSegment)
    ? firstSegment
    : undefined
})
const activeLanguageCode = computed(() =>
  props.languageCode && supportedCodes.has(props.languageCode)
    ? props.languageCode
    : routeLanguageCode.value,
)
const navigationItems = computed(() => primaryNavigationItems.map(item => ({
  ...item,
  to: item.section === 'phonetics' && activeLanguageCode.value
    ? `/phonetics/${activeLanguageCode.value}`
    : item.section === 'characters' && activeLanguageCode.value
      ? `/${activeLanguageCode.value}`
      : item.to,
})))

function isCurrent(section: PrimaryNavigationSection): boolean {
  if (section === 'challenge') return route.path === '/'
  if (section === 'stats') return route.path.startsWith('/stats')
  if (section === 'phonetics') return route.path.startsWith('/phonetics')
  if (route.path.startsWith('/reference')) return true
  return Boolean(routeLanguageCode.value && route.path === `/${routeLanguageCode.value}`)
}
</script>

<style scoped>
.bottom-navigation-shell {
  position: fixed;
  right: 0;
  bottom: 0.75rem;
  left: 0;
  z-index: 45;
  display: flex;
  justify-content: center;
  padding-inline: 0.75rem;
  pointer-events: none;
}

.bottom-navigation {
  display: grid;
  width: min(38rem, 100%);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid var(--atlas-panel-border);
  border-radius: 1rem;
  background: rgb(255 248 231 / 94%);
  padding: 0.35rem;
  box-shadow:
    0 10px 30px rgb(38 14 8 / 24%),
    inset 0 0 0 1px rgb(255 255 255 / 45%);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.bottom-navigation-link {
  display: flex;
  min-width: 0;
  min-height: 3.4rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  border-radius: 0.7rem;
  color: var(--atlas-muted);
  font-size: 0.67rem;
  font-weight: 750;
  text-decoration: none;
}

.bottom-navigation-link:hover {
  background: rgb(111 150 146 / 10%);
  color: var(--atlas-accent-text);
}

.bottom-navigation-link:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 2px;
}

.bottom-navigation-link-active {
  background: rgb(111 150 146 / 16%);
  color: var(--atlas-accent-text);
}

.bottom-navigation-icon {
  display: grid;
  width: 2rem;
  height: 1.5rem;
  place-items: center;
}

.phonetics-glyph {
  display: block;
  font-family: 'Overpass Mono', monospace;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

html.dark .bottom-navigation {
  border-color: rgb(209 190 162 / 28%);
  background: rgb(47 32 24 / 94%);
  box-shadow:
    0 10px 30px rgb(0 0 0 / 38%),
    inset 0 0 0 1px rgb(240 228 207 / 5%);
}

html.dark .bottom-navigation-link-active,
html.dark .bottom-navigation-link:hover {
  background: rgb(111 150 146 / 18%);
}

@media (max-width: 430px) {
  .bottom-navigation-shell {
    bottom: 0.5rem;
    padding-inline: 0.5rem;
  }

  .bottom-navigation {
    border-radius: 0.85rem;
    padding: 0.25rem;
  }

  .bottom-navigation-link {
    min-height: 3.2rem;
    font-size: 0.6rem;
  }
}
</style>
