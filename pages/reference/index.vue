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
        :image-url="lang.flag"
        :route="lang.route"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { languageMetadata as languages } from '~/data/languageMetadata'

usePageSeo({
  title: 'Character reference - UpSpell',
  description: 'Copy and learn special characters for all 12 languages supported by UpSpell.',
  path: '/reference',
})
</script>
