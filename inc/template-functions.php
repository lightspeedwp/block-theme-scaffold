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
function {{theme_slug}}_get_version() {
	return {{theme_slug|upper}}_VERSION;
}

/**
 * Add body classes.
 *
 * @param array $classes Existing classes.
 * @return array
 */
function {{theme_slug}}_body_classes( $classes ) {

	// Add theme version class.
	$classes[] = '{{theme_slug}}-version-' . str_replace( '.', '-', {{theme_slug}}_get_version() );

	// Add no-js class (removed by JavaScript).
	$classes[] = 'no-js';

	return $classes;
}
add_filter( 'body_class', '{{theme_slug}}_body_classes' );

/**
 * Add viewport meta tag for mobile.
 */
function {{theme_slug}}_viewport_meta() {
	echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
}
add_action( 'wp_head', '{{theme_slug}}_viewport_meta', 1 );

/**
 * Add theme support for custom logo.
 */
function {{theme_slug}}_custom_logo_setup() {
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
add_action( 'after_setup_theme', '{{theme_slug}}_custom_logo_setup' );

/**
 * Add editor color palette support.
 */
function {{theme_slug}}_editor_color_palette() {
       add_theme_support(
	       'editor-color-palette',
	       array(
		       array(
			       'name'  => __( 'Primary', '{{theme_slug}}' ),
			       'slug'  => 'primary',
			       'color' => '{{primary_color}}',
		       ),
		       array(
			       'name'  => __( 'Secondary', '{{theme_slug}}' ),
			       'slug'  => 'secondary',
			       'color' => '{{secondary_color}}',
		       ),
		       array(
			       'name'  => __( 'Background', '{{theme_slug}}' ),
			       'slug'  => 'background',
			       'color' => '{{background_color}}',
		       ),
		       array(
			       'name'  => __( 'Foreground', '{{theme_slug}}' ),
			       'slug'  => 'foreground',
			       'color' => '{{text_color}}',
		       ),
	       )
       );
}
add_action( 'after_setup_theme', '{{theme_slug}}_editor_color_palette' );

/**
 * Custom excerpt length for different post types.
 *
 * @param int $length Current excerpt length.
 * @return int
 */
function {{theme_slug}}_custom_excerpt_length( $length ) {
	if ( is_admin() ) {
		return $length;
	}

	       if ( is_home() || is_archive() ) {
		       return {{archive_excerpt_length}};
	       }

	return $length;
}
add_filter( 'excerpt_length', '{{theme_slug}}_custom_excerpt_length' );

/**
 * Remove unnecessary generator meta tags.
 */
function {{theme_slug}}_remove_version() {
	return '';
}
add_filter( 'the_generator', '{{theme_slug}}_remove_version' );

/**
 * Add security headers.
 */
function {{theme_slug}}_security_headers() {
	if ( ! is_admin() ) {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'X-XSS-Protection: 1; mode=block' );
	}
}
add_action( 'send_headers', '{{theme_slug}}_security_headers' );
