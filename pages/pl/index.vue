<template>
  <LanguageDetails :chars="chars" code="pl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ą', name: 'A ogonek' },
  { letter: 'ć', name: 'C acute' },
  { letter: 'ę', name: 'E ogonek' },
  { letter: 'ł', name: 'L with stroke' },
  { letter: 'ń', name: 'N acute' },
  { letter: 'ó', name: 'O acute' },
  { letter: 'ś', name: 'S acute' },
  { letter: 'ź', name: 'Z acute' },
  { letter: 'ż', name: 'Z with dot above' },
]
</script>
