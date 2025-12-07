---
title: Validation Quick Reference
description: Quick reference guide for all validation, testing, and code quality processes
category: Development
type: Reference
audience: Developers, Contributors
date: 2025-12-07
---

# Validation Quick Reference

This document is a quick reference guide for validating code before committing or deploying. For comprehensive details, see the specialized documentation listed below.

## Quick Command Reference

### All-in-One Validation

```bash
# Run complete validation suite
npm run lint                    # Run all linters (JS, CSS, PHP)
npm run test                    # Run all tests (unit, integration, e2e)
npm run lint && npm run test    # Lint and test
```

### Code Quality (Linting)

```bash
npm run lint                    # All linters
npm run lint:js                 # JavaScript linting
npm run lint:css                # CSS/SCSS linting  
npm run lint:php                # PHP linting
npm run lint:pkg-json           # package.json validation
npm run lint:dry-run            # Scaffold development (with test placeholders)
```

**For detailed linting standards:** See [LINTING.md](./LINTING.md)

### Testing

```bash
npm run test                    # All tests
npm run test:js                 # JavaScript unit tests (Jest)
npm run test:php                # PHP unit tests (PHPUnit)
npm run test:e2e                # End-to-end tests (Playwright)
```

**For testing guide & examples:** See [TESTING.md](./TESTING.md)

### Auto-Fix Issues

```bash
npm run lint:js:fix             # Auto-fix JavaScript
npm run lint:css:fix            # Auto-fix CSS/SCSS
npm run lint:php:fix            # Auto-fix PHP
npm run format                  # Format all code (Prettier)
```

## Validation Tools & Documentation

### Code Quality & Linting

| Tool | Purpose | Configuration | Full Guide |
|------|---------|---------------|-----------|
| **ESLint** | JavaScript validation | `.eslintrc.js` | [LINTING.md](./LINTING.md#javascript-linting) |
| **Stylelint** | CSS/SCSS validation | `.stylelintrc.js` | [LINTING.md](./LINTING.md#cssscss-linting) |
| **PHPCS** | PHP validation | `phpcs.xml` | [LINTING.md](./LINTING.md#php-linting) |
| **Prettier** | Code formatting | `.prettierrc.js` | [LINTING.md](./LINTING.md) |

### Testing

| Framework | Purpose | Configuration | Full Guide |
|-----------|---------|---------------|-----------|
| **Jest** | JavaScript tests | `jest.config.js` | [TESTING.md](./TESTING.md#javascript-tests-jest) |
| **PHPUnit** | PHP tests | `phpunit.xml` | [TESTING.md](./TESTING.md#php-tests-phpunit) |
| **Playwright** | E2E tests | `.playwright.config.cjs` | [TESTING.md](./TESTING.md#e2e-tests-playwright) |

### Theme Validation

| Type | Tool | Reference |
|------|------|-----------|
| **theme.json** | WordPress validator | [WordPress Theme JSON Reference](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/) |
| **Package.json** | npm-package-json-lint | [LINTING.md](./LINTING.md#packagejson-linting) |
| **WordPress Packages** | Version validator | [WORDPRESS-PACKAGES.md](./WORDPRESS-PACKAGES.md) |

## Continuous Integration

For CI/CD validation workflows, see [WORKFLOWS.md](./WORKFLOWS.md)

## Validation Checklist

Before committing code:

- [ ] Run `npm run lint` - all code passes linting
- [ ] Run `npm run test` - all tests pass
- [ ] Run `npm run format` - code is formatted consistently
- [ ] Manual review - code follows patterns in this codebase

## Comprehensive Guides

- **[LINTING.md](./LINTING.md)** - Complete linting standards including dry-run mode for scaffold development
- **[TESTING.md](./TESTING.md)** - Testing strategies, configuration, and examples for all test types
- **[LOGGING.md](./LOGGING.md)** - Logging standards for validation output and debugging
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance validation with Lighthouse CI and bundle analysis
- **[WORKFLOWS.md](./WORKFLOWS.md)** - CI/CD validation workflows and GitHub Actions

## Troubleshooting

- **ESLint errors?** See [LINTING.md § JavaScript Linting](./LINTING.md#javascript-linting)
- **Stylelint errors?** See [LINTING.md § CSS/SCSS Linting](./LINTING.md#cssscss-linting)
- **PHPCS errors?** See [LINTING.md § PHP Linting](./LINTING.md#php-linting)
- **Tests failing?** See [TESTING.md § Troubleshooting](./TESTING.md#troubleshooting)
- **Build failing?** See [BUILD_PROCESS.md § Troubleshooting](./BUILD_PROCESS.md)

## Related Documents

- [LINTING.md](./LINTING.md) - Detailed linting standards and practices
- [TESTING.md](./TESTING.md) - Testing guide with examples
- [BUILD_PROCESS.md](./BUILD_PROCESS.md) - Build system and compilation
- [LOGGING.md](./LOGGING.md) - Logging standards
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance validation
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD automation
