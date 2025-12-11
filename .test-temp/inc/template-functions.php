<?php
/**
 * Template functions for Block Theme Scaffold
 *
 * @package Block Theme Scaffold
 * @since 1.0.0
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
function block-theme-scaffold_get_version() {
	return {{theme_slug|upper}}_VERSION;
}

/**
 * Add body classes.
 *
 * @param array $classes Existing classes.
 * @return array
 */
function block-theme-scaffold_body_classes( $classes ) {

	// Add theme version class.
	$classes[] = 'block-theme-scaffold-version-' . str_replace( '.', '-', block-theme-scaffold_get_version() );

	// Add no-js class (removed by JavaScript).
	$classes[] = 'no-js';

	return $classes;
}
add_filter( 'body_class', 'block-theme-scaffold_body_classes' );

/**
 * Add viewport meta tag for mobile.
 */
function block-theme-scaffold_viewport_meta() {
	echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
}
add_action( 'wp_head', 'block-theme-scaffold_viewport_meta', 1 );

/**
 * Add theme support for custom logo.
 */
function block-theme-scaffold_custom_logo_setup() {
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
add_action( 'after_setup_theme', 'block-theme-scaffold_custom_logo_setup' );

/**
 * Add editor color palette support.
 */
function block-theme-scaffold_editor_color_palette() {
	add_theme_support(
		'editor-color-palette',
		array(
			array(
				'name'  => __( 'Primary', 'block-theme-scaffold' ),
				'slug'  => 'primary',
				'color' => '#0073aa',
			),
			array(
				'name'  => __( 'Secondary', 'block-theme-scaffold' ),
				'slug'  => 'secondary',
				'color' => '#005177',
			),
			array(
				'name'  => __( 'Background', 'block-theme-scaffold' ),
				'slug'  => 'background',
				'color' => '#ffffff',
			),
			array(
				'name'  => __( 'Foreground', 'block-theme-scaffold' ),
				'slug'  => 'foreground',
				'color' => '#1e1e1e',
			),
		)
	);
}
add_action( 'after_setup_theme', 'block-theme-scaffold_editor_color_palette' );

/**
 * Custom excerpt length for different post types.
 *
 * @param int $length Current excerpt length.
 * @return int
 */
function block-theme-scaffold_custom_excerpt_length( $length ) {
	if ( is_admin() ) {
		return $length;
	}

	if ( is_home() || is_archive() ) {
		return {{archive_excerpt_length}};
	}

	return $length;
}
add_filter( 'excerpt_length', 'block-theme-scaffold_custom_excerpt_length' );

/**
 * Remove unnecessary generator meta tags.
 */
function block-theme-scaffold_remove_version() {
	return '';
}
add_filter( 'the_generator', 'block-theme-scaffold_remove_version' );

/**
 * Add security headers.
 */
function block-theme-scaffold_security_headers() {
	if ( ! is_admin() ) {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'X-XSS-Protection: 1; mode=block' );
	}
}
add_action( 'send_headers', 'block-theme-scaffold_security_headers' );