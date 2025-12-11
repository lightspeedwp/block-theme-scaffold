---
name: "{{theme_name}} Release Instructions"
description: "Instructions for releasing {{theme_name}} after it is generated from the scaffold"
applyTo: ".github/prompts/release.prompt.md"
version: "v1.1"
last_updated: "2025-12-12"
---

# {{theme_name}} Release Instructions

These instructions apply to the **generated theme** (placeholders replaced). If you still see `{{...}}` tokens in this repository, fix the generation step before attempting a release.

## Pre-Flight

- **Placeholder-free:** `grep -R "{{" .` should return no results in theme code.
- **Version alignment:** `VERSION`, `package.json`, `composer.json`, and the `Version:` header in `style.css` all match `{{version}}`.
- **Release artifacts:** `CHANGELOG.md` has `[{{version}}] - YYYY-MM-DD` with comparison links; `docs/RELEASE_PROCESS.md` references `{{theme_name}}`.
- **Scaffold leftovers:** Delete any `release-scaffold.*` files if present—they belong only to the scaffold.

## Files to Update

- `VERSION`
- `package.json` (`version`)
- `composer.json` (`version`)
- `style.css` header (`Version:` and `Theme Name: {{theme_name}}`)
- `CHANGELOG.md`
- `docs/RELEASE_PROCESS.md` (theme-specific)

## Validation Commands

```bash
# Placeholder check
grep -R "{{" .

# Versions
cat VERSION
jq '.version' package.json
jq '.version' composer.json
grep "^Version:" style.css

# Quality gates
npm run lint
npm run format -- --check
npm run test
npm run build
npm audit --audit-level=high
```

## Release Steps

1. **Set the version** across `VERSION`, `package.json`, `composer.json`, `style.css`, and `CHANGELOG.md`.
2. **Update documentation** (`CHANGELOG.md`, `README.md`, `docs/RELEASE_PROCESS.md`) to mention `{{theme_name}}` and `{{version}}`.
3. **Run validation** using the commands above; fix blockers and re-run.
4. **Commit** release changes (versions, changelog, docs) once clean.
5. **Branch and tag** per project governance (release branch → main → develop → tag `v{{version}}`).
6. **Publish release notes** using the changelog entry.

## Ready-to-Release Checklist

- [ ] No `{{...}}` placeholders in the repository
- [ ] Version aligned across `VERSION`, `package.json`, `composer.json`, `style.css`
- [ ] `CHANGELOG.md` updated with comparison links
- [ ] Lint/format/test/build pass
- [ ] `npm audit --audit-level=high` clean or mitigated
- [ ] Documentation references `{{theme_name}}` and `{{version}}`

## Recovery

If placeholders are found after generation:
```bash
grep -R "{{" .
# Regenerate the theme or restore templated files from the scaffold, then rerun checks.
```

## References

- `.github/agents/release.agent.md` – release agent specification
- `.github/prompts/release.prompt.md` – release prompt
- `docs/RELEASE_PROCESS.md` – theme release guide
- `docs/GENERATE_THEME.md` – mustache variable reference
