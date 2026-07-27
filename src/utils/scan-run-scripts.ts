import fg from 'fast-glob'
import { logger } from './logger'

export interface ScanRunScriptsOptions {
  runDir: string
  pattern?: string
}

export interface RunScript {
  name: string
  srcPath: string
}

export async function scanRunScripts({
  runDir,
  pattern = '**/index.{ts,js,mjs}',
}: ScanRunScriptsOptions): Promise<RunScript[]> {
  const files = await fg(pattern, {
    cwd: runDir,
    absolute: true,
    onlyFiles: true,
  })

  const scripts: RunScript[] = []

  for (const file of files) {
    // Extract the script name from the directory structure
    // e.g., server/run/hello/index.ts -> hello
    const relative = file.replace(runDir + '/', '')
    const parts = relative.split('/')
    const name = parts[0]

    if (name && !scripts.some(s => s.name === name)) {
      scripts.push({ name, srcPath: file })
    }
  }

  if (scripts.length === 0) {
    logger.warn(`No run scripts found in ${runDir}`)
  }

  return scripts
}
