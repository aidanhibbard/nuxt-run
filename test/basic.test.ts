import { describe, it, expect } from 'vitest'
import { scanRunScripts } from '../src/utils/scan-run-scripts'
import { resolve } from 'node:path'

describe('scanRunScripts', () => {
  it('scans for run scripts in the specified directory', async () => {
    const playgroundRoot = resolve(__dirname, '..', 'playground')
    const runDir = resolve(playgroundRoot, 'server/run')

    const scripts = await scanRunScripts({
      runDir,
      pattern: '**/index.{ts,js,mjs}',
    })

    expect(scripts).toHaveLength(2)
    expect(scripts.map(s => s.name)).toContain('hello')
    expect(scripts.map(s => s.name)).toContain('greet')
  })

  it('extracts script names from directory structure', async () => {
    const playgroundRoot = resolve(__dirname, '..', 'playground')
    const runDir = resolve(playgroundRoot, 'server/run')

    const scripts = await scanRunScripts({
      runDir,
      pattern: '**/index.{ts,js,mjs}',
    })

    const helloScript = scripts.find(s => s.name === 'hello')
    expect(helloScript).toBeDefined()
    expect(helloScript!.srcPath).toContain('hello')
    expect(helloScript!.srcPath).toMatch(/index\.(ts|js|mjs)$/)
  })
})
