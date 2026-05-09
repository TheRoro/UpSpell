export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  app: {
    head: {
      title: 'UpSpell',
      titleTemplate: '%s - Special Characters',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Special Characters for all languages' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://upspell.vercel.app/' },
        { property: 'og:title', content: 'UpSpell - Special Characters' },
        { property: 'og:description', content: 'Special Characters for all languages' },
        { property: 'og:image', content: '/upspell_flags.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/upspell_logo.png' },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      Lato: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    download: true,
    overwriting: true,
  },
})
