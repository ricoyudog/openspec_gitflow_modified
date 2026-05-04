---
type: memory
updated: 2026-05-02
---

# Pitfalls

> Cross-change pitfall log. Each entry links to its source change. Max 20 active entries.

## Active

- `2026-05-02` — `packages/corgispec/test/install-assets.test.ts` originally ran `node scripts/bundle-assets.js` against the real `packages/corgispec/assets` tree, which caused nondeterministic full-suite failures when `skills.test.ts` resolved `skill-meta.schema.json` during the delete/rebuild window. Keep bundle verification isolated to a temp output path. Source: bootstrap-install branch verification fixes.

## Archive

(No archived pitfalls yet — oldest entries rotate here when Active exceeds 20)
