<?php
/**
 * PHPUnit bootstrap: unit tests run without WordPress.
 *
 * WordPress functions are stubbed per test with Brain Monkey (see TestCase).
 * The theme's files are loaded once here, with the functions they call
 * at load time stubbed.
 *
 * @package {{theme_slug}}
 */

require_once __DIR__ . '/../../vendor/autoload.php';

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

Brain\Monkey\setUp();
Brain\Monkey\Functions\when( 'get_theme_file_path' )->alias(
	static fn( $file = '' ) => dirname( __DIR__, 2 ) . '/' . $file
);
require_once dirname( __DIR__, 2 ) . '/functions.php';

// Every add_action()/add_filter() call in the theme, and whether it was
// registered at load, for ThemeSetupTest::test_hooks_are_registered().
$GLOBALS['{{theme_slug|snakeCase}}_hooks'] = array();
foreach ( array_merge( array( dirname( __DIR__, 2 ) . '/functions.php' ), glob( dirname( __DIR__, 2 ) . '/inc/*.php' ) ) as ${{theme_slug|snakeCase}}_file ) {
	preg_match_all( "/add_(action|filter)\\(\\s*'([^']+)',\\s*'([^']+)'/", file_get_contents( ${{theme_slug|snakeCase}}_file ), ${{theme_slug|snakeCase}}_matches, PREG_SET_ORDER );
	foreach ( ${{theme_slug|snakeCase}}_matches as ${{theme_slug|snakeCase}}_match ) {
		$GLOBALS['{{theme_slug|snakeCase}}_hooks'][] = array(
			'hook'       => ${{theme_slug|snakeCase}}_match[2],
			'callback'   => ${{theme_slug|snakeCase}}_match[3],
			// Brain Monkey keeps actions and filters apart.
			'registered' => false !== ( 'action' === ${{theme_slug|snakeCase}}_match[1] ? has_action( ${{theme_slug|snakeCase}}_match[2], ${{theme_slug|snakeCase}}_match[3] ) : has_filter( ${{theme_slug|snakeCase}}_match[2], ${{theme_slug|snakeCase}}_match[3] ) ),
		);
	}
}
Brain\Monkey\tearDown();

require_once __DIR__ . '/TestCase.php';
