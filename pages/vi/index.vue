<template>
  <LanguageDetails :chars="chars" code="vi" />
</template>

<script setup lang="ts">
import { getLanguageCharacters } from '~/data/characterProfiles'

const chars = getLanguageCharacters('vi')
</script>
