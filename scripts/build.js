#!/usr/bin/env node

/**
 * Build and deployment utility script with enhanced error handling
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const THEME_DIR = path.resolve(__dirname, '..');
const PACKAGE_JSON = path.join(THEME_DIR, 'package.json');

// Color codes
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Get package.json data
 */
function getPackageData() {
	try {
		if (!fs.existsSync(PACKAGE_JSON)) {
			log('❌ package.json not found', 'red');
			process.exit(1);
		}
		return JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
	} catch (error) {
		log(`❌ Error reading package.json: ${error.message}`, 'red');
		process.exit(1);
	}
}

/**
 * Run command and handle errors
 * @param command
 * @param options
 */
function runCommand(command, options = {}) {
	try {
		log(`▶ Running: ${command}`, 'cyan');
		return execSync(command, {
			stdio: 'inherit',
			cwd: THEME_DIR,
			...options,
		});
	} catch (error) {
		log(`❌ Command failed: ${command}`, 'red');
		if (options.optional) {
			log(`⚠️  Continuing despite error...`, 'yellow');
			return null;
		}
		process.exit(1);
	}
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
	log('🔍 Checking prerequisites...', 'cyan');

	// Check Node.js version
	const nodeVersion = process.version;
	const major = parseInt(nodeVersion.slice(1).split('.')[0]);
	if (major < 18) {
		log(
			`❌ Node.js 18.x or higher required. Current: ${nodeVersion}`,
			'red'
		);
		process.exit(1);
	}
	log(`✅ Node.js ${nodeVersion}`, 'green');

	// Check npm
	try {
		execSync('npm --version', { stdio: 'pipe' });
		log('✅ npm detected', 'green');
	} catch {
		log('❌ npm not found', 'red');
		process.exit(1);
	}

	// Check for node_modules
	if (!fs.existsSync(path.join(THEME_DIR, 'node_modules'))) {
		log('⚠️  node_modules not found. Run: npm install', 'yellow');
	}
}

/**
 * Build theme for production
 */
function buildProduction() {
	const startTime = Date.now();
	log('🔨 Building theme for production...', 'cyan');

	checkPrerequisites();

	// Clean previous build
	const buildDir = path.join(THEME_DIR, 'build');
	if (fs.existsSync(buildDir)) {
		log('🧹 Cleaning previous build...', 'cyan');
		fs.rmSync(buildDir, { recursive: true, force: true });
	}

	// Build assets
	runCommand('npm run build:production');

	// Verify build output
	if (!fs.existsSync(buildDir) || fs.readdirSync(buildDir).length === 0) {
		log('⚠️  Build directory empty or missing', 'yellow');
	} else {
		log('✅ Build assets generated', 'green');
	}

	// Optimize images (optional)
	const imagesDir = path.join(THEME_DIR, 'assets', 'images');
	if (fs.existsSync(imagesDir)) {
		log('🖼️  Optimizing images...', 'cyan');
		runCommand('npx imagemin assets/images/* --out-dir=build/images', {
			optional: true,
		});
	}

	const duration = ((Date.now() - startTime) / 1000).toFixed(2);
	log(`✅ Production build complete in ${duration}s`, 'green');
}

/**
 * Create distribution package
 */
function createDistribution() {
	const pkg = getPackageData();
	const version = pkg.version;
	const themeName = pkg.name;

	console.log(
		`Creating distribution package for ${themeName} v${version}...`
	);

	// Build for production first
	buildProduction();

	// Create dist directory
	const distDir = path.join(THEME_DIR, 'dist');
	const themeDistDir = path.join(distDir, themeName);

	runCommand(`rm -rf ${distDir}`);
	runCommand(`mkdir -p ${themeDistDir}`);

	// Copy theme files (excluding development files)
	runCommand(`rsync -av --exclude-from=.distignore . ${themeDistDir}/`);

	// Create ZIP file
	const zipName = `${themeName}-${version}.zip`;
	runCommand(`cd ${distDir} && zip -r ${zipName} ${themeName}/`);

	console.log(`Distribution package created: dist/${zipName}`);
}

/**
 * Run theme checks
 */
function runChecks() {
	console.log('Running theme checks...');

	// Lint code
	runCommand('npm run lint');

	// Run tests
	runCommand('npm test');

	// Check WordPress standards (if WP CLI is available)
	try {
		runCommand('wp theme status');
	} catch (error) {
		console.log('WordPress CLI checks skipped (WP CLI not available)');
	}

	console.log('All checks passed!');
}

/**
 * Initialize development environment
 */
function initDev() {
	console.log('Initializing development environment...');

	// Install dependencies
	runCommand('npm install');
	runCommand('composer install');

	// Setup git hooks
	runCommand('npm run prepare');

	// Start WordPress environment
	try {
		runCommand('npm run env:start');
		console.log('WordPress environment started at http://localhost:8889');
	} catch (error) {
		console.log('WordPress environment setup skipped');
	}

	console.log('Development environment ready!');
}

/**
 * Validate version format
 * @param version
 */
function validateVersion(version) {
	// Remove any whitespace
	version = version.trim();

	// Check for malicious characters
	if (/[<>"'`\\;$&|]/.test(version)) {
		throw new Error('Version contains invalid characters');
	}

	// Validate semantic versioning format
	const versionRegex =
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

	if (!versionRegex.test(version)) {
		throw new Error(
			'Invalid version format. Must follow semantic versioning (e.g., 1.2.0, 1.2.0-beta.1)'
		);
	}

	// Parse version parts
	const match = version.match(versionRegex);
	const major = parseInt(match[1], 10);
	const minor = parseInt(match[2], 10);
	const patch = parseInt(match[3], 10);

	// Sanity check version numbers
	if (major > 999 || minor > 999 || patch > 999) {
		throw new Error('Version numbers must be less than 1000');
	}

	return version;
}

/**
 * Update theme version
 * @param newVersion
 */
function updateVersion(newVersion) {
	if (!newVersion) {
		console.error('Please provide a version number');
		process.exit(1);
	}

	try {
		const validatedVersion = validateVersion(newVersion);
		console.log(`Updating theme version to ${validatedVersion}...`);
	} catch (error) {
		console.error(`❌ ${error.message}`);
		process.exit(1);
	}

	// Update package.json
	const pkg = getPackageData();
	pkg.version = newVersion;
	fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2));

	// Update style.css
	const styleCss = path.join(THEME_DIR, 'style.css');
	let styleContent = fs.readFileSync(styleCss, 'utf8');
	styleContent = styleContent.replace(
		/Version: .*/,
		`Version: ${newVersion}`
	);
	fs.writeFileSync(styleCss, styleContent);

	console.log(`Version updated to ${newVersion}`);
}

// Main script logic
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
	case 'build':
		buildProduction();
		break;
	case 'dist':
		createDistribution();
		break;
	case 'check':
		runChecks();
		break;
	case 'init':
		initDev();
		break;
	case 'version':
		updateVersion(arg);
		break;
	default:
		console.log(`
Usage: node build.js <command> [args]

Commands:
  build     Build theme for production
  dist      Create distribution package
  check     Run linting and tests
  init      Initialize development environment
  version   Update theme version

Examples:
  node build.js build
  node build.js dist
  node build.js version 1.2.0
		`);
}
