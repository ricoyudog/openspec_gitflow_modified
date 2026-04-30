## ADDED Requirements

### Requirement: Install skills to user-level directories
The system SHALL provide a `corgispec install` command that copies bundled skills to platform-specific user-level directories.

#### Scenario: Default install targets
- **WHEN** user runs `corgispec install`
- **THEN** skills are copied to `~/.claude/skills/` and `~/.config/opencode/skill/`

#### Scenario: Selective platform install
- **WHEN** user runs `corgispec install --platform opencode`
- **THEN** skills are only copied to `~/.config/opencode/skill/`

#### Scenario: Dry run
- **WHEN** user runs `corgispec install --dry-run`
- **THEN** the CLI prints planned copy operations without writing any files

#### Scenario: Overwrite existing
- **WHEN** user runs `corgispec install` and skill directories already exist
- **THEN** existing skill directories are replaced with the bundled versions

### Requirement: Validate skill structure
The system SHALL provide a `corgispec validate` command that checks all skills for structural correctness.

#### Scenario: All valid
- **WHEN** user runs `corgispec validate` and all skills pass
- **THEN** the CLI prints "All N skills valid" and exits with code 0

#### Scenario: Validation failure
- **WHEN** user runs `corgispec validate` and a skill has invalid `skill.meta.json`
- **THEN** the CLI prints the skill slug, error details, and exits with code 1

#### Scenario: Validate specific path
- **WHEN** user runs `corgispec validate --path ./my-skills`
- **THEN** the CLI validates skills found in the specified directory

### Requirement: Validation checks
The system SHALL validate: (a) `skill.meta.json` against the JSON Schema, (b) `SKILL.md` exists and is non-empty, (c) directory name matches slug in meta, (d) tier constraints (atoms have no deps, molecules depend only on atoms, compounds can depend on any).

#### Scenario: Missing SKILL.md
- **WHEN** a skill directory contains `skill.meta.json` but no `SKILL.md`
- **THEN** validation reports "Missing SKILL.md" for that skill

#### Scenario: Slug mismatch
- **WHEN** directory name is `foo-bar` but `skill.meta.json` has `"slug": "baz"`
- **THEN** validation reports "Slug mismatch: directory 'foo-bar' vs meta 'baz'"

#### Scenario: Tier violation
- **WHEN** an atom-tier skill declares dependencies
- **THEN** validation reports "Atom skills must not have dependencies"

### Requirement: List skills
The system SHALL provide a `corgispec list` command that displays discovered skills with optional filtering.

#### Scenario: List all skills
- **WHEN** user runs `corgispec list --skills`
- **THEN** output shows each skill's slug, tier, platform, and description

#### Scenario: Filter by tier
- **WHEN** user runs `corgispec list --skills --tier molecule`
- **THEN** output shows only molecule-tier skills

#### Scenario: Filter by platform
- **WHEN** user runs `corgispec list --skills --platform github`
- **THEN** output shows only github-platform skills

#### Scenario: JSON output
- **WHEN** user runs `corgispec list --skills --json`
- **THEN** output is valid JSON array of skill objects

### Requirement: Dependency graph
The system SHALL provide a `corgispec graph` command that outputs a dependency graph of skills.

#### Scenario: Mermaid output
- **WHEN** user runs `corgispec graph`
- **THEN** output is a valid Mermaid flowchart showing skill dependencies

#### Scenario: DOT output
- **WHEN** user runs `corgispec graph --format dot`
- **THEN** output is valid Graphviz DOT notation

#### Scenario: Filter by tier
- **WHEN** user runs `corgispec graph --tier compound`
- **THEN** output only includes compound-tier skills and their dependencies
