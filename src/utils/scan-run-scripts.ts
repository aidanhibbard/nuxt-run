import fg from 'fast-glob'
import { relative, sep } from 'node:path'
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
    const rel = relative(runDir, file)
    const segments = rel.split(sep)
    // The script name is the directory immediately containing the index file.
    // e.g. server/run/hello/index.ts -> "hello"
    //      server/run/foo/bar/index.ts -> "bar"
    const name = segments.length >= 2 ? segments[segments.length - 2] : segments[0]

    if (name) {
      scripts.push({ name, srcPath: file })
    }
  }

  if (scripts.length === 0) {
    logger.warn(`No run scripts found in ${runDir}`)
  }

  return scripts
}
