---
type: wiki
updated: 2026-05-02
---

# Implicit Contracts

> Unwritten rules discovered during development. Each entry explains what breaks if violated.

## Contracts

- `packages/corgispec/scripts/bundle-assets.js` is both a publish-time bundler and a test-time helper. Tests that exercise it must direct output to an isolated assets directory instead of mutating the package's shared `assets/` tree, otherwise concurrent validation tests can observe missing bundled schemas mid-run.
