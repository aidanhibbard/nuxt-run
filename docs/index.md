---
layout: home

hero:
  name: nuxt-run
  text: Standalone run scripts for Nuxt
  tagline: Bundle server/run/**/index.{ts,js,mjs} into self-contained .mjs entries during the Nuxt/Nitro build. One runnable, one entry.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: API
      link: /api

features:
  - title: 1:1 entries
    details: Each script directory becomes its own standalone .mjs file you can run independently after nuxt build.
  - title: Pure Nitro hooks
    details: Scripts are emitted through Nitro's own Rollup pipeline via the nitro:config hook and emitFile. No separate bundler.
  - title: No DX layer
    details: No defineRun, no CLI, no runtime helpers. Just your script, bundled by the same Rollup that builds the rest of your server.
  - title: TypeScript out of the box
    details: Imports are bundled by Nitro, so TypeScript and npm externals are handled for you.
---
