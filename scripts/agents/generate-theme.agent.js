// TODO: Implement cached schema loading and canonical JSON-backed config definition.

/**
 * Generate Theme Agent for Block Theme
 *
 * Interactive agent that gathers requirements and generates the theme.
 * Can be run interactively or with JSON input.
 *
 * Uses shared configuration schema from scripts/lib/define-config-schema.js
 *
 * Usage:
 *   Interactive: node generate-theme.agent.js
 *   With JSON:   echo '{"slug":"my-theme","name":"My Theme"}' | node generate-theme.agent.js --json
 *   Validate:    node generate-theme.agent.js --validate ./config.json
 *   Schema:      node generate-theme.agent.js --schema
 */

/**
 * Generate Theme Agent CLI
 *
 * Validates configuration and guides JSON or interactive flows for theme generation.
 *
 * @module scripts/agents/generate-theme.agent
 */

const FileLogger = require('../utils/logger');
const minimist = require('minimist');
// Wizard module for interactive flows (placeholder)
const { runWizard } = require('../lib/wizard');

// Import shared configuration schema and validators
const {
	CONFIG_SCHEMA,
	getCanonicalConfigSchema,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
} = require('../lib/define-config-schema');

/**
 * Interactive prompt session
 * @param {FileLogger} logger - The logger instance.
 * @todo Integrate runWizard for advanced interactive flows
 */
async function interactiveSession(logger) {
	// Use runWizard to support config file loading or manual entry
	// If --config is provided, pass it as configPath
	const configPath = process.argv.includes('--config')
		? process.argv[process.argv.indexOf('--config') + 1]
		: undefined;
	const config = runWizard({ configPath, logger });
	// Validate and apply defaults
	const finalConfig = applyDefaults(config);
	const validation = validateConfig(finalConfig);
	if (!validation.valid) {
		logger.error('❌ Final configuration is invalid:');
		validation.errors.forEach((e) => logger.error(`  - ${e}`));
		process.exit(1);
	}
	if (validation.warnings.length > 0) {
		logger.warn('⚠️  Configuration warnings:');
		validation.warnings.forEach((w) => logger.warn(`  - ${w}`));
	}
	logger.info('✅ Configuration Summary:');
	logger.info(`\n${JSON.stringify(finalConfig, null, 2)}`);
	logger.info('📦 Generation Command:');
	logger.info(buildCommand(finalConfig));
	return finalConfig;
}

/**
 * Process JSON input from stdin
 */
async function processJsonInput() {
	return new Promise((resolve, reject) => {
		let data = '';
		process.stdin.setEncoding('utf8');
		process.stdin.on('data', (chunk) => {
			data += chunk;
		});
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
 * Prints the command-line help message.
 */
function printHelp() {
	const message = `
Usage: node generate-theme.agent.js [options]

Interactive agent that gathers requirements for theme generation.

Options:
  --help, -h             Display this help message and exit.
  --schema               Output the theme configuration JSON schema and exit.
  --json                 Read theme configuration from stdin as JSON.
  --validate <path>      Validate a theme configuration JSON file and exit.
  --validate-json <json> Validate a theme configuration from a JSON string and exit.
  --config <path>        Load configuration from a JSON file.
  --dry-run              Run the agent without generating files, showing a summary of what would be done.

If no options are provided, the agent will start in interactive mode.
`;
	console.log(message);
}

/**
 * Handles the --config flag to load, validate, and process a configuration file.
 * @param {string} configPath - The path to the configuration file.
 * @param {FileLogger} logger - The logger instance.
 * @returns {Promise<object>} The validated and final configuration object.
 */
async function handleFileConfigMode(configPath, logger) {
	if (!configPath || typeof configPath !== 'string') {
		logger.error('--config requires a file path argument.');
		process.exit(1);
	}

	try {
		const fs = require('fs');
		logger.info(`Loading configuration from ${configPath}...`);
		const configContent = fs.readFileSync(configPath, 'utf8');
		const config = JSON.parse(configContent);
		const finalConfig = applyDefaults(config);
		const validation = validateConfig(finalConfig);

		if (!validation.valid) {
			logger.error('❌ Configuration from file is invalid:');
			validation.errors.forEach((e) => logger.error(`  - ${e}`));
			process.exit(1);
		}

		if (validation.warnings.length > 0) {
			logger.warn('⚠️  Configuration warnings:');
			validation.warnings.forEach((w) => logger.warn(`  - ${w}`));
		}

		logger.info('✅ Configuration Summary:');
		logger.info(`\n${JSON.stringify(finalConfig, null, 2)}`);

		return finalConfig;
	} catch (e) {
		if (e.code === 'ENOENT') {
			logger.error(`Config file not found at: ${configPath}`);
		} else if (e instanceof SyntaxError) {
			logger.error(`Invalid JSON in config file: ${e.message}`);
		} else {
			logger.error(`Failed to process config file: ${e.message}`);
		}
		process.exit(1);
	}
}

/**
 * Main entry point
 */
async function main() {
	let finalConfig = null;
	const logger = new FileLogger('generate-theme-agent', 'agents');
	logger.info('Generate Theme Agent started.');
	const args = minimist(process.argv.slice(2), {
		string: ['validate', 'validate-json', 'config'],
		boolean: ['help', 'schema', 'json', 'dry-run'],
		alias: { h: 'help' },
	});

	if (args['dry-run']) {
		logger.info('Running in --dry-run mode. No files will be generated.');
	}

	if (args.help) {
		printHelp();
		return;
	}

	if (args.schema) {
		const schema = getCanonicalConfigSchema();
		console.log(JSON.stringify(schema, null, 2));
		return;
	}

	if (args['validate-json']) {
		if (typeof args['validate-json'] !== 'string') {
			logger.error('--validate-json requires a JSON argument');
			process.exit(1);
		}
		try {
			const config = JSON.parse(args['validate-json']);
			const result = validateConfig(config);
			console.log(JSON.stringify(result, null, 2));
			process.exitCode = result.valid ? 0 : 1;
		} catch (e) {
			console.error(`Invalid JSON: ${e.message}`);
			process.exit(1);
		}
		return;
	}

	if (args.validate) {
		try {
			const fs = require('fs');
			const configContent = fs.readFileSync(args.validate, 'utf8');
			const config = JSON.parse(configContent);
			const validation = validateConfig(config);
			console.log(JSON.stringify(validation, null, 2));
			process.exit(validation.valid ? 0 : 1);
		} catch (e) {
			console.error(`Invalid config: ${e.message}`);
			process.exit(1);
		}
		return;
	}

	if (args.config) {
		finalConfig = await handleFileConfigMode(args.config, logger);
	} else if (args.json) {
		try {
			const config = await processJsonInput();
			finalConfig = applyDefaults(config);
			const validation = validateConfig(finalConfig);
			console.log(JSON.stringify(validation, null, 2));
			process.exitCode = validation.valid ? 0 : 1;
		} catch (e) {
			logger.error(`Failed to process JSON input: ${e.message}`);
			process.exit(1);
		}
	} else {
		// Interactive mode is the default
		finalConfig = await interactiveSession(logger);
	}

	// In a real execution, the `finalConfig` would be passed to a generation function.
	// For now, the agent's job is complete after displaying the summary.
	// The --dry-run flag is in place for when execution logic is added.
	if (!args['dry-run']) {
		// Example: await generateTheme(finalConfig, logger);
	}
}

// Export for testing (re-export from config-schema)
module.exports = {
	CONFIG_SCHEMA,
	getCanonicalConfigSchema,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
};

// Run if executed directly
if (require.main === module) {
	(async () => {
		const logger = new FileLogger('generate-theme-agent');
		try {
			await main();
		} catch (e) {
			logger.error(`Unhandled exception: ${e.message}`);
			process.exitCode = 1;
		}
	})();
}
