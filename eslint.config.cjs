/**
 * ESLint config for the scaffold's tooling (scripts/).
 *
 * theme-template/ has its own eslint.config.cjs and is checked in a
 * generated theme (see .github/workflows/theme-generation.yml), because its
 * files contain {{placeholders}}.
 */
const globals = require( 'globals' );
const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{
		ignores: [
			'theme-template/**',
			'output-theme/**',
			'output-theme.previous/**',
			'coverage/**',
			'logs/**',
			'.test-temp/**',
		],
	},
	...defaultConfig,
	{
		files: [ 'scripts/**/*.js' ],
		rules: {
			// CLI scripts report to the terminal.
			'no-console': 'off',
			// Formatting is applied to staged files by lint-staged (wp-scripts
			// format), so untouched scripts are not reformatted all at once.
			'prettier/prettier': 'off',
			// Internal tooling, not shipped: JSDoc describes, types are optional.
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-description': 'off',
			'jsdoc/reject-any-type': 'off',
			'jsdoc/reject-function-type': 'off',
		},
	},
	{
		// The tooling's tests run on Jest (wp-scripts test-unit-jest).
		files: [
			'scripts/**/__tests__/**/*.js',
			'scripts/**/*.test.js',
			'scripts/utils/setup.js',
		],
		languageOptions: { globals: globals.jest },
		rules: {
			// Jest reads a @jest-environment docblock at the top of a test file.
			'jsdoc/check-tag-names': [
				'error',
				{ definedTags: [ 'jest-environment' ] },
			],
		},
	},
];
