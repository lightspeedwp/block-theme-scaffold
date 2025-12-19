/**
 * Test: Validate all JSON schema example files in .github/schemas/examples/
 *
 * This test ensures that every example config validates against its corresponding schema.
 *
 * TODO: Add more schema/example pairs as new schemas are added.
 */

const fs = require('fs');
const path = require('path');

const Ajv = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');

const EXAMPLE_VALIDATIONS = [
	{
		name: 'theme-config.example.json',
		examplePath: path.join(
			__dirname,
			'../../.github/schemas/examples/theme-config.example.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
	{
		name: 'theme-config.template.json',
		examplePath: path.join(
			__dirname,
			'../../scripts/fixtures/theme-config.template.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
	{
		name: 'agency-pro.config.json',
		examplePath: path.join(
			__dirname,
			'../../.github/schemas/examples/agency-pro.config.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
	{
		name: 'ecommerce-hub.config.json',
		examplePath: path.join(
			__dirname,
			'../../.github/schemas/examples/ecommerce-hub.config.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
	{
		name: 'blog-pro.config.json',
		examplePath: path.join(
			__dirname,
			'../../.github/schemas/examples/blog-pro.config.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
	{
		name: 'tour-operator.config.json',
		examplePath: path.join(
			__dirname,
			'../../.github/schemas/examples/tour-operator.config.json'
		),
		schemaPath: path.join(
			__dirname,
			'../../.github/schemas/theme-config.schema.json'
		),
	},
];

describe('Schema Example Validation', () => {
	EXAMPLE_VALIDATIONS.forEach(({ name, examplePath, schemaPath }) => {
		it(`${name} should validate against ${path.relative(__dirname, schemaPath)}`, () => {
			const example = JSON.parse(fs.readFileSync(examplePath, 'utf8'));
			const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
			const ajv = new Ajv({ allErrors: true });
			addFormats(ajv);
			if (schema.$schema) delete schema.$schema;
			const validate = ajv.compile(schema);
			const valid = validate(example);
			if (!valid) {
				console.error(validate.errors);
			}
			expect(valid).toBe(true);
		});
	});
});
