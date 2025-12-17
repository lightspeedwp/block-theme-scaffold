/**
 * Test suite for wizard.js interface registry and runWizard.
 *
 * @file scripts/lib/tests/wizard.test.js
 * @see ../wizard.js
 *
 * @todo
 *  - Add more edge case and error tests
 *  - Add integration tests for CLI and HTTP interfaces
 *  - Add coverage for invalid config files and error paths
 *  - Test schema validation (when implemented)
 */

const { runWizard, wizardInterfaces } = require('../wizard');
const fs = require('fs');
const path = require('path');

// Mock logger
const logger = { info: jest.fn(), error: jest.fn() };

describe('wizardInterfaces', () => {
  it('mock returns default/mock values', async () => {
    const questions = [
      { name: 'foo', default: 'bar' },
      { name: 'baz' },
    ];
    const config = await wizardInterfaces.mock(questions, { logger });
    expect(config.foo).toBe('bar');
    expect(config.baz).toBe('mock-value');
  });

  it('env returns values from process.env', async () => {
    process.env.TEST_ENV_VAR = 'env-value';
    const questions = [ { name: 'TEST_ENV_VAR' }, { name: 'MISSING_VAR' } ];
    const config = await wizardInterfaces.env(questions, { logger });
    expect(config.TEST_ENV_VAR).toBe('env-value');
    expect(config.MISSING_VAR).toBe('');
  });

  it('json loads config from file', async () => {
    const tmpPath = path.join(__dirname, 'test-config.json');
    fs.writeFileSync(tmpPath, JSON.stringify({ foo: 'bar', baz: 42 }));
    const config = await wizardInterfaces.json([], { configPath: tmpPath, logger });
    expect(config.foo).toBe('bar');
    expect(config.baz).toBe(42);
    fs.unlinkSync(tmpPath);
  });

  it('yaml loads config from file', async () => {
    let yaml;
    try {
      yaml = require('js-yaml');
    } catch (e) {
      return; // skip if js-yaml not installed
    }
    const tmpPath = path.join(__dirname, 'test-config.yaml');
    fs.writeFileSync(tmpPath, 'foo: bar\nbaz: 42\n');
    const config = await wizardInterfaces.yaml([], { configPath: tmpPath, logger });
    expect(config.foo).toBe('bar');
    expect(config.baz).toBe(42);
    fs.unlinkSync(tmpPath);
  });

  it('stdin reads JSON from stdin', async () => {
    // Simulate stdin by replacing process.stdin
    const origStdin = process.stdin;
    const { PassThrough } = require('stream');
    const mockStdin = new PassThrough();
    process.stdin = mockStdin;
    setImmediate(() => {
      mockStdin.write('{"foo":"bar"}\n');
      mockStdin.end();
    });
    const config = await wizardInterfaces.stdin([], { logger, format: 'json' });
    expect(config.foo).toBe('bar');
    process.stdin = origStdin;
  });

  it('http throws if node-fetch not installed', async () => {
    // This test only checks error if node-fetch is missing
    let fetchFn;
    try {
      fetchFn = require('node-fetch');
    } catch (e) {
      await expect(wizardInterfaces.http([], { url: 'http://localhost', logger })).rejects.toThrow('node-fetch is not installed');
      return;
    }
    // If node-fetch is installed, skip (integration test would be needed)
  });
});

describe('runWizard', () => {
  it('delegates to the correct interface', async () => {
    const questions = [ { name: 'foo', default: 'bar' } ];
    const config = await runWizard({ mode: 'mock', questions, logger });
    expect(config.foo).toBe('bar');
  });

  it('throws on unknown mode', async () => {
    await expect(runWizard({ mode: 'not-a-real-mode', questions: [], logger })).rejects.toThrow('Unknown wizard mode');
  });
});
