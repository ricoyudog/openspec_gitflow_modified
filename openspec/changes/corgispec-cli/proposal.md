## Why

The current installation experience is fragmented across three mechanisms: a global npm package (`@fission-ai/openspec`), a bash script (`install-skills.sh`), and a local tool (`tools/ds-skills`). Our workflow has diverged significantly from the upstream `@fission-ai/openspec` — different schemas, different skill structure, different commands. Users must juggle multiple install steps and understand which tool does what. A single unified CLI (`corgispec`) eliminates this friction: one `npm install -g`, one binary, one mental model.

## What Changes

- **BREAKING**: Replace the upstream `@fission-ai/openspec` CLI dependency entirely with a new `corgispec` package
- Introduce a new globally-installed CLI binary (`corgispec`) written in TypeScript
- Bundle all skills (SKILL.md + skill.meta.json) as package assets, eliminating the need for separate repo checkout
- Unify skill installation (`corgispec install`), validation (`corgispec validate`), listing/graphing (`corgispec list`, `corgispec graph`), and workflow instruction generation (`corgispec propose/apply/review/archive`) under one tool
- Add a `corgispec doctor` diagnostic command for environment health checks
- Add `corgispec init` to scaffold OpenSpec in target projects
- Retire `install-skills.sh` and `tools/ds-skills` as standalone tools (their logic moves into the CLI)

## Capabilities

### New Capabilities
- `cli-scaffold`: Package structure, build system (TypeScript → ESM), commander-based entry point, and `corgispec --version` binary
- `project-init`: `corgispec init [path]` command that scaffolds `.openspec/` config, schemas, and skill stubs in a target project
- `skill-management`: `corgispec install`, `corgispec validate`, `corgispec list`, `corgispec graph` — manages skill lifecycle from bundled assets
- `workflow-instructions`: `corgispec propose/apply/review/archive/status` — generates enriched AI instructions from change state and templates (instruction-generator pattern, no LLM calls)
- `environment-doctor`: `corgispec doctor` — checks Node version, skill directories, config validity, platform detection (Claude Code / OpenCode / Codex)

### Modified Capabilities
<!-- No existing spec-level requirements are changing. The stool-observation-tracking spec is unrelated. -->

## Impact

- **Retired artifacts**: `install-skills.sh`, `tools/ds-skills/` (logic absorbed into `corgispec`)
- **New package**: Top-level `packages/corgispec/` (or root-level if monorepo not desired) with its own `package.json`, `tsconfig.json`, test suite
- **Dependencies**: `commander` (CLI framework), `ajv` (schema validation), `js-yaml` (config parsing), `glob` (file discovery)
- **Runtime**: Node >= 18, TypeScript compiled to ESM
- **Publishing**: `npm publish` as unscoped `corgispec` package
- **User migration**: `npm uninstall -g @fission-ai/openspec && npm install -g corgispec`
- **Skill source of truth**: `.opencode/skills/` remains canonical; build step copies into package assets before publish

## GitLab Issue

<!-- This section will be filled automatically by the propose skill with the parent issue link. -->
