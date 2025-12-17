# Placeholder Strategy Notes

Keeping the scaffold runnable without generating a theme requires a careful placeholder strategy:

- `scripts/utils/placeholders.js` is the authoritative lookup for the `{{mustache}}` tokens used by the templates. Linters/tests rely on it, so add new entries there whenever a template introduces new variables.
- `scripts/dry-run/dry-run-config.js` mirrors the placeholder map but exposes getters (`getDryRunValue`, `getDryRunConfig`) that the agent tests, lint/test dry-runs, and new wrapper scripts consume.
- `scripts/dry-run/with-dry-run.js` now scans every JS/SCSS file that still contains `{{` tokens and replaces them in-place before running `npm scripts` (build/start). The same helper also powers `dry-run:start`, `dry-run:build`, and a new release dry-run CLI so each command can run without leaking unresolved tokens.
- Dry runs should log to `logs/dryrun-debug.log` to capture exactly which files were swapped and when they were restored. Keep that log referenced when validating the replacement coverage.

The goal is to keep the scaffold in a “template-only” state while still exercising the build/test surface by falling back to deterministic dry-run values.
