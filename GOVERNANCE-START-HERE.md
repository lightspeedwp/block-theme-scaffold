# Getting Started with Repository Governance

Welcome to the block-theme-scaffold repository! This guide helps you navigate the governance structure and understand your responsibilities as a contributor or AI agent.

## Quick Navigation

### 🎯 I Just Got Here – What Do I Need to Know?

**Read these in order (15-20 minutes):**

1. **[GOVERNANCE.md](./docs/GOVERNANCE.md)** (5 min) - Core policies everyone must follow
2. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** (5 min) - Where things go
3. **[FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md)** (5 min) - How to name things
4. **[LOGGING.md](./docs/LOGGING.md)** (5 min) - How to log operations

**If you're an AI Agent:**

- **[AI Agent Instructions](./github/instructions/copilot-ai-agent.instructions.md)** - Specific rules for agents
- **[Naming Conventions Instructions](./github/instructions/naming-conventions.instructions.md)** - Rules with examples

### 🚀 I'm Ready to Contribute – What's the Workflow?

```
1. Create a branch for your work
2. Make changes following governance rules
3. Run quality checks:
   - npm run lint
   - npm run test
4. Update documentation
5. Commit with meaningful message
6. Create pull request
7. Wait for review and approval
8. Merge when approved
```

### 📁 Where Does My Code Go?

**Question**: What are you working on?

- **New JavaScript feature** → `src/js/feature-name.js`
- **New PHP functionality** → `inc/feature-name.php`
- **New styles** → `src/css/feature-name.scss`
- **New block pattern** → `patterns/pattern-name.php`
- **Tests for feature** → `tests/{js|php}/test-feature-name.{js|php}`
- **Documentation** → `docs/FEATURE-NAME.md`
- **Log output** → `logs/{lint|test|build|agents}/YYYY-MM-DD-{process}.log`
- **Generated reports** → `reports/{coverage|performance|test-results|agents}/`

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for complete folder reference.

### 📝 How Do I Name Files?

**Quick Rules:**

- **JavaScript files**: `kebab-case.js` (exports: camelCase functions, PascalCase classes)
- **PHP files**: `kebab-case.php` (functions: `prefix_snake_case()`, classes: `PascalCase`)
- **CSS/SCSS files**: `kebab-case.scss` (classes: `.kebab-case`, BEM notation)
- **Docs**: `UPPER-KEBAB-CASE.md`
- **Logs**: `YYYY-MM-DD-kebab-case.log`
- **Reports**: `YYYY-MM-DD-kebab-case.json`

See [FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md) or [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md) for detailed examples.

### 🔍 What Quality Standards Must I Follow?

**Before committing code:**

```bash
npm run lint      # JavaScript, CSS/SCSS linting
npm run test      # JavaScript and PHP tests
npm audit         # Security audit
npm run coverage  # Coverage report
```

**Standards:**

| Standard | Requirement |
|----------|-------------|
| **Linting** | Zero errors (auto-fix where possible) |
| **Tests** | 80%+ code coverage |
| **Security** | Pass npm audit, follow OWASP top 10 |
| **Docs** | Updated with all code changes |
| **Format** | Follow prettier/eslint config |

See [GOVERNANCE.md](./docs/GOVERNANCE.md) for complete checklist.

### 📊 How Do I Implement Logging?

**For background processes** (builds, tests, linting):

```javascript
const logger = new FileLogger('process-name');
logger.info('[PROCESS_NAME] Starting...');
logger.debug('[STEP_1] Working on task...');
logger.error('[ERROR] Failed because...');
await logger.save();
```

Output goes to: `logs/{category}/YYYY-MM-DD-{process}.log`

See [LOGGING.md](./docs/LOGGING.md) for implementation patterns in JavaScript, PHP, and shell.

### ❓ I Have Questions About

**Policies & Rules?**
→ [GOVERNANCE.md](./docs/GOVERNANCE.md)

**Repository Structure?**
→ [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

**File Naming?**
→ [FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md) or [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)

**Logging Standards?**
→ [LOGGING.md](./docs/LOGGING.md)

**AI Agent Rules?**
→ [AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)

**Development Process?**
→ [BUILD-PROCESS.md](./docs/BUILD-PROCESS.md)

**API Usage?**
→ [API-REFERENCE.md](./docs/API-REFERENCE.md)

## Documentation Map

### Core Governance (Read These First)

1. **[GOVERNANCE.md](./docs/GOVERNANCE.md)** - Policies, standards, compliance
2. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Folder structure and organization
3. **[FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md)** - Naming conventions by file type
4. **[LOGGING.md](./docs/LOGGING.md)** - Logging standards and implementation

### For Contributors

1. **[AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)** - Rules for AI agents
2. **[Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)** - Naming rules with examples
3. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - General contribution guidelines

### Development Guides

1. **[BUILD-PROCESS.md](./docs/BUILD-PROCESS.md)** - Build system documentation
2. **[SRC-FOLDER-STRUCTURE.md](./docs/SRC-FOLDER-STRUCTURE.md)** - Source directory organization
3. **[API-REFERENCE.md](./docs/API-REFERENCE.md)** - Complete API documentation

### Tools & Configuration

1. **[TOOL-CONFIGS.md](./docs/TOOL-CONFIGS.md)** - Overview of all development tools
2. **[config/](./docs/config/)** - Detailed configuration guides

### Security & Performance

1. **[SECURITY-NONCE.md](./docs/SECURITY-NONCE.md)** - Nonce utilities
2. **[SECURITY-HEADERS.md](./docs/SECURITY-HEADERS.md)** - Security headers
3. **[PERFORMANCE.md](./docs/PERFORMANCE.md)** - Performance monitoring

## Key Principles

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
- Log format is standardized (ISO8601 timestamp, level, message)

### 4. Structure Prevents Chaos

- Follow [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for folder organization
- Follow [FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md) for naming
- Use consistent patterns across codebase
- Enforce structure in code reviews

### 5. Governance is for Everyone

- Developers follow governance rules
- AI agents follow governance rules
- Maintainers enforce governance rules
- Changes to governance require approval

## Compliance Checklist

**Before your code is merged:**

- [ ] Code passes linting (`npm run lint`)
- [ ] Code passes tests (`npm run test`)
- [ ] Code coverage ≥ 80%
- [ ] Security audit passes (`npm audit`)
- [ ] Documentation updated
- [ ] Comments explain WHY (not WHAT)
- [ ] CHANGELOG.md updated
- [ ] Version updated (if warranted)
- [ ] Follows naming conventions
- [ ] Follows folder structure
- [ ] Code review approved

**If any item is unchecked**, the code won't be merged.

## Common Workflows

### Adding a New Feature

```
1. Create feature branch: git checkout -b feature/feature-name
2. Create source files in src/js, src/css, inc/, patterns/
3. Create test files in tests/
4. Implement logging if process runs independently
5. Write documentation in docs/FEATURE-NAME.md
6. Run npm run lint && npm run test
7. Update CHANGELOG.md
8. Commit: git commit -m "feat: add feature-name"
9. Create pull request with documentation
10. Wait for review and approval
11. Merge when approved
```

### Bug Fix

```
1. Create fix branch: git checkout -b fix/bug-description
2. Identify and modify affected files
3. Create/update tests to prevent regression
4. Run npm run lint && npm run test
5. Update CHANGELOG.md
6. Commit: git commit -m "fix: bug-description"
7. Create pull request referencing issue
8. Wait for review and approval
9. Merge when approved
```

### Updating Documentation

```
1. Identify which docs need updates
2. Update relevant doc files in docs/
3. Link between related docs
4. Test links with `npm run docs:check` (if available)
5. Commit: git commit -m "docs: update-description"
6. Create pull request
7. Wait for review and approval (minimal for docs)
8. Merge when approved
```

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Initial governance documentation |
| 2025-12-07 | Created GOVERNANCE.md, ARCHITECTURE.md, FOLDER-STRUCTURE.md |
| 2025-12-07 | Created LOGGING.md with implementation examples |
| 2025-12-07 | Created AI Agent Instructions |
| 2025-12-07 | Created Naming Conventions Instructions |

## Get Help

- **Questions about governance?** → [GOVERNANCE.md](./docs/GOVERNANCE.md)
- **Can't find something?** → [docs/README.md](./docs/README.md)
- **AI agent questions?** → [AI Agent Instructions](./.github/instructions/copilot-ai-agent.instructions.md)
- **Naming questions?** → [Naming Conventions Instructions](./.github/instructions/naming-conventions.instructions.md)

---

**Remember**: This governance structure exists to help us all work together effectively. When you follow these standards, you make the codebase better for everyone.
