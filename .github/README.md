---
title: Block Theme Scaffold
description: Generate a block theme for WordPress
category: Tool
type: Generate
audience: Developers
date: 2026-01-10
---

## Getting Started

### Prerequisites
Make sure you have the following installed:

- Node.js (check .nvmrc for the required version)
- Composer (for PHP dependencies)
- A WordPress environment with a DataBase.

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/lightspeedwp/block-theme-scaffold.git
cd block-theme-scaffold
```

#### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install PHP/Composer dependencies
composer install
```

#### 3. Generate your theme

**Interactive prompts (easiest)**

Add the folder to the chat to your IDE, and select the "Generate Theme Agent" from the agent dropdown, or if you cannot see it in the dropdown, add the js file to the chat as well.

Then simply ask the agent to generate a theme, it will prompt you for the basic placeholder replacements.

Agent Location: `scripts\agents\generate-theme.agent.js`

**CLI Mode**
```bash
node scripts/generate-theme.js --slug my-theme --name "My Theme" --author  "Your Name" ...
```

**JSON Mode**
```bash
node scripts/generate-theme.js --config theme-config.json
```

#### Copy the theme to your site.
Navigate to `output-theme` and copy and paste that in your `themes` directory. Rename it to the same as your Theme Slug.


### Available Scripts
- `npm run build` - Build for development
- `npm run watch` - Watch for changes during development
- `npm run lint`  - Run linters
- `npm test`      - Run tests


## Importing Design Tokens

🚧 **Coming Soon** 🚧

## GitHub Configuration
This directory contains GitHub-specific configuration files for the {{theme_name}} theme.

### Contents
- **agents/** - AI agent configurations for automated development tasks
- **instructions/** - Development instructions and guidelines for AI tools
- **projects/** - Active Copilot projects and in-progress work
- **prompts/** - Reusable prompt templates for AI-assisted development
- **reports/** - Completed task reports and validation outcomes
- **schemas/** - JSON schemas and configuration templates
- **workflows/** - GitHub Actions CI/CD workflow definitions
- `copilot-tasks.md` - Copilot task definitions and specifications
- `custom-instructions.md` - Custom AI instructions for Copilot

### Documentation
Permanent user-facing documentation is stored in the [docs/](../docs/) folder. See [docs/FILE_ORGANIZATION.md](../docs/FILE_ORGANIZATION.md) for the complete file organization guide.

### Workflows

| Workflow | Description |
|----------|-------------|
| `ci-cd.yml` | Main CI/CD pipeline (lint, test, security audit, E2E) |
| `code-quality.yml` | Code coverage, quality gates, bundle analysis |
| `deploy-wporg.yml` | Automated WordPress.org theme directory deployment |
| `release.yml` | Version bumping, changelog generation, releases |
