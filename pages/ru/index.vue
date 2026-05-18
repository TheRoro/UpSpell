<template>
  <LanguageDetails :chars="chars" code="ru" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'а', name: 'A' },
  { letter: 'б', name: 'Be' },
  { letter: 'в', name: 'Ve' },
  { letter: 'г', name: 'Ge' },
  { letter: 'д', name: 'De' },
  { letter: 'е', name: 'Ye' },
  { letter: 'ё', name: 'Yo' },
  { letter: 'ж', name: 'Zhe' },
  { letter: 'з', name: 'Ze' },
  { letter: 'и', name: 'I' },
  { letter: 'й', name: 'Short I' },
  { letter: 'к', name: 'Ka' },
  { letter: 'л', name: 'El' },
  { letter: 'м', name: 'Em' },
  { letter: 'н', name: 'En' },
  { letter: 'о', name: 'O' },
  { letter: 'п', name: 'Pe' },
  { letter: 'р', name: 'Er' },
  { letter: 'с', name: 'Es' },
  { letter: 'т', name: 'Te' },
  { letter: 'у', name: 'U' },
  { letter: 'ф', name: 'Ef' },
  { letter: 'х', name: 'Kha' },
  { letter: 'ц', name: 'Tse' },
  { letter: 'ч', name: 'Che' },
  { letter: 'ш', name: 'Sha' },
  { letter: 'щ', name: 'Shcha' },
  { letter: 'ъ', name: 'Hard sign' },
  { letter: 'ы', name: 'Yeru' },
  { letter: 'ь', name: 'Soft sign' },
  { letter: 'э', name: 'E' },
  { letter: 'ю', name: 'Yu' },
  { letter: 'я', name: 'Ya' },
]
</script>
