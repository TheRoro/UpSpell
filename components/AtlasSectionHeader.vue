<template>
  <header class="atlas-section-heading">
    <div>
      <p class="atlas-section-eyebrow">{{ eyebrow }}</p>
      <h2 :id="headingId">{{ title }}</h2>
      <p class="atlas-section-description">{{ description }}</p>
    </div>
    <span v-if="countLabel" class="atlas-section-count">{{ countLabel }}</span>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  headingId: string
  eyebrow: string
  title: string
  description: string
  countLabel?: string
}>()
</script>

<style scoped>
.atlas-section-heading {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 1.25rem;
}

.atlas-section-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 4.5rem;
  height: 3px;
  border-radius: 9999px;
  background: var(--atlas-accent-strong);
  content: '';
}

.atlas-section-eyebrow {
  color: var(--atlas-accent-text);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.atlas-section-heading h2 {
  margin-top: 0.5rem;
  color: var(--atlas-text);
  font-family: 'Overpass', sans-serif;
  font-size: clamp(1.875rem, 5vw, 2.25rem);
  font-weight: 900;
  line-height: 1.1;
}

.atlas-section-description {
  max-width: 48rem;
  margin-top: 0.75rem;
  color: var(--atlas-muted);
  line-height: 1.6;
}

.atlas-section-count {
  flex-shrink: 0;
  color: var(--atlas-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .atlas-section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
