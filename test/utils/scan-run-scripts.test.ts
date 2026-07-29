import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { scanRunScripts } from '../../src/utils/scan-run-scripts'

describe('scanRunScripts', () => {
  let runDir: string

  beforeEach(() => {
    runDir = join(tmpdir(), `nuxt-run-scan-${Date.now()}-${Math.random().toString(16).slice(2)}`)
    mkdirSync(runDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(runDir, { recursive: true, force: true })
  })

  it('returns an empty array and warns when no scripts exist', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const scripts = await scanRunScripts({ runDir })
    expect(scripts).toEqual([])
    warn.mockRestore()
  })

  it('discovers index.ts/js/mjs entries and names them after their parent dir', async () => {
    mkdirSync(join(runDir, 'hello'), { recursive: true })
    mkdirSync(join(runDir, 'greet'), { recursive: true })
    writeFileSync(join(runDir, 'hello', 'index.ts'), 'console.log("hello")')
    writeFileSync(join(runDir, 'greet', 'index.js'), 'console.log("greet")')
    writeFileSync(join(runDir, 'hello', 'utils.ts'), 'export const x = 1')

    const scripts = await scanRunScripts({ runDir })

    expect(scripts.map(s => s.name).sort()).toEqual(['greet', 'hello'])
    expect(scripts.find(s => s.name === 'hello')!.srcPath).toMatch(/hello[/\\]index\.ts$/)
    expect(scripts.find(s => s.name === 'greet')!.srcPath).toMatch(/greet[/\\]index\.js$/)
  })

  it('uses the immediate parent directory for nested scripts', async () => {
    mkdirSync(join(runDir, 'foo', 'bar'), { recursive: true })
    writeFileSync(join(runDir, 'foo', 'bar', 'index.ts'), 'console.log("nested")')

    const scripts = await scanRunScripts({ runDir })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]!.name).toBe('bar')
  })

  it('respects a custom pattern', async () => {
    mkdirSync(join(runDir, 'only-mjs'), { recursive: true })
    writeFileSync(join(runDir, 'only-mjs', 'index.mjs'), 'console.log(1)')
    mkdirSync(join(runDir, 'only-ts'), { recursive: true })
    writeFileSync(join(runDir, 'only-ts', 'index.ts'), 'console.log(1)')

    const scripts = await scanRunScripts({
      runDir,
      pattern: '**/index.mjs',
    })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]!.name).toBe('only-mjs')
  })

  it('names a root-level index file after the file segment', async () => {
    writeFileSync(join(runDir, 'index.ts'), 'console.log("root")')

    const scripts = await scanRunScripts({ runDir })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]!.name).toBe('index.ts')
  })
})
