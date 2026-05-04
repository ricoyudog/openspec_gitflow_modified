---
type: wiki
generated: 2026-05-01
tags: [lint, meta]
---

# Lint Report — 2026-05-01

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Error | 0 |
| ⚠️ Warning | 0 |
| ℹ️ Info | 2 |
| ✅ Pass | 9 |

**Overall**: PASS

## Findings

### 🔴 Errors
None

### ⚠️ Warnings
None

### ℹ️ Info
- Completed change `corgispec-cli` has no session summary at `wiki/sessions/corgispec-cli.md`
  Suggested fix: Run `/corgi-archive` on this change to trigger knowledge extraction, or manually create the session summary.
- Completed change `corgispec-llm-memory` has no session summary at `wiki/sessions/corgispec-llm-memory.md`
  Suggested fix: Run `/corgi-archive` on this change to trigger knowledge extraction, or manually create the session summary.

## Checks Passed
- ✅ Check #1: `memory/session-bridge.md` freshness is within 30 days
- ✅ Check #2: `wiki/hot.md` freshness is within 14 days
- ✅ Check #3: All wikilinks in `memory/` and `wiki/` resolve successfully
- ✅ Check #4: `memory/pitfalls.md` has no active pitfall entries missing source links
- ✅ Check #5: `wiki/architecture/implicit-contracts.md` is still in placeholder state
- ✅ Check #6: All non-index wiki pages have at least one incoming wikilink
- ✅ Check #8: Session Memory Protocol exists in `AGENTS.md`
- ✅ Check #9: `wiki/hot.md` is within the 600-word hard cap
- ✅ Check #10: `wiki/index.md` is within the 80-line hard cap
- ✅ Check #11: `memory/pitfalls.md` active entry count is within the cap of 20

## Suggested Actions
1. Create `wiki/sessions/corgispec-cli.md` or run `/corgi-archive` for `corgispec-cli` to extract its session summary.
2. Create `wiki/sessions/corgispec-llm-memory.md` or run `/corgi-archive` for `corgispec-llm-memory` to extract its session summary.
