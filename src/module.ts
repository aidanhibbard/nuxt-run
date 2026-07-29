import { defineNuxtModule, createResolver } from '@nuxt/kit'
import { name, version, configKey, compatibility } from '../package.json'
import type { NitroConfig } from 'nitropack'
import type { Plugin } from 'rollup'
import { scanRunScripts } from './utils/scan-run-scripts'
import { assertNoDuplicateRunNames, DuplicateRunNameError } from './utils/validate-names'
import { logger } from './utils/logger'

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

    const runDir = resolve(nuxt.options.rootDir, options.runDir ?? 'server/run')

    const rollupPlugin: Plugin = {
      name: 'nuxt-run-build',
      async buildStart() {
        const scripts = await scanRunScripts({
          runDir,
          pattern: options.runPattern,
        })

        if (scripts.length === 0) {
          logger.info('No run scripts found')
          return
        }

        try {
          assertNoDuplicateRunNames(scripts, nuxt.options.rootDir)
        }
        catch (error) {
          if (error instanceof DuplicateRunNameError) {
            this.error(error.message)
            return
          }
          throw error
        }

        for (const script of scripts) {
          this.addWatchFile(script.srcPath)
          // Emit the script itself as the entry — no wrapper, no lifecycle opinions.
          this.emitFile({
            type: 'chunk',
            id: script.srcPath,
            fileName: `run/${script.name}/index.mjs`,
          })
        }

        logger.success(`Registered ${scripts.length} run script(s): ${scripts.map(s => s.name).join(', ')}`)
      },
    }

    nuxt.hook('nitro:config', (nitroConfig: NitroConfig) => {
      // nitro-dev defaults to inlineDynamicImports: true, which merges emitFile
      // chunks into the server entry and runs top-level script side effects on
      // startup. Keep chunks separate so scripts only run when executed directly.
      nitroConfig.inlineDynamicImports = false

      // Keep run scripts out of Nitro's server directory scan (routes/api/plugins/…).
      // Patterns are relative to the server directory.
      const runDirOption = options.runDir ?? 'server/run'
      const serverRelative = runDirOption.replace(/^[\\/]?server[\\/]/, '')
      if (serverRelative && serverRelative !== runDirOption) {
        nitroConfig.ignore = nitroConfig.ignore ?? []
        nitroConfig.ignore.push(`${serverRelative}/**`)
      }

      nitroConfig.rollupConfig = nitroConfig.rollupConfig ?? {}
      const current = nitroConfig.rollupConfig.plugins
      if (Array.isArray(current)) {
        nitroConfig.rollupConfig.plugins = [...current, rollupPlugin]
      }
      else if (current) {
        nitroConfig.rollupConfig.plugins = [current, rollupPlugin]
      }
      else {
        nitroConfig.rollupConfig.plugins = [rollupPlugin]
      }
    })
  },
})
