---
title: File Organization Guide
description: Comprehensive guide to file locations in the block-theme-scaffold repository
category: Documentation
type: Reference
audience: Developers, AI Agents, Contributors
date: 2025-12-09
---

## File Organization Guide

This document explains where different types of files are stored in the block-theme-scaffold repository and the rationale for each location.

## Core Policy: Documentation Location

**🔑 Key Rule:** All permanent user-facing documentation must be stored in the `docs/` folder, not in `.github/` subdirectories.

- `.github/` is for infrastructure, AI tool configuration, and transient work (projects, reports)
- `docs/` is for permanent documentation that developers and contributors read regularly
- `tmp/` and `logs/` do NOT include README.md files

This separation ensures:

- Clear distinction between infrastructure/tooling and user documentation
- Permanent docs are discoverable and grouped together
- AI tool configuration stays with GitHub infrastructure
- Easier navigation for developers and AI agents
- Reduces cognitive overhead

### Directory Structure Overview

```bash
block-theme-scaffold/
├── .github/
│   ├── schemas/              # JSON schemas & configuration templates
│   ├── projects/             # Copilot projects in progress
│   ├── reports/              # Copilot reporting on task outcomes
│   ├── instructions/         # AI agent & coding standards
│   ├── agents/               # Agent specifications and code
│   ├── workflows/            # GitHub Actions CI/CD
│   ├── prompts/              # Prompt templates for AI generation
│   ├── copilot-tasks.md      # Copilot task definitions
│   └── custom-instructions.md # Custom AI instructions
├── docs/                     # ⭐ ALL permanent user-facing documentation here
│   ├── GOVERNANCE-START-HERE.md  # Navigation hub
│   ├── GOVERNANCE.md         # Core policies & standards
│   ├── ARCHITECTURE.md       # Project structure
│   ├── FILE_ORGANIZATION.md  # This file
│   └── [other comprehensive guides]/
├── src/                      # Source code (JS, CSS)
├── inc/                      # PHP includes
├── tests/                    # Test files
├── bin/                      # Build & utility scripts
└── [other theme folders]/
```

## File Categories & Locations

### 1. JSON Schemas & Configuration Templates

**Location:** `.github/schemas/`

**Purpose:** Store JSON schema definitions and example configurations that are used for code generation or validation.

**Files:**

- `theme-config.schema.json` - JSON Schema defining all valid configuration options for theme generation
- `examples/theme-config.example.json` - Pre-filled example configuration ready to customize

**Rationale:**

- Schemas should be in `.github/` since they're infrastructure/tooling related
- Grouped with other configuration files
- Separate from documentation but easily referenced
- Can be referenced by build scripts and generators

**Usage:**

```bash
# Theme generation with config
node scripts/generate-theme.js --config .github/schemas/examples/theme-config.example.json

# Validate config against schema
jq -f .github/schemas/theme-config.schema.json my-config.json
```

### 2. Copilot Projects (In Progress)

**Location:** `.github/projects/`

**Purpose:** Track AI/Copilot projects that are currently in development or being tracked.

**Files:**

- `context-reduction.md` - Comprehensive plan to reduce context token bloat in the repository

**Rationale:**

- Separate from completed reports
- Indicates active work or ongoing initiatives
- Easy to find current projects
- Can be moved to reports once completed

**Contents:**

- Project goals and objectives
- Task breakdown with status tracking
- Phase-based organization
- Expected outcomes and token savings

**Status Tracking:**

Use these indicators in files:

- ✅ Complete
- 🔄 In Progress
- ⏳ Pending
- ❌ Blocked

### 3. Copilot Reports (Completed)

**Location:** `.github/reports/`

**Purpose:** Store reports on task completion and analysis outcomes from Copilot work.

**Files:**

- `theme-generation-updates.md` - Comprehensive report on theme generation system improvements (spacing scale, monospace removal, JSON config system, etc.)
- `wordpress-packages-validation.md` - Complete validation report of WordPress packages used in the theme

**Rationale:**

- Separates completed work from in-progress projects
- Provides historical record of improvements
- Can be referenced for future similar work
- Organized by date and topic

**Contents:**

Each report should include:

- Objective/purpose
- Changes implemented
- Files modified
- Validation results
- Next steps (if applicable)

### 4. Permanent Documentation

**Location:** `docs/`

**Purpose:** Store comprehensive, long-term documentation for the project.

**Key Files:**

- `GOVERNANCE-START-HERE.md` - Navigation hub for all governance and standards documentation
- `GOVERNANCE.md` - Core policies, standards, and decision-making guidelines
- `ARCHITECTURE.md` - Project structure, folder conventions, and design principles
- `DEVELOPMENT.md` - Development workflow and quick start guide
- `TESTING.md` - Testing strategy, frameworks, and patterns
- `LINTING.md` - Code quality standards and linting configuration
- `PERFORMANCE.md` - Performance optimization and monitoring
- `WORDPRESS-PACKAGES.md` - WordPress packages documentation

**Rationale:**

- Permanent reference material
- Read by developers and contributors regularly
- Versioned with the codebase
- Referenced in CONTRIBUTING.md and README.md
- Not time-sensitive

### 5. Instructions & Standards

**Location:** `.github/instructions/`

**Purpose:** Store coding standards, best practices, and AI agent instructions.

**File Categories:**

**Core Standards:**

- `block-theme-development.instructions.md` - Comprehensive block theme development guide
- `wpcs-php.instructions.md` - WordPress PHP coding standards
- `javascript.instructions.md` - JavaScript and JSDoc standards
- `wpcs-css.instructions.md` - CSS/SCSS coding standards
- `html-markup.instructions.md` - HTML markup standards
- `accessibility.instructions.md` - WCAG 2.2 accessibility standards

**AI & Agent Guidance:**

- `copilot-ai-agent.instructions.md` - Custom instructions for Copilot
- `security-nonce.instructions.md` - WordPress nonce implementation patterns
- `naming-conventions.instructions.md` - File and code naming standards
- `reporting.instructions.md` - Report generation guidelines

**Theme Configuration:**

- `theme-json.instructions.md` - theme.json configuration standards
- `generate-theme.instructions.md` - Theme generation process guidance

**Rationale:**

- Instructions apply to the current codebase
- Frequently updated as standards evolve
- Referenced by AI agents and developers
- Organized by topic for easy navigation

### 6. Agent Specifications

**Location:** `.github/agents/`

**Purpose:** Store agent definitions, specifications, and implementation files.

**Files:**

- `agent.md` - Main agent index and directory
- `gemini.agent.md` - Gemini agent specifications
- `development-assistant.agent.md` - Development assistant specifications
- `block-theme-build.agent.js` - Block theme build agent implementation

**Rationale:**

- Central location for all agent definitions
- Separate from instructions (which are for humans/agents to follow)
- Includes both specs (`.md`) and implementations (`.js`)
- Easy for agents to reference themselves

### 7. Prompt Templates

**Location:** `.github/prompts/`

**Purpose:** Store reusable prompt templates for AI generation tasks.

**Files:**

- `prompts.md` - Index and quick reference for all prompts
- `generate-theme.prompt.md` - Comprehensive prompt for theme generation
- [other prompt files as needed]

**Rationale:**

- Centralized prompt library
- Improves consistency across AI-generated content
- Easy to version and update
- Referenced by build processes

### 8. Build & Utility Scripts

**Location:** `bin/`

**Purpose:** Store scripts for building, generating, and maintaining the project.

**Files:**

- `generate-theme.js` - Main theme generation script
- `build.js` - Build process script
- `lint-dry-run.js` - Linting validation for scaffold mode
- `test-placeholders.js` - Placeholder validation
- `install-wp-tests.sh` - WordPress test setup

**Rationale:**

- Related to build infrastructure
- Executable scripts for developers
- Part of standard WordPress theme structure

## File Movement Guidelines

When deciding where to store a new file:

### Ask these questions

1. **Is it a schema or configuration template?**
   → `.github/schemas/`

2. **Is it an AI/Copilot project in progress?**
   → `.github/projects/`

3. **Is it a completed report of work done?**
   → `.github/reports/`

4. **Is it permanent project documentation?**
   → `docs/`

5. **Is it an instruction or standard?**
   → `.github/instructions/`

6. **Is it an agent specification or implementation?**
   → `.github/agents/`

7. **Is it a prompt template?**
   → `.github/prompts/`

8. **Is it a build or utility script?**
   → `bin/`

## Examples

### Example 1: New Spacing Scale Configuration

**File:** `spacing-tokens.json`

**Decision Process:**

- Is it a schema? Yes, it defines valid tokens
- Should go in: `.github/schemas/spacing-tokens.json` ✅

### Example 2: Accessibility Audit Results

**File:** `a11y-audit-2025-12-09.md`

**Decision Process:**

- Is it a completed report? Yes, audit results
- Should go in: `.github/reports/accessibility-audit-2025-12-09.md` ✅

### Example 3: Keyboard Navigation Best Practices

**File:** `keyboard-navigation.md`

**Decision Process:**

- Is it permanent documentation? Yes, best practices are long-term
- Should go in: `docs/keyboard-navigation.md` ✅

### Example 4: AI Context Reduction Sprint

**File:** `context-sprint-plan.md`

**Decision Process:**

- Is it an in-progress project? Yes, sprint is ongoing
- Should go in: `.github/projects/context-sprint-plan.md` ✅

## Cross-References

When creating files, reference related files:

**In `.github/schemas/theme-config.schema.json`:**

```markdown
See also:
- docs/ARCHITECTURE.md - Project structure
- scripts/generate-theme.js - Generation script
- .github/instructions/generate-theme.instructions.md - Usage guide
```

**In `.github/reports/theme-generation-updates.md`:**

```markdown
Related Files:
- .github/schemas/theme-config.schema.json - Generated schema
- .github/projects/context-reduction.md - Related project
- docs/THEME_STRUCTURE.md - Implementation details
```

**In `docs/GOVERNANCE-START-HERE.md`:**

```markdown
Essential Reading:
- docs/GOVERNANCE.md - Core policies
- docs/ARCHITECTURE.md - Project structure
- .github/instructions/ - All coding standards
```

## Workflow Examples

### Creating a New Theme

```bash
1. Copy schema to reference
   .github/schemas/theme-config.schema.json

2. Create your config
   cp .github/schemas/examples/theme-config.example.json my-theme-config.json

3. Run generation script
   node scripts/generate-theme.js --config my-theme-config.json

4. Follow standards from instructions
   .github/instructions/block-theme-development.instructions.md
```

### Starting a New Project

```bash
1. Create project tracking document
   .github/projects/my-project-name.md

2. Reference project checklist
   Status: ⏳ Pending
   Tasks: [List with ✅/🔄/⏳/❌]

3. Move to reports when complete
   .github/reports/my-project-name.md
```

## Maintenance

### Quarterly Review

- Check `.github/projects/` - Move completed projects to reports
- Archive old reports (>6 months)
- Update `.github/schemas/` if theme structure changes
- Review `.github/instructions/` for accuracy

### Before Releases

- Validate all schemas work correctly
- Ensure all instructions are up-to-date
- Generate completion report for major changes
- Update documentation in `docs/`

---

## Quick Reference Table

| Type | Location | Examples | Audience |
|------|----------|----------|----------|
| Schema | `.github/schemas/` | theme-config.schema.json | Developers, Scripts |
| Config Template | `.github/schemas/examples/` | theme-config.example.json | Developers, AI |
| In-Progress Project | `.github/projects/` | context-reduction.md | Copilot, Developers |
| Completed Report | `.github/reports/` | theme-generation-updates.md | Copilot, Developers |
| Permanent Docs | `docs/` | GOVERNANCE.md, ARCHITECTURE.md | Everyone |
| Instructions | `.github/instructions/` | block-theme-development.instructions.md | Developers, AI Agents |
| Agent Specs | `.github/agents/` | agent.md, gemini.agent.md | AI Agents, Developers |
| Prompts | `.github/prompts/` | generate-theme.prompt.md | AI Agents, Scripts |
| Scripts | `bin/` | generate-theme.js, build.js | Developers, CI/CD |

---

**Last Updated:** December 9, 2025
**Version:** 1.0.0
