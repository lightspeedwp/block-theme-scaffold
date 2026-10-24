<?php
/**
 * Template functions for {{theme_name}}
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the theme version.
 *
 * @return string
 */
function {{theme_slug|snakeCase}}_get_version() {
	return {{theme_slug|upper}}_VERSION;
}

/**
 * Add body classes.
 *
 * @param string[] $classes Existing classes.
 * @return string[]
 */
function {{theme_slug|snakeCase}}_body_classes( $classes ) {

	// Add theme version class.
	$classes[] = '{{theme_slug}}-version-' . str_replace( '.', '-', {{theme_slug|snakeCase}}_get_version() );

	// Add no-js class (removed by JavaScript).
	$classes[] = 'no-js';

	return $classes;
}
add_filter( 'body_class', '{{theme_slug|snakeCase}}_body_classes' );

/**
 * Add theme support for custom logo.
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_custom_logo_setup() {
		add_theme_support(
			'custom-logo',
			array(
				'height'      => {{logo_height}},
				'width'       => {{logo_width}},
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
}
add_action( 'after_setup_theme', '{{theme_slug|snakeCase}}_custom_logo_setup' );

/**
 * Remove unnecessary generator meta tags.
 *
 * @return string
 */
function {{theme_slug|snakeCase}}_remove_version() {
	return '';
}
add_filter( 'the_generator', '{{theme_slug|snakeCase}}_remove_version' );

/**
 * Add security headers.
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_security_headers() {
	if ( ! is_admin() ) {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'X-XSS-Protection: 1; mode=block' );
	}
}
add_action( 'send_headers', '{{theme_slug|snakeCase}}_security_headers' );
