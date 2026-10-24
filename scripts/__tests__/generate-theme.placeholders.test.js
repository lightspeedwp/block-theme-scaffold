/**
 * Generation leaves no unreplaced {{placeholder}} in a generated theme.
 * GitHub Actions expressions (${{ github.ref }}) have spaces and are not placeholders.
 *
 * Runs scripts/generate-theme.js in a temporary directory with the mock
 * config and with only the required keys, then scans every generated file.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const generator = path.resolve(__dirname, '..', 'generate-theme.js');
const mockConfig = path.resolve(
	__dirname,
	'..',
	'fixtures',
	'theme-config.mock.json'
);

function generate(configPath) {
	const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'bts-generate-'));
	execFileSync(process.execPath, [generator, '--config', configPath], {
		cwd,
		stdio: 'pipe',
	});
	return { cwd, output: path.join(cwd, 'output-theme') };
}

function leftovers(dir) {
	const found = [];
	for (const entry of fs.readdirSync(dir, {
		recursive: true,
		withFileTypes: true,
	})) {
		if (!entry.isFile()) {
			continue;
		}
		const file = path.join(entry.parentPath, entry.name);
		const tokens = fs
			.readFileSync(file, 'utf8')
			.match(/\{\{\{?[^{}\s]+\}?\}\}/g);
		if (tokens) {
			found.push(`${path.relative(dir, file)}: ${tokens.join(' ')}`);
		}
	}
	return found;
}

describe('generate-theme placeholders', () => {
	const cleanup = [];

	afterAll(() => {
		for (const dir of cleanup) {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});

	it('replaces every placeholder with the full mock config', () => {
		const { cwd, output } = generate(mockConfig);
		cleanup.push(cwd);
		expect(leftovers(output)).toEqual([]);
	});

	it('replaces every placeholder with only the required keys', () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bts-config-'));
		cleanup.push(dir);
		const configPath = path.join(dir, 'minimal.json');
		fs.writeFileSync(
			configPath,
			JSON.stringify({
				theme_slug: 'minimal-theme',
				theme_name: 'Minimal & Theme',
				author: 'LightSpeed',
			})
		);
		const { cwd, output } = generate(configPath);
		cleanup.push(cwd);
		expect(leftovers(output)).toEqual([]);

		// The XML-escaped name keeps phpcs.xml well formed.
		expect(
			fs.readFileSync(path.join(output, 'phpcs.xml'), 'utf8')
		).toContain('name="Minimal &amp; Theme"');
	});

	it('reads the repository URL from urls.theme_repo_url', () => {
		const { cwd, output } = generate(mockConfig);
		cleanup.push(cwd);
		const pkg = JSON.parse(
			fs.readFileSync(path.join(output, 'package.json'), 'utf8')
		);
		expect(pkg.repository.url).toBe(
			'https://github.com/lightspeedwp/tour-operator'
		);
	});
});
