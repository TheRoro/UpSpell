<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <button
      type="button"
      class="theme-toggle"
      :class="{ 'theme-toggle-dark': isDark }"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :aria-pressed="isDark"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggleDark"
    >
      <span class="theme-toggle-thumb" aria-hidden="true" />
      <span class="theme-toggle-icon theme-toggle-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
        </svg>
      </span>
      <span class="theme-toggle-icon theme-toggle-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M19.5 15.1A8 8 0 0 1 8.9 4.5a8 8 0 1 0 10.6 10.6z" />
        </svg>
      </span>
    </button>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const isDark = ref(false)

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => unknown
}

function applyDark(dark: boolean) {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', dark)
  }
}

function toggleDark() {
  const nextDark = !isDark.value
  const root = document.documentElement
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const transitionDocument = document as ViewTransitionDocument

  const updateTheme = async () => {
    isDark.value = nextDark
    applyDark(nextDark)
    await nextTick()
  }

  if (!prefersReducedMotion && transitionDocument.startViewTransition) {
    transitionDocument.startViewTransition(updateTheme)
  } else if (!prefersReducedMotion) {
    root.classList.add('theme-transitioning')
    void updateTheme()
    window.setTimeout(() => root.classList.remove('theme-transitioning'), 500)
  } else {
    void updateTheme()
  }

  localStorage.setItem('upspell-dark', nextDark ? '1' : '0')
}

onMounted(() => {
  // Sync with the inline script that already applied the class
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 460ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

html.theme-transitioning *,
html.theme-transitioning *::before,
html.theme-transitioning *::after {
  transition-property: background-color, border-color, color, fill, stroke, box-shadow !important;
  transition-duration: 420ms !important;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
</style>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: grid;
  width: 5.25rem;
  height: 2.75rem;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  border: 1px solid rgb(87 46 31 / 34%);
  border-radius: 9999px;
  background: rgb(255 248 231 / 94%);
  padding: 0.25rem;
  color: rgb(120 93 72);
  box-shadow:
    0 6px 18px rgb(38 14 8 / 24%),
    inset 0 0 0 1px rgb(255 255 255 / 45%);
  backdrop-filter: blur(8px);
  transition:
    border-color 360ms cubic-bezier(0.22, 1, 0.36, 1),
    background 360ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle:hover {
  border-color: rgb(87 46 31 / 55%);
  box-shadow:
    0 8px 22px rgb(38 14 8 / 30%),
    inset 0 0 0 1px rgb(255 255 255 / 45%);
}

.theme-toggle:focus-visible {
  outline: 3px solid rgb(217 179 106 / 75%);
  outline-offset: 3px;
}

.theme-toggle-thumb {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgb(157 91 56), rgb(102 48 31));
  box-shadow: 0 2px 7px rgb(38 14 8 / 30%);
  transition:
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    background 360ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle-dark .theme-toggle-thumb {
  background: linear-gradient(135deg, rgb(50 78 77), rgb(20 42 46));
  transform: translateX(2.5rem);
}

.theme-toggle-icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  transition:
    color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle-icon svg {
  width: 1.15rem;
  height: 1.15rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.theme-toggle-sun,
.theme-toggle-dark .theme-toggle-moon {
  color: rgb(255 239 208);
  transform: scale(1.05);
}

.theme-toggle-moon,
.theme-toggle-dark .theme-toggle-sun {
  color: rgb(120 93 72);
  transform: scale(0.9);
}

:global(html.dark) .theme-toggle {
  border-color: rgb(209 190 162 / 28%);
  background: rgb(47 32 24 / 94%);
  box-shadow:
    0 6px 18px rgb(0 0 0 / 38%),
    inset 0 0 0 1px rgb(240 228 207 / 5%);
}

:global(html.dark) .theme-toggle:hover {
  border-color: rgb(209 190 162 / 48%);
}

:global(html.dark) .theme-toggle-dark .theme-toggle-moon {
  color: rgb(240 228 207);
}

:global(html.dark) .theme-toggle-dark .theme-toggle-sun {
  color: rgb(164 143 116);
}

@media (max-width: 480px) {
  .theme-toggle {
    top: 0.75rem;
    right: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle-thumb,
  .theme-toggle-icon {
    transition: none;
  }
}
</style>
