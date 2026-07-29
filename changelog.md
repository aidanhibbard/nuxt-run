# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Reworked the build pipeline to emit run scripts through Nitro's own Rollup
  pipeline (via the `nitro:config` hook and `emitFile`) instead of spinning up a
  separate Rollup instance per script. Each script is emitted as
  `run/<name>/index.mjs` — the bundled script itself, with no generated wrapper.
- Removed the `outputDir` module option. Output is now decided by Nitro's
  emit pipeline (`.output/server/run/<name>/index.mjs` in production,
  `.nuxt/dev/run/<name>/index.mjs` in dev).
- Script names are now derived from the directory immediately containing the
  `index` file, so nested scripts (`server/run/foo/bar/index.ts`) get the name
  `bar` instead of colliding with `foo`.
- Force `inlineDynamicImports: false` so Nitro's dev preset does not merge
  script chunks into the server entry (which would run top-level side effects
  on startup).

### Added

- Duplicate run-script name validation that fails the Nitro build.
- `addWatchFile` for run scripts so changes are picked up in dev.
- `nitro.ignore` for the configured `runDir` so scripts are never scanned as
  Nitro routes/handlers.
- VitePress documentation site under `docs/`.
- `configKey` (`run`) and `compatibility` fields to `package.json`.

### Removed

- Separate-Rollup-instance build helpers (`build-run-script`, `build-all-run-scripts`).
- Generated `createRunApp` / `index.mjs` wrappers — the emitted entry is the
  script; wrap it yourself if you need lifecycle handling.
- Unused runtime directory and dependencies (`rollup`, `defu`, `@rollup/plugin-*`).

## 1.0.0

- Initial release: bundle `server/run/**/index.{ts,js,mjs}` into standalone `.mjs` files during the Nuxt/Nitro build.
