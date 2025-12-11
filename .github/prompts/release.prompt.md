---
description: Release preparation prompt for {{theme_name}} generated from the block theme scaffold
---

# {{theme_name}} Release Prompt

This prompt is used **after** the theme is generated and placeholders are replaced. If any `{{...}}` tokens remain, regenerate before continuing.

## Quick Start Prompts

- "Prepare {{theme_name}} v{{version}} for release"
- "Run release validation for {{theme_slug}}"
- "Check version alignment for {{theme_name}}"
- "Generate release readiness report for v{{version}}"

## Conversation Flow

1. Confirm the target version from `VERSION` and restate that the repository must be placeholder-free.
2. Run a placeholder sweep (`grep -R "{{" .`) and fail fast if matches are found.
3. Verify version consistency across `VERSION`, `package.json`, `composer.json`, and `style.css`.
4. Run quality gates: `npm run lint`, `npm run format -- --check`, `npm run test`, `npm run build`.
5. Review `CHANGELOG.md`, `README.md`, and `docs/RELEASE_PROCESS.md` for `{{theme_name}}`/`{{version}}` references.
6. Run security checks: `npm audit --audit-level=high` (and composer audit if available).
7. Deliver a release readiness report with blockers, warnings, and next steps.

## Safety Notes

- If `release-scaffold.*` files exist, delete them—they belong only to the scaffold.
- Do not proceed while `{{...}}` placeholders remain anywhere in the repository.

## Outputs to Provide

- Placeholder status (found/none)
- Version alignment summary
- Lint/format/test/build results
- Documentation and changelog status
- Security audit outcome
- Next steps referencing `docs/RELEASE_PROCESS.md`
