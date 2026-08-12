<template>
  <main class="atlas-panel">
    <div class="atlas-panel-content">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.atlas-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--atlas-panel-border);
  border-radius: var(--atlas-radius-panel);
  background-color: var(--atlas-panel);
  background-image: var(--atlas-panel-gradient);
  box-shadow: var(--atlas-panel-shadow);
}

.atlas-panel::before {
  position: absolute;
  inset: 0.65rem;
  z-index: 0;
  border: 1px solid var(--atlas-panel-inner-border);
  border-radius: 0.4rem;
  content: '';
  pointer-events: none;
}

.atlas-panel-content {
  position: relative;
  z-index: 1;
}

@media (max-width: 639px) {
  .atlas-panel {
    margin-right: 0.65rem;
    margin-left: 0.65rem;
  }
}
</style>
