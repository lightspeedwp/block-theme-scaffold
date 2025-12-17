// Jest tests for scan.js utilities
const fs = require('fs');
const path = require('path');
const { scanDirectory, extractVariables, categorizeVariable } = require('../scan');

describe('scan.js utilities', () => {
  it('should extract mustache variables from content', () => {
    const content = 'Hello {{theme_slug}} and {{ author }}!';
    const vars = extractVariables(content);
    expect(vars).toContain('theme_slug');
    expect(vars).toContain('author');
  });

  it('should categorize variables', () => {
    expect(categorizeVariable('theme_slug')).toBe('theme');
    expect(categorizeVariable('author_uri')).toBe('author');
    expect(categorizeVariable('primary_color')).toBe('color');
    expect(categorizeVariable('foo')).toBe('other');
  });

  it('should scan a directory and find files', () => {
    // Create a temp dir with files
    const tmpDir = path.join(__dirname, 'tmp-scan');
    fs.mkdirSync(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, 'file.txt');
    fs.writeFileSync(filePath, 'test');
    const found = [];
    scanDirectory(tmpDir, (f) => found.push(f));
    expect(found).toContain(filePath);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
