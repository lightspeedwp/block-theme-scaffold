---
title: Claude AI Assistant Guide
description: Instructions for using Claude AI effectively with this WordPress block theme scaffold
category: Documentation
type: Guide
audience: Developers, AI Assistants
date: 2025-12-07
---

# Claude AI Assistant Guide

This repository is designed for AI-assisted WordPress block theme development using Claude. This guide helps both human developers and AI assistants work effectively with the codebase.

## Quick Start

**New to this project?** Start here:

1. Read [GOVERNANCE-START-HERE.md](./GOVERNANCE-START-HERE.md) (15-20 min)
2. Review [GOVERNANCE.md](./docs/GOVERNANCE.md) (Core policies)
3. Check [ARCHITECTURE.md](./docs/ARCHITECTURE.md) (Folder structure)
4. Scan [.github/instructions/](./.github/instructions/) (Coding standards)

## What Claude Can Help With

### Code Generation & Development

- **Block Patterns**: Generate semantic, accessible block patterns following WordPress standards
- **Templates**: Create block templates with proper hierarchy and mustache variables
- **theme.json**: Design token systems, style variations, and semantic color palettes
- **PHP Functions**: WordPress-compliant functions with proper escaping and nonce verification
- **JavaScript**: ES6+ code using WordPress packages and modern best practices
- **SCSS**: BEM methodology, mobile-first responsive styles, CSS custom properties

### Code Quality & Refactoring

- **Performance**: Optimize bundle size, lazy loading, efficient rendering
- **Security**: OWASP top 10 compliance, input validation, output escaping, nonce verification
- **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA labels, keyboard navigation
- **Standards Compliance**: WordPress coding standards (WPCS, ESLint, Stylelint)

### Testing & Validation

- **Unit Tests**: Jest tests for JavaScript, PHPUnit tests for PHP (80%+ coverage required)
- **E2E Tests**: Playwright tests for critical user flows and block interactions
- **Accessibility Tests**: Automated a11y testing with axe-core
- **Performance Tests**: Lighthouse scoring, bundle analysis, Core Web Vitals

### Documentation & Explanation

- **Code Explanation**: Understand complex WordPress hooks, filters, and Gutenberg APIs
- **Best Practices**: Guidance on WordPress and FSE (Full Site Editing) patterns
- **Migration Guides**: Help updating code for new WordPress/Gutenberg versions
- **API Documentation**: Generate clear, accurate API reference documentation

## Core Principles for AI Assistance

### 1. Follow Project Governance

**CRITICAL**: All Claude-generated code must follow governance rules:

- **Linting**: Pass ESLint (JS), Stylelint (CSS), PHPCS (PHP)
- **Testing**: Maintain 80%+ code coverage
- **Security**: Follow OWASP top 10, WordPress security standards
- **Accessibility**: WCAG 2.1 AA compliance
- **Naming**: Use conventions from [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)
- **Documentation**: Update docs with all changes

See [GOVERNANCE.md](./docs/GOVERNANCE.md) for complete requirements.

### 2. Use Mustache Variables

All theme-specific values must use mustache template variables:

```php
// ✓ Correct
function {{theme_slug}}_enqueue_styles() {
  wp_enqueue_style( '{{theme_slug}}-style', get_stylesheet_uri() );
}

// ✗ Wrong - Hardcoded values
function my_theme_enqueue_styles() {
  wp_enqueue_style( 'my-theme-style', get_stylesheet_uri() );
}
```

**Common Variables:**
- `{{theme_name}}` - Display name
- `{{theme_slug}}` - URL-safe identifier (use for function prefixes)
- `{{namespace}}` - Namespace/organization
- `{{version}}` - Current version
- `{{author}}` - Theme author
- See [custom-instructions.md](./.github/custom-instructions.md) for complete list

### 3. Reference Instruction Files

Before generating code, consult relevant instruction files in [.github/instructions/](./.github/instructions/):

**For WordPress/PHP:**
- [php-wordpress.instructions.md](./.github/instructions/php-wordpress.instructions.md)
- [php-block.instructions.md](./.github/instructions/php-block.instructions.md)
- [wp-security.instructions.md](./.github/instructions/wp-security.instructions.md)
- [wpcs-php.instructions.md](./.github/instructions/wpcs-php.instructions.md)

**For Block Theme Development:**
- [block-theme.instructions.md](./.github/instructions/block-theme.instructions.md)
- [block-theme-structure.instructions.md](./.github/instructions/block-theme-structure.instructions.md)
- [pattern-development.instructions.md](./.github/instructions/pattern-development.instructions.md)
- [theme-json.instructions.md](./.github/instructions/theme-json.instructions.md)

**For JavaScript/React:**
- [js-react.instructions.md](./.github/instructions/js-react.instructions.md)
- [wpcs-javascript.instructions.md](./.github/instructions/wpcs-javascript.instructions.md)

**For Accessibility:**
- [accessibility.instructions.md](./.github/instructions/accessibility.instructions.md)
- [a11y.instructions.md](./.github/instructions/a11y.instructions.md)
- [wpcs-accessibility.instructions.md](./.github/instructions/wpcs-accessibility.instructions.md)

**For Testing & Security:**
- [security-nonce.instructions.md](./.github/instructions/security-nonce.instructions.md)
- [theme-json-validation.instructions.md](./.github/instructions/theme-json-validation.instructions.md)

### 4. Maintain Code Quality

**Before suggesting code:**

1. Ensure it passes linting (ESLint/Stylelint/PHPCS)
2. Include proper error handling and validation
3. Add necessary security measures (nonces, escaping, sanitization)
4. Use WordPress APIs and hooks appropriately
5. Write in modern ES6+ JavaScript (not jQuery)
6. Follow BEM methodology for CSS classes
7. Include accessibility attributes (ARIA, semantic HTML)

**Quality checklist:**
- [ ] Passes linting standards
- [ ] Includes input validation
- [ ] Includes output escaping
- [ ] Uses nonces for forms/AJAX
- [ ] Has proper capability checks
- [ ] Follows naming conventions
- [ ] Includes inline documentation
- [ ] Has corresponding tests

### 5. Prefer Minimal, Modular Code

**Anti-patterns to avoid:**
- ❌ Over-engineering simple features
- ❌ Adding unnecessary abstractions
- ❌ Creating helpers for one-time operations
- ❌ Adding features beyond what was requested
- ❌ Premature optimization
- ❌ jQuery or legacy JavaScript patterns
- ❌ Inline styles (use theme.json or SCSS)

**Best practices:**
- ✓ Simple, focused solutions
- ✓ WordPress-native APIs and packages
- ✓ Reusable patterns for repeated code
- ✓ Modern JavaScript (ES6+)
- ✓ CSS custom properties from theme.json
- ✓ Semantic HTML structure

## Effective Prompts

### Pattern Generation

**Good:**
```
Create a hero pattern with:
- Full-width cover block with gradient overlay
- Semantic heading (h1) with {{hero_title}} variable
- Paragraph with {{hero_description}}
- Buttons group with primary CTA
- WCAG AA contrast compliance
- Mobile-responsive spacing
```

**Better:**
```
Generate a WordPress block pattern following pattern-development.instructions.md:

Pattern name: hero-with-cta
Category: featured
Keywords: hero, landing, cta

Structure:
- Cover block (full-width, gradient overlay from theme.json)
- Container with max-width and centered content
- Heading (h1, display font, {{hero_title}})
- Paragraph (body font, {{hero_description}})
- Buttons (primary + secondary, semantic colors)

Requirements:
- Use mustache variables for all content
- WCAG 2.1 AA contrast ratios
- Mobile-first responsive design
- Follow theme.json design tokens
- Include pattern registration in inc/block-patterns.php
```

### Refactoring for Security

**Good:**
```
Refactor this AJAX handler for security and WordPress standards:
[paste code]
```

**Better:**
```
Refactor this AJAX handler following wp-security.instructions.md and security-nonce.instructions.md:

Requirements:
- Add nonce verification
- Add capability checks
- Sanitize all input
- Escape all output
- Use WordPress data validation functions
- Add error handling
- Follow {{theme_slug}}_ naming convention
- Include inline security documentation

[paste code]
```

### Test Generation

**Good:**
```
Write a Jest test for the theme navigation component
```

**Better:**
```
Create a comprehensive Jest test suite for src/js/navigation.js:

Test coverage:
- Mobile menu toggle functionality
- Keyboard navigation (Tab, Enter, Escape)
- ARIA attributes update correctly
- Submenu expansion/collapse
- Focus management
- Event listener cleanup

Requirements:
- 80%+ code coverage
- Mock WordPress i18n functions
- Test accessibility attributes
- Follow WordPress JavaScript testing patterns
- Include setup/teardown
```

### theme.json Enhancement

**Good:**
```
Add a dark mode style variation to theme.json
```

**Better:**
```
Create a dark mode style variation following theme-json.instructions.md:

Requirements:
- Semantic color palette (surface, text, accent, etc.)
- Maintain WCAG AA contrast ratios
- Use CSS custom properties
- Include all color roles (background, text, links, borders)
- Test with existing blocks (button, heading, paragraph)
- Validate against WordPress 6.9 theme.json schema
- Document color token usage
```

## File Structure Context

When Claude generates code, it should place files according to [ARCHITECTURE.md](./docs/ARCHITECTURE.md):

| Code Type | Location | Naming |
|-----------|----------|--------|
| PHP functions | `inc/feature-name.php` | `kebab-case.php`, functions: `{{theme_slug}}_snake_case()` |
| JavaScript | `src/js/feature-name.js` | `kebab-case.js`, exports: `camelCase` or `PascalCase` |
| Styles | `src/css/feature-name.scss` | `kebab-case.scss`, classes: `.kebab-case` (BEM) |
| Block patterns | `patterns/pattern-name.php` | `kebab-case.php` |
| Templates | `templates/template-name.html` | `kebab-case.html` |
| Tests (JS) | `tests/js/test-feature-name.js` | `test-kebab-case.js` |
| Tests (PHP) | `tests/php/test-feature-name.php` | `test-kebab-case.php` |
| Documentation | `docs/FEATURE-NAME.md` | `UPPER-KEBAB-CASE.md` |

## Common Tasks & Workflows

### Adding a New Block Pattern

1. **Generate pattern file**: `patterns/pattern-name.php`
2. **Use pattern-development.instructions.md** for structure
3. **Include mustache variables** for customizable content
4. **Register in**: `inc/block-patterns.php`
5. **Test in**: Site Editor and pattern inserter
6. **Document**: Update README or docs/PATTERNS.md

### Creating a Custom Style Variation

1. **Create variation file**: `styles/variation-name.json`
2. **Follow theme-json.instructions.md** schema
3. **Use semantic color tokens** from theme.json
4. **Test WCAG contrast ratios** (4.5:1 for text)
5. **Validate**: Against WordPress schema
6. **Document**: Color usage and accessibility notes

### Refactoring for Performance

1. **Analyze**: Run `npm run analyze-bundle`
2. **Identify**: Large dependencies or unused code
3. **Optimize**: Code splitting, lazy loading, tree shaking
4. **Test**: `npm run performance` and `npm run lighthouse`
5. **Verify**: Bundle size < 50KB gzipped, Lighthouse score 90+
6. **Document**: Performance improvements in CHANGELOG.md

### Writing Tests

1. **Unit tests (JS)**: `tests/js/test-feature.js` using Jest
2. **Unit tests (PHP)**: `tests/php/test-feature.php` using PHPUnit
3. **E2E tests**: `tests/e2e/feature.spec.js` using Playwright
4. **Run tests**: `npm run test` (must maintain 80%+ coverage)
5. **Document**: Test scenarios and edge cases

## Logging & Reporting

When Claude performs automated tasks, log output following [LOGGING.md](./docs/LOGGING.md):

```javascript
// Example for automated code generation
const logger = new FileLogger('claude-generation');
logger.info('[CLAUDE] Starting pattern generation');
logger.debug('[STEP 1] Reading template files');
logger.info('[RESULT] Generated 3 patterns');
await logger.save(); // Saves to logs/agents/YYYY-MM-DD-claude-generation.log
```

**Log location**: `logs/agents/`
**Report location**: `.github/reports/agents/`

Both are gitignored and excluded from distribution.

## Review & Testing Workflow

**After Claude generates code:**

1. **Review code** for adherence to standards
2. **Run linting**: `npm run lint`
3. **Run tests**: `npm run test`
4. **Check coverage**: Should maintain 80%+
5. **Test manually**: Verify functionality in WordPress
6. **Review security**: Check nonces, escaping, validation
7. **Check accessibility**: Test with keyboard and screen reader
8. **Update docs**: Document new features/changes
9. **Commit**: With meaningful message following conventions

## Available Scripts

```bash
# Development
npm run start              # Start development build with watch
npm run build              # Production build
npm run build:production   # Optimized production build

# Code Quality
npm run lint               # Run all linters (JS, CSS, PHP)
npm run lint:js            # ESLint for JavaScript
npm run lint:css           # Stylelint for CSS/SCSS
npm run lint:php           # PHPCS for PHP
npm run format             # Prettier formatting

# Testing
npm run test               # Run all tests (JS + PHP)
npm run test:js            # Jest unit tests
npm run test:php           # PHPUnit tests
npm run test:e2e           # Playwright E2E tests
npm run test:e2e:a11y      # Accessibility tests

# Performance
npm run lighthouse         # Lighthouse audit
npm run analyze-bundle     # Bundle size analysis
npm run performance        # Run all performance checks

# Internationalization
npm run i18n               # Generate translation files
```

## Related Documentation

### Getting Started
- [GOVERNANCE-START-HERE.md](./GOVERNANCE-START-HERE.md) - Quick navigation guide
- [GOVERNANCE.md](./docs/GOVERNANCE.md) - Core policies and standards
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Repository structure

### Development Guides
- [.github/custom-instructions.md](./.github/custom-instructions.md) - Detailed AI instructions
- [.github/instructions/](./.github/instructions/) - Code-specific standards
- [docs/BUILD_PROCESS.md](./docs/BUILD_PROCESS.md) - Build system documentation
- [docs/TESTING.md](./docs/TESTING.md) - Testing requirements and patterns

### Standards & Compliance
- [docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) - Naming conventions
- [docs/LOGGING.md](./docs/LOGGING.md) - Logging standards
- [docs/SECURITY.md](./docs/SECURITY.md) - Security requirements
- [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) - Performance targets

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Major rewrite with comprehensive guidance |
| 2025-12-07 | Added governance integration and file structure |
| 2025-12-07 | Enhanced prompt examples and best practices |
| 2024-12-01 | Initial version |

---

**Remember**: Claude is a powerful tool, but all generated code must be reviewed, tested, and validated by humans before merging. This ensures quality, security, and alignment with project goals.
