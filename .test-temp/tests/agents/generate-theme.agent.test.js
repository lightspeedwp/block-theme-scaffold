/**
 * Tests for Block Theme Generate Theme Agent
 *
 * @jest-environment jsdom
 */

const {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
} = require('../../scripts/generate-theme.agent');

describe('Generate Theme Agent', () => {
	describe('CONFIG_SCHEMA', () => {
		it('should have required stage 1 fields', () => {
			const requiredFields = Object.entries(CONFIG_SCHEMA)
				.filter(([, schema]) => schema.required && schema.stage === 1)
				.map(([key]) => key);

			expect(requiredFields).toContain('slug');
			expect(requiredFields).toContain('name');
		});

		it('should have valid default values', () => {
			const fieldsWithDefaults = Object.entries(CONFIG_SCHEMA).filter(
				([, schema]) => schema.default !== null
			);

			fieldsWithDefaults.forEach(([key, schema]) => {
				const errors = validateValue(key, schema.default, schema);
				expect(errors).toHaveLength(0);
			});
		});

		it('should have stages 1-3', () => {
			const stages = new Set(
				Object.values(CONFIG_SCHEMA).map((s) => s.stage)
			);
			expect(stages.has(1)).toBe(true);
			expect(stages.has(2)).toBe(true);
			expect(stages.has(3)).toBe(true);
		});
	});

	describe('validateValue', () => {
		describe('slug validation', () => {
			const slugSchema = CONFIG_SCHEMA.slug;

			it('should accept valid slugs', () => {
				expect(
					validateValue('slug', 'my-theme', slugSchema)
				).toHaveLength(0);
				expect(
					validateValue('slug', 'theme-123', slugSchema)
				).toHaveLength(0);
				expect(validateValue('slug', 'abc', slugSchema)).toHaveLength(
					0
				);
			});

			it('should reject invalid slugs', () => {
				expect(
					validateValue('slug', 'My-Theme', slugSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('slug', 'my_theme', slugSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('slug', '-theme', slugSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('slug', 'a', slugSchema).length
				).toBeGreaterThan(0);
			});

			it('should require slug when required', () => {
				expect(validateValue('slug', '', slugSchema)).toContain(
					'slug is required'
				);
				expect(validateValue('slug', null, slugSchema)).toContain(
					'slug is required'
				);
			});
		});

		describe('URL validation', () => {
			const urlSchema = CONFIG_SCHEMA.author_uri;

			it('should accept valid URLs', () => {
				expect(
					validateValue('url', 'https://example.com', urlSchema)
				).toHaveLength(0);
				expect(
					validateValue('url', 'http://localhost:3000', urlSchema)
				).toHaveLength(0);
			});

			it('should reject invalid URLs', () => {
				expect(
					validateValue('url', 'not-a-url', urlSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('url', 'ftp://example.com', urlSchema).length
				).toBeGreaterThan(0);
			});
		});

		describe('version validation', () => {
			const semverSchema = { type: 'semver', required: false };
			const versionSchema = { type: 'version', required: false };

			it('should accept valid semver', () => {
				expect(validateValue('v', '1.0.0', semverSchema)).toHaveLength(
					0
				);
				expect(
					validateValue('v', '1.2.3-beta.1', semverSchema)
				).toHaveLength(0);
			});

			it('should reject invalid semver', () => {
				expect(
					validateValue('v', '1.0', semverSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('v', 'v1.0.0', semverSchema).length
				).toBeGreaterThan(0);
			});

			it('should accept valid version strings', () => {
				expect(validateValue('v', '6.0', versionSchema)).toHaveLength(
					0
				);
				expect(validateValue('v', '8.0.0', versionSchema)).toHaveLength(
					0
				);
			});
		});
	});

	describe('validateConfig', () => {
		it('should validate minimal valid config', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail for missing required fields', () => {
			const config = {
				name: 'My Theme',
				// slug missing
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('slug'))).toBe(true);
		});

		it('should report warnings for invalid optional fields', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				author_uri: 'not-a-url',
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
			expect(result.warnings.length).toBeGreaterThan(0);
		});

		it('should validate complete config', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				description: 'A test theme',
				author: 'Test Author',
				author_uri: 'https://example.com',
				version: '1.0.0',
				min_wp_version: '6.0',
				tested_wp_version: '6.7',
				min_php_version: '8.0',
				license: 'GPL-2.0-or-later',
				theme_uri: 'https://example.com/theme',
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe('applyDefaults', () => {
		it('should apply default values', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};

			const result = applyDefaults(config);

			expect(result.version).toBe('1.0.0');
			expect(result.min_wp_version).toBe('6.0');
			expect(result.license).toBe('GPL-2.0-or-later');
		});

		it('should not override provided values', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				version: '2.0.0',
			};

			const result = applyDefaults(config);

			expect(result.version).toBe('2.0.0');
		});

		it('should derive namespace from slug', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};

			const result = applyDefaults(config);

			expect(result.namespace).toBe('my_theme');
		});

		it('should derive theme_uri from slug', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};

			const result = applyDefaults(config);

			expect(result.theme_uri).toContain('my-theme');
		});
	});

	describe('buildCommand', () => {
		it('should generate valid command string', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
			};

			const command = buildCommand(config);

			expect(command).toContain('node');
			expect(command).toContain('generate-theme.js');
			expect(command).toContain('--slug');
			expect(command).toContain('my-theme');
			expect(command).toContain('--name');
			expect(command).toContain('My Theme');
		});

		it('should include all provided options', () => {
			const config = {
				slug: 'my-theme',
				name: 'My Theme',
				author: 'Test Author',
				version: '1.2.3',
			};

			const command = buildCommand(config);

			expect(command).toContain('--author');
			expect(command).toContain('Test Author');
			expect(command).toContain('--version');
			expect(command).toContain('1.2.3');
		});
	});

	describe('getStageQuestions', () => {
		it('should return questions for stage 1', () => {
			const questions = getStageQuestions(1);

			expect(questions.length).toBeGreaterThan(0);
			expect(questions.some((q) => q.key === 'slug')).toBe(true);
			expect(questions.some((q) => q.key === 'name')).toBe(true);
		});

		it('should return questions for stage 2', () => {
			const questions = getStageQuestions(2);

			expect(questions.length).toBeGreaterThan(0);
			expect(questions.some((q) => q.key === 'version')).toBe(true);
		});

		it('should only return questions for the specified stage', () => {
			const stage1 = getStageQuestions(1);
			const stage2 = getStageQuestions(2);

			// No overlap
			const stage1Keys = stage1.map((q) => q.key);
			const stage2Keys = stage2.map((q) => q.key);

			stage1Keys.forEach((key) => {
				expect(stage2Keys).not.toContain(key);
			});
		});
	});

	describe('edge cases', () => {
		it('should handle empty config', () => {
			const result = validateConfig({});
			expect(result.valid).toBe(false);
		});

		it('should handle null values', () => {
			const config = {
				slug: null,
				name: null,
			};
			const result = validateConfig(config);
			expect(result.valid).toBe(false);
		});

		it('should handle undefined values', () => {
			const config = {
				slug: undefined,
				name: undefined,
			};
			const result = validateConfig(config);
			expect(result.valid).toBe(false);
		});

		it('should handle special characters in name', () => {
			const config = {
				slug: 'my-theme',
				name: "My Theme's Special! Name",
			};
			const result = validateConfig(config);
			expect(result.valid).toBe(true);
		});
	});
});
