import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { name, version, configKey, compatibility } from '../package.json'
import type { Nitro, NitroConfig } from 'nitropack'
import { createRunRollupPlugin } from './utils/create-run-rollup-plugin'
import { applyNitroRunConfig } from './utils/apply-nitro-run-config'
import { isolateServerEntryChunks } from './utils/isolate-server-entry-chunks'

export interface ModuleOptions {
  /**
   * Path to the directory containing run scripts, relative to the project root.
   * @default 'server/run'
   */
  runDir?: string
  /**
   * Glob pattern for finding run script entry files, relative to `runDir`.
   * @default '**\/index.{ts,js,mjs}'
   */
  runPattern?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    compatibility,
    configKey,
  },
  defaults: {
    runDir: 'server/run',
    runPattern: '**/index.{ts,js,mjs}',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const runDirOption = options.runDir ?? 'server/run'
    const runDir = resolve(nuxt.options.rootDir, runDirOption)

    const rollupPlugin = createRunRollupPlugin({
      runDir,
      runPattern: options.runPattern,
      rootDir: nuxt.options.rootDir,
    })

    nuxt.hook('nitro:config', (nitroConfig: NitroConfig) => {
      applyNitroRunConfig(nitroConfig, {
        plugin: rollupPlugin,
        runDirOption,
      })
    })

    // rollup:before runs after Nitro installs its own manualChunks — wrap it there.
    nuxt.hook('nitro:init', (nitro: Nitro) => {
      nitro.hooks.hook('rollup:before', (_nitro, rollupConfig) => {
        isolateServerEntryChunks(rollupConfig)
      })
    })
  },
})
