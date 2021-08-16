export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'UpSpell',
    titleTemplate: '%s - Special Characters',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Special Characters for all languages' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og:type',
        name: 'og:type',
        content: 'website'
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: 'https://upspell.vercel.app/'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'UpSpell - Special Characters'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Special Characters for all languages'
      }
      // {
      //   hid: 'og:image',
      //   property: 'og:image',
      //   content:
      //   '/test.png'
      // }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://google-fonts.nuxtjs.org
    '@nuxtjs/google-fonts'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  googleFonts: {
    families: {
      Lato: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    download: true,
    overwriting: true
  }
}
