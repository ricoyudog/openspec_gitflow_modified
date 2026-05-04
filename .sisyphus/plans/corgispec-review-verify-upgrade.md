# Corgispec Review & Verify Pipeline Upgrade

## TL;DR

> **Quick Summary**: Upgrade the corgispec review pipeline from 3-axis to 5-axis quality checks, extract verification into a standalone skill between apply and review, and add security/performance reference checklists.
> 
> **Deliverables**:
> - Enhanced `quality-checks.md` with anti-rationalization guard, severity classification, architecture/performance checks
> - New `corgispec-verify` skill (universal platform) with `/corgi-verify` command dispatch
> - Security and performance reference checklists integrated into review
> - All changes synced across `.opencode/`, `.claude/`, `.codex/` directories
> - Codex reference file gaps fixed for review skills
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Codex sync → Tier 1 quality-checks → Tier 2 verify skill → Tier 3 checklists → Validation

---

## Context

### Original Request
Upgrade the corgispec review & verify pipeline based on the design document at `wiki/decisions/corgispec-review-verify-upgrade.md`, which adapts ideas from addyosmani/agent-skills (VERIFY/REVIEW separation pattern).

### Interview Summary
**Key Discussions**:
- All 3 Tiers in one plan (user's choice)
- Manual 3-directory sync (.opencode canonical → copy to .claude and .codex)
- Validation-only test strategy (ds-skills validate, not unit tests for skill content)

**Research Findings**:
- Two parallel platform variants exist: GitLab review (delegation model, 111 lines + 4 reference files) and GitHub review (inline monolith, 294 lines)
- Codex directory is missing 4 reference files for review skills — must fix before upgrading
- Verify should be ONE universal skill (platform-agnostic for test/lint/spec checks; conditionally posts to glab/gh for issue reporting)
- Both apply variants' `checkpoint-flow.md` need updating (line 78 currently says only `/corgi-review`)

### Metis Review
**Identified Gaps** (addressed):
- GitHub review variant also needs Tier 1 updates (inline quality checks at lines 79-148 of SKILL.md) → included as separate task
- Both apply checkpoint-flow.md files need updating (GitLab + GitHub) → both included
- Codex has 4 missing review reference files → pre-task added
- Version bumps needed for modified skills → acceptance criteria added
- Anti-rationalization table has 7 rows (not 5 as Chinese text says) → using full 7-row table from design
- Command dispatch needed for both OpenCode and Claude (different path structures) → both included

---

## Work Objectives

### Core Objective
Transform the corgispec review from a 3-axis evidence gatherer into a 5-axis quality assessment system with severity grading, and extract automated verification into a standalone pre-review gate.

### Concrete Deliverables
- Modified: `quality-checks.md` (3 copies across directories)
- Modified: `corgispec-gh-review/SKILL.md` inline quality checks section (3 copies)
- Modified: `checkpoint-flow.md` in both apply variants (6 copies total)
- Modified: `skill.meta.json` version bumps for corgispec-review and corgispec-gh-review (6 copies)
- New: `corgispec-verify/` skill directory with SKILL.md, skill.meta.json, references/ (3 copies)
- New: `/corgi-verify` command dispatch files (OpenCode + Claude)
- New: `security-checklist.md` reference file (3 copies under corgispec-review)
- New: `performance-checklist.md` reference file (3 copies under corgispec-review)
- Fixed: 4 missing Codex reference files for review skills

### Definition of Done
- [ ] `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` passes with zero errors
- [ ] `cd tools/ds-skills && node bin/ds-skills.js list --path ../.. | grep corgispec-verify` shows the new skill
- [ ] `cd tools/ds-skills && node bin/ds-skills.js graph --path ../..` shows no cycles
- [ ] All three directory copies are byte-identical (verified by diff)
- [ ] `quality-checks.md` contains all 5 review axes and severity classification
- [ ] Verify skill has complete SKILL.md with anti-rationalization guard
- [ ] Both apply checkpoint-flow.md files mention `/corgi-verify`

### Must Have
- Anti-rationalization guard with all 7 excuses from design document
- Severity classification (🔴 Critical / 🟡 Important / 🔵 Suggestion / ⚪ Nit / ℹ️ FYI)
- Architecture and Performance check sections
- Standalone verify skill with test execution + spec coverage + lint verification
- Verify report format matching design doc spec
- Gate logic: PASS → review, PASS WITH WARNINGS → review, FAIL → back to apply
- Updated checkpoint-flow.md in BOTH apply variants

### Must NOT Have (Guardrails)
- DO NOT refactor `corgispec-gh-review` from inline to delegation model — keep it monolithic, just upgrade the inline content
- DO NOT change the human gate (Step 5) contract in either review variant
- DO NOT add `depends_on` between molecule-tier skills (would fail ds-skills validate)
- DO NOT add Playwright/UI evidence gathering to verify (stays in review)
- DO NOT create issue tracking logic in verify (verify just posts a note to existing child issue)
- DO NOT fix the 8 missing Codex reference files for apply skills (out of scope — separate task)
- DO NOT update README.md or documentation (separate concern)
- DO NOT change the 6-step review flow structure (Steps 1-6 order unchanged)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (ds-skills validate + corgispec validate)
- **Automated tests**: None for skill content (these are markdown files, not code)
- **Framework**: ds-skills CLI (`cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`)
- **Supplementary**: `diff` commands for 3-directory sync verification

### QA Policy
Every task MUST include:
1. `ds-skills validate` run confirming skill schema compliance
2. `diff` commands confirming 3-directory sync
3. Content verification via `grep` for key sections/markers

Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.txt`.

> **Pre-requisite**: The executing agent MUST run `mkdir -p .sisyphus/evidence` before the first task's QA scenarios. This directory does not exist yet in the repo.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — baseline sync + Tier 1):
├── Task 1: Fix Codex missing review reference files [quick]
├── Task 2: Upgrade quality-checks.md for GitLab review [unspecified-high]
├── Task 3: Upgrade corgispec-gh-review inline quality checks [unspecified-high]

Wave 2 (After Wave 1 — Tier 1 completion + Tier 2 foundation):
├── Task 4: Version bump + sync review skill.meta.json [quick]
├── Task 5: Create corgispec-verify SKILL.md + skill.meta.json [unspecified-high]
├── Task 6: Create verification-steps.md reference [unspecified-high]

Wave 3 (After Wave 2 — Tier 2 integration + Tier 3):
├── Task 7: Create /corgi-verify command dispatch files [quick]
├── Task 8: Update checkpoint-flow.md in both apply variants [quick]
├── Task 9: Create security-checklist.md reference [unspecified-high]
├── Task 10: Create performance-checklist.md reference [unspecified-high]

Wave 4 (After Wave 3 — sync + Tier 3 integration):
├── Task 11: Integrate Tier 3 checklists into gh-review inline content [unspecified-high]
├── Task 12: Full 3-directory sync + validation pass [quick]

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Full skill validation + sync check (unspecified-high)
├── Task F3: Content QA — verify all design doc requirements met (deep)
└── Present results → Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 4, 12 | 1 |
| 2 | — | 3, 4, 9, 10 | 1 |
| 3 | 2 | 4, 11 | 1 |
| 4 | 1, 2, 3 | 12 | 2 |
| 5 | — | 6, 7, 8 | 2 |
| 6 | 5 | 7, 8 | 2 |
| 7 | 5, 6 | 12 | 3 |
| 8 | 5, 6 | 12 | 3 |
| 9 | 2 | 11, 12 | 3 |
| 10 | 2 | 11, 12 | 3 |
| 11 | 3, 9, 10 | 12 | 4 |
| 12 | ALL | F1-F3 | 4 |
| F1-F3 | 12 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 `quick`, T2 `unspecified-high`, T3 `unspecified-high`
- **Wave 2**: 3 tasks — T4 `quick`, T5 `unspecified-high`, T6 `unspecified-high`
- **Wave 3**: 4 tasks — T7 `quick`, T8 `quick`, T9 `unspecified-high`, T10 `unspecified-high`
- **Wave 4**: 2 tasks — T11 `unspecified-high`, T12 `quick`
- **FINAL**: 3 tasks — F1 `oracle`, F2 `unspecified-high`, F3 `deep`

---

## TODOs

- [x] 1. Fix Codex Missing Review Reference Files

  **What to do**:
  - Copy 3 missing files from `.opencode/skills/corgispec-review/references/` to `.codex/skills/corgispec-review/references/`:
    - `quality-checks.md`
    - `repair-flow.md`
    - `worktree-discovery.md`
  - Create `.codex/skills/corgispec-gh-review/references/` directory
  - Copy `worktree-discovery.md` from `.opencode/skills/corgispec-gh-review/references/` to `.codex/skills/corgispec-gh-review/references/`
  - Create `.codex/skills/corgispec-apply-change/references/` directory (if missing)
  - Copy `checkpoint-flow.md` from `.opencode/skills/corgispec-apply-change/references/` to `.codex/skills/corgispec-apply-change/references/`
  - Create `.codex/skills/corgispec-gh-apply/references/` directory (if missing)
  - Copy `checkpoint-flow.md` from `.opencode/skills/corgispec-gh-apply/references/` to `.codex/skills/corgispec-gh-apply/references/`
  - Verify all copies are byte-identical with `diff`
  
  > **Note**: The 2 additional checkpoint-flow.md copies are required because Task 8 will need to sync updated versions to these Codex paths. Only copying the files needed for THIS plan — not all 8 missing Codex apply references.

  **Must NOT do**:
  - Do NOT fix the 8 missing Codex reference files for apply skills (out of scope) — ONLY checkpoint-flow.md is copied because Task 8 needs it
  - Do NOT modify any file content — pure copy only

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file copy operation, no creative work needed
  - **Skills**: []
    - No domain-specific skills needed for file copying

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4, Task 12
  - **Blocked By**: None

  **References**:
  
  **Pattern References**:
  - `.opencode/skills/corgispec-review/references/` — Source directory with all 4 files present
  - `.opencode/skills/corgispec-gh-review/references/worktree-discovery.md` — Source for gh-review copy
  
  **Structural References**:
  - `.codex/skills/corgispec-review/references/review-decisions.md` — Confirms the codex references/ dir exists (has 1 file already)
  - `.codex/skills/corgispec-gh-review/` — Confirm this directory exists but has no references/ subdirectory

  **Acceptance Criteria**:
  - [ ] `.codex/skills/corgispec-review/references/quality-checks.md` exists
  - [ ] `.codex/skills/corgispec-review/references/repair-flow.md` exists
  - [ ] `.codex/skills/corgispec-review/references/worktree-discovery.md` exists
  - [ ] `.codex/skills/corgispec-gh-review/references/worktree-discovery.md` exists
  - [ ] `.codex/skills/corgispec-apply-change/references/checkpoint-flow.md` exists
  - [ ] `.codex/skills/corgispec-gh-apply/references/checkpoint-flow.md` exists
  - [ ] `diff .opencode/skills/corgispec-review/references/quality-checks.md .codex/skills/corgispec-review/references/quality-checks.md` → no output
  - [ ] `diff .opencode/skills/corgispec-review/references/repair-flow.md .codex/skills/corgispec-review/references/repair-flow.md` → no output
  - [ ] `diff .opencode/skills/corgispec-review/references/worktree-discovery.md .codex/skills/corgispec-review/references/worktree-discovery.md` → no output
  - [ ] `diff .opencode/skills/corgispec-gh-review/references/worktree-discovery.md .codex/skills/corgispec-gh-review/references/worktree-discovery.md` → no output
  - [ ] `diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .codex/skills/corgispec-apply-change/references/checkpoint-flow.md` → no output
  - [ ] `diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .codex/skills/corgispec-gh-apply/references/checkpoint-flow.md` → no output

  **QA Scenarios**:

  ```
  Scenario: All 6 missing reference files exist after copy
    Tool: Bash
    Preconditions: Current state has gaps in .codex/ directories
    Steps:
      1. Run: ls .codex/skills/corgispec-review/references/ | sort
      2. Assert output contains: quality-checks.md, repair-flow.md, review-decisions.md, worktree-discovery.md
      3. Run: ls .codex/skills/corgispec-gh-review/references/
      4. Assert output contains: worktree-discovery.md
      5. Run: ls .codex/skills/corgispec-apply-change/references/
      6. Assert output contains: checkpoint-flow.md
      7. Run: ls .codex/skills/corgispec-gh-apply/references/
      8. Assert output contains: checkpoint-flow.md
    Expected Result: All 6 files present across 4 codex skill directories
    Evidence: .sisyphus/evidence/task-1-codex-files-exist.txt

  Scenario: Byte-identical copies verified
    Tool: Bash
    Preconditions: Files copied
    Steps:
      1. Run: diff .opencode/skills/corgispec-review/references/quality-checks.md .codex/skills/corgispec-review/references/quality-checks.md && echo "IDENTICAL"
      2. Run: diff .opencode/skills/corgispec-gh-review/references/worktree-discovery.md .codex/skills/corgispec-gh-review/references/worktree-discovery.md && echo "IDENTICAL"
      3. Run: diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .codex/skills/corgispec-apply-change/references/checkpoint-flow.md && echo "IDENTICAL"
      4. Run: diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .codex/skills/corgispec-gh-apply/references/checkpoint-flow.md && echo "IDENTICAL"
    Expected Result: All diffs produce no output, echo "IDENTICAL" confirms
    Evidence: .sisyphus/evidence/task-1-diff-identical.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `fix(codex): sync 6 missing reference files for review and apply skills`
  - Files: `.codex/skills/corgispec-review/references/{quality-checks,repair-flow,worktree-discovery}.md`, `.codex/skills/corgispec-gh-review/references/worktree-discovery.md`, `.codex/skills/corgispec-{apply-change,gh-apply}/references/checkpoint-flow.md`

- [x] 2. Upgrade quality-checks.md for GitLab Review (Tier 1)

  **What to do**:
  - Rewrite `.opencode/skills/corgispec-review/references/quality-checks.md` to include:
    1. **Anti-Rationalization Guard** (new Section 0, before any checks) — 7-row excuse/rebuttal table from design doc (REQ-T1-1)
    2. **Severity Classification definitions** — 5-level system: 🔴Critical / 🟡Important / 🔵Suggestion / ⚪Nit / ℹ️FYI (REQ-T1-2)
    3. **Architecture Check** (new Section 4) — 4 check items from REQ-T1-3
    4. **Performance Check** (new Section 5) — 5 check items from REQ-T1-4
    5. **Updated Report Format** — 5-axis report with severity per finding, summary grouped by severity (REQ-T1-5)
    6. **Security & Performance Deep Checks** (new Section 6) — brief section saying: "For detailed checks, also read and follow `references/security-checklist.md` and `references/performance-checklist.md` if they exist." This enables Tier 3 integration without requiring the files to already be present.
  - Preserve existing Sections 1-3 (Code Quality, Spec Verification, Functional Verification) but update their table formats to include Severity column
  - Preserve Section 5 "Post evidence to GitLab" unchanged (just renumber to Section 8)
  - Copy updated file to `.claude/skills/corgispec-review/references/quality-checks.md`
  - Copy updated file to `.codex/skills/corgispec-review/references/quality-checks.md`

  **Must NOT do**:
  - Do NOT change the SKILL.md file (only the reference file)
  - Do NOT change the Step ordering in the review flow
  - Do NOT add security-specific checks here (that's Tier 3)
  - Do NOT change `review-decisions.md`, `repair-flow.md`, or `worktree-discovery.md`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires careful content authoring following exact specifications from design doc, with attention to markdown formatting
  - **Skills**: []
    - No special skills needed — this is structured markdown authoring

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 3, 4, 9, 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/references/quality-checks.md` — Current file (66 lines) to be rewritten
  - `wiki/decisions/corgispec-review-verify-upgrade.md:73-195` — EXACT specifications for all Tier 1 requirements (REQ-T1-1 through REQ-T1-5), including the full anti-rationalization table, severity definitions, check items, and report format template

  **Structural References**:
  - `.opencode/skills/corgispec-review/SKILL.md` — Step 4 says "Read and follow `references/quality-checks.md`" — confirms this file IS consumed
  - `wiki/decisions/corgispec-review-verify-upgrade.md:147-189` — The exact new report format skeleton to use

  **WHY Each Reference Matters**:
  - `quality-checks.md` current version: Understand what exists (3 sections + report format) so you preserve the good parts
  - Design doc lines 73-195: This is the SPEC. Every section heading, table row, and format element comes from here. Don't invent — transcribe and integrate.

  **Acceptance Criteria**:
  - [ ] File contains "Anti-Rationalization" section with exactly 7 excuse/rebuttal rows
  - [ ] File contains severity definitions (🔴, 🟡, 🔵, ⚪, ℹ️) with examples
  - [ ] File contains "Architecture Check" section with 4 check items
  - [ ] File contains "Performance Check" section with 5 check items
  - [ ] File contains "Security & Performance Deep Checks" section referencing `security-checklist.md` and `performance-checklist.md`
  - [ ] Report format includes all 5 axes: Code Quality, Architecture, Performance, Spec Coverage, Functional Verification
  - [ ] Report format shows Severity column in every table
  - [ ] Summary line uses format: `🔴 N Critical | 🟡 N Important | 🔵 N Suggestions | ⚪ N Nits | ℹ️ N FYI`
  - [ ] 3-directory sync: `diff .opencode/.../quality-checks.md .claude/.../quality-checks.md` → empty
  - [ ] 3-directory sync: `diff .opencode/.../quality-checks.md .codex/.../quality-checks.md` → empty

  **QA Scenarios**:

  ```
  Scenario: Anti-rationalization guard present with 7 rows
    Tool: Bash
    Preconditions: quality-checks.md has been rewritten
    Steps:
      1. Run: grep -c "能跑就夠了\|只是小改動\|我寫的我知道\|AI 生成的\|測試有過就好\|以後再整理\|Review 太花時間" .opencode/skills/corgispec-review/references/quality-checks.md
      2. Assert output: 7
    Expected Result: All 7 anti-rationalization rows found
    Evidence: .sisyphus/evidence/task-2-anti-rationalization.txt

  Scenario: All 5 review axes present in report format
    Tool: Bash
    Preconditions: quality-checks.md rewritten
    Steps:
      1. Run: grep -c "### Code Quality\|### Architecture\|### Performance\|### Spec Coverage\|### Functional Verification" .opencode/skills/corgispec-review/references/quality-checks.md
      2. Assert output: 5
    Expected Result: All 5 section headers present in report format
    Evidence: .sisyphus/evidence/task-2-five-axes.txt

  Scenario: Severity classification markers present
    Tool: Bash
    Preconditions: quality-checks.md rewritten
    Steps:
      1. Run: grep -c "🔴\|🟡\|🔵\|⚪\|ℹ️" .opencode/skills/corgispec-review/references/quality-checks.md
      2. Assert output is >= 10 (definitions + examples + report format uses)
    Expected Result: Severity markers used throughout
    Evidence: .sisyphus/evidence/task-2-severity-markers.txt

  Scenario: 3-directory sync verified
    Tool: Bash
    Steps:
      1. Run: diff .opencode/skills/corgispec-review/references/quality-checks.md .claude/skills/corgispec-review/references/quality-checks.md
      2. Run: diff .opencode/skills/corgispec-review/references/quality-checks.md .codex/skills/corgispec-review/references/quality-checks.md
    Expected Result: Both diffs produce no output (identical files)
    Evidence: .sisyphus/evidence/task-2-sync-verified.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(review): enhance quality checks with severity, anti-rationalization, architecture/performance axes`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-review/references/quality-checks.md`
  - Pre-commit: `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`

- [x] 3. Upgrade corgispec-gh-review Inline Quality Checks (Tier 1)

  > **NOTE**: Task 3 depends on Task 2 output. Start Task 3 AFTER Task 2 completes (use updated quality-checks.md as content reference).

  **What to do**:
  - Edit `.opencode/skills/corgispec-gh-review/SKILL.md` lines 79-148 (the inline quality checks section) to match the same 5-axis structure from Task 2:
    1. Add Anti-Rationalization Guard check (agent confirms no excuses before proceeding)
    2. Add severity classification instruction (agent must tag every finding)
    3. Add Architecture Check items (4 items)
    4. Add Performance Check items (5 items)
    5. Update the inline report format to include all 5 axes + severity
  - Keep it INLINE (do NOT extract to reference files — preserve the monolithic pattern)
  - The content must be functionally equivalent to `quality-checks.md` but adapted for inline format (no "Read and follow this file" framing)
  - Copy updated SKILL.md to `.claude/skills/corgispec-gh-review/SKILL.md`
  - Copy updated SKILL.md to `.codex/skills/corgispec-gh-review/SKILL.md`

  **Must NOT do**:
  - Do NOT refactor gh-review from inline to delegation model
  - Do NOT change Steps 1-3, 5-6 of the review flow
  - Do NOT change the issue tracking commands (gh issue comment, gh issue edit)
  - Do NOT change the label handling (flat labels: `review`, `done`, `in-progress`)
  - Do NOT add security/performance checklist file references (that's Task 11)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires careful integration of new content into an existing 294-line SKILL.md without breaking surrounding context
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2 for content reference)
  - **Parallel Group**: Wave 1 sequential after Task 2
  - **Blocks**: Tasks 4, 11
  - **Blocked By**: Task 2 (needs the quality-checks.md as content reference)

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-gh-review/SKILL.md:79-148` — Current inline quality checks to be upgraded (70 lines)
  - `.opencode/skills/corgispec-review/references/quality-checks.md` — The UPGRADED version from Task 2 is the content source
  - `wiki/decisions/corgispec-review-verify-upgrade.md:147-189` — Exact report format template

  **Structural References**:
  - `.opencode/skills/corgispec-gh-review/SKILL.md:1-78` — Steps 1-3 context (do not modify)
  - `.opencode/skills/corgispec-gh-review/SKILL.md:149-294` — Steps 5-6 context (do not modify)

  **WHY Each Reference Matters**:
  - Lines 79-148 of gh-review: This is the EXACT section being replaced. Know its boundaries.
  - Updated quality-checks.md: Content source — translate reference-file format into inline format
  - Lines 1-78 and 149-294: Context boundaries. Do NOT accidentally merge into adjacent steps.

  **Acceptance Criteria**:
  - [ ] SKILL.md contains anti-rationalization guard inline
  - [ ] SKILL.md contains severity classification definitions inline
  - [ ] SKILL.md inline report format has all 5 axes
  - [ ] Steps 1-3 and 5-6 unchanged (verify with diff of those line ranges vs backup)
  - [ ] 3-directory sync: all 3 copies identical
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` passes

  **QA Scenarios**:

  ```
  Scenario: All 5 axes present in gh-review inline content
    Tool: Bash
    Preconditions: SKILL.md updated
    Steps:
      1. Run: grep -c "Architecture\|Performance\|Code Quality\|Spec Coverage\|Functional Verification" .opencode/skills/corgispec-gh-review/SKILL.md
      2. Assert output >= 5
    Expected Result: All axis headers present
    Evidence: .sisyphus/evidence/task-3-gh-five-axes.txt

  Scenario: Steps 1-3 and 5-6 unchanged
    Tool: Bash
    Preconditions: SKILL.md updated
    Steps:
      1. Run: grep -n "^## Step" .opencode/skills/corgispec-gh-review/SKILL.md
      2. Verify Steps 1, 2, 3, 5, 6 headings still present in correct order
      3. Run: grep "glab\|gitlab" .opencode/skills/corgispec-gh-review/SKILL.md (should find 0 — this is the GitHub variant)
    Expected Result: Step structure preserved, no GitLab contamination
    Evidence: .sisyphus/evidence/task-3-step-structure.txt

  Scenario: 3-directory sync
    Tool: Bash
    Steps:
      1. diff .opencode/skills/corgispec-gh-review/SKILL.md .claude/skills/corgispec-gh-review/SKILL.md
      2. diff .opencode/skills/corgispec-gh-review/SKILL.md .codex/skills/corgispec-gh-review/SKILL.md
    Expected Result: Both diffs empty
    Evidence: .sisyphus/evidence/task-3-sync.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Message: `feat(review): upgrade gh-review inline quality checks to 5-axis severity model`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-gh-review/SKILL.md`
  - Pre-commit: `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`

- [x] 4. Version Bump Review Skills + Sync (Tier 1 Closeout)

  **What to do**:
  - Bump version in `.opencode/skills/corgispec-review/skill.meta.json` from `1.0.0` to `1.1.0`
  - Bump version in `.opencode/skills/corgispec-gh-review/skill.meta.json` from `1.0.0` to `1.1.0`
  - Copy both updated `skill.meta.json` to `.claude/` and `.codex/` mirrors
  - Run full validation: `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`

  **Must NOT do**:
  - Do NOT change any field other than `version` in skill.meta.json
  - Do NOT bump to 2.0.0 (this is a backward-compatible enhancement, not a breaking change)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple version string change in 6 JSON files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential — must follow Wave 1 completion)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/skill.meta.json` — Current: `"version": "1.0.0"`, change to `"1.1.0"`
  - `.opencode/skills/corgispec-gh-review/skill.meta.json` — Current: `"version": "1.0.0"`, change to `"1.1.0"`
  - `schemas/skill-meta.schema.json` — Schema that validates the version field format

  **Acceptance Criteria**:
  - [ ] Both `.opencode/` skill.meta.json files show version `1.1.0`
  - [ ] All 6 copies (2 skills × 3 dirs) show version `1.1.0`
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` passes

  **QA Scenarios**:

  ```
  Scenario: Version bumps applied correctly
    Tool: Bash
    Steps:
      1. Run: grep '"version"' .opencode/skills/corgispec-review/skill.meta.json
      2. Assert contains: "1.1.0"
      3. Run: grep '"version"' .opencode/skills/corgispec-gh-review/skill.meta.json
      4. Assert contains: "1.1.0"
    Expected Result: Both show 1.1.0
    Evidence: .sisyphus/evidence/task-4-version-bump.txt

  Scenario: Validation passes after bump
    Tool: Bash
    Steps:
      1. Run: cd tools/ds-skills && node bin/ds-skills.js validate --path ../..
      2. Assert exit code 0, no errors in output
    Expected Result: Clean validation
    Evidence: .sisyphus/evidence/task-4-validate.txt
  ```

  **Commit**: NO (groups with Wave 1 commit already made, this is part of Tier 1 closeout — commit separately)
  - Message: `chore(review): bump corgispec-review and corgispec-gh-review to 1.1.0`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-{review,gh-review}/skill.meta.json`

- [x] 5. Create corgispec-verify Skill — SKILL.md + skill.meta.json (Tier 2)

  **What to do**:
  - Create directory `.opencode/skills/corgispec-verify/`
  - Create `skill.meta.json`:
    ```json
    {
      "slug": "corgispec-verify",
      "tier": "molecule",
      "version": "1.0.0",
      "description": "Automated verification gate between apply and review — runs tests, checks spec coverage, validates lint/build",
      "depends_on": [],
      "platform": "universal",
      "tags": ["lifecycle", "verify"],
      "installation": {
        "targets": ["opencode", "claude", "codex"],
        "base_path": "corgispec-verify"
      }
    }
    ```
  - Create `SKILL.md` implementing REQ-T2-1 through REQ-T2-6 from the design document:
    - YAML frontmatter with name, description, version
    - Anti-rationalization guard (same 7 rows — verify gets its own copy)
    - Step 1: Discover change + resolve worktree (same pattern as review Step 1)
    - Step 2: Discover completed group (same pattern as review Step 2)
    - Step 3: Automated test execution (REQ-T2-2) — detect infra, run tests, capture results
    - Step 4: Spec coverage verification (REQ-T2-3) — compare requirements vs implementation
    - Step 5: Lint / Build verification (REQ-T2-4) — detect and run linter/build
    - Step 6: Generate verify report (REQ-T2-5) — structured markdown report
    - Step 7: Gate decision (REQ-T2-6) — PASS/PASS WITH WARNINGS/FAIL → guide next command
    - Platform detection: Read `openspec/config.yaml` schema field, post report via `glab` or `gh` accordingly
    - Guardrails: no human gate, no fixes during verify, no issue creation
  - Create directory `.opencode/skills/corgispec-verify/references/`
  - Copy to `.claude/skills/corgispec-verify/` and `.codex/skills/corgispec-verify/`

  **Must NOT do**:
  - Do NOT add `depends_on: ["corgispec-apply-change"]` (molecule-to-molecule dep violates tier rules)
  - Do NOT include Playwright/UI evidence gathering (stays in review)
  - Do NOT include a human gate step (verify is fully automated)
  - Do NOT create issue tracking logic (only post a note to existing child issue)
  - Do NOT create platform-specific variants (one universal skill with config-based platform detection)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex skill authoring requiring precise implementation of 7 design requirements while following existing patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4 — independent of Tier 1 closeout)
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: None (can start as soon as Wave 1 conceptually complete)

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/SKILL.md` — Pattern for Steps 1-2 (change discovery, worktree resolution, group identification)
  - `.opencode/skills/corgispec-gh-review/SKILL.md:1-78` — GitHub platform detection pattern and `.github.yaml` reading
  - `.opencode/skills/corgispec-review/references/worktree-discovery.md` — Worktree resolution logic to reuse

  **API/Spec References**:
  - `wiki/decisions/corgispec-review-verify-upgrade.md:199-318` — Complete REQ-T2-1 through REQ-T2-7 specifications
  - `wiki/decisions/corgispec-review-verify-upgrade.md:270-295` — Exact verify report format template
  - `wiki/decisions/corgispec-review-verify-upgrade.md:229-239` — Test infrastructure detection table

  **Structural References**:
  - `.opencode/skills/corgispec-review/skill.meta.json` — Pattern for skill.meta.json structure (molecule tier, tags, installation)
  - `schemas/skill-meta.schema.json` — JSON Schema the meta file must validate against
  - `.opencode/commands/corgi-review.md` — Pattern for how commands dispatch to skills (platform detection via config.yaml)

  **WHY Each Reference Matters**:
  - Review SKILL.md Steps 1-2: Copy the change/group discovery pattern exactly — verify uses same discovery logic
  - Design doc lines 199-318: This is the authoritative SPEC for every requirement. Don't invent — implement.
  - skill.meta.json pattern: Copy structure, change slug/description/platform/tags
  - commands/corgi-review.md: The verify command (Task 7) will follow this exact dispatch pattern

  **Acceptance Criteria**:
  - [ ] `.opencode/skills/corgispec-verify/SKILL.md` exists with all 7 steps
  - [ ] `.opencode/skills/corgispec-verify/skill.meta.json` validates against schema
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` passes
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js list --path ../.. | grep corgispec-verify` shows result
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js graph --path ../..` shows no cycles
  - [ ] SKILL.md contains platform detection logic (reads config.yaml schema field)
  - [ ] SKILL.md contains all 3 verdict outcomes: PASS, PASS WITH WARNINGS, FAIL
  - [ ] SKILL.md contains anti-rationalization guard
  - [ ] 3-directory sync: all 3 copies identical

  **QA Scenarios**:

  ```
  Scenario: Skill validates and is discoverable
    Tool: Bash
    Steps:
      1. Run: cd tools/ds-skills && node bin/ds-skills.js validate --path ../..
      2. Assert: no errors
      3. Run: cd tools/ds-skills && node bin/ds-skills.js list --path ../.. | grep verify
      4. Assert: output contains "corgispec-verify"
      5. Run: cd tools/ds-skills && node bin/ds-skills.js graph --path ../..
      6. Assert: no cycle warnings
    Expected Result: Skill validates, is listed, and creates no dependency cycles
    Evidence: .sisyphus/evidence/task-5-skill-validation.txt

  Scenario: SKILL.md contains all required sections
    Tool: Bash
    Steps:
      1. Run: grep -c "Step 1\|Step 2\|Step 3\|Step 4\|Step 5\|Step 6\|Step 7" .opencode/skills/corgispec-verify/SKILL.md
      2. Assert: 7 (all steps present)
      3. Run: grep -c "PASS\|PASS WITH WARNINGS\|FAIL" .opencode/skills/corgispec-verify/SKILL.md
      4. Assert: >= 3
    Expected Result: All steps and verdicts present
    Evidence: .sisyphus/evidence/task-5-skill-content.txt

  Scenario: 3-directory sync
    Tool: Bash
    Steps:
      1. diff -r .opencode/skills/corgispec-verify/ .claude/skills/corgispec-verify/
      2. diff -r .opencode/skills/corgispec-verify/ .codex/skills/corgispec-verify/
    Expected Result: No differences
    Evidence: .sisyphus/evidence/task-5-sync.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Message: `feat(verify): add standalone corgispec-verify skill for automated pre-review gate`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-verify/`
  - Pre-commit: `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`

- [x] 6. Create verification-steps.md Reference File (Tier 2)

  **What to do**:
  - Create `.opencode/skills/corgispec-verify/references/verification-steps.md`
  - Content should detail the EXECUTION procedures for each verification type:
    - **Test execution procedures**: Exact detection conditions and commands per framework (pytest, npm test, bun test, go test, etc.) — expand beyond the design doc's minimal table
    - **Spec coverage procedures**: How to read spec requirements, how to map them to implementation, what "fully covered" / "partially" / "uncovered" means
    - **Lint/build procedures**: Detection conditions for ruff, eslint, tsc, go vet, etc.
    - **Report composition**: How to assemble the final verify report from individual check results
  - This reference file is consumed by SKILL.md Step 3-6 (keep SKILL.md focused on flow, reference has the details)
  - Copy to `.claude/` and `.codex/` mirrors

  **Must NOT do**:
  - Do NOT duplicate anti-rationalization guard here (it's in SKILL.md)
  - Do NOT add security or performance checks (those are review-tier, Tier 3)
  - Do NOT add UI/screenshot procedures (stays in review)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires technical knowledge of multiple test frameworks and careful procedural documentation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 5 creates the directory)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Task 5 (needs directory to exist)

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/references/quality-checks.md` — Pattern for how a reference file is structured (sections with procedures)
  - `wiki/decisions/corgispec-review-verify-upgrade.md:229-265` — REQ-T2-2 through REQ-T2-4 detection tables and procedures

  **Structural References**:
  - `.opencode/skills/corgispec-review/SKILL.md:Step 4` — Shows how review references quality-checks.md ("Read and follow references/quality-checks.md")
  - `.opencode/skills/corgispec-verify/SKILL.md` — Will reference this file in Steps 3-5

  **WHY Each Reference Matters**:
  - quality-checks.md pattern: Follow the same "Use this procedure during X" framing and section structure
  - Design doc detection tables: These are the minimum — expand with additional common frameworks

  **Acceptance Criteria**:
  - [ ] File exists at `.opencode/skills/corgispec-verify/references/verification-steps.md`
  - [ ] Contains test detection section with at least 4 framework patterns
  - [ ] Contains spec coverage verification procedure
  - [ ] Contains lint/build detection section
  - [ ] Contains report composition guidance
  - [ ] 3-directory sync: identical copies

  **QA Scenarios**:

  ```
  Scenario: Reference file has all sections
    Tool: Bash
    Steps:
      1. Run: grep -c "Test\|Spec Coverage\|Lint\|Build\|Report" .opencode/skills/corgispec-verify/references/verification-steps.md
      2. Assert: >= 5 section-related headings
    Expected Result: All major sections present
    Evidence: .sisyphus/evidence/task-6-sections.txt

  Scenario: 3-directory sync
    Tool: Bash
    Steps:
      1. diff .opencode/skills/corgispec-verify/references/verification-steps.md .claude/skills/corgispec-verify/references/verification-steps.md
      2. diff .opencode/skills/corgispec-verify/references/verification-steps.md .codex/skills/corgispec-verify/references/verification-steps.md
    Expected Result: Both empty
    Evidence: .sisyphus/evidence/task-6-sync.txt
  ```

  **Commit**: YES (groups with Task 5)
  - Message: (same commit as Task 5)
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-verify/references/verification-steps.md`

- [x] 7. Create /corgi-verify Command Dispatch Files (Tier 2)

  **What to do**:
  - Create `.opencode/commands/corgi-verify.md` — OpenCode command dispatch file following the exact pattern of `corgi-review.md`:
    1. Read `openspec/config.yaml` for schema
    2. Check isolation mode (worktree detection)
    3. Dispatch to `corgispec-verify` skill (universal — no platform split needed since verify is platform-agnostic for execution, only differs in issue posting)
    4. Verify postconditions (report generated, verdict rendered)
  - Create `.claude/commands/corgi/verify.md` — Claude Code command dispatch (different path structure: nested under `corgi/`)
  - Both commands should have same functional content, adapted for platform command conventions

  **Must NOT do**:
  - Do NOT create a Codex command (Codex has no command structure in this repo)
  - Do NOT add complex logic to the command file — keep it a thin dispatcher like corgi-review.md
  - Do NOT reference platform-specific skills (there's only one universal corgispec-verify)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Template-based creation following an exact existing pattern (corgi-review.md)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9, 10)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 5, 6

  **References**:

  **Pattern References**:
  - `.opencode/commands/corgi-review.md` — EXACT pattern to follow for the OpenCode command (43 lines, reads config, checks isolation, dispatches to skill)
  - `.claude/commands/corgi/review.md` — Pattern for Claude command (if exists; otherwise follow `.claude/commands/corgi/` directory conventions from other files)

  **Structural References**:
  - `.opencode/commands/` — Directory listing shows all 10 existing commands (propose, apply, review, archive, explore, install, ask, lint, migrate, memory-init)
  - `.claude/commands/corgi/` — Claude command directory structure

  **WHY Each Reference Matters**:
  - corgi-review.md: This IS the template. Copy its structure, replace "review" with "verify", remove the platform skill split (verify is universal)

  **Acceptance Criteria**:
  - [ ] `.opencode/commands/corgi-verify.md` exists
  - [ ] `.claude/commands/corgi/verify.md` exists
  - [ ] OpenCode command references `corgispec-verify` skill
  - [ ] Both commands read config.yaml for platform detection
  - [ ] Both commands mention postcondition: verify report generated

  **QA Scenarios**:

  ```
  Scenario: OpenCode command file exists with correct dispatch
    Tool: Bash
    Steps:
      1. Run: test -f .opencode/commands/corgi-verify.md && echo EXISTS
      2. Assert: "EXISTS"
      3. Run: grep "corgispec-verify" .opencode/commands/corgi-verify.md
      4. Assert: at least 1 match
      5. Run: grep "config.yaml" .opencode/commands/corgi-verify.md
      6. Assert: at least 1 match
    Expected Result: Command exists and dispatches correctly
    Evidence: .sisyphus/evidence/task-7-opencode-cmd.txt

  Scenario: Claude command file exists
    Tool: Bash
    Steps:
      1. Run: test -f .claude/commands/corgi/verify.md && echo EXISTS
      2. Assert: "EXISTS"
      3. Run: grep "corgispec-verify" .claude/commands/corgi/verify.md
      4. Assert: at least 1 match
    Expected Result: Claude command exists and references correct skill
    Evidence: .sisyphus/evidence/task-7-claude-cmd.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(verify): add /corgi-verify command dispatch for OpenCode and Claude`
  - Files: `.opencode/commands/corgi-verify.md`, `.claude/commands/corgi/verify.md`

- [x] 8. Update checkpoint-flow.md in Both Apply Variants (Tier 2)

  **What to do**:
  - Edit `.opencode/skills/corgispec-apply-change/references/checkpoint-flow.md` line 78:
    - FROM: `Run '/corgi-review' to review this group, or '/corgi-apply' to continue.`
    - TO: `Run '/corgi-verify' to verify this group, then '/corgi-review' to review. Or '/corgi-apply' to continue.`
  - Edit `.opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md` line 78:
    - Same change (identical content)
  - Copy both updated files to `.claude/` and `.codex/` mirrors (6 files total)
  - Verify: both files now mention `/corgi-verify` before `/corgi-review`

  **Must NOT do**:
  - Do NOT change any other content in checkpoint-flow.md
  - Do NOT change the checkpoint report format structure
  - Do NOT change the "Discover, Develop, and Closeout Loop" section

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-line change in 2 source files + copy to 4 mirrors
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9, 10)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 5, 6 (verify skill must exist before referencing it)

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-apply-change/references/checkpoint-flow.md:78` — Exact line to change (GitLab variant)
  - `.opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md:78` — Exact line to change (GitHub variant)
  - `wiki/decisions/corgispec-review-verify-upgrade.md:310-318` — REQ-T2-7 specifying the new format

  **WHY Each Reference Matters**:
  - Both checkpoint-flow.md files: The ONLY place that guides users after apply closeout. Must mention verify.
  - Design doc REQ-T2-7: Authoritative spec for the new text.

  **Acceptance Criteria**:
  - [ ] Both `.opencode/` checkpoint-flow.md files contain `/corgi-verify`
  - [ ] `/corgi-verify` appears BEFORE `/corgi-review` in the guidance text
  - [ ] No other lines changed (verify with `git diff --stat` showing only line 78)
  - [ ] 6 copies total synced (2 skills × 3 dirs)

  **QA Scenarios**:

  ```
  Scenario: Both apply variants mention verify before review
    Tool: Bash
    Steps:
      1. Run: grep "corgi-verify" .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md
      2. Assert: match found, appears before "corgi-review" on same line
      3. Run: grep "corgi-verify" .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md
      4. Assert: match found
    Expected Result: Both files updated
    Evidence: .sisyphus/evidence/task-8-checkpoint-update.txt

  Scenario: Only line 78 changed
    Tool: Bash
    Steps:
      1. Run: wc -l .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md
      2. Assert: 104 (same total line count)
    Expected Result: File length unchanged (in-place edit)
    Evidence: .sisyphus/evidence/task-8-linecount.txt

  Scenario: 6-file sync
    Tool: Bash
    Steps:
      1. diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .claude/skills/corgispec-apply-change/references/checkpoint-flow.md
      2. diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .codex/skills/corgispec-apply-change/references/checkpoint-flow.md
      3. diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .claude/skills/corgispec-gh-apply/references/checkpoint-flow.md
      4. diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .codex/skills/corgispec-gh-apply/references/checkpoint-flow.md
    Expected Result: All 4 diffs empty
    Evidence: .sisyphus/evidence/task-8-sync.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(verify): update apply checkpoint guidance to mention /corgi-verify`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-{apply-change,gh-apply}/references/checkpoint-flow.md`

- [x] 9. Create security-checklist.md Reference File (Tier 3)

  **What to do**:
  - Create `.opencode/skills/corgispec-review/references/security-checklist.md`
  - Content per REQ-T3-1 from design document:
    - **Always Check** section (4 items): no secrets in source, input validation at boundaries, parameterized queries, error responses don't expose internals
    - **Red Flags** section (5 items): user input to shell, unauthenticated endpoints, CORS wildcard, known vuln deps, no rate limiting on auth
    - Each Red Flag marked as triggering 🔴 Critical severity if found
    - Brief guidance on how to check each item (commands, grep patterns, what to look for)
  - Copy to `.claude/` and `.codex/` mirrors

  **Must NOT do**:
  - Do NOT modify quality-checks.md to reference this file yet (that integration is implicit — review agent should read all reference files)
  - Do NOT add OWASP-level exhaustive checklists (keep it focused per design doc)
  - Do NOT make this a blocking gate (it's informational for the review report)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Security knowledge needed to write actionable check procedures
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8, 10)
  - **Blocks**: Tasks 11, 12
  - **Blocked By**: Task 2 (needs quality-checks.md to exist for architectural consistency)

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/references/quality-checks.md` — Pattern for reference file structure within this skill
  - `wiki/decisions/corgispec-review-verify-upgrade.md:325-340` — REQ-T3-1 exact content specification

  **WHY Each Reference Matters**:
  - quality-checks.md: Follow same writing style and section formatting
  - Design doc REQ-T3-1: Contains the exact items to include. Don't invent extra items.

  **Acceptance Criteria**:
  - [ ] File exists at `.opencode/skills/corgispec-review/references/security-checklist.md`
  - [ ] Contains "Always Check" section with 4 items
  - [ ] Contains "Red Flags" section with 5 items
  - [ ] Red Flags reference 🔴 Critical severity
  - [ ] 3-directory sync: all 3 copies identical

  **QA Scenarios**:

  ```
  Scenario: Security checklist has required sections
    Tool: Bash
    Steps:
      1. Run: grep -c "Always Check\|Red Flags" .opencode/skills/corgispec-review/references/security-checklist.md
      2. Assert: 2
      3. Run: grep -c "🔴" .opencode/skills/corgispec-review/references/security-checklist.md
      4. Assert: >= 1 (Red Flags reference Critical severity)
    Expected Result: Both sections present with severity marker
    Evidence: .sisyphus/evidence/task-9-security-sections.txt

  Scenario: 3-directory sync
    Tool: Bash
    Steps:
      1. diff .opencode/skills/corgispec-review/references/security-checklist.md .claude/skills/corgispec-review/references/security-checklist.md
      2. diff .opencode/skills/corgispec-review/references/security-checklist.md .codex/skills/corgispec-review/references/security-checklist.md
    Expected Result: Both empty
    Evidence: .sisyphus/evidence/task-9-sync.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Message: `feat(review): add security and performance reference checklists`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-review/references/security-checklist.md`

- [x] 10. Create performance-checklist.md Reference File (Tier 3)

  **What to do**:
  - Create `.opencode/skills/corgispec-review/references/performance-checklist.md`
  - Content per REQ-T3-2 from design document:
    - **Check Items** (5 items): N+1 queries, missing pagination, blocking sync ops, bundle size concerns, unbounded loops/memory leaks
    - **Core Principle**: "Measure before optimizing" — flag patterns but don't over-prescribe solutions
    - Brief guidance on detection techniques per item
  - Copy to `.claude/` and `.codex/` mirrors

  **Must NOT do**:
  - Do NOT include profiling tool recommendations (out of scope)
  - Do NOT make this a blocking gate
  - Do NOT duplicate the inline performance check items already in quality-checks.md (this is the DETAILED reference, quality-checks has the summary)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Performance domain knowledge needed for actionable checks
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8, 9)
  - **Blocks**: Tasks 11, 12
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-review/references/quality-checks.md` — Sibling reference file in the same skill, already exists (use as structural pattern for section formatting and tone)
  - `wiki/decisions/corgispec-review-verify-upgrade.md:342-355` — REQ-T3-2 exact content specification

  **WHY Each Reference Matters**:
  - quality-checks.md: Same skill, same directory — follow its writing style and section formatting for consistency
  - Design doc REQ-T3-2: Contains the exact 5 items and core principle

  **Acceptance Criteria**:
  - [ ] File exists at `.opencode/skills/corgispec-review/references/performance-checklist.md`
  - [ ] Contains 5 check items from design doc
  - [ ] Contains "Measure before optimizing" principle
  - [ ] 3-directory sync: all 3 copies identical

  **QA Scenarios**:

  ```
  Scenario: Performance checklist has 5 items
    Tool: Bash
    Steps:
      1. Run: grep -c "N+1\|pagination\|sync\|bundle\|memory\|unbounded" .opencode/skills/corgispec-review/references/performance-checklist.md
      2. Assert: >= 5
    Expected Result: All performance items present
    Evidence: .sisyphus/evidence/task-10-perf-items.txt

  Scenario: 3-directory sync
    Tool: Bash
    Steps:
      1. diff .opencode/skills/corgispec-review/references/performance-checklist.md .claude/skills/corgispec-review/references/performance-checklist.md
      2. diff .opencode/skills/corgispec-review/references/performance-checklist.md .codex/skills/corgispec-review/references/performance-checklist.md
    Expected Result: Both empty
    Evidence: .sisyphus/evidence/task-10-sync.txt
  ```

  **Commit**: YES (same commit as Task 9)
  - Message: (same commit as Task 9)
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-review/references/performance-checklist.md`

- [x] 11. Integrate Tier 3 Checklists into gh-review Inline Content

  **What to do**:
  - Edit `.opencode/skills/corgispec-gh-review/SKILL.md` to add inline references to the security and performance checklists:
    - In the Architecture section (added in Task 3), add a note: "Also check `references/security-checklist.md` for security-specific items"
    - In the Performance section (added in Task 3), add a note: "Also check `references/performance-checklist.md` for detailed performance patterns"
  - Add the checklist files to the gh-review skill's references directory:
    - Copy `security-checklist.md` to `.opencode/skills/corgispec-gh-review/references/`
    - Copy `performance-checklist.md` to `.opencode/skills/corgispec-gh-review/references/`
  - Sync all changes to `.claude/` and `.codex/`

  **Must NOT do**:
  - Do NOT inline the full checklist content into SKILL.md (use reference file pattern)
  - Do NOT refactor gh-review to delegation model
  - Do NOT change the review report format again (already upgraded in Task 3)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integration task requiring understanding of existing gh-review structure
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (after Wave 3 completes)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 3, 9, 10

  **References**:

  **Pattern References**:
  - `.opencode/skills/corgispec-gh-review/SKILL.md` — Updated version from Task 3 (the source being modified)
  - `.opencode/skills/corgispec-review/references/security-checklist.md` — Source files from Tasks 9, 10
  - `.opencode/skills/corgispec-review/references/performance-checklist.md` — Source files from Tasks 9, 10
  - `wiki/decisions/corgispec-review-verify-upgrade.md:357-359` — REQ-T3-3 integration requirement

  **WHY Each Reference Matters**:
  - gh-review SKILL.md: Must know exact current content (after Task 3 changes) to insert reference notes correctly
  - Checklist files: Being copied into the gh-review references directory
  - REQ-T3-3: States checklists should be referenced during review execution

  **Acceptance Criteria**:
  - [ ] `.opencode/skills/corgispec-gh-review/references/security-checklist.md` exists
  - [ ] `.opencode/skills/corgispec-gh-review/references/performance-checklist.md` exists
  - [ ] SKILL.md references both checklist files
  - [ ] 3-directory sync: all copies identical
  - [ ] `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` passes

  **QA Scenarios**:

  ```
  Scenario: Checklist files present in gh-review references
    Tool: Bash
    Steps:
      1. Run: ls .opencode/skills/corgispec-gh-review/references/ | sort
      2. Assert output contains: performance-checklist.md, security-checklist.md, worktree-discovery.md
    Expected Result: 3 reference files present
    Evidence: .sisyphus/evidence/task-11-gh-refs.txt

  Scenario: SKILL.md references checklists
    Tool: Bash
    Steps:
      1. Run: grep -c "security-checklist\|performance-checklist" .opencode/skills/corgispec-gh-review/SKILL.md
      2. Assert: >= 2
    Expected Result: Both checklist files referenced
    Evidence: .sisyphus/evidence/task-11-refs-in-skill.txt

  Scenario: Full sync check
    Tool: Bash
    Steps:
      1. diff -r .opencode/skills/corgispec-gh-review/ .claude/skills/corgispec-gh-review/
      2. diff -r .opencode/skills/corgispec-gh-review/ .codex/skills/corgispec-gh-review/
    Expected Result: No differences
    Evidence: .sisyphus/evidence/task-11-sync.txt
  ```

  **Commit**: YES (groups with Wave 4)
  - Message: `feat(review): integrate security and performance checklists into gh-review`
  - Files: `{.opencode,.claude,.codex}/skills/corgispec-gh-review/references/{security,performance}-checklist.md`, `{.opencode,.claude,.codex}/skills/corgispec-gh-review/SKILL.md`

- [x] 12. Full 3-Directory Sync Verification + Final Validation Pass

  **What to do**:
  - Run comprehensive diff across ALL modified skill directories:
    - `diff -r .opencode/skills/corgispec-review/ .claude/skills/corgispec-review/`
    - `diff -r .opencode/skills/corgispec-review/ .codex/skills/corgispec-review/`
    - `diff -r .opencode/skills/corgispec-gh-review/ .claude/skills/corgispec-gh-review/`
    - `diff -r .opencode/skills/corgispec-gh-review/ .codex/skills/corgispec-gh-review/`
    - `diff -r .opencode/skills/corgispec-verify/ .claude/skills/corgispec-verify/`
    - `diff -r .opencode/skills/corgispec-verify/ .codex/skills/corgispec-verify/`
    - `diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .claude/skills/corgispec-apply-change/references/checkpoint-flow.md`
    - `diff .opencode/skills/corgispec-apply-change/references/checkpoint-flow.md .codex/skills/corgispec-apply-change/references/checkpoint-flow.md`
    - `diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .claude/skills/corgispec-gh-apply/references/checkpoint-flow.md`
    - `diff .opencode/skills/corgispec-gh-apply/references/checkpoint-flow.md .codex/skills/corgispec-gh-apply/references/checkpoint-flow.md`
  - Note: The codex apply reference directories were created in Task 1 specifically to enable this sync
  - Run `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..` — must pass with zero errors
  - Run `cd tools/ds-skills && node bin/ds-skills.js list --path ../..` — verify corgispec-verify appears
  - Run `cd tools/ds-skills && node bin/ds-skills.js graph --path ../..` — verify no cycles
  - Fix any discrepancies found

  **Must NOT do**:
  - Do NOT modify file content to "fix" sync — if content differs, go back to the source task
  - Do NOT skip any diff check

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical verification — running commands and checking output
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final gate before FINAL wave)
  - **Blocks**: F1, F2, F3
  - **Blocked By**: ALL previous tasks

  **References**:

  **Structural References**:
  - All files modified in Tasks 1-11 (see commit strategy table for complete list)
  - `tools/ds-skills/bin/ds-skills.js` — Validation CLI entry point

  **Acceptance Criteria**:
  - [ ] ALL diffs produce empty output (zero differences)
  - [ ] `ds-skills validate` exits with code 0
  - [ ] `ds-skills list` shows `corgispec-verify`
  - [ ] `ds-skills graph` shows no cycles
  - [ ] Total new/modified skill count matches expectations: 4 skills touched (review, gh-review, verify, apply × 2 platforms)

  **QA Scenarios**:

  ```
  Scenario: Complete directory sync verification
    Tool: Bash
    Steps:
      1. Run all 10 diff commands listed in "What to do"
      2. Assert: all produce empty output
      3. Run: cd tools/ds-skills && node bin/ds-skills.js validate --path ../.. 2>&1
      4. Assert: exit code 0, output contains no "ERROR" lines
      5. Run: cd tools/ds-skills && node bin/ds-skills.js list --path ../.. | grep -c corgispec-verify
      6. Assert: 1
    Expected Result: Perfect sync, clean validation, skill discoverable
    Evidence: .sisyphus/evidence/task-12-final-validation.txt

  Scenario: Dependency graph clean
    Tool: Bash
    Steps:
      1. Run: cd tools/ds-skills && node bin/ds-skills.js graph --path ../.. 2>&1
      2. Assert: no "cycle" or "circular" in output
    Expected Result: Acyclic dependency graph
    Evidence: .sisyphus/evidence/task-12-graph.txt
  ```

  **Commit**: NO (only commit if fixes were needed; otherwise all work already committed)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 3 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (grep files for key content). For each "Must NOT Have": search for forbidden patterns. Check evidence files in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Full Skill Validation + Sync Check** — `unspecified-high`
  Run `cd tools/ds-skills && node bin/ds-skills.js validate --path ../..`. Run `cd tools/ds-skills && node bin/ds-skills.js list --path ../..` to confirm corgispec-verify appears. Run `cd tools/ds-skills && node bin/ds-skills.js graph --path ../..` to confirm no cycles. Diff ALL modified files across 3 directories. Report any discrepancies.
  Output: `Validate [PASS/FAIL] | List [FOUND/NOT FOUND] | Graph [CLEAN/CYCLES] | Sync [N/N identical] | VERDICT`

- [x] F3. **Design Doc Coverage Check** — `deep`
  Read `wiki/decisions/corgispec-review-verify-upgrade.md`. For each REQ-T1-*, REQ-T2-*, REQ-T3-* requirement: verify the corresponding file contains the required content. Check all acceptance criteria checkboxes from the design document. Report coverage percentage.
  Output: `Tier 1 [N/N] | Tier 2 [N/N] | Tier 3 [N/N] | Coverage: N% | VERDICT`

---

## Commit Strategy

| Wave | Commit Message | Files |
|------|---------------|-------|
| After Wave 1 | `feat(review): enhance quality checks with severity, anti-rationalization, architecture/performance axes` | quality-checks.md × 3, corgispec-gh-review/SKILL.md × 3, codex reference fixes |
| After Wave 2 | `feat(verify): add standalone corgispec-verify skill for automated pre-review gate` | corgispec-verify/ × 3, skill.meta.json bumps × 6 |
| After Wave 3-4 | `feat(verify): add command dispatch, update checkpoint flow, add security/perf checklists` | commands × 2, checkpoint-flow.md × 6, security-checklist.md × 3, performance-checklist.md × 3, gh-review updates × 3 |

---

## Success Criteria

### Verification Commands
```bash
cd tools/ds-skills && node bin/ds-skills.js validate --path ../..  # Expected: 0 errors
cd tools/ds-skills && node bin/ds-skills.js list --path ../.. | grep corgispec-verify    # Expected: 1 result
cd tools/ds-skills && node bin/ds-skills.js graph --path ../..                           # Expected: no cycles

# 3-directory sync (spot checks)
diff .opencode/skills/corgispec-review/references/quality-checks.md .claude/skills/corgispec-review/references/quality-checks.md
diff .opencode/skills/corgispec-review/references/quality-checks.md .codex/skills/corgispec-review/references/quality-checks.md
diff .opencode/skills/corgispec-verify/SKILL.md .claude/skills/corgispec-verify/SKILL.md
diff .opencode/skills/corgispec-verify/SKILL.md .codex/skills/corgispec-verify/SKILL.md
```

### Final Checklist
- [ ] All "Must Have" present (7 items)
- [ ] All "Must NOT Have" absent (8 guardrails)
- [ ] ds-skills validate passes
- [ ] All 3 directories in sync
- [ ] Design doc REQ-T1-1 through REQ-T3-3 coverage ≥ 95%
