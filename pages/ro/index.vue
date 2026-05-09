<template>
  <LanguageDetails :chars="chars" original-name="Română" name="Romanian" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ă', name: 'A cu breve' },
  { letter: 'â', name: 'A cu circumflex' },
  { letter: 'î', name: 'I cu circumflex' },
  { letter: 'ș', name: 'S cu virgulă' },
  { letter: 'ț', name: 'T cu virgulă' },
]
const imageUrl = 'https://flagcdn.com/w320/ro.png'
</script>
