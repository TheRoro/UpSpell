<template>
  <LanguageDetails :chars="chars" code="es" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('es')
</script>
