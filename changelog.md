# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.1.0

### Added

- GitHub Actions publish workflow for `v*` tags via npm Trusted Publishing
  (`publishConfig.access` / `provenance`).
- Docs deploy on release tags only (no longer on every `main` push).
- CI `dev:prepare` step before unit coverage so `.nuxt/tsconfig.json` exists.

### Changed

- `npm run release` bumps, commits, tags, and pushes. CI publishes to npm.
- README and docs: install with `npm install -D nuxt-run`, seed example using
  `useRuntimeConfig`, module options (`runDir`, `runPattern`), Minds sponsor.

## 1.0.0

### Added

- Bundle `server/run/**/index.{ts,js,mjs}` into standalone `.mjs` entries during
  the Nuxt/Nitro build via `nitro:config` + Rollup `emitFile`.
- Duplicate run-script name validation that fails the Nitro build.
- `addWatchFile` for run scripts so changes are picked up in dev.
- `nitro.ignore` for the configured `runDir` so scripts are never scanned as
  Nitro routes/handlers.
- Isolate Nitro's listen-bearing server entry (`node-server` / `nitro-dev`)
  from the shared `nitro` runtime chunk so scripts can import
  `useRuntimeConfig` without starting a second HTTP server.
- Force `inlineDynamicImports: false` so Nitro's dev preset does not merge
  script chunks into the server entry.
- Unit tests with 100% coverage thresholds on `src/utils`, plus playground
  smoke tests that assert scripts run and do not call `server.listen`.
- CI jobs for lint, coverage, and build+smoke.
- VitePress documentation site under `docs/`.
- Module options `runDir` (default `server/run`) and `runPattern`
  (default `**/index.{ts,js,mjs}`).
- `configKey` (`run`) and `compatibility` fields in `package.json`.

### Notes

- Output paths: `.output/server/run/<name>/index.mjs` (production),
  `.nuxt/dev/run/<name>/index.mjs` (dev). No `outputDir` option.
- Script name is the directory immediately containing the `index` file.
- The emitted file is the bundled script. No generated wrapper or CLI.
