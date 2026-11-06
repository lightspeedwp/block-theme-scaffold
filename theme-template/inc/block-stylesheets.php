<?php
/**
 * Per-block stylesheets for {{theme_name}}.
 *
 * Each core block can have its own stylesheet in src/styles/core-<block>.scss.
 * webpack builds it to build/styles/core-<block>.css (minified, with a
 * -rtl.css copy and an .asset.php file), and WordPress loads it only on pages
 * that use the block. Because `path` is set, WordPress can inline small
 * stylesheets and swaps in the -rtl.css file on right-to-left sites.
 *
 * Non-core blocks (plugins) get an explicit wp_enqueue_block_style() call in
 * the inc/ module that owns them, not a file here.
 *
 * Pattern credit: Ollie (https://olliewp.com/), enqueue_custom_block_styles().
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register each built core block stylesheet with wp_enqueue_block_style().
 *
 * @return void
 */
function {{theme_slug|snakeCase}}_enqueue_block_stylesheets() {
	$files = glob( get_theme_file_path( 'build/styles/core-*.css' ) );

	foreach ( $files ? $files : array() as $file ) {
		$filename = basename( $file, '.css' );

		// WordPress picks up the -rtl.css copy itself through `path`.
		if ( str_ends_with( $filename, '-rtl' ) ) {
			continue;
		}

		$asset_file = get_theme_file_path( "build/styles/{$filename}.asset.php" );
		$asset      = file_exists( $asset_file ) ? include $asset_file : array();

		// core-post-title becomes core/post-title.
		wp_enqueue_block_style(
			'core/' . substr( $filename, strlen( 'core-' ) ),
			array(
				'handle' => "{{theme_slug}}-block-{$filename}",
				'src'    => get_theme_file_uri( "build/styles/{$filename}.css" ),
				'path'   => $file,
				'ver'    => $asset['version'] ?? {{theme_slug|upper}}_VERSION,
			)
		);
	}
}
add_action( 'init', '{{theme_slug|snakeCase}}_enqueue_block_stylesheets' );
