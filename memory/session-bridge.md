---
type: memory
updated: 2026-05-02
---

# Session Bridge

> AI agent reads this first at startup. Last session's handoff state.

## Active corgi Change
- **Change**: single-entry bootstrap install
- **Phase**: implementation complete, branch preserved
- **Branch**: bootstrap-install

## Done (last session completed)
- Implemented `corgispec bootstrap` orchestration plus report/manifest writing in the `bootstrap-install` worktree.
- Added bundled command and memory-template assets, reusable install/memory helpers, and `.opencode/INSTALL.md`.
- Updated `README.md` and `README.zh-TW.md` to the bootstrap-first onboarding model.
- Verified in `/root/.config/superpowers/worktrees/openspec_gitflow_modified/bootstrap-install/packages/corgispec` with `npm test` -> 11 files, 114 tests passed.

## Waiting (next steps / blockers)
- Branch `bootstrap-install` is preserved without commit/push by user choice.
- If resumed, start in `/root/.config/superpowers/worktrees/openspec_gitflow_modified/bootstrap-install` and decide whether to commit, open a PR, or merge.

## New Pitfalls
- `packages/corgispec/test/install-assets.test.ts` must not rebuild the real `packages/corgispec/assets` directory during the suite; use isolated bundle output to avoid races with `skills.test.ts`.

## New Discoveries
- `corgispec bootstrap` now covers fresh install, managed update, legacy migration, verify-only flow, user-level skill sync, project memory initialization, and machine-readable JSON output.

## Next Session Start
1. Read this file ← you are here
2. Read [[wiki/hot]]
3. Read [[wiki/index]]
4. Then docs/ or specs/ as needed
