---
name: "Scaffold Release Instructions"
description: "How to release the block theme scaffold while preserving all {{mustache}} placeholders and keeping release templates ready for generated themes"
applyTo: ".github/prompts/release-scaffold.prompt.md"
version: "v1.1"
last_updated: "2025-12-12"
---

# Scaffold Release Instructions

Use these instructions **only** for releasing the **block theme scaffold repository**. Generated themes follow their own release flow using the templated `release.*` files.

## Non-Negotiable Rules

- **Do not replace or remove any `{{...}}` placeholders** in WordPress source files (`style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, `parts/`).
- **Update versions only in meta files:** `VERSION`, `package.json`, `composer.json`, and `CHANGELOG.md`.
- **Keep release templates templated:** `.github/agents/release.agent.md`, `.github/prompts/release.prompt.md`, `.github/instructions/release.instructions.md`, and `docs/GENERATE_THEME.md` must retain `{{mustache}}` placeholders so new themes can rewrite them.
- **Scaffold-only files** (`release-scaffold.*` and `docs/RELEASE_PROCESS_SCAFFOLD.md`) stay in this repository and **must be deleted by the generator** in new theme repositories to avoid confusion.
- Prefer **dry-run** commands; avoid scripts that rewrite template files.

## File Rules

### ✅ Update (no placeholders)
- `VERSION`
- `package.json` (`version`)
- `composer.json` (`version`)
- `CHANGELOG.md`
- `docs/RELEASE_PROCESS_SCAFFOLD.md`

### ✅ Keep Templated for Generated Themes (must contain `{{...}}`)
- `.github/agents/release.agent.md`
- `.github/prompts/release.prompt.md`
- `.github/instructions/release.instructions.md`
- `docs/GENERATE_THEME.md`

### ❌ Preserve Placeholder Content (never replace)
- `style.css`, `functions.php`, `theme.json`
- `inc/`, `patterns/`, `templates/`, `parts/`

### 🗑️ Delete in Generated Themes
- `.github/agents/release-scaffold.agent.md`
- `.github/prompts/release-scaffold.prompt.md`
- `.github/instructions/release-scaffold.instructions.md`
- `docs/RELEASE_PROCESS_SCAFFOLD.md`

## Pre-Release Checks

1. **Placeholder integrity**
   ```bash
   grep -R "{{" style.css functions.php theme.json inc patterns templates parts
   ```
   If any expected placeholder is missing, stop and restore before proceeding.

2. **Meta version alignment**
   ```bash
   cat VERSION
   jq '.version' package.json
   jq '.version' composer.json
   ```
   All must match and follow SemVer.

3. **Release template sanity**
   ```bash
   grep -R "{{theme_name}}" .github/agents/release.agent.md
   grep -R "{{theme_slug}}" .github/prompts/release.prompt.md
   grep -R "{{version}}" docs/GENERATE_THEME.md
   ```

4. **Quality gates (dry-run only)**
   ```bash
   npm run lint:dry-run
   npm run format -- --check
   npm run test:dry-run:all
   npm audit --audit-level=high
   ```

5. **Generation smoke test (recommended)**
   ```bash
   node scripts/generate-theme.js \
     --slug "scaffold-release-check" \
     --name "Scaffold Release Check" \
     --author "Scaffold QA" \
     --author_uri "https://example.com" \
     --version "$(cat VERSION)"

   cd output-theme
   npm install
   npm run lint
   npm run build
   ! grep -R "{{" .
   cd ..
   rm -rf output-theme
   ```

## Release Steps (Scaffold)

1. **Update meta files**
   - Set the new version in `VERSION`, `package.json`, `composer.json`.
   - Update `CHANGELOG.md` `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` with comparison links.

2. **Review documentation**
   - Refresh `docs/RELEASE_PROCESS_SCAFFOLD.md` with any process changes.
   - Confirm `docs/GENERATE_THEME.md` still uses `{{mustache}}` variables.

3. **Run validation**
   - Execute the pre-release checks above.
   - Fix blockers, re-run validation.

4. **Commit scaffold changes**
   - Only meta files, CHANGELOG, and scaffold docs should change.
   - Example: `git commit -m "chore: prepare scaffold release vX.Y.Z"`

5. **Follow governance**
   - Create the release branch, merge per GOV, tag the release, and publish notes.

## Common Mistakes to Avoid

- Updating `style.css` or other templated files with real values.
- Running scripts that rewrite placeholders.
- Forgetting to keep `release.*` files templated for generated themes.
- Leaving `release-scaffold.*` in generated theme repositories.

## Ready-to-Release Checklist

- [ ] Placeholder integrity confirmed (`{{theme_slug}}`, `{{theme_name}}`, etc.)
- [ ] `VERSION`, `package.json`, `composer.json` aligned
- [ ] `CHANGELOG.md` updated and linked
- [ ] `docs/RELEASE_PROCESS_SCAFFOLD.md` current
- [ ] Release templates still contain `{{mustache}}`
- [ ] Dry-run lint/format/test pass
- [ ] `npm audit --audit-level=high` clean or addressed
- [ ] Generation smoke test passes (no placeholders in output)

## Recovery

If placeholders were overwritten:
```bash
git checkout -- style.css functions.php theme.json inc patterns templates parts
git status
grep -R "{{" style.css functions.php theme.json inc patterns templates parts
```
Re-run validation after restoration.

## Related References

- `.github/agents/release-scaffold.agent.md` – scaffold release agent
- `.github/prompts/release-scaffold.prompt.md` – scaffold release prompt
- `docs/RELEASE_PROCESS_SCAFFOLD.md` – detailed scaffold release guide
- `.github/agents/release.agent.md` / `.github/prompts/release.prompt.md` / `.github/instructions/release.instructions.md` – templated files kept for generated themes
