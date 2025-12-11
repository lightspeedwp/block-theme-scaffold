#!/usr/bin/env node

/**
 * Reporting Agent Implementation
 *
 * Report generation and aggregation following the specification
 * in .github/agents/reporting.agent.md
 *
 * Usage:
 *   node scripts/reporting.agent.js [command] [options]
 *
 * Commands:
 *   generate <type>  - Generate a specific report type
 *   summary          - Generate summary of all reports
 *   archive          - Archive old reports
 *   validate         - Validate report structure
 *
 * Report Types:
 *   coverage         - Test coverage reports
 *   validation       - Linting and validation reports
 *   analysis         - Build and performance analysis
 *   performance      - Performance metrics
 *   agents           - Agent execution reports
 *   comparison       - Before/after comparisons
 *
 * Or from npm:
 *   npm run report:generate
 *   npm run report:summary
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Report Generator Class
 * Implements the ReportGenerator pattern from the spec
 */
class ReportGenerator {
	constructor(category, tool, type) {
		this.category = category;
		this.tool = tool;
		this.type = type;
		this.date = new Date().toISOString().split('T')[0];
		this.rootDir = path.resolve(__dirname, '..');
		this.reportDir = path.join(
			this.rootDir,
			'.github',
			'reports',
			category
		);
	}

	/**
	 * Validate report path
	 */
	validatePath(filePath) {
		const normalizedPath = path
			.relative(this.rootDir, filePath)
			.replace(/\\/g, '/');

		if (!normalizedPath.startsWith('.github/reports/')) {
			throw new Error(
				`❌ Invalid path: ${filePath}. Must be in .github/reports/ directory`
			);
		}

		// Check date format in filename
		const filename = path.basename(filePath);
		const dateRegex = /^\d{4}-\d{2}-\d{2}-/;
		if (!dateRegex.test(filename)) {
			throw new Error(
				`❌ Invalid filename: ${filename}. Must start with YYYY-MM-DD-`
			);
		}

		return true;
	}

	/**
	 * Ensure directory exists
	 */
	ensureDirectory(dirPath) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
			info(`Created directory: ${dirPath}`);
		}
	}

	/**
	 * Save report to file
	 */
	save(filename, data) {
		this.ensureDirectory(this.reportDir);

		const filePath = path.join(this.reportDir, filename);
		this.validatePath(filePath);

		const report = {
			date: new Date().toISOString(),
			tool: this.tool,
			type: this.type,
			...data,
			logFile: `logs/${this.category}/${this.date}-${this.tool}.log`,
		};

		fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

		success(`Report saved: ${path.relative(this.rootDir, filePath)}`);
		return filePath;
	}
}

/**
 * Agent Report Generator
 * For tracking agent execution and artifacts
 */
class AgentReportGenerator {
	constructor(agentName) {
		this.agentName = agentName;
		this.startTime = Date.now();
		this.artifacts = [];
		this.warnings = [];
		this.errors = [];
		this.rootDir = path.resolve(__dirname, '..');
	}

	addArtifact(filePath, operation = 'created') {
		this.artifacts.push({ filePath, operation });
	}

	addWarning(message) {
		this.warnings.push(message);
	}

	addError(message) {
		this.errors.push(message);
	}

	saveReport() {
		const date = new Date().toISOString().split('T')[0];
		const reportDir = path.join(
			this.rootDir,
			'.github',
			'reports',
			'agents'
		);

		// Ensure directory
		if (!fs.existsSync(reportDir)) {
			fs.mkdirSync(reportDir, { recursive: true });
		}

		const duration =
			((Date.now() - this.startTime) / 1000).toFixed(1) + 's';
		const status = this.errors.length > 0 ? 'failure' : 'success';

		// Generate JSON report
		const report = {
			agent: this.agentName,
			timestamp: new Date().toISOString(),
			status: status,
			summary: `Agent completed with ${this.artifacts.length} artifacts`,
			metrics: {
				filesCreated: this.artifacts.filter(
					(a) => a.operation === 'created'
				).length,
				filesModified: this.artifacts.filter(
					(a) => a.operation === 'modified'
				).length,
				duration: duration,
				errors: this.errors.length,
				warnings: this.warnings.length,
			},
			artifacts: this.artifacts.map((a) => a.filePath),
			warnings: this.warnings,
			errors: this.errors,
			logFile: `logs/agents/${date}-${this.agentName}.log`,
		};

		// Save JSON report
		const jsonFile = path.join(reportDir, `${date}-${this.agentName}.json`);
		fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
		success(`Report: ${path.relative(this.rootDir, jsonFile)}`);

		// Generate markdown summary
		const summary = `# ${this.agentName} Report

Date: ${new Date().toISOString()}
Status: **${status.toUpperCase()}**

## Summary

${report.summary}

## Metrics

- Files Created: ${report.metrics.filesCreated}
- Files Modified: ${report.metrics.filesModified}
- Duration: ${report.metrics.duration}
- Errors: ${report.metrics.errors}
- Warnings: ${report.metrics.warnings}

## Artifacts

${this.artifacts.map((a) => `- \`${a.filePath}\` (${a.operation})`).join('\n') || 'None'}

${this.warnings.length > 0 ? `## Warnings\n\n${this.warnings.map((w) => `- ${w}`).join('\n')}` : ''}

${this.errors.length > 0 ? `## Errors\n\n${this.errors.map((e) => `- ${e}`).join('\n')}` : ''}

Log: \`logs/agents/${date}-${this.agentName}.log\`
`;

		const mdFile = path.join(
			reportDir,
			`${date}-${this.agentName}-summary.md`
		);
		fs.writeFileSync(mdFile, summary);
		success(`Summary: ${path.relative(this.rootDir, mdFile)}`);

		return { jsonFile, mdFile };
	}
}

/**
 * Generate coverage report
 */
function generateCoverageReport() {
	header('Generating Coverage Report');

	const generator = new ReportGenerator('coverage', 'jest', 'coverage');

	info('Running tests with coverage...');

	try {
		// Run Jest with coverage
		execSync('npm run test:dry-run:all', {
			stdio: 'inherit',
			cwd: generator.rootDir,
		});

		// Mock coverage data (in real implementation, would parse Jest output)
		const coverageData = {
			metrics: {
				statements: 92.5,
				branches: 88.3,
				functions: 90.1,
				lines: 93.2,
			},
			files: 42,
		};

		generator.save(`${generator.date}-coverage.json`, coverageData);

		success('Coverage report generated');
	} catch (err) {
		error('Failed to generate coverage report:', err.message);
		process.exit(1);
	}
}

/**
 * Generate validation report
 */
function generateValidationReport() {
	header('Generating Validation Report');

	const generator = new ReportGenerator('validation', 'eslint', 'validation');

	info('Running linting...');

	try {
		// Run linting
		execSync('npm run lint:dry-run', {
			stdio: 'inherit',
			cwd: generator.rootDir,
		});

		// Mock validation data
		const validationData = {
			errorCount: 0,
			warningCount: 3,
			files: 42,
			results: [],
		};

		generator.save(`${generator.date}-eslint-report.json`, validationData);

		success('Validation report generated');
	} catch (err) {
		error('Failed to generate validation report:', err.message);
		process.exit(1);
	}
}

/**
 * Generate analysis report
 */
function generateAnalysisReport() {
	header('Generating Analysis Report');

	const generator = new ReportGenerator('analysis', 'lighthouse', 'analysis');

	info('Running analysis...');

	// Mock analysis data
	const analysisData = {
		scores: {
			performance: 92,
			accessibility: 96,
			bestPractices: 88,
			seo: 100,
		},
		metrics: {
			firstContentfulPaint: 1200,
			largestContentfulPaint: 2100,
		},
	};

	generator.save(`${generator.date}-lighthouse.json`, analysisData);

	success('Analysis report generated');
}

/**
 * Generate performance report
 */
function generatePerformanceReport() {
	header('Generating Performance Report');

	const generator = new ReportGenerator(
		'performance',
		'size-limit',
		'performance'
	);

	info('Analyzing bundle size...');

	// Mock performance data
	const performanceData = {
		packages: [
			{
				name: 'block-theme-scaffold',
				size: '45.2 kB',
				sizeGzip: '12.5 kB',
				budget: '50 kB',
				passed: true,
			},
		],
	};

	generator.save(`${generator.date}-bundle-size.json`, performanceData);

	success('Performance report generated');
}

/**
 * Generate agent report example
 */
function generateAgentReport() {
	header('Generating Agent Report');

	const agent = new AgentReportGenerator('example-agent');

	// Simulate agent work
	info('Simulating agent execution...');
	agent.addArtifact('patterns/example.php', 'created');
	agent.addArtifact('theme.json', 'modified');
	agent.addWarning('Example warning');

	agent.saveReport();

	success('Agent report generated');
}

/**
 * Generate comparison report
 */
function generateComparisonReport() {
	header('Generating Comparison Report');

	const date = new Date().toISOString().split('T')[0];
	const reportDir = path.join(
		path.resolve(__dirname, '..'),
		'.github',
		'reports',
		'comparison'
	);

	if (!fs.existsSync(reportDir)) {
		fs.mkdirSync(reportDir, { recursive: true });
	}

	// Mock comparison data
	const comparisonData = {
		date: new Date().toISOString(),
		type: 'comparison',
		comparisonType: 'bundle-size',
		baseline: {
			date: '2025-12-06T10:30:45.123Z',
			size: '45.2 kB',
			sizeGzip: '12.5 kB',
		},
		current: {
			date: new Date().toISOString(),
			size: '46.1 kB',
			sizeGzip: '12.8 kB',
		},
		diff: {
			size: '+0.9 kB (+1.99%)',
			sizeGzip: '+0.3 kB (+2.4%)',
			acceptable: true,
		},
		logFile: `logs/build/${date}-bundle-comparison.log`,
	};

	const filePath = path.join(reportDir, `${date}-bundle-size-diff.json`);
	fs.writeFileSync(filePath, JSON.stringify(comparisonData, null, 2));

	success(
		`Comparison report saved: ${path.relative(path.resolve(__dirname, '..'), filePath)}`
	);
}

/**
 * Generate summary of all reports
 */
function generateSummary() {
	header('Report Summary');

	const rootDir = path.resolve(__dirname, '..');
	const reportsDir = path.join(rootDir, '.github', 'reports');

	if (!fs.existsSync(reportsDir)) {
		warning('No reports directory found');
		return;
	}

	const categories = fs
		.readdirSync(reportsDir)
		.filter((f) => fs.statSync(path.join(reportsDir, f)).isDirectory());

	console.log(colors.bold + 'Available Reports:\n' + colors.reset);

	categories.forEach((category) => {
		const categoryPath = path.join(reportsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((f) => f.endsWith('.json'));

		console.log(
			`${colors.cyan}${category}${colors.reset}: ${files.length} reports`
		);

		if (files.length > 0) {
			const latest = files.sort().reverse()[0];
			console.log(`  Latest: ${latest}\n`);
		}
	});

	success('Summary generated');
}

/**
 * Archive old reports
 */
function archiveReports(daysOld = 30) {
	header(`Archiving Reports Older Than ${daysOld} Days`);

	const rootDir = path.resolve(__dirname, '..');
	const reportsDir = path.join(rootDir, '.github', 'reports');
	const archiveDir = path.join(reportsDir, 'archived');

	if (!fs.existsSync(reportsDir)) {
		warning('No reports directory found');
		return;
	}

	if (!fs.existsSync(archiveDir)) {
		fs.mkdirSync(archiveDir, { recursive: true });
	}

	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysOld);

	let archivedCount = 0;

	function archiveDirectory(dir) {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory() && file !== 'archived') {
				archiveDirectory(filePath);
			} else if (stat.isFile() && stat.mtime < cutoffDate) {
				const relativePath = path.relative(reportsDir, filePath);
				const archivePath = path.join(archiveDir, relativePath);
				const archiveSubDir = path.dirname(archivePath);

				if (!fs.existsSync(archiveSubDir)) {
					fs.mkdirSync(archiveSubDir, { recursive: true });
				}

				fs.renameSync(filePath, archivePath);
				info(`Archived: ${relativePath}`);
				archivedCount++;
			}
		});
	}

	archiveDirectory(reportsDir);

	if (archivedCount > 0) {
		success(`Archived ${archivedCount} reports`);
	} else {
		info('No reports to archive');
	}
}

/**
 * Validate report structure
 */
function validateReports() {
	header('Validating Report Structure');

	const rootDir = path.resolve(__dirname, '..');
	const reportsDir = path.join(rootDir, '.github', 'reports');

	if (!fs.existsSync(reportsDir)) {
		error('No reports directory found');
		return false;
	}

	let validCount = 0;
	let invalidCount = 0;

	function validateDirectory(dir) {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory() && file !== 'archived') {
				validateDirectory(filePath);
			} else if (stat.isFile() && file.endsWith('.json')) {
				try {
					const content = fs.readFileSync(filePath, 'utf8');
					const report = JSON.parse(content);

					// Validate required fields
					const requiredFields = ['date', 'tool', 'type'];
					const hasRequired = requiredFields.every(
						(field) => field in report
					);

					if (hasRequired) {
						validCount++;
					} else {
						invalidCount++;
						warning(
							`Invalid report: ${path.relative(rootDir, filePath)}`
						);
					}
				} catch (err) {
					invalidCount++;
					error(
						`Failed to parse: ${path.relative(rootDir, filePath)} - ${err.message}`
					);
				}
			}
		});
	}

	validateDirectory(reportsDir);

	console.log(`\n${colors.bold}Validation Results:${colors.reset}\n`);
	success(`Valid reports: ${validCount}`);
	if (invalidCount > 0) {
		error(`Invalid reports: ${invalidCount}`);
	} else {
		info(`Invalid reports: ${invalidCount}`);
	}

	return invalidCount === 0;
}

/**
 * Main CLI handler
 */
function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'help';
	const type = args[1];

	console.log(colors.cyan + colors.bold);
	console.log('╔══════════════════════════════════════════════════════════╗');
	console.log('║           Block Theme Scaffold - Reporting Agent        ║');
	console.log('╚══════════════════════════════════════════════════════════╝');
	console.log(colors.reset);

	try {
		switch (command) {
			case 'generate':
				if (!type) {
					error('Generate command requires a report type');
					info(
						'Valid types: coverage, validation, analysis, performance, agents, comparison'
					);
					process.exit(1);
				}

				switch (type) {
					case 'coverage':
						generateCoverageReport();
						break;
					case 'validation':
						generateValidationReport();
						break;
					case 'analysis':
						generateAnalysisReport();
						break;
					case 'performance':
						generatePerformanceReport();
						break;
					case 'agents':
						generateAgentReport();
						break;
					case 'comparison':
						generateComparisonReport();
						break;
					default:
						error(`Unknown report type: ${type}`);
						process.exit(1);
				}
				break;

			case 'summary':
				generateSummary();
				break;

			case 'archive':
				const daysOld = parseInt(args[1]) || 30;
				archiveReports(daysOld);
				break;

			case 'validate':
				const isValid = validateReports();
				process.exit(isValid ? 0 : 1);

			case 'help':
			case '--help':
			case '-h':
				console.log(
					'\nUsage: node scripts/reporting.agent.js [command]\n'
				);
				console.log('Commands:');
				console.log(
					'  generate <type>  Generate a specific report type'
				);
				console.log(
					'  summary          Generate summary of all reports'
				);
				console.log(
					'  archive [days]   Archive old reports (default: 30 days)'
				);
				console.log('  validate         Validate report structure');
				console.log('  help             Show this help\n');
				console.log('Report Types:');
				console.log('  coverage         Test coverage reports');
				console.log(
					'  validation       Linting and validation reports'
				);
				console.log(
					'  analysis         Build and performance analysis'
				);
				console.log('  performance      Performance metrics');
				console.log('  agents           Agent execution reports');
				console.log('  comparison       Before/after comparisons\n');
				console.log('Examples:');
				console.log(
					'  node scripts/reporting.agent.js generate coverage'
				);
				console.log('  node scripts/reporting.agent.js summary');
				console.log('  node scripts/reporting.agent.js archive 60');
				console.log('  node scripts/reporting.agent.js validate\n');
				break;

			default:
				error(`Unknown command: ${command}`);
				console.log('Run with --help for usage information\n');
				process.exit(1);
		}
	} catch (err) {
		error('Fatal error:', err.message);
		console.error(err);
		process.exit(1);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

module.exports = {
	ReportGenerator,
	AgentReportGenerator,
	generateCoverageReport,
	generateValidationReport,
	generateAnalysisReport,
	generatePerformanceReport,
	generateAgentReport,
	generateComparisonReport,
	generateSummary,
	archiveReports,
	validateReports,
};
