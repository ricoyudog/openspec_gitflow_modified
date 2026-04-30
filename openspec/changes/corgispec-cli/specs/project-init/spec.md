## ADDED Requirements

### Requirement: Initialize OpenSpec in a project
The system SHALL provide a `corgispec init [path]` command that scaffolds the OpenSpec directory structure in a target project.

#### Scenario: Init in current directory
- **WHEN** user runs `corgispec init` without a path argument
- **THEN** the CLI creates `openspec/config.yaml`, `openspec/schemas/`, and `openspec/changes/` in the current working directory

#### Scenario: Init with explicit path
- **WHEN** user runs `corgispec init ./my-project`
- **THEN** the CLI creates the OpenSpec structure inside `./my-project/`

#### Scenario: Init with existing config
- **WHEN** user runs `corgispec init` in a directory that already has `openspec/config.yaml`
- **THEN** the CLI prints "OpenSpec already initialized" and exits with code 0 without overwriting

### Requirement: Schema selection during init
The system SHALL prompt for schema selection when no `--schema` option is provided.

#### Scenario: Schema flag provided
- **WHEN** user runs `corgispec init --schema github-tracked`
- **THEN** the generated `config.yaml` has `schema: github-tracked`

#### Scenario: Default schema
- **WHEN** user runs `corgispec init --schema gitlab-tracked`
- **THEN** the generated `config.yaml` has `schema: gitlab-tracked`

### Requirement: Platform skill scaffolding
The system SHALL optionally create platform-specific skill directories during init.

#### Scenario: Claude Code platform
- **WHEN** user runs `corgispec init --platform claude`
- **THEN** the CLI creates `.claude/skills/` directory with skill symlinks or copies

#### Scenario: OpenCode platform
- **WHEN** user runs `corgispec init --platform opencode`
- **THEN** the CLI creates `.opencode/skills/` directory with skill symlinks or copies

#### Scenario: All platforms
- **WHEN** user runs `corgispec init --platform all`
- **THEN** the CLI creates `.claude/skills/`, `.opencode/skills/`, and `.codex/skills/` directories

### Requirement: Generated config includes comments
The system SHALL generate a `config.yaml` that includes commented-out examples for optional settings (isolation, context, rules).

#### Scenario: Config readability
- **WHEN** `corgispec init` completes
- **THEN** the generated `config.yaml` contains YAML comments explaining `isolation`, `context`, and `rules` fields
