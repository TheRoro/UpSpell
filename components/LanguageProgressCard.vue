<template>
  <article
    class="route-card"
    :class="{ 'route-card-uncharted': played === 0 }"
    :style="{ '--card-delay': `${index * 45}ms` }"
  >
    <div class="route-card-header">
      <span class="flag-frame">
        <img :src="flag" alt="" />
      </span>
      <span class="min-w-0">
        <strong :lang="code">{{ name }}</strong>
        <small>{{ englishName }}</small>
      </span>
      <span v-if="played === 0" class="uncharted-label">Uncharted</span>
      <span
        v-else
        class="accuracy-seal"
        :style="{ '--accuracy': `${accuracy * 3.6}deg` }"
        :aria-label="`${accuracy}% accuracy in ${englishName}`"
      >
        <span>{{ accuracy }}<small>%</small></span>
      </span>
    </div>

    <div class="route-progress">
      <div class="route-progress-label">
        <span>{{ played }} {{ played === 1 ? 'word' : 'words' }} explored</span>
        <span>{{ won }} correct</span>
      </div>
      <div
        class="route-progress-track"
        role="progressbar"
        :aria-label="`${englishName} accuracy`"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="accuracy"
      >
        <span :style="{ width: `${accuracy}%` }" />
      </div>
    </div>

    <dl class="route-details">
      <div>
        <dt>Current streak</dt>
        <dd>{{ currentStreak }} <span aria-hidden="true">🔥</span></dd>
      </div>
      <div>
        <dt>Best streak</dt>
        <dd>{{ bestStreak }}</dd>
      </div>
      <div>
        <dt>Vowels explored</dt>
        <dd>{{ vowelsExplored }}<small>/{{ vowelCount }}</small></dd>
      </div>
    </dl>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  code: string
  name: string
  englishName: string
  flag: string
  played: number
  won: number
  accuracy: number
  currentStreak: number
  bestStreak: number
  vowelsExplored: number
  vowelCount: number
  index: number
}>()
</script>

<style scoped>
.route-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--atlas-card-border);
  border-radius: var(--atlas-radius-card);
  background: var(--atlas-card);
  padding: 1.15rem;
  box-shadow: var(--atlas-card-shadow);
  animation: card-arrive 420ms var(--card-delay) ease both;
}

.route-card::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0.22rem;
  background: var(--atlas-accent-strong);
  content: '';
}

.route-card-uncharted {
  opacity: 0.72;
}

.route-card-uncharted::before {
  background: var(--atlas-muted);
}

.route-card-header {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  gap: 0.8rem;
}

.flag-frame {
  display: grid;
  height: 2.8rem;
  width: 3.5rem;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--atlas-card-border);
  border-radius: 0.25rem;
  background: var(--atlas-flag-background);
  padding: 0.35rem;
  box-shadow: 1px 2px 0 rgb(120 53 15 / 10%);
}

.flag-frame img {
  height: 1.8rem;
  width: 2.7rem;
  border-radius: 0.15rem;
  object-fit: cover;
}

.route-card-header strong {
  display: block;
  overflow: hidden;
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-card-header small {
  display: block;
  margin-top: 0.1rem;
  color: var(--atlas-muted);
  font-size: 0.75rem;
}

.accuracy-seal {
  display: grid;
  height: 3.35rem;
  width: 3.35rem;
  flex-shrink: 0;
  place-items: center;
  margin-left: auto;
  border-radius: 9999px;
  background: conic-gradient(var(--atlas-accent-strong) var(--accuracy), var(--atlas-route-track) 0);
}

.accuracy-seal > span {
  display: flex;
  height: 2.65rem;
  width: 2.65rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--atlas-card);
  color: var(--atlas-accent-text);
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1;
}

.accuracy-seal small {
  margin-left: 0.05rem;
  font-size: 0.58rem;
  transform: translateY(0.08rem);
}

.uncharted-label {
  margin-left: auto;
  border-bottom: 1px solid var(--atlas-panel-border);
  color: var(--atlas-muted);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.route-progress {
  margin-top: 1rem;
}

.route-progress-label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--atlas-link);
  font-family: 'Overpass Mono', monospace;
  font-size: 0.66rem;
}

.route-progress-track {
  height: 0.42rem;
  overflow: hidden;
  margin-top: 0.45rem;
  border-radius: 9999px;
  background: var(--atlas-route-track);
}

.route-progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--atlas-accent-text), var(--atlas-accent));
  transition: width 600ms ease;
}

.route-details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 1rem;
  border-top: 1px solid var(--atlas-card-border);
  padding-top: 0.8rem;
  font-family: 'Overpass Mono', monospace;
}

.route-details > div + div {
  border-left: 1px solid var(--atlas-card-border);
  padding-left: 1rem;
}

.route-details dt {
  color: var(--atlas-muted);
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.route-details dd {
  margin-top: 0.2rem;
  color: var(--atlas-text);
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 800;
}

.route-details dd small {
  margin-left: 0.1rem;
  color: var(--atlas-muted);
  font-family: 'Overpass', sans-serif;
  font-size: 0.65rem;
}

@keyframes card-arrive {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .route-card {
    animation: none;
  }

  .route-progress-track span {
    transition: none;
  }
}
</style>
