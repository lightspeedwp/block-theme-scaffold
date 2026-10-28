<?php
/**
 * Tests for the theme setup, asset and excerpt functions in functions.php.
 *
 * @package {{theme_slug}}
 */

namespace {{theme_slug|pascalCase}}\Tests;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;

/**
 * Theme setup tests.
 */
class ThemeSetupTest extends TestCase {

	/**
	 * Setup adds the theme supports and the filtered content width.
	 *
	 * @return void
	 */
	public function test_setup_adds_supports_and_content_width() {
		Functions\expect( 'load_theme_textdomain' )->once()->with( '{{theme_slug}}', \Mockery::type( 'string' ) );
		Functions\when( 'get_template_directory' )->justReturn( '/theme' );
		Functions\expect( 'add_editor_style' )->once()->with( 'build/css/editor-style.css' );
		$supports = array();
		Functions\when( 'add_theme_support' )->alias(
			static function ( $feature ) use ( &$supports ) {
				$supports[] = $feature;
			}
		);
		Filters\expectApplied( '{{theme_slug|snakeCase}}_content_width' )->once()->with( {{content_width_num}} )->andReturn( 640 );

		{{theme_slug|snakeCase}}_setup();

		foreach ( array( 'wp-block-styles', 'editor-styles', 'responsive-embeds', 'post-thumbnails' ) as $feature ) {
			$this->assertContains( $feature, $supports );
		}
		$this->assertSame( 640, $GLOBALS['content_width'] );
	}

	/**
	 * The front end enqueues the built stylesheet and script at the paths
	 * webpack writes, with the dependencies and version from .asset.php.
	 *
	 * @return void
	 */
	public function test_enqueue_assets_uses_build_paths_and_asset_files() {
		$this->use_fixture_build();
		Functions\when( 'get_theme_file_uri' )->alias( static fn( $file ) => 'https://example.test/' . $file );
		Functions\expect( 'wp_enqueue_style' )->once()->with( '{{theme_slug}}-style', 'https://example.test/build/css/style.css', array( 'wp-a11y' ), 'abc123' );
		Functions\expect( 'wp_enqueue_script' )->once()->with( '{{theme_slug}}-script', 'https://example.test/build/js/theme.js', array( 'wp-a11y' ), 'abc123', true );
		Functions\expect( 'wp_set_script_translations' )->once()->with( '{{theme_slug}}-script', '{{theme_slug}}', \Mockery::type( 'string' ) );

		{{theme_slug|snakeCase}}_enqueue_assets();
	}

	/**
	 * The editor enqueues the built editor stylesheet and script.
	 *
	 * @return void
	 */
	public function test_enqueue_editor_assets_uses_build_paths() {
		$this->use_fixture_build();
		Functions\when( 'get_theme_file_uri' )->alias( static fn( $file ) => 'https://example.test/' . $file );
		Functions\expect( 'wp_enqueue_style' )->once()->with( '{{theme_slug}}-editor-style', 'https://example.test/build/css/editor-style.css', array( 'wp-a11y' ), 'abc123' );
		Functions\expect( 'wp_enqueue_script' )->once()->with( '{{theme_slug}}-editor-script', 'https://example.test/build/js/editor.js', array( 'wp-a11y' ), 'abc123', true );
		Functions\expect( 'wp_set_script_translations' )->once();

		{{theme_slug|snakeCase}}_enqueue_editor_assets();
	}

	/**
	 * Nothing is enqueued before a build.
	 *
	 * @return void
	 */
	public function test_enqueue_assets_skips_missing_build() {
		Functions\when( 'get_theme_file_path' )->justReturn( '/missing/file.php' );
		Functions\expect( 'wp_enqueue_style' )->never();
		Functions\expect( 'wp_enqueue_script' )->never();

		{{theme_slug|snakeCase}}_enqueue_assets();
		{{theme_slug|snakeCase}}_enqueue_editor_assets();
	}

	/**
	 * Every pattern category uses the theme prefix.
	 *
	 * @return void
	 */
	public function test_pattern_categories_are_prefixed() {
		$slugs = array();
		Functions\when( 'register_block_pattern_category' )->alias(
			static function ( $slug ) use ( &$slugs ) {
				$slugs[] = $slug;
			}
		);

		{{theme_slug|snakeCase}}_register_pattern_categories();

		$this->assertCount( 6, $slugs );
		foreach ( $slugs as $slug ) {
			$this->assertStringStartsWith( '{{theme_slug}}-', $slug );
		}
	}

	/**
	 * The image sizes are registered with the theme prefix.
	 *
	 * @return void
	 */
	public function test_image_sizes() {
		Functions\expect( 'add_image_size' )->times( 3 )->with( \Mockery::pattern( '/^{{theme_slug}}-/' ), \Mockery::type( 'int' ), \Mockery::type( 'int' ), true );

		{{theme_slug|snakeCase}}_add_image_sizes();
	}

	/**
	 * Excerpts are shorter on the blog and archives only.
	 *
	 * @return void
	 */
	public function test_excerpt_length() {
		Functions\when( 'is_admin' )->justReturn( false );
		Functions\when( 'is_home' )->justReturn( true );
		Functions\when( 'is_archive' )->justReturn( false );
		$this->assertSame( {{archive_excerpt_length}}, {{theme_slug|snakeCase}}_excerpt_length() );

		Functions\when( 'is_home' )->justReturn( false );
		$this->assertSame( {{excerpt_length}}, {{theme_slug|snakeCase}}_excerpt_length() );

		Functions\when( 'is_admin' )->justReturn( true );
		Functions\when( 'is_archive' )->justReturn( true );
		$this->assertSame( {{excerpt_length}}, {{theme_slug|snakeCase}}_excerpt_length() );

		$this->assertSame( '{{excerpt_more}}', {{theme_slug|snakeCase}}_excerpt_more() );
	}

	/**
	 * Every add_action()/add_filter() in the theme registers when the theme
	 * loads, and names a function that exists.
	 *
	 * @return void
	 */
	public function test_hooks_are_registered() {
		$this->assertGreaterThanOrEqual( 15, count( $GLOBALS['{{theme_slug|snakeCase}}_hooks'] ) );
		foreach ( $GLOBALS['{{theme_slug|snakeCase}}_hooks'] as $hook ) {
			$this->assertTrue( $hook['registered'], $hook['hook'] . ' => ' . $hook['callback'] );
			$this->assertTrue( function_exists( $hook['callback'] ), $hook['callback'] );
		}
	}

	/**
	 * Resolve theme files from tests/php/fixtures.
	 *
	 * @return void
	 */
	private function use_fixture_build() {
		Functions\when( 'get_theme_file_path' )->alias( static fn( $file = '' ) => __DIR__ . '/fixtures/' . $file );
	}
}
