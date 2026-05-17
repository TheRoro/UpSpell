<template>
  <div class="min-h-screen">
    <Banner title="Stats" sub-title="Your UpSpell progress" />

    <div class="px-6 sm:px-10 py-8">
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium mb-8"
        @click="navigateTo('/')"
      >
        ← Back to Daily Spell
      </button>

      <!-- Overall stats -->
      <div class="max-w-2xl mx-auto mb-10">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 text-center border border-gray-200 dark:border-gray-700">
            <p class="text-3xl font-bold text-gray-800 dark:text-white">{{ totalPlayed }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Played</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 text-center border border-gray-200 dark:border-gray-700">
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ accuracy }}%</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 text-center border border-gray-200 dark:border-gray-700">
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ overallBestStreak }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Best Streak</p>
          </div>
        </div>
      </div>

      <!-- Per-language stats -->
      <div class="max-w-2xl mx-auto">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">By Language</h2>
        <div class="space-y-3">
          <div
            v-for="stat in langStats"
            :key="stat.code"
            class="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <img :src="stat.flag" :alt="stat.name" class="w-10 h-7 rounded object-cover" />
            <span class="font-semibold text-gray-800 dark:text-white w-28">{{ stat.name }}</span>

            <!-- Progress bar -->
            <div class="flex-1">
              <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-green-500 rounded-full transition-all duration-500"
                  :style="{ width: stat.accuracy + '%' }"
                />
              </div>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300 w-12 text-right">{{ stat.accuracy }}%</span>

            <!-- Streak -->
            <span v-if="stat.currentStreak > 0" class="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
              🔥 {{ stat.currentStreak }}
            </span>
            <span v-else class="w-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { languages } from '~/data/words'

useHead({
  title: 'Stats',
})

interface LangStat {
  code: string
  name: string
  flag: string
  played: number
  won: number
  accuracy: number
  currentStreak: number
  bestStreak: number
}

const langStats = ref<LangStat[]>([])

onMounted(() => {
  langStats.value = languages.map(lang => {
    const played = parseInt(localStorage.getItem(`upspell-played-${lang.code}`) || '0')
    const won = parseInt(localStorage.getItem(`upspell-won-${lang.code}`) || '0')
    const currentStreak = parseInt(localStorage.getItem(`upspell-streak-${lang.code}`) || '0')
    const bestStreak = parseInt(localStorage.getItem(`upspell-best-${lang.code}`) || '0')
    return {
      code: lang.code,
      name: lang.name,
      flag: lang.flag,
      played,
      won,
      accuracy: played > 0 ? Math.round((won / played) * 100) : 0,
      currentStreak,
      bestStreak,
    }
  })
})

const totalPlayed = computed(() => langStats.value.reduce((sum, s) => sum + s.played, 0))
const totalWon = computed(() => langStats.value.reduce((sum, s) => sum + s.won, 0))
const accuracy = computed(() => totalPlayed.value > 0 ? Math.round((totalWon.value / totalPlayed.value) * 100) : 0)
const overallBestStreak = computed(() => Math.max(0, ...langStats.value.map(s => s.bestStreak)))
</script>
