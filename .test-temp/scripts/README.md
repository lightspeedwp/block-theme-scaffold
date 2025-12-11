---
title: Build & Automation Scripts
description: Utility scripts for theme building, generation, testing, and linting
category: Project
type: Index
audience: Developers, Build Tools
date: 2025-12-10
---

## Build & Automation Scripts

This directory contains utility scripts for building, generating, testing, and automating theme-related tasks.

## Architecture

The scripts are organized into functional categories:

- **`lib/`** - Shared modules and utilities
  - `config-schema.js` - Shared configuration schema and validators
  - `mode-detector.js` - Mode detection and routing for generate-theme.js
- **Generators** - Theme generation scripts
  - `generate-theme.agent.js` - Interactive wizard
  - `generate-theme.js` - Core generation engine
- **Dry-Run Tools** - Test mustache variables without full generation
  - `lint-dry-run.js` - Run linters with test placeholders
  - `test-dry-run.js` - Run tests with test placeholders
- **Utilities** - Supporting tools
  - `block-theme-build.agent.js` - Build and validation agent
  - `audit-frontmatter.js` - Documentation metadata validation
  - `test-placeholders.js` - Centralized test placeholder values

## Core Generation Scripts

### `generate-theme.js`

The core theme generation engine that:

- Reads configuration (CLI args, JSON file, or stdin)
- Validates all input
- Replaces mustache variables with provided values
- Copies and generates new theme from scaffold

**Modes:**

- **CLI Mode:** Direct arguments (fastest for CI/automation)
- **JSON Config:** Configuration file (best for complex themes)
- **JSON Stdin:** Piped JSON input (flexible for scripting)
- **Validate:** Validate config without generating
- **Schema:** Output configuration schema

**Usage:**

```bash
# CLI mode
node scripts/generate-theme.js \
  --slug my-theme \
  --name "My Theme" \
  --author "Your Name"

# JSON file
node scripts/generate-theme.js --config theme-config.json

# JSON stdin
echo '{"slug":"test","name":"Test"}' | node scripts/generate-theme.js --json

# Validate only
echo '{"slug":"bad-slug!"}' | node scripts/generate-theme.js --validate

# Show schema
node scripts/generate-theme.js --schema
```

### `generate-theme.agent.js`

Interactive wizard that:

- Guides users through multi-stage configuration
- Collects requirements interactively
- Validates input in real-time
- Calls `generate-theme.js` with final config

**Stages:**

1. **Stage 1:** Core identity (required: slug, name)
2. **Stage 2:** Version info (optional)
3. **Stage 3:** Licensing & repository (optional)

**Usage:**

```bash
# Interactive wizard
node scripts/generate-theme.agent.js

# Programmatic modes
echo '{"slug":"test","name":"Test"}' | node scripts/generate-theme.agent.js --json
node scripts/generate-theme.agent.js --schema
```

**Shared Config Schema:**

Both scripts use `lib/config-schema.js` for:

- Consistent validation rules
- Schema definition and documentation
- Default value application
- Command building

## Dry-Run Tools

For testing and linting scaffold files with mustache variables, use dry-run tools that temporarily replace placeholders.

### `lint-dry-run.js`

Lints scaffold files with test values:

```bash
npm run lint:dry-run

# Or directly:
node scripts/lint-dry-run.js
```

**What it does:**

1. Creates temporary copy of files
2. Replaces mustache variables with test values
3. Runs ESLint, Stylelint, PHPCS
4. Cleans up temporary files
5. Logs results to `logs/lint/`

### `test-dry-run.js`

Runs Jest/PHPUnit with test placeholders:

```bash
npm run test:dry-run        # Jest only
npm run test:dry-run:all    # Jest + PHPUnit
npm run dry-run:all         # Full lint + test

# Or directly:
node scripts/test-dry-run.js jest      # Jest tests
node scripts/test-dry-run.js phpunit   # PHPUnit tests
node scripts/test-dry-run.js all       # Both
```

**What it does:**

1. Creates temporary copy of files
2. Replaces mustache variables with test values
3. Runs test suite in temp directory
4. Cleans up on completion
5. Logs results to `logs/test/`

### `test-placeholders.js`

Manages test placeholder values:

```bash
# List all placeholders
node scripts/test-placeholders.js list

# Get specific value
node scripts/test-placeholders.js get 'block-theme-scaffold'

# Output all as JSON
node scripts/test-placeholders.js json

# Check if in scaffold mode
node scripts/test-placeholders.js check package.json
```

Used by:

- Pre-commit hooks (scaffold mode detection)
- Dry-run tools (variable replacement)
- Test setup and teardown

## Supporting Scripts

### `block-theme-build.agent.js`

Primary build and validation agent:

- Compiles theme assets
- Validates block configuration
- Processes styles
- Runs pre-commit checks

See `.github/agents/block-theme-build.agent.md` for full documentation.

### `audit-frontmatter.js`

Validates documentation metadata:

- Checks all `.md` files have YAML frontmatter
- Validates required fields (title, description, category, type, audience, date)
- Ensures consistent documentation structure

**Usage:**

```bash
node scripts/audit-frontmatter.js [directory]
```

## NPM Scripts

```bash
# Generation
npm run build                 # Full build with block-theme-build agent
npm generate-theme            # Interactive theme generation

# Linting & Testing
npm run lint                  # Run all linters (JS, CSS, PHP)
npm run lint:dry-run          # Lint with test placeholders (scaffold mode)
npm run test                  # Run all tests (JS + PHP)
npm run test:dry-run          # Run Jest with test placeholders
npm run test:dry-run:all      # Run all tests with placeholders
npm run dry-run:all           # Lint + test with placeholders

# Individual linters
npm run lint:js               # ESLint
npm run lint:css              # Stylelint
npm run lint:php              # PHPCS
npm run test:scripts          # Jest (scripts directory)
npm run test:php              # PHPUnit
```

## Shared Modules (`lib/`)

### `lib/config-schema.js`

Exported for shared use:

```javascript
const {
  CONFIG_SCHEMA,         // Full schema definition
  validateValue,         // Validate single field
  validateConfig,        // Validate complete config
  applyDefaults,         // Apply default values
  getStageQuestions,     // Get questions for interactive mode
  buildCommand,          // Build CLI command string
  buildCommandArgs,      // Build just the arguments
} = require('./lib/config-schema');
```

**Usage in Custom Scripts:**

```javascript
const schema = require('./lib/config-schema');

// Validate user input
const errors = schema.validateValue('slug', 'my-theme', schema.CONFIG_SCHEMA.slug);

// Build full config
const config = { slug: 'test', name: 'Test' };
const validated = schema.validateConfig(config);
const withDefaults = schema.applyDefaults(config);

// Generate command
const cmd = schema.buildCommand(withDefaults);
console.log(`Run: ${cmd}`);
```

### `lib/mode-detector.js`

Detects how scripts are being invoked:

```javascript
const detector = require('./lib/mode-detector');

const args = process.argv.slice(2);
const mode = detector.detectMode(args, hasStdin);
// Returns: 'help', 'schema', 'validate', 'json-stdin', 'json-config', or 'cli'
```

## Pre-Commit Hooks

The `.husky/pre-commit` hook intelligently handles both scaffold and generated themes:

**Scaffold Mode** (has mustache variables):

- Runs `npm run lint:dry-run`
- Runs `npm run test:dry-run`
- Validates test placeholders

**Generated Theme Mode** (no variables):

- Runs standard linting
- Runs standard tests
- Runs security audit

Detection is automatic via `test-placeholders.js check`

## Logging

All scripts log to `logs/` directory:

- `logs/lint/` - Lint dry-run logs
- `logs/test/` - Test dry-run logs
- `logs/build/` - Build logs
- `logs/agents/` - Agent execution logs

Format: `YYYY-MM-DD-{operation}.log`

## Examples

### Generate Theme Interactively

```bash
npm run generate-theme
# Or: node scripts/generate-theme.agent.js
```

### Generate Theme from Config File

```bash
cp .github/schemas/examples/theme-config.example.json my-theme.json
# Edit my-theme.json
node scripts/generate-theme.js --config my-theme.json
```

### Validate Scaffold Linting

```bash
npm run lint:dry-run
# Or: node scripts/lint-dry-run.js
```

### Validate Scaffold Tests

```bash
npm run test:dry-run:all
# Or: node scripts/test-dry-run.js all
```

### Get Configuration Schema

```bash
node scripts/generate-theme.js --schema | jq '.' | less
```

## Related Documentation

- [docs/GENERATE_THEME.md](../docs/GENERATE_THEME.md) - Theme generation workflow
- [docs/BUILD_PROCESS.md](../docs/BUILD_PROCESS.md) - Build and testing process
- [.github/agents/](../.github/agents/) - Agent specifications
- [.github/instructions/](../.github/instructions/) - Development instructions
