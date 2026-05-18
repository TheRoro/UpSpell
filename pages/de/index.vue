<template>
  <LanguageDetails :chars="chars" code="de" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ä', name: 'A Umlaut' },
  { letter: 'ö', name: 'O Umlaut' },
  { letter: 'ü', name: 'U Umlaut' },
  { letter: 'ß', name: 'Eszett (scharfes S)' },
]
</script>
