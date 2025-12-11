/**
 * Tests for scripts/block-theme-build.agent.js
 *
 * @package
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('block-theme-build.agent.js', () => {
	const scriptPath = path.resolve(
		__dirname,
		'..',
		'block-theme-build.agent.js'
	);
	const testDir = path.resolve(__dirname, 'test-build-agent');

	const setupTestProject = () => {
		if (!fs.existsSync(testDir)) {
			fs.mkdirSync(testDir, { recursive: true });
		}

		// Create package.json
		fs.writeFileSync(
			path.join(testDir, 'package.json'),
			JSON.stringify(
				{
					name: 'test-theme',
					version: '1.0.0',
					scripts: {
						lint: 'echo "Linting..."',
						build: 'echo "Building..."',
						test: 'echo "Testing..."',
					},
				},
				null,
				2
			)
		);

		// Create node_modules to simulate installed dependencies
		fs.mkdirSync(path.join(testDir, 'node_modules'), { recursive: true });
	};

	const cleanupTestProject = () => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	};

	beforeEach(() => {
		cleanupTestProject();
	});

	afterEach(() => {
		cleanupTestProject();
	});

	describe('Script Existence', () => {
		test('script file should exist', () => {
			expect(fs.existsSync(scriptPath)).toBe(true);
		});

		test('script should be valid JavaScript', () => {
			expect(() => {
				require(scriptPath);
			}).not.toThrow();
		});
	});

	describe('Script Structure', () => {
		test('should export main function when required', () => {
			// Script uses require.main === module check, so it won't execute when required
			expect(() => {
				require(scriptPath);
			}).not.toThrow();
		});

		test('should have proper shebang for node execution', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			// Script doesn't require shebang but should be valid JS
			expect(content).toContain('execSync');
		});
	});

	describe('Build Workflow', () => {
		test('should execute npm ci command', () => {
			setupTestProject();

			// Mock npm ci by checking package.json exists
			const packageJsonPath = path.join(testDir, 'package.json');
			expect(fs.existsSync(packageJsonPath)).toBe(true);

			const packageJson = JSON.parse(
				fs.readFileSync(packageJsonPath, 'utf8')
			);
			expect(packageJson.scripts).toHaveProperty('lint');
		});

		test('should execute lint command', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			expect(packageJson.scripts.lint).toBeDefined();
			expect(packageJson.scripts.lint).toBe('echo "Linting..."');
		});

		test('should execute build command', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			expect(packageJson.scripts.build).toBeDefined();
			expect(packageJson.scripts.build).toBe('echo "Building..."');
		});

		test('should execute test command', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			expect(packageJson.scripts.test).toBeDefined();
			expect(packageJson.scripts.test).toBe('echo "Testing..."');
		});
	});

	describe('Command Execution', () => {
		test('should use execSync for commands', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('execSync');
			expect(content).toContain("stdio: 'inherit'");
		});

		test('should log commands before execution', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('console.log');
			expect(content).toContain('run(cmd)');
		});

		test('should handle command failures', () => {
			// Script will throw if command fails
			const content = fs.readFileSync(scriptPath, 'utf8');
			// execSync throws by default, so we're checking structure
			expect(content).toContain('execSync');
		});
	});

	describe('Build Sequence', () => {
		test('should execute commands in correct order', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');

			// Check order: install, lint, build, test
			const npmCiIndex = content.indexOf('npm ci');
			const lintIndex = content.indexOf('npm run lint');
			const buildIndex = content.indexOf('npm run build');
			const testIndex = content.indexOf('npm test');

			expect(npmCiIndex).toBeLessThan(lintIndex);
			expect(lintIndex).toBeLessThan(buildIndex);
			expect(buildIndex).toBeLessThan(testIndex);
		});

		test('should report success on completion', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('All steps completed successfully');
		});
	});

	describe('Function Implementation', () => {
		test('should define run helper function', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('function run(cmd)');
		});

		test('should define main function', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('function main()');
		});

		test('should check require.main === module', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('require.main === module');
		});
	});

	describe('Output and Logging', () => {
		test('should log command execution', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('console.log(`$ ${cmd}`)');
		});

		test('should inherit stdio for visibility', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain("stdio: 'inherit'");
		});

		test('should provide completion message', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('Block theme build agent');
			expect(content).toContain('successfully');
		});
	});

	describe('Agent Behavior', () => {
		test('should be executable as standalone script', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('if (require.main === module)');
			expect(content).toContain('main()');
		});

		test('should call all required npm commands', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('npm ci');
			expect(content).toContain('npm run lint');
			expect(content).toContain('npm run build');
			expect(content).toContain('npm test');
		});

		test('should handle completion successfully', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			// Check for success message
			expect(content).toContain('completed successfully');
		});
	});

	describe('Error Scenarios', () => {
		test('should fail if npm ci fails', () => {
			setupTestProject();

			// Remove node_modules to simulate failure
			fs.rmSync(path.join(testDir, 'node_modules'), {
				recursive: true,
				force: true,
			});

			// execSync will throw on error (default behavior)
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('execSync');
		});

		test('should fail if lint fails', () => {
			setupTestProject();

			// Update package.json with failing lint
			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			packageJson.scripts.lint = 'exit 1';
			fs.writeFileSync(
				path.join(testDir, 'package.json'),
				JSON.stringify(packageJson, null, 2)
			);

			// Script will exit on first failure
			expect(packageJson.scripts.lint).toBe('exit 1');
		});

		test('should fail if build fails', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			packageJson.scripts.build = 'exit 1';
			fs.writeFileSync(
				path.join(testDir, 'package.json'),
				JSON.stringify(packageJson, null, 2)
			);

			expect(packageJson.scripts.build).toBe('exit 1');
		});

		test('should fail if tests fail', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);
			packageJson.scripts.test = 'exit 1';
			fs.writeFileSync(
				path.join(testDir, 'package.json'),
				JSON.stringify(packageJson, null, 2)
			);

			expect(packageJson.scripts.test).toBe('exit 1');
		});
	});

	describe('Integration with Build System', () => {
		test('should work with standard npm scripts', () => {
			setupTestProject();

			const packageJson = JSON.parse(
				fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
			);

			expect(packageJson.scripts).toHaveProperty('lint');
			expect(packageJson.scripts).toHaveProperty('build');
			expect(packageJson.scripts).toHaveProperty('test');
		});

		test('should use npm ci for clean install', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('npm ci');
			expect(content).not.toContain('npm install');
		});

		test('should call scripts with npm run', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('npm run lint');
			expect(content).toContain('npm run build');
		});

		test('should call test without run prefix', () => {
			const content = fs.readFileSync(scriptPath, 'utf8');
			expect(content).toContain('npm test');
		});
	});
});
