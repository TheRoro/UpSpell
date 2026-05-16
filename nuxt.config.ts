export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  app: {
    head: {
      title: 'UpSpell',
      titleTemplate: '%s | UpSpell',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Daily accent quiz — pick the right special character!' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://upspell.vercel.app/' },
        { property: 'og:title', content: 'UpSpell | Daily Accent Challenge' },
        { property: 'og:description', content: 'Daily accent quiz — pick the right special character!' },
        { property: 'og:image', content: '/upspell_flags.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/upspell_logo.png' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var d=localStorage.getItem('upspell-dark');if(d==='1'||(d===null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          type: 'text/javascript',
        },
      ],
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'UpSpell',
      short_name: 'UpSpell',
      description: 'Daily accent quiz — pick the right special character!',
      theme_color: '#3b82f6',
      background_color: '#f9fafb',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/upspell_logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/upspell_logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/upspell_logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /\.png$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },

  googleFonts: {
    families: {
      Lato: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    download: true,
    overwriting: true,
  },
})
