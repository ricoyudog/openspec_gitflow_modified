## ADDED Requirements

### Requirement: Propose command generates instructions
The system SHALL provide a `corgispec propose <name>` command that outputs enriched instructions for AI assistants to create proposal artifacts.

#### Scenario: Propose new change
- **WHEN** user runs `corgispec propose my-feature`
- **THEN** the CLI creates `openspec/changes/my-feature/` directory and outputs proposal creation instructions to stdout

#### Scenario: Propose existing change
- **WHEN** user runs `corgispec propose my-feature` and the change directory already exists
- **THEN** the CLI reuses the existing directory and outputs instructions for remaining artifacts

### Requirement: Apply command generates task implementation instructions
The system SHALL provide a `corgispec apply <name>` command that outputs instructions for implementing the next task group.

#### Scenario: Apply with ready tasks
- **WHEN** user runs `corgispec apply my-feature` and tasks.md exists with pending task groups
- **THEN** the CLI outputs instructions for the next unstarted task group

#### Scenario: Apply with no pending tasks
- **WHEN** user runs `corgispec apply my-feature` and all task groups are complete
- **THEN** the CLI prints "All task groups complete. Run `corgispec review` next." and exits

### Requirement: Review command generates review instructions
The system SHALL provide a `corgispec review <name>` command that outputs instructions for reviewing completed task group work.

#### Scenario: Review after apply
- **WHEN** user runs `corgispec review my-feature` and implementation is complete
- **THEN** the CLI outputs review checklist instructions referencing specs and design decisions

### Requirement: Archive command generates archive instructions
The system SHALL provide a `corgispec archive <name>` command that outputs instructions for archiving a completed change.

#### Scenario: Archive complete change
- **WHEN** user runs `corgispec archive my-feature` and all task groups are reviewed
- **THEN** the CLI outputs instructions to merge delta specs into main specs and move the change to archive

#### Scenario: Archive incomplete change
- **WHEN** user runs `corgispec archive my-feature` and tasks remain incomplete
- **THEN** the CLI prints "Change not ready for archive: N tasks remaining" and exits with code 1

### Requirement: Status command shows artifact completion
The system SHALL provide a `corgispec status [name]` command that displays the completion state of a change's artifacts.

#### Scenario: Status with JSON output
- **WHEN** user runs `corgispec status my-feature --json`
- **THEN** output is valid JSON matching the structure: `{ changeName, schemaName, isComplete, applyRequires, artifacts[] }`

#### Scenario: Status human-readable
- **WHEN** user runs `corgispec status my-feature`
- **THEN** output shows each artifact with a status indicator (done/ready/blocked)

#### Scenario: Status without name
- **WHEN** user runs `corgispec status` with no name and only one change exists
- **THEN** the CLI auto-selects the single change

### Requirement: List changes
The system SHALL provide a `corgispec list` (default, no `--skills` flag) that shows active changes.

#### Scenario: List changes
- **WHEN** user runs `corgispec list`
- **THEN** output shows each change name, completion percentage, and last modified date

#### Scenario: List changes JSON
- **WHEN** user runs `corgispec list --json`
- **THEN** output is valid JSON array of change objects

### Requirement: Instructions command outputs enriched artifact instructions
The system SHALL provide a `corgispec instructions <artifact-id> --change <name>` that outputs template + instruction + context as JSON.

#### Scenario: Instructions JSON output
- **WHEN** user runs `corgispec instructions proposal --change my-feature --json`
- **THEN** output is valid JSON with fields: `changeName`, `artifactId`, `template`, `instruction`, `outputPath`, `dependencies`

#### Scenario: Instructions for blocked artifact
- **WHEN** user runs `corgispec instructions tasks --change my-feature` and tasks has unmet dependencies
- **THEN** the CLI prints "Artifact 'tasks' is blocked. Missing: design, specs" and exits with code 1
