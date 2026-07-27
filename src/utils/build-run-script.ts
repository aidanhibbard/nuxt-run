import { resolve } from 'node:path'
import { rollup, type InputOptions, type OutputOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { logger } from './logger'

export interface BuildRunScriptOptions {
  script: {
    name: string
    srcPath: string
  }
  outputBase: string
}

export async function buildRunScript({
  script,
  outputBase,
}: BuildRunScriptOptions): Promise<void> {
  const outputDir = resolve(outputBase, script.name)
  const outputPath = resolve(outputDir, 'index.mjs')

  logger.info(`Building run script: ${script.name}`)

  const inputOptions: InputOptions = {
    input: script.srcPath,
    external: [
      /^node:/,
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      commonjs(),
    ],
    treeshake: true,
  }

  const outputOptions: OutputOptions = {
    dir: outputDir,
    format: 'esm',
    entryFileNames: 'index.mjs',
    sourcemap: false,
  }

  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)
  await bundle.close()

  logger.success(`Built run script: ${script.name} -> ${outputPath}`)
}
