<?php
/**
 * Tests for inc/block-stylesheets.php.
 *
 * @package {{theme_slug}}
 */

namespace {{theme_slug|pascalCase}}\Tests;

use Brain\Monkey\Functions;

/**
 * Per-block stylesheet loader tests.
 */
class BlockStylesheetsTest extends TestCase {

	/**
	 * Each built core-*.css file is registered for its block, the -rtl.css
	 * copy is skipped, and the version comes from the .asset.php file.
	 *
	 * @return void
	 */
	public function test_registers_each_core_block_stylesheet() {
		$this->use_build_dir( __DIR__ . '/fixtures/' );
		$calls = array();
		Functions\when( 'wp_enqueue_block_style' )->alias(
			static function ( $block, $args ) use ( &$calls ) {
				$calls[ $block ] = $args;
			}
		);

		{{theme_slug|snakeCase}}_enqueue_block_stylesheets();

		$this->assertSame( array( 'core/button', 'core/post-title' ), array_keys( $calls ) );
		$this->assertSame(
			array(
				'handle' => '{{theme_slug}}-block-core-button',
				'src'    => 'https://example.com/theme/build/styles/core-button.css',
				'path'   => __DIR__ . '/fixtures/build/styles/core-button.css',
				'ver'    => 'button-hash',
			),
			$calls['core/button']
		);
		// No .asset.php file: falls back to the theme version.
		$this->assertSame( {{theme_slug|upper}}_VERSION, $calls['core/post-title']['ver'] );
	}

	/**
	 * Nothing is registered before the theme has been built.
	 *
	 * @return void
	 */
	public function test_does_nothing_without_a_build() {
		$this->use_build_dir( __DIR__ . '/fixtures/missing/' );
		Functions\expect( 'wp_enqueue_block_style' )->never();

		{{theme_slug|snakeCase}}_enqueue_block_stylesheets();
	}

	/**
	 * Resolve theme file paths from the given directory.
	 *
	 * @param string $dir Directory standing in for the theme root.
	 * @return void
	 */
	private function use_build_dir( $dir ) {
		Functions\when( 'get_theme_file_path' )->alias( static fn( $file = '' ) => $dir . $file );
		Functions\when( 'get_theme_file_uri' )->alias( static fn( $file = '' ) => 'https://example.com/theme/' . $file );
	}
}
