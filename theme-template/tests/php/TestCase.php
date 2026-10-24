<?php
/**
 * Base test case: sets up and tears down Brain Monkey around each test.
 *
 * @package {{theme_slug}}
 */

namespace {{theme_slug|pascalCase}}\Tests;

use Brain\Monkey;
use Yoast\PHPUnitPolyfills\TestCases\TestCase as PolyfillTestCase;

/**
 * Base class for the theme's unit tests.
 */
abstract class TestCase extends PolyfillTestCase {

	/**
	 * Start Brain Monkey and stub the translation and escaping functions.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		Monkey\setUp();
		Monkey\Functions\stubTranslationFunctions();
		Monkey\Functions\stubEscapeFunctions();
	}

	/**
	 * Stop Brain Monkey.
	 *
	 * @return void
	 */
	protected function tear_down() {
		// Count Brain Monkey and Mockery expectations as assertions.
		$this->addToAssertionCount( \Mockery::getContainer()->mockery_getExpectationCount() );
		Monkey\tearDown();
		parent::tear_down();
	}
}
