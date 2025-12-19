// Dry-run validation script for theme.json using the local schema
// Usage: node scripts/validate-theme-json.js

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const themeJsonPath = path.resolve(__dirname, '../theme.json');
const schemaPath = path.resolve(__dirname, '../.github/schemas/theme.6.9.json');

function stripMustache(obj) {
	if (typeof obj === 'string') {
		// Replace mustache tokens with a valid placeholder
		return obj.replace(/{{[^}]+}}/g, 'PLACEHOLDER');
	}
	if (Array.isArray(obj)) {
		return obj.map(stripMustache);
	}
	if (obj && typeof obj === 'object') {
		const out = {};
		for (const key in obj) {
			out[key] = stripMustache(obj[key]);
		}
		return out;
	}
	return obj;
}

function main() {
	const themeJsonRaw = fs.readFileSync(themeJsonPath, 'utf8');
	const themeJson = JSON.parse(themeJsonRaw);
	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

	// Remove $schema property for validation
	delete themeJson['$schema'];

	// Replace mustache tokens
	const themeJsonSanitized = stripMustache(themeJson);

	const ajv = new Ajv({ allErrors: true, strict: false });
	addFormats(ajv);
	const validate = ajv.compile(schema);
	const valid = validate(themeJsonSanitized);

	if (valid) {
		console.log('theme.json is valid against the local schema.');
		return true;
	}

	const message =
		'theme.json validation failed:\n' +
		validate.errors
			.map((err) => `- ${err.instancePath} ${err.message}`)
			.join('\n');
	throw new Error(message);
}

try {
	main();
} catch (error) {
	if (require.main === module) {
		console.error(error.message);
		process.exit(1);
	}
	throw error;
}
