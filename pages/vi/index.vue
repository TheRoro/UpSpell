<template>
  <LanguageDetails :chars="chars" original-name="Tiếng Việt" name="Vietnamese" :image-url="imageUrl" />
</template>

<script setup lang="ts">
const chars = [
  { letter: 'ă', name: 'A breve' },
  { letter: 'â', name: 'A circumflex' },
  { letter: 'đ', name: 'D with stroke' },
  { letter: 'ê', name: 'E circumflex' },
  { letter: 'ô', name: 'O circumflex' },
  { letter: 'ơ', name: 'O with horn' },
  { letter: 'ư', name: 'U with horn' },
  { letter: 'à', name: 'A with grave (huyền)' },
  { letter: 'á', name: 'A with acute (sắc)' },
  { letter: 'ả', name: 'A with hook (hỏi)' },
  { letter: 'ã', name: 'A with tilde (ngã)' },
  { letter: 'ạ', name: 'A with dot below (nặng)' },
]
const imageUrl = 'https://flagcdn.com/w320/vn.png'
</script>
