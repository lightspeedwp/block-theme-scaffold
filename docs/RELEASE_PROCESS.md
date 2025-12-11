---
title: Release Process
description: Complete guide for preparing and releasing new versions
category: Development
type: Guide
audience: Maintainers
date: 2025-12-10
---

# Release Process Guide

This guide covers the complete release process for the Block Theme Scaffold, following semantic versioning and the governance standards defined in [GOVERNANCE.md](GOVERNANCE.md).

## Table of Contents

- [Overview](#overview)
- [Version Numbering](#version-numbering)
- [Automated Release Script](#automated-release-script)
- [Manual Release Process](#manual-release-process)
- [Pre-Release Checklist](#pre-release-checklist)
- [Post-Release Tasks](#post-release-tasks)

## Overview

The release process follows these key principles:

1. **Semantic Versioning**: MAJOR.MINOR.PATCH format
2. **Quality Gates**: All tests and lints must pass
3. **Documentation**: CHANGELOG.md must be current
4. **Version Consistency**: All files updated atomically
5. **Git Flow**: Release branches → main + develop → tags

## Version Numbering

Follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (1.x.x): Breaking changes, incompatible API changes
- **MINOR** (x.1.x): New features, backward compatible
- **PATCH** (x.x.1): Bug fixes, backward compatible

### Pre-release Versions

- **Alpha**: `1.0.0-alpha.1` - Internal testing
- **Beta**: `1.0.0-beta.1` - Public testing
- **RC**: `1.0.0-rc.1` - Release candidate

## Automated Release Validation

The release workflow now relies on the **Release Agent** (`scripts/release.agent.js`) to validate all version references and quality gates. It does not directly write version numbers, but it tells you exactly what is out of sync and what to fix.

### Usage

```bash
# Check version consistency across VERSION, package.json, composer.json, style.css
npm run release:version

# Run the full validation suite (versions, lint/format/test, docs, generation, security)
npm run release:validate
```

### What the Agent Verifies

1. ✅ Version alignment: `VERSION`, `package.json`, `composer.json`, `style.css`
2. ✅ Linting/formatting/tests via dry-run gates
3. ✅ Documentation checks for README/CHANGELOG/CONTRIBUTING
4. ✅ Theme generation dry-run
5. ✅ Security audit (`npm audit`)

### Example Output

```
============================================================
ℹ Checking version consistency...
ℹ Running quality gates...
ℹ Validating documentation...
ℹ Testing theme generation...
ℹ Running security audit...
============================================================

✓ All version files match: 1.0.0
✓ Linting passed (dry-run)
✓ Tests passed (dry-run)
✓ CHANGELOG.md structured correctly
✓ Theme generation: PASSED
✓ Security audit: No critical vulnerabilities

============================================================
✓ READY TO RELEASE

Next steps:
  1. Review the changes: git diff
  2. Run full tests if needed: npm run test
  3. Commit: git commit -am "chore: prepare release v1.0.0"
  4. Tag and push per GOVERNANCE.md
============================================================
```

### Updating Versions Manually

If `npm run release:version` reports mismatches, update the following in one commit:

1. `VERSION`
2. `package.json` (`version`)
3. `composer.json` (`version`)
4. `style.css` header (`Version:`)
5. `CHANGELOG.md` – move `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`, add comparison links

After editing, re-run `npm run release:validate` to confirm the agent reports green.

## Manual Release Process

If you prefer manual control or need to handle edge cases:

### Step 1: Create Release Branch

```bash
# From develop branch
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/1.0.0
```

### Step 2: Update Version Files

Update these files with the new version:

#### VERSION

```
1.0.0
```

#### package.json

```json
{
  "name": "block-theme-scaffold",
  "version": "1.0.0",
  ...
}
```

#### composer.json

```json
{
  "name": "lightspeedwp/block-theme-scaffold",
  "version": "1.0.0",
  ...
}
```

#### style.css

```css
/*
Theme Name: Block Theme Scaffold
Version: 1.0.0
...
*/
```

### Step 3: Update CHANGELOG.md

Transform the `[Unreleased]` section:

```markdown
## [Unreleased]

### Changed

- Placeholder for future changes

## [1.0.0] - 2025-12-10

### Added

- Initial theme scaffold
- Full Site Editing support
...

[Unreleased]: https://github.com/lightspeedwp/block-theme-scaffold/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lightspeedwp/block-theme-scaffold/releases/tag/v1.0.0
```

### Step 4: Run Quality Checks

```bash
# Linting
npm run lint                    # Must pass with zero errors

# Formatting
npm run format                  # Ensure consistency

# Testing
npm run test:js                 # JavaScript tests
npm run test:php                # PHP tests (composer test)
npm run test:e2e                # E2E tests

# Security
npm audit                       # Check for vulnerabilities

# Theme Generation
npm run test:dry-run:all        # Test scaffold generation
```

### Step 5: Commit Changes

```bash
git add VERSION package.json composer.json style.css CHANGELOG.md
git commit -m "chore: prepare release v1.0.0"
```

### Step 6: Merge to Main and Develop

```bash
# Merge to main
git checkout main
git merge release/1.0.0
git push origin main

# Merge to develop
git checkout develop
git merge release/1.0.0
git push origin develop

# Delete release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

### Step 7: Tag Release

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag
git push origin v1.0.0

# Or push all tags
git push origin --tags
```

### Step 8: Create GitHub Release

**Using GitHub CLI:**

```bash
gh release create v1.0.0 \
  --title "v1.0.0" \
  --notes-file CHANGELOG.md
```

**Using GitHub UI:**

1. Go to <https://github.com/lightspeedwp/block-theme-scaffold/releases/new>
2. Select tag: `v1.0.0`
3. Title: `v1.0.0`
4. Description: Copy from CHANGELOG.md
5. Attach any assets if needed
6. Click "Publish release"

## Pre-Release Checklist

Before tagging a release, verify:

### 1. Code Quality ✅

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run test` passes with 80%+ coverage
- [ ] `npm run format` applied
- [ ] No console errors or warnings

### 2. Version Files ✅

- [ ] VERSION file updated
- [ ] package.json version updated
- [ ] composer.json version updated
- [ ] style.css header updated
- [ ] CHANGELOG.md completed with release date

### 3. Documentation ✅

- [ ] README.md features/requirements current
- [ ] CONTRIBUTING.md workflow up to date
- [ ] All documentation reviewed
- [ ] Links and references working

### 4. Testing ✅

- [ ] JavaScript unit tests pass
- [ ] PHP unit tests pass
- [ ] E2E tests pass
- [ ] Theme generation works: `npm run test:dry-run:all`
- [ ] Generated theme builds successfully
- [ ] Mustache variables properly replaced

### 5. Performance & Security ✅

- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Lighthouse score acceptable (if applicable)
- [ ] Bundle size within limits
- [ ] No deprecated dependencies

### 6. Git & Branches ✅

- [ ] Working directory clean
- [ ] All changes committed
- [ ] Release branch merged to main
- [ ] Release branch merged to develop
- [ ] No merge conflicts

## Post-Release Tasks

After releasing:

### 1. Verify Release

- [ ] Tag visible on GitHub: `https://github.com/lightspeedwp/block-theme-scaffold/releases`
- [ ] CHANGELOG links work
- [ ] Release notes complete
- [ ] Assets attached (if any)

### 2. Communications

- [ ] Update project status
- [ ] Notify contributors
- [ ] Update documentation sites
- [ ] Announce on social media (if major release)

### 3. Planning

- [ ] Create milestone for next version
- [ ] Review and prioritize issues
- [ ] Update roadmap
- [ ] Plan next release cycle

## Troubleshooting

### Version Conflicts

If version files get out of sync:

```bash
# Check current versions
cat VERSION
grep '"version"' package.json
grep 'Version:' style.css

# Re-run release script
npm run prepare:release -- 1.0.0
```

### Failed Tests

If tests fail during release:

```bash
# Run specific test suite
npm run test:js          # JavaScript only
npm run test:php         # PHP only
npm run test:e2e         # E2E only

# Check test logs
cat logs/test/$(ls -t logs/test/ | head -1)

# Fix issues and re-run
npm run test
```

### Git Issues

If merge conflicts occur:

```bash
# Abort merge
git merge --abort

# Resolve conflicts manually
git checkout main
git merge release/1.0.0
# Fix conflicts
git add .
git commit -m "chore: merge release/1.0.0 into main"
```

## Related Documentation

- [GOVERNANCE.md](GOVERNANCE.md) - Project governance and policies
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [VALIDATION.md](VALIDATION.md) - Quality validation reference
- [TESTING.md](TESTING.md) - Testing guide

## Version History

| Date | Change |
|------|--------|
| 2025-12-10 | Initial release process documentation |
