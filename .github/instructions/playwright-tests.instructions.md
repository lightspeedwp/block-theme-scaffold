---
title: Playwright E2E Testing Instructions
description: Comprehensive guide to writing and running Playwright end-to-end tests in the block theme scaffold
category: Testing
type: Guide
audience: Developers
date: 2025-12-16
---

# Playwright E2E Testing Instructions

This guide explains how Playwright end-to-end (E2E) tests work in the block-theme-scaffold project and provides instructions for writing, organizing, and running E2E tests effectively.

## Table of Contents

- [Overview](#overview)
- [Test Directory Structure](#test-directory-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Accessibility Testing](#accessibility-testing)
- [Test Patterns](#test-patterns)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

## Overview

The block-theme-scaffold uses [Playwright](https://playwright.dev/) as its end-to-end testing framework, integrated through [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/). Playwright provides:

- **Cross-browser testing**: Test on Chromium, Firefox, and WebKit
- **Auto-wait**: Automatically waits for elements to be ready before interacting
- **Network interception**: Mock API responses and control network behavior
- **Accessibility testing**: Built-in integration with axe-core via axe-playwright
- **Video recording**: Capture videos of test failures for debugging
- **Parallel execution**: Run tests concurrently for faster feedback

### Why Playwright?

- Modern, reliable test automation
- Excellent WordPress integration via @wordpress/e2e-test-utils-playwright
- Built-in accessibility testing with axe-playwright
- Rich debugging capabilities
- Great developer experience with auto-wait and retry logic

## Test Directory Structure

### `tests/e2e/` - End-to-End Tests

**Purpose**: Browser-based tests that simulate real user interactions with the theme

**What lives here**:
- `accessibility.spec.js` - Comprehensive accessibility tests (WCAG 2.1 AA)
- `theme.spec.js` - Core theme functionality tests
- `example.spec.js` - Example test patterns

**Run with**:
```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:a11y         # Run accessibility tests only
npm run test:e2e:debug        # Run with debugging enabled
```

## Running Tests

### Prerequisites

Before running E2E tests, you need a WordPress test environment:

```bash
# Start WordPress environment
npm run env:start

# The environment runs at http://localhost:8888/
```

### All E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with headed browser (see what's happening)
npm run test:e2e -- --headed

# Run in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

### Specific Test Suites

```bash
# Run accessibility tests only
npm run test:e2e:a11y

# Run specific test file
npm run test:e2e tests/e2e/theme.spec.js

# Run specific test by name
npm run test:e2e -- -g "Homepage has no accessibility violations"
```

### Debugging Tests

```bash
# Debug mode with Playwright Inspector
npm run test:e2e:debug

# Run with UI mode (interactive)
npx playwright test --ui

# Run single test with inspector
npx playwright test tests/e2e/theme.spec.js --debug

# Show browser while testing
npm run test:e2e -- --headed --slowmo=1000
```

### Test Reports

```bash
# View last test report
npx playwright show-report

# Test artifacts are saved to:
# - test-results/ - Test failure artifacts
# - playwright-report/ - HTML reports
```

## Writing Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe( 'Feature Name', () => {
	// Setup before each test
	test.beforeEach( async ( { page } ) => {
		await page.goto( 'http://localhost:8888/' );
	} );

	// Cleanup after each test
	test.afterEach( async ( { page } ) => {
		// Optional cleanup
	} );

	test( 'should do something specific', async ( { page } ) => {
		// Arrange: Navigate and set up
		await page.goto( 'http://localhost:8888/sample-page/' );

		// Act: Interact with the page
		const heading = page.locator( 'h1' );

		// Assert: Verify the result
		await expect( heading ).toBeVisible();
		await expect( heading ).toContainText( 'Sample Page' );
	} );
} );
```

### WordPress-Specific Testing

The theme uses [@wordpress/e2e-test-utils-playwright](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/) for WordPress-specific utilities:

```javascript
import { test, expect } from '@playwright/test';
import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block Editor', () => {
	test( 'should create a post with blocks', async ( { page } ) => {
		const admin = new Admin( { page } );
		const editor = new Editor( { page } );

		// Login and create new post
		await admin.visitAdminPage( 'post-new.php' );

		// Add blocks
		await editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'Hello World' },
		} );

		// Publish
		await editor.publishPost();

		// Verify
		await expect( page.locator( '.entry-content p' ) ).toContainText(
			'Hello World'
		);
	} );
} );
```

### Common Locators and Actions

```javascript
// Finding elements
const heading = page.locator( 'h1' );
const button = page.getByRole( 'button', { name: 'Submit' } );
const link = page.getByText( 'Read more' );
const input = page.getByLabel( 'Email address' );

// Interacting
await button.click();
await input.fill( 'test@example.com' );
await page.keyboard.press( 'Enter' );
await page.selectOption( 'select#country', 'us' );

// Navigation
await page.goto( 'http://localhost:8888/' );
await page.goBack();
await page.reload();

// Waiting
await page.waitForLoadState( 'networkidle' );
await heading.waitFor( { state: 'visible' } );
await page.waitForTimeout( 1000 ); // Use sparingly

// Assertions
await expect( heading ).toBeVisible();
await expect( heading ).toHaveText( 'Welcome' );
await expect( heading ).toHaveClass( /entry-title/ );
await expect( page ).toHaveURL( /sample-page/ );
await expect( page ).toHaveTitle( /Sample Page/ );
```

## Accessibility Testing

The theme uses [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) for automated accessibility testing.

### Basic Accessibility Test

```javascript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe( 'Accessibility', () => {
	test.beforeEach( async ( { page } ) => {
		await page.goto( 'http://localhost:8888/' );
		await injectAxe( page ); // Inject axe-core
	} );

	test( 'Page has no accessibility violations', async ( { page } ) => {
		await checkA11y( page, null, {
			detailedReport: true,
			detailedReportOptions: { html: true },
		} );
	} );
} );
```

### WCAG Compliance Testing

```javascript
test( 'WCAG 2.1 Level AA compliance', async ( { page } ) => {
	await injectAxe( page );

	await checkA11y(
		page,
		null,
		{
			runOnly: [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ],
		},
		true, // Fail on violations
		'v4' // Axe-core version
	);
} );
```

### Testing Specific Elements

```javascript
test( 'Navigation is accessible', async ( { page } ) => {
	await injectAxe( page );

	// Check only navigation element
	await checkA11y( page, 'nav', {
		detailedReport: true,
	} );
} );
```

### Color Contrast Testing

```javascript
test( 'Color contrast meets WCAG AA', async ( { page } ) => {
	await injectAxe( page );

	await checkA11y(
		page,
		null,
		{
			runOnly: [ 'color-contrast' ],
		},
		true,
		'v4'
	);
} );
```

### Keyboard Navigation Testing

```javascript
test( 'Navigation is keyboard accessible', async ( { page } ) => {
	await page.goto( 'http://localhost:8888/' );

	// Tab through interactive elements
	await page.keyboard.press( 'Tab' );

	// Check focus is visible
	const focused = await page.evaluate(
		() => document.activeElement?.tagName
	);
	expect( focused ).toBeTruthy();

	// Test skip link
	const skipLink = page.locator( 'a[href^="#"]' ).first();
	await expect( skipLink ).toBeFocused();

	// Activate skip link
	await page.keyboard.press( 'Enter' );
	await page.waitForTimeout( 100 );

	// Verify focus moved to main content
	const mainFocused = await page.evaluate(
		() => document.activeElement?.closest( 'main' ) !== null
	);
	expect( mainFocused ).toBe( true );
} );
```

## Test Patterns

### Testing Theme Templates

```javascript
test.describe( 'Template Tests', () => {
	test( 'Homepage template', async ( { page } ) => {
		await page.goto( 'http://localhost:8888/' );

		// Verify template structure
		await expect( page.locator( 'header' ) ).toBeVisible();
		await expect( page.locator( 'main' ) ).toBeVisible();
		await expect( page.locator( 'footer' ) ).toBeVisible();
	} );

	test( 'Single post template', async ( { page } ) => {
		await page.goto( 'http://localhost:8888/?p=1' );

		// Verify post structure
		await expect( page.locator( 'article' ) ).toBeVisible();
		await expect( page.locator( '.entry-title' ) ).toBeVisible();
		await expect( page.locator( '.entry-content' ) ).toBeVisible();
	} );

	test( '404 template', async ( { page } ) => {
		await page.goto( 'http://localhost:8888/non-existent/' );

		// Verify 404 messaging
		await expect( page.locator( 'h1' ) ).toBeVisible();
		await expect( page.locator( 'form[role="search"]' ) ).toBeVisible();
	} );
} );
```

### Testing Navigation

```javascript
test.describe( 'Navigation', () => {
	test( 'Primary navigation works', async ( { page } ) => {
		await page.goto( 'http://localhost:8888/' );

		// Click navigation link
		await page.click( 'nav a:has-text("About")' );

		// Verify navigation
		await expect( page ).toHaveURL( /about/ );
		await expect( page.locator( 'h1' ) ).toContainText( 'About' );
	} );

	test( 'Mobile menu toggle', async ( { page } ) => {
		// Set mobile viewport
		await page.setViewportSize( { width: 375, height: 667 } );
		await page.goto( 'http://localhost:8888/' );

		// Open mobile menu
		const menuButton = page.getByRole( 'button', { name: /menu/i } );
		await menuButton.click();

		// Verify menu is visible
		const nav = page.locator( 'nav' );
		await expect( nav ).toBeVisible();
	} );
} );
```

### Testing Forms

```javascript
test.describe( 'Forms', () => {
	test( 'Search form works', async ( { page } ) => {
		await page.goto( 'http://localhost:8888/' );

		// Fill and submit search
		const searchInput = page.locator( 'input[type="search"]' );
		await searchInput.fill( 'test query' );
		await searchInput.press( 'Enter' );

		// Verify search results page
		await expect( page ).toHaveURL( /\?s=test\+query/ );
		await expect( page.locator( 'h1' ) ).toContainText( 'Search' );
	} );
} );
```

### Testing Responsive Design

```javascript
test.describe( 'Responsive Design', () => {
	const viewports = [
		{ name: 'Mobile', width: 375, height: 667 },
		{ name: 'Tablet', width: 768, height: 1024 },
		{ name: 'Desktop', width: 1920, height: 1080 },
	];

	viewports.forEach( ( { name, width, height } ) => {
		test( `Layout on ${ name }`, async ( { page } ) => {
			await page.setViewportSize( { width, height } );
			await page.goto( 'http://localhost:8888/' );

			// Verify layout doesn't overflow
			const bodyWidth = await page.evaluate(
				() => document.body.scrollWidth
			);
			expect( bodyWidth ).toBeLessThanOrEqual( width );
		} );
	} );
} );
```

### Screenshot Testing

```javascript
test( 'Homepage visual regression', async ( { page } ) => {
	await page.goto( 'http://localhost:8888/' );

	// Take screenshot and compare
	await expect( page ).toHaveScreenshot( 'homepage.png', {
		fullPage: true,
		maxDiffPixels: 100,
	} );
} );
```

## Configuration

### Playwright Configuration

The project uses the default Playwright configuration from `@wordpress/scripts`. To customize:

Create `playwright.config.js` in project root:

```javascript
const defaultConfig = require( '@wordpress/scripts/config/playwright.config.js' );

module.exports = {
	...defaultConfig,
	use: {
		...defaultConfig.use,
		baseURL: 'http://localhost:8888',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	// Override test timeout
	timeout: 30000,
	// Run tests in parallel
	workers: 4,
};
```

### Environment Setup

Tests run against `wp-env` (WordPress local environment):

```bash
# Start environment
npm run env:start

# Environment details:
# - URL: http://localhost:8888
# - Admin: http://localhost:8888/wp-admin
# - User: admin
# - Pass: password

# Stop environment
npm run env:stop

# Reset environment
npm run env:destroy
npm run env:start
```

### Test Environment Variables

Create `.env.testing` for test-specific configuration:

```bash
WP_BASE_URL=http://localhost:8888
WP_USERNAME=admin
WP_PASSWORD=password
```

## Best Practices

### 1. Use Semantic Locators

```javascript
// Good: Use role and accessible name
const button = page.getByRole( 'button', { name: 'Submit' } );
const heading = page.getByRole( 'heading', { name: 'Welcome' } );

// Avoid: CSS selectors when possible
const button = page.locator( '.btn-submit' );
```

### 2. Wait for Network and DOM

```javascript
// Wait for page to fully load
await page.goto( 'http://localhost:8888/', {
	waitUntil: 'networkidle',
} );

// Wait for specific element
await page.locator( 'article' ).waitFor( { state: 'visible' } );

// Avoid arbitrary timeouts
// await page.waitForTimeout( 3000 ); // Don't do this
```

### 3. Test User Flows, Not Implementation

```javascript
// Good: Test from user perspective
test( 'User can create and publish post', async ( { page, admin } ) => {
	await admin.visitAdminPage( 'post-new.php' );
	await page.fill( '#title', 'My Post' );
	await page.click( 'button:has-text("Publish")' );
	await expect( page.locator( '.notice-success' ) ).toBeVisible();
} );

// Avoid: Testing internal implementation
test( 'REST API creates post', async ( { request } ) => {
	// This should be a unit test, not E2E
} );
```

### 4. Isolate Tests

```javascript
// Each test should be independent
test.describe( 'Posts', () => {
	test.beforeEach( async ( { admin } ) => {
		// Create fresh test data
		await admin.createPost( {
			title: 'Test Post',
			status: 'publish',
		} );
	} );

	test.afterEach( async ( { admin } ) => {
		// Clean up test data
		await admin.deleteAllPosts();
	} );
} );
```

### 5. Use Page Object Model for Complex Pages

```javascript
// pages/HomePage.js
export class HomePage {
	constructor( page ) {
		this.page = page;
		this.heading = page.locator( 'h1' );
		this.nav = page.locator( 'nav' );
	}

	async goto() {
		await this.page.goto( 'http://localhost:8888/' );
	}

	async clickNavLink( name ) {
		await this.nav.getByRole( 'link', { name } ).click();
	}
}

// In test
import { HomePage } from './pages/HomePage';

test( 'Navigation works', async ( { page } ) => {
	const homePage = new HomePage( page );
	await homePage.goto();
	await homePage.clickNavLink( 'About' );
} );
```

### 6. Handle Flaky Tests

```javascript
// Retry failed tests
test.describe( 'Flaky Feature', () => {
	test.describe.configure( { retries: 2 } );

	test( 'might be flaky', async ( { page } ) => {
		// Test code
	} );
} );

// Or mark specific test as flaky
test( 'known flaky test', async ( { page } ) => {
	test.fixme(); // Skip this test
	// or
	test.slow(); // Triple the timeout
} );
```

### 7. Accessibility Testing Best Practices

```javascript
// Test at different page states
test.describe( 'Modal Accessibility', () => {
	test( 'closed state', async ( { page } ) => {
		await injectAxe( page );
		await checkA11y( page );
	} );

	test( 'open state', async ( { page } ) => {
		await page.click( 'button:has-text("Open Modal")' );
		await injectAxe( page );
		await checkA11y( page );
	} );
} );

// Test focus management
test( 'Focus trap in modal', async ( { page } ) => {
	await page.click( 'button:has-text("Open Modal")' );

	// Tab through modal elements
	await page.keyboard.press( 'Tab' );
	// Focus should stay within modal
} );
```

## Resources

### Official Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [WordPress E2E Utils](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/)
- [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

### Project-Specific

- [Testing Guide](../../docs/TESTING.md) - Overall testing strategy
- [Jest Testing Instructions](./jest-tests.instructions.md) - JavaScript unit tests
- [PHPUnit Testing Instructions](./phpunit-tests.instructions.md) - PHP unit tests
- [Contributing Guide](../../CONTRIBUTING.md) - Contribution workflow

### Quick Reference

```bash
# Environment
npm run env:start              # Start WordPress environment
npm run env:stop               # Stop environment

# Run tests
npm run test:e2e               # All E2E tests
npm run test:e2e:a11y          # Accessibility tests only
npm run test:e2e:debug         # Debug mode

# Specific tests
npm run test:e2e tests/e2e/theme.spec.js
npm run test:e2e -- -g "test name pattern"

# Debug
npx playwright test --ui       # Interactive UI mode
npx playwright test --debug    # Inspector
npx playwright show-report     # View last report

# Browsers
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

---

**Last Updated**: 2025-12-16
**Maintainers**: LightSpeedWP Engineering Team
