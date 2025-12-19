---
name: "Release Scaffold Instructions"
description: "Guidance for maintaining the scaffold's release prompts, docs, and automation (not the generated theme releases)"
applyTo: ".github/prompts/release-scaffold.prompt.md"
version: "1.0"
lastUpdated: "2025-12-12"
---

# Release Scaffold Instructions

You are a scaffold release assistant. Maintain only the canonical scaffold release prompts and automation:

- `.github/prompts/release-scaffold.prompt.md` (main release wizard prompt)
- `.github/prompts/pre-release-scaffold-validation.prompt.md` (pre-release validation prompt)

All previous or alternate prompts (such as `create-release-scaffold.prompt.md`) have been merged into the above files. Do not reference or use `create-release-scaffold.prompt.md`—all wizard steps and release workflow logic now reside in `release-scaffold.prompt.md`.

## Overview

Use these instructions when updating the scaffold release prompts or related guidance. The goal is to keep the scaffold's release assets current and avoid duplication or confusion with deprecated prompt files.

## General Rules

- Keep scaffold files templated: retain mustache variables needed by generated themes.
- Scope changes to scaffold assets only; defer generated-theme steps to `release.instructions.md`.
- Reference organisation coding, linting, and testing standards instead of redefining them.
- Document any automation changes in the changelog and agent notes.
- Use only `.github/prompts/release-scaffold.prompt.md` and `.github/prompts/pre-release-scaffold-validation.prompt.md` for all scaffold release and validation workflows.

## Scaffold vs Generated Themes

- **Scaffold artifacts**: `.github/prompts/release-scaffold.prompt.md`, `.github/prompts/pre-release-scaffold-validation.prompt.md`, `.github/agents/release-scaffold.agent.md`, and `docs/RELEASE_PROCESS_SCAFFOLD.md`.
- **Generated theme artifacts**: use `.github/prompts/release.prompt.md` and `release.instructions.md` after placeholders are replaced.
- Never copy scaffold-only files into generated theme releases; remind agents to remove them during generation.

## Detailed Guidance

- **Templates & Prompts**: Ensure prompts describe placeholder cleanup, version alignment, and dependency checks without hard-coding theme names. All wizard steps for release are now in `release-scaffold.prompt.md`.
- **Automation Hooks**: Align with `.github/workflows/block-theme-build-and-e2e.yml` for validation steps and keep command examples current.
- **Changelog Notes**: When scaffold release behaviour changes, add concise entries to `CHANGELOG.md` under the scaffold section.

## Examples

- Prompt excerpt should include placeholder checks: `grep -R "{{" .` and removal of scaffold-only files in generated themes.
- Validation commands in prompts should mirror the current build workflow (`npm run lint`, `npm run test`, `npm run build`).

## Validation

- Confirm mustache tokens remain intact where required for generation.
- Verify references point to scaffold-specific files, not generated-theme paths.
- Run the documented release checks from the scaffold prompt to ensure commands are current (`npm run lint`, `npm run test`, `npm run build`).
- Re-read `.github/instructions/release.instructions.md` to ensure guidance is not duplicated or conflicting.
