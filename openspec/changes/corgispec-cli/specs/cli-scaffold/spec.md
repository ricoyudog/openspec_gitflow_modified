## ADDED Requirements

### Requirement: Global npm binary
The system SHALL expose a `corgispec` binary when installed globally via `npm install -g corgispec`.

#### Scenario: Binary available after install
- **WHEN** user runs `npm install -g corgispec`
- **THEN** the `corgispec` command is available in PATH

#### Scenario: Version output
- **WHEN** user runs `corgispec --version`
- **THEN** the CLI prints the package version from package.json and exits with code 0

### Requirement: Help output
The system SHALL display available commands and options when invoked with `--help` or no arguments.

#### Scenario: Top-level help
- **WHEN** user runs `corgispec --help`
- **THEN** output lists all available commands with brief descriptions

#### Scenario: Command-level help
- **WHEN** user runs `corgispec <command> --help`
- **THEN** output shows command usage, options, and examples

### Requirement: No-color mode
The system SHALL support a `--no-color` flag that disables ANSI color output.

#### Scenario: Color disabled
- **WHEN** user runs `corgispec --no-color list`
- **THEN** output contains no ANSI escape sequences

#### Scenario: NO_COLOR environment variable
- **WHEN** environment variable `NO_COLOR` is set
- **THEN** the CLI disables color output regardless of `--no-color` flag

### Requirement: Exit codes
The system SHALL exit with code 0 on success and non-zero on failure for all commands.

#### Scenario: Successful command
- **WHEN** any command completes without error
- **THEN** exit code is 0

#### Scenario: Failed command
- **WHEN** any command encounters an error
- **THEN** exit code is 1 and error message is printed to stderr

### Requirement: TypeScript ESM package
The system SHALL be built from TypeScript source and distributed as ESM JavaScript.

#### Scenario: Package type
- **WHEN** package.json is inspected
- **THEN** `"type": "module"` is set and `"bin"` points to compiled JS entry

#### Scenario: Node version guard
- **WHEN** user runs `corgispec` on Node < 18
- **THEN** the CLI prints "Node.js >= 18 required" and exits with code 1
