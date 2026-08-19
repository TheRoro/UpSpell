<template>
  <LanguageDetails :chars="chars" code="fr" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('fr')
</script>
