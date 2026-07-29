# nuxt-run

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Sponsored by

<p align="center">
  <a href="https://getminds.ai/" target="_blank" rel="noreferrer">
    <img src="https://getminds.ai/images/logo.png" alt="Minds" height="72" />
  </a>
</p>

<p align="center">
  <a href="https://getminds.ai/">Minds</a>
</p>

---

Runnable scripts in any environment.

Useful when you need to:

- Run service code against an environment without pulling secrets down
- Avoid HTTP endpoints just to trigger server code
- Skip a queue when a one-shot or cron script is enough
  - Looking for Queues? Checkout [nuxt-processor](https://github.com/aidanhibbard/nuxt-processor)

## Getting started

```bash
npm install -D nuxt-run
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-run'],
  // Optional config
  run: {
    runDir: 'server/run',
    runPattern: '**/index.{ts,js,mjs}',
  },
})
```

Add a script under `server/run/<name>/index.ts`:

```ts
// server/run/seed/index.ts
const {
  database: {
    url,
  },
} = useRuntimeConfig()

const orm = new MyOrm(url)

const seed = async () => {
  await orm.insert(...)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

In dev:

```bash
nuxt dev
node .nuxt/dev/run/seed/index.mjs
```

Post build:

```bash
nuxt build
node .output/server/run/seed/index.mjs
```

Scripts share Nitro's module graph, so `useRuntimeConfig()` and `server/utils` work.

More detail: [Getting started](./docs/getting-started.md).

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
