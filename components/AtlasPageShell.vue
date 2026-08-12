<template>
  <div class="atlas-page-shell min-h-screen">
    <slot />
  </div>
</template>

<style scoped>
.atlas-page-shell {
  display: flow-root;
  background-color: var(--atlas-page-base);
  background-image: var(--atlas-page-background);
  background-size: var(--atlas-page-background-size);
  box-shadow: var(--atlas-page-shadow);
}
</style>
