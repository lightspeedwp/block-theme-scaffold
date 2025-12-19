/**
 * Validate mustache-variables-registry.json against schema
 *
 * This test validates that the mustache variables registry follows the correct structure.
 * Run after scanning to ensure the registry is valid.
 *
 * Usage:
 *   node scripts/validation/validate-mustache-registry.js
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { scanMustacheVariables } = require('../utils/scan');

// Paths
const registryPath = path.join(
	__dirname,
	'../../scripts/mustache-variables-registry.json'
);
const schemaPath = path.join(
	__dirname,
	'../../.github/schemas/mustache-variables-registry.schema.json'
);

/**
 * Structured logging helper
 *
 * @param {string} level
 * @param {string} message
 */
function log(level, message) {
	process.stdout.write(`[${level}] ${message}\n`);
}

/**
 * Print raw line (no prefix)
 *
 * @param {string} message
 */
function print(message = '') {
	process.stdout.write(`${message}\n`);
}

/**
 * Load JSON file
 *
 * @param {string} filePath - Path to JSON file
 */
function loadJson(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		log('ERROR', `Error loading ${filePath}: ${error.message}`);
		process.exit(1);
	}
}

function compareFileLists(registryFiles = [], scannedFiles = []) {
	const registrySet = new Set(registryFiles || []);
	const scannedSet = new Set(scannedFiles || []);

	const missing = [];
	const extra = [];

	for (const file of scannedSet) {
		if (!registrySet.has(file)) {
			missing.push(file);
		}
	}

	for (const file of registrySet) {
		if (!scannedSet.has(file)) {
			extra.push(file);
		}
	}

	return { missing, extra };
}

function compareRegistryAgainstScan(registry, scanResults) {
	const registryVariables = registry.variables || {};
	const scannedVariables = scanResults.variables || {};

	const scannedKeys = Object.keys(scannedVariables).sort();
	const registryKeys = Object.keys(registryVariables).sort();

	let issues = 0;

	const missingFromRegistry = scannedKeys.filter(
		(name) => !registryKeys.includes(name)
	);
	if (missingFromRegistry.length > 0) {
		log(
			'ERROR',
			`❌ ${missingFromRegistry.length} mustache variable(s) missing from registry`
		);
		missingFromRegistry.forEach((name) => {
			log('ERROR', `  - {{${name}}} (found in templates)`);
		});
		issues += missingFromRegistry.length;
	}

	const extraInRegistry = registryKeys.filter(
		(name) => !scannedKeys.includes(name)
	);
	if (extraInRegistry.length > 0) {
		log(
			'ERROR',
			`❌ ${extraInRegistry.length} stale variable(s) present in registry but not found in source`
		);
		extraInRegistry.forEach((name) => {
			log('ERROR', `  - {{${name}}}`);
		});
		issues += extraInRegistry.length;
	}

	const sharedKeys = registryKeys.filter((name) =>
		scannedKeys.includes(name)
	);

	sharedKeys.forEach((name) => {
		const registryEntry = registryVariables[name];
		const scannedEntry = scannedVariables[name];

		if (registryEntry.count !== scannedEntry.count) {
			log(
				'ERROR',
				`❌ Count mismatch for {{${name}}}: registry=${registryEntry.count}, scan=${scannedEntry.count}`
			);
			issues += 1;
		}

		const { missing, extra } = compareFileLists(
			registryEntry.files,
			scannedEntry.files
		);

		if (missing.length > 0 || extra.length > 0) {
			log(
				'ERROR',
				`❌ File list mismatch for {{${name}}} (registry=${registryEntry.files.length} files, scan=${scannedEntry.files.length} files)`
			);
			if (missing.length > 0) {
				log('ERROR', '    Missing from registry:');
				missing.slice(0, 5).forEach((file) => {
					log('ERROR', `      - ${file}`);
				});
				if (missing.length > 5) {
					log('ERROR', `      ...and ${missing.length - 5} more`);
				}
			}
			if (extra.length > 0) {
				log('ERROR', '    Extra files in registry:');
				extra.slice(0, 5).forEach((file) => {
					log('ERROR', `      - ${file}`);
				});
				if (extra.length > 5) {
					log('ERROR', `      ...and ${extra.length - 5} more`);
				}
			}
			issues += 1;
		}
	});

	return issues;
}

function compareSummary(registrySummary = {}, scanSummary = {}) {
	const issues = [];
	const checklist = [
		'totalFiles',
		'filesWithVariables',
		'uniqueVariables',
		'totalOccurrences',
	];

	checklist.forEach((key) => {
		if (registrySummary[key] !== scanSummary[key]) {
			issues.push(
				`${key}: registry=${registrySummary[key]} vs scan=${scanSummary[key]}`
			);
		}
	});

	return issues;
}

/**
 * Validate registry against schema
 *
 * @param {Object} registry - Registry data
 * @param {Object} schema   - JSON schema
 * @return {Object} Validation result
 */
function validateRegistryStructure(registry) {
	const errors = [];

	if (!registry || typeof registry !== 'object') {
		errors.push('Registry must be an object');
		return { valid: false, errors };
	}

	const summary = registry.summary;
	if (!summary || typeof summary !== 'object') {
		errors.push('Missing summary section');
	} else {
		[
			'totalFiles',
			'filesWithVariables',
			'uniqueVariables',
			'totalOccurrences',
		].forEach((key) => {
			if (
				typeof summary[key] !== 'number' ||
				!Number.isFinite(summary[key])
			) {
				errors.push(`Summary.${key} must be a number`);
			}
		});
	}

	const variables = registry.variables;
	if (!variables || typeof variables !== 'object') {
		errors.push('Missing variables map');
	} else {
		Object.entries(variables).forEach(([name, variable]) => {
			if (!variable || typeof variable !== 'object') {
				errors.push(`Variable ${name} must be an object`);
				return;
			}

			if (variable.name !== name) {
				errors.push(
					`Variable entry ${name} lacks matching name property`
				);
			}

			if (
				typeof variable.count !== 'number' ||
				!Number.isFinite(variable.count)
			) {
				errors.push(`Variable ${name} must declare a numeric count`);
			}

			if (!Array.isArray(variable.files)) {
				errors.push(`Variable ${name} must list files as an array`);
			} else {
				variable.files.forEach((file) => {
					if (typeof file !== 'string') {
						errors.push(`File paths for ${name} must be strings`);
					}
				});
			}
		});
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Main function
 */
function main() {
	log('INFO', '🔍 Validating mustache variables registry...');
	print();

	// Load registry
	log('INFO', `📄 Loading registry: ${registryPath}`);
	const registry = loadJson(registryPath);

	// Load schema (for reference and JSON sanity)
	log('INFO', `📋 Loading schema: ${schemaPath}`);
	loadJson(schemaPath);

	// Validate registry structure
	log('INFO', '⚙️  Validating registry structure...');
	print();
	const result = validateRegistryStructure(registry);

	if (!result.valid) {
		log('ERROR', '❌ Validation failed!');
		log('ERROR', 'Errors:');
		result.errors.forEach((error, index) => {
			log('ERROR', `  ${index + 1}. ${error}`);
		});
		print();
		process.exit(1);
	}

	// Success
	log('SUCCESS', '✅ Registry is valid!');
	print('');
	print('Summary:');
	print(`  - Total files scanned: ${registry.summary.totalFiles}`);
	print(`  - Files with variables: ${registry.summary.filesWithVariables}`);
	print(`  - Unique variables: ${registry.summary.uniqueVariables}`);
	print(`  - Total occurrences: ${registry.summary.totalOccurrences}`);
	print('');

	// Additional validation checks
	log('INFO', '🔍 Running additional validation checks...');
	print();

	let warnings = 0;
	let errors = 0;

	// Check for duplicate variable names
	const variableNames = Object.keys(registry.variables);
	const nameCounts = {};
	variableNames.forEach((name) => {
		nameCounts[name] = (nameCounts[name] || 0) + 1;
	});
	const duplicates = Object.entries(nameCounts).filter(
		([, count]) => count > 1
	);
	if (duplicates.length > 0) {
		log('ERROR', '❌ Found duplicate variable names:');
		duplicates.forEach(([name, count]) => {
			log('ERROR', `  - ${name} (appears ${count} times)`);
		});
		errors++;
	} else {
		log('INFO', '✓ No duplicate variable names');
	}

	// Verify count matches files array length
	let countMismatches = 0;
	Object.entries(registry.variables).forEach(([name, variable]) => {
		const fileCount = variable.files.length;
		const declaredCount = variable.count;
		if (fileCount !== declaredCount) {
			if (countMismatches === 0) {
				print();
				log('WARN', '⚠️  Count mismatches (files.length !== count):');
			}
			log(
				'WARN',
				`  - ${name}: files=${fileCount}, count=${declaredCount}`
			);
			countMismatches++;
		}
	});
	if (countMismatches === 0) {
		log('INFO', '✓ All variable counts match files array length');
	} else {
		warnings += countMismatches;
	}

	// Validate category distribution
	const categories = {};
	Object.values(registry.variables).forEach((variable) => {
		const cat = variable.category || 'uncategorized';
		categories[cat] = (categories[cat] || 0) + 1;
	});
	print();
	log('INFO', '📊 Category distribution:');
	Object.entries(categories)
		.sort((a, b) => b[1] - a[1])
		.forEach(([category, count]) => {
			const percentage = (
				(count / registry.summary.uniqueVariables) *
				100
			).toFixed(1);
			print(`  - ${category}: ${count} (${percentage}%)`);
		});

	// Check for variables without category
	const uncategorized = Object.entries(registry.variables).filter(
		([, v]) => !v.category || v.category === 'other'
	);
	if (uncategorized.length > 0) {
		print();
		log(
			'WARN',
			`⚠️  ${uncategorized.length} variables are uncategorized or marked as "other":`
		);
		uncategorized.slice(0, 10).forEach(([name]) => {
			log('WARN', `  - ${name}`);
		});
		if (uncategorized.length > 10) {
			log('WARN', `  ... and ${uncategorized.length - 10} more`);
		}
		warnings += uncategorized.length;
	}

	// Verify file paths exist (sample check)
	print();
	log('INFO', '📁 Verifying file paths (sampling 10 random files)...');
	const allFiles = new Set();
	Object.values(registry.variables).forEach((variable) => {
		variable.files.forEach((file) => allFiles.add(file));
	});
	const filesArray = Array.from(allFiles);
	const sampleSize = Math.min(10, filesArray.length);
	const sampleFiles = [];
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * filesArray.length);
		sampleFiles.push(filesArray[randomIndex]);
	}

	let missingFiles = 0;
	for (const file of sampleFiles) {
		const fullPath = path.join(process.cwd(), file);
		if (!fs.existsSync(fullPath)) {
			if (missingFiles === 0) {
				print();
				log('ERROR', '❌ Missing files detected:');
			}
			log('ERROR', `  - ${file}`);
			missingFiles++;
		}
	}
	if (missingFiles === 0) {
		log('INFO', `✓ Sampled ${sampleSize} files, all exist`);
	} else {
		errors += missingFiles;
	}

	// Dry-run summary + scan validation
	print('');
	print('='.repeat(50));
	const scanResults = scanMustacheVariables();
	const summaryIssues = compareSummary(registry.summary, scanResults.summary);
	let scanErrors = 0;
	if (summaryIssues.length > 0) {
		log(
			'ERROR',
			'❌ Registry summary is out of sync with the current scan:'
		);
		summaryIssues.forEach((issue) => log('ERROR', `  - ${issue}`));
		print('');
		scanErrors += summaryIssues.length;
	}

	log(
		'INFO',
		`🧭 Scanned ${scanResults.summary.filesWithVariables} file(s) with ${scanResults.summary.uniqueVariables} unique mustache variable(s)`
	);
	print('');
	const scanComparisonErrors = compareRegistryAgainstScan(
		registry,
		scanResults
	);
	if (scanComparisonErrors > 0) {
		scanErrors += scanComparisonErrors;
	}

	errors += scanErrors;

	if (errors > 0) {
		log(
			'ERROR',
			`Validation completed with ${errors} error(s) and ${warnings} warning(s)`
		);
		process.exit(1);
	} else if (warnings > 0) {
		log('WARN', `⚠️  Validation completed with ${warnings} warning(s)`);
		process.exit(0);
	} else {
		log('SUCCESS', '✅ All validation checks passed!');
		process.exit(0);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

// Export for testing
module.exports = {
	validateRegistryStructure,
	loadJson,
	scanMustacheVariables,
	compareRegistryAgainstScan,
	compareSummary,
};
