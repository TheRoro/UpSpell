<template>
  <section aria-labelledby="expedition-summary">
    <div class="summary-heading">
      <h2 id="expedition-summary" class="text-3xl font-black sm:text-4xl">
        Your progress
      </h2>
      <p class="summary-note">Stored privately on this device</p>
    </div>

    <div class="summary-grid mt-7">
      <article class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z" />
            <path d="M7 4.5v15M9.5 8h5M9.5 11h4" />
          </svg>
        </span>
        <span>
          <strong>{{ totalPlayed }}</strong>
          <small>Words explored</small>
        </span>
      </article>

      <article class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
          </svg>
        </span>
        <span>
          <strong>{{ accuracy }}%</strong>
          <small>Overall accuracy</small>
        </span>
      </article>

      <article class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3.5c.7 3.5 4.2 4.5 4.2 8.4a4.2 4.2 0 0 1-8.4 0c0-2.2 1.2-3.8 2.7-5.3.1 2 1 3.1 1.5 3.5.8-1.8.5-4.2 0-6.6z" />
          </svg>
        </span>
        <span>
          <strong>{{ overallBestStreak }}</strong>
          <small>Best streak</small>
        </span>
      </article>

      <article class="summary-card">
        <span class="summary-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 18.5c4.5-1 5.5-5 8-7s4.5-1 8-6" />
            <circle cx="4" cy="18.5" r="1.5" />
            <circle cx="12" cy="11.5" r="1.5" />
            <circle cx="20" cy="5.5" r="1.5" />
          </svg>
        </span>
        <span>
          <strong>{{ languagesExplored }}<em>/{{ languageCount }}</em></strong>
          <small>Routes charted</small>
        </span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  totalPlayed: number
  accuracy: number
  overallBestStreak: number
  languagesExplored: number
  languageCount: number
}>()
</script>

<style scoped>
.summary-heading {
  position: relative;
  border-bottom: 1px solid var(--atlas-panel-inner-border);
  padding-bottom: 1.25rem;
}

.summary-heading::after {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 3px;
  width: 4.5rem;
  border-radius: 9999px;
  background: var(--atlas-accent-strong);
  content: '';
}

.summary-heading h2,
.summary-card strong {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
}

.summary-note {
  margin-top: 0.65rem;
  color: var(--atlas-muted);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.9rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.summary-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.45rem;
  background: var(--atlas-card);
  padding: 1rem;
  box-shadow: var(--atlas-card-shadow);
}

.summary-icon {
  display: grid;
  height: 2.75rem;
  width: 2.75rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9999px;
  background: rgb(111 150 146 / 15%);
  color: var(--atlas-accent-text);
}

.summary-icon svg {
  height: 1.45rem;
  width: 1.45rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.summary-card strong {
  display: block;
  font-size: clamp(1.6rem, 3vw, 2.15rem);
  font-weight: 800;
  line-height: 1;
}

.summary-card strong em {
  color: var(--atlas-muted);
  font-family: 'Overpass', sans-serif;
  font-size: 0.8rem;
  font-style: normal;
}

.summary-card small {
  display: block;
  margin-top: 0.35rem;
  color: var(--atlas-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 0.9rem;
  }
}
</style>
