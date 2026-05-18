<template>
  <LanguageDetails :chars="chars" code="pt" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'á', name: 'A com acento agudo' },
  { letter: 'à', name: 'A com acento grave' },
  { letter: 'â', name: 'A com acento circunflexo' },
  { letter: 'ã', name: 'A com til' },
  { letter: 'é', name: 'E com acento agudo' },
  { letter: 'ê', name: 'E com acento circunflexo' },
  { letter: 'í', name: 'I com acento agudo' },
  { letter: 'ó', name: 'O com acento agudo' },
  { letter: 'ô', name: 'O com acento circunflexo' },
  { letter: 'õ', name: 'O com til' },
  { letter: 'ú', name: 'U com acento agudo' },
  { letter: 'ç', name: 'C cedilha' },
]
</script>
