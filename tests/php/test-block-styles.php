<?php
/**
 * Test block styles functionality
 *
 * @package {{theme_name}}
 */

class Test_Block_Styles extends WP_UnitTestCase {

	/**
	 * Set up test environment
	 */
	public function set_up() {
		parent::set_up();

		// Ensure init action fires
		do_action( 'init' );
	}

	/**
	 * Test block styles registration function exists
	 */
	public function test_block_styles_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_register_block_styles' ),
			'Block styles registration function should exist'
		);
	}

	/**
	 * Test button block styles are registered
	 */
	public function test_button_styles_registered() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$button_styles = $registry->get_registered_styles( 'core/button' );

			$this->assertNotEmpty( $button_styles, 'Button block should have styles' );

			$style_names = wp_list_pluck( $button_styles, 'name' );
			$this->assertContains( 'outline', $style_names, 'Button should have outline style' );
			$this->assertContains( 'ghost', $style_names, 'Button should have ghost style' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing button styles: ' . $e->getMessage() );
		}
	}

	/**
	 * Test quote block styles are registered
	 */
	public function test_quote_styles_registered() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$quote_styles = $registry->get_registered_styles( 'core/quote' );

			$this->assertNotEmpty( $quote_styles, 'Quote block should have styles' );

			$style_names = wp_list_pluck( $quote_styles, 'name' );
			$this->assertContains( 'modern', $style_names, 'Quote should have modern style' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing quote styles: ' . $e->getMessage() );
		}
	}

	/**
	 * Test group block styles are registered
	 */
	public function test_group_styles_registered() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$group_styles = $registry->get_registered_styles( 'core/group' );

			$this->assertNotEmpty( $group_styles, 'Group block should have styles' );

			$style_names = wp_list_pluck( $group_styles, 'name' );
			$this->assertContains( 'shadow', $style_names, 'Group should have shadow style' );
			$this->assertContains( 'border', $style_names, 'Group should have border style' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing group styles: ' . $e->getMessage() );
		}
	}

	/**
	 * Test image block styles are registered
	 */
	public function test_image_styles_registered() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$image_styles = $registry->get_registered_styles( 'core/image' );

			$this->assertNotEmpty( $image_styles, 'Image block should have styles' );

			$style_names = wp_list_pluck( $image_styles, 'name' );
			$this->assertContains( 'rounded', $style_names, 'Image should have rounded style' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing image styles: ' . $e->getMessage() );
		}
	}

	/**
	 * Test post title block styles are registered
	 */
	public function test_post_title_styles_registered() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$post_title_styles = $registry->get_registered_styles( 'core/post-title' );

			$this->assertNotEmpty( $post_title_styles, 'Post title block should have styles' );

			$style_names = wp_list_pluck( $post_title_styles, 'name' );
			$this->assertContains( 'gradient', $style_names, 'Post title should have gradient style' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing post title styles: ' . $e->getMessage() );
		}
	}

	/**
	 * Test all block styles have labels
	 */
	public function test_all_styles_have_labels() {
		try {
			$registry = WP_Block_Styles_Registry::get_instance();
			$blocks = [ 'core/button', 'core/quote', 'core/group', 'core/image', 'core/post-title' ];

			foreach ( $blocks as $block ) {
				$styles = $registry->get_registered_styles( $block );

				foreach ( $styles as $style ) {
					$this->assertNotEmpty(
						$style['label'],
						"Style '{$style['name']}' for block '{$block}' should have a label"
					);
				}
			}
		} catch ( Exception $e ) {
			$this->fail( 'Error testing style labels: ' . $e->getMessage() );
		}
	}
}
