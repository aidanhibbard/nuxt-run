import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'es-errors',
    'es-errors/type',
    'rollup',
    'nitropack',
    'fast-glob',
    'consola',
    '@nuxt/kit',
  ],
})
