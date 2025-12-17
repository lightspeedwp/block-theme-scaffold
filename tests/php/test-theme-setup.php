<?php
/**
 * Test theme setup and basic functionality
 *
 * @package {{theme_name}}
 */

class Test_Theme_Setup extends WP_UnitTestCase {

	/**
	 * Test theme setup function exists
	 */
	public function test_theme_setup_function_exists() {
		$this->assertTrue( function_exists( '{{theme_slug}}_setup' ) );
	}

	/**
	 * Test theme supports required features
	 */
	public function test_theme_supports() {
		$this->assertTrue( current_theme_supports( 'wp-block-styles' ) );
		$this->assertTrue( current_theme_supports( 'responsive-embeds' ) );
		$this->assertTrue( current_theme_supports( 'editor-styles' ) );
		$this->assertTrue( current_theme_supports( 'html5' ) );
		$this->assertTrue( current_theme_supports( 'automatic-feed-links' ) );
		$this->assertTrue( current_theme_supports( 'post-thumbnails' ) );
		$this->assertTrue( current_theme_supports( 'align-wide' ) );
		$this->assertTrue( current_theme_supports( 'custom-logo' ) );
	}

	/**
	 * Test theme version constant is defined
	 */
	public function test_theme_version_constant() {
		$this->assertTrue( defined( '{{theme_slug|upper}}_VERSION' ) );
		$this->assertNotEmpty( constant( '{{theme_slug|upper}}_VERSION' ) );
	}

	/**
	 * Test content width is set
	 */
	public function test_content_width() {
		global $content_width;
		$this->assertNotEmpty( $content_width );
		$this->assertIsInt( $content_width );
	}

	/**
	 * Test theme includes are loaded
	 */
	public function test_theme_includes() {
		$this->assertTrue( function_exists( '{{theme_slug}}_register_pattern_categories' ) );
		$this->assertTrue( function_exists( '{{theme_slug}}_enqueue_assets' ) );
		$this->assertTrue( function_exists( '{{theme_slug}}_enqueue_editor_assets' ) );
	}

	/**
	 * Test block pattern categories are registered
	 */
	public function test_block_pattern_categories() {
		$categories = WP_Block_Pattern_Categories_Registry::get_instance()->get_all_registered();
		$theme_categories = array_filter( $categories, function( $category ) {
			return strpos( $category['name'], '{{theme_slug}}-' ) === 0;
		});
		
		$this->assertNotEmpty( $theme_categories );
	}

	/**
	 * Test theme.json file exists and is valid
	 */
	public function test_theme_json_exists() {
		$theme_json_path = get_template_directory() . '/theme.json';
		$this->assertFileExists( $theme_json_path );
		
		$theme_json_content = file_get_contents( $theme_json_path );
		$theme_json_data = json_decode( $theme_json_content, true );
		
		$this->assertNotNull( $theme_json_data );
		$this->assertEquals( 2, $theme_json_data['version'] );
		$this->assertArrayHasKey( 'settings', $theme_json_data );
		$this->assertArrayHasKey( 'styles', $theme_json_data );
	}
}