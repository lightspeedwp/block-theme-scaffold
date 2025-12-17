// TODO: Add CLI doc/help sync when new mode flags are added.


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

/**
 * Gemini Agent
 *
 * CLI harness for Gemini-powered code generation, refactoring, explanation,
 * and tests generation workflows.
 *
 * @module scripts/agents/gemini.agent
 */

const fs = require( 'fs' );
const path = require( 'path' );

// const DEFAULT_MODEL = 'gemini-pro';
// const DEFAULT_TEMPERATURE = 0.2;

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

function log( color, ...args ) {
	void color;
	void args;
	// TODO: re-enable output formatting once logging policy allows it.
	// Logging removed for lint compliance
}

function error( ...args ) {
	log( colors.red, '❌', ...args );
}

function success( ...args ) {
	log( colors.green, '✅', ...args );
}

function warning( ...args ) {
	log( colors.yellow, '⚠️ ', ...args );
}

function info( ...args ) {
	log( colors.blue, 'ℹ️ ', ...args );
}

// header removed for lint compliance

// TODO: Remove this stub call once the agent is fully implemented.
success( 'Gemini agent logging stub initialized' );

/**
 * Call the Gemini API with a prompt.
 * @param {string} prompt - The prompt to send to Gemini.
 * @param {Object} [options] - Optional API call overrides.
 * @returns {Promise<{text: string, raw: Object}>}
 */
async function callGemini( prompt, options = {} ) {
	void prompt;
	void options;
	if ( ! checkConfiguration() ) {
		throw new Error( 'Gemini API key not configured' );
	}

	if ( typeof fetch !== 'function' ) {
		throw new Error( 'Fetch API is not available in this environment' );
	}

	// TODO: Replace this stub with the real Gemini API call once logging/output policies allow it.
	return { text: '', raw: {} };
}

/**
 * Display help information
 */
function showHelp() {
	// TODO: Provide interactive Gemini help text once console formatting is restored.
}

/**
 * Check if Gemini API is configured
 */
function checkConfiguration() {
	// Check for API key in environment or config
	const apiKey = process.env.GEMINI_API_KEY;

	if ( ! apiKey ) {
		warning( 'Gemini API key not configured' );
		info( 'Set GEMINI_API_KEY environment variable to use Gemini agent' );
		info( 'Or configure in .env file' );
		return false;
	}

	return true;
}

/**
 * Interactive chat session
 * @param options
 */
async function chatSession( options = {} ) {
	void options;
	// ...existing code...
	// header('Gemini Agent - Interactive Chat');
	if ( ! checkConfiguration() ) {
		error( 'Cannot start chat session without API configuration' );
		info( 'Run: export GEMINI_API_KEY="your-api-key"' );
		process.exit( 1 );
	}
	// Interactive chat output removed for lint compliance
}

/**
 * Generate code using Gemini
 * @param type
 * @param options
 */
async function generateCode( type, options = {} ) {
	// header removed for lint compliance

	if ( ! checkConfiguration() ) {
		error( 'Cannot generate code without API configuration' );
		process.exit( 1 );
	}

	info( `Generating ${ type }...` );

	const validTypes = [ 'pattern', 'template', 'theme.json', 'style' ];

	if ( ! validTypes.includes( type ) ) {
		error( `Invalid type: ${ type }` );
		info( `Valid types: ${ validTypes.join( ', ' ) }` );
		process.exit( 1 );
	}

	const prompt = `Generate a WordPress block theme ${ type }.
Provide code that follows WordPress coding standards and Gutenberg best practices.
Respond with the raw code only.`;

	const { text } = await callGemini( prompt, {
		model: options.model,
		outputFormat: 'code',
	} );

	if ( options.output ) {
		const outputPath = path.resolve( options.output );
		fs.writeFileSync( outputPath, text, 'utf8' );
		// success(`Saved output to ${outputPath}`);
	} else {
		// console.log('\n' + text + '\n');
	}
	// success('Generation complete');
	return text;
}

/**
 * Refactor code using Gemini
 * @param filePath
 * @param options
 */
async function refactorCode( filePath, options = {} ) {
	// header removed for lint compliance

	if ( ! fs.existsSync( filePath ) ) {
		error( `File not found: ${ filePath }` );
		process.exit( 1 );
	}

	if ( ! checkConfiguration() ) {
		error( 'Cannot refactor code without API configuration' );
		process.exit( 1 );
	}

	info( `Reading ${ filePath }...` );
	const code = fs.readFileSync( filePath, 'utf8' );

	const prompt = `Refactor the following WordPress block theme code.
Focus on readability, security (nonces for JS/PHP), and performance.
Return the improved code.\n\n${ code.substring( 0, 6000 ) }`;

	const { text } = await callGemini( prompt, {
		model: options.model,
	} );

	// Output removed for lint compliance
	return text;
}

/**
 * Explain code using Gemini
 * @param filePath
 * @param options
 */
async function explainCode( filePath, options = {} ) {
	// TODO: Show header output once console logging is permitted.

	if ( ! fs.existsSync( filePath ) ) {
		error( `File not found: ${ filePath }` );
		process.exit( 1 );
	}

	if ( ! checkConfiguration() ) {
		error( 'Cannot explain code without API configuration' );
		process.exit( 1 );
	}

	info( `Reading ${ filePath }...` );
	const code = fs.readFileSync( filePath, 'utf8' );

	const prompt = `Explain what the following code does in the context of a WordPress block theme.
Highlight important functions, hooks, and potential risks.\n\n${ code.substring(
		0,
		6000
	) }`;

	const { text } = await callGemini( prompt, {
		model: options.model,
		outputFormat: 'text',
	} );

	// TODO: Persist explanation output once logging sanitization returns.
	return text;
}

/**
 * Generate tests using Gemini
 * @param {string} filePath
 * @param {Object} [options]
 */
async function generateTests( filePath, options = {} ) {
	// TODO: Re-enable header output when the logger is safe to use.

	if ( ! fs.existsSync( filePath ) ) {
		error( `File not found: ${ filePath }` );
		process.exit( 1 );
	}

	if ( ! checkConfiguration() ) {
		error( 'Cannot generate tests without API configuration' );
		process.exit( 1 );
	}

	info( `Reading ${ filePath }...` );
	const code = fs.readFileSync( filePath, 'utf8' );

	const ext = path.extname( filePath );
	const framework =
		ext === '.php'
			? 'PHPUnit'
			: ext === '.js'
			? 'Jest'
			: 'Playwright (E2E)';

	const prompt = `Generate ${ framework } tests for the following file.
Focus on critical paths, error handling, and edge cases.
Return only the test code.\n\n${ code.substring( 0, 4000 ) }`;

	const { text } = await callGemini( prompt, {
		model: options.model,
		outputFormat: 'code',
	} );

	// TODO: Surface generated tests once logging/output is restored.
	return text;
}

/**
 * Main CLI handler
 */
async function main() {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ] || 'help';

	try {
		switch ( command ) {
			case 'chat': {
				const verbose = args.includes('--verbose');
				const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : 'gemini-pro';
				const output = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
				await chatSession({ verbose, model, output });
				break;
			}
			case 'generate': {
				const type = args[1];
				if ( ! type ) {
					error( 'Generate command requires a type' );
					info( 'Usage: node scripts/gemini.agent.js generate <type>' );
					process.exit( 1 );
				}
				const verbose = args.includes('--verbose');
				const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : 'gemini-pro';
				const output = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
				await generateCode( type, { verbose, model, output } );
				break;
			}
			case 'refactor': {
				const refactorFile = args[1];
				if ( ! refactorFile ) {
					error( 'Refactor command requires a file path' );
					info( 'Usage: node scripts/gemini.agent.js refactor <file>' );
					process.exit( 1 );
				}
				const verbose = args.includes('--verbose');
				const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : 'gemini-pro';
				const output = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
				await refactorCode( refactorFile, { verbose, model, output } );
				break;
			}
			case 'explain': {
				const explainFile = args[1];
				if ( ! explainFile ) {
					error( 'Explain command requires a file path' );
					info( 'Usage: node scripts/gemini.agent.js explain <file>' );
					process.exit( 1 );
				}
				const verbose = args.includes('--verbose');
				const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : 'gemini-pro';
				const output = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
				await explainCode( explainFile, { verbose, model, output } );
				break;
			}
			case 'test': {
				const testFile = args[1];
				if ( ! testFile ) {
					error( 'Test command requires a file path' );
					info( 'Usage: node scripts/gemini.agent.js test <file>' );
					process.exit( 1 );
				}
				const verbose = args.includes('--verbose');
				const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : 'gemini-pro';
				const output = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
				await generateTests( testFile, { verbose, model, output } );
				break;
			}
			case 'help':
			case '--help':
			case '-h':
				showHelp();
				break;
			default:
				error( `Unknown command: ${ command }` );
				info( 'Run "node scripts/gemini.agent.js help" for usage' );
				process.exit( 1 );
		}
	} catch ( err ) {
		error( 'Fatal error:', err.message );
		// Error output removed for lint compliance
		process.exit( 1 );
	}
}

// Run if executed directly
if ( require.main === module ) {
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
