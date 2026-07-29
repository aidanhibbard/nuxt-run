import type { NitroConfig } from 'nitropack'
import type { Plugin } from 'rollup'

export interface ApplyNitroRunConfigOptions {
  plugin: Plugin
  /** Module `runDir` option, relative to project root (e.g. `server/run`). */
  runDirOption: string
}

/**
 * Mutates Nitro config so run scripts:
 * - are emitted as separate chunks (not inlined into the server entry)
 * - are ignored by Nitro's server directory scan when under `server/`
 * - are built by our Rollup plugin inside Nitro's pipeline
 */
export function applyNitroRunConfig(
  nitroConfig: NitroConfig,
  { plugin, runDirOption }: ApplyNitroRunConfigOptions,
): void {
  // nitro-dev defaults to inlineDynamicImports: true, which merges emitFile
  // chunks into the server entry and runs top-level script side effects on
  // startup. Keep chunks separate so scripts only run when executed directly.
  nitroConfig.inlineDynamicImports = false

  // Keep run scripts out of Nitro's server directory scan (routes/api/plugins/…).
  // Patterns are relative to the server directory.
  const serverRelative = runDirOption.replace(/^[\\/]?server[\\/]/, '')
  if (serverRelative && serverRelative !== runDirOption) {
    nitroConfig.ignore = nitroConfig.ignore ?? []
    nitroConfig.ignore.push(`${serverRelative}/**`)
  }

  nitroConfig.rollupConfig = nitroConfig.rollupConfig ?? {}
  const current = nitroConfig.rollupConfig.plugins
  if (Array.isArray(current)) {
    nitroConfig.rollupConfig.plugins = [...current, plugin]
  }
  else if (current) {
    nitroConfig.rollupConfig.plugins = [current, plugin]
  }
  else {
    nitroConfig.rollupConfig.plugins = [plugin]
  }
}
