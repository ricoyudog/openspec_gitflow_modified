## ADDED Requirements

### Requirement: Doctor checks environment health
The system SHALL provide a `corgispec doctor` command that diagnoses the runtime environment and reports issues.

#### Scenario: All checks pass
- **WHEN** user runs `corgispec doctor` in a healthy environment
- **THEN** the CLI prints a checklist with all items marked pass and exits with code 0

#### Scenario: Some checks fail
- **WHEN** user runs `corgispec doctor` and issues are detected
- **THEN** the CLI prints each check with pass/fail status, suggests fixes for failures, and exits with code 1

### Requirement: Node version check
The system SHALL verify that the running Node.js version meets the minimum requirement (>= 18).

#### Scenario: Node version adequate
- **WHEN** Node.js version is 18 or higher
- **THEN** doctor reports "Node.js: v<version> (pass)"

#### Scenario: Node version too low
- **WHEN** Node.js version is below 18
- **THEN** doctor reports "Node.js: v<version> (FAIL — requires >= 18)"

### Requirement: Skill directory check
The system SHALL verify that user-level skill directories exist and are writable.

#### Scenario: Directories exist
- **WHEN** `~/.claude/skills/` and `~/.config/opencode/skill/` exist and are writable
- **THEN** doctor reports both directories as pass

#### Scenario: Directory missing
- **WHEN** `~/.claude/skills/` does not exist
- **THEN** doctor reports "~/.claude/skills/: FAIL — not found. Run `corgispec install` to create."

### Requirement: Config validation check
The system SHALL verify that `openspec/config.yaml` in the current project is valid.

#### Scenario: Valid config
- **WHEN** `openspec/config.yaml` exists and has a valid `schema` field
- **THEN** doctor reports "Config: valid (schema: <schema-name>)"

#### Scenario: No config found
- **WHEN** no `openspec/config.yaml` exists in current directory
- **THEN** doctor reports "Config: not found (not in an OpenSpec project)"

#### Scenario: Invalid config
- **WHEN** `openspec/config.yaml` exists but has invalid YAML or missing required fields
- **THEN** doctor reports "Config: FAIL — <parse error or missing field>"

### Requirement: Platform detection
The system SHALL detect which AI coding platforms are available in the environment.

#### Scenario: Claude Code detected
- **WHEN** `~/.claude/` directory exists
- **THEN** doctor reports "Claude Code: detected"

#### Scenario: OpenCode detected
- **WHEN** `~/.config/opencode/` directory exists
- **THEN** doctor reports "OpenCode: detected"

#### Scenario: No platform detected
- **WHEN** neither platform directory exists
- **THEN** doctor reports "No AI platforms detected. Run `corgispec install` after setting up your platform."

### Requirement: Schema validation check
The system SHALL verify that bundled schemas are valid JSON Schema documents.

#### Scenario: Schemas valid
- **WHEN** all bundled schemas parse as valid JSON Schema
- **THEN** doctor reports "Schemas: N schemas valid"

#### Scenario: Schema corruption
- **WHEN** a bundled schema file is corrupted or invalid JSON
- **THEN** doctor reports "Schemas: FAIL — <filename> is not valid JSON Schema"
