<?php
/**
 * Test template functions
 *
 * @package {{theme_name}}
 */

class Test_Template_Functions extends WP_UnitTestCase {

	/**
	 * Test get version function exists
	 */
	public function test_get_version_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_get_version' ),
			'Get version function should exist'
		);
	}

	/**
	 * Test get version returns string
	 */
	public function test_get_version_returns_string() {
		try {
			$version = {{theme_slug}}_get_version();

			$this->assertIsString( $version, 'Version should be a string' );
			$this->assertNotEmpty( $version, 'Version should not be empty' );
		} catch ( Exception $e ) {
			$this->fail( 'Error getting version: ' . $e->getMessage() );
		}
	}

	/**
	 * Test get theme mod wrapper function
	 */
	public function test_get_theme_mod_wrapper() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_get_theme_mod' ),
			'Get theme mod wrapper should exist'
		);

		try {
			set_theme_mod( '{{theme_slug}}_test', 'test_value' );
			$value = {{theme_slug}}_get_theme_mod( 'test', 'default' );

			$this->assertEquals( 'test_value', $value, 'Should return theme mod value' );

			// Clean up
			remove_theme_mod( '{{theme_slug}}_test' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing theme mod wrapper: ' . $e->getMessage() );
		}
	}

	/**
	 * Test footer text function
	 */
	public function test_footer_text_function() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_footer_text' ),
			'Footer text function should exist'
		);

		try {
			set_theme_mod( '{{theme_slug}}_footer_text', 'Test Footer' );

			ob_start();
			{{theme_slug}}_footer_text();
			$output = ob_get_clean();

			$this->assertEquals( 'Test Footer', $output, 'Should output footer text' );

			// Clean up
			remove_theme_mod( '{{theme_slug}}_footer_text' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing footer text: ' . $e->getMessage() );
		}
	}

	/**
	 * Test show social links function
	 */
	public function test_show_social_links() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_show_social_links' ),
			'Show social links function should exist'
		);

		try {
			set_theme_mod( '{{theme_slug}}_show_social_links', false );
			$this->assertFalse( {{theme_slug}}_show_social_links() );

			set_theme_mod( '{{theme_slug}}_show_social_links', true );
			$this->assertTrue( {{theme_slug}}_show_social_links() );

			// Clean up
			remove_theme_mod( '{{theme_slug}}_show_social_links' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing social links: ' . $e->getMessage() );
		}
	}

	/**
	 * Test header layout class function
	 */
	public function test_header_layout_class() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_get_header_layout_class' ),
			'Get header layout class function should exist'
		);

		try {
			set_theme_mod( '{{theme_slug}}_header_layout', 'centered' );
			$class = {{theme_slug}}_get_header_layout_class();

			$this->assertEquals( 'header-layout-centered', $class, 'Should return correct class name' );

			// Clean up
			remove_theme_mod( '{{theme_slug}}_header_layout' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing header layout class: ' . $e->getMessage() );
		}
	}

	/**
	 * Test body classes filter
	 */
	public function test_body_classes_filter() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_body_classes' ),
			'Body classes function should exist'
		);

		try {
			$classes = {{theme_slug}}_body_classes( [] );

			$this->assertIsArray( $classes, 'Should return array' );
			$this->assertNotEmpty( $classes, 'Should add classes' );
			$this->assertContains( 'no-js', $classes, 'Should contain no-js class' );

			// Check for version class
			$version_class_found = false;
			foreach ( $classes as $class ) {
				if ( strpos( $class, '{{theme_slug}}-version-' ) === 0 ) {
					$version_class_found = true;
					break;
				}
			}
			$this->assertTrue( $version_class_found, 'Should contain version class' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing body classes: ' . $e->getMessage() );
		}
	}

	/**
	 * Test viewport meta function exists
	 */
	public function test_viewport_meta_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_viewport_meta' ),
			'Viewport meta function should exist'
		);
	}

	/**
	 * Test custom logo setup function exists
	 */
	public function test_custom_logo_setup_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_custom_logo_setup' ),
			'Custom logo setup function should exist'
		);
	}

	/**
	 * Test editor color palette function exists
	 */
	public function test_editor_color_palette_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_editor_color_palette' ),
			'Editor color palette function should exist'
		);
	}

	/**
	 * Test custom excerpt length function
	 */
	public function test_custom_excerpt_length() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_custom_excerpt_length' ),
			'Custom excerpt length function should exist'
		);

		try {
			// Test admin context (should not modify)
			set_current_screen( 'edit' );
			$length = {{theme_slug}}_custom_excerpt_length( 55 );
			$this->assertEquals( 55, $length, 'Should not modify length in admin' );

			// Clean up
			set_current_screen( 'front' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing excerpt length: ' . $e->getMessage() );
		}
	}

	/**
	 * Test remove version function
	 */
	public function test_remove_version() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_remove_version' ),
			'Remove version function should exist'
		);

		try {
			$result = {{theme_slug}}_remove_version();
			$this->assertEquals( '', $result, 'Should return empty string' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing remove version: ' . $e->getMessage() );
		}
	}

	/**
	 * Test security headers function exists
	 */
	public function test_security_headers_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_security_headers' ),
			'Security headers function should exist'
		);
	}
}
