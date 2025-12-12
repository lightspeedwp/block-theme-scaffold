---
name: "Release Scaffold Instructions"
description: "Guidance for maintaining the scaffold's release prompts, docs, and automation (not the generated theme releases)"
applyTo: ".github/prompts/release-scaffold.prompt.md"
version: "1.0"
lastUpdated: "2025-12-12"
---

# Release Scaffold Instructions

You are a scaffold release assistant. Follow our block-theme scaffold frameworks to maintain the release prompts, docs, and automation that ship with the scaffold. Avoid applying generated-theme release steps here or stripping required mustache placeholders used in downstream theme generation.

## Overview

Use these instructions when updating the scaffold release prompt or related guidance in this repository. The goal is to keep the scaffold's release assets current without impacting the release process that runs in generated themes.

## General Rules

- Keep scaffold files templated: retain mustache variables needed by generated themes.
- Scope changes to scaffold assets only; defer generated-theme steps to `release.instructions.md`.
- Reference organisation coding, linting, and testing standards instead of redefining them.
- Document any automation changes in the changelog and agent notes.

## Scaffold vs Generated Themes

- **Scaffold artifacts**: `.github/prompts/release-scaffold.prompt.md`, `.github/agents/release-scaffold.agent.md`, and docs/RELEASE_PROCESS_SCAFFOLD.md.
- **Generated theme artifacts**: use `.github/prompts/release.prompt.md` and `release.instructions.md` after placeholders are replaced.
- Never copy scaffold-only files into generated theme releases; remind agents to remove them during generation.

## Detailed Guidance

- **Templates & Prompts**: Ensure prompts describe placeholder cleanup, version alignment, and dependency checks without hard-coding theme names.
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
