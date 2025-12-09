#!/usr/bin/env node

/**
 * Scaffold Generator Agent for Block Theme
 *
 * Interactive agent that gathers requirements and generates the theme.
 * Can be run interactively or with JSON input.
 *
 * Usage:
 *   Interactive: node scaffold-generator.agent.js
 *   With JSON:   echo '{"slug":"my-theme","name":"My Theme"}' | node scaffold-generator.agent.js --json
 *   Validate:    node scaffold-generator.agent.js --validate '{"slug":"test"}'
 *   Schema:      node scaffold-generator.agent.js --schema
 */

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

/**
 * Configuration schema defining all available options
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
 * @param key
 * @param value
 * @param schema
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
 * @param config
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
 * Apply defaults to configuration
 * @param config
 */
function applyDefaults(config) {
	const result = { ...config };

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		if (result[key] === undefined && schema.default !== null) {
			result[key] = schema.default;
		}
	}

	// Derive computed values
	if (result.slug && !result.theme_uri) {
		result.theme_uri = `https://wordpress.org/themes/${result.slug}`;
	}
	if (result.slug && result.author && !result.theme_repo_url) {
		result.theme_repo_url = `https://github.com/${result.author.toLowerCase().replace(/\s+/g, '')}/${result.slug}`;
	}

	return result;
}

/**
 * Build the generation command
 * @param config
 */
function buildCommand(config) {
	const args = ['node', 'bin/generate-theme.js'];

	for (const [key, value] of Object.entries(config)) {
		if (value !== undefined && value !== null) {
			args.push(`--${key}`, value);
		}
	}

	return args.join(' ');
}

/**
 * Get questions for a specific stage
 * @param stage
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
 * Interactive prompt session
 */
async function interactiveSession() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));

	console.log('\n🎨 Block Theme Scaffold Generator\n');
	console.log(
		'This wizard will guide you through creating a new WordPress block theme.\n'
	);

	const config = {};

	// Stage 1: Identity
	console.log('📋 Stage 1: Theme Identity\n');

	for (const q of getStageQuestions(1)) {
		const required = q.required ? ' (required)' : '';
		const defaultHint = q.default ? ` [${q.default}]` : '';
		const answer = await ask(
			`  ${q.description}${required}${defaultHint}: `
		);

		if (answer.trim()) {
			config[q.key] = answer.trim();
		}
	}

	// Validate Stage 1
	const stage1Validation = validateConfig(config);
	if (!stage1Validation.valid) {
		console.log('\n❌ Validation errors:');
		stage1Validation.errors.forEach((e) => console.log(`   - ${e}`));
		rl.close();
		process.exit(1);
	}

	// Stage 2: Version
	const continueStage2 = await ask(
		'\n📋 Stage 2: Version & Compatibility (y/N): '
	);
	if (continueStage2.toLowerCase() === 'y') {
		console.log('');
		for (const q of getStageQuestions(2)) {
			const defaultHint = q.default ? ` [${q.default}]` : '';
			const answer = await ask(`  ${q.description}${defaultHint}: `);

			if (answer.trim()) {
				config[q.key] = answer.trim();
			}
		}
	}

	// Stage 3: License & Repository
	const continueStage3 = await ask(
		'\n📋 Stage 3: License & Repository (y/N): '
	);
	if (continueStage3.toLowerCase() === 'y') {
		console.log('');
		for (const q of getStageQuestions(3)) {
			const defaultHint = q.default ? ` [${q.default}]` : '';
			const answer = await ask(`  ${q.description}${defaultHint}: `);

			if (answer.trim()) {
				config[q.key] = answer.trim();
			}
		}
	}

	rl.close();

	// Apply defaults and validate
	const finalConfig = applyDefaults(config);
	const validation = validateConfig(finalConfig);

	if (!validation.valid) {
		console.log('\n❌ Configuration errors:');
		validation.errors.forEach((e) => console.log(`   - ${e}`));
		process.exit(1);
	}

	if (validation.warnings.length > 0) {
		console.log('\n⚠️  Warnings:');
		validation.warnings.forEach((w) => console.log(`   - ${w}`));
	}

	// Show summary
	console.log('\n✅ Configuration Summary:\n');
	console.log(JSON.stringify(finalConfig, null, 2));
	console.log('\n📦 Generation Command:\n');
	console.log(`  ${buildCommand(finalConfig)}\n`);

	return finalConfig;
}

/**
 * Process JSON input from stdin
 */
async function processJsonInput() {
	return new Promise((resolve, reject) => {
		let data = '';
		process.stdin.on('data', (chunk) => (data += chunk));
		process.stdin.on('end', () => {
			try {
				const config = JSON.parse(data);
				resolve(config);
			} catch (e) {
				reject(new Error(`Invalid JSON: ${e.message}`));
			}
		});
	});
}

/**
 * Main entry point
 */
async function main() {
	const args = process.argv.slice(2);

	// Schema output
	if (args.includes('--schema')) {
		console.log(JSON.stringify(CONFIG_SCHEMA, null, 2));
		process.exit(0);
	}

	// Validate JSON argument
	const validateIndex = args.indexOf('--validate');
	if (validateIndex !== -1) {
		const jsonArg = args[validateIndex + 1];
		if (!jsonArg) {
			console.error('--validate requires a JSON argument');
			process.exit(1);
		}
		try {
			const config = JSON.parse(jsonArg);
			const result = validateConfig(config);
			console.log(JSON.stringify(result, null, 2));
			process.exit(result.valid ? 0 : 1);
		} catch (e) {
			console.error(`Invalid JSON: ${e.message}`);
			process.exit(1);
		}
	}

	// JSON input mode
	if (args.includes('--json')) {
		try {
			const config = await processJsonInput();
			const finalConfig = applyDefaults(config);
			const validation = validateConfig(finalConfig);

			if (!validation.valid) {
				console.error(
					JSON.stringify({
						success: false,
						errors: validation.errors,
					})
				);
				process.exit(1);
			}

			console.log(
				JSON.stringify({
					success: true,
					config: finalConfig,
					command: buildCommand(finalConfig),
				})
			);
			process.exit(0);
		} catch (e) {
			console.error(JSON.stringify({ success: false, error: e.message }));
			process.exit(1);
		}
	}

	// Interactive mode
	await interactiveSession();
}

// Export for testing
module.exports = {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
};

// Run if executed directly
if (require.main === module) {
	main().catch((e) => {
		console.error(e.message);
		process.exit(1);
	});
}
