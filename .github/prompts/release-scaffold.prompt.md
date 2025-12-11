---
description: Scaffold-only release prompt that preserves {{mustache}} placeholders and keeps release templates ready for generated themes
---

# Scaffold Release Prompt

Use this prompt to prepare the **block theme scaffold** for release. Do **not** use it for generated themes; those should use `release.prompt.md` after placeholders are rewritten.

## Quick Start Prompts

- "Prepare scaffold release vX.Y.Z (protect placeholders)"
- "Run scaffold release validation without changing WordPress files"
- "Check placeholder integrity before scaffold release"
- "Generate scaffold release readiness report for vX.Y.Z"

## Conversation Flow

1. Confirm the target version from `VERSION` and restate the placeholder safety rules.
2. Run a placeholder integrity scan across `style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, and `parts/`.
3. Verify meta versions align (`VERSION`, `package.json`, `composer.json`) and follow SemVer.
4. Confirm release templates remain templated with `{{mustache}}` (`.github/agents/release.agent.md`, `.github/prompts/release.prompt.md`, `.github/instructions/release.instructions.md`, `docs/GENERATE_THEME.md`).
5. Run dry-run quality gates: `npm run lint:dry-run`, `npm run format -- --check`, `npm run test:dry-run:all`, `npm audit --audit-level=high`.
6. Optional: run a generation smoke test with sample values to ensure placeholders replace correctly and the output theme builds.
7. Deliver a release readiness report with blockers, warnings, and next steps limited to meta file updates and documented processes.

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
