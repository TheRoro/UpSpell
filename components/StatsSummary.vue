<template>
  <section aria-labelledby="expedition-summary">
    <AtlasSectionHeader
      heading-id="expedition-summary"
      eyebrow="Challenge progress"
      title="Your progress"
      description="Stored privately on this device."
    />

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
          <span class="summary-ipa">/ə/</span>
        </span>
        <span>
          <strong>{{ vowelsExplored }}<em>/{{ vowelCount }}</em></strong>
          <small>Vowels explored</small>
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
  vowelsExplored: number
  vowelCount: number
}>()
</script>

<style scoped>
.summary-card strong {
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
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

.summary-ipa {
  font-family: 'Overpass Mono', monospace;
  font-size: 0.9rem;
  font-weight: 800;
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
