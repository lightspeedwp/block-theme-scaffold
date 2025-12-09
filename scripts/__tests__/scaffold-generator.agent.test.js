/**
 * Tests for scripts/scaffold-generator.agent.js
 *
 * @package
 */

const {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
} = require('../scaffold-generator.agent');

describe('scaffold-generator.agent.js', () => {
	describe('CONFIG_SCHEMA', () => {
		test('should have required fields', () => {
			expect(CONFIG_SCHEMA).toHaveProperty('slug');
			expect(CONFIG_SCHEMA).toHaveProperty('name');
			expect(CONFIG_SCHEMA.slug.required).toBe(true);
			expect(CONFIG_SCHEMA.name.required).toBe(true);
		});

		test('should define three stages', () => {
			const stages = new Set(
				Object.values(CONFIG_SCHEMA).map((schema) => schema.stage)
			);
			expect(stages).toContain(1);
			expect(stages).toContain(2);
			expect(stages).toContain(3);
		});

		test('should have valid field types', () => {
			const validTypes = ['string', 'url', 'semver', 'version'];

			Object.values(CONFIG_SCHEMA).forEach((schema) => {
				expect(validTypes).toContain(schema.type);
			});
		});

		test('should have descriptions for all fields', () => {
			Object.entries(CONFIG_SCHEMA).forEach(([key, schema]) => {
				expect(schema.description).toBeDefined();
				expect(schema.description.length).toBeGreaterThan(0);
			});
		});

		test('should have defaults for optional fields', () => {
			Object.entries(CONFIG_SCHEMA).forEach(([key, schema]) => {
				if (!schema.required) {
					expect(schema).toHaveProperty('default');
				}
			});
		});
	});

	describe('validateValue', () => {
		test('should validate required string fields', () => {
			const errors = validateValue('slug', '', CONFIG_SCHEMA.slug);
			expect(errors.length).toBeGreaterThan(0);
			expect(errors[0]).toContain('required');
		});

		test('should validate string patterns', () => {
			const errors = validateValue(
				'slug',
				'Invalid Slug!',
				CONFIG_SCHEMA.slug
			);
			expect(errors.length).toBeGreaterThan(0);
			expect(errors[0]).toContain('pattern');
		});

		test('should validate valid slugs', () => {
			const errors = validateValue(
				'slug',
				'my-valid-theme',
				CONFIG_SCHEMA.slug
			);
			expect(errors.length).toBe(0);
		});

		test('should validate string length', () => {
			const longSlug = 'a'.repeat(100);
			const errors = validateValue('slug', longSlug, CONFIG_SCHEMA.slug);
			expect(errors.length).toBeGreaterThan(0);
		});

		test('should validate URLs', () => {
			const validUrl = validateValue(
				'author_uri',
				'https://example.com',
				CONFIG_SCHEMA.author_uri
			);
			expect(validUrl.length).toBe(0);

			const invalidUrl = validateValue(
				'author_uri',
				'not-a-url',
				CONFIG_SCHEMA.author_uri
			);
			expect(invalidUrl.length).toBeGreaterThan(0);
		});

		test('should require http/https protocol for URLs', () => {
			const ftpUrl = validateValue(
				'author_uri',
				'ftp://example.com',
				CONFIG_SCHEMA.author_uri
			);
			expect(ftpUrl.length).toBeGreaterThan(0);
			expect(ftpUrl[0]).toContain('protocol');
		});

		test('should validate semver format', () => {
			const validSemver = validateValue(
				'version',
				'1.0.0',
				CONFIG_SCHEMA.version
			);
			expect(validSemver.length).toBe(0);

			const invalidSemver = validateValue(
				'version',
				'v1.0',
				CONFIG_SCHEMA.version
			);
			expect(invalidSemver.length).toBeGreaterThan(0);
		});

		test('should validate WordPress version format', () => {
			const validVersion = validateValue(
				'min_wp_version',
				'6.0',
				CONFIG_SCHEMA.min_wp_version
			);
			expect(validVersion.length).toBe(0);

			const invalidVersion = validateValue(
				'min_wp_version',
				'invalid',
				CONFIG_SCHEMA.min_wp_version
			);
			expect(invalidVersion.length).toBeGreaterThan(0);
		});

		test('should validate enum values', () => {
			const validLicense = validateValue(
				'license',
				'GPL-2.0-or-later',
				CONFIG_SCHEMA.license
			);
			expect(validLicense.length).toBe(0);

			const invalidLicense = validateValue(
				'license',
				'INVALID-LICENSE',
				CONFIG_SCHEMA.license
			);
			expect(invalidLicense.length).toBeGreaterThan(0);
		});

		test('should handle optional fields without values', () => {
			const errors = validateValue('author', null, CONFIG_SCHEMA.author);
			expect(errors.length).toBe(0);
		});
	});

	describe('validateConfig', () => {
		test('should require slug and name', () => {
			const result = validateConfig({});
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		test('should validate minimal config', () => {
			const result = validateConfig({
				slug: 'test-theme',
				name: 'Test Theme',
			});
			expect(result.valid).toBe(true);
			expect(result.errors.length).toBe(0);
		});

		test('should validate complete config', () => {
			const result = validateConfig({
				slug: 'test-theme',
				name: 'Test Theme',
				description: 'A test theme',
				author: 'Test Author',
				author_uri: 'https://example.com',
				version: '1.0.0',
				min_wp_version: '6.0',
				tested_wp_version: '6.7',
				min_php_version: '8.0',
				license: 'GPL-2.0-or-later',
			});
			expect(result.valid).toBe(true);
			expect(result.errors.length).toBe(0);
		});

		test('should reject invalid slug format', () => {
			const result = validateConfig({
				slug: 'Invalid Theme!',
				name: 'Test Theme',
			});
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('slug'))).toBe(true);
		});

		test('should reject invalid version', () => {
			const result = validateConfig({
				slug: 'test-theme',
				name: 'Test Theme',
				version: 'invalid',
			});
			// Version is optional, so invalid value creates warning, not error
			// Config is still valid for required fields
			const hasVersionIssue =
				result.errors.some((e) => e.includes('version')) ||
				result.warnings.some((e) => e.includes('version'));
			expect(hasVersionIssue).toBe(true);
		});

		test('should collect warnings for optional fields', () => {
			const result = validateConfig({
				slug: 'test-theme',
				name: 'Test Theme',
				author_uri: 'not-a-url',
			});
			expect(result.warnings.length).toBeGreaterThan(0);
		});
	});

	describe('applyDefaults', () => {
		test('should apply default values', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
			};
			const result = applyDefaults(config);

			expect(result.slug).toBe('test-theme');
			expect(result.name).toBe('Test Theme');
			expect(result.description).toBe('A WordPress block theme.');
			expect(result.version).toBe('1.0.0');
		});

		test('should not override provided values', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
				version: '2.0.0',
				description: 'Custom description',
			};
			const result = applyDefaults(config);

			expect(result.version).toBe('2.0.0');
			expect(result.description).toBe('Custom description');
		});

		test('should derive theme_uri from slug', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};
			const result = applyDefaults(config);

			expect(result.theme_uri).toContain('my-theme');
			expect(result.theme_uri).toContain('wordpress.org');
		});

		test('should derive theme_repo_url from slug and author', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				author: 'Test Author',
			};
			const result = applyDefaults(config);

			expect(result.theme_repo_url).toContain('my-theme');
			expect(result.theme_repo_url).toContain('github.com');
		});

		test('should not override explicit URLs', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				theme_uri: 'https://custom.com/theme',
				theme_repo_url: 'https://custom.com/repo',
			};
			const result = applyDefaults(config);

			expect(result.theme_uri).toBe('https://custom.com/theme');
			expect(result.theme_repo_url).toBe('https://custom.com/repo');
		});

		test('should handle null defaults', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
			};
			const result = applyDefaults(config);

			// Fields with null defaults should not be set
			expect(result).toHaveProperty('slug');
			expect(result).toHaveProperty('name');
		});
	});

	describe('buildCommand', () => {
		test('should build basic command', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
			};
			const command = buildCommand(config);

			expect(command).toContain('node bin/generate-theme.js');
			expect(command).toContain('--slug test-theme');
			expect(command).toContain('--name Test Theme');
		});

		test('should include all provided options', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
				version: '1.0.0',
				author: 'Test Author',
			};
			const command = buildCommand(config);

			expect(command).toContain('--slug test-theme');
			expect(command).toContain('--name Test Theme');
			expect(command).toContain('--version 1.0.0');
			expect(command).toContain('--author Test Author');
		});

		test('should skip undefined values', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
				author: undefined,
			};
			const command = buildCommand(config);

			expect(command).toContain('--slug');
			expect(command).not.toContain('--author undefined');
		});

		test('should skip null values', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
				description: null,
			};
			const command = buildCommand(config);

			expect(command).not.toContain('--description null');
		});

		test('should format command properly', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
			};
			const command = buildCommand(config);

			// Should be space-separated
			expect(command.split(' ').length).toBeGreaterThan(2);
			expect(command.startsWith('node')).toBe(true);
		});
	});

	describe('getStageQuestions', () => {
		test('should return stage 1 questions', () => {
			const stage1 = getStageQuestions(1);

			expect(stage1.length).toBeGreaterThan(0);
			expect(stage1.some((q) => q.key === 'slug')).toBe(true);
			expect(stage1.some((q) => q.key === 'name')).toBe(true);
		});

		test('should return stage 2 questions', () => {
			const stage2 = getStageQuestions(2);

			expect(stage2.length).toBeGreaterThan(0);
			expect(stage2.some((q) => q.key === 'version')).toBe(true);
			expect(stage2.some((q) => q.key === 'min_wp_version')).toBe(true);
		});

		test('should return stage 3 questions', () => {
			const stage3 = getStageQuestions(3);

			expect(stage3.length).toBeGreaterThan(0);
			expect(stage3.some((q) => q.key === 'license')).toBe(true);
		});

		test('should include all schema properties', () => {
			const stage1 = getStageQuestions(1);

			stage1.forEach((q) => {
				expect(q).toHaveProperty('key');
				expect(q).toHaveProperty('stage');
				expect(q).toHaveProperty('required');
				expect(q).toHaveProperty('type');
				expect(q).toHaveProperty('description');
			});
		});

		test('should not mix stages', () => {
			const stage1 = getStageQuestions(1);
			const stage2 = getStageQuestions(2);

			const stage1Keys = stage1.map((q) => q.key);
			const stage2Keys = stage2.map((q) => q.key);

			// No overlap between stages
			const overlap = stage1Keys.filter((k) => stage2Keys.includes(k));
			expect(overlap.length).toBe(0);
		});
	});

	describe('Edge Cases', () => {
		test('should handle empty config validation', () => {
			const result = validateConfig({});
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		test('should handle whitespace in slug', () => {
			const errors = validateValue(
				'slug',
				'  test-theme  ',
				CONFIG_SCHEMA.slug
			);
			// Pattern should reject leading/trailing spaces
			expect(errors.length).toBeGreaterThan(0);
		});

		test('should handle special characters in name', () => {
			const errors = validateValue(
				'name',
				'Test™ Theme®',
				CONFIG_SCHEMA.name
			);
			// Should accept Unicode characters
			expect(errors.length).toBe(0);
		});

		test('should handle very long descriptions', () => {
			const longDesc = 'a'.repeat(600);
			const errors = validateValue(
				'description',
				longDesc,
				CONFIG_SCHEMA.description
			);
			expect(errors.length).toBeGreaterThan(0);
		});

		test('should handle semver with pre-release', () => {
			const errors = validateValue(
				'version',
				'1.0.0-alpha.1',
				CONFIG_SCHEMA.version
			);
			expect(errors.length).toBe(0);
		});

		test('should handle three-part WP versions', () => {
			const errors = validateValue(
				'min_wp_version',
				'6.0.1',
				CONFIG_SCHEMA.min_wp_version
			);
			expect(errors.length).toBe(0);
		});
	});

	describe('Integration Tests', () => {
		test('should validate and apply defaults in sequence', () => {
			const config = {
				slug: 'test-theme',
				name: 'Test Theme',
			};

			const validation = validateConfig(config);
			expect(validation.valid).toBe(true);

			const withDefaults = applyDefaults(config);
			expect(withDefaults.version).toBe('1.0.0');

			const command = buildCommand(withDefaults);
			expect(command).toContain('--version 1.0.0');
		});

		test('should handle complete workflow', () => {
			const input = {
				slug: 'my-theme',
				name: 'My Theme',
				author: 'Test Author',
			};

			// Validate
			const validation = validateConfig(input);
			expect(validation.valid).toBe(true);

			// Apply defaults
			const config = applyDefaults(input);
			expect(config.version).toBeDefined();
			expect(config.description).toBeDefined();

			// Build command
			const command = buildCommand(config);
			expect(command).toContain('node bin/generate-theme.js');
			expect(command).toContain('--slug my-theme');
		});
	});
});
