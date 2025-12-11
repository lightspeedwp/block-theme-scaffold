/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

describe('theme.json Schema Validation', () => {
	const themeJsonPath = path.join(__dirname, '..', '..', 'theme.json');
	let themeJson;

	beforeAll(() => {
		expect(fs.existsSync(themeJsonPath)).toBe(true);
		const content = fs.readFileSync(themeJsonPath, 'utf8');
		themeJson = JSON.parse(content);
	});

	test('theme.json is valid JSON', () => {
		expect(themeJson).toBeDefined();
		expect(typeof themeJson).toBe('object');
	});

	test('has required top-level properties', () => {
		expect(themeJson).toHaveProperty('$schema');
		expect(themeJson).toHaveProperty('version');
		expect(themeJson.version).toBe(2);
	});

	describe('Settings section', () => {
		test('settings section exists', () => {
			expect(themeJson).toHaveProperty('settings');
			expect(typeof themeJson.settings).toBe('object');
		});

		test('has color settings', () => {
			if (themeJson.settings?.color) {
				expect(themeJson.settings.color).toHaveProperty('palette');
				expect(Array.isArray(themeJson.settings.color.palette)).toBe(
					true
				);

				// Validate palette structure
				if (themeJson.settings.color.palette.length > 0) {
					themeJson.settings.color.palette.forEach((color) => {
						expect(color).toHaveProperty('slug');
						expect(color).toHaveProperty('color');
						expect(color).toHaveProperty('name');
						expect(typeof color.slug).toBe('string');
						expect(typeof color.color).toBe('string');
						expect(color.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
					});
				}
			}
		});

		test('has typography settings', () => {
			if (themeJson.settings?.typography) {
				const typo = themeJson.settings.typography;

				if (typo.fontSizes) {
					expect(Array.isArray(typo.fontSizes)).toBe(true);
					typo.fontSizes.forEach((size) => {
						expect(size).toHaveProperty('slug');
						expect(size).toHaveProperty('size');
						expect(size).toHaveProperty('name');
					});
				}

				if (typo.fontFamilies) {
					expect(Array.isArray(typo.fontFamilies)).toBe(true);
				}
			}
		});

		test('has spacing settings', () => {
			if (themeJson.settings?.spacing) {
				const spacing = themeJson.settings.spacing;

				if (spacing.spacingSizes) {
					expect(Array.isArray(spacing.spacingSizes)).toBe(true);
					spacing.spacingSizes.forEach((size) => {
						expect(size).toHaveProperty('slug');
						expect(size).toHaveProperty('size');
						expect(size).toHaveProperty('name');
					});
				}
			}
		});
	});

	describe('Styles section', () => {
		test('styles section exists', () => {
			expect(themeJson).toHaveProperty('styles');
			expect(typeof themeJson.styles).toBe('object');
		});

		test('has valid color styles', () => {
			if (themeJson.styles?.color) {
				const color = themeJson.styles.color;

				if (color.background) {
					expect(typeof color.background).toBe('string');
				}

				if (color.text) {
					expect(typeof color.text).toBe('string');
				}
			}
		});

		test('has valid typography styles', () => {
			if (themeJson.styles?.typography) {
				const typo = themeJson.styles.typography;

				if (typo.fontSize) {
					expect(typeof typo.fontSize).toBe('string');
				}

				if (typo.lineHeight) {
					expect(typeof typo.lineHeight).toBe('string');
				}
			}
		});

		test('has valid elements styles', () => {
			if (themeJson.styles?.elements) {
				const elements = themeJson.styles.elements;

				[
					'link',
					'button',
					'heading',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
				].forEach((element) => {
					if (elements[element]) {
						expect(typeof elements[element]).toBe('object');
					}
				});
			}
		});

		test('has valid blocks styles', () => {
			if (themeJson.styles?.blocks) {
				const blocks = themeJson.styles.blocks;

				Object.keys(blocks).forEach((blockName) => {
					expect(blockName).toMatch(/^core\//);
					expect(typeof blocks[blockName]).toBe('object');
				});
			}
		});
	});

	describe('Template Parts', () => {
		test('templateParts section is valid', () => {
			if (themeJson.templateParts) {
				expect(Array.isArray(themeJson.templateParts)).toBe(true);

				themeJson.templateParts.forEach((part) => {
					expect(part).toHaveProperty('name');
					expect(part).toHaveProperty('area');
					expect(typeof part.name).toBe('string');
					expect([
						'header',
						'footer',
						'general',
						'uncategorized',
					]).toContain(part.area);
				});
			}
		});
	});

	describe('Custom Templates', () => {
		test('customTemplates section is valid', () => {
			if (themeJson.customTemplates) {
				expect(typeof themeJson.customTemplates).toBe('object');

				Object.keys(themeJson.customTemplates).forEach(
					(templateKey) => {
						const template = themeJson.customTemplates[templateKey];
						expect(template).toHaveProperty('title');
						expect(typeof template.title).toBe('string');

						if (template.postTypes) {
							expect(Array.isArray(template.postTypes)).toBe(
								true
							);
						}
					}
				);
			}
		});
	});

	describe('Patterns', () => {
		test('patterns section is valid', () => {
			if (themeJson.patterns) {
				expect(Array.isArray(themeJson.patterns)).toBe(true);
			}
		});
	});

	describe('Color palette validation', () => {
		test('color slugs are unique', () => {
			if (themeJson.settings?.color?.palette) {
				const slugs = themeJson.settings.color.palette.map(
					(c) => c.slug
				);
				const uniqueSlugs = new Set(slugs);
				expect(slugs.length).toBe(uniqueSlugs.size);
			}
		});

		test('color values are valid hex', () => {
			if (themeJson.settings?.color?.palette) {
				themeJson.settings.color.palette.forEach((color) => {
					expect(color.color).toMatch(
						/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/
					);
				});
			}
		});
	});

	describe('Font size validation', () => {
		test('font size slugs are unique', () => {
			if (themeJson.settings?.typography?.fontSizes) {
				const slugs = themeJson.settings.typography.fontSizes.map(
					(f) => f.slug
				);
				const uniqueSlugs = new Set(slugs);
				expect(slugs.length).toBe(uniqueSlugs.size);
			}
		});

		test('font sizes have valid units', () => {
			if (themeJson.settings?.typography?.fontSizes) {
				themeJson.settings.typography.fontSizes.forEach((size) => {
					expect(size.size).toMatch(/(px|em|rem|%|vw|vh)$/);
				});
			}
		});
	});

	describe('Spacing scale validation', () => {
		test('spacing slugs are unique', () => {
			if (themeJson.settings?.spacing?.spacingSizes) {
				const slugs = themeJson.settings.spacing.spacingSizes.map(
					(s) => s.slug
				);
				const uniqueSlugs = new Set(slugs);
				expect(slugs.length).toBe(uniqueSlugs.size);
			}
		});

		test('spacing sizes have valid units', () => {
			if (themeJson.settings?.spacing?.spacingSizes) {
				themeJson.settings.spacing.spacingSizes.forEach((size) => {
					expect(size.size).toMatch(/(px|em|rem|%|vw|vh)$/);
				});
			}
		});
	});
});
