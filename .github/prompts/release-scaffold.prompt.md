---
description: Scaffold-only release prompt that preserves {{mustache}} placeholders and keeps release templates ready for generated themes
---

# Scaffold Release Prompt

Use this prompt to prepare the **block theme scaffold** for release. Do **not** use it for generated themes; those should use `release.prompt.md` after placeholders are rewritten.

## 🚀 Release Scaffold Wizard

Follow this step-by-step wizard to prepare the scaffold for release. This wizard is referenced by all `release-scaffold.*` files and should be used for every scaffold release.

**Step 1: Confirm Version & Placeholder Safety**

**Step 2: Placeholder Integrity Scan**

- `style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, `parts/`

**Step 3: Meta Version Alignment**

**Step 4: Templated Release File Check**

**Step 5: Dry-Run Quality Gates**

- `npm run lint:dry-run`
- `npm run format -- --check`
- `npm run test:dry-run:all`
- `npm audit --audit-level=high`

**Step 6 (Optional): Generation Smoke Test**

**Step 7: Release Readiness Report**

- Placeholder integrity status
- Meta version alignment
- Lint/format/test/security results
- Generation smoke test outcome
- Next steps (see `docs/RELEASE_PROCESS_SCAFFOLD.md`)

## Quick Start Prompts

> **Wizard Reference:** All `release-scaffold.*` files should reference the above Release Scaffold Wizard for step-by-step guidance.

## Wizard Integration

This prompt invokes the release-scaffold agent, which uses the pluggable wizard.js system for configuration. You can run the wizard in interactive (cli) mode or dry-run (mock) mode:

- **Interactive:**
  ```sh
  node scripts/agents/release-scaffold.agent.js
  ```
- **Dry-run:**
  ```sh
  WIZARD_MODE=mock node scripts/agents/release-scaffold.agent.js
  ```

The agent's questions array is passed to runWizard(), and the mode can be set via the WIZARD_MODE environment variable.

## Mustache Safety Guard

- Never edit WordPress files containing `{{...}}` placeholders (`style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, `parts/`).
- Keep the templated release files intact for generated themes: `.github/agents/release.agent.md`, `.github/prompts/release.prompt.md`, `.github/instructions/release.instructions.md`, `docs/GENERATE_THEME.md`.
- Scaffold-only release files (`release-scaffold.*`, `docs/RELEASE_PROCESS_SCAFFOLD.md`) must stay in this repo and should be deleted by the generator in new theme repos.

## Outputs to Provide

- Placeholder integrity status (where tokens were found or missing)
- Meta version alignment summary
- Dry-run lint/format/test/security results
- Generation smoke test outcome (if executed)
- Actionable next steps referencing `docs/RELEASE_PROCESS_SCAFFOLD.md`
