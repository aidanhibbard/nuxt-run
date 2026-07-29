# nuxt-run

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module that bundles standalone **run scripts** under `server/run/` into
self-contained `.mjs` entries during the Nuxt/Nitro build. Each script becomes
its own executable file you can run independently after `nuxt build` — one
runnable, one entry.

This is the simpler sibling of [nuxt-processor](https://github.com/aidanhibbard/nuxt-processor),
which collapses many workers into a single entry. `nuxt-run` is 1:1: one script
directory → one standalone `.mjs`.

- [Release Notes](./changelog.md)
- [Documentation](https://aidanhibbard.github.io/nuxt-run/)

## How it works

1. Drop a script at `server/run/<name>/index.{ts,js,mjs}`.
2. Run `nuxt build`.
3. The module hooks into Nitro's own Rollup pipeline (via `nitro:config`) and
   emits each script as a chunk at `.output/server/run/<name>/index.mjs`.
4. Run it directly: `node .output/server/run/<name>/index.mjs`.

No `defineRun`, no CLI, no runtime helpers — just your script, bundled by the
same Rollup that builds the rest of your Nitro server.

## Quick setup

```bash
npx nuxt module add nuxt-run
```

Add a script:

```
server/
  run/
    hello/
      index.ts
```

```ts
// server/run/hello/index.ts
console.log('Hello from nuxt-run')
```

Build and run:

```bash
nuxt build
node .output/server/run/hello/index.mjs
# -> Hello from nuxt-run
```

## Module options

Configure via the `run` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-run'],
  run: {
    // Directory containing run scripts, relative to project root.
    runDir: 'server/run',
    // Glob pattern relative to runDir used to find entry files.
    runPattern: '**/index.{ts,js,mjs}',
  },
})
```

The script name is the directory immediately containing the `index` file, so
`server/run/hello/index.ts` → `hello`. Duplicate names fail the build.

## Output

Scripts are emitted into Nitro's output directory — no separate `.output`
config, and no generated wrapper. The file at
`.output/server/run/<name>/index.mjs` (or `.nuxt/dev/run/<name>/index.mjs` in
dev) **is** your script, bundled. If you need signal handlers or custom exit
behaviour, put that in the script or wrap the `node` invocation yourself.
Imports are bundled by Nitro (TypeScript transformation and npm externals
handled for you).

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  npm install
  npm run dev:prepare   # generate type stubs
  npm run dev            # develop with the playground
  npm run dev:build      # production build of the playground
  npm run lint
  npm run test
  npm run vp:dev         # VitePress docs site
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-run/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-run

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-run.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-run

[license-src]: https://img.shields.io/npm/l/nuxt-run.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-run

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
