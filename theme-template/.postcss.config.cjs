/**
 * PostCSS Configuration for {{theme_name}}
 *
 * PostCSS processes CSS files during the build process:
 * - Autoprefixer: Adds vendor prefixes based on browserslist config
 * - cssnano: Minifies CSS for production builds
 *
 * This configuration is automatically used by wp-scripts when compiling Sass files.
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

/**
 * PostCSS Configuration
 *
 * Processes CSS/Sass files during the build process using @wordpress/postcss-plugins-preset
 * and @wordpress/postcss-themes for theme global styles support.
 *
 * Plugins:
 * - @wordpress/postcss-plugins-preset: WordPress standard PostCSS plugins
 * - @wordpress/postcss-themes: Theme-specific CSS variable handling for global styles
 * - Autoprefixer: Adds vendor prefixes based on .browserslistrc
 * - cssnano: Minifies CSS for production builds
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-postcss-plugins-preset/
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-postcss-themes/
 *
 * @package {{theme_name}}
 * @since {{version}}
 */

// WordPress preset includes autoprefixer and other standard plugins
const wordpressPlugins = require( '@wordpress/postcss-plugins-preset' );

module.exports = {
	plugins: [
		// WordPress standard PostCSS plugins (autoprefixer, etc.)
		wordpressPlugins,

		// WordPress themes plugin for global styles CSS variable support
		require( '@wordpress/postcss-themes' ),

		// Minify CSS for production builds only.
		// wp-scripts automatically applies this based on NODE_ENV.
		require( 'cssnano' )( {
			preset: [
				'default',
				{
					// Preserve important comments (like licenses).
					discardComments: {
						removeAll: false,
					},
					// Normalize whitespace but keep readability in development.
					normalizeWhitespace: process.env.NODE_ENV === 'production',
				},
			],
		} ),
	],
};
