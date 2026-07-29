import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

/**
 * Build-output regressions. These catch the "import useRuntimeConfig → second
 * HTTP server" failure mode and confirm scripts still emit 1:1.
 *
 * Requires a prior `npm run dev:build` (CI runs prepare + build before this).
 */
const playgroundRoot = resolve(import.meta.dirname, '../../playground')
const outputServer = resolve(playgroundRoot, '.output/server')

describe('playground build output', () => {
  it('emits one index.mjs per run script (no wrapper files)', () => {
    for (const name of ['hello', 'greet', 'probe']) {
      const indexPath = resolve(outputServer, 'run', name, 'index.mjs')
      expect(existsSync(indexPath), `missing ${indexPath}`).toBe(true)
      expect(existsSync(resolve(outputServer, 'run', name, '_entry.mjs'))).toBe(false)
    }
  })

  it('keeps server.listen in the main server entry, not the shared nitro chunk', () => {
    const index = readFileSync(resolve(outputServer, 'index.mjs'), 'utf8')
    const nitro = readFileSync(resolve(outputServer, 'chunks/nitro/nitro.mjs'), 'utf8')

    expect(index).toMatch(/server\.listen\(/)
    expect(nitro).not.toMatch(/server\.listen\(/)
    expect(nitro).toMatch(/function useRuntimeConfig|useRuntimeConfig/)
  })

  it('bundles probe against the shared nitro chunk (runtime config import works)', () => {
    const probe = readFileSync(resolve(outputServer, 'run/probe/index.mjs'), 'utf8')
    expect(probe).toMatch(/chunks\/nitro\/nitro\.mjs/)
    expect(probe).toMatch(/useRuntimeConfig/)
  })

  it('runs hello without starting an HTTP server', () => {
    const stdout = execFileSync(
      process.execPath,
      [resolve(outputServer, 'run/hello/index.mjs')],
      { encoding: 'utf8', timeout: 5000 },
    )
    expect(stdout).toContain('Hello, World!')
    expect(stdout).not.toContain('Listening on')
  })

  it('runs probe with runtime config and does not listen', () => {
    const stdout = execFileSync(
      process.execPath,
      [resolve(outputServer, 'run/probe/index.mjs')],
      {
        encoding: 'utf8',
        timeout: 5000,
        env: {
          ...process.env,
          NUXT_API_SECRET: 'ci-secret',
          NUXT_PUBLIC_APP_NAME: 'ci-app',
        },
      },
    )

    expect(stdout).not.toContain('Listening on')
    const jsonStart = stdout.indexOf('{')
    expect(jsonStart).toBeGreaterThanOrEqual(0)
    const payload = JSON.parse(stdout.slice(jsonStart)) as {
      explicitImport: { ok: boolean, apiSecret: string, publicAppName: string }
      autoImport: { ok: boolean, apiSecret: string }
      sharedUtil: { ok: boolean }
    }

    expect(payload.explicitImport.ok).toBe(true)
    expect(payload.explicitImport.apiSecret).toBe('ci-secret')
    expect(payload.explicitImport.publicAppName).toBe('ci-app')
    expect(payload.autoImport.ok).toBe(true)
    expect(payload.autoImport.apiSecret).toBe('ci-secret')
    expect(payload.sharedUtil.ok).toBe(true)
  })
})
