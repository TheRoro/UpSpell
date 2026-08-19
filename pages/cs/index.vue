<template>
  <LanguageDetails :chars="chars" code="cs" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('cs')
</script>
