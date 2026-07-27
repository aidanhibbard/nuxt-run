import { defineNuxtModule, createResolver } from '@nuxt/kit'
import type { NitroConfig } from 'nitropack'
import type { Plugin } from 'rollup'
import { scanRunScripts } from './utils/scan-run-scripts'
import { buildAllRunScripts } from './utils/build-all-run-scripts'
import { logger } from './utils/logger'

export interface ModuleOptions {
  runDir: string
  runPattern?: string
  outputDir: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-run',
    configKey: 'nuxtRun',
  },
  defaults: {
    runDir: 'server/run',
    runPattern: '**/index.{ts,js,mjs}',
    outputDir: '.output/server/run',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Resolve paths relative to nuxt root
    const runDir = resolve(nuxt.options.rootDir, options.runDir)
    const outputDir = resolve(nuxt.options.rootDir, options.outputDir)

    // Create rollup plugin
    const rollupPlugin: Plugin = {
      name: 'nuxt-run-build',
      async buildStart() {
        // Scan for run scripts
        const scripts = await scanRunScripts({
          runDir,
          pattern: options.runPattern,
        })

        if (scripts.length === 0) {
          logger.info('No run scripts found')
          return
        }

        // Build all run scripts
        await buildAllRunScripts({
          scripts,
          outputBase: outputDir,
        })
      },
    }

    // Hook into Nitro's config to inject rollup plugin
    nuxt.hook('nitro:config', (nitroConfig: NitroConfig) => {
      nitroConfig.rollupConfig = nitroConfig.rollupConfig ?? {}
      nitroConfig.rollupConfig.plugins = [
        ...(Array.isArray(nitroConfig.rollupConfig.plugins)
          ? nitroConfig.rollupConfig.plugins
          : []),
        rollupPlugin,
      ]
    })
  },
})
