<template>
  <button
    type="button"
    class="destination-card group relative overflow-hidden rounded-2xl border border-amber-900/20 bg-amber-50/80 p-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6F9692]/45 dark:border-[#6A4A32] dark:bg-[#38251A]"
    :style="{
      '--card-delay': `${index * 55}ms`,
      '--stamp-tilt': `${index % 2 === 0 ? -2 : 2}deg`,
    }"
    :aria-label="`${actionLabel} ${englishName} challenge`"
    @click="$emit('select')"
  >
    <span
      class="route-accent absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
      :class="`route-accent-${status}`"
      aria-hidden="true"
    />

    <span class="flex items-start justify-between gap-4">
      <span class="flag-frame flex h-14 w-16 shrink-0 items-center justify-center bg-[#EEE0C1] p-2 shadow-md dark:bg-[#2F2119]">
        <img :src="flag" alt="" class="h-8 w-12 rounded object-cover shadow-sm" />
      </span>

      <span
        v-if="played"
        class="mastery-ring"
        :class="{ 'mastery-ring-complete': mastery === 100 }"
        :style="{ '--mastery': `${mastery * 3.6}deg` }"
        :aria-label="`${mastery}% accuracy`"
      >
        <span>
          <strong>{{ mastery }}</strong>
          <small>%</small>
        </span>
      </span>
      <span v-else class="uncharted-marker">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 2.5v15M2.5 10h15" />
          <circle cx="10" cy="10" r="3.5" />
        </svg>
        Uncharted
      </span>
    </span>

    <span class="mt-4 block">
      <span class="destination-name block text-xl font-black text-gray-900 dark:text-white">{{ name }}</span>
      <span class="destination-subtitle mt-0.5 block text-sm text-gray-500">{{ englishName }}</span>
    </span>

    <span class="card-field-notes mt-4 block">
      <span class="field-note-label">Featured marks</span>
      <span class="featured-marks mt-2 flex flex-wrap gap-2">
        <span v-for="mark in featuredMarks" :key="mark">{{ mark }}</span>
      </span>
      <span :lang="languageCode" class="featured-words mt-3 block">
        {{ featuredWords.join(' · ') }}
      </span>
    </span>

    <span class="card-footer mt-5 flex flex-wrap items-center gap-2 border-t border-solid border-amber-900/20 pt-4 dark:border-[#6A4A32]">
      <span
        v-if="status !== 'play'"
        class="map-label rounded-md px-3 py-1 text-xs font-black uppercase tracking-wider"
        :class="`map-label-${status}`"
      >
        {{ actionLabel }}
      </span>
      <span v-if="streak" class="text-xs font-bold text-orange-600 dark:text-orange-300">
        🔥 {{ streak }} day streak
      </span>
      <span v-else-if="missed" class="progress-note text-xs font-medium text-gray-500">
        {{ missed }} saved for practice
      </span>
      <span class="ml-auto text-amber-900/55 transition-transform duration-300 group-hover:translate-x-1 dark:text-[#C7AF8B]" aria-hidden="true">→</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  englishName: string
  languageCode: string
  flag: string
  status: 'play' | 'completed' | 'practice'
  mastery: number
  played: number
  streak: number
  missed: number
  featuredMarks: string[]
  featuredWords: string[]
  index: number
}>()

defineEmits<{
  select: []
}>()

const actionLabel = computed(() => {
  if (props.status === 'completed') return 'Charted'
  if (props.status === 'practice') return 'Revisit route'
  return 'Explore today'
})
</script>

<style scoped>
.destination-card {
  isolation: isolate;
  border-color: var(--atlas-card-border);
  background-color: var(--atlas-card);
  box-shadow: var(--atlas-card-shadow);
  transition: box-shadow 220ms ease, transform 220ms ease;
  animation: card-arrival 520ms var(--card-delay) cubic-bezier(0.16, 1, 0.3, 1) both;
}

.destination-card:hover {
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
  transform: translateY(-0.25rem);
}

.destination-card::after {
  position: absolute;
  inset: 0.55rem;
  z-index: -1;
  border: 1px solid rgb(180 83 9 / 16%);
  border-radius: 0.7rem;
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 18%);
  content: '';
  pointer-events: none;
}

.flag-frame {
  border: 1px solid rgb(139 94 61 / 48%);
  border-radius: 0.35rem;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.destination-card:hover .flag-frame {
  transform: rotate(var(--stamp-tilt)) scale(1.06);
}

.destination-name {
  font-family: 'Source Serif 4', Georgia, serif;
}

.field-note-label,
.map-label,
.uncharted-marker {
  font-family: 'Overpass', sans-serif;
}

.field-note-label,
.map-label,
.uncharted-marker,
.featured-marks {
  font-family: 'Overpass Mono', monospace;
}

.route-accent-play {
  background: var(--atlas-accent);
}

.route-accent-completed {
  background: var(--atlas-accent-strong);
}

.route-accent-practice {
  background: rgb(166 112 34);
}

.mastery-ring {
  display: grid;
  height: 3.5rem;
  width: 3.5rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9999px;
  background: conic-gradient(var(--atlas-accent) var(--mastery), var(--atlas-route-track) 0);
}

.mastery-ring-complete {
  background: conic-gradient(var(--atlas-accent-strong) var(--mastery), var(--atlas-route-track) 0);
}

.mastery-ring > span {
  display: flex;
  height: 2.75rem;
  width: 2.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: white;
  color: rgb(31 41 55);
  line-height: 1;
}

.mastery-ring strong {
  font-size: 0.875rem;
}

.mastery-ring small {
  margin-top: 0.15rem;
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
}

.uncharted-marker {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid rgb(120 53 15 / 32%);
  padding: 0.2rem 0.1rem;
  color: rgb(120 53 15 / 70%);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transform: rotate(1deg);
}

.uncharted-marker svg {
  height: 0.9rem;
  width: 0.9rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.25;
}

.card-field-notes {
  min-height: 6.7rem;
  border-left: 2px solid rgb(111 150 146 / 38%);
  padding-left: 0.8rem;
}

.field-note-label {
  color: rgb(120 53 15 / 68%);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.featured-marks > span {
  display: inline-grid;
  min-width: 2rem;
  place-items: center;
  border: 0;
  border-radius: 0.25rem;
  background: rgb(229 219 187 / 84%);
  padding: 0.2rem 0.4rem;
  color: rgb(53 110 105);
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow:
    inset 0 0 0 1px rgb(120 53 15 / 10%),
    inset 0 1px 2px rgb(120 53 15 / 12%);
}

.featured-words {
  color: rgb(87 65 49);
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.4;
}

.map-label {
  border: 0;
  border-left: 3px solid currentColor;
  background: rgb(255 251 235 / 88%);
  box-shadow:
    1px 2px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 1px rgb(120 53 15 / 8%);
  transform: rotate(var(--stamp-tilt));
  transition: transform 250ms ease;
}

.map-label-completed {
  color: rgb(42 91 87);
}

.map-label-practice {
  color: rgb(146 91 18);
}

.destination-card:hover .map-label {
  transform: rotate(0deg) scale(1.04);
}

@keyframes card-arrival {
  from {
    opacity: 0;
    transform: translateY(1rem) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .destination-card {
    animation: none;
  }

  .destination-card,
  .flag-frame,
  .map-label {
    transition-duration: 0ms;
  }

  .destination-card:hover,
  .destination-card:hover .flag-frame {
    transform: none;
  }
}
</style>

<style>
html.dark .destination-card {
  background-color: var(--atlas-card);
  box-shadow: var(--atlas-card-shadow);
}

html.dark .destination-card:hover {
  box-shadow:
    4px 7px 0 rgb(0 0 0 / 24%),
    inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .destination-card::after {
  border-color: rgb(196 154 74 / 20%);
  box-shadow: inset 0 0 0 2px rgb(196 154 74 / 3%);
}

html.dark .destination-card .flag-frame {
  border-color: rgb(209 190 162 / 30%);
}

html.dark .destination-card .mastery-ring {
  background: conic-gradient(rgb(209 190 162) var(--mastery), rgb(78 54 39) 0);
}

html.dark .destination-card .mastery-ring > span {
  background: rgb(56 37 26);
  color: rgb(244 229 197);
}

html.dark .destination-card .uncharted-marker {
  border-bottom-color: rgb(214 184 122 / 48%);
  color: rgb(226 201 150);
}

html.dark .destination-card .card-field-notes {
  border-left-color: rgb(209 190 162 / 38%);
}

html.dark .destination-card .field-note-label {
  color: rgb(218 191 140);
}

html.dark .destination-card .featured-marks > span {
  background: rgb(67 48 34);
  color: rgb(240 228 207);
  box-shadow:
    inset 0 0 0 1px rgb(209 190 162 / 20%),
    inset 0 1px 2px rgb(0 0 0 / 28%);
}

html.dark .destination-card .featured-words {
  color: rgb(226 205 168);
}

html.dark .destination-card .map-label {
  background: rgb(63 46 33);
  box-shadow: 1px 2px 0 rgb(0 0 0 / 18%);
}

html.dark .destination-card .map-label-completed {
  color: rgb(240 228 207);
}

html.dark .destination-card .map-label-practice {
  color: rgb(220 174 89);
}

html.dark .destination-card .destination-subtitle {
  color: rgb(205 189 164);
}

html.dark .destination-card .progress-note {
  color: rgb(219 198 164);
}
</style>
