<template>
  <header class="phonetics-directory-heading">
    <div>
      <p class="phonetics-directory-kicker">{{ kicker }}</p>
      <h2 :id="headingId">{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <span class="phonetics-directory-count">
      {{ count }} {{ count === 1 ? 'sound' : 'sounds' }}
    </span>
  </header>
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

<style scoped>
.phonetics-directory-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  border-bottom: 1px solid var(--atlas-card-border);
  padding-bottom: 1.25rem;
}

.phonetics-directory-kicker {
  color: var(--atlas-accent-text);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.phonetics-directory-heading h2 {
  margin-top: 0.4rem;
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(2rem, 5vw, 2.7rem);
  font-weight: 800;
}

.phonetics-directory-heading p:last-child {
  max-width: 48rem;
  margin-top: 0.55rem;
  color: var(--atlas-muted);
  line-height: 1.6;
}

.phonetics-directory-count {
  flex-shrink: 0;
  color: var(--atlas-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 720px) {
  .phonetics-directory-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
