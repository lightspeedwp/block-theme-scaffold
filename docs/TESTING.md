---
title: Testing Guide
description: Testing block themes - setup, commands, and patterns
date: 2025-12-08
---

# Testing Guide

## Quick Start

```bash
npm run test              # All tests
npm run test:js           # JavaScript unit tests
npm run test:e2e          # End-to-end tests
composer test             # PHP unit tests

npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

## Test Types

| Type | Tool | Purpose | Files |
|------|------|---------|-------|
| JS Unit | Jest | Component/utility tests | `tests/js/**/*.test.js` |
| PHP Unit | PHPUnit | WordPress function tests | `tests/php/test-*.php` |
| E2E | Playwright | Full workflow tests | `tests/e2e/**/*.spec.js` |

## Configuration

- **Jest**: `jest.config.js` (uses `@wordpress/jest-preset-default`)
- **PHPUnit**: `phpunit.xml` (WordPress test suite)
- **Playwright**: `.playwright.config.cjs` (E2E setup)

## Theme-Specific Testing

### Block Patterns
```javascript
test('registers call-to-action pattern', () => {
  expect(wp.blocks.getBlockType('theme/call-to-action')).toBeDefined();
});
```

### Template Functions
```php
public function test_get_theme_colors() {
  $colors = get_theme_colors();
  $this->assertIsArray($colors);
}
```

### Accessibility
```javascript
test('homepage passes axe audit', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveNoViolations();
});
```

## Writing Tests

**Coverage targets**: 80% statements, 75% branches

**Naming**: `test-{feature}.php`, `{component}.test.js`, `{workflow}.spec.js`

**Run specific**: `npm test -- pattern.test.js` or `composer test -- --filter=test_name`

---

**Full testing guides:**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [PHPUnit Manual](https://phpunit.de/manual/current/en/index.html)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [WordPress Unit Tests](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)
