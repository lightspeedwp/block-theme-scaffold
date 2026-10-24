---
title: Contributing Guidelines
description: Guidelines for contributing to the project
category: Project
type: Guide
audience: Developers
date: 2025-12-01
---

Thank you for your interest in contributing to {{theme_name}}! We welcome contributions from everyone.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [existing issues]({{theme_repo_url}}/issues) to see if the problem has already been reported. If you're unable to find an open issue addressing the problem, [open a new one]({{theme_repo_url}}/issues/new).

When creating a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- WordPress version
- Theme version
- Browser and version
- Any relevant error messages

### Suggesting Enhancements

Enhancement suggestions are welcome! Please [open an issue]({{theme_repo_url}}/issues/new) with:

- A clear and descriptive title
- Detailed description of the enhancement
- Use cases for the enhancement
- Any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests as needed
5. Update documentation if necessary
6. Ensure all tests pass (`npm test`)
7. Ensure code follows project standards (`npm run lint`)
8. Commit your changes (`git commit -m 'Add amazing feature'`)
9. Push to the branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

#### Pull Request Guidelines

- Keep pull requests focused on a single feature or bug fix
- Include a clear description of what the PR does
- Reference any related issues
- Update the changelog for user-facing changes
- Ensure all checks pass
- Request review from maintainers

## Development Setup

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup instructions.

### Quick Start

```bash
git clone {{theme_repo_url}}
cd {{theme_slug}}
npm install
composer install
npm run start
```

## Coding Standards

- **PHP**: Follow WordPress coding standards
- **JavaScript**: Use WordPress JavaScript standards
- **CSS**: Follow WordPress CSS standards
- **Commits**: Use conventional commit format

### Running Tests

```bash
# All tests
npm test

# JavaScript only
npm run test:js

# PHP only
npm run test:php

# End-to-end tests
npm run test:e2e

# Linting
npm run lint
```

## Theme Structure

```
{{theme_slug}}/
├── .github/            # GitHub workflows and templates
├── assets/             # Static assets
├── inc/                # PHP includes
├── parts/              # Template parts
├── patterns/           # Block patterns
├── src/                # Source files
├── styles/             # Style variations
├── templates/          # Block templates
├── tests/              # Test files
└── public/             # Built assets
```

## Documentation

- All public functions should be documented
- Update README.md for significant changes
- Keep changelog updated
- Document any breaking changes

## Security

If you discover a security vulnerability, please send an email to {{security_email}} instead of using the issue tracker.

## License

By contributing to {{theme_name}}, you agree that your contributions will be licensed under the {{license}} license.

## Recognition

Contributors will be recognized in the project's contributors list and changelog.

## Questions?

Feel free to [open an issue]({{theme_repo_url}}/issues/new) or contact the maintainers if you have any questions about contributing.

Thank you for contributing to {{theme_name}}! 🎉
