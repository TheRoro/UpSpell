<template>
  <LanguageDetails :chars="chars" code="pl" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('pl')
</script>
