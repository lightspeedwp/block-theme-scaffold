<?php
/**
 * Block styles registration for Block Theme Scaffold
 *
 * @package Block Theme Scaffold
 * @since 1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom block styles.
 */
function block-theme-scaffold_register_block_styles() {
	// Button styles.
	register_block_style(
		'core/button',
		array(
			'name'  => 'outline',
			'label' => __( 'Outline', 'block-theme-scaffold' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'ghost',
			'label' => __( 'Ghost', 'block-theme-scaffold' ),
		)
	);

	// Quote styles.
	register_block_style(
		'core/quote',
		array(
			'name'  => 'modern',
			'label' => __( 'Modern', 'block-theme-scaffold' ),
		)
	);

	// Group styles.
	register_block_style(
		'core/group',
		array(
			'name'  => 'shadow',
			'label' => __( 'Shadow', 'block-theme-scaffold' ),
		)
	);

	register_block_style(
		'core/group',
		array(
			'name'  => 'border',
			'label' => __( 'Border', 'block-theme-scaffold' ),
		)
	);

	// Image styles.
	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded',
			'label' => __( 'Rounded', 'block-theme-scaffold' ),
		)
	);

	// Post title styles.
	register_block_style(
		'core/post-title',
		array(
			'name'  => 'gradient',
			'label' => __( 'Gradient', 'block-theme-scaffold' ),
		)
	);
}
add_action( 'init', 'block-theme-scaffold_register_block_styles' );