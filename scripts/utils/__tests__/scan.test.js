/**
 * scripts/utils/test-scan.js
 *
 * Tests for mustache scan and registry enhancements.
 */

const { scanMustacheVariables } = require('./scan');
const fs = require('fs');
const path = require('path');

describe('Mustache scan enhancements', () => {
	it('should detect all mustache variables and usage context', () => {
		const { variables } = scanMustacheVariables();
		for (const [name, entry] of Object.entries(variables)) {
			expect(entry).toHaveProperty('usage');
			expect(Array.isArray(entry.usage)).toBe(true);
			expect(entry).toHaveProperty('type');
			expect(typeof entry.type).toBe('string');
		}
	});

	it('should respect .mustacheignore patterns', () => {
		const ignorePath = path.resolve(__dirname, '../../.mustacheignore');
		fs.writeFileSync(ignorePath, 'inc/\n');
		const { variables } = scanMustacheVariables();
		// Should not find variables from inc/ files
		for (const entry of Object.values(variables)) {
			for (const usage of entry.usage) {
				expect(usage.file.startsWith('inc/')).toBe(false);
			}
		}
		// Restore default ignore
		fs.unlinkSync(ignorePath);
	});

	it('should infer variable types', () => {
		const { variables } = scanMustacheVariables();
		for (const entry of Object.values(variables)) {
			expect(entry).toHaveProperty('type');
			expect(typeof entry.type).toBe('string');
		}
	});

	it('should include meta field with undocumented/unused tracking', () => {
		const results = scanMustacheVariables();
		expect(results).toHaveProperty('meta');
		expect(results.meta).toHaveProperty('undocumented');
		expect(results.meta).toHaveProperty('unused');
		expect(results.meta).toHaveProperty('scannedAt');
		expect(Array.isArray(results.meta.undocumented)).toBe(true);
		expect(Array.isArray(results.meta.unused)).toBe(true);
		expect(typeof results.meta.scannedAt).toBe('string');
	});

	it('should detect undocumented variables', () => {
		// Create a temporary file with a new variable
		const tempFile = path.resolve(
			__dirname,
			'../../.test-temp/test-var.md'
		);
		const tempDir = path.dirname(tempFile);
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}
		fs.writeFileSync(tempFile, 'This has PLACEHOLDER');

		const results = scanMustacheVariables();

		// Clean up
		fs.unlinkSync(tempFile);

		// The variable should be in the variables list
		expect(results.variables).toHaveProperty('test_undocumented_var');
	});

	it('should track usage locations with file and line', () => {
		const { variables } = scanMustacheVariables();
		const varWithUsage = Object.values(variables).find(
			(v) => v.usage && v.usage.length > 0
		);
		expect(varWithUsage).toBeDefined();
		expect(varWithUsage.usage[0]).toHaveProperty('file');
		expect(varWithUsage.usage[0]).toHaveProperty('line');
		expect(typeof varWithUsage.usage[0].file).toBe('string');
		expect(typeof varWithUsage.usage[0].line).toBe('number');
	});
});
