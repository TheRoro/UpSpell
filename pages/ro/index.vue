<template>
  <LanguageDetails :chars="chars" code="ro" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ă', name: 'A cu breve' },
  { letter: 'â', name: 'A cu circumflex' },
  { letter: 'î', name: 'I cu circumflex' },
  { letter: 'ș', name: 'S cu virgulă' },
  { letter: 'ț', name: 'T cu virgulă' },
]
</script>
