<template>
  <nav class="resource-navigation" aria-label="UpSpell resources">
    <button class="resource-card group" @click="navigateTo('/stats')">
      <span class="resource-icon" aria-hidden="true">⌁</span>
      <span>
        <strong>Stats</strong>
        <small>Review accuracy, streaks, and past discoveries</small>
      </span>
      <span class="resource-arrow" aria-hidden="true">→</span>
    </button>
    <button class="resource-card group" @click="navigateTo('/reference')">
      <span class="resource-icon resource-icon-character" aria-hidden="true">á</span>
      <span>
        <strong>Characters</strong>
        <small>Study and copy special characters</small>
      </span>
      <span class="resource-arrow" aria-hidden="true">→</span>
    </button>
  </nav>
</template>

<style scoped>
.resource-navigation {
  display: grid;
  gap: 1rem;
}

.resource-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 1rem;
  background: var(--atlas-card);
  padding: 1.25rem;
  text-align: left;
  box-shadow: var(--atlas-card-shadow);
  transition: transform 250ms ease, box-shadow 250ms ease;
}

.resource-card:hover {
  transform: translateY(-0.2rem);
  box-shadow:
    4px 7px 0 rgb(120 53 15 / 12%),
    inset 0 0 0 2px rgb(255 255 255 / 18%);
}

.resource-card:focus-visible {
  outline: 3px solid var(--atlas-focus);
  outline-offset: 3px;
}

.resource-icon {
  display: flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgb(111 150 146 / 18%);
  color: var(--atlas-accent-text);
  font-size: 1.25rem;
  font-weight: 900;
}

.resource-icon-character {
  background: rgb(166 112 34 / 16%);
  color: rgb(132 79 23);
}

.resource-card strong,
.resource-card small {
  display: block;
}

.resource-card strong {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1rem;
}

.resource-card small {
  margin-top: 0.2rem;
  color: var(--atlas-muted);
  font-size: 0.75rem;
}

.resource-arrow {
  color: var(--atlas-muted);
  transition: transform 250ms ease;
}

.resource-card:hover .resource-arrow {
  transform: translateX(0.25rem);
}

html.dark .resource-icon-character {
  color: rgb(226 205 168);
}

@media (min-width: 640px) {
  .resource-navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .resource-card,
  .resource-arrow {
    transition: none;
  }

  .resource-card:hover,
  .resource-card:hover .resource-arrow {
    transform: none;
  }
}
</style>
