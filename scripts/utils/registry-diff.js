#!/usr/bin/env node

/**
 * scripts/utils/registry-diff.js
 *
 * Compares two mustache variable registry states and generates a detailed diff report.
 */

const fs = require('fs');
const path = require('path');

/**
 * Compare two registry objects and generate a detailed diff
 * @param {Object} oldRegistry - Previous registry state
 * @param {Object} newRegistry - New registry state
 * @returns {Object} Diff report with added, removed, and modified variables
 */
function compareRegistries(oldRegistry, newRegistry) {
	const oldVars = oldRegistry.variables || {};
	const newVars = newRegistry.variables || {};

	const oldKeys = new Set(Object.keys(oldVars));
	const newKeys = new Set(Object.keys(newVars));

	const added = [];
	const removed = [];
	const modified = [];

	// Find added variables
	for (const key of newKeys) {
		if (!oldKeys.has(key)) {
			const varData = newVars[key];
			added.push({
				name: key,
				type: varData.type || 'string',
				category: varData.category || 'other',
				usage:
					varData.usage && varData.usage.length > 0
						? varData.usage[0]
						: null,
			});
		}
	}

	// Find removed variables
	for (const key of oldKeys) {
		if (!newKeys.has(key)) {
			removed.push({
				name: key,
				type: oldVars[key].type || 'string',
				category: oldVars[key].category || 'other',
			});
		}
	}

	// Find modified variables
	for (const key of newKeys) {
		if (oldKeys.has(key)) {
			const oldVar = oldVars[key];
			const newVar = newVars[key];

			const changes = [];

			// Check for type changes
			if (oldVar.type !== newVar.type) {
				changes.push({
					field: 'type',
					oldValue: oldVar.type,
					newValue: newVar.type,
				});
			}

			// Check for category changes
			if (oldVar.category !== newVar.category) {
				changes.push({
					field: 'category',
					oldValue: oldVar.category,
					newValue: newVar.category,
				});
			}

			// Check for count changes (significant difference)
			if (Math.abs((oldVar.count || 0) - (newVar.count || 0)) > 0) {
				changes.push({
					field: 'count',
					oldValue: oldVar.count || 0,
					newValue: newVar.count || 0,
				});
			}

			if (changes.length > 0) {
				modified.push({
					name: key,
					changes,
				});
			}
		}
	}

	return {
		added,
		removed,
		modified,
		summary: {
			addedCount: added.length,
			removedCount: removed.length,
			modifiedCount: modified.length,
			totalChanges: added.length + removed.length + modified.length,
		},
	};
}

/**
 * Generate a markdown report from a diff
 * @param {Object} diff - Diff object from compareRegistries
 * @param {string} timestamp - ISO timestamp for the report
 * @returns {string} Markdown-formatted report
 */
function generateMarkdownReport(diff, timestamp = new Date().toISOString()) {
	const date = timestamp.split('T')[0];
	let report = `# Registry Changes - ${date}\n\n`;

	if (diff.summary.totalChanges === 0) {
		report += 'No changes detected.\n';
		return report;
	}

	report += `## Summary\n\n`;
	report += `- **Added**: ${diff.summary.addedCount} variable${diff.summary.addedCount === 1 ? '' : 's'}\n`;
	report += `- **Removed**: ${diff.summary.removedCount} variable${diff.summary.removedCount === 1 ? '' : 's'}\n`;
	report += `- **Modified**: ${diff.summary.modifiedCount} variable${diff.summary.modifiedCount === 1 ? '' : 's'}\n`;
	report += `- **Total Changes**: ${diff.summary.totalChanges}\n\n`;

	// Added variables
	if (diff.added.length > 0) {
		report += `## Added Variables (${diff.added.length})\n\n`;
		diff.added.forEach((v) => {
			const location = v.usage
				? ` - Found in \`${v.usage.file}:${v.usage.line}\``
				: '';
			report += `- \`${v.name}\` (${v.type})${location}\n`;
		});
		report += '\n';
	}

	// Removed variables
	if (diff.removed.length > 0) {
		report += `## Removed Variables (${diff.removed.length})\n\n`;
		diff.removed.forEach((v) => {
			report += `- \`${v.name}\` (${v.type}) - No longer found in codebase\n`;
		});
		report += '\n';
	}

	// Modified variables
	if (diff.modified.length > 0) {
		report += `## Modified Variables (${diff.modified.length})\n\n`;
		diff.modified.forEach((v) => {
			report += `- \`${v.name}\`:\n`;
			v.changes.forEach((change) => {
				report += `  - ${change.field}: \`${change.oldValue}\` → \`${change.newValue}\`\n`;
			});
		});
		report += '\n';
	}

	report += `---\n\n`;
	report += `*Report generated at ${timestamp}*\n`;

	return report;
}

/**
 * Generate a console-friendly summary from a diff
 * @param {Object} diff - Diff object from compareRegistries
 * @returns {string} Console output
 */
function generateConsoleSummary(diff) {
	if (diff.summary.totalChanges === 0) {
		return 'No registry changes detected.';
	}

	let output = '\nRegistry Changes Summary:\n';
	output += '========================\n';
	output += `Added: ${diff.summary.addedCount} | Removed: ${diff.summary.removedCount} | Modified: ${diff.summary.modifiedCount}\n\n`;

	if (diff.added.length > 0) {
		output += `✨ Added (${diff.added.length}):\n`;
		diff.added.slice(0, 5).forEach((v) => {
			const location = v.usage
				? ` (${v.usage.file}:${v.usage.line})`
				: '';
			output += `  + ${v.name} [${v.type}]${location}\n`;
		});
		if (diff.added.length > 5) {
			output += `  ...and ${diff.added.length - 5} more\n`;
		}
		output += '\n';
	}

	if (diff.removed.length > 0) {
		output += `🗑️  Removed (${diff.removed.length}):\n`;
		diff.removed.slice(0, 5).forEach((v) => {
			output += `  - ${v.name} [${v.type}]\n`;
		});
		if (diff.removed.length > 5) {
			output += `  ...and ${diff.removed.length - 5} more\n`;
		}
		output += '\n';
	}

	if (diff.modified.length > 0) {
		output += `📝 Modified (${diff.modified.length}):\n`;
		diff.modified.slice(0, 5).forEach((v) => {
			output += `  ~ ${v.name}\n`;
			v.changes.forEach((change) => {
				output += `    ${change.field}: ${change.oldValue} → ${change.newValue}\n`;
			});
		});
		if (diff.modified.length > 5) {
			output += `  ...and ${diff.modified.length - 5} more\n`;
		}
	}

	return output;
}

module.exports = {
	compareRegistries,
	generateMarkdownReport,
	generateConsoleSummary,
};

// CLI usage
if (require.main === module) {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.error(
			'Usage: node registry-diff.js <old-registry.json> <new-registry.json>'
		);
		process.exit(1);
	}

	const oldPath = path.resolve(args[0]);
	const newPath = path.resolve(args[1]);

	if (!fs.existsSync(oldPath)) {
		console.error(`Old registry not found: ${oldPath}`);
		process.exit(1);
	}

	if (!fs.existsSync(newPath)) {
		console.error(`New registry not found: ${newPath}`);
		process.exit(1);
	}

	const oldRegistry = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
	const newRegistry = JSON.parse(fs.readFileSync(newPath, 'utf8'));

	const diff = compareRegistries(oldRegistry, newRegistry);

	// Output format: console by default, markdown with --markdown flag
	if (args.includes('--markdown')) {
		console.log(generateMarkdownReport(diff));
	} else {
		console.log(generateConsoleSummary(diff));
	}
}
