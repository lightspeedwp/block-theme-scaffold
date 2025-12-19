const fs = require('fs');
const path = require('path');
const { URL } = require('url');

let _cachedJsonSchema = null;

function loadCanonicalJsonSchema() {
	if (_cachedJsonSchema) {
		return _cachedJsonSchema;
	}

	const schemaPath = path.resolve(
		__dirname,
		'..',
		'..',
		'.github',
		'schemas',
		'theme-config.schema.json'
	);
	try {
		const raw = fs.readFileSync(schemaPath, 'utf8');
		_cachedJsonSchema = JSON.parse(raw);
		return _cachedJsonSchema;
	} catch (err) {
		return null;
	}
}

function getCanonicalConfigSchema() {
	return loadCanonicalJsonSchema() || CONFIG_SCHEMA;
}

const CONFIG_SCHEMA = {
	theme_slug: {
		stage: 1,
		required: true,
		type: 'string',
		// Must be 3+ chars, lowercase, numbers, hyphens, no leading/trailing hyphen, no consecutive hyphens
		pattern: /^(?!-)(?!.*--)[a-z0-9]+(-[a-z0-9]+)*$/,
		minLength: 3,
		description:
			'URL-safe theme identifier (lowercase, hyphens only, at least 3 chars, no leading/trailing hyphen, no consecutive hyphens)',
		example: 'tour-operator',
		default: null,
	},
	theme_name: {
		stage: 1,
		required: true,
		type: 'string',
		minLength: 2,
		maxLength: 100,
		description: 'Human-readable theme name',
		example: 'Tour Operator Theme',
		default: null,
	},
	description: {
		stage: 1,
		required: false,
		type: 'string',
		maxLength: 500,
		description: 'Theme description',
		example:
			'A modern WordPress block theme built with accessibility and performance in mind.',
		default:
			'A modern WordPress block theme built with accessibility and performance in mind.',
	},
	author: {
		stage: 1,
		required: true,
		type: 'string',
		maxLength: 100,
		description: 'Author or organization name',
		example: 'LightSpeed',
		default: 'Your Name or Company',
	},
	author_uri: {
		stage: 1,
		required: false,
		type: 'url',
		description: 'Author website URL',
		default: 'https://example.com',
	},
	author_username: {
		stage: 1,
		required: false,
		type: 'string',
		default: '',
	},
	version: {
		stage: 2,
		required: false,
		type: 'semver',
		default: '1.0.0',
	},
	min_wp_version: {
		stage: 2,
		required: false,
		type: 'version',
		default: '6.5',
	},
	tested_wp_version: {
		stage: 2,
		required: false,
		type: 'version',
		default: '6.7',
	},
	min_php_version: {
		stage: 2,
		required: false,
		type: 'version',
		default: '8.0',
	},
	license: {
		stage: 3,
		required: false,
		type: 'string',
		default: 'GPL-2.0-or-later',
	},
	license_uri: {
		stage: 3,
		required: false,
		type: 'url',
		default: 'https://www.gnu.org/licenses/gpl-2.0.html',
	},
	theme_uri: {
		stage: 3,
		required: false,
		type: 'url',
		default: null,
	},
	theme_repo_url: {
		stage: 3,
		required: false,
		type: 'url',
		default: null,
	},
	support_url: {
		stage: 3,
		required: false,
		type: 'url',
		default: null,
	},
	docs_url: {
		stage: 3,
		required: false,
		type: 'url',
		default: null,
	},
	changelog_url: {
		stage: 3,
		required: false,
		type: 'url',
		default: null,
	},
	target_audience: {
		stage: 3,
		required: false,
		type: 'string',
		default: 'bloggers and content creators',
	},
	theme_tags: {
		stage: 3,
		required: false,
		type: 'string',
		default:
			'block-patterns, block-styles, custom-colors, custom-menu, editor-style, featured-images, full-site-editing, template-editing, wide-blocks',
	},
};

const CLI_KEY_MAP = {
	theme_slug: 'slug',
	theme_name: 'name',
};

function toCliKey(key) {
	return CLI_KEY_MAP[key] ?? key;
}

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
		case 'string': {
			if (typeof value !== 'string') {
				errors.push(`${key} must be a string`);
				return errors;
			}

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
			break;
		}

		case 'url': {
			try {
				const url = new URL(value);
				if (!['http:', 'https:'].includes(url.protocol)) {
					errors.push(`${key} must use http or https protocol`);
				}
			} catch (err) {
				errors.push(`${key} must be a valid URL`);
			}
			break;
		}

		case 'semver': {
			if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(value)) {
				errors.push(`${key} must be valid semver (e.g., 1.0.0)`);
			}
			break;
		}

		case 'version': {
			if (!/^\d+\.\d+(\.\d+)?$/.test(value)) {
				errors.push(
					`${key} must be a valid version (e.g., 6.0 or 8.0.0)`
				);
			}
			break;
		}
	}

	return errors;
}

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

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

function applyDefaults(config) {
	const result = { ...config };

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		if (result[key] === undefined && schema.default !== null) {
			result[key] = schema.default;
		}
	}

	if (result.theme_slug && !result.namespace) {
		result.namespace = result.theme_slug.replace(/-/g, '_');
	}

	// Only set theme_uri if not already set (null/undefined/empty string)
	if (
		result.theme_slug &&
		(result.theme_uri === undefined ||
			result.theme_uri === null ||
			result.theme_uri === '')
	) {
		result.theme_uri = `https://wordpress.org/themes/${result.theme_slug}`;
	}

	if (result.theme_slug && result.author && !result.theme_repo_url) {
		result.theme_repo_url = `https://github.com/${result.author
			.toLowerCase()
			.replace(/\s+/g, '')}/${result.theme_slug}`;
	}

	return result;
}

function getStageQuestions(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, schema]) => schema.stage === stage)
		.map(([key, schema]) => ({
			key,
			...schema,
		}));
}

function buildCommandArgs(config) {
	const args = [];

	for (const [key, value] of Object.entries(config)) {
		if (value !== undefined && value !== null) {
			args.push(`--${toCliKey(key)}`, value);
		}
	}

	return args.join(' ');
}

function buildCommand(config, scriptPath = 'scripts/generate-theme.js') {
	return `node ${scriptPath} ${buildCommandArgs(config)}`;
}

module.exports = {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	getStageQuestions,
	buildCommand,
	buildCommandArgs,
	getCanonicalConfigSchema,
	loadCanonicalJsonSchema,
};

if (require.main === module) {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case '--schema':
			console.log(JSON.stringify(CONFIG_SCHEMA, null, 2));
			break;

		case '--stages': {
			const stages = new Set(
				Object.values(CONFIG_SCHEMA).map((s) => s.stage)
			);
			console.log(
				'Available stages:',
				Array.from(stages).sort().join(', ')
			);
			break;
		}

		case '--keys':
			console.log(Object.keys(CONFIG_SCHEMA).join('\n'));
			break;

		default:
			console.log('Config Schema Utilities');
			console.log('');
			console.log('Usage:');
			console.log(
				'  node scripts/lib/define-config-schema.js --schema     Output schema as JSON'
			);
			console.log(
				'  node scripts/lib/define-config-schema.js --stages     List available stages'
			);
			console.log(
				'  node scripts/lib/define-config-schema.js --keys       List all config keys'
			);
			break;
	}
}
