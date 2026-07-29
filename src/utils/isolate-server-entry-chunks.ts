import { normalize } from 'node:path'

/**
 * Nitro forces every module under its runtime/presets dirs into one "nitro" chunk
 * via manualChunks. That puts `server.listen()` (node-server / nitro-dev) in the
 * same file as `useRuntimeConfig`. Run scripts that import runtime config then
 * evaluate listen() and start a second HTTP server.
 *
 * Mirror Nitro's own node-cluster workaround: peel the listen-bearing entry
 * modules into an isolated chunk so shared runtime stays safe to import.
 */
export function isolateServerEntryChunks(
  rollupConfig: { output?: { manualChunks?: unknown } },
): void {
  const output = rollupConfig.output
  if (!output) {
    return
  }

  const prev = output.manualChunks
  const prevFn = typeof prev === 'function'
    ? prev as (id: string, meta: unknown) => string | undefined
    : undefined

  output.manualChunks = (id: string, meta: unknown) => {
    const normalized = normalize(id)
    if (
      normalized.includes(`${normalize('/presets/node/runtime/')}node-server`)
      || normalized.includes(`${normalize('/presets/node/runtime/')}node-cluster`)
      || normalized.includes(`${normalize('/presets/_nitro/runtime/')}nitro-dev`)
    ) {
      return 'nitro/server-entry'
    }
    if (prevFn) {
      return prevFn(id, meta)
    }
  }
}

export function isServerEntryModuleId(id: string): boolean {
  const normalized = normalize(id)
  return (
    normalized.includes(`${normalize('/presets/node/runtime/')}node-server`)
    || normalized.includes(`${normalize('/presets/node/runtime/')}node-cluster`)
    || normalized.includes(`${normalize('/presets/_nitro/runtime/')}nitro-dev`)
  )
}
