---
title: Custom AI Instructions
description: Custom instructions for AI assistants and Copilot
category: Documentation
type: Guide
audience: AI Assistants, Developers
date: 2025-12-01
---


## Overview & Related Files

This repository is designed for advanced AI-assisted and Copilot-driven WordPress block theme development. All contributors and automation agents should follow these guidelines for maximum productivity, maintainability, and compliance with org standards.

**Related Files:**

- [Development Assistant](./agents/development-assistant.agent.md) — AI development assistant with context-specific modes
- [Prompts](./prompts/prompts.md) — prompt templates for consistent output
- [Main Agent Index](./agents/agent.md) — agent specs and usage
- [AGENTS.md](/AGENTS.md) — org-wide AI rules and global principles
- [Workflows](../workflows/) — CI/CD, performance, and deployment automation

---

## AI & Copilot Operations

- Use Copilot for code generation, refactoring, and documentation, but always review and test generated code.
- Reference `.github/agents/agent.md` for agent specs, triggers, and environment variables.
- Use `.github/agents/development-assistant.agent.md` for context-specific development modes (e.g., block pattern authoring, theme.json editing, PHP/JS/SCSS best practices).
- Use prompt templates in `.github/prompts/` for consistent, high-quality Copilot output.
- Tag PRs with `ai-generated` if Copilot or an agent contributed code.
- Prefer modular, reusable code and minimal dependencies.
- Use mustache variables for all theme and block templates.
- Validate all JSON (theme.json, block.json, etc.) with schema and semantic rules.
- Document all custom blocks, patterns, and theme features in the README and/or docs/.
- Use UK English and org style for all documentation and comments.
- Agents should be kept in sync with repo tooling (linters, build, tests).
- Use environment variables for agent runs (see agent.md for details).

---

## Example: {{theme_name}} Block Theme Instructions Template

Use the following as a template for project-specific block theme instructions:

---

You are an expert WordPress block theme developer working on {{theme_name}}, a modern WordPress block theme with Full Site Editing (FSE) support.

- **Theme Name**: {{theme_name}}
- **Theme Slug**: {{theme_slug}}
- **Version**: {{version}}
- **Description**: {{description}}
- **Architecture**: WordPress Block Theme with FSE support
- **Build System**: Webpack with @wordpress/scripts
- **Template System**: Mustache templates for configuration
- **Key Technologies**: WordPress Block Editor (Gutenberg), Full Site Editing (FSE), theme.json, block patterns, template parts, ES6+ JavaScript, SCSS, Webpack, PHPUnit, Jest

**File Structure:**

```
{{theme_slug}}/
├── .github/            # GitHub workflows and Copilot config
├── assets/             # Static assets (images, fonts)
├── inc/                # PHP includes and functionality
├── parts/              # Template parts (header, footer, etc.)
├── patterns/           # Block patterns
├── src/                # Source files for build process
│   ├── css/           # SCSS source files
│   └── js/            # JavaScript source files
├── styles/             # Style variations (dark mode, etc.)
├── templates/          # Block templates (HTML)
├── tests/              # Test files
├── public/             # Built assets (auto-generated)
├── functions.php       # Theme functions
├── style.css           # Theme metadata
├── theme.json          # Theme configuration
└── package.json        # Build configuration
```

## Coding Standards & Best Practices

### PHP

- Follow WordPress Coding Standards
- Use {{theme_slug}}_ prefix for all functions
- Escape all output with esc_html(), esc_attr(), etc.
- Sanitize all input
- Use WordPress hooks and filters appropriately

### JavaScript

- Use modern ES6+ syntax
- Follow WordPress JavaScript standards
- Use wp.domReady() for DOM manipulation
- Utilize WordPress packages (@wordpress/*)

### CSS/SCSS

- Use BEM methodology for custom classes
- Leverage CSS custom properties from theme.json
- Follow WordPress CSS standards
- Mobile-first responsive design

### Block Templates

- Use semantic HTML structure
- Include proper block comments
- Follow WordPress template hierarchy
- Ensure accessibility compliance

## Development Guidelines

### Block Patterns

- Register patterns in `inc/block-patterns.php`
- Use mustache variables for customizable content
- Include proper categories and keywords
- Test patterns in the Site Editor

### Templates

- Use HTML files in `templates/` directory
- Include proper template parts
- Follow WordPress template hierarchy
- Test with different content types

### Styles

- Primary styles in `theme.json`
- Additional styles in `src/css/`
- Use CSS custom properties
- Ensure cross-browser compatibility

### JavaScript

- Frontend scripts in `src/js/theme.js`
- Editor scripts in `src/js/editor.js`
- Use WordPress dependencies
- Ensure accessibility

## Build & Test Process

- Development: `npm run start`
- Production: `npm run build:production`
- Linting: `npm run lint`
- Testing: `npm test`

## Testing Requirements

- Write PHPUnit tests for PHP functions
- Write Jest tests for JavaScript
- Include E2E tests for critical features
- Test accessibility compliance
- Verify across different browsers

## General Best Practices

1. **Performance**: Optimize images, minify assets, lazy load content
2. **Accessibility**: Follow WCAG 2.1 AA guidelines
3. **Security**: Validate input, escape output, use nonces
4. **Compatibility**: Test with latest WordPress versions
5. **Documentation**: Comment complex code, update README

## Mustache Variables

Use these variables in templates and configuration files:

**Theme Meta**

- `{{theme_name}}` - Display name
- `{{theme_slug}}` - URL-safe identifier
- `{{description}}` - Theme description
- `{{version}}` - Current version
- `{{author}}` - Theme author
- `{{license}}` - License type

**Design Tokens**

- `{{primary_color}}` - Primary brand color
- `{{secondary_color}}` - Secondary color
- `{{background_color}}` - Background color
- `{{text_color}}` - Text color
- `{{font_family}}` - Body font
- `{{heading_font}}` - Heading font

**Content**

- `{{hero_title}}` - Hero section title
- `{{cta_text}}` - Call-to-action text
- `{{footer_text}}` - Footer copyright text

## Common Tasks

**Adding a New Block Pattern**

1. Create pattern in `inc/block-patterns.php`
2. Register with appropriate category
3. Use mustache variables for content
4. Test in Site Editor

**Adding a New Template**

1. Create HTML file in `templates/`
2. Follow block markup syntax
3. Include proper template parts
4. Test with different content

**Adding Custom Styles**

1. Add settings to `theme.json`
2. Create styles in `src/css/`
3. Register block styles if needed
4. Test responsive behavior

**Adding JavaScript Functionality**

1. Add to `src/js/theme.js` or `src/js/editor.js`
2. Use WordPress APIs and hooks
3. Ensure accessibility
4. Write tests

## Debugging

- Use WordPress debug mode
- Check browser console for errors
- Use WordPress debugging tools
- Test with default content
- Verify plugin compatibility

---

Remember to always test your changes thoroughly and follow WordPress best practices for theme development.
