<template>
  <div class="min-h-screen">
    <Banner title="Character Reference" sub-title="Special characters for all languages" />
    <div class="px-6 sm:px-10 pt-8 pb-4">
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
        @click="navigateTo('/')"
      >
        ← Back to Daily Spell
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
useHead({
  title: 'Character Reference',
  meta: [
    { name: 'description', content: 'Special characters reference for 11 languages' },
  ],
})

const languages = [
  { name: 'Français', imageUrl: 'https://flagcdn.com/w320/fr.png', route: '/fr' },
  { name: 'Español', imageUrl: 'https://flagcdn.com/w320/es.png', route: '/es' },
  { name: 'Português', imageUrl: 'https://flagcdn.com/w320/pt.png', route: '/pt' },
  { name: 'Italiano', imageUrl: 'https://flagcdn.com/w320/it.png', route: '/it' },
  { name: 'Română', imageUrl: 'https://flagcdn.com/w320/ro.png', route: '/ro' },
  { name: 'Deutsch', imageUrl: 'https://flagcdn.com/w320/de.png', route: '/de' },
  { name: 'Русский язык', imageUrl: 'https://flagcdn.com/w320/ru.png', route: '/ru' },
  { name: 'Türkçe', imageUrl: 'https://flagcdn.com/w320/tr.png', route: '/tr' },
  { name: 'Polski', imageUrl: 'https://flagcdn.com/w320/pl.png', route: '/pl' },
  { name: 'Čeština', imageUrl: 'https://flagcdn.com/w320/cz.png', route: '/cs' },
  { name: 'Tiếng Việt', imageUrl: 'https://flagcdn.com/w320/vn.png', route: '/vi' },
  { name: 'Íslenska', imageUrl: 'https://flagcdn.com/w320/is.png', route: '/is' },
]
</script>
