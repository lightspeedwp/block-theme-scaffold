/**
 * Tests for scripts/audit-frontmatter.js
 *
 * @package
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('audit-frontmatter.js', () => {
	const scriptPath = path.resolve(__dirname, '..', 'audit-frontmatter.js');
	const testDir = path.resolve(__dirname, 'test-audit');

	const createTestMarkdown = (filename, frontmatter, content = '') => {
		const testPath = path.join(testDir, filename);
		const dir = path.dirname(testPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		const yaml = Object.entries(frontmatter)
			.map(([key, value]) => {
				if (Array.isArray(value)) {
					return `${key}:\n${value.map((v) => `  - ${v}`).join('\n')}`;
				}
				return `${key}: ${value}`;
			})
			.join('\n');

		const fullContent = `---\n${yaml}\n---\n${content}`;
		fs.writeFileSync(testPath, fullContent);
	};

	const cleanupTestDir = () => {
		if (fs.existsSync(testDir)) {
			fs.rmSync(testDir, { recursive: true, force: true });
		}
	};

	beforeEach(() => {
		cleanupTestDir();
		fs.mkdirSync(testDir, { recursive: true });
	});

	afterEach(() => {
		cleanupTestDir();
	});

	describe('Script Existence', () => {
		test('script file should exist', () => {
			expect(fs.existsSync(scriptPath)).toBe(true);
		});

		test('script should be executable', () => {
			const stats = fs.statSync(scriptPath);
			const isExecutable = (stats.mode & 0o111) !== 0;
			expect(isExecutable || process.platform === 'win32').toBe(true);
		});
	});

	describe('Frontmatter Extraction', () => {
		test('should extract basic frontmatter', () => {
			createTestMarkdown('test1.md', {
				title: 'Test Document',
				description: 'A test document',
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('test1.md');
			expect(result).toContain('0'); // No references
		});

		test('should extract references array', () => {
			createTestMarkdown('test2.md', {
				title: 'Test Document',
				references: ['file1.md', 'file2.md'],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('test2.md');
			expect(result).toContain('2');
			expect(result).toContain('file1.md');
			expect(result).toContain('file2.md');
		});

		test('should handle multiple reference field names', () => {
			createTestMarkdown('test3.md', {
				title: 'Test Document',
				related_files: ['file1.md'],
				see_also: ['file2.md'],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('test3.md');
			expect(result).toContain('2'); // Total references
		});

		test('should handle string references', () => {
			createTestMarkdown('test4.md', {
				title: 'Test Document',
				references: 'single-file.md',
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('test4.md');
			expect(result).toContain('1');
			expect(result).toContain('single-file.md');
		});
	});

	describe('CSV Output Format', () => {
		test('should output valid CSV header', () => {
			createTestMarkdown('test.md', { title: 'Test' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain(
				'File,Reference Count,References,Circular,Recommendation'
			);
		});

		test('should quote file paths', () => {
			createTestMarkdown('test file.md', { title: 'Test' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toMatch(/".*test file\.md"/);
		});

		test('should escape quotes in references', () => {
			createTestMarkdown('test.md', {
				title: 'Test',
				references: ['file"with"quotes.md'],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('file""with""quotes.md');
		});

		test('should separate multiple references with semicolons', () => {
			createTestMarkdown('test.md', {
				title: 'Test',
				references: ['file1.md', 'file2.md', 'file3.md'],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('file1.md; file2.md; file3.md');
		});
	});

	describe('Recommendations', () => {
		test('should recommend OK for 0 references', () => {
			createTestMarkdown('test.md', { title: 'Test' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('0,');
			expect(result).toContain(',OK');
		});

		test('should recommend OK for 1-3 references', () => {
			createTestMarkdown('test.md', {
				title: 'Test',
				references: ['file1.md', 'file2.md'],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('2,');
			expect(result).toContain(',OK');
		});

		test('should recommend REVIEW for 4-6 references', () => {
			createTestMarkdown('test.md', {
				title: 'Test',
				references: [
					'file1.md',
					'file2.md',
					'file3.md',
					'file4.md',
					'file5.md',
				],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('5,');
			expect(result).toContain(',REVIEW');
		});

		test('should recommend REDUCE for 7+ references', () => {
			createTestMarkdown('test.md', {
				title: 'Test',
				references: [
					'file1.md',
					'file2.md',
					'file3.md',
					'file4.md',
					'file5.md',
					'file6.md',
					'file7.md',
					'file8.md',
				],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('8,');
			expect(result).toContain(',REDUCE');
		});
	});

	describe('Circular Reference Detection', () => {
		test('should detect direct circular reference', () => {
			createTestMarkdown('a.md', {
				title: 'A',
				references: [`${testDir}/b.md`],
			});
			createTestMarkdown('b.md', {
				title: 'B',
				references: [`${testDir}/a.md`],
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('YES');
			expect(result).toContain('REMOVE-CIRCULAR');
		});

		test('should handle non-circular references', () => {
			createTestMarkdown('a.md', {
				title: 'A',
				references: [`${testDir}/b.md`],
			});
			createTestMarkdown('b.md', {
				title: 'B',
				references: [`${testDir}/c.md`],
			});
			createTestMarkdown('c.md', {
				title: 'C',
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			const lines = result
				.split('\n')
				.filter((line) => line.includes('a.md'));
			expect(lines[0]).toContain('NO');
		});
	});

	describe('File Discovery', () => {
		test('should find markdown files recursively', () => {
			fs.mkdirSync(path.join(testDir, 'subdir'), { recursive: true });
			createTestMarkdown('root.md', { title: 'Root' });
			createTestMarkdown('subdir/nested.md', { title: 'Nested' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('root.md');
			expect(result).toContain('nested.md');
		});

		test('should skip node_modules directory', () => {
			fs.mkdirSync(path.join(testDir, 'node_modules'), {
				recursive: true,
			});
			createTestMarkdown('node_modules/package.md', { title: 'Package' });
			createTestMarkdown('normal.md', { title: 'Normal' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).not.toContain('package.md');
			expect(result).toContain('normal.md');
		});

		test('should skip vendor directory', () => {
			fs.mkdirSync(path.join(testDir, 'vendor'), { recursive: true });
			createTestMarkdown('vendor/lib.md', { title: 'Lib' });
			createTestMarkdown('normal.md', { title: 'Normal' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).not.toContain('lib.md');
			expect(result).toContain('normal.md');
		});

		test('should skip tmp directory', () => {
			fs.mkdirSync(path.join(testDir, 'tmp'), { recursive: true });
			createTestMarkdown('tmp/temp.md', { title: 'Temp' });
			createTestMarkdown('normal.md', { title: 'Normal' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).not.toContain('temp.md');
			expect(result).toContain('normal.md');
		});
	});

	describe('Error Handling', () => {
		test('should handle invalid frontmatter', () => {
			const invalidPath = path.join(testDir, 'invalid.md');
			fs.writeFileSync(invalidPath, '---\ninvalid: yaml: data:\n---');

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result).toContain('invalid.md');
			expect(result).toContain('ERROR');
		});

		test('should handle missing frontmatter', () => {
			const noFrontmatterPath = path.join(testDir, 'no-fm.md');
			fs.writeFileSync(
				noFrontmatterPath,
				'# Just a heading\n\nNo frontmatter here.'
			);

			expect(() => {
				execSync(`node ${scriptPath}`, {
					cwd: testDir,
					encoding: 'utf8',
					stdio: ['pipe', 'pipe', 'ignore'],
				});
			}).not.toThrow();
		});

		test('should handle empty directory', () => {
			const emptyDir = path.join(testDir, 'empty');
			fs.mkdirSync(emptyDir, { recursive: true });

			expect(() => {
				execSync(`node ${scriptPath}`, {
					cwd: emptyDir,
					encoding: 'utf8',
					stdio: ['pipe', 'pipe', 'ignore'],
				});
			}).not.toThrow();
		});
	});

	describe('Report Generation', () => {
		test('should generate complete report', () => {
			createTestMarkdown('doc1.md', {
				title: 'Document 1',
				references: ['doc2.md'],
			});
			createTestMarkdown('doc2.md', {
				title: 'Document 2',
				references: ['doc3.md'],
			});
			createTestMarkdown('doc3.md', {
				title: 'Document 3',
			});

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			// Check CSV header
			expect(result).toContain(
				'File,Reference Count,References,Circular,Recommendation'
			);

			// Check all files are included
			expect(result).toContain('doc1.md');
			expect(result).toContain('doc2.md');
			expect(result).toContain('doc3.md');

			// Check CSV format
			const lines = result
				.split('\n')
				.filter((line) => line.includes('.md'));
			expect(lines.length).toBeGreaterThanOrEqual(3);
		});

		test('should output report to stdout', () => {
			createTestMarkdown('test.md', { title: 'Test' });

			const result = execSync(`node ${scriptPath}`, {
				cwd: testDir,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			expect(result.length).toBeGreaterThan(0);
			expect(result).toContain('File,Reference Count');
		});
	});
});
