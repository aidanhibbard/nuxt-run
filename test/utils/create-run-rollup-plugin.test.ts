import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createRunRollupPlugin } from '../../src/utils/create-run-rollup-plugin'

describe('createRunRollupPlugin', () => {
  let runDir: string

  beforeEach(() => {
    runDir = join(tmpdir(), `nuxt-run-plugin-${Date.now()}-${Math.random().toString(16).slice(2)}`)
    mkdirSync(runDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(runDir, { recursive: true, force: true })
  })

  function createPluginContext() {
    return {
      error: vi.fn(),
      addWatchFile: vi.fn(),
      emitFile: vi.fn(),
    }
  }

  it('logs and returns when no scripts are found', async () => {
    const plugin = createRunRollupPlugin({ runDir })
    const ctx = createPluginContext()
    await plugin.buildStart!.call(ctx as never)

    expect(ctx.emitFile).not.toHaveBeenCalled()
    expect(ctx.addWatchFile).not.toHaveBeenCalled()
  })

  it('emits a chunk per script and watches sources', async () => {
    mkdirSync(join(runDir, 'hello'), { recursive: true })
    writeFileSync(join(runDir, 'hello', 'index.ts'), 'console.log("hi")')

    const plugin = createRunRollupPlugin({ runDir, rootDir: runDir })
    const ctx = createPluginContext()
    await plugin.buildStart!.call(ctx as never)

    expect(ctx.addWatchFile).toHaveBeenCalledTimes(1)
    expect(ctx.emitFile).toHaveBeenCalledWith({
      type: 'chunk',
      id: expect.stringMatching(/hello[/\\]index\.ts$/),
      fileName: 'run/hello/index.mjs',
    })
  })

  it('reports duplicate names via this.error and does not emit', async () => {
    mkdirSync(join(runDir, 'a', 'hello'), { recursive: true })
    mkdirSync(join(runDir, 'b', 'hello'), { recursive: true })
    writeFileSync(join(runDir, 'a', 'hello', 'index.ts'), 'console.log(1)')
    writeFileSync(join(runDir, 'b', 'hello', 'index.ts'), 'console.log(2)')

    const plugin = createRunRollupPlugin({ runDir, rootDir: runDir })
    const ctx = createPluginContext()
    await plugin.buildStart!.call(ctx as never)

    expect(ctx.error).toHaveBeenCalledOnce()
    expect(String(ctx.error.mock.calls[0]![0])).toContain('Duplicate run script names')
    expect(ctx.emitFile).not.toHaveBeenCalled()
  })

  it('rethrows unexpected errors from duplicate validation', async () => {
    mkdirSync(join(runDir, 'hello'), { recursive: true })
    writeFileSync(join(runDir, 'hello', 'index.ts'), 'console.log(1)')

    const validate = await import('../../src/utils/validate-names')
    const spy = vi.spyOn(validate, 'assertNoDuplicateRunNames').mockImplementation(() => {
      throw new TypeError('unexpected')
    })

    const plugin = createRunRollupPlugin({ runDir, rootDir: runDir })
    const ctx = createPluginContext()
    await expect(plugin.buildStart!.call(ctx as never)).rejects.toBeInstanceOf(TypeError)

    spy.mockRestore()
  })
})
