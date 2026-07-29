/**
 * Probe whether run scripts can reach Nitro/Nuxt server surfaces:
 * - auto-imported useRuntimeConfig (#imports / nitro)
 * - explicit nitropack/runtime import
 * - shared server utils
 * - build-time runtimeConfig values + NUXT_* env overrides
 */
import { useRuntimeConfig as useRuntimeConfigExplicit } from 'nitropack/runtime'
import { formatProbeLabel } from '../../utils/probe'

async function main() {
  const results: Record<string, unknown> = {}

  // 1) Explicit nitropack/runtime import
  try {
    const config = useRuntimeConfigExplicit()
    results.explicitImport = {
      ok: true,
      apiSecret: config.apiSecret,
      publicAppName: config.public?.appName,
      redisHost: (config as { redis?: { host?: string } }).redis?.host,
    }
  }
  catch (error) {
    results.explicitImport = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // 2) Auto-imported useRuntimeConfig (Nitro #imports) — available as a free global in server context
  try {
    const config = useRuntimeConfig()
    results.autoImport = {
      ok: true,
      apiSecret: config.apiSecret,
      publicAppName: config.public?.appName,
    }
  }
  catch (error) {
    results.autoImport = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // 3) Shared server util
  try {
    results.sharedUtil = {
      ok: true,
      label: formatProbeLabel('shared-util'),
    }
  }
  catch (error) {
    results.sharedUtil = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // 4) Env override visibility (NUXT_API_SECRET / NUXT_PUBLIC_APP_NAME)
  results.env = {
    NUXT_API_SECRET: process.env.NUXT_API_SECRET ?? null,
    NUXT_PUBLIC_APP_NAME: process.env.NUXT_PUBLIC_APP_NAME ?? null,
  }

  console.log(JSON.stringify(results, null, 2))
}

main().catch((error) => {
  console.error('probe failed', error)
  process.exit(1)
})
