---
description: Step-by-step guide for creating GitHub releases for the Block Theme Scaffold
category: Release Management
type: Prompt
audience: Maintainers
date: 2025-12-17
---

# Create Block Theme Scaffold GitHub Release Prompt

This prompt defines the interactive **Release Wizard** for creating GitHub releases from an existing git tag for the Block Theme Scaffold. All `release-scaffold.*` processes and agents must use this wizard as the central workflow for release creation.

---

## 🚀 Block Theme Scaffold Release Interactive Wizard

The Release Wizard guides you step-by-step through preparing and publishing a new block theme scaffold release. Use this wizard for all `release-scaffold.*` processes, including automation and manual runs.

### Wizard Steps

1. **Select Release Type**

- [ ] Major (breaking changes)
- [ ] Minor (features, no breaking changes)
- [ ] Patch (bugfixes only)

2. **Set Version**

- Enter new version (e.g. `v1.0.0`):
- Validate against semantic versioning

3. **Prepare Changelog**

- Confirm `CHANGELOG.md` is updated for this version
- Option to auto-generate or edit changelog

4. **Tag & Push**

- Check if git tag exists locally and on remote
- Option to create and push tag if missing

5. **Draft Release Notes**

- Use mustache values for dynamic content (e.g. `{{version}}`, `{{date}}`)
- Preview and edit release notes
- **If mustache values are used, update the mustache registry using `scripts/scan-mustache-variables.js`**

6. **Configure Release Options**

- Set as latest release? [Y/n]
- Mark as pre-release? [y/N]
- Create discussion? [optional]

7. **Publish Release**

- Confirm all details
- Publish via GitHub UI, CLI, or API

8. **Post-Release Tasks**

- Announce release
- Monitor issues
- Plan next version

---

## Usage

- All `release-scaffold.*` files and agents must reference this wizard for block theme scaffold release creation.
- The wizard supports both interactive and automated (scripted) flows.
- **If you add or use mustache values in this file, update the mustache registry using `scripts/scan-mustache-variables.js`.**

---

## Prerequisites

Before starting, ensure:

- ✅ Git tag exists (check: `git tag -l`)
- ✅ Tag pushed to GitHub (check: `git ls-remote --tags origin`)
- ✅ CHANGELOG.md updated with release notes
- ✅ All release preparation tasks complete
- ✅ Template repository enabled in settings
- ✅ GitHub topics added

## Quick Start

**URL:** https://github.com/lightspeedwp/block-theme-scaffold/releases/new

**Tag:** v1.0.0 (or your version)

**Title:** `v1.0.0: Block Theme Scaffold`

**Description:** Copy from template below

---

## Step-by-Step Instructions

### Step 1: Navigate to Create Release

1. Go to: https://github.com/lightspeedwp/block-theme-scaffold/releases/new
2. Or: Repository → "Releases" → "Draft a new release"

### Step 2: Select Tag

1. Click "Choose a tag" dropdown
2. Select your version tag: **v1.0.0**
3. Target branch: **main** (auto-selected)

### Step 3: Add Release Title

v1.0.0: Multi-Block Plugin Scaffold

Format: `v{VERSION}: {PROJECT_NAME}`

**Example:**

```
v1.0.0: Block Theme Scaffold
```

### Step 4: Add Release Description

Copy and customize this template:

````markdown
🎉 **Initial Release** - Block Theme Scaffold v1.0.0

A comprehensive WordPress block theme scaffold with mustache templating, block-first architecture, and a complete development infrastructure for building modern block themes.

---

## ✨ Highlights

### Core Features

- **🎨 Mustache Templating** - 6 transformation filters (upper, lower, pascalCase, camelCase, kebabCase, snakeCase)
- **🧩 Block-First Architecture** - Patterns, parts, and templates for rapid theme development
- **🦪 130+ Unit & E2E Tests** - Comprehensive test coverage for PHP and JS
- **🔍 Complete Linting** - ESLint, Stylelint, PHPCS, and PHPStan configured
- **📚 15+ Documentation Files** - Comprehensive guides for all aspects

### WordPress Integration

- Block Patterns (15+ pre-built patterns)
- Block Templates with automatic assignment
- Block Styles registration
- theme.json design tokens and global styles
- Internationalization (i18n) ready
- Accessibility (a11y) best practices

### Developer Experience

- Interactive CLI for theme generation
- Schema validation for configuration
- Dry-run testing system
- Pre-commit hooks (Husky)
- wp-env integration
- Webpack 5 build system

---

## 🚀 Getting Started

### Using the Template

1. Click the green **"Use this template"** button
2. Create your repository
3. Clone locally: `git clone https://github.com/YOUR_ORG/YOUR_THEME.git`
4. Install dependencies: `npm install && composer install`
5. Run generator: `node scripts/generate-theme.js --in-place`

### Quick Generation

```bash
# Clone the scaffold
git clone https://github.com/lightspeedwp/block-theme-scaffold.git my-theme
cd my-theme

# Generate theme (output mode)
node scripts/generate-theme.js --config theme-config.json

# Or use interactive mode
node scripts/generate-theme.js
```
````

---

## 📋 Requirements

- **WordPress:** 6.5 or higher
- **PHP:** 8.0 or higher
- **Node.js:** 18.x or higher
- **Composer:** 2.x or higher

---

## 📖 Documentation

Complete documentation available in the `docs/` directory:

- **[README.md](https://github.com/lightspeedwp/block-theme-scaffold#readme)** - Overview and quick start
- **[GENERATE_THEME.md](https://github.com/lightspeedwp/block-theme-scaffold/blob/main/docs/GENERATE_THEME.md)** - Theme generation guide
- **[ARCHITECTURE.md](https://github.com/lightspeedwp/block-theme-scaffold/blob/main/docs/ARCHITECTURE.md)** - Repository structure
- **[DEVELOPMENT.md](https://github.com/lightspeedwp/block-theme-scaffold/blob/main/docs/DEVELOPMENT.md)** - Development workflow
- **[TESTING.md](https://github.com/lightspeedwp/block-theme-scaffold/blob/main/docs/TESTING.md)** - Testing strategies

---

## 🔗 Links

- **Documentation:** https://github.com/lightspeedwp/block-theme-scaffold/tree/main/docs
- **Issues:** https://github.com/lightspeedwp/block-theme-scaffold/issues
- **Discussions:** https://github.com/lightspeedwp/block-theme-scaffold/discussions
- **Changelog:** [CHANGELOG.md](https://github.com/lightspeedwp/block-theme-scaffold/blob/main/CHANGELOG.md)

---

## 🙏 Credits

Developed by [LightSpeed](https://lightspeedwp.agency) for the WordPress community.

---

## 📄 License

GPL-3.0-or-later - See [LICENSE](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/LICENSE) for details.

````

### Step 5: Configure Release Options

**Set as latest release:**
- ✅ Check this box

**Set as a pre-release:**
- ☐ Leave unchecked (this is a stable release)

**Create a discussion for this release:**
- ☐ Optional - check if you want community discussion

### Step 6: Publish Release

1. Review all information
2. Click **"Publish release"** button
3. Confirm release published

---

## Verification Checklist

After publishing, verify:

- [ ] Release appears at: https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases
- [ ] "Latest" badge is visible
- [ ] Download links work (Source code zip/tar.gz)
- [ ] Release description displays correctly with formatting
- [ ] All documentation links are functional
- [ ] Release shows correct tag (v1.0.0)
- [ ] Target branch is "main"

---

## Alternative: GitHub CLI

If you prefer automation:

```bash
# Install GitHub CLI if needed
brew install gh

# Authenticate
gh auth login

# Create release from tag
gh release create v1.0.0 \
  --title "v1.0.0: Multi-Block Plugin Scaffold" \
  --notes-file RELEASE_NOTES.md \
  --latest

# Or use inline notes
gh release create v1.0.0 \
  --title "v1.0.0: Multi-Block Plugin Scaffold" \
  --notes "$(cat CHANGELOG.md)" \
  --latest
````

---

## Alternative: GitHub API

Using curl with GitHub API:

```bash
# Set variables
GITHUB_TOKEN="your_personal_access_token"
REPO="lightspeedwp/multi-block-plugin-scaffold"
TAG="v1.0.0"

# Create release
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/$REPO/releases \
  -d '{
    "tag_name": "'"$TAG"'",
    "target_commitish": "main",
    "name": "v1.0.0: Multi-Block Plugin Scaffold",
    "body": "Release notes here...",
    "draft": false,
    "prerelease": false,
    "make_latest": true
  }'
```

---

## Troubleshooting

### Issue: Tag not found

**Solution:**

```bash
# Check if tag exists locally
git tag -l

# Check if tag exists on remote
git ls-remote --tags origin

# Push tag if missing
git push origin v1.0.0
```

### Issue: Release fails to create

**Possible causes:**

1. Tag doesn't exist on GitHub
2. Insufficient permissions
3. Release with same tag already exists

**Solution:**

- Verify tag pushed to GitHub
- Check repository permissions (need write access)
- Delete existing release if recreating

### Issue: Markdown not rendering

**Causes:**

- Malformed markdown syntax
- Broken links
- Invalid HTML in description

**Solution:**

- Validate markdown with a linter
- Preview in GitHub's markdown preview
- Remove any raw HTML

---

## Post-Release Tasks

After publishing v1.0.0:

1. **Update todo list** - Mark Task 20 as completed
2. **Announce release** - Share on social media, WordPress Slack
3. **Monitor issues** - Watch for bug reports from early adopters
4. **Plan v1.1.0** - Start collecting feature requests
5. **Update documentation** - Add any post-release notes

---

## Related Files

- [CHANGELOG.md](../../CHANGELOG.md) - Release notes source
- [release.agent.md](../agents/release.agent.md) - Release preparation agent
- [template-repository-settings.json](../template-repository-settings.json) - Repository configuration
- [GOVERNANCE.md](../../docs/GOVERNANCE.md) - Release process policies

---

## Quick Reference Card

| Item | Value |
| ---- | ----- |

- **Release URL** | https://github.com/lightspeedwp/block-theme-scaffold/releases/new |
- **Tag** | v1.0.0 |
- **Title Format** | `v{VERSION}: {PROJECT_NAME}` |
- **Target Branch** | main |
- **Latest** | ✅ Yes |
- **Pre-release** | ☑️ No |

---

## Success Criteria

Release is successful when:

- ✅ Release published and visible
- ✅ "Latest" badge shown
- ✅ Download links functional
- ✅ All documentation accessible
- ✅ Template repository working
- ✅ Topics searchable on GitHub
- ✅ Community can use template

---

## Next Steps

After v1.0.0 release:

1. Monitor feedback and issues
2. Plan v1.0.1 for bug fixes (if needed)
3. Start planning v1.1.0 features
4. Update roadmap based on community input
5. Continue improving documentation

---

**Ready to create the release?** Use this checklist and follow the steps above! 🚀
