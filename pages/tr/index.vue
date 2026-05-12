<template>
  <LanguageDetails :chars="chars" original-name="Türkçe" name="Turkish" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ç', name: 'Çe (C with cedilla)' },
  { letter: 'ğ', name: 'Yumuşak ge (Soft G)' },
  { letter: 'ı', name: 'Dotless I (lowercase)' },
  { letter: 'İ', name: 'Dotted İ (uppercase)' },
  { letter: 'ö', name: 'Ö (O with umlaut)' },
  { letter: 'ş', name: 'Şe (S with cedilla)' },
  { letter: 'ü', name: 'Ü (U with umlaut)' },
]
const imageUrl = 'https://flagcdn.com/w320/tr.png'
</script>
