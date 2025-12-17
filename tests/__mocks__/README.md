---
title: Jest Mocks for Block Theme Scaffold
description: Usage and verification of Jest style and file mocks
---


# Jest Mocks for Block Theme Scaffold

This folder contains mock modules and data for use in Jest and Playwright tests.

## Purpose

- Provide controlled replacements for dependencies (e.g., WordPress APIs, network calls, file system)
- Enable deterministic, isolated unit and integration tests
- Avoid side effects and external dependencies during test runs

## Conventions

- Place all Jest/Node mocks here (e.g., `@wordpress/i18n.js`, `fs.js`)
- Use descriptive filenames matching the module being mocked
- Document any complex or custom mock logic in this README
- Playwright E2E mocks (network, API) should be defined in test setup or helper files, not here

## Example

- `@wordpress/i18n.js`: Mocks translation functions for all JS tests
- `fs.js`: Mocks file system for logger and config tests

For more details, see `.github/instructions/jest-tests.instructions.md` and Playwright test helpers.

>This directory contains Jest mock files for CSS/SCSS and static file imports, as well as verification scripts to ensure correct Jest configuration.

## Files

- `styleMock.js`: Mocks CSS/SCSS imports as an empty object (`{}`)
- `fileMock.js`: Mocks static file imports (images, fonts) as `'test-file-stub'`
- `verify-mocks.js`: Node script to verify Jest config and mock file presence/content
- `verify-mocks.test.js`: Jest test to ensure mocks and config are working

## Usage

These mocks are referenced in `jest.config.js` via `moduleNameMapper` to prevent errors when importing styles or static assets in tests.

## Verification

Run the verification script or test to confirm correct setup:

```bash
node tests/__mocks__/verify-mocks.js
# or
npm test tests/__mocks__/verify-mocks.test.js
```

## Contribution

If you add new asset types or change Jest config, update these mocks and tests accordingly.
