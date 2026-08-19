<template>
  <div class="atlas-page-shell min-h-screen">
    <slot />
    <AtlasBottomNavigation :language-code="languageCode" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  languageCode?: string | null
}>()
</script>

<style scoped>
.atlas-page-shell {
  display: flow-root;
  padding-bottom: 6rem;
  background-color: var(--atlas-page-base);
  background-image: var(--atlas-page-background);
  background-size: var(--atlas-page-background-size);
  box-shadow: var(--atlas-page-shadow);
}
</style>
