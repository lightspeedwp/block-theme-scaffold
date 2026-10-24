module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true,
		jest: true, // Add Jest global variables
	},
	extends: [
		'plugin:jest/recommended',
		'plugin:jest/style',
		'eslint:recommended',
		'prettier',
	],
	plugins: ['jest'],
	overrides: [
		{
			files: ['tests/**/*.js'],
			env: {
				jest: true,
			},
			globals: {
				jest: 'readonly',
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				expect: 'readonly',
			},
		},
	],
};
