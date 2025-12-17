# Build & Dry-run Practices Research

## Objective
Document the repeatable pattern we now use to run CLI tooling without generating a theme yet still verifying WP scripts.

## Key Decisions
- Added `scripts/dry-run/with-dry-run.js`, which is the reusable wrapper that scans SCSS/JS files for `{{mustache}}` tokens, applies `dry-run` values, runs the requested command, and then restores the original files.
- Surface that helper through `npm run dry-run:build` and `npm run dry-run:start` so common `build`/`start` flows can be executed safely within the scaffold before a real theme is created.
- The same wrapper also powers `scripts/dry-run/release-dry-run.js`, which exercises the `release` and `release-scaffold` agents via `npm run dry-run:release`/`dry-run:release-scaffold`. This ensures release checks can be smoke-tested without generating output.

## Debugging Notes
- Always check `logs/dryrun-debug.log` after running a dry-run script; it records copy/replace/cleanup phases.
- When adding new SCSS/JS entry points, confirm `scripts/dry-run/with-dry-run.js` sees them by matching the `{{` pattern and verifying the script logs the replacement count.
- Use `npm run dry-run:build` as part of automated validation before running the real `npm run build` in a release pipeline.
