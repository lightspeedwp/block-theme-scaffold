/**
 * Webpack configuration for {{theme_name}}.
 *
 * Extends the `@wordpress/scripts` configuration with the theme's four entry
 * points, plus one entry per block stylesheet in src/styles/. Each entry gets
 * a build/<entry>.asset.php file, which functions.php and
 * inc/block-stylesheets.php read for dependencies and the version.
 *
 * @see https://developer.wordpress.org/themes/advanced-topics/build-process/
 */
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const fs = require( 'fs' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

// src/styles/core-button.scss builds to build/styles/core-button.css (and
// core-button-rtl.css), so a new block stylesheet needs no config change.
const stylesDir = path.resolve( __dirname, 'src/styles' );
const blockStyles = fs.existsSync( stylesDir )
	? Object.fromEntries(
			fs
				.readdirSync( stylesDir )
				.filter( ( file ) => /^[^_].*\.scss$/.test( file ) )
				.map( ( file ) => [
					`styles/${ path.basename( file, '.scss' ) }`,
					path.join( stylesDir, file ),
				] )
		)
	: {};

module.exports = {
	...defaultConfig,
	entry: {
		'js/theme': path.resolve( __dirname, 'src/js/theme.js' ),
		'js/editor': path.resolve( __dirname, 'src/js/editor.js' ),
		'css/style': path.resolve( __dirname, 'src/css/style.scss' ),
		'css/editor-style': path.resolve( __dirname, 'src/css/editor.scss' ),
		...blockStyles,
	},
	optimization: {
		...defaultConfig.optimization,
		// The default "style" chunk renames style.scss to style-<entry>.css;
		// functions.php enqueues build/css/style.css, so keep the entry name.
		splitChunks: { cacheGroups: { default: false } },
	},
	plugins: [
		...defaultConfig.plugins,
		// Drop the empty .js files webpack writes for the CSS-only entries,
		// after the dependency extraction plugin has written their .asset.php.
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
	],
};
