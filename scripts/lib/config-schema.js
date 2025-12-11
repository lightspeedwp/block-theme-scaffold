/**
 * scripts/lib/config-schema.js
 *
 * Shared configuration schema and validation functions
 * Used by both generate-theme.js and generate-theme.agent.js
 * to ensure consistency across different generation modes.
 *
 * SCHEMA RELATIONSHIP:
 * This JavaScript schema is synchronized with the JSON Schema at:
 * .github/schemas/theme-config.schema.json
 *
 * When adding new configuration fields:
 * 1. Add to CONFIG_SCHEMA below (JS format)
 * 2. Add to .github/schemas/theme-config.schema.json (JSON Schema format)
 * 3. Update theme-config.template.json with default value
 * 4. Document in .github/instructions/generate-theme.instructions.md
 *
 * @module config-schema
 * @see {@link ../../.github/schemas/theme-config.schema.json} - JSON Schema definition
 */

/**
 * Configuration schema defining all available theme options
 * Organized by stage for interactive wizard
 */
const CONFIG_SCHEMA = {
	// Stage 1: Identity (Required)
	slug: {
		stage: 1,
		required: true,
		type: 'string',
		pattern: /^[a-z][a-z0-9-]{1,48}[a-z0-9]$/,
		description: 'Theme slug (lowercase, hyphens only)',
		example: 'my-theme',
		default: null,
	},
	name: {
		stage: 1,
		required: true,
		type: 'string',
		minLength: 2,
		maxLength: 100,
		description: 'Theme display name',
		example: 'My Theme',
		default: null,
	},
	description: {
		stage: 1,
		required: false,
		type: 'string',
		maxLength: 500,
		description: 'Theme description',
		example: 'A WordPress block theme.',
		default: 'A WordPress block theme.',
	},
	author: {
		stage: 1,
		required: false,
		type: 'string',
		maxLength: 100,
		description: 'Author name',
		example: 'Your Name',
		default: 'Author Name',
	},
	author_uri: {
		stage: 1,
		required: false,
		type: 'url',
		description: 'Author website URL',
		example: 'https://example.com',
		default: 'https://example.com',
	},

	// Stage 2: Version & Compatibility
	version: {
		stage: 2,
		required: false,
		type: 'semver',
		description: 'Initial version number',
		example: '1.0.0',
		default: '1.0.0',
	},
	min_wp_version: {
		stage: 2,
		required: false,
		type: 'version',
		description: 'Minimum WordPress version',
		example: '6.0',
		default: '6.0',
	},
	tested_wp_version: {
		stage: 2,
		required: false,
		type: 'version',
		description: 'Tested up to WordPress version',
		example: '6.7',
		default: '6.7',
	},
	min_php_version: {
		stage: 2,
		required: false,
		type: 'version',
		description: 'Minimum PHP version',
		example: '8.0',
		default: '8.0',
	},

	// Stage 3: Licensing & Repository
	license: {
		stage: 3,
		required: false,
		type: 'string',
		enum: ['GPL-2.0-or-later', 'GPL-3.0-or-later', 'MIT'],
		description: 'License identifier',
		default: 'GPL-2.0-or-later',
	},
	theme_uri: {
		stage: 3,
		required: false,
		type: 'url',
		description: 'Theme homepage URL',
		default: null,
	},
	theme_repo_url: {
		stage: 3,
		required: false,
		type: 'url',
		description: 'Theme repository URL',
		default: null,
	},
};

/**
 * Validate a single value against its schema definition
 *
 * @param {string} key - Field name
 * @param {*} value - Value to validate
 * @param {Object} schema - Schema definition for this field
 * @return {string[]} Array of error messages (empty if valid)
 */
function validateValue(key, value, schema) {
	const errors = [];

	if (schema.required && !value) {
		errors.push(`${key} is required`);
		return errors;
	}

	if (!value && !schema.required) {
		return errors;
	}

	switch (schema.type) {
		case 'string':
			if (typeof value !== 'string') {
				errors.push(`${key} must be a string`);
			} else {
				if (schema.pattern && !schema.pattern.test(value)) {
					errors.push(`${key} must match pattern: ${schema.pattern}`);
				}
				if (schema.minLength && value.length < schema.minLength) {
					errors.push(
						`${key} must be at least ${schema.minLength} characters`
					);
				}
				if (schema.maxLength && value.length > schema.maxLength) {
					errors.push(
						`${key} must be at most ${schema.maxLength} characters`
					);
				}
				if (schema.enum && !schema.enum.includes(value)) {
					errors.push(
						`${key} must be one of: ${schema.enum.join(', ')}`
					);
				}
			}
			break;

		case 'url':
			try {
				const url = new URL(value);
				if (!['http:', 'https:'].includes(url.protocol)) {
					errors.push(`${key} must use http or https protocol`);
				}
			} catch {
				errors.push(`${key} must be a valid URL`);
			}
			break;

		case 'semver':
			if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(value)) {
				errors.push(`${key} must be valid semver (e.g., 1.0.0)`);
			}
			break;

		case 'version':
			if (!/^\d+\.\d+(\.\d+)?$/.test(value)) {
				errors.push(
					`${key} must be a valid version (e.g., 6.0 or 8.0.0)`
				);
			}
			break;
	}

	return errors;
}

/**
 * Validate complete configuration object
 *
 * @param {Object} config - Configuration object to validate
 * @return {Object} Validation result with valid flag, errors, and warnings
 */
function validateConfig(config) {
	const errors = [];
	const warnings = [];

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		const value = config[key];
		const fieldErrors = validateValue(key, value, schema);

		if (fieldErrors.length > 0) {
			if (schema.required) {
				errors.push(...fieldErrors);
			} else {
				warnings.push(...fieldErrors);
			}
		}
	}

	return { valid: errors.length === 0, errors, warnings };
}

/**
 * Apply default values to configuration
 *
 * @param {Object} config - Configuration object
 * @return {Object} Config with defaults applied
 */
function applyDefaults(config) {
	const result = { ...config };

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		if (result[key] === undefined && schema.default !== null) {
			result[key] = schema.default;
		}
	}

	// Derive computed values
	if (result.slug && !result.namespace) {
		result.namespace = result.slug.replace(/-/g, '_');
	}
	if (result.slug && !result.theme_uri) {
		result.theme_uri = `https://wordpress.org/themes/${result.slug}`;
	}
	if (result.slug && result.author && !result.theme_repo_url) {
		result.theme_repo_url = `https://github.com/${result.author
			.toLowerCase()
			.replace(/\s+/g, '')}/${result.slug}`;
	}

	return result;
}

/**
 * Get all questions for a specific stage
 *
 * @param {number} stage - Stage number (1, 2, or 3)
 * @return {Object[]} Array of question objects with schema info
 */
function getStageQuestions(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, schema]) => schema.stage === stage)
		.map(([key, schema]) => ({
			key,
			...schema,
		}));
}

/**
 * Build a command-line arguments string from config
 *
 * @param {Object} config - Configuration object
 * @return {string} Command-line string (without node/script prefix)
 */
function buildCommandArgs(config) {
	const args = [];

	for (const [key, value] of Object.entries(config)) {
		if (value !== undefined && value !== null) {
			args.push(`--${key}`, value);
		}
	}

	return args.join(' ');
}

/**
 * Build full command string for execution
 *
 * @param {Object} config - Configuration object
 * @param {string} scriptPath - Path to generate-theme.js (default: scripts/generate-theme.js)
 * @return {string} Full command string ready to execute
 */
function buildCommand(config, scriptPath = 'scripts/generate-theme.js') {
	return `node ${scriptPath} ${buildCommandArgs(config)}`;
}

// Export for use in other scripts
module.exports = {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	getStageQuestions,
	buildCommand,
	buildCommandArgs,
};

// If run directly, output schema or help
if (require.main === module) {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case '--schema':
			// Output schema as JSON
			console.log(JSON.stringify(CONFIG_SCHEMA, null, 2));
			break;

		case '--stages':
			// List all stages
			const stages = new Set(
				Object.values(CONFIG_SCHEMA).map((s) => s.stage)
			);
			console.log(
				'Available stages:',
				Array.from(stages).sort().join(', ')
			);
			break;

		case '--keys':
			// List all config keys
			console.log(Object.keys(CONFIG_SCHEMA).join('\n'));
			break;

		default:
			console.log('Config Schema Utilities');
			console.log('');
			console.log('Usage:');
			console.log(
				'  node lib/config-schema.js --schema     Output schema as JSON'
			);
			console.log(
				'  node lib/config-schema.js --stages     List available stages'
			);
			console.log(
				'  node lib/config-schema.js --keys       List all config keys'
			);
			break;
	}
}
