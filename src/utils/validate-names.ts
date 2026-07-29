import { relative } from 'node:path'
import type { RunScript } from './scan-run-scripts'

export class DuplicateRunNameError extends Error {
  constructor(
    public readonly duplicates: Array<{ name: string, sources: string[] }>,
  ) {
    const details = duplicates
      .map(d => `"${d.name}" in ${d.sources.join(', ')}`)
      .join('; ')
    super(`Duplicate run script names found: ${details}`)
    this.name = 'DuplicateRunNameError'
  }
}

export function assertNoDuplicateRunNames(
  scripts: RunScript[],
  rootDir?: string,
): void {
  const byName = new Map<string, string[]>()

  for (const script of scripts) {
    const source = rootDir ? relative(rootDir, script.srcPath) : script.srcPath
    const sources = byName.get(script.name) ?? []
    sources.push(source)
    byName.set(script.name, sources)
  }

  const duplicates = [...byName.entries()]
    .filter(([, sources]) => sources.length > 1)
    .map(([name, sources]) => ({ name, sources }))

  if (duplicates.length > 0) {
    throw new DuplicateRunNameError(duplicates)
  }
}
