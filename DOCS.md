# Documentation Index & Getting Started Guide

Welcome to the block-theme-scaffold repository! This guide helps you navigate all documentation and understand your responsibilities as a contributor, developer, or AI agent.

---

## 🚀 Quick Start (15-20 minutes)

### New to the Project?

Read these in order to get up to speed:

1. **[GOVERNANCE.md](./docs/GOVERNANCE.md)** (5 min) - Core policies everyone must follow
2. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** (5 min) - Where things are organized
3. **[FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)** (5 min) - How to name files and folders
4. **[LOGGING.md](./docs/LOGGING.md)** (5 min) - How to implement logging

### AI Agents & Copilot Users?

Read these specific instructions:

- **[AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)** - Rules for AI agents
- **[Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)** - Naming rules with examples

---

## 📚 Complete Documentation Map

### 🏗️ Foundation Documents

Essential reading for understanding project structure and standards:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [GOVERNANCE.md](./docs/GOVERNANCE.md) | Project policies, standards, compliance | 15 min | Everyone |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Repository structure (40+ folders) | 10 min | Developers |
| [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) | Naming conventions & block src/ structure | 15 min | Everyone |

### 🔨 Development & Build

Build system, code compilation, and asset management:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [BUILD_PROCESS.md](./docs/BUILD_PROCESS.md) | Build system with webpack & babel; asset compilation | 15 min | Developers |
| [GENERATE_THEME.md](./docs/GENERATE_THEME.md) | Theme generation guide with mustache variables | 20 min | Theme Creators |
| [INTERNATIONALIZATION.md](./docs/INTERNATIONALIZATION.md) | Translation & localization | 10 min | Developers |

### ✅ Code Quality & Validation

Linting, testing, validation, and code standards:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [LINTING.md](./docs/LINTING.md) | Linting standards for JS, CSS, PHP + dry-run mode | 15 min | Developers |
| [VALIDATION.md](./docs/VALIDATION.md) | Quick reference for all validation commands | 10 min | Developers |
| [TESTING.md](./docs/TESTING.md) | Testing frameworks, examples & best practices | 15 min | Test Writers |
| [LOGGING.md](./docs/LOGGING.md) | Logging standards & implementation patterns | 10 min | Developers |

### 🚀 Operations & Monitoring

Performance, workflows, and CI/CD:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [WORKFLOWS.md](./docs/WORKFLOWS.md) | GitHub Actions CI/CD workflows & monitoring | 15 min | Developers |
| [PERFORMANCE.md](./docs/PERFORMANCE.md) | Performance monitoring & optimization | 15 min | Developers |

### 📖 API & Reference

Complete reference documentation:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | PHP & JavaScript APIs | Reference | Developers |
| [DEPRECATION.md](./docs/DEPRECATION.md) | Deprecated functions & migration | Reference | Developers |

### 🔐 Security & Best Practices

Security standards and guidelines:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [SECURITY.md](./docs/SECURITY.md) | Security headers, nonce verification, best practices | 20 min | Developers |
| [security-nonce.instructions.md](./.github/instructions/security-nonce.instructions.md) | Nonce coding standards for AI agents | 15 min | AI Agents |

### ⚙️ Tool Configuration

Detailed configuration guides:

| Document | Purpose | Audience |
|----------|---------|----------|
| [CONFIGS.md](./docs/CONFIGS.md) | Overview of all development tools | Developers |
| [config/eslint.md](./docs/config/eslint.md) | ESLint configuration details | JS Developers |
| [config/stylelint.md](./docs/config/stylelint.md) | Stylelint configuration details | CSS Developers |
| [config/jest.md](./docs/config/jest.md) | Jest testing configuration | Test Writers |
| [config/webpack.md](./docs/config/webpack.md) | Webpack build configuration | Build Engineers |
| [config/phpcs.md](./docs/config/phpcs.md) | PHP CodeSniffer configuration | PHP Developers |

### 🛠️ Pre-Commit & WordPress

Pre-commit hooks and WordPress-specific documentation:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [HUSKY_PRECOMMIT.md](./docs/HUSKY_PRECOMMIT.md) | Pre-commit hooks setup & behavior | 10 min | Developers |
| [WORDPRESS-PACKAGES.md](./docs/WORDPRESS-PACKAGES.md) | @wordpress/* package reference | Reference | Block Developers |
| [WORDPRESS-PACKAGES-VALIDATION.md](./WORDPRESS-PACKAGES-VALIDATION.md) | Package dependency validation | Reference | Developers |

### 👥 Contribution & Getting Started

Contribution guidelines and setup:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute to the project | 10 min | Contributors |
| [SETUP-SUMMARY.md](./docs/SETUP-SUMMARY.md) | Project setup overview | 10 min | New Users |
| [README.md](./README.md) | Project overview & getting started | 5 min | Everyone |

### 👤 AI Agent & Copilot

AI-specific instructions and rules:

| Document | Purpose | Time | Audience |
|----------|---------|------|----------|
| [AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md) | Rules for Copilot & Claude | 15 min | AI Agents |
| [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md) | Naming with file-type examples | 10 min | Everyone |

### 📋 Project Information

General project documentation:

| Document | Purpose |
|----------|---------|
| [CHANGELOG.md](./CHANGELOG.md) | Version history & changes |
| [README.txt](./README.txt) | WordPress theme header |
| [SECURITY.md](./SECURITY.md) | Security policy |
| [SUPPORT.md](./SUPPORT.md) | Getting help |
| [LICENSE](./LICENSE) | GPL-2.0-or-later license |

---

## 📁 Where Code Goes

**Question**: What are you working on?

| What | Where | Reference |
|------|-------|-----------|
| New JavaScript feature | `src/js/feature-name.js` | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| New PHP functionality | `inc/feature-name.php` | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| New styles | `src/css/feature-name.scss` | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| New block pattern | `patterns/pattern-name.php` | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Feature tests | `tests/{js\|php}/test-feature.{js\|php}` | [TESTING.md](./docs/TESTING.md) |
| Documentation | `docs/FEATURE-NAME.md` | [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) |
| Process logs | `logs/{lint\|test\|build\|agents}/` | [LOGGING.md](./docs/LOGGING.md) |
| Generated reports | `.github/reports/{coverage\|perf\|agents}/` | [LOGGING.md](./docs/LOGGING.md) |

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the complete folder reference with 40+ folder descriptions.

---

## 📝 Key Standards

### Naming Conventions

**Quick Reference:**

| File Type | Pattern | Example |
|-----------|---------|---------|
| JavaScript | kebab-case | `file-handler.js` |
| PHP | kebab-case | `file-handler.php` |
| CSS/SCSS | kebab-case | `component.scss` |
| Documentation | UPPER-KEBAB-CASE | `FILE-HANDLER.md` |
| Logs | YYYY-MM-DD-kebab-case.log | `2025-12-07-lint-check.log` |
| Reports | YYYY-MM-DD-kebab-case.json | `2025-12-07-coverage.json` |

See [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) for detailed examples and decision tree.

### Code Quality Standards

**Before committing code:**

```bash
npm run lint      # JavaScript, CSS/SCSS linting (must pass)
npm run test      # Tests with 80%+ coverage (must pass)
npm audit         # Security audit (no high/critical CVEs)
npm run coverage  # Code coverage report (80%+ required)
```

### Logging Standards

**For background processes** (builds, tests, linting):

```javascript
const logger = new FileLogger('process-name');
logger.info('[PROCESS_NAME] Starting...');
logger.debug('[STEP_1] Working...');
logger.error('[ERROR] Failed because...');
await logger.save();  // Saves to logs/{category}/YYYY-MM-DD-{process}.log
```

See [LOGGING.md](./docs/LOGGING.md) for implementation patterns in JavaScript, PHP, and shell scripts.

---

## 🔗 How Key Documents Relate

These seven documents form the core of development operations and should reference each other without duplicating content:

### Document Relationships

```
BUILD_PROCESS.md (Build System)
    ↓ provides assets for
LINTING.md (Code Quality) ←→ TESTING.md (Test Framework)
    ↓                            ↓
VALIDATION.md (Quick Reference) ← shared tools
    ↓
LOGGING.md (Output Standards)
    ↓
WORKFLOWS.md (CI/CD Automation) ← orchestrates
    ↓
PERFORMANCE.md (Monitoring)
```

### Each Document's Scope

| Document | Owns | References |
|----------|------|-----------|
| **BUILD_PROCESS.md** | Build system, webpack, asset compilation | LINTING.md, TESTING.md, PERFORMANCE.md |
| **LINTING.md** | JavaScript/CSS/PHP code quality standards | VALIDATION.md, LOGGING.md, TESTING.md |
| **TESTING.md** | Test frameworks, test writing, coverage | VALIDATION.md, LOGGING.md, LINTING.md |
| **VALIDATION.md** | Quick command reference (no duplication) | LINTING.md, TESTING.md, BUILD_PROCESS.md |
| **LOGGING.md** | Log format, implementation patterns | LINTING.md, TESTING.md, WORKFLOWS.md |
| **WORKFLOWS.md** | CI/CD jobs, automation, branch protection | BUILD_PROCESS.md, LINTING.md, TESTING.md, PERFORMANCE.md |
| **PERFORMANCE.md** | Performance monitoring, optimization | BUILD_PROCESS.md, TESTING.md, LOGGING.md |

### Document Types

- **LINTING.md** - Detailed guide with configuration, troubleshooting, best practices
- **TESTING.md** - Detailed guide with examples, frameworks, patterns
- **BUILD_PROCESS.md** - Detailed guide with build steps, configuration
- **LOGGING.md** - Detailed guide with implementation examples in multiple languages
- **WORKFLOWS.md** - Operational guide with CI/CD configuration, monitoring
- **PERFORMANCE.md** - Operational guide with tools, metrics, optimization
- **VALIDATION.md** - Quick reference (links to detailed docs, no duplication)

---

## 🎯 Common Workflows

### Adding a New Feature

```
1. Create feature branch: git checkout -b feature/feature-name
2. Create source files in src/js, src/css, inc/, patterns/
3. Create test files in tests/ with 80%+ coverage
4. Implement logging if process runs independently
5. Write documentation in docs/FEATURE-NAME.md
6. Run: npm run lint && npm run test
7. Update CHANGELOG.md
8. Commit: git commit -m "feat: add feature-name"
9. Create pull request with documentation
10. Wait for code review and approval
11. Merge when approved
```

### Bug Fix

```
1. Create fix branch: git checkout -b fix/bug-description
2. Identify and modify affected files
3. Create/update tests to prevent regression
4. Run: npm run lint && npm run test
5. Update CHANGELOG.md
6. Commit: git commit -m "fix: bug-description"
7. Create pull request referencing the issue
8. Wait for code review and approval
9. Merge when approved
```

### Updating Documentation

```
1. Identify which docs need updates
2. Update relevant files in docs/
3. Link between related documents
4. Commit: git commit -m "docs: update description"
5. Create pull request
6. Wait for review and approval (lighter review for docs)
7. Merge when approved
```

### Creating a New Theme

```
1. Option 1: Use AI prompt
   @workspace /generate-theme

2. Option 2: Use scaffold generator agent
   Generate a new block theme from scaffold

3. Option 3: Run script directly
   node bin/generate-theme.js

See [GENERATE_THEME.md](./docs/GENERATE_THEME.md) for all options.
```

---

## ✅ Pre-Commit Checklist

**Before your code can be merged:**

- [ ] Code passes linting (`npm run lint`)
- [ ] Code passes tests (`npm run test`)
- [ ] Code coverage ≥ 80%
- [ ] Security audit passes (`npm audit`)
- [ ] Documentation updated in docs/
- [ ] Comments explain WHY (not WHAT)
- [ ] CHANGELOG.md updated
- [ ] Version updated (if warranted)
- [ ] Follows naming conventions
- [ ] Follows folder structure
- [ ] Code review approved by maintainer

**If any item is unchecked, the code won't be merged.**

---

## 🔑 Key Principles

### 1. Code Quality is Non-Negotiable

- All code must pass linting
- All code must have 80%+ test coverage
- All code must pass security audit
- All code must follow naming conventions

### 2. Documentation is Required

- Every feature needs documentation
- Every code change needs comments explaining WHY
- Breaking changes need migration guides
- API changes need reference updates

### 3. Logging Enables Debugging

- All background processes must log
- Logs go to `logs/{category}/`
- Logs are never committed to git
- Log format is standardized: `[ISO8601] [LEVEL] [PROCESS] [MESSAGE]`

### 4. Structure Prevents Chaos

- Follow [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for folder organization
- Follow [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) for naming
- Use consistent patterns across codebase
- Enforce structure in code reviews

### 5. Governance is for Everyone

- Developers follow governance rules
- AI agents follow governance rules
- Maintainers enforce governance rules
- Changes to governance require approval

---

## ❓ Finding Answers

### Quick Help by Topic

| Need | Read This |
|------|-----------|
| Where code goes? | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| How to name files? | [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) or [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md) |
| What are policies? | [GOVERNANCE.md](./docs/GOVERNANCE.md) |
| How to log? | [LOGGING.md](./docs/LOGGING.md) |
| AI agent rules? | [AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md) |
| Development process? | [BUILD-PROCESS.md](./docs/BUILD-PROCESS.md) |
| API usage? | [API-REFERENCE.md](./docs/API-REFERENCE.md) |
| Theme generation? | [GENERATE-THEME.md](./docs/GENERATE-THEME.md) |
| Testing strategy? | [TESTING.md](./docs/TESTING.md) |
| Something broken? | [SUPPORT.md](./SUPPORT.md) |

---

## 🤖 For AI Agents (Copilot, Claude, etc.)

### Must Read

1. **[AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)** - Complete rules and workflow
2. **[Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)** - Naming examples
3. **[LOGGING.md](./docs/LOGGING.md)** - Logging implementation patterns

### Must Do

- ✅ Log operations to `logs/agents/YYYY-MM-DD-{name}.log`
- ✅ Generate reports to `.github/reports/agents/`
- ✅ Follow naming conventions exactly
- ✅ Run `npm run lint && npm run test` before changes
- ✅ Update documentation with code changes

### Common Commands

```bash
npm run lint          # ESLint + Stylelint
npm run test          # Jest + PHPUnit
npm audit             # Security audit
npm run coverage      # Coverage report
npm run build         # Production build
npm run dev           # Development build
npm run analyze:bundle # Bundle analysis
```

---

## 📊 Documentation Statistics

| Metric | Value |
|--------|-------|
| Governance documents | 7 files |
| Total lines of documentation | 3,459+ lines |
| Total file size | ~90 KB |
| Folders documented | 40+ |
| Code examples | 20+ |
| Checklists | 5+ |
| Cross-references | 100+ |

---

## 🚦 Status & Quality

**Repository Status**: ✅ Production Ready

| Area | Status |
|------|--------|
| Governance | ✅ Complete |
| Architecture | ✅ Documented |
| Logging | ✅ Standardized |
| Testing | ✅ Required (80%+) |
| Security | ✅ Enforced |
| Linting | ✅ Automated |
| Documentation | ✅ Comprehensive |
| AI Agent Support | ✅ Full |

---

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Created comprehensive VALIDATION.md reference |
| 2025-12-07 | Merged SECURITY_HEADERS.md + SECURITY_NONCE.md into SECURITY.md |
| 2025-12-07 | Created security-nonce.instructions.md for AI agents |
| 2025-12-07 | Updated TESTING.md with configuration references |
| 2025-12-07 | Fixed PHPCS configuration error (removed non-existent sniff) |
| 2025-12-07 | Created comprehensive DOCS.md index |
| 2025-12-07 | Merged GENERATE-THEME.md + GENERATOR-SYSTEM.md |
| 2025-12-07 | Deleted GENERATOR-SYSTEM.md (merged into GENERATE-THEME.md) |
| 2025-12-07 | Created governance documentation (GOVERNANCE.md, etc.) |
| 2025-12-07 | Created AI agent instructions |
| 2025-12-07 | Created naming conventions guide |

---

## Get Help

- **Questions about governance?** → [GOVERNANCE.md](./docs/GOVERNANCE.md)
- **Need to find something?** → [docs/README.md](./docs/README.md)
- **AI agent questions?** → [AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)
- **Naming questions?** → [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)
- **General support?** → [SUPPORT.md](./SUPPORT.md)

---

## Remember

This governance structure and documentation exists to help us all work together effectively. When you follow these standards, you make the codebase better for everyone.

**Start here**: Read [GOVERNANCE.md](./docs/GOVERNANCE.md) first (5 minutes), then pick what you need!
