<template>
  <button
    type="button"
    class="destination-card group relative overflow-hidden rounded-2xl border bg-amber-50/80 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-700/40 dark:border-[#6A4A32] dark:bg-[#38251A]"
    :class="status === 'completed'
      ? 'border-emerald-200 dark:border-emerald-800'
      : status === 'practice'
        ? 'border-amber-200 dark:border-amber-800'
        : 'border-gray-200'"
    :style="{
      '--card-delay': `${index * 55}ms`,
      '--stamp-tilt': `${index % 2 === 0 ? -2 : 2}deg`,
    }"
    :aria-label="`${actionLabel} ${englishName} challenge`"
    @click="$emit('select')"
  >
    <span
      class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
      :class="status === 'completed' ? 'bg-emerald-500' : status === 'practice' ? 'bg-amber-500' : 'bg-blue-500'"
      aria-hidden="true"
    />

    <span
      v-if="status === 'completed'"
      class="completion-marker absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-emerald-100 bg-emerald-700 font-black text-white shadow-md"
      aria-hidden="true"
    >
      ✓
    </span>

    <span class="flex items-start justify-between gap-4">
      <span class="flag-frame flex h-14 w-16 shrink-0 items-center justify-center bg-white p-2 shadow-md dark:bg-gray-900">
        <img :src="flag" alt="" class="h-8 w-12 rounded object-cover shadow-sm" />
      </span>

      <span
        class="mastery-ring"
        :style="{ '--mastery': `${mastery * 3.6}deg` }"
        :aria-label="played ? `${mastery}% accuracy` : 'No games played yet'"
      >
        <span>
          <strong>{{ played ? mastery : '★' }}</strong>
          <small>{{ played ? '%' : 'New' }}</small>
        </span>
      </span>
    </span>

    <span class="mt-4 block">
      <span class="block text-xl font-black text-gray-900 dark:text-white">{{ name }}</span>
      <span class="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">{{ englishName }}</span>
    </span>

    <span class="mt-4 flex flex-wrap items-center gap-2">
      <span
        class="map-label rounded-md border-2 border-current px-3 py-1 text-xs font-black uppercase tracking-wider"
        :class="status === 'completed'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
          : status === 'practice'
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'"
      >
        {{ actionLabel }}
      </span>
      <span v-if="streak" class="text-xs font-bold text-orange-600 dark:text-orange-300">
        🔥 {{ streak }} day streak
      </span>
      <span v-else-if="missed" class="text-xs font-medium text-gray-500 dark:text-gray-400">
        {{ missed }} saved for practice
      </span>
    </span>

    <span class="mt-5 flex items-center justify-between border-t border-dashed border-amber-200 pt-4 text-xs font-semibold text-gray-400 dark:border-[#6A4A32] dark:text-[#C7AF8B]">
      <span>{{ wordCount }} words</span>
      <span class="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  englishName: string
  flag: string
  status: 'play' | 'completed' | 'practice'
  mastery: number
  played: number
  streak: number
  missed: number
  wordCount: number
  index: number
}>()

defineEmits<{
  select: []
}>()

const actionLabel = computed(() => {
  if (props.status === 'completed') return 'Discovered'
  if (props.status === 'practice') return 'Revisit'
  return 'Explore today'
})
</script>

<style scoped>
.destination-card {
  isolation: isolate;
  background-color: rgb(255 248 231);
  animation: card-arrival 520ms var(--card-delay) cubic-bezier(0.16, 1, 0.3, 1) both;
}

.destination-card::after {
  position: absolute;
  inset: 0.55rem;
  z-index: -1;
  border: 1px dashed rgb(180 83 9 / 18%);
  border-radius: 0.7rem;
  content: '';
  pointer-events: none;
}

.flag-frame {
  border: 1px dashed rgb(148 163 184);
  border-radius: 0.35rem;
  transform: rotate(var(--stamp-tilt));
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.destination-card:hover .flag-frame {
  transform: rotate(0deg) scale(1.08);
}

.mastery-ring {
  display: grid;
  height: 3.5rem;
  width: 3.5rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9999px;
  background: conic-gradient(rgb(59 130 246) var(--mastery), rgb(229 231 235) 0);
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

.completion-marker {
  animation: stamp-in 520ms calc(var(--card-delay) + 300ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.map-label {
  transform: rotate(var(--stamp-tilt));
  transition: transform 250ms ease;
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

@keyframes stamp-in {
  from {
    opacity: 0;
    transform: scale(1.8) rotate(-18deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .destination-card,
  .completion-marker {
    animation: none;
  }

  .destination-card,
  .flag-frame,
  .map-label {
    transition-duration: 0ms;
  }
}
</style>

<style>
html.dark .destination-card {
  background-color: rgb(56 37 26);
}

html.dark .destination-card::after {
  border-color: rgb(251 191 36 / 14%);
}

html.dark .destination-card .mastery-ring {
  background: conic-gradient(rgb(95 143 145) var(--mastery), rgb(78 54 39) 0);
}

html.dark .destination-card .mastery-ring > span {
  background: rgb(56 37 26);
  color: rgb(244 229 197);
}
</style>
