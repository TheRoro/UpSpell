<template>
  <button
    type="button"
    :aria-label="`Copy ${char.letter}, ${char.name}`"
    class="character-card"
    @click="copyChar"
  >
    <span class="character-content">
      <span :lang="language" class="character-letter">{{ char.letter }}</span>
      <span class="character-name">{{ char.name }}</span>
    </span>
    <span class="copy-label">
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="6.5" y="6.5" width="9" height="9" rx="1.5" />
        <path d="M4.5 12.5h-.5a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v.5" />
      </svg>
      Copy
    </span>
  </button>
</template>

<script setup lang="ts">
import { copyText } from '~/utils/clipboard'

interface Char {
  letter: string
  name: string
}

const props = defineProps<{
  char: Char
  language: string
}>()

const emit = defineEmits<{
  copied: [success: boolean]
}>()

async function copyChar() {
  emit('copied', await copyText(props.char.letter))
}
</script>

<style scoped>
.character-card {
  position: relative;
  display: grid;
  aspect-ratio: 6 / 5;
  grid-template-rows: 1fr auto auto 1fr;
  justify-items: center;
  overflow: hidden;
  border: 1px solid rgb(120 53 15 / 18%);
  border-radius: 0.65rem;
  background: rgb(255 251 235 / 84%);
  padding: 1.5rem 1.25rem;
  box-shadow:
    2px 3px 0 rgb(120 53 15 / 10%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.character-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 0.22rem;
  background: rgb(111 150 146);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.character-content {
  display: flex;
  grid-row: 2;
  flex-direction: column;
  align-items: center;
  transform: translateY(0.75rem);
}

.character-card:hover {
  border-color: rgb(42 103 110 / 45%);
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
  transform: translateY(-0.25rem);
}

.character-card:hover::before {
  transform: scaleX(1);
}

.character-card:focus-visible {
  outline: 3px solid rgb(42 103 110 / 45%);
  outline-offset: 3px;
}

.character-letter {
  color: rgb(30 78 83);
  font-size: clamp(3.45rem, 8vw, 4.85rem);
  font-weight: 700;
  line-height: 1;
}

.character-name {
  min-height: 2.6rem;
  margin-top: 0.35rem;
  color: rgb(68 64 60);
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
}

.copy-label {
  display: inline-flex;
  grid-row: 3;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.45rem;
  color: rgb(32 91 98);
  font-size: 0.68rem;
  font-weight: 700;
  transform: translateY(0.3rem);
}

.copy-label svg {
  height: 0.85rem;
  width: 0.85rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.3;
}

html.dark .character-card {
  border-color: rgb(106 74 50);
  background: rgb(56 37 26);
  box-shadow:
    2px 3px 0 rgb(0 0 0 / 18%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .character-card::before {
  background: rgb(209 190 162);
}

html.dark .character-card:hover {
  border-color: rgb(209 190 162 / 55%);
  box-shadow:
    4px 7px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .character-letter {
  color: var(--guide-dark-accent-strong, rgb(240 228 207));
}

html.dark .character-name {
  color: rgb(226 205 168);
}

html.dark .copy-label {
  color: var(--guide-dark-accent, rgb(209 190 162));
}

html.dark .character-card:focus-visible {
  outline-color: rgb(209 190 162 / 55%);
}

@media (prefers-reduced-motion: reduce) {
  .character-card {
    transition: none;
  }

  .character-card::before {
    transition: none;
  }

  .character-card:hover {
    transform: none;
  }

  .character-card:hover::before {
    transform: scaleX(0);
  }
}
</style>
