---
title: Project Overview
description: WordPress block theme scaffold with comprehensive documentation
category: Project
type: Index
audience: Developers, Users
date: 2025-12-01
---

# {{theme_name}}

{{description}}

A modern WordPress block theme supporting Full Site Editing (FSE), built with mustache templates for rapid development and deployment.

## Features

- Full Site Editing (FSE) support with block templates
- Mustache template system for dynamic configuration
- Block patterns and template parts
- Style variations (e.g., dark mode)
- Modern asset pipeline with Webpack
- Automated testing (PHP, JS, CSS, E2E)
- CI/CD workflows
- GitHub Copilot integration
- Follows WordPress coding standards

## Requirements

- WordPress {{min_wp_version}} or higher
- PHP {{min_php_version}} or higher
- Node.js 18+
- npm 9+
- Composer (for PHP dependencies)

## Installation

### Development Installation

1. Clone this repository:

   ```bash
   git clone {{theme_repo_url}}
   cd {{theme_slug}}
   ```

2. Install dependencies:

   ```bash
   npm install
   composer install
   ```

3. Build assets:

   ```bash
   npm run build
   ```

### WordPress Installation

1. Upload the theme files to `/wp-content/themes/{{theme_slug}}` or install via WordPress admin.
2. Activate the theme in the 'Appearance' screen.
3. Customize theme settings in the Site Editor.

## Development

This theme follows WordPress coding standards and best practices.

### Setup

```bash
git clone {{theme_repo_url}}
cd {{theme_slug}}
npm install
composer install
npm run start
```

### Build Process

This theme uses `@wordpress/scripts` for a modern build workflow:

- **Compilation**: Modern JavaScript (ESNext/JSX) → Browser-compatible code via Babel
- **Bundling**: Multiple files combined into optimized bundles via webpack
- **Sass Compilation**: `.scss` files compiled to standard CSS
- **Code Minification**: JavaScript (Terser) and CSS (cssnano) optimization
- **Code Linting**: ESLint for JavaScript, Stylelint for CSS
- **Code Formatting**: Prettier for consistent styling

**Documentation**:

- 📖 [Build Process Guide](docs/BUILD-PROCESS.md) - Complete build documentation
- 📖 [wp-scripts Configuration](docs/WP-SCRIPTS-CONFIGURATION.md) - Detailed setup guide
- 📖 [Quick Reference](docs/WP-SCRIPTS-QUICK-REFERENCE.md) - Common tasks and commands
- 📖 [Summary](docs/WP-SCRIPTS-SUMMARY.md) - Configuration summary

### Available Scripts

#### Build Commands

- `npm run start` - Start development mode with hot reloading and watch mode
- `npm run build` - Build optimized production assets
- `npm run build:production` - Alternative production build

#### Code Quality

- `npm run lint` - Run all linters (JavaScript, CSS, PHP)
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:js:fix` - Auto-fix JavaScript issues
- `npm run lint:css` - Lint CSS/Sass files
- `npm run lint:css:fix` - Auto-fix CSS issues
- `npm run lint:php` - Lint PHP files
- `npm run format` - Format all files with Prettier

#### Testing

- `npm run test` - Run all tests (JavaScript + PHP)
- `npm run test:js` - Run JavaScript unit tests
- `npm run test:js:watch` - Run Jest in watch mode
- `npm run test:php` - Run PHP unit tests
- `npm run test:e2e` - Run end-to-end tests with Playwright

#### Internationalization

- `npm run makepot` - Generate translation POT file
- `npm run makejson` - Generate JSON translation files
- `npm run i18n` - Complete i18n workflow (makepot + makejson)

### Theme Structure

```
{{theme_slug}}/
├── .github/            # GitHub workflows and automation
├── assets/             # Source assets (images, fonts, etc.)
├── inc/                # PHP includes and functionality
├── parts/              # Template parts (header, footer, etc.)
├── patterns/           # Block patterns
├── src/                # Source files for build process
│   ├── css/           # SCSS/CSS source files
│   └── js/            # JavaScript source files
├── styles/             # Style variations
├── templates/          # Block templates
├── tests/              # Test files
├── public/             # Built assets (auto-generated)
├── functions.php       # Theme functions
├── style.css           # Main stylesheet with theme metadata
├── theme.json          # Theme configuration
├── package.json        # Node.js dependencies and scripts
├── composer.json       # PHP dependencies
├── webpack.config.js   # Webpack configuration
└── README.md           # This file
```

## Customization

### Using Mustache Templates

This theme uses mustache templates for easy customization. Key variables include:

- `{{theme_name}}` - Display name of the theme
- `{{theme_slug}}` - URL-safe theme identifier
- `{{description}}` - Theme description
- `{{author}}` - Theme author name
- `{{author_uri}}` - Author website URL
- `{{primary_color}}` - Primary brand color
- `{{secondary_color}}` - Secondary color
- `{{background_color}}` - Background color
- `{{text_color}}` - Text color
- `{{body_font}}` - Body font family

**Excluding files from mustache scanning:**

The mustache variable scanner respects a `.mustacheignore` file at the repository root. Use this to exclude files or directories from variable detection:

```bash
# Copy the example file
cp .mustacheignore.example .mustacheignore

# Edit to add custom patterns
# Patterns use gitignore syntax (glob patterns)
```

Common exclusions:

- Build artifacts (`build/**`, `dist/**`)
- Dependencies (`node_modules/**`, `vendor/**`)
- Test fixtures (`tests/fixtures/**`)
- Generated files

### Customizing Colors and Typography

Edit `theme.json` to customize:

- Color palette
- Typography settings
- Spacing scale
- Layout settings

### Adding Custom Patterns

1. Create new pattern files in the `patterns/` directory
2. Register patterns in `inc/block-patterns.php`
3. Add pattern categories as needed

## Testing

- **JavaScript**: Jest unit tests with coverage
- **Script helpers**: The scripts/`__tests__/` helpers are driven by `npm run test:scripts` (or `npm run test:scripts:coverage`) from the repo root, emit V8 coverage for `<rootDir>/scripts/**/*.js`, and drop every artifact (including `coverage/scripts/lcov.info`) into `coverage/scripts` so new helper modules stay part of the reports.
- **PHP**: PHPUnit tests with WordPress testing framework
- **End-to-End**: Playwright tests
- **Accessibility**: Automated a11y testing with axe-core
- **Performance**: Lighthouse CI and Core Web Vitals monitoring
- **Coverage**: Codecov integration with quality gates

## Docker Development

This scaffold includes a complete Docker-based development environment:

1. **Open in VS Code** with the Dev Containers extension
2. **Reopen in Container** when prompted
3. **Services included:**
   - WordPress (port 8080)
   - MariaDB (port 3306)
   - phpMyAdmin (port 8081)
   - MailHog (port 8025)

```bash
# Or manually start the environment
cd .devcontainer && docker-compose up -d
```

## CI/CD Pipeline

Automated workflows handle:

- **Linting & Testing** - On every push/PR
- **Security Audits** - Dependency vulnerability checks
- **E2E Tests** - Playwright browser testing
- **Code Coverage** - JavaScript & PHP coverage with Codecov
- **Bundle Analysis** - Size tracking and quality gates
- **Releases** - Automated version bumping and changelog
- **WordPress.org Deploy** - Theme directory deployment on release

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Support

### Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Build Process](docs/BUILD-PROCESS.md)** - Complete build system guide
- **[Testing Guide](docs/TESTING.md)** - Running and writing tests
- **[Internationalization](docs/INTERNATIONALIZATION.md)** - i18n and translation guide
- **[Tool Configuration](docs/TOOL-CONFIGS.md)** - Linting, formatting, and build tools
- **[Agents Guide](docs/AGENTS.md)** - AI agents and automation
- **[Workflows Guide](docs/WORKFLOWS.md)** - CI/CD workflows documentation
- **[API Reference](docs/API-REFERENCE.md)** - Theme API documentation
- **[Performance](docs/PERFORMANCE.md)** - Performance optimization guide
- **[Security](docs/SECURITY-HEADERS.md)** - Security best practices

**Configuration Documentation** (`docs/config/`):

- [wp-scripts](docs/config/wp-scripts.md) - Complete @wordpress/scripts guide
- [Webpack](docs/config/webpack.md) - Bundling configuration
- [Babel](docs/config/babel.md) - JavaScript compilation
- [ESLint](docs/config/eslint.md) - JavaScript linting
- [Stylelint](docs/config/stylelint.md) - CSS/Sass linting
- [PostCSS](docs/config/postcss.md) - CSS processing
- [Jest](docs/config/jest.md) - Unit testing
- [Playwright](docs/config/playwright.md) - E2E testing
- [Prettier](docs/config/prettier.md) - Code formatting

### Community Support

- Issues: [GitHub Issues]({{theme_repo_url}}/issues)
- Community: [WordPress.org Support](https://wordpress.org/support/theme/{{theme_slug}})

## License

This theme is licensed under the {{license}} - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

---

**{{theme_name}}** | v{{version}} | [{{license}}]({{license_uri}})
