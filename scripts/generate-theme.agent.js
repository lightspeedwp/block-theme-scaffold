#!/usr/bin/env node

/**
 * Generate Theme Agent for Block Theme
 *
 * Interactive agent that gathers requirements and generates the theme.
 * Can be run interactively or with JSON input.
 *
 * Uses shared configuration schema from scripts/lib/config-schema.js
 *
 * Usage:
 *   Interactive: node generate-theme.agent.js
 *   With JSON:   echo '{"slug":"my-theme","name":"My Theme"}' | node generate-theme.agent.js --json
 *   Validate:    node generate-theme.agent.js --validate ./config.json
 *   Schema:      node generate-theme.agent.js --schema
 */

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

// Import shared configuration schema and validators
const {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
} = require('./lib/config-schema');

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

	console.log('\n🎨 Block Theme Generate Theme Agent\n');
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

	// Schema output mode
	if (args.includes('--schema')) {
		console.log(JSON.stringify(CONFIG_SCHEMA, null, 2));
		process.exit(0);
	}

	// Configuration validation mode
	if (args.includes('--validate')) {
		try {
			const configIndex = args.indexOf('--validate');
			if (configIndex + 1 >= args.length) {
				console.error(
					JSON.stringify({
						success: false,
						error: 'Configuration file path required for --validate',
					})
				);
				process.exit(1);
			}

			const fs = require('fs');
			const configPath = args[configIndex + 1];
			const configContent = fs.readFileSync(configPath, 'utf8');
			const config = JSON.parse(configContent);

			const validation = validateConfig(config);

			if (!validation.valid) {
				console.error(
					JSON.stringify({
						success: false,
						errors: validation.errors,
						warnings: validation.warnings,
						configFile: configPath,
					})
				);
				process.exit(1);
			}

			console.log(
				JSON.stringify({
					success: true,
					message: 'Configuration is valid',
					configFile: configPath,
					warnings:
						validation.warnings.length > 0
							? validation.warnings
							: undefined,
					summary: `Theme: ${config.theme_name || 'N/A'} (${config.theme_slug || 'N/A'})`,
				})
			);
			process.exit(0);
		} catch (e) {
			console.error(
				JSON.stringify({
					success: false,
					error: e.message,
				})
			);
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

// Export for testing (re-export from config-schema)
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
