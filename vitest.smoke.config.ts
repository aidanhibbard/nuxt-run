import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/smoke/**/*.test.ts'],
    exclude: defaultExclude,
    globals: true,
    testTimeout: 30_000,
    fileParallelism: false,
  },
})
