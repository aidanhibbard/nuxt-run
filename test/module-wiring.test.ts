import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('source invariants', () => {
  it('module wires nitro hooks without embedding listen isolation inline', () => {
    const source = readFileSync(resolve('src/module.ts'), 'utf8')
    expect(source).toContain('createRunRollupPlugin')
    expect(source).toContain('applyNitroRunConfig')
    expect(source).toContain('isolateServerEntryChunks')
    expect(source).toContain('nitro:config')
    expect(source).toContain('nitro:init')
    expect(source).toContain('rollup:before')
  })
})
