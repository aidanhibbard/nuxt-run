import { describe, it, expect } from 'vitest'
import { logger } from '../../src/utils/logger'

describe('logger', () => {
  it('exposes a consola logger tagged nuxt-run', () => {
    expect(logger).toBeTypeOf('object')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.success).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
  })
})
