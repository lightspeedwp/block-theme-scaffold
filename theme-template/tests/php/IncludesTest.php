<?php
/**
 * Tests for inc/block-patterns.php, inc/block-styles.php and
 * inc/template-functions.php.
 *
 * @package {{theme_slug}}
 */

namespace {{theme_slug|pascalCase}}\Tests;

use Brain\Monkey\Functions;

/**
 * Include file tests.
 */
class IncludesTest extends TestCase {

	/**
	 * Each PHP-registered pattern is prefixed, categorised and has no
	 * placeholder left from generation.
	 *
	 * @return void
	 */
	public function test_block_patterns() {
		$patterns = array();
		Functions\when( 'register_block_pattern' )->alias(
			static function ( $name, $args ) use ( &$patterns ) {
				$patterns[ $name ] = $args;
			}
		);

		{{theme_slug|snakeCase}}_register_hero_pattern();
		{{theme_slug|snakeCase}}_register_cta_pattern();
		{{theme_slug|snakeCase}}_register_team_pattern();

		$this->assertSame(
			array( '{{theme_slug}}/hero-section', '{{theme_slug}}/call-to-action', '{{theme_slug}}/team-section' ),
			array_keys( $patterns )
		);
		foreach ( $patterns as $name => $args ) {
			$this->assertNotEmpty( $args['title'], $name );
			$this->assertNotEmpty( $args['categories'], $name );
			$this->assertStringStartsWith( '{{theme_slug}}-', $args['categories'][0], $name );
			$this->assertStringNotContainsString( '{{', $args['content'], $name );
		}
	}

	/**
	 * Block styles are registered on core blocks only.
	 *
	 * @return void
	 */
	public function test_block_styles() {
		$styles = array();
		Functions\when( 'register_block_style' )->alias(
			static function ( $block, $args ) use ( &$styles ) {
				$styles[] = $block . ':' . $args['name'];
			}
		);

		{{theme_slug|snakeCase}}_register_block_styles();

		$this->assertContains( 'core/button:outline', $styles );
		$this->assertContains( 'core/group:shadow', $styles );
		foreach ( $styles as $style ) {
			$this->assertStringStartsWith( 'core/', $style );
		}
	}

	/**
	 * Body classes gain the theme version and no-js.
	 *
	 * @return void
	 */
	public function test_body_classes() {
		$classes = {{theme_slug|snakeCase}}_body_classes( array( 'home' ) );

		$this->assertSame( 'home', $classes[0] );
		$this->assertContains( '{{theme_slug}}-version-' . str_replace( '.', '-', {{theme_slug|upper}}_VERSION ), $classes );
		$this->assertContains( 'no-js', $classes );
	}

	/**
	 * The custom logo support has the theme's logo size.
	 *
	 * @return void
	 */
	public function test_custom_logo_support() {
		Functions\expect( 'add_theme_support' )->once()->with(
			'custom-logo',
			\Mockery::on( static fn( $args ) => {{logo_width}} === $args['width'] && {{logo_height}} === $args['height'] )
		);

		{{theme_slug|snakeCase}}_custom_logo_setup();
	}

	/**
	 * The generator tag is removed.
	 *
	 * @return void
	 */
	public function test_generator_is_removed() {
		$this->assertSame( '', {{theme_slug|snakeCase}}_remove_version() );
	}
}
