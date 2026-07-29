# Contributing to nuxt-run

Thank you for your interest in contributing! By participating, you agree to
abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

- **Bug reports** — open an issue with reproduction steps and your Nuxt version.
- **Feature requests** — open an issue describing the use case before large PRs.
- **Documentation** — fixes and clarifications in `README.md`, `docs/`, and `changelog.md`.
- **Code** — bug fixes, tests, and features via pull request.

## Development setup

Requirements: **Node.js** (see `.nvmrc`) and **npm**.

```bash
git clone https://github.com/aidanhibbard/nuxt-run.git
cd nuxt-run
npm install
npm run dev:prepare
```

### Playground

```bash
# Nuxt app + hot reload
npm run dev

# Production build of the playground
npm run dev:build

# Run a built script directly
node playground/.output/server/run/hello/index.mjs
node playground/.output/server/run/greet/index.mjs
```

### Quality checks

Run these before opening a PR:

```bash
npm run lint
npm run test
npm run test:types
```

### Docs site

```bash
npm run vp:dev
npm run vp:build
```

## Pull request process

1. Fork the repo and create a branch from `main`.
2. Make focused changes; avoid unrelated drive-by edits.
3. Add or update tests in `test/` when changing behaviour.
4. Update `docs/` or `README.md` when behaviour or public API changes.
5. Ensure lint and tests pass.
6. Open a PR against `main`.

Breaking changes should be called out in the PR description and documented in
`changelog.md` under an `## Unreleased` or upcoming version section.

## Project layout

| Path | Description |
| --- | --- |
| `src/module.ts` | Nuxt module entry — hooks Nitro Rollup |
| `src/utils/` | Build-time helpers (scan, validate names, logger) |
| `playground/` | Development app with sample run scripts |
| `docs/` | VitePress documentation |
| `test/` | Vitest unit tests |

## Commit messages

Use clear, imperative subject lines (e.g. `fix: resolve script name from nested dirs`).
Conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`) are welcome but not required.

## Releases

Maintainers handle releases. **Contributors do not need to publish to npm.**

- Stable: version bump + `npm publish` (see maintainer docs).
- Beta: `npm publish --tag beta` — install with `nuxt-run@beta`.

## Questions

Open a [GitHub Discussion](https://github.com/aidanhibbard/nuxt-run/discussions)
or issue if Discussions are not enabled. For conduct concerns, see
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
