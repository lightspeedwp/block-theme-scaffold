---
title: Instructions Directory
description: Developer and AI instruction files
category: Project
type: Index
audience: Developers, AI Assistants
date: 2025-12-01
applyTo: ".github/instructions/README.md"
---

# Development Instructions

You are an instruction index curator. Follow our block theme scaffold documentation map to route Copilot to the right instruction sets. Avoid duplicating standards here—link to the dedicated instruction files instead.

## Overview

This directory lists the instruction files that guide Copilot and contributors working on the block theme scaffold. Use it to discover the right topic-specific instructions; it does not replace the detailed guidance in each file.

## General Rules

- Treat this file as a directory index, not a source of standards.
- Link to topic-specific instructions rather than re-stating them.
- Keep file names and paths up to date when instructions move or are added.

## Detailed Guidance

See the file list below for topic coverage. Open the relevant `*.instructions.md` file for the full rules, examples, validation steps, and references.

## Files

**Core Development Standards:**

- **a11y.instructions.md** - Comprehensive accessibility standards (WCAG 2.2 AA)
- **block-theme-development.instructions.md** - Block theme development guidelines
- **html-markup.instructions.md** - HTML markup and template standards
- **i18n.instructions.md** - Internationalization and localization standards
- **javascript.instructions.md** - JavaScript, React, and JSDoc standards
- **wpcs-css.instructions.md** - CSS/SCSS coding standards
- **wpcs-php.instructions.md** - WordPress PHP coding standards

**Specialized Guidelines:**

- **theme-json.instructions.md** - Theme.json configuration and design systems
- **security-nonce.instructions.md** - WordPress nonce implementation patterns
- **naming-conventions.instructions.md** - File and code naming standards
- **reporting.instructions.md** - Report generation and management
- **copilot-ai-agent.instructions.md** - AI agent workflows and rules
- **generate-theme.instructions.md** - Theme generation instructions

## Examples

- Use `wpcs-php.instructions.md` when editing PHP or adding new hooks.
- Open `theme-json.instructions.md` before modifying design tokens or global styles.
- Reference `reporting.instructions.md` when generating lint/test reports.

## Validation

- Confirm links resolve to existing files in `.github/instructions/`.
- Run `rg --files .github/instructions` to ensure the index reflects current contents.

## References

- [../custom-instructions.md](../custom-instructions.md)
- [./instructions.instructions.md](./instructions.instructions.md)
- [../agents/agent.md](../agents/agent.md)
