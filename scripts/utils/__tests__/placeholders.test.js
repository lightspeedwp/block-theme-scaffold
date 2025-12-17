// Jest tests for placeholders.js utilities
const {
  PLACEHOLDER_MAP,
  replacePlaceholders,
  isScaffoldMode,
} = require('../placeholders');

describe('placeholders.js utilities', () => {
  it('should replace placeholders in content', () => {
    const content = 'Theme: {{theme_slug}}, Author: {{author}}';
    const replaced = replacePlaceholders(content, {
      '{{theme_slug}}': 'demo-theme',
      '{{author}}': 'Demo Author',
    });
    expect(replaced).toContain('demo-theme');
    expect(replaced).toContain('Demo Author');
  });

  it('should detect scaffold mode', () => {
    expect(isScaffoldMode('scaffold')).toBe(true);
    expect(isScaffoldMode('development')).toBe(true);
    expect(isScaffoldMode('production')).toBe(false);
  });

  it('should export PLACEHOLDER_MAP', () => {
    expect(PLACEHOLDER_MAP).toHaveProperty('{{theme_slug}}');
  });
});
