---
title: Instructions Index
description: Master reference for repository-specific guidance and dynamic discovery of instruction files.
category: Project
type: Index
audience: Developers, AI Assistants
date: 2025-12-08
applyTo: ".github/instructions/_index.instructions.md"
---

# Block Theme Scaffold Instruction Map

This file guides contributors and agents to the most relevant rules in this directory. The index leans on a dynamic discovery pattern (`*.instructions.md`) so that every properly named instruction file is found automatically; keep the glob in mind when adding new guidance, and avoid redundant static lists that can drift out of sync.

## Priority Guidance

Highlight the instructions you find yourself referencing the most in this repository:

- `block-theme-development.instructions.md` – block-theme-first patterns, theme scaffolding, and template best practices.
- `theme-json.instructions.md` – design tokens, global styles, and theme configuration via `theme.json`.
- `naming-conventions.instructions.md` – how agents and Copilot should behave, plus file and code naming standards.
- `generate-theme.instructions.md` – rules for regenerating the scaffold while preserving Mustache placeholders.
- `wpcs-php.instructions.md`, `wpcs-css.instructions.md`, and `javascript.instructions.md` – WordPress coding standards for PHP, CSS/SCSS, and JS.
- `a11y.instructions.md` – accessibility guardrails for block themes.
- `reporting.instructions.md` and `security-nonce.instructions.md` – reporting conventions and nonce handling workstreams.

## Dynamic Discovery (`*.instructions.md`)

This directory relies on the glob `*.instructions.md` to surface every instruction file, keeping the index up to date without manual edits. New instruction files that follow this naming convention are automatically collected, so you only need to add them once. When reorganizing or renaming files, re-run `rg --files .github/instructions '*.instructions.md'` to confirm the pattern still matches every intended document.

To keep everything tidy, avoid `## References` or `## See Also` sections in the individual instruction files and let the glob-driven index do the cross-linking. When you add or touch any instruction file, run `npm run check:markdown-references` and `scripts/clean-github-references.js` to ensure the directory stays free of forbidden reference headings while honoring the dynamic index pattern.
