import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  runtimeConfig: {
    // Private (server-only) — overridable via NUXT_API_SECRET
    apiSecret: 'build-time-secret',
    // Nested
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    public: {
      // Public — overridable via NUXT_PUBLIC_APP_NAME
      appName: 'nuxt-run-playground',
    },
  },
  compatibilityDate: 'latest',
})
