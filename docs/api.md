# API

`nuxt-run` is configured through the `run` key in `nuxt.config.ts`.

```ts
export interface ModuleOptions {
  /**
   * Path to the directory containing run scripts, relative to the project root.
   * @default 'server/run'
   */
  runDir?: string
  /**
   * Glob pattern for finding run script entry files, relative to `runDir`.
   * @default '**/index.{ts,js,mjs}'
   */
  runPattern?: string
}
```

## Options

### `runDir`

- Type: `string`
- Default: `'server/run'`

Directory containing your run scripts, relative to the project root. Each
immediate subdirectory containing an `index.{ts,js,mjs}` file is treated as a
run script named after that subdirectory.

### `runPattern`

- Type: `string`
- Default: `'**/index.{ts,js,mjs}'`

Glob pattern (relative to `runDir`) used to discover run script entry files.

## Example

```ts
export default defineNuxtConfig({
  modules: ['nuxt-run'],
  run: {
    runDir: 'server/run',
    runPattern: '**/index.{ts,js,mjs}',
  },
})
```

## Output

There is no `outputDir` option. Scripts are emitted into Nitro's output via
`emitFile`:

- Production: `.output/server/run/<name>/index.mjs`
- Dev: `.nuxt/dev/run/<name>/index.mjs`

The emitted file **is** your script (bundled). There is no generated wrapper,
no `createRunApp`, and no process lifecycle handling. If you want signal
handlers, exit codes, or retries, put that in the script yourself (or wrap the
`node …/index.mjs` invocation in your own process manager).

The module forces `inlineDynamicImports: false` so Nitro's dev preset does not
merge script chunks into the server entry (which would execute top-level side
effects on startup). It also adds the configured `runDir` to `nitro.ignore` so
scripts are never scanned as Nitro routes/handlers.

## Errors

- **Duplicate run script names** — the Nitro build fails with a
  `DuplicateRunNameError` listing each conflicting name and its source files.

## What is intentionally not included

- No `defineRun` helper or other runtime DX.
- No CLI.
- No generated entry wrapper / shutdown / error handling.
- No separate `.output` config — output is decided entirely by Nitro's emit
  pipeline.
- No runtime registry or aliases.
