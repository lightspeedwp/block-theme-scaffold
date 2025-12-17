---
title: Block Theme Scaffold Test Helpers
description: Overview of test helpers, setup, and conventions for the block theme scaffold
---

# Block Theme Scaffold Test Helpers

This directory contains test utilities, loggers, and mocks for the block theme scaffold. All test setup for Jest is now centralized in `.github/tests/jest.setup.localstorage.js`.

## Key Files

- `test-utils.js`: Core test helpers (retry, safe file ops, assertions, metrics, environment validation)
- `test-logger.js`: File-based logger for test runs (used by Jest and integration tests)
- `__mocks__/`: Jest mocks for CSS/SCSS and static files, with verification scripts

## Jest Setup

All Jest projects should use `.github/tests/jest.setup.localstorage.js` for consistent environment, mocks, and localStorage support.

## PHP Test Bootstraps

- `bootstrap.php`: PHPUnit bootstrap for WordPress theme testing
- `phpstan-bootstrap.php`: PHPStan bootstrap with ACF function mocks

## Contribution

If you add new helpers or change setup, update this README and ensure all test files use the unified helpers and setup.
