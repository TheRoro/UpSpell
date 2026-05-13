<template>
  <LanguageDetails :chars="chars" original-name="Čeština" name="Czech" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'á', name: 'A with acute (dlouhé á)' },
  { letter: 'č', name: 'C with háček' },
  { letter: 'ď', name: 'D with háček' },
  { letter: 'é', name: 'E with acute (dlouhé é)' },
  { letter: 'ě', name: 'E with háček' },
  { letter: 'í', name: 'I with acute (dlouhé í)' },
  { letter: 'ň', name: 'N with háček' },
  { letter: 'ó', name: 'O with acute (dlouhé ó)' },
  { letter: 'ř', name: 'R with háček (unique to Czech)' },
  { letter: 'š', name: 'S with háček' },
  { letter: 'ť', name: 'T with háček' },
  { letter: 'ú', name: 'U with acute' },
  { letter: 'ů', name: 'U with ring (kroužek)' },
  { letter: 'ý', name: 'Y with acute (dlouhé ý)' },
  { letter: 'ž', name: 'Z with háček' },
]
const imageUrl = 'https://flagcdn.com/w320/cz.png'
</script>
