<template>
  <div class="min-h-screen">
    <Banner title="UpSpell" sub-title="Language Special Characters" />
    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 py-14">
      <LanguageCard
        v-for="lang in languages"
        :key="lang.name"
        :name="lang.name"
        :image-url="lang.imageUrl"
        :route="lang.route"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const languages = [
  {
    name: 'Français',
    imageUrl: 'https://flagcdn.com/w320/fr.png',
    route: '/fr',
  },
  {
    name: 'Español',
    imageUrl: 'https://flagcdn.com/w320/es.png',
    route: '/es',
  },
  {
    name: 'Português',
    imageUrl: 'https://flagcdn.com/w320/pt.png',
    route: '/pt',
  },
  {
    name: 'Italiano',
    imageUrl: 'https://flagcdn.com/w320/it.png',
    route: '/it',
  },
  {
    name: 'Română',
    imageUrl: 'https://flagcdn.com/w320/ro.png',
    route: '/ro',
  },
  {
    name: 'Deutsch',
    imageUrl: 'https://flagcdn.com/w320/de.png',
    route: '/de',
  },
  {
    name: 'Русский язык',
    imageUrl: 'https://flagcdn.com/w320/ru.png',
    route: '/ru',
  },
]
</script>
