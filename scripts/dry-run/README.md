# README for Dry-Run Scripts

This folder centralizes helpers that let us exercise the scaffold templates without committing to full theme generation.

## Overview

- `dry-run-config.js` / `../utils/placeholders.js` supply concrete values for every `{{mustache}}` variable.
- `dry-run/with-dry-run.js` renders a temporary copy of `theme-template/` with the placeholders replaced and runs any command with `DRY_RUN_THEME_DIR` set to it.
- `dry-run/release-dry-run.js` builds on `with-dry-run` to smoke-test `release` and `release-scaffold` agents.
- `lint-dry-run.js` and `test-dry-run.js` already use the shared placeholders to keep linters/tests happy in scaffold mode.

## npm Scripts

The root `package.json` exposes scripts to invoke these helpers:

- `npm run dry-run:release` → `node scripts/dry-run/release-dry-run.js release validate`
- `npm run dry-run:release-scaffold` → smoke-tests the scaffold release agent via the same helper.

`with-dry-run.js` renders `theme-template/` into a temporary folder (placeholders replaced with the dry-run values), runs the command with `DRY_RUN_THEME_DIR` pointing at that copy, then deletes it. It never writes into `theme-template/`. To build, lint or test a theme, generate one instead: `.github/workflows/theme-generation.yml` shows the steps.

## Debugging Dry-Run Runs

1. `logs/dryrun-debug.log` captures the dry-run helper lifecycle (copy, replace, cleanup).
2. `logs/lint/*.log` and `logs/test/*.log` contain timestamps for lint/test dry-runs.
3. To inspect the rendered copy, run a command that lists it, such as `node scripts/dry-run/with-dry-run.js sh -c 'ls -R "$DRY_RUN_THEME_DIR"'`; the copy is deleted when the command exits.

## Testing & Maintenance

- Keep any new placeholder files under this directory so the helper list stays complete.
- Tests for dry-run helpers should go in `scripts/dry-run/__tests__/`.
- Document new placeholder-sensitive paths in `.github/reports/research/placeholder-strategies.md`.

See the main scripts README for more context.
