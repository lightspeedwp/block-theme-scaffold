---
name: "Folder Structure and Organization"
description: "Complete reference for the block-theme-scaffold folder structure and organization conventions"
applyTo: "**"
---

# Folder Structure Instructions

## Overview

This document provides a comprehensive reference for the block-theme-scaffold project's folder structure, naming conventions, and organization principles.

## Root Directory Structure

```
block-theme-scaffold/
├── .github/                    # GitHub and AI configuration
│   ├── agents/                # AI agent specifications
│   ├── instructions/          # AI agent instructions
│   ├── projects/              # Project management documents
│   ├── prompts/               # AI prompt templates
│   ├── reports/               # Generated reports (gitignored)
│   ├── schemas/               # JSON schemas for validation
│   └── workflows/             # GitHub Actions workflows
├── bin/                       # Executable scripts
├── build/                     # Compiled/built theme assets (gitignored)
├── docs/                      # Project documentation
├── inc/                       # PHP includes and utilities
├── languages/                 # Translation files
├── logs/                      # Log files (gitignored)
├── node_modules/              # NPM dependencies (gitignored)
├── parts/                     # Template parts
├── patterns/                  # Block patterns
├── scripts/                   # Build and automation scripts
│   ├── agents/               # Agent implementation scripts
│   ├── lib/                  # Shared libraries
│   ├── utils/                # Utility functions
│   └── validation/           # Validation scripts
├── src/                       # Source files (pre-build)
│   ├── css/                  # Source CSS/SCSS
│   └── js/                   # Source JavaScript
├── styles/                    # Block editor styles
├── templates/                 # Block templates
├── tests/                     # Test files
│   ├── js/                   # JavaScript tests
│   ├── php/                  # PHP tests
│   └── e2e/                  # End-to-end tests
├── tmp/                       # Temporary files (gitignored)
├── vendor/                    # Composer dependencies (gitignored)
├── .gitignore                 # Git ignore rules
├── .distignore                # Distribution ignore rules
├── CHANGELOG.md               # Version history
├── composer.json              # PHP dependencies
├── functions.php              # Theme functions
├── package.json               # NPM dependencies and scripts
├── README.md                  # Project overview
├── style.css                  # Theme stylesheet and metadata
├── theme.json                 # Theme configuration
└── VERSION                    # Current version number
```

## Directory Purposes

### .github/ - GitHub and AI Configuration

Contains all GitHub-specific and AI agent configuration files.

#### .github/agents/
- **Purpose:** AI agent specification documents
- **Naming:** `[agent-name].agent.md`
- **Contents:** Agent behavior, capabilities, and constraints
- **Mustache:** Contains `{{variables}}` in scaffold, replaced in generated themes

**Files:**
- `generate-theme.agent.md` - Theme generator agent spec
- `release.agent.md` - Release preparation agent (templated)
- `release-scaffold.agent.md` - Scaffold release agent (deleted in generated themes)

#### .github/instructions/
- **Purpose:** Detailed instructions for AI agents
- **Naming:** `[topic].instructions.md`
- **Contents:** How-to guides for specific tasks
- **Mustache:** May contain `{{variables}}` where appropriate

**Key Files:**
- `reporting.instructions.md` - Report generation and storage
- `release.instructions.md` - Release process (templated)
- `generate-theme.instructions.md` - Theme generation guide
- `folder-structure.instructions.md` - This document
- `task-planner.instructions.md` - Planning and project management
- `task-researcher.instructions.md` - Research documentation
- `temp-files.instructions.md` - Temporary file handling

#### .github/projects/
- **Purpose:** Project management and planning
- **Structure:**
  ```
  projects/
  ├── plans/         # Implementation plans (YYYY-MM-DD-*.md)
  ├── active/        # Active projects (project-slug.md)
  └── completed/     # Completed projects (YYYY-MM-DD-project-slug.md)
  ```

#### .github/prompts/
- **Purpose:** AI prompt templates
- **Naming:** `[prompt-name].prompt.md`
- **Contents:** Structured prompts for AI assistants
- **Mustache:** Contains `{{variables}}` in scaffold

#### .github/reports/
- **Purpose:** Generated reports and analysis outputs
- **Structure:**
  ```
  reports/
  ├── coverage/      # Code coverage
  ├── analysis/      # Code analysis
  ├── validation/    # Linting/validation
  ├── performance/   # Performance metrics
  ├── agents/        # Agent execution reports
  ├── projects/      # Project progress reports
  ├── research/      # Research findings
  ├── comparison/    # Before/after comparisons
  └── archived/      # Old reports
  ```
- **Naming:** `YYYY-MM-DD-description.{ext}`
- **Gitignored:** Yes (except README and .gitkeep)

#### .github/schemas/
- **Purpose:** JSON schemas for validation
- **Naming:** `[schema-name].schema.json`

**Files:**
- `theme-config.schema.json` - Theme configuration schema
- `frontmatter.schema.json` - Agent frontmatter schema
- `mustache-variables-registry.schema.json` - Mustache variable registry

### scripts/ - Build and Automation Scripts

#### scripts/agents/
- **Purpose:** Agent implementation scripts
- **Naming:** `[agent-name].agent.js`

#### scripts/lib/
- **Purpose:** Shared libraries and utilities
- **Naming:** Descriptive names with action prefix

**Files:**
- `define-config-schema.js` - Theme configuration schema definition

#### scripts/validation/
- **Purpose:** Validation scripts
- **Naming:** `validate-[what].js` or `audit-[what].js`

**Files:**
- `validate-mustache-schema.js` - Mustache variable validation
- `validate-agent-frontmatter.js` - Agent frontmatter validation
- `validate-config-schema.js` - Configuration validation wrapper
- `audit-frontmatter.js` - Frontmatter analysis report generator

### docs/ - Project Documentation

User-facing documentation and guides.

**Naming:** `[TOPIC_NAME].md` (uppercase with underscores)

**Files:**
- `GENERATE_THEME.md` - Theme generation guide
- `RELEASE_PROCESS.md` - Release process (templated)
- `RELEASE_PROCESS_SCAFFOLD.md` - Scaffold release (deleted in generated themes)
- `FRONTMATTER_SCHEMA.md` - Frontmatter schema reference
- `DEVELOPMENT.md` - Development workflow
- `TESTING.md` - Testing guide

### logs/ - Log Files

Runtime logs from scripts and agents.

**Structure:**
```
logs/
├── agents/         # Agent execution logs
├── build/          # Build process logs
├── generation/     # Theme generation logs
└── test/           # Test execution logs
```

**Naming:** `YYYY-MM-DD-[process-name].log`
**Gitignored:** Yes (except .gitkeep)

### tmp/ - Temporary Files

**Purpose:** Intermediate files only
**Lifetime:** Created and deleted within process
**Gitignored:** Yes
**Usage:** Never for final outputs

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Documentation | `UPPERCASE_WITH_UNDERSCORES.md` | `GENERATE_THEME.md` |
| Instructions | `kebab-case.instructions.md` | `release.instructions.md` |
| Agents | `kebab-case.agent.md/js` | `generate-theme.agent.js` |
| Schemas | `kebab-case.schema.json` | `theme-config.schema.json` |
| Reports | `YYYY-MM-DD-kebab-case.ext` | `2025-12-17-coverage.html` |
| Logs | `YYYY-MM-DD-kebab-case.log` | `2025-12-17-build.log` |
| Plans | `YYYY-MM-DD-kebab-case.md` | `2025-12-17-feature-plan.md` |
| Scripts | `action-subject.js` | `validate-mustache-schema.js` |

### Script Naming Actions

- `validate-*` - Validation scripts
- `audit-*` - Analysis/reporting scripts
- `define-*` - Schema/configuration definitions
- `test-*` - Test scripts

### Directories

| Type | Convention | Example |
|------|------------|---------|
| Standard | `kebab-case` | `.github/instructions/` |
| Namespaced | `category/subcategory/` | `.github/reports/coverage/js/` |

## Gitignore Rules

### Always Ignored

```gitignore
# Dependencies
node_modules/
vendor/

# Build outputs
build/
dist/

# Temporary files
tmp/
.lint-temp/

# Logs
logs/
*.log

# Reports
.github/reports/*
!.github/reports/README.md
!.github/reports/.gitkeep

# Generated themes
generated-theme/
output-theme/
```

### Always Tracked

- Source files (`src/`)
- Configuration files
- Documentation (`docs/`)
- Instructions (`.github/instructions/`)
- Schemas (`.github/schemas/`)
- Template files with `{{mustache}}` variables

## Mustache Variable Flow

### In Scaffold Repository

Files containing mustache variables:
- `style.css`
- `functions.php`
- `theme.json`
- `inc/*.php`
- `.github/agents/release.agent.md`
- `.github/instructions/release.instructions.md`
- `docs/RELEASE_PROCESS.md`

### After Generation

All `{{variables}}` replaced except in:
- Documentation examples (intentional)
- Archived/deleted scaffold-specific files

## Workflow Integration

### Build Process
```
src/ → (webpack/sass) → build/ → (package) → dist/
```

### Generation Process
```
scaffold/ → (generate-theme.js) → output-theme/
```

### Testing Process
```
src/ + tests/ → (jest/phpunit/playwright) → .github/reports/coverage/
```

## Validation

### Structure Checks

```bash
# Verify key directories exist
test -d .github/agents && echo "✓ agents/"
test -d .github/instructions && echo "✓ instructions/"
test -d .github/projects/plans && echo "✓ projects/plans/"
test -d .github/reports && echo "✓ reports/"
test -d scripts/validation && echo "✓ scripts/validation/"

# Verify naming conventions
find .github/reports -name "*.json" 2>/dev/null | \
  grep -E "^.*[0-9]{4}-[0-9]{2}-[0-9]{2}-.*\.json$"

# Verify gitignore
grep -q "node_modules" .gitignore && echo "✓ node_modules ignored"
grep -q "tmp/" .gitignore && echo "✓ tmp/ ignored"
grep -q "logs/" .gitignore && echo "✓ logs/ ignored"
```

## Related Documentation

- `.github/instructions/reporting.instructions.md` - Report storage rules
- `.github/instructions/temp-files.instructions.md` - Temporary file management
- `.github/instructions/task-planner.instructions.md` - Project organization
- `.github/instructions/task-researcher.instructions.md` - Research documentation
- `docs/GENERATE_THEME.md` - Theme generation details
