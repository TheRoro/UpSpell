<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="section === 'map'">
      <path d="m3.5 6.5 5.5-2.5 6 2.5 5.5-2.5v13.5l-5.5 2.5-6-2.5-5.5 2.5z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </template>

    <template v-else-if="section === 'stats'">
      <path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M3 20h18" />
    </template>

    <template v-else-if="section === 'characters'">
      <path d="m4.5 19 5-14h2l5 14M6.5 14h8" />
      <path d="m15.5 8 4-3M17 19h3" />
    </template>

    <template v-else>
      <path d="M5 14h3l4 3V7l-4 3H5z" />
      <path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  section: 'map' | 'stats' | 'characters' | 'phonetics'
}>()
</script>

<style scoped>
svg {
  display: block;
  width: 1.3rem;
  height: 1.3rem;
}
</style>
