import { logger } from './logger'
import { buildRunScript } from './build-run-script'
import type { RunScript } from './scan-run-scripts'

export interface BuildAllRunScriptsOptions {
  scripts: RunScript[]
  outputBase: string
}

export async function buildAllRunScripts({
  scripts,
  outputBase,
}: BuildAllRunScriptsOptions): Promise<void> {
  if (scripts.length === 0) {
    logger.info('No run scripts to build')
    return
  }

  logger.info(`Building ${scripts.length} run script(s)`)

  let successCount = 0
  const failedScripts: string[] = []

  for (const script of scripts) {
    try {
      await buildRunScript({ script, outputBase })
      successCount++
    }
    catch (error) {
      logger.error(`Failed to build run script: ${script.name}`, error)
      failedScripts.push(script.name)
    }
  }

  if (failedScripts.length > 0) {
    logger.warn(
      `Built ${successCount}/${scripts.length} scripts. Failed: ${failedScripts.join(', ')}`,
    )
  }
  else {
    logger.success(`All ${scripts.length} run script(s) built successfully`)
  }
}
