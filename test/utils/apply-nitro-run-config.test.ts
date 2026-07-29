import { describe, it, expect } from 'vitest'
import type { Plugin } from 'rollup'
import { applyNitroRunConfig } from '../../src/utils/apply-nitro-run-config'
import type { NitroConfig } from 'nitropack'

const plugin = { name: 'nuxt-run-build' } as Plugin

describe('applyNitroRunConfig', () => {
  it('forces inlineDynamicImports false and injects the plugin when plugins is empty', () => {
    const nitroConfig = {} as NitroConfig
    applyNitroRunConfig(nitroConfig, { plugin, runDirOption: 'server/run' })

    expect(nitroConfig.inlineDynamicImports).toBe(false)
    expect(nitroConfig.ignore).toEqual(['run/**'])
    expect(nitroConfig.rollupConfig?.plugins).toEqual([plugin])
  })

  it('appends the plugin to an existing plugins array', () => {
    const existing = { name: 'existing' } as Plugin
    const nitroConfig = {
      rollupConfig: { plugins: [existing] },
    } as NitroConfig

    applyNitroRunConfig(nitroConfig, { plugin, runDirOption: 'server/run' })
    expect(nitroConfig.rollupConfig?.plugins).toEqual([existing, plugin])
  })

  it('wraps a single existing plugin value into an array', () => {
    const existing = { name: 'existing' } as Plugin
    const nitroConfig = {
      rollupConfig: { plugins: existing },
    } as unknown as NitroConfig

    applyNitroRunConfig(nitroConfig, { plugin, runDirOption: 'server/run' })
    expect(nitroConfig.rollupConfig?.plugins).toEqual([existing, plugin])
  })

  it('does not add nitro.ignore when runDir is outside server/', () => {
    const nitroConfig = {} as NitroConfig
    applyNitroRunConfig(nitroConfig, { plugin, runDirOption: 'scripts/run' })

    expect(nitroConfig.ignore).toBeUndefined()
  })

  it('preserves existing ignore entries', () => {
    const nitroConfig = {
      ignore: ['tmp/**'],
    } as NitroConfig

    applyNitroRunConfig(nitroConfig, { plugin, runDirOption: 'server/jobs' })
    expect(nitroConfig.ignore).toEqual(['tmp/**', 'jobs/**'])
  })
})
