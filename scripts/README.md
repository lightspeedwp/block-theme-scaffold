---
title: Build & Automation Scripts
description: Utility scripts for theme building, generation, and automation
category: Project
type: Index
audience: Developers, Build Tools
date: 2025-12-09
---

## Build & Automation Scripts

This directory contains utility scripts for building, generating, and automating theme-related tasks.

## Scripts

### `agent-script.js`

Orchestrates AI agent execution and coordination. Used by the build system to run agents for theme generation and validation.

### `audit-frontmatter.js`

Audits frontmatter metadata in documentation files. Ensures all markdown files have proper YAML frontmatter with required fields (title, description, category, type, audience, date).

### `block-theme-build.agent.js`

The primary build agent for the block theme. Handles:

- Theme compilation and validation
- Block registration
- Style processing
- Configuration generation
- Pre-commit linting validation in scaffold mode

See [.github/agents/block-theme-build.agent.md](.github/agents/block-theme-build.agent.md) for full documentation.

### `scaffold-generator.agent.js`

Generates new block theme instances from the scaffold template. Used to create production themes from this scaffold with mustache variable replacement.

**Usage:** Run as part of the generation workflow to:

- Replace template variables ({{theme_slug}}, {{version}}, etc.)
- Generate theme configuration
- Create custom block and pattern files

## Running Scripts

Scripts are typically invoked through npm:

```bash
npm run build        # Uses block-theme-build.agent.js
npm run generate     # Uses scaffold-generator.agent.js
npm run lint:dry-run # Uses lint-dry-run.js (in bin/)
```

For direct execution:

```bash
node scripts/script-name.js [options]
```

## Related

- [bin/](../bin/) - Main build and utility scripts
- [.github/agents/](.github/agents/) - Agent specifications and documentation
- [docs/BUILD_PROCESS.md](../docs/BUILD_PROCESS.md) - Build workflow documentation
