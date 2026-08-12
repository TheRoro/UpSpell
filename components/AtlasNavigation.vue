<template>
  <nav class="atlas-navigation" :aria-label="label">
    <button type="button" class="atlas-navigation-link" @click="goBack">
      <span aria-hidden="true">←</span>
      {{ backLabel }}
    </button>
    <button
      v-if="forwardLabel"
      type="button"
      class="atlas-navigation-link atlas-navigation-forward"
      @click="goForward"
    >
      {{ forwardLabel }}
      <span aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  backLabel: string
  backTo?: string
  forwardLabel?: string
  forwardTo?: string
  label?: string
}>(), {
  backTo: undefined,
  forwardLabel: undefined,
  forwardTo: undefined,
  label: 'Page navigation',
})

const emit = defineEmits<{
  back: []
  forward: []
}>()

function goBack() {
  if (props.backTo) {
    void navigateTo(props.backTo)
    return
  }
  emit('back')
}

function goForward() {
  if (props.forwardTo) {
    void navigateTo(props.forwardTo)
    return
  }
  emit('forward')
}
</script>

<style scoped>
.atlas-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.atlas-navigation-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--atlas-link);
  font-weight: 700;
  transition: color 180ms ease, transform 180ms ease;
}

.atlas-navigation-link:hover {
  color: var(--atlas-accent-text);
  transform: translateX(-0.2rem);
}

.atlas-navigation-forward:hover {
  transform: translateX(0.2rem);
}

.atlas-navigation-link:focus-visible {
  border-radius: 0.25rem;
  outline: 3px solid var(--atlas-focus);
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .atlas-navigation {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .atlas-navigation-link {
    transition: none;
  }

  .atlas-navigation-link:hover {
    transform: none;
  }
}
</style>
