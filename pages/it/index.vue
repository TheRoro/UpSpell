<template>
  <LanguageDetails :chars="chars" original-name="Italiano" name="Italian" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'à', name: 'A con accento grave' },
  { letter: 'è', name: 'E con accento grave' },
  { letter: 'é', name: 'E con accento acuto' },
  { letter: 'ì', name: 'I con accento grave' },
  { letter: 'ò', name: 'O con accento grave' },
  { letter: 'ù', name: 'U con accento grave' },
]
const imageUrl = 'https://flagcdn.com/w320/it.png'
</script>
