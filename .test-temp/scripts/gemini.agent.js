#!/usr/bin/env node

/**
 * Gemini Agent Implementation
 *
 * Master Control Program (MCP) for leveraging Google's Gemini models
 * for advanced code generation, refactoring, and development tasks.
 *
 * Specification: .github/agents/gemini.agent.md
 *
 * Usage:
 *   node scripts/gemini.agent.js [command] [options]
 *
 * Commands:
 *   chat              - Start interactive chat session
 *   generate <type>   - Generate code (pattern, template, etc.)
 *   refactor <file>   - Refactor existing code
 *   explain <file>    - Explain complex code
 *   test <file>       - Generate tests for file
 *   help              - Show detailed help
 *
 * Or from npm:
 *   npm run agent:gemini
 *   npm run agent:gemini:chat
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DEFAULT_MODEL = 'gemini-pro';
const DEFAULT_TEMPERATURE = 0.2;

// Color output helpers
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m',
};

function log(color, ...args) {
	console.log(color, ...args, colors.reset);
}

function error(...args) {
	log(colors.red, '❌', ...args);
}

function success(...args) {
	log(colors.green, '✅', ...args);
}

function warning(...args) {
	log(colors.yellow, '⚠️ ', ...args);
}

function info(...args) {
	log(colors.blue, 'ℹ️ ', ...args);
}

function header(text) {
	console.log(
		'\n' + colors.magenta + colors.bold + '═'.repeat(60) + colors.reset
	);
	log(colors.magenta + colors.bold, text);
	console.log(
		colors.magenta + colors.bold + '═'.repeat(60) + colors.reset + '\n'
	);
}

/**
 * Call the Gemini API with a prompt.
 *
 * This uses the public REST endpoint so we do not need extra dependencies.
 * The fetch call is mockable in tests and relies on GEMINI_API_KEY.
 */
async function callGemini(prompt, options = {}) {
	if (!checkConfiguration()) {
		throw new Error('Gemini API key not configured');
	}

	if (typeof fetch !== 'function') {
		throw new Error('Fetch API is not available in this environment');
	}

	const model = options.model || DEFAULT_MODEL;
	const apiKey = process.env.GEMINI_API_KEY;
	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

	const body = {
		contents: [
			{
				parts: [{ text: prompt }],
			},
		],
		generationConfig: {
			temperature: options.temperature ?? DEFAULT_TEMPERATURE,
			maxOutputTokens: options.maxOutputTokens || 1024,
		},
	};

	if (options.systemPrompt) {
		body.systemInstruction = { parts: [{ text: options.systemPrompt }] };
	}

	const response = await fetch(`${endpoint}?key=${apiKey}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(`Gemini API error: ${response.status} ${message}`);
	}

	const data = await response.json();
	const text =
		data?.candidates?.[0]?.content?.parts
			?.map((part) => part.text || '')
			.join('\n')
			.trim() || '';

	return { text, raw: data };
}

/**
 * Display help information
 */
function showHelp() {
	header('Gemini Agent - Help');

	console.log('Usage: node scripts/gemini.agent.js [command] [options]\n');

	console.log('Commands:\n');
	console.log('  chat              Start interactive chat session');
	console.log(
		'  generate <type>   Generate code (pattern, template, theme.json)'
	);
	console.log('  refactor <file>   Refactor PHP, JS, or SCSS code');
	console.log('  explain <file>    Explain complex code');
	console.log('  test <file>       Generate tests for a file');
	console.log('  help              Show this help message\n');

	console.log('Options:\n');
	console.log('  --verbose         Show detailed output');
	console.log(
		'  --model <name>    Specify Gemini model (default: gemini-pro)'
	);
	console.log('  --output <path>   Output file path\n');

	console.log('Examples:\n');
	console.log('  node scripts/gemini.agent.js chat');
	console.log(
		'  node scripts/gemini.agent.js generate pattern --output patterns/hero.php'
	);
	console.log('  node scripts/gemini.agent.js refactor inc/setup.php');
	console.log('  node scripts/gemini.agent.js test src/js/theme.js\n');

	console.log('NPM Scripts:\n');
	console.log('  npm run agent:gemini');
	console.log('  npm run agent:gemini:chat\n');
}

/**
 * Check if Gemini API is configured
 */
function checkConfiguration() {
	// Check for API key in environment or config
	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		warning('Gemini API key not configured');
		info('Set GEMINI_API_KEY environment variable to use Gemini agent');
		info('Or configure in .env file');
		return false;
	}

	return true;
}

/**
 * Interactive chat session
 */
async function chatSession(options = {}) {
	header('Gemini Agent - Interactive Chat');

	if (!checkConfiguration()) {
		error('Cannot start chat session without API configuration');
		info('Run: export GEMINI_API_KEY="your-api-key"');
		process.exit(1);
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: colors.cyan + '> ' + colors.reset,
	});

	console.log(
		'Welcome to Gemini Agent interactive chat. Type "exit" to quit.\n'
	);
	info('Available context: WordPress block theme development');
	info('Coding standards: WordPress, PHPCS, ESLint\n');

	rl.prompt();

	rl.on('line', async (line) => {
		const input = line.trim();

		if (input === 'exit' || input === 'quit') {
			console.log('\nGoodbye! 👋\n');
			rl.close();
			return;
		}

		if (!input) {
			rl.prompt();
			return;
		}

		try {
			const response = await callGemini(input, {
				model: options.model,
				systemPrompt:
					'You are a WordPress block theme copilot. Keep replies concise.',
			});

			console.log('\n' + colors.green + 'Gemini: ' + colors.reset);
			console.log(response.text || '[empty response]');
			console.log();
		} catch (err) {
			error('Gemini chat failed:', err.message);
		}

		rl.prompt();
	});

	rl.on('close', () => {
		process.exit(0);
	});
}

/**
 * Generate code using Gemini
 */
async function generateCode(type, options = {}) {
	header(`Gemini Agent - Generate ${type}`);

	if (!checkConfiguration()) {
		error('Cannot generate code without API configuration');
		process.exit(1);
	}

	info(`Generating ${type}...`);

	const validTypes = ['pattern', 'template', 'theme.json', 'style'];

	if (!validTypes.includes(type)) {
		error(`Invalid type: ${type}`);
		info(`Valid types: ${validTypes.join(', ')}`);
		process.exit(1);
	}

	const prompt = `Generate a WordPress block theme ${type}. 
Provide code that follows WordPress coding standards and Gutenberg best practices.
Respond with the raw code only.`;

	const { text } = await callGemini(prompt, {
		model: options.model,
		outputFormat: 'code',
	});

	if (options.output) {
		const outputPath = path.resolve(options.output);
		fs.writeFileSync(outputPath, text, 'utf8');
		success(`Saved output to ${outputPath}`);
	} else {
		console.log('\n' + text + '\n');
	}

	success('Generation complete');
	return text;
}

/**
 * Refactor code using Gemini
 */
async function refactorCode(filePath, options = {}) {
	header(`Gemini Agent - Refactor ${filePath}`);

	if (!fs.existsSync(filePath)) {
		error(`File not found: ${filePath}`);
		process.exit(1);
	}

	if (!checkConfiguration()) {
		error('Cannot refactor code without API configuration');
		process.exit(1);
	}

	info(`Reading ${filePath}...`);
	const code = fs.readFileSync(filePath, 'utf8');

	const prompt = `Refactor the following WordPress block theme code.
Focus on readability, security (nonces for JS/PHP), and performance.
Return the improved code.\n\n${code.substring(0, 6000)}`;

	const { text } = await callGemini(prompt, {
		model: options.model,
	});

	console.log('\n' + text + '\n');
	success('Refactoring analysis complete');
	return text;
}

/**
 * Explain code using Gemini
 */
async function explainCode(filePath, options = {}) {
	header(`Gemini Agent - Explain ${filePath}`);

	if (!fs.existsSync(filePath)) {
		error(`File not found: ${filePath}`);
		process.exit(1);
	}

	if (!checkConfiguration()) {
		error('Cannot explain code without API configuration');
		process.exit(1);
	}

	info(`Reading ${filePath}...`);
	const code = fs.readFileSync(filePath, 'utf8');

	const prompt = `Explain what the following code does in the context of a WordPress block theme.
Highlight important functions, hooks, and potential risks.\n\n${code.substring(0, 6000)}`;

	const { text } = await callGemini(prompt, {
		model: options.model,
	});

	console.log('\n' + text + '\n');
	success('Code explanation complete');
	return text;
}

/**
 * Generate tests using Gemini
 */
async function generateTests(filePath, options = {}) {
	header(`Gemini Agent - Generate Tests for ${filePath}`);

	if (!fs.existsSync(filePath)) {
		error(`File not found: ${filePath}`);
		process.exit(1);
	}

	if (!checkConfiguration()) {
		error('Cannot generate tests without API configuration');
		process.exit(1);
	}

	info(`Reading ${filePath}...`);
	const code = fs.readFileSync(filePath, 'utf8');

	// Determine test framework based on file type
	const ext = path.extname(filePath);
	const framework =
		ext === '.php'
			? 'PHPUnit'
			: ext === '.js'
				? 'Jest'
				: 'Playwright (E2E)';

	const prompt = `Generate ${framework} tests for the following file.
Focus on critical paths, error handling, and edge cases.
Return only the test code.\n\n${code.substring(0, 4000)}`;

	const { text } = await callGemini(prompt, {
		model: options.model,
	});

	console.log('\n' + text + '\n');
	success('Test generation complete');
	return text;
}

/**
 * Main CLI handler
 */
async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'help';
	const options = {
		verbose: args.includes('--verbose'),
		model: args.includes('--model')
			? args[args.indexOf('--model') + 1]
			: 'gemini-pro',
		output: args.includes('--output')
			? args[args.indexOf('--output') + 1]
			: null,
	};

	try {
		switch (command) {
			case 'chat':
				await chatSession(options);
				break;

			case 'generate':
				const type = args[1];
				if (!type) {
					error('Generate command requires a type');
					info('Usage: node scripts/gemini.agent.js generate <type>');
					process.exit(1);
				}
				await generateCode(type, options);
				break;

			case 'refactor':
				const refactorFile = args[1];
				if (!refactorFile) {
					error('Refactor command requires a file path');
					info('Usage: node scripts/gemini.agent.js refactor <file>');
					process.exit(1);
				}
				await refactorCode(refactorFile, options);
				break;

			case 'explain':
				const explainFile = args[1];
				if (!explainFile) {
					error('Explain command requires a file path');
					info('Usage: node scripts/gemini.agent.js explain <file>');
					process.exit(1);
				}
				await explainCode(explainFile, options);
				break;

			case 'test':
				const testFile = args[1];
				if (!testFile) {
					error('Test command requires a file path');
					info('Usage: node scripts/gemini.agent.js test <file>');
					process.exit(1);
				}
				await generateTests(testFile, options);
				break;

			case 'help':
			case '--help':
			case '-h':
				showHelp();
				break;

			default:
				error(`Unknown command: ${command}`);
				info('Run "node scripts/gemini.agent.js help" for usage');
				process.exit(1);
		}
	} catch (err) {
		error('Fatal error:', err.message);
		if (options.verbose) {
			console.error(err);
		}
		process.exit(1);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

module.exports = {
	chatSession,
	generateCode,
	refactorCode,
	explainCode,
	generateTests,
	callGemini,
};
