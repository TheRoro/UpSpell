<template>
  <LanguageDetails :chars="chars" code="es" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'á', name: 'A con tilde aguda' },
  { letter: 'é', name: 'E con tilde aguda' },
  { letter: 'í', name: 'I con tilde aguda' },
  { letter: 'ó', name: 'O con tilde aguda' },
  { letter: 'ú', name: 'U con tilde aguda' },
  { letter: 'ü', name: 'U con diéresis' },
  { letter: 'ñ', name: 'Eñe' },
  { letter: '¿', name: 'Signo de interrogación invertido' },
  { letter: '¡', name: 'Signo de exclamación invertido' },
]
</script>
