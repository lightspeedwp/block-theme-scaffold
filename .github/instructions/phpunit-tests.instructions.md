---
title: PHPUnit Testing Instructions
description: Comprehensive guide to writing and running PHPUnit tests in the block theme scaffold
category: Testing
type: Guide
audience: Developers
date: 2025-12-16
---

# PHPUnit Testing Instructions

This guide explains how PHPUnit tests work in the block-theme-scaffold project and provides instructions for writing, organizing, and running PHP unit tests effectively.

## Table of Contents

- [Overview](#overview)
- [Test Directory Structure](#test-directory-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [PHP Coding Standards](#php-coding-standards)
- [Test Patterns](#test-patterns)
- [Configuration](#configuration)
- [Best Practices](#best-practices)

## Overview

The block-theme-scaffold uses [PHPUnit](https://phpunit.de/) as its PHP testing framework, integrated with the WordPress test suite. PHPUnit provides:

- **Unit testing**: Test individual functions and classes in isolation
- **Integration testing**: Test WordPress-specific functionality
- **Code coverage**: Generate coverage reports to identify untested code
- **Fixtures**: Set up and tear down test data automatically
- **Assertions**: Rich assertion library for testing values

### Why PHPUnit?

- Industry standard for PHP testing
- Excellent WordPress integration via WordPress test suite
- Comprehensive assertion library
- Code coverage reporting
- Great IDE integration

### Testing Tools

The project uses several tools for PHP quality:

- **PHPUnit 9.0+**: Test framework
- **WPCS 3.0** (WordPress Coding Standards): Linting and formatting
- **PHPCompatibility WP 2.1+**: PHP version compatibility checks
- **Yoast PHPUnit Polyfills**: Compatibility across PHPUnit versions

## Test Directory Structure

### `tests/php/` - PHP Unit Tests

**Purpose**: Test PHP theme functionality, WordPress integration, and custom functions

**What lives here**:
- `test-theme-setup.php` - Theme setup and configuration tests
- `test-block-patterns.php` - Block pattern registration tests
- `test-block-styles.php` - Block style registration tests
- `test-template-functions.php` - Template function tests

**Run with**:
```bash
composer run test              # Run all PHP tests
composer run test:coverage     # Run with coverage report
npm run test:php               # Alternative via NPM
```

### `tests/bootstrap.php` - Test Bootstrap

**Purpose**: Initialize WordPress test environment before running tests

**What it does**:
- Loads WordPress test library
- Switches to the theme being tested
- Sets up WordPress environment for tests

## Running Tests

### Prerequisites

Before running PHP tests, you need the WordPress test suite installed:

```bash
# Install test suite (one-time setup)
bash bin/install-wp-tests.sh wordpress_test root '' localhost latest

# Arguments:
# 1. Database name (wordpress_test)
# 2. Database user (root)
# 3. Database password ('')
# 4. Database host (localhost)
# 5. WordPress version (latest)
```

### All PHP Tests

```bash
# Run all tests
composer run test

# Alternative via NPM
npm run test:php

# Verbose output
composer run test -- --verbose

# Stop on first failure
composer run test -- --stop-on-failure
```

### Test Coverage

```bash
# Generate HTML coverage report
composer run test:coverage

# Coverage report saved to: coverage/index.html
# Open in browser:
open coverage/index.html
```

### Specific Test Files

```bash
# Run single test file
vendor/bin/phpunit tests/php/test-theme-setup.php

# Run specific test class
vendor/bin/phpunit --filter Test_Theme_Setup

# Run specific test method
vendor/bin/phpunit --filter test_theme_supports
```

### Debugging Tests

```bash
# Show debug output
composer run test -- --debug

# Print test output
composer run test -- --verbose --debug

# Use var_dump in tests (will show in output)
public function test_something() {
	var_dump( $this->data );
	$this->assertTrue( true );
}
```

## Writing Tests

### Basic Test Structure

```php
<?php
/**
 * Test description
 *
 * @package {{theme_name}}
 */

class Test_Feature_Name extends WP_UnitTestCase {

	/**
	 * Setup before each test
	 */
	public function setUp(): void {
		parent::setUp();
		// Set up test data
	}

	/**
	 * Cleanup after each test
	 */
	public function tearDown(): void {
		// Clean up test data
		parent::tearDown();
	}

	/**
	 * Test specific functionality
	 */
	public function test_specific_behavior() {
		// Arrange: Set up test data
		$input = 'test';

		// Act: Execute the code under test
		$result = my_function( $input );

		// Assert: Verify the result
		$this->assertEquals( 'expected', $result );
	}
}
```

### Common Assertions

```php
// Equality
$this->assertEquals( $expected, $actual );
$this->assertSame( $expected, $actual ); // Strict equality (===)
$this->assertNotEquals( $expected, $actual );

// Truthiness
$this->assertTrue( $value );
$this->assertFalse( $value );
$this->assertNull( $value );
$this->assertNotNull( $value );

// Types
$this->assertIsString( $value );
$this->assertIsInt( $value );
$this->assertIsArray( $value );
$this->assertIsBool( $value );
$this->assertIsObject( $value );

// Arrays
$this->assertContains( 'item', $array );
$this->assertCount( 3, $array );
$this->assertArrayHasKey( 'key', $array );
$this->assertEmpty( $array );
$this->assertNotEmpty( $array );

// Strings
$this->assertStringContainsString( 'substring', $string );
$this->assertStringStartsWith( 'prefix', $string );
$this->assertStringEndsWith( 'suffix', $string );
$this->assertMatchesRegularExpression( '/pattern/', $string );

// Exceptions
$this->expectException( Exception::class );
$this->expectExceptionMessage( 'Error message' );
my_function_that_throws();

// WordPress-specific
$this->assertTrue( function_exists( 'my_function' ) );
$this->assertTrue( current_theme_supports( 'post-thumbnails' ) );
$this->assertTrue( is_plugin_active( 'plugin/plugin.php' ) );
```

### Testing WordPress Functions

```php
class Test_Theme_Setup extends WP_UnitTestCase {

	/**
	 * Test theme setup function is called
	 */
	public function test_theme_setup_function_exists() {
		$this->assertTrue( function_exists( 'mytheme_setup' ) );
	}

	/**
	 * Test theme supports
	 */
	public function test_theme_supports() {
		$this->assertTrue( current_theme_supports( 'post-thumbnails' ) );
		$this->assertTrue( current_theme_supports( 'automatic-feed-links' ) );
		$this->assertTrue( current_theme_supports( 'title-tag' ) );
	}

	/**
	 * Test content width is set
	 */
	public function test_content_width() {
		global $content_width;
		$this->assertNotEmpty( $content_width );
		$this->assertIsInt( $content_width );
		$this->assertGreaterThan( 0, $content_width );
	}
}
```

### Testing Custom Functions

```php
class Test_Template_Functions extends WP_UnitTestCase {

	/**
	 * Test sanitization function
	 */
	public function test_sanitize_input() {
		$input = '<script>alert("xss")</script>Hello';
		$expected = 'Hello';
		$result = mytheme_sanitize_input( $input );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test helper function with various inputs
	 */
	public function test_format_date() {
		// Test with timestamp
		$timestamp = strtotime( '2025-01-15' );
		$result = mytheme_format_date( $timestamp );
		$this->assertEquals( 'January 15, 2025', $result );

		// Test with invalid input
		$result = mytheme_format_date( 'invalid' );
		$this->assertFalse( $result );
	}
}
```

### Testing with WordPress Data

```php
class Test_Post_Functions extends WP_UnitTestCase {

	private $post_id;

	public function setUp(): void {
		parent::setUp();

		// Create test post
		$this->post_id = $this->factory()->post->create( [
			'post_title'   => 'Test Post',
			'post_content' => 'Test content',
			'post_status'  => 'publish',
		] );
	}

	public function tearDown(): void {
		// Clean up test post
		wp_delete_post( $this->post_id, true );
		parent::tearDown();
	}

	public function test_get_post_data() {
		$post = get_post( $this->post_id );

		$this->assertInstanceOf( WP_Post::class, $post );
		$this->assertEquals( 'Test Post', $post->post_title );
		$this->assertEquals( 'publish', $post->post_status );
	}
}
```

## PHP Coding Standards

The project uses **WordPress Coding Standards (WPCS) 3.0** for code quality and consistency.

### Running PHP Linter

```bash
# Lint all PHP files
composer run lint

# Alternative via NPM
npm run lint:php

# Lint specific file
vendor/bin/phpcs inc/template-functions.php

# Check with verbose output
vendor/bin/phpcs -v inc/
```

### Auto-Fix Issues

```bash
# Fix automatically fixable issues
composer run lint:fix

# Alternative via NPM
npm run lint:php:fix

# Fix specific file
vendor/bin/phpcbf inc/template-functions.php
```

### PHPCS Configuration

The project's PHP_CodeSniffer configuration is in [phpcs.xml](../../phpcs.xml):

```xml
<ruleset name="Theme Coding Standards">
	<!-- WordPress Coding Standards -->
	<rule ref="WordPress"/>
	<rule ref="WordPress-Extra">
		<!-- Allow short array syntax -->
		<exclude name="Generic.Arrays.DisallowShortArraySyntax"/>
	</rule>

	<!-- PHP Compatibility -->
	<rule ref="PHPCompatibilityWP"/>

	<!-- Prefix all globals -->
	<rule ref="WordPress.NamingConventions.PrefixAllGlobals">
		<properties>
			<property name="prefixes" type="array">
				<element value="mytheme"/>
			</property>
		</properties>
	</rule>
</ruleset>
```

### Coding Standards Rules

**Key rules enforced**:

1. **Naming Conventions**:
   - Prefix all global functions: `mytheme_function_name()`
   - Prefix all constants: `MYTHEME_CONSTANT`
   - Use snake_case for functions and variables

2. **Formatting**:
   - Tabs for indentation
   - Unix line endings (LF)
   - No trailing whitespace
   - Spaces around operators

3. **Documentation**:
   - DocBlocks for all functions
   - File headers with package information
   - Inline comments for complex logic

4. **Security**:
   - Escape output: `esc_html()`, `esc_attr()`, `esc_url()`
   - Sanitize input: `sanitize_text_field()`, `absint()`
   - Validate nonces: `wp_verify_nonce()`
   - Prepare SQL: `$wpdb->prepare()`

5. **WordPress Best Practices**:
   - Use WordPress functions over PHP equivalents
   - Follow WordPress hooks conventions
   - Use WordPress coding patterns

### PHP Compatibility

The project checks compatibility with **PHP 7.4+**:

```bash
# Check PHP compatibility
vendor/bin/phpcs -p inc/ --standard=PHPCompatibilityWP --runtime-set testVersion 7.4-

# The PHPCompatibilityWP standard checks:
# - Removed functions
# - Deprecated features
# - New syntax not available in target version
```

## Test Patterns

### Data Providers

```php
/**
 * Test sanitization with multiple inputs
 *
 * @dataProvider sanitization_data
 */
public function test_sanitize_with_data_provider( $input, $expected ) {
	$result = mytheme_sanitize_input( $input );
	$this->assertEquals( $expected, $result );
}

/**
 * Data provider for sanitization tests
 */
public function sanitization_data() {
	return [
		'xss_attempt'     => [ '<script>alert("xss")</script>', '' ],
		'html_tags'       => [ '<b>Bold</b>', 'Bold' ],
		'normal_text'     => [ 'Hello World', 'Hello World' ],
		'unicode'         => [ 'Héllo Wörld', 'Héllo Wörld' ],
		'empty_string'    => [ '', '' ],
	];
}
```

### Testing Hooks

```php
class Test_Theme_Hooks extends WP_UnitTestCase {

	/**
	 * Test action hook is registered
	 */
	public function test_action_hook_registered() {
		$priority = has_action( 'init', 'mytheme_init_function' );
		$this->assertNotFalse( $priority );
	}

	/**
	 * Test filter hook modifies value
	 */
	public function test_filter_modifies_value() {
		$input = 'original';
		$result = apply_filters( 'mytheme_custom_filter', $input );

		$this->assertNotEquals( $input, $result );
	}

	/**
	 * Test action hook executes
	 */
	public function test_action_executes() {
		// Set up tracker
		$executed = false;
		$callback = function() use ( &$executed ) {
			$executed = true;
		};

		// Add temporary hook
		add_action( 'mytheme_custom_action', $callback );

		// Trigger action
		do_action( 'mytheme_custom_action' );

		// Verify execution
		$this->assertTrue( $executed );

		// Clean up
		remove_action( 'mytheme_custom_action', $callback );
	}
}
```

### Testing Block Patterns

```php
class Test_Block_Patterns extends WP_UnitTestCase {

	/**
	 * Test pattern categories are registered
	 */
	public function test_pattern_categories_registered() {
		$categories = WP_Block_Pattern_Categories_Registry::get_instance()
			->get_all_registered();

		$theme_categories = array_filter( $categories, function( $category ) {
			return strpos( $category['name'], 'mytheme-' ) === 0;
		} );

		$this->assertNotEmpty( $theme_categories );
	}

	/**
	 * Test specific pattern is registered
	 */
	public function test_hero_pattern_registered() {
		$pattern = WP_Block_Patterns_Registry::get_instance()
			->get_registered( 'mytheme/hero' );

		$this->assertNotNull( $pattern );
		$this->assertArrayHasKey( 'title', $pattern );
		$this->assertArrayHasKey( 'content', $pattern );
		$this->assertArrayHasKey( 'categories', $pattern );
	}
}
```

### Testing Block Styles

```php
class Test_Block_Styles extends WP_UnitTestCase {

	/**
	 * Test custom block style is registered
	 */
	public function test_custom_button_style_registered() {
		$styles = WP_Block_Styles_Registry::get_instance()
			->get_registered_styles( 'core/button' );

		$style_names = wp_list_pluck( $styles, 'name' );

		$this->assertContains( 'custom-style', $style_names );
	}
}
```

### Testing Assets Enqueue

```php
class Test_Asset_Loading extends WP_UnitTestCase {

	/**
	 * Test theme styles are enqueued
	 */
	public function test_theme_styles_enqueued() {
		// Simulate frontend
		set_current_screen( 'front' );

		// Trigger enqueue hooks
		do_action( 'wp_enqueue_scripts' );

		// Check if style is enqueued
		$this->assertTrue( wp_style_is( 'mytheme-style', 'enqueued' ) );
	}

	/**
	 * Test editor styles are enqueued
	 */
	public function test_editor_styles_enqueued() {
		// Simulate editor
		set_current_screen( 'post' );

		// Trigger enqueue hooks
		do_action( 'enqueue_block_editor_assets' );

		// Check if editor style is enqueued
		$this->assertTrue( wp_style_is( 'mytheme-editor', 'enqueued' ) );
	}
}
```

### Mocking WordPress Functions

```php
class Test_With_Mocks extends WP_UnitTestCase {

	/**
	 * Test function that uses get_option
	 */
	public function test_function_with_option() {
		// Mock option value
		add_filter( 'pre_option_mytheme_setting', function() {
			return 'mocked_value';
		} );

		$result = mytheme_get_setting();

		$this->assertEquals( 'mocked_value', $result );
	}
}
```

## Configuration

### PHPUnit Configuration

The project's PHPUnit configuration is in [phpunit.xml](../../phpunit.xml):

```xml
<phpunit bootstrap="tests/bootstrap.php">
	<testsuites>
		<testsuite name="Theme Test Suite">
			<directory prefix="test-" suffix=".php">./tests/</directory>
		</testsuite>
	</testsuites>

	<!-- Code coverage -->
	<coverage includeUncoveredFiles="true">
		<include>
			<directory suffix=".php">./inc/</directory>
			<file>./functions.php</file>
		</include>
		<exclude>
			<directory>./tests/</directory>
			<directory>./vendor/</directory>
		</exclude>
	</coverage>

	<!-- PHPUnit polyfills -->
	<php>
		<const name="WP_TESTS_PHPUNIT_POLYFILLS_PATH"
		       value="./vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php" />
	</php>
</phpunit>
```

### Test Bootstrap Configuration

The [tests/bootstrap.php](../../tests/bootstrap.php) file initializes the test environment:

```php
<?php
// Load WordPress test environment
$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

// Give access to tests_add_filter() function
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the theme being tested
 */
function _manually_load_theme() {
	switch_theme( 'mytheme' );
}
tests_add_filter( 'muplugins_loaded', '_manually_load_theme' );

// Start up the WP testing environment
require $_tests_dir . '/includes/bootstrap.php';
```

### Composer Configuration

PHP testing dependencies in [composer.json](../../composer.json):

```json
{
	"require-dev": {
		"phpunit/phpunit": "^9.0",
		"wp-coding-standards/wpcs": "^3.0",
		"phpcompatibility/phpcompatibility-wp": "^2.1",
		"yoast/phpunit-polyfills": "^1.0"
	},
	"scripts": {
		"lint": "phpcs",
		"lint:fix": "phpcbf",
		"test": "phpunit",
		"test:coverage": "phpunit --coverage-html coverage"
	}
}
```

## Best Practices

### 1. Test Organization

```php
// Good: Descriptive test names
public function test_sanitize_input_removes_html_tags() { }
public function test_sanitize_input_preserves_unicode() { }

// Bad: Generic test names
public function test_sanitize() { }
public function test_it_works() { }
```

### 2. One Assertion Per Concept

```php
// Good: Test one concept
public function test_post_has_correct_title() {
	$post = get_post( $this->post_id );
	$this->assertEquals( 'Expected Title', $post->post_title );
}

public function test_post_has_correct_status() {
	$post = get_post( $this->post_id );
	$this->assertEquals( 'publish', $post->post_status );
}

// Avoid: Testing multiple concepts in one test
public function test_post() {
	$post = get_post( $this->post_id );
	$this->assertEquals( 'Expected Title', $post->post_title );
	$this->assertEquals( 'publish', $post->post_status );
	$this->assertNotEmpty( $post->post_content );
}
```

### 3. Clean Up After Tests

```php
public function setUp(): void {
	parent::setUp();
	$this->post_id = $this->factory()->post->create();
}

public function tearDown(): void {
	// Always clean up
	wp_delete_post( $this->post_id, true );
	parent::tearDown();
}
```

### 4. Use WordPress Factories

```php
// Create test data easily
$post_id = $this->factory()->post->create( [
	'post_title' => 'Test Post',
] );

$user_id = $this->factory()->user->create( [
	'role' => 'editor',
] );

$term_id = $this->factory()->term->create( [
	'taxonomy' => 'category',
	'name'     => 'Test Category',
] );
```

### 5. Test Error Conditions

```php
public function test_function_with_valid_input() {
	$result = mytheme_process_data( 'valid' );
	$this->assertTrue( $result );
}

public function test_function_with_invalid_input() {
	$result = mytheme_process_data( '' );
	$this->assertFalse( $result );
}

public function test_function_with_null_input() {
	$result = mytheme_process_data( null );
	$this->assertInstanceOf( WP_Error::class, $result );
}
```

### 6. Follow WordPress Coding Standards

```php
// Good: WordPress style
public function test_my_function() {
	$my_variable = 'test';
	$result      = my_function( $my_variable );

	$this->assertEquals( 'expected', $result );
}

// Avoid: Non-WordPress style
public function testMyFunction() {
	$myVariable = 'test';
	$result = myFunction($myVariable);
	$this->assertEquals('expected', $result);
}
```

### 7. Use Meaningful Test Data

```php
// Good: Clear test intent
public function test_sanitize_removes_script_tags() {
	$malicious_input = '<script>alert("xss")</script>Hello';
	$expected_output = 'Hello';

	$result = mytheme_sanitize( $malicious_input );

	$this->assertEquals( $expected_output, $result );
}

// Avoid: Unclear test intent
public function test_sanitize() {
	$input = 'abc123xyz';
	$this->assertEquals( 'abc123xyz', mytheme_sanitize( $input ) );
}
```

## Resources

### Official Documentation

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [WordPress PHPUnit Testing](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)
- [WPCS Documentation](https://github.com/WordPress/WordPress-Coding-Standards)
- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)

### Project-Specific

- [Testing Guide](../../docs/TESTING.md) - Overall testing strategy
- [Jest Testing Instructions](./jest-tests.instructions.md) - JavaScript unit tests
- [Playwright Testing Instructions](./playwright-tests.instructions.md) - E2E tests
- [Contributing Guide](../../CONTRIBUTING.md) - Contribution workflow

### Quick Reference

```bash
# Run tests
composer run test              # All PHP tests
composer run test:coverage     # With coverage
npm run test:php               # Via NPM

# Lint PHP
composer run lint              # Check coding standards
composer run lint:fix          # Auto-fix issues
npm run lint:php               # Via NPM
npm run lint:php:fix           # Via NPM

# Specific tests
vendor/bin/phpunit tests/php/test-theme-setup.php
vendor/bin/phpunit --filter test_theme_supports

# Coverage
composer run test:coverage
open coverage/index.html

# PHPCS
vendor/bin/phpcs inc/
vendor/bin/phpcbf inc/
vendor/bin/phpcs --standard=PHPCompatibilityWP --runtime-set testVersion 7.4-
```

---

**Last Updated**: 2025-12-16
**Maintainers**: LightSpeedWP Engineering Team
