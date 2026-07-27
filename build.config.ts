import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'es-errors',
    'es-errors/type',
    'rollup',
    'nitropack',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-commonjs',
    'fast-glob',
    'consola',
    'defu',
    '@nuxt/kit',
  ],
})
