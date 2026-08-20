<template>
  <AtlasSectionHeader
    class="phonetics-directory-heading"
    :heading-id="headingId"
    :eyebrow="kicker"
    :title="title"
    :description="description"
    :count-label="`${count} ${count === 1 ? 'sound' : 'sounds'}`"
  />
</template>

<script setup lang="ts">
defineProps<{
  headingId: string
  kicker: string
  title: string
  description: string
  count: number
}>()
</script>
