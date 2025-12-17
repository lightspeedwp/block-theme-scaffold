# Validation Decisions

## Frontmatter Schema Alignment
- The JSON schema at `.github/schemas/frontmatter.schema.json` actually only mandates `description`, a non-empty `tools` array, and `metadata.guardrails`. That is enforced by `scripts/validation/validate-agent-frontmatter.js` (make sure both the schema and validator stay in sync when adding new requirements).
- The previous human-readable docs listed many fields as required; this was misleading. The updated `docs/FRONTMATTER_SCHEMA.md` now mirrors the real schema so contributors know which fields are mandatory and which are merely recommended.

## Tool & Permission Vocabulary
- Tools simply need to be strings; `tools` must exist but entries can be any descriptor such as `read_file` or `run_in_terminal`.
- The permitted `permissions` enum is enforced both in the schema and validator (`permissions` entries must match the list in `.github/schemas/frontmatter.schema.json`).

## Guardrails & Audits
- Every spec must keep `metadata.guardrails` so automation can surface safety expectations.
- `scripts/validation/audit-frontmatter.js` already scans for circular references and missing files; add new specs to `.github/reports/research/validation-decisions.md` if they introduce novel guardrails or tooling needs.
