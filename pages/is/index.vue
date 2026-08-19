<template>
  <LanguageDetails :chars="chars" code="is" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('is')
</script>
