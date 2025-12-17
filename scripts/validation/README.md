# README for Validation Scripts

This folder contains schema validation scripts and helpers for the block theme scaffold.

- Place all schema validation logic here.
- Tests for validation scripts should be in `scripts/validation/__tests__/`.
- Keep validation logic modular, reusable, and namespaced under a verb prefix.

## Naming conventions

Each entry in `scripts/validation/` should follow an action-first `<verb>-<target>` pattern so the filename reads like an imperative command. Use the verb that best describes the role of the script:

- `validate-`: core guardrails that assert configuration files, generated JSON, or build outputs remain compliant.
- `audit-`: analysis/report scripts that describe existing assets (metadata, frontmatter, placeholder coverage).
- `test-`: focused checks or Jest helpers that assert schema fidelity or support automation suites.
- `define-`: (used sparingly) scripts that define canonical structures before validation runs (e.g., schema builders).

Examples include `validate-theme-json.js`, `audit-frontmatter.js`, and `test-mustache-schema.js`. When adding a new schema tool, choose the verb that matches its intent and keep it inside `scripts/validation/`.

## Folder policy

- `scripts/validation/` is the only home for scripts using the `validate-`, `audit-`, `test-`, or `define-` prefixes. If you encounter a script elsewhere using one of these verbs, it should be moved here and documented accordingly.
- The helpers under `scripts/dry-run/` and `scripts/utils/` (e.g., `lint-dry-run.js`, `test-dry-run.js`, `placeholders.js`) support the validation scripts but must not adopt the reserved prefixes unless they also move into this folder.
- When new validation tooling is introduced, update this README, the relevant Jest suites, and any references inside `.github/agents` so the new script is discoverable.

## Current validation scripts

Tracked scripts cover schema validation, frontmatter auditing, placeholder registry checks, and theme configuration validation. Keeping them consolidated here prevents duplication and makes the naming convention clear.

See `.github/schemas/` for schema definitions.
