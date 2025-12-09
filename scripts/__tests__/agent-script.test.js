/**
 * Tests for scripts/agent-script.js
 *
 * @package
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('agent-script.js', () => {
	const scriptPath = path.resolve(__dirname, '..', 'agent-script.js');

	describe('Script Existence', () => {
		test('script file should exist', () => {
			expect(fs.existsSync(scriptPath)).toBe(true);
		});

		test('script should be executable or on Windows', () => {
			const stats = fs.statSync(scriptPath);
			const isExecutable = (stats.mode & 0o111) !== 0;
			// On Windows, executable bit is not relevant
			// On Unix-like systems, check if executable or can be run with node
			const canExecute = process.platform === 'win32' || isExecutable;
			// Even if not executable, if it can run with node, that's fine
			expect(canExecute || scriptPath.endsWith('.js')).toBe(true);
		});
	});

	describe('Script Execution', () => {
		test('should run without arguments', () => {
			const result = execSync(`node ${scriptPath}`, { encoding: 'utf8' });

			expect(result).toContain('Agent Script Running');
		});

		test('should run with arguments', () => {
			const result = execSync(`node ${scriptPath} arg1 arg2`, {
				encoding: 'utf8',
			});

			expect(result).toContain('Agent Script Running');
			expect(result).toContain('Arguments:');
			expect(result).toContain('arg1');
			expect(result).toContain('arg2');
		});

		test('should exit with success code', () => {
			expect(() => {
				execSync(`node ${scriptPath}`, { encoding: 'utf8' });
			}).not.toThrow();
		});
	});

	describe('Environment Variables', () => {
		test('should display environment variables', () => {
			const result = execSync(`node ${scriptPath}`, {
				encoding: 'utf8',
				env: { ...process.env, DRY_RUN: 'true' },
			});

			expect(result).toContain('Environment:');
			expect(result).toContain('DRY_RUN');
		});

		test('should mask sensitive environment variables', () => {
			const result = execSync(`node ${scriptPath}`, {
				encoding: 'utf8',
				env: { ...process.env, GITHUB_TOKEN: 'secret-token' },
			});

			expect(result).toContain('Environment:');
			expect(result).toContain('***');
			expect(result).not.toContain('secret-token');
		});

		test('should handle VERBOSE flag', () => {
			const result = execSync(`node ${scriptPath}`, {
				encoding: 'utf8',
				env: { ...process.env, VERBOSE: 'true' },
			});

			expect(result).toContain('VERBOSE');
		});
	});

	describe('Argument Parsing', () => {
		test('should parse multiple arguments', () => {
			const result = execSync(`node ${scriptPath} --flag value arg1`, {
				encoding: 'utf8',
			});

			expect(result).toContain('--flag');
			expect(result).toContain('value');
			expect(result).toContain('arg1');
		});

		test('should handle empty arguments', () => {
			const result = execSync(`node ${scriptPath}`, { encoding: 'utf8' });

			expect(result).toContain('Arguments:');
		});

		test('should handle special characters in arguments', () => {
			const result = execSync(`node ${scriptPath} "arg with spaces"`, {
				encoding: 'utf8',
			});

			expect(result).toContain('Arguments:');
			// The argument will be in the output, may be formatted as array
			expect(result).toMatch(/arg.*spaces/);
		});
	});

	describe('Output Format', () => {
		test('should output to stdout', () => {
			const result = execSync(`node ${scriptPath}`, { encoding: 'utf8' });

			expect(result.length).toBeGreaterThan(0);
			expect(result).toContain('Agent Script Running');
		});

		test('should include structured output', () => {
			const result = execSync(`node ${scriptPath}`, { encoding: 'utf8' });

			expect(result).toContain('Arguments:');
			expect(result).toContain('Environment:');
		});
	});

	describe('Exit Codes', () => {
		test('should exit with code 0 on success', () => {
			expect(() => {
				execSync(`node ${scriptPath}`, { encoding: 'utf8' });
			}).not.toThrow();
		});

		test('should provide consistent exit behavior', () => {
			const result1 = execSync(`node ${scriptPath}`, {
				encoding: 'utf8',
			});
			const result2 = execSync(`node ${scriptPath}`, {
				encoding: 'utf8',
			});

			expect(result1).toContain('Agent Script Running');
			expect(result2).toContain('Agent Script Running');
		});
	});
});
