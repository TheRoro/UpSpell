<template>
  <div class="min-h-screen">
    <Banner title="UpSpell" sub-title="Language Special Characters" />

    <!-- Daily Spell CTA -->
    <div class="px-6 sm:px-10 pt-14 pb-6">
      <button
        class="w-full max-w-md mx-auto flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600
               hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg
               hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
        @click="navigateTo('/play')"
      >
        🎯 Daily Spell Challenge
      </button>
    </div>

    <div class="grid xs:grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6 sm:px-10 pb-14">
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
  {
    name: 'Türkçe',
    imageUrl: 'https://flagcdn.com/w320/tr.png',
    route: '/tr',
  },
  {
    name: 'Polski',
    imageUrl: 'https://flagcdn.com/w320/pl.png',
    route: '/pl',
  },
  {
    name: 'Čeština',
    imageUrl: 'https://flagcdn.com/w320/cz.png',
    route: '/cs',
  },
  {
    name: 'Tiếng Việt',
    imageUrl: 'https://flagcdn.com/w320/vn.png',
    route: '/vi',
  },
]
</script>
