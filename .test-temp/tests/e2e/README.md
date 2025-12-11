---
title: Tests
description: Test files and test configuration
category: Testing
type: Index
audience: Developers
date: 2025-12-01
---

# End-to-End Tests

This directory contains Playwright end-to-end tests for browser automation and integration testing.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Tests["E2E Tests"]
        Theme["theme.spec.js"]
        Example["example.spec.js"]
    end

    subgraph Browsers["Test Browsers"]
        Chrome["Chromium"]
        Firefox["Firefox"]
        Safari["WebKit"]
    end

    subgraph Actions["Test Actions"]
        Navigate["Navigate Pages"]
        Interact["User Interactions"]
        Assert["Assertions"]
        Screenshot["Screenshots"]
    end

    Tests --> Browsers
    Browsers --> Actions
```

## Test Files

### `theme.spec.js`

End-to-end tests for theme functionality.

**Tests:**

- Page loading and rendering
- Navigation functionality
- Block interactions
- Responsive behavior

### `example.spec.js`

Example test demonstrating Playwright patterns.

**Demonstrates:**

- Page navigation
- Element selection
- User interactions
- Assertions

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- theme.spec.js

# Debug mode
npm run test:e2e -- --debug

# Run in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

## Test Patterns

### Basic Navigation

```javascript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/Site Title/);
});
```

### User Interactions

```javascript
test('navigation menu works', async ({ page }) => {
    await page.goto('/');

    // Click menu button
    await page.click('.menu-toggle');

    // Verify menu is visible
    await expect(page.locator('.nav-menu')).toBeVisible();

    // Click menu item
    await page.click('a[href="/about"]');

    // Verify navigation
    await expect(page).toHaveURL(/\/about/);
});
```

### Form Submissions

```javascript
test('search form works', async ({ page }) => {
    await page.goto('/');

    // Fill search form
    await page.fill('[name="s"]', 'test query');
    await page.click('[type="submit"]');

    // Verify results page
    await expect(page).toHaveURL(/\?s=test\+query/);
    await expect(page.locator('.search-results')).toBeVisible();
});
```

### Screenshots

```javascript
test('visual regression', async ({ page }) => {
    await page.goto('/');

    // Take screenshot
    await page.screenshot({ path: 'screenshots/homepage.png' });

    // Screenshot specific element
    const header = page.locator('header');
    await header.screenshot({ path: 'screenshots/header.png' });
});
```

## Test Environment

E2E tests use `wp-env` for a local WordPress environment:

```bash
# Start environment
npm run env:start

# Run tests
npm run test:e2e

# Stop environment
npm run env:stop
```

## Test Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    A["Start wp-env"] --> B["Launch Browser"]
    B --> C["Navigate to Page"]
    C --> D["Perform Actions"]
    D --> E["Assert Results"]
    E --> F["Take Screenshots"]
    F --> G["Close Browser"]
```

## Best Practices

1. **Use data-testid**: Add test IDs to important elements
2. **Wait for elements**: Use `waitFor` to handle async operations
3. **Isolate tests**: Each test should be independent
4. **Clean up**: Reset state between tests
5. **Use page objects**: Organize selectors and actions

## Related Documentation

- [Playwright Configuration](../../docs/config/playwright.md)
- [Tests Overview](../README.md)
- [wp-env Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)
