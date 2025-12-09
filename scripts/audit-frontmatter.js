#!/usr/bin/env node

/**
 * Frontmatter Audit Script
 *
 * Scans all markdown files in the repository to analyze frontmatter references.
 * Generates a CSV report with:
 * - File name
 * - Number of references
 * - Reference targets
 * - Circular reference detection
 * - Recommendations
 *
 * Usage: node scripts/audit-frontmatter.js > .github/reports/analysis/YYYY-MM-DD-frontmatter-audit.csv
 *
 * @package
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Get all markdown files in directory recursively
 *
 * @param {string}   dir      - Directory to scan
 * @param {string[]} fileList - Accumulated file list
 * @return {string[]} Array of markdown file paths
 */
function getAllMarkdownFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		// Skip node_modules, vendor, .git, tmp, and other build directories
		if (
			file === 'node_modules' ||
			file === 'vendor' ||
			file === '.git' ||
			file === 'tmp' ||
			file === 'public' ||
			file === 'dist' ||
			file === 'build' ||
			file === '.archive' ||
			file.startsWith('.')
		) {
			return;
		}

		if (stat.isDirectory()) {
			getAllMarkdownFiles(filePath, fileList);
		} else if (file.endsWith('.md')) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

/**
 * Extract frontmatter references from a file
 *
 * @param {string} filePath - Path to markdown file
 * @return {Object} Parsed frontmatter data
 */
function extractFrontmatter(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		const parsed = matter(content);

		return {
			filePath,
			data: parsed.data,
			hasError: false,
		};
	} catch (error) {
		return {
			filePath,
			data: {},
			hasError: true,
			error: error.message,
		};
	}
}

/**
 * Build reference graph from all files
 *
 * @param {Object[]} allFrontmatter - Array of frontmatter data
 * @return {Map} Reference graph map
 */
function buildReferenceGraph(allFrontmatter) {
	const graph = new Map();

	allFrontmatter.forEach((item) => {
		const { filePath, data } = item;
		const references = [];

		// Check for various reference field names
		const referenceFields = [
			'references',
			'related_files',
			'relatedFiles',
			'see_also',
			'seeAlso',
			'depends_on',
			'dependsOn',
		];

		referenceFields.forEach((field) => {
			if (data[field]) {
				if (Array.isArray(data[field])) {
					references.push(...data[field]);
				} else if (typeof data[field] === 'string') {
					references.push(data[field]);
				}
			}
		});

		graph.set(filePath, references);
	});

	return graph;
}

/**
 * Detect circular references in graph
 *
 * @param {Map}    graph    - Reference graph
 * @param {string} node     - Starting node
 * @param {Set}    visited  - Visited nodes
 * @param {Set}    recStack - Recursion stack
 * @return {boolean} True if circular reference detected
 */
function hasCircularReference(
	graph,
	node,
	visited = new Set(),
	recStack = new Set()
) {
	visited.add(node);
	recStack.add(node);

	const neighbors = graph.get(node) || [];

	for (const neighbor of neighbors) {
		if (!visited.has(neighbor)) {
			if (hasCircularReference(graph, neighbor, visited, recStack)) {
				return true;
			}
		} else if (recStack.has(neighbor)) {
			return true;
		}
	}

	recStack.delete(node);
	return false;
}

/**
 * Generate recommendations based on reference count
 *
 * @param {number}  count      - Number of references
 * @param {boolean} isCircular - Has circular references
 * @return {string} Recommendation
 */
function getRecommendation(count, isCircular) {
	if (isCircular) {
		return 'REMOVE-CIRCULAR';
	}
	if (count === 0) {
		return 'OK';
	}
	if (count <= 3) {
		return 'OK';
	}
	if (count <= 6) {
		return 'REVIEW';
	}
	return 'REDUCE';
}

/**
 * Generate CSV report
 *
 * @param {Object[]} allFrontmatter - Array of frontmatter data
 * @param {Map}      graph          - Reference graph
 */
function generateReport(allFrontmatter, graph) {
	// CSV Header
	console.log('File,Reference Count,References,Circular,Recommendation');

	allFrontmatter.forEach((item) => {
		const { filePath, data, hasError } = item;

		if (hasError) {
			console.log(`"${filePath}",ERROR,,,ERROR`);
			return;
		}

		const references = graph.get(filePath) || [];
		const count = references.length;
		const isCircular = hasCircularReference(graph, filePath);
		const recommendation = getRecommendation(count, isCircular);

		// Format references for CSV (escape quotes)
		const referencesStr = references
			.map((ref) => ref.replace(/"/g, '""'))
			.join('; ');

		console.log(
			`"${filePath}",${count},"${referencesStr}",${isCircular ? 'YES' : 'NO'},${recommendation}`
		);
	});
}

/**
 * Main execution
 */
function main() {
	const rootDir = path.resolve(__dirname, '..');
	const markdownFiles = getAllMarkdownFiles(rootDir);

	console.error(`Found ${markdownFiles.length} markdown files`);

	const allFrontmatter = markdownFiles.map(extractFrontmatter);
	const graph = buildReferenceGraph(allFrontmatter);

	generateReport(allFrontmatter, graph);

	console.error('\nAudit complete!');
	console.error('Recommendations:');
	console.error('  OK            - Reference count is reasonable (0-3)');
	console.error('  REVIEW        - Consider reviewing references (4-6)');
	console.error(
		'  REDUCE        - High reference count, consider reducing (7+)'
	);
	console.error('  REMOVE-CIRCULAR - Circular reference detected, must fix');
}

main();
