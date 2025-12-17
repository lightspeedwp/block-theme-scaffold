# Project Status: Dry-Run Automation for Theme Scaffold

- **Status:** Active
- **Objective:** Validate that the block-theme scaffold can be built, started, and released without generating a concrete theme, which saves CI time and keeps the template files untouched.
- **Recent Work:** Added `scripts/dry-run/with-dry-run.js` to replace placeholders in SCSS/JS files, surfaced `npm run dry-run:build` / `dry-run:start`, and documented the approach in `.github/reports/research/build-dry-run-practices.md`.
- **Next Steps:** Run `npm run dry-run:build` before each release smoke test (already verified once), track any new `{{mustache}}` fields via `scripts/utils/placeholders.js`, and extend the helper if we add other file types (e.g., `ts`, `tsx`).
- **Risks:** Missing a placeholder pattern could let `npm run build` fail; the dry-run log needs review when scaffolding changes.
