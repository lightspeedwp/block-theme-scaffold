---
description: Scaffold-only release prompt that preserves {{mustache}} placeholders and keeps release templates ready for generated themes
---

# Scaffold Release Prompt

Use this prompt to prepare the **block theme scaffold** for release. Do **not** use it for generated themes; those should use `release.prompt.md` after placeholders are rewritten.

- **Relationship to Pre-Release Validation:**

- This prompt is paired with `.github/prompts/pre-release-scaffold-validation.prompt.md`, which is used for pre-release validation (dry-run, checks only).
- Both prompts invoke the release-scaffold agent and the interactive wizard (see `scripts/lib/wizard.js`).
- To run a dry-run validation before a full release, use the pre-release validation prompt; return here for the actual release process after all checks pass.

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

## Wizard/Agent Integration

This prompt and the pre-release validation prompt both invoke:

- `scripts/agents/release-scaffold.agent.js` (agent implementation)
- `scripts/agents/release-scaffold.questions.js` (wizard questions/config)
- `scripts/lib/wizard.js` (wizard logic)

You can run the wizard in interactive (cli) mode or dry-run (mock) mode:

- **Interactive:**
  ```sh
  node scripts/agents/release-scaffold.agent.js
  ```
- **Dry-run (pre-release validation):**
  ```sh
  WIZARD_MODE=mock node scripts/agents/release-scaffold.agent.js
  ```

The agent's questions array is passed to runWizard(), and the mode can be set via the WIZARD_MODE environment variable.

---

_See also: `.github/prompts/pre-release-scaffold-validation.prompt.md` for the dry-run validation workflow preceding a full release._

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
