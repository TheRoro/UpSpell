import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'
import { getLocalDayKey } from '~/utils/game'

export function useLocalDayKey() {
  const dayKey = ref(getLocalDayKey())
  let midnightTimer: ReturnType<typeof setTimeout> | undefined

  function refreshDay() {
    dayKey.value = getLocalDayKey()
  }

  function scheduleMidnightRefresh() {
    if (midnightTimer) clearTimeout(midnightTimer)

    const now = new Date()
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    )
    midnightTimer = setTimeout(() => {
      refreshDay()
      scheduleMidnightRefresh()
    }, nextMidnight.getTime() - now.getTime() + 100)
  }

  function refreshWhenVisible() {
    if (document.visibilityState === 'visible') {
      refreshDay()
      scheduleMidnightRefresh()
    }
  }

  onMounted(() => {
    refreshDay()
    scheduleMidnightRefresh()
    document.addEventListener('visibilitychange', refreshWhenVisible)
  })

  onBeforeUnmount(() => {
    if (midnightTimer) clearTimeout(midnightTimer)
    document.removeEventListener('visibilitychange', refreshWhenVisible)
  })

  return readonly(dayKey)
}
