# Getting Started

`nuxt-run` bundles standalone run scripts under `server/run/` into self-contained
`.mjs` entries during the Nuxt/Nitro build. Each script becomes its own
executable file you can run independently after `nuxt build`.

This is the simpler sibling of
[nuxt-processor](https://github.com/aidanhibbard/nuxt-processor), which collapses
many workers into a single entry. `nuxt-run` is **1:1**: one script directory →
one standalone `.mjs`.

## Install

```bash
npx nuxt module add nuxt-run
```

## Add a run script

Place an `index.{ts,js,mjs}` file inside a named directory under `server/run/`:

```
server/
  run/
    hello/
      index.ts
    greet/
      index.ts
```

The directory name is the script name.

```ts
// server/run/hello/index.ts
import { greet } from './utils'

console.log(greet('World'))
```

```ts
// server/run/hello/utils.ts
export function greet(name: string): string {
  return `Hello, ${name}!`
}
```

## Build and run

```bash
nuxt build
```

After the build, each script is emitted into Nitro's output:

```
.output/server/run/
  hello/
    index.mjs
  greet/
    index.mjs
```

The emitted file **is** your script (bundled by Nitro). Run it directly:

```bash
node .output/server/run/hello/index.mjs
# -> Hello, World!

node .output/server/run/greet/index.mjs
# -> Greet script running
```

## How it works

The module hooks into Nitro via the `nitro:config` hook and injects a Rollup
plugin. On `buildStart` it scans `server/run/**/index.{ts,js,mjs}`, validates
that names are unique, and emits each script as a chunk at
`run/<name>/index.mjs` via `emitFile`. Imports are bundled by the same Rollup
that builds the rest of your Nitro server, so TypeScript transformation and npm
externals are handled for you.

There is no `defineRun`, no CLI, no generated wrapper, and no process lifecycle
handling. If you need signal handlers or custom exit behaviour, put that in the
script (or wrap the `node` invocation yourself).

## Dev mode

During `nuxt dev` (not `dev:prepare` — that only generates types), the same
Rollup plugin runs against Nitro's dev build and emits scripts under
`.nuxt/dev/run/<name>/index.mjs`. Source files are registered with
`addWatchFile` so changes rebuild. Scripts do **not** run when the Nuxt dev
server starts — only when you execute them:

```bash
node .nuxt/dev/run/hello/index.mjs
# -> Hello, World!
```

## Naming

The script name is the directory immediately containing the `index` file:

| Source path | Name |
| --- | --- |
| `server/run/hello/index.ts` | `hello` |
| `server/run/foo/bar/index.ts` | `bar` |

Duplicate names fail the Nitro build with a clear error listing the conflicting
sources.

## Configuration

Configure via the `run` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-run'],
  run: {
    // Directory containing run scripts, relative to the project root.
    runDir: 'server/run',
    // Glob pattern relative to runDir used to find entry files.
    runPattern: '**/index.{ts,js,mjs}',
  },
})
```

See the [API reference](./api) for option details.
