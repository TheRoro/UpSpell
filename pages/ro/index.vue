<template>
  <LanguageDetails :chars="chars" code="ro" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('ro')
</script>
