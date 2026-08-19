<template>
  <LanguageDetails :chars="chars" code="ru" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('ru')
</script>
