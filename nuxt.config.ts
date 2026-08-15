export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  css: ['~/assets/css/atlas.css'],

  experimental: {
    appManifest: false,
  },

  app: {
    head: {
      title: 'UpSpell',
      titleTemplate: '%s',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#4b3024' },
        { name: 'description', content: 'Explore words, spelling, and special characters across 12 languages in a daily language atlas.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://upspell.vercel.app/' },
        { property: 'og:site_name', content: 'UpSpell' },
        { property: 'og:title', content: 'UpSpell | Daily Language Atlas' },
        { property: 'og:description', content: 'Explore words, spelling, and special characters across 12 languages, one discovery at a time.' },
        { property: 'og:image', content: 'https://upspell.vercel.app/upspell-social.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'UpSpell daily language atlas' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'UpSpell | Daily Language Atlas' },
        { name: 'twitter:description', content: 'Explore words, spelling, and special characters across 12 languages, one discovery at a time.' },
        { name: 'twitter:image', content: 'https://upspell.vercel.app/upspell-social.png' },
        { name: 'twitter:image:alt', content: 'UpSpell daily language atlas' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '256x256', href: '/upspell_logo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/upspell-180.png' },
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
    'nuxt-security',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
  ],

  security: {
    strict: true,
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'connect-src': ["'self'"],
        'default-src': ["'none'"],
        'font-src': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'frame-src': ["'none'"],
        'img-src': ["'self'", 'data:'],
        'manifest-src': ["'self'"],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'upgrade-insecure-requests': true,
        'worker-src': ["'self'"],
      },
      permissionsPolicy: {
        camera: [],
        'display-capture': [],
        fullscreen: [],
        geolocation: [],
        microphone: [],
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
    },
    requestSizeLimiter: false,
    rateLimiter: false,
    xssValidator: false,
    corsHandler: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'UpSpell',
      short_name: 'UpSpell',
      description: 'Explore words, spelling, and special characters across 12 languages in a daily language atlas.',
      id: '/',
      start_url: '/',
      scope: '/',
      lang: 'en',
      categories: ['education', 'games'],
      theme_color: '#4b3024',
      background_color: '#f4ebcf',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/upspell-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/upspell-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/upspell-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
      globIgnores: ['**/words-*.js'],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|webp|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
        {
          urlPattern: /\/_nuxt\/words-[a-z]{2}-.*\.js$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'language-data',
            expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
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
      Overpass: [400, 500, 600, 700, 800],
      'Overpass+Mono': [500, 600, 700],
      'Source+Serif+4': [600, 700, 800],
    },
    download: true,
    overwriting: true,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: '_nuxt/[name].[hash].js',
          manualChunks(id) {
            const match = id.replaceAll('\\', '/').match(/\/data\/words\/([a-z]{2})\.ts$/)
            return match ? `words-${match[1]}` : undefined
          },
        },
      },
    },
  },
})
