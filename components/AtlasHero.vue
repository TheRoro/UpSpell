<template>
  <header class="atlas-hero">
    <div class="atlas-route-line" aria-hidden="true" />
    <div class="atlas-compass" aria-hidden="true">
      <span>N</span>
      <strong>✦</strong>
    </div>
    <div class="relative mx-auto max-w-5xl px-6 py-10 text-center sm:py-14">
      <p class="text-xs font-black uppercase tracking-[0.28em] text-amber-200">
        {{ eyebrow }}
      </p>
      <h1 :lang="language" class="mt-2 text-4xl font-black text-amber-50 sm:text-6xl">
        {{ title }}
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-base text-amber-100/85 sm:text-lg">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle: string
  eyebrow?: string
  language?: string
}>(), {
  eyebrow: 'UpSpell Language Atlas',
  language: undefined,
})
</script>

<style scoped>
.atlas-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-bottom: 5px double var(--atlas-gold);
  background: var(--atlas-hero-background);
  box-shadow: inset 0 -12px 28px rgb(34 14 10 / 22%);
}

.atlas-hero::after {
  position: absolute;
  inset: 0.65rem;
  z-index: -1;
  border: 1px dashed rgb(232 204 145 / 38%);
  border-radius: 0.4rem;
  content: '';
}

.atlas-hero h1 {
  font-family: 'Source Serif 4', Georgia, serif;
}

.atlas-route-line {
  position: absolute;
  left: 8%;
  top: 68%;
  width: 84%;
  border-top: 2px dashed rgb(253 230 138 / 22%);
  transform: rotate(-2deg);
}

.atlas-compass {
  position: absolute;
  top: 50%;
  left: 8%;
  display: grid;
  height: 6rem;
  width: 6rem;
  place-items: center;
  border: 1px solid rgb(255 237 190 / 18%);
  border-radius: 9999px;
  color: rgb(255 237 190 / 32%);
  transform: translateY(-50%) rotate(-12deg);
}

.atlas-compass::before,
.atlas-compass::after {
  position: absolute;
  background: currentColor;
  content: '';
}

.atlas-compass::before {
  height: 120%;
  width: 1px;
}

.atlas-compass::after {
  height: 1px;
  width: 120%;
}

.atlas-compass span {
  position: absolute;
  top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
}

.atlas-compass strong {
  font-size: 1.5rem;
}

@media (max-width: 640px) {
  .atlas-compass {
    left: -2rem;
    opacity: 0.6;
  }
}
</style>
