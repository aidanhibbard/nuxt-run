import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
})
