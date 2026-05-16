<template>
  <LanguageDetails :chars="chars" original-name="Íslenska" name="Icelandic" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'á', name: 'A with acute' },
  { letter: 'ð', name: 'Eth (voiced th)' },
  { letter: 'é', name: 'E with acute' },
  { letter: 'í', name: 'I with acute' },
  { letter: 'ó', name: 'O with acute' },
  { letter: 'ú', name: 'U with acute' },
  { letter: 'ý', name: 'Y with acute' },
  { letter: 'þ', name: 'Thorn (voiceless th)' },
  { letter: 'æ', name: 'Ash (ae ligature)' },
  { letter: 'ö', name: 'O with diaeresis' },
]
const imageUrl = 'https://flagcdn.com/w320/is.png'
</script>
