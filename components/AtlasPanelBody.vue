<template>
  <div class="atlas-panel-body">
    <slot />
  </div>
</template>

<style scoped>
.atlas-panel-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 64rem;
  margin-right: auto;
  margin-left: auto;
}
</style>
