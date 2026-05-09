<template>
  <LanguageDetails :chars="chars" original-name="Deutsch" name="German" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ä', name: 'A Umlaut' },
  { letter: 'ö', name: 'O Umlaut' },
  { letter: 'ü', name: 'U Umlaut' },
  { letter: 'ß', name: 'Eszett (scharfes S)' },
]
const imageUrl = 'https://flagcdn.com/w320/de.png'
</script>
