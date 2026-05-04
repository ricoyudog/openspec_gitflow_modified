# Reframe README Install Step: Human-Friendly "Copy-Paste" Framing

## TL;DR

> **Quick Summary**: Change "Tell your agent to run bootstrap" wording to a human-friendly "Copy and paste this prompt into your LLM Agent" framing — matching the oh-my-openagent style.
> 
> **Deliverables**: Updated README.md + README.zh-TW.md
> **Estimated Effort**: Quick (< 15 min)
> **Parallel Execution**: YES — 1 wave, 2 parallel tasks

---

## Context

### Original Request
The current README Step 2 heading says "Tell your agent to run bootstrap" which sounds like a technical agent-centric instruction. User wants it reframed as a human-readable "copy and paste this prompt" style, similar to how oh-my-openagent presents it:

```
复制并粘贴以下提示词到你的 LLM Agent (Claude Code, AmpCode, Cursor 等):
```

### What to Change

Three locations per language file:

1. **Quick Start Step 2** (heading + body text) — lines 57-65 (EN), lines 57-67 (ZH)
2. **Cross-Session Memory table** — line 304 (EN), line 305 (ZH)

The prompt text inside the code block (`Fetch and follow instructions from ...`) stays UNCHANGED.

---

## Work Objectives

### Core Objective
Make the bootstrap instruction feel like a human instruction guide, not an agent command.

### Must Have
- Step 2 heading reframed (no more "Tell your agent to run bootstrap")
- Body text reframed as "copy and paste" instruction
- Memory table row updated to match
- Both EN and ZH files updated

### Must NOT Have (Guardrails)
- Do NOT change the actual prompt text inside the code block
- Do NOT change other sections
- Do NOT rewrite surrounding paragraphs beyond what's needed

---

## Verification Strategy

- **Automated tests**: None (docs-only change)
- **QA**: Visual inspection — read both READMEs and confirm the new wording is clear and natural

---

## TODOs

- [x] 1. Update README.md (English)

  **What to do**:
  - Change Step 2 heading from `### 2. Tell your agent to run bootstrap` to `### 2. Install to your project`
  - Rewrite the body text above the code block. Replace:
    ```
    Open the cloned repo in your agent and tell it:
    ```
    With something like:
    ```
    Copy and paste the following prompt into your LLM Agent (OpenCode, Claude Code, Cursor, etc.):
    ```
  - Update Cross-Session Memory table row (line ~304). Replace:
    ```
    | New project bootstrap | Follow `.opencode/INSTALL.md` so the agent runs `corgispec bootstrap` |
    ```
    With:
    ```
    | New project bootstrap | Paste the Quick Start prompt into your agent — it runs `corgispec bootstrap` |
    ```

  **Must NOT do**:
  - Change the prompt text inside the ` ```text ` code block
  - Change paragraphs below the code block (the "If you are using a branch..." note stays)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Nothing
  - **Blocked By**: None

  **References**:
  - `README.md:57-65` — Current Step 2 section to modify
  - `README.md:304` — Memory table row to update

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Step 2 reads as human-facing copy-paste instruction
    Tool: Bash (grep)
    Steps:
      1. grep -n "Tell your agent" README.md → expect 0 matches
      2. grep -n "Copy and paste" README.md → expect 1 match in Step 2 area
      3. grep -n "Fetch and follow instructions from" README.md → expect 1 match (unchanged prompt)
    Expected Result: Old wording gone, new wording present, prompt intact
    Evidence: .sisyphus/evidence/task-1-readme-en-grep.txt
  ```

  **Commit**: YES (groups with 2)
  - Message: `docs: reframe bootstrap step as human-friendly copy-paste instruction`
  - Files: `README.md`, `README.zh-TW.md`

---

- [x] 2. Update README.zh-TW.md (Chinese)

  **What to do**:
  - Change Step 2 heading from `### 2. 告訴你的 agent 執行 bootstrap` to `### 2. 安裝到你的專案`
  - Rewrite the body text above the code block. Replace:
    ```
    在你的 agent 中開啟已 clone 的 repo，並告訴它：
    ```
    With:
    ```
    複製並貼上以下提示詞到你的 LLM Agent（OpenCode、Claude Code、Cursor 等）：
    ```
  - Update Cross-Session Memory table row (line ~305). Replace:
    ```
    | 新專案 bootstrap | 依照 `.opencode/INSTALL.md`，讓 agent 執行 `corgispec bootstrap` |
    ```
    With:
    ```
    | 新專案 bootstrap | 將快速開始的提示詞貼入你的 agent — 它會執行 `corgispec bootstrap` |
    ```

  **Must NOT do**:
  - Change the prompt text inside the ` ```text ` code block
  - Change paragraphs below the code block

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Nothing
  - **Blocked By**: None

  **References**:
  - `README.zh-TW.md:57-67` — Current Step 2 section to modify
  - `README.zh-TW.md:305` — Memory table row to update

  **Acceptance Criteria**:

  **QA Scenarios:**

  ```
  Scenario: Step 2 reads as human-facing copy-paste instruction (ZH)
    Tool: Bash (grep)
    Steps:
      1. grep -n "告訴你的 agent" README.zh-TW.md → expect 0 matches
      2. grep -n "複製並貼上" README.zh-TW.md → expect 1 match
      3. grep -n "Fetch and follow instructions from" README.zh-TW.md → expect 1 match (unchanged)
    Expected Result: Old wording gone, new wording present, prompt intact
    Evidence: .sisyphus/evidence/task-2-readme-zh-grep.txt
  ```

  **Commit**: YES (groups with 1)
  - Message: `docs: reframe bootstrap step as human-friendly copy-paste instruction`
  - Files: `README.md`, `README.zh-TW.md`

---

## Commit Strategy

- **Single commit**: `docs: reframe bootstrap step as human-friendly copy-paste instruction` — both READMEs together

---

## Success Criteria

- [x] "Tell your agent to run bootstrap" / "告訴你的 agent 執行 bootstrap" gone from both files
- [x] New copy-paste framing present in both files
- [x] Prompt text inside code blocks unchanged
- [x] Memory table references updated
