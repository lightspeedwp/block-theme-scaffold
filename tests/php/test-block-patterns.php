<?php
/**
 * Test block patterns functionality
 *
 * @package {{theme_name}}
 */

class Test_Block_Patterns extends WP_UnitTestCase {

	/**
	 * Set up test environment
	 */
	public function set_up() {
		parent::set_up();

		// Clear pattern registry before each test
		$registry = WP_Block_Patterns_Registry::get_instance();
		foreach ( $registry->get_all_registered() as $pattern ) {
			if ( strpos( $pattern['name'], '{{theme_slug}}/' ) === 0 ) {
				$registry->unregister( $pattern['name'] );
			}
		}
	}

	/**
	 * Test hero pattern registration function exists
	 */
	public function test_hero_pattern_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_register_hero_pattern' ),
			'Hero pattern registration function should exist'
		);
	}

	/**
	 * Test CTA pattern registration function exists
	 */
	public function test_cta_pattern_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_register_cta_pattern' ),
			'CTA pattern registration function should exist'
		);
	}

	/**
	 * Test team pattern registration function exists
	 */
	public function test_team_pattern_function_exists() {
		$this->assertTrue(
			function_exists( '{{theme_slug}}_register_team_pattern' ),
			'Team pattern registration function should exist'
		);
	}

	/**
	 * Test hero pattern is registered
	 */
	public function test_hero_pattern_registered() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$pattern = $registry->get_registered( '{{theme_slug}}/hero-section' );

			$this->assertNotNull( $pattern, 'Hero pattern should be registered' );
			$this->assertArrayHasKey( 'title', $pattern );
			$this->assertArrayHasKey( 'content', $pattern );
			$this->assertArrayHasKey( 'categories', $pattern );

			$this->assertStringContainsString( 'Hero Section', $pattern['title'] );
			$this->assertStringContainsString( 'wp-block-group', $pattern['content'] );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing hero pattern: ' . $e->getMessage() );
		}
	}

	/**
	 * Test CTA pattern is registered
	 */
	public function test_cta_pattern_registered() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$pattern = $registry->get_registered( '{{theme_slug}}/call-to-action' );

			$this->assertNotNull( $pattern, 'CTA pattern should be registered' );
			$this->assertArrayHasKey( 'title', $pattern );
			$this->assertStringContainsString( 'Call to Action', $pattern['title'] );
			$this->assertStringContainsString( 'wp-block-button', $pattern['content'] );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing CTA pattern: ' . $e->getMessage() );
		}
	}

	/**
	 * Test team pattern is registered
	 */
	public function test_team_pattern_registered() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$pattern = $registry->get_registered( '{{theme_slug}}/team-section' );

			$this->assertNotNull( $pattern, 'Team pattern should be registered' );
			$this->assertArrayHasKey( 'title', $pattern );
			$this->assertStringContainsString( 'Team Section', $pattern['title'] );
			$this->assertStringContainsString( 'wp-block-columns', $pattern['content'] );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing team pattern: ' . $e->getMessage() );
		}
	}

	/**
	 * Test pattern categories
	 */
	public function test_pattern_categories() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$hero = $registry->get_registered( '{{theme_slug}}/hero-section' );

			$this->assertIsArray( $hero['categories'], 'Pattern should have categories array' );
			$this->assertNotEmpty( $hero['categories'], 'Pattern categories should not be empty' );
			$this->assertContains( '{{theme_slug}}-hero', $hero['categories'] );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing pattern categories: ' . $e->getMessage() );
		}
	}

	/**
	 * Test pattern keywords
	 */
	public function test_pattern_keywords() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$hero = $registry->get_registered( '{{theme_slug}}/hero-section' );

			$this->assertArrayHasKey( 'keywords', $hero );
			$this->assertIsArray( $hero['keywords'] );
			$this->assertNotEmpty( $hero['keywords'], 'Pattern keywords should not be empty' );
		} catch ( Exception $e ) {
			$this->fail( 'Error testing pattern keywords: ' . $e->getMessage() );
		}
	}

	/**
	 * Test pattern content is valid HTML
	 */
	public function test_pattern_content_is_valid() {
		try {
			do_action( 'init' );

			$registry = WP_Block_Patterns_Registry::get_instance();
			$patterns = [
				'{{theme_slug}}/hero-section',
				'{{theme_slug}}/call-to-action',
				'{{theme_slug}}/team-section',
			];

			foreach ( $patterns as $pattern_name ) {
				$pattern = $registry->get_registered( $pattern_name );
				$this->assertNotEmpty( $pattern['content'], "Pattern {$pattern_name} should have content" );

				// Check for block comments
				$this->assertStringContainsString( '<!-- wp:', $pattern['content'], 'Pattern content should contain block markup' );
			}
		} catch ( Exception $e ) {
			$this->fail( 'Error validating pattern content: ' . $e->getMessage() );
		}
	}
}
