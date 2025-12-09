---
title: WordPress Packages Configuration
description: Quick reference for WordPress packages
date: 2025-12-08
---

# WordPress Packages Configuration

18 WordPress packages for block theme development.

## Quick Reference

| Package | Purpose | Docs |
|---------|---------|------|
| @wordpress/scripts | Build toolchain | [→](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) |
| @wordpress/i18n | Internationalization | [→](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/) |
| @wordpress/env | Local environment | [→](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) |
| @wordpress/eslint-plugin | Linting | [→](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-eslint-plugin/) |

**Complete list:** [package.json](../package.json)

**Official Docs:** [WordPress Package Reference](https://developer.wordpress.org/block-editor/reference-guides/packages/)

## Theme-Specific Usage

```bash
# Key commands
npm run start              # Development
npm run build              # Production
npm run lint:js            # Lint JavaScript
npm run test:e2e           # E2E tests
npm run env:start          # Local environment
npm run makepot            # Generate translations
```

**Config files:** `.babelrc.json`, `.browserslistrc`, `.eslintrc`, `.stylelintrc`, `.wp-env.json`

**Theme integration:** See [BUILD_PROCESS.md](BUILD_PROCESS.md) for webpack/babel setup

---

**References:**

- [WordPress Packages](https://developer.wordpress.org/block-editor/reference-guides/packages/)
- [Build Tools](https://developer.wordpress.org/block-editor/getting-started/devenv/)
