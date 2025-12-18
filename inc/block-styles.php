<?php
/**
 * Block styles registration for {{theme_name}}
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom block styles.
 */
function {{theme_slug}}_register_block_styles() {
	// Button styles.
	register_block_style(
		'core/button',
		array(
			'name'  => 'outline',
			'label' => __( 'Outline', '{{theme_slug}}' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'ghost',
			'label' => __( 'Ghost', '{{theme_slug}}' ),
		)
	);

	// Quote styles.
	register_block_style(
		'core/quote',
		array(
			'name'  => 'modern',
			'label' => __( 'Modern', '{{theme_slug}}' ),
		)
	);

	// Group styles.
	register_block_style(
		'core/group',
		array(
			'name'  => 'shadow',
			'label' => __( 'Shadow', '{{theme_slug}}' ),
		)
	);

	register_block_style(
		'core/group',
		array(
			'name'  => 'border',
			'label' => __( 'Border', '{{theme_slug}}' ),
		)
	);

	// Image styles.
	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded',
			'label' => __( 'Rounded', '{{theme_slug}}' ),
		)
	);

	// Post title styles.
	register_block_style(
		'core/post-title',
		array(
			'name'  => 'gradient',
			'label' => __( 'Gradient', '{{theme_slug}}' ),
		)
	);
}
add_action( 'init', '{{theme_slug}}_register_block_styles' );
