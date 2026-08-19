<template>
  <LanguageDetails :chars="chars" code="de" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('de')
</script>
