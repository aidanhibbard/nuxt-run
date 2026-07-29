import { defaultExclude, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts', 'spec/**/*.spec.ts'],
    globals: true,
    coverage: {
      exclude: [
        'playground',
        ...defaultExclude,
        '.nuxt',
        'dist',
        'node_modules',
        'bin',
        'coverage',
        'docs',
        'nuxt.config.ts',
        'src/module.ts',
      ],
    },
  },
})
