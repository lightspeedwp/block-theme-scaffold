# README for Dry-Run Scripts

This folder centralizes helpers that let us exercise the scaffold templates without committing to full theme generation.

## Overview

- `dry-run-config.js` / `../utils/placeholders.js` supply concrete values for every `{{mustache}}` variable.
- `dry-run/with-dry-run.js` temporarily replaces placeholders in JS/SCSS files, runs any command, and restores the templates afterward.
- `dry-run/release-dry-run.js` builds on `with-dry-run` to smoke-test `release` and `release-scaffold` agents.
- `lint-dry-run.js` and `test-dry-run.js` already use the shared placeholders to keep linters/tests happy in scaffold mode.

## npm Scripts

The root `package.json` exposes scripts to invoke these helpers:

- `npm run dry-run:build` → runs `npm run build` with placeholder replacements applied.
- `npm run dry-run:start` → runs `npm run start` through the same dry-run wrapper so development servers can boot without generating a real theme.
- `npm run dry-run:release` → `node scripts/dry-run/release-dry-run.js release validate`
- `npm run dry-run:release-scaffold` → smoke-tests the scaffold release agent via the same helper.

Use these before `npm run build`, `start`, or release flows whenever you are still working inside the scaffold.

## Debugging Dry-Run Runs

1. `logs/dryrun-debug.log` captures the dry-run helper lifecycle (copy, replace, cleanup).
2. `logs/lint/*.log` and `logs/test/*.log` contain timestamps for lint/test dry-runs.
3. To inspect replaced files, rerun the helper with a safe command such as `node scripts/dry-run/with-dry-run.js node -e "console.log('placeholders')"` so you can view the temporary output before the files are restored.
4. When commands fail, rerun the same script with `DEBUG=true` or add custom logging inside `with-dry-run.js` before the command starts so you know which files are being swapped.

## Testing & Maintenance

- Keep any new placeholder files under this directory so the helper list stays complete.
- Tests for dry-run helpers should go in `scripts/dry-run/__tests__/`.
- Document new placeholder-sensitive paths in `.github/reports/research/placeholder-strategies.md`.

See the main scripts README for more context.
