import type { Plugin } from 'rollup'
import { scanRunScripts } from './scan-run-scripts'
import { assertNoDuplicateRunNames, DuplicateRunNameError } from './validate-names'
import { logger } from './logger'

export interface CreateRunRollupPluginOptions {
  runDir: string
  runPattern?: string
  rootDir?: string
}

export function createRunRollupPlugin(options: CreateRunRollupPluginOptions): Plugin {
  const { runDir, runPattern, rootDir } = options

  return {
    name: 'nuxt-run-build',
    async buildStart() {
      const scripts = await scanRunScripts({
        runDir,
        pattern: runPattern,
      })

      if (scripts.length === 0) {
        logger.info('No run scripts found')
        return
      }

      try {
        assertNoDuplicateRunNames(scripts, rootDir)
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
        this.emitFile({
          type: 'chunk',
          id: script.srcPath,
          fileName: `run/${script.name}/index.mjs`,
        })
      }

      logger.success(`Registered ${scripts.length} run script(s): ${scripts.map(s => s.name).join(', ')}`)
    },
  }
}
