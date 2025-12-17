// Jest tests for analysis.js utilities
const fs = require('fs');
const path = require('path');
const {
  shouldExclude,
  getMarkdownFiles,
  countTokens,
  analyzeFile,
} = require('../analysis');

describe('analysis.js utilities', () => {
  it('should exclude files by pattern', () => {
    expect(shouldExclude('node_modules/foo.js')).toBe(true);
    expect(shouldExclude('src/foo.js')).toBe(false);
  });

  it('should count mustache tokens in content', () => {
    const content = 'A {{foo}} and {{ bar }}.';
    expect(countTokens(content)).toBe(2);
  });

  it('should get markdown files from a directory', () => {
    const tmpDir = path.join(__dirname, 'tmp-md');
    fs.mkdirSync(tmpDir, { recursive: true });
    const mdFile = path.join(tmpDir, 'a.md');
    const txtFile = path.join(tmpDir, 'b.txt');
    fs.writeFileSync(mdFile, '# Markdown');
    fs.writeFileSync(txtFile, 'text');
    const files = getMarkdownFiles(tmpDir);
    expect(files).toContain(mdFile);
    expect(files).not.toContain(txtFile);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should analyze a file with a custom function', () => {
    const tmpFile = path.join(__dirname, 'tmp-analyze.txt');
    fs.writeFileSync(tmpFile, 'Hello {{foo}}');
    const result = analyzeFile(tmpFile, (c) => c.includes('{{foo}}'));
    expect(result).toBe(true);
    fs.unlinkSync(tmpFile);
  });
});
