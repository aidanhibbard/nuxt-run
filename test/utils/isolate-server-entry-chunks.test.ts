import { describe, it, expect, vi } from 'vitest'
import {
  isolateServerEntryChunks,
  isServerEntryModuleId,
} from '../../src/utils/isolate-server-entry-chunks'

describe('isServerEntryModuleId', () => {
  it('matches node-server, node-cluster, and nitro-dev preset entries', () => {
    expect(isServerEntryModuleId('/x/presets/node/runtime/node-server.mjs')).toBe(true)
    expect(isServerEntryModuleId('/x/presets/node/runtime/node-cluster.mjs')).toBe(true)
    expect(isServerEntryModuleId('/x/presets/_nitro/runtime/nitro-dev.mjs')).toBe(true)
  })

  it('does not match shared nitro runtime modules', () => {
    expect(isServerEntryModuleId('/x/nitropack/dist/runtime/internal/config.mjs')).toBe(false)
    expect(isServerEntryModuleId('/x/presets/node/runtime/node-listener.mjs')).toBe(false)
  })
})

describe('isolateServerEntryChunks', () => {
  it('no-ops when output is missing', () => {
    const config = {}
    isolateServerEntryChunks(config)
    expect(config).toEqual({})
  })

  it('wraps manualChunks to isolate listen-bearing entries', () => {
    const prev = vi.fn(() => 'nitro')
    const rollupConfig = {
      output: {
        manualChunks: prev,
      },
    }

    isolateServerEntryChunks(rollupConfig)
    const fn = rollupConfig.output.manualChunks as (id: string, meta: unknown) => string | undefined

    expect(fn('/repo/node_modules/nitropack/dist/presets/node/runtime/node-server.mjs', {})).toBe(
      'nitro/server-entry',
    )
    expect(fn('/repo/node_modules/nitropack/dist/presets/_nitro/runtime/nitro-dev.mjs', {})).toBe(
      'nitro/server-entry',
    )
    expect(fn('/repo/node_modules/nitropack/dist/runtime/internal/config.mjs', {})).toBe('nitro')
    expect(prev).toHaveBeenCalledWith(
      '/repo/node_modules/nitropack/dist/runtime/internal/config.mjs',
      {},
    )
  })

  it('works when there was no previous manualChunks', () => {
    const rollupConfig = { output: {} as { manualChunks?: unknown } }
    isolateServerEntryChunks(rollupConfig)
    const fn = rollupConfig.output.manualChunks as (id: string, meta: unknown) => string | undefined

    expect(fn('/x/presets/node/runtime/node-server.ts', {})).toBe('nitro/server-entry')
    expect(fn('/x/runtime/internal/config.mjs', {})).toBeUndefined()
  })
})
