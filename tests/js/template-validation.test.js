/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

describe('Theme Template Validation', () => {
	const templatesDir = path.join(__dirname, '..', '..', 'templates');
	const partsDir = path.join(__dirname, '..', '..', 'parts');

	test('templates directory exists', () => {
		expect(fs.existsSync(templatesDir)).toBe(true);
	});

	test('parts directory exists', () => {
		expect(fs.existsSync(partsDir)).toBe(true);
	});

	describe('Required templates', () => {
		const requiredTemplates = [
			'index.html',
			'single.html',
			'page.html',
			'404.html',
		];

		requiredTemplates.forEach((template) => {
			test(`${template} exists`, () => {
				const templatePath = path.join(templatesDir, template);
				expect(fs.existsSync(templatePath)).toBe(true);
			});

			test(`${template} is valid HTML`, () => {
				const templatePath = path.join(templatesDir, template);
				const content = fs.readFileSync(templatePath, 'utf8');
				expect(content).toBeTruthy();
				expect(content.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Template parts', () => {
		const requiredParts = ['header.html', 'footer.html'];

		requiredParts.forEach((part) => {
			test(`${part} exists`, () => {
				const partPath = path.join(partsDir, part);
				expect(fs.existsSync(partPath)).toBe(true);
			});

			test(`${part} contains valid block markup`, () => {
				const partPath = path.join(partsDir, part);
				const content = fs.readFileSync(partPath, 'utf8');
				expect(content).toContain('<!-- wp:');
				expect(content).toContain('/-->');
			});
		});
	});

	describe('Block markup validation', () => {
		function getTemplateFiles(dir) {
			if (!fs.existsSync(dir)) {
				return [];
			}
			return fs
				.readdirSync(dir)
				.filter((file) => file.endsWith('.html'))
				.map((file) => path.join(dir, file));
		}

		const allTemplates = [
			...getTemplateFiles(templatesDir),
			...getTemplateFiles(partsDir),
		];

		allTemplates.forEach((templatePath) => {
			const filename = path.basename(templatePath);

			test(`${filename} has valid block comments`, () => {
				const content = fs.readFileSync(templatePath, 'utf8');

				// Check for opening block comments
				const openings = (content.match(/<!-- wp:/g) || []).length;
				const closings = (content.match(/\/-->/g) || []).length;

				expect(openings).toBeGreaterThan(0);
				expect(openings).toBe(closings);
			});

			test(`${filename} includes template-part references correctly`, () => {
				const content = fs.readFileSync(templatePath, 'utf8');

				if (content.includes('template-part')) {
					expect(content).toMatch(/<!-- wp:template-part.*"slug":/);
				}
			});

			test(`${filename} has proper semantic HTML`, () => {
				const content = fs.readFileSync(templatePath, 'utf8');

				// Check for semantic tags in main templates
				if (
					filename.includes('index') ||
					filename.includes('single') ||
					filename.includes('page')
				) {
					const hasMain =
						content.includes('tagName":"main"') ||
						content.includes('<main');
					expect(hasMain).toBe(true);
				}

				if (filename === 'header.html') {
					const hasHeader =
						content.includes('tagName":"header"') ||
						content.includes('<header');
					expect(hasHeader).toBe(true);
				}

				if (filename === 'footer.html') {
					const hasFooter =
						content.includes('tagName":"footer"') ||
						content.includes('<footer');
					expect(hasFooter).toBe(true);
				}
			});
		});
	});

	describe('Accessibility checks', () => {
		function getTemplateFiles(dir) {
			if (!fs.existsSync(dir)) {
				return [];
			}
			return fs
				.readdirSync(dir)
				.filter((file) => file.endsWith('.html'))
				.map((file) => path.join(dir, file));
		}

		const allTemplates = [
			...getTemplateFiles(templatesDir),
			...getTemplateFiles(partsDir),
		];

		allTemplates.forEach((templatePath) => {
			const filename = path.basename(templatePath);
			const content = fs.readFileSync(templatePath, 'utf8');

			test(`${filename} skip links have proper aria-hidden on spacers`, () => {
				const spacers = content.match(/wp:spacer/g);
				if (spacers) {
					expect(content).toContain('aria-hidden="true"');
				}
			});

			test(`${filename} images should have alt attributes or decorative markup`, () => {
				if (content.includes('wp:image')) {
					// Images should either have alt text or be marked decorative
					const hasAltOrDecorative =
						content.includes('"alt":') ||
						content.includes('role="presentation"') ||
						content.includes('aria-hidden="true"');
					expect(hasAltOrDecorative).toBe(true);
				}
			});
		});
	});
});
