// PWA Config
const title = 'Wilook Back-Office'
const description = 'Template to get you up and running with Nuxt 3 & Vuetify 3'
const image = 'https://vuetify3nuxt3starter.behonbaker.com/starter.png'
const url = 'https://vuetify3nuxt3starter.behonbaker.com/'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  setup (app) {
    console.log('TEST')
  },
  experimental: {
    treeshakeClientOnly: false
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_PUBLIC_KEY,
    redirect: false,
    redirectOptions: {
      login: '/signin',
      callback: '/confirm',
      exclude: []
    }
  },
  css: [
    '~/assets/main.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/devtools',
    '@nuxt/image-edge'
  ],
  app: {
    head: {
      title,
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'canonical',
          href: url
        }
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { property: 'og:site_name', content: title },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: url
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: image
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image
        }
      ]
    }
  }
})
