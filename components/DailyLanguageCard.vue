<template>
  <button
    type="button"
    class="language-card group relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800"
    :class="status === 'completed'
      ? 'border-emerald-200 dark:border-emerald-800'
      : status === 'practice'
        ? 'border-amber-200 dark:border-amber-800'
        : 'border-gray-200'"
    :style="{ '--card-delay': `${index * 55}ms` }"
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
      class="completion-stamp absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-black text-white shadow-md"
      aria-hidden="true"
    >
      ✓
    </span>

    <span class="flex items-start justify-between gap-4">
      <span class="flag-frame flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-2 shadow-inner dark:from-gray-700 dark:to-gray-900">
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
        class="rounded-full px-3 py-1 text-xs font-bold"
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

    <span class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400 dark:border-gray-700 dark:text-gray-500">
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
  if (props.status === 'completed') return 'Completed'
  if (props.status === 'practice') return 'Practice'
  return 'Play today'
})
</script>

<style scoped>
.language-card {
  animation: card-arrival 520ms var(--card-delay) cubic-bezier(0.16, 1, 0.3, 1) both;
}

.flag-frame {
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.language-card:hover .flag-frame {
  transform: rotate(-3deg) scale(1.08);
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

:global(.dark) .mastery-ring {
  background: conic-gradient(rgb(96 165 250) var(--mastery), rgb(55 65 81) 0);
}

:global(.dark) .mastery-ring > span {
  background: rgb(31 41 55);
  color: white;
}

.completion-stamp {
  animation: stamp-in 520ms calc(var(--card-delay) + 300ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
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
  .language-card,
  .completion-stamp {
    animation: none;
  }

  .language-card,
  .flag-frame {
    transition-duration: 0ms;
  }
}
</style>
