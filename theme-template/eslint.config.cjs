const wordpress = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	// Skills vendored unmodified from WordPress/agent-skills (see
	// .agents/skills/VENDORED.md); they follow upstream formatting, not ours.
	{ ignores: [ '.agents/skills/**' ] },
	...wordpress,
];
