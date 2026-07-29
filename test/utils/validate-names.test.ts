import { describe, it, expect } from 'vitest'
import {
  assertNoDuplicateRunNames,
  DuplicateRunNameError,
} from '../../src/utils/validate-names'
import type { RunScript } from '../../src/utils/scan-run-scripts'

describe('assertNoDuplicateRunNames', () => {
  it('allows unique names', () => {
    const scripts: RunScript[] = [
      { name: 'hello', srcPath: '/app/server/run/hello/index.ts' },
      { name: 'greet', srcPath: '/app/server/run/greet/index.ts' },
    ]
    expect(() => assertNoDuplicateRunNames(scripts)).not.toThrow()
  })

  it('throws DuplicateRunNameError with conflicting sources', () => {
    const scripts: RunScript[] = [
      { name: 'hello', srcPath: '/app/server/run/hello/index.ts' },
      { name: 'hello', srcPath: '/app/server/run/other/hello/index.ts' },
    ]

    expect(() => assertNoDuplicateRunNames(scripts)).toThrow(DuplicateRunNameError)
    try {
      assertNoDuplicateRunNames(scripts)
    }
    catch (error) {
      expect(error).toBeInstanceOf(DuplicateRunNameError)
      const err = error as DuplicateRunNameError
      expect(err.name).toBe('DuplicateRunNameError')
      expect(err.message).toContain('Duplicate run script names found')
      expect(err.message).toContain('hello')
      expect(err.duplicates).toEqual([
        {
          name: 'hello',
          sources: [
            '/app/server/run/hello/index.ts',
            '/app/server/run/other/hello/index.ts',
          ],
        },
      ])
    }
  })

  it('relativizes sources when rootDir is provided', () => {
    const scripts: RunScript[] = [
      { name: 'hello', srcPath: '/app/server/run/a/index.ts' },
      { name: 'hello', srcPath: '/app/server/run/b/index.ts' },
    ]

    try {
      assertNoDuplicateRunNames(scripts, '/app')
      expect.unreachable('should throw')
    }
    catch (error) {
      const err = error as DuplicateRunNameError
      expect(err.duplicates[0]!.sources).toEqual([
        'server/run/a/index.ts',
        'server/run/b/index.ts',
      ])
    }
  })
})
