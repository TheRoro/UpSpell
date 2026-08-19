<template>
  <LanguageDetails :chars="chars" code="pt" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('pt')
</script>
