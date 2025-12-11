---
name: "AI Agent & Copilot Workflows"
description: "Core rules and workflows for AI agents and GitHub Copilot"
applyTo: "**"
---

# AI Agent & Copilot Instructions

> **Audience**: GitHub Copilot, Claude, and other AI agents assisting with block-theme-scaffold development.

## Quick Start for AI Agents

1. **Before you start**: Read [GOVERNANCE.md](../../docs/GOVERNANCE.md)
2. **Know the structure**: Reference [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
3. **Follow naming rules**: Check [FOLDER_STRUCTURE.md](../../docs/FOLDER_STRUCTURE.md)
4. **Implement logging**: Use patterns from [LOGGING.md](../../docs/LOGGING.md)
5. **Run tests & lint**: `npm run test && npm run lint` before changes

## Core Rules (All Agents Must Follow)

### 1. Folder Structure Compliance

**DO:**

- Place source code in `src/`
- Put tests in `tests/`
- Log output to `logs/{category}/`
- Save reports to `reports/{type}/`
- Use `tmp/` for temporary work only

**DON'T:**

- Create arbitrary folders
- Commit log files to git
- Put source code in root
- Mix tests with source code
- Leave temp files uncleaned

### 2. Naming Conventions

**Quick Reference:**

- Files: `kebab-case.{ext}`
- JS: camelCase functions, PascalCase classes
- PHP: `prefix_snake_case()` functions, PascalCase classes
- Docs: `UPPER-KEBAB.md`
- Logs: `YYYY-MM-DD-process.log`

**See:** [naming-conventions.instructions.md](naming-conventions.instructions.md) for complete rules

### 3. Logging & Reporting

**Every process must log:**

```javascript
// At start of process
const logger = new FileLogger("process-name");
logger.info("[PROCESS_NAME] Starting operation...");

// During work
logger.debug("[STEP_1] Reading configuration...");
logger.debug("[STEP_2] Processing files...");

// On success
logger.info("[RESULT] Operation completed successfully");

// On error
logger.error("[ERROR] Failed to process file: reason");

// Save to disk
await logger.save();
```

**Log output location:**

- Lint operations → `logs/lint/YYYY-MM-DD-{tool}.log`
- Test operations → `logs/test/YYYY-MM-DD-{framework}.log`
- Build operations → `logs/build/YYYY-MM-DD-webpack.log`
- Agent operations → `logs/agents/YYYY-MM-DD-{agent-name}.log`

**Report generation** (see [reporting.instructions.md](reporting.instructions.md)):

Key rules:

- **Location**: ALWAYS use `reports/` directory (never repository root)
- **Date format**: ISO 8601 prefix (YYYY-MM-DD)
- **Organization**: Category subdirectory (coverage/, analysis/, validation/, performance/, agents/, comparison/)
- **Naming**: `YYYY-MM-DD-description.ext` (kebab-case, not underscores)
- **Metadata**: Include date, tool, type, and logFile reference
- **Cleanup**: Remove temporary files after saving report to `reports/`

Example report paths:

```
reports/coverage/js/2025-12-07-coverage.json
reports/analysis/2025-12-07-lighthouse.json
reports/validation/2025-12-07-eslint-report.json
reports/performance/2025-12-07-bundle-size.json
reports/agents/2025-12-07-theme-generator.json
```

For detailed guidelines, code patterns, and verification checklist, see:

- **[reporting.instructions.md](reporting.instructions.md)** - AI agent rules and patterns
- **[docs/REPORTING.md](../../docs/REPORTING.md)** - System documentation and standards

### 4. Code Quality Standards

**Must pass before committing:**

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Check security
npm audit

# Verify coverage
npm run coverage
```

**Standards:**

| Language    | Tool      | Config           | Threshold           |
| ----------- | --------- | ---------------- | ------------------- |
| JavaScript  | ESLint    | `.eslintrc.js`   | No errors           |
| CSS/SCSS    | Stylelint | `.stylelintrc`   | No errors           |
| PHP         | PHPCS     | `phpcs.xml`      | WordPress standards |
| Tests (JS)  | Jest      | `jest.config.js` | 80%+ coverage       |
| Tests (PHP) | PHPUnit   | `phpunit.xml`    | 80%+ coverage       |

### 5. Documentation Updates

**Every code change requires documentation:**

1. **In-code comments**: Explain WHY, not WHAT

   ```javascript
   // ✓ Good - Explains intent
   // Skip validation on manual imports since they're pre-checked by admin
   if (isManualImport) return value;

   // ✗ Bad - States obvious
   // Skip if manual import
   if (isManualImport) return value;
   ```

2. **README updates**: Link to relevant docs

   ```markdown
   - New feature? Update docs/
   - Breaking change? Add migration guide
   - API change? Update API-REFERENCE.md
   ```

3. **CHANGELOG.md entry**: Summarize change

   ```markdown
   ## [x.y.z] - YYYY-MM-DD

   ### Added

   - New feature description

   ### Fixed

   - Bug fix description

   ### Changed

   - Breaking change (with migration)
   ```

### 6. Testing Requirements

**All code must have tests:**

- Unit tests in `tests/{type}/test-*.js` or `tests/{type}/test-*.php`
- Test coverage minimum: 80%
- Integration tests in `tests/e2e/`
- E2E tests for critical workflows

**Test naming:**

```javascript
describe("FileHandler", () => {
  it("should process files correctly", () => {
    // test code
  });

  it("should handle errors gracefully", () => {
    // error handling test
  });
});
```

**Skip tests only with reason:**

```javascript
// ✓ Good
it.skip("should handle missing data", () => {
  // TODO: Wait for data service refactor (#456)
  expect(true).toBe(true);
});

// ✗ Bad
it.skip("should work", () => {
  /* test */
});
```

## Workflow for AI Agents

### Step 1: Understand the Change

1. Read the task/issue carefully
2. Check related documentation in `docs/`
3. Review existing code in `src/`
4. Check tests in `tests/`
5. Ask questions if unclear (don't guess)

### Step 2: Plan the Implementation

1. Determine files to modify/create
2. Identify folder structure needed
3. Plan logging output
4. Check if tests needed
5. Verify naming conventions

### Step 3: Implement the Change

1. Create/modify files following conventions
2. Add inline documentation
3. Implement logging (if process runs independently)
4. Create tests (80%+ coverage)
5. Verify code quality: `npm run lint && npm run test`

### Step 4: Document the Change

1. Update relevant docs in `docs/`
2. Add inline code comments (WHY, not WHAT)
3. Update API reference if applicable
4. Update README if relevant
5. Add CHANGELOG.md entry

### Step 5: Prepare for Commit

**Before git operations:**

```bash
# Run full quality check
npm run lint      # ESLint + Stylelint
npm run test      # Jest + PHPUnit
npm audit         # Security check
npm run coverage  # Coverage report
```

**If any step fails:**

1. Fix issues
2. Re-run that step
3. Don't skip checks

### Step 6: Commit & Document

**Commit message format:**

```
type(scope): brief description

Longer explanation if needed.

Fixes #123
Related to #456
```

**Commit types:**

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `docs:` Documentation updates
- `style:` Code style (formatting)
- `chore:` Build, dependencies, etc.

## Specific Agent Guidance

### For Code Generation Agents

1. **Always include tests**: Never generate code without tests
2. **Follow existing patterns**: Match style of surrounding code
3. **Document thoroughly**: Add comments explaining WHY
4. **Update docs**: Generate relevant documentation
5. **Run quality checks**: Full lint and test before completion

**Example output structure:**

```
Generated:
- src/new-feature.js (with inline docs)
- tests/test-new-feature.js (80%+ coverage)
- docs/NEW-FEATURE.md (implementation guide)
Updated:
- docs/API-REFERENCE.md (new functions)
- CHANGELOG.md (new version entry)
Quality checks:
✓ npm run lint
✓ npm run test
✓ npm audit
```

### For Analysis/Review Agents

1. **Reference standards**: Link to [GOVERNANCE.md](../../docs/GOVERNANCE.md)
2. **Use checklists**: Security, accessibility, performance
3. **Provide examples**: Show good patterns
4. **Log findings**: Output to `logs/agents/`
5. **Generate report**: Save to `reports/agents/`

**Analysis checklist:**

- [ ] Code follows naming conventions
- [ ] All tests passing (80%+ coverage)
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Security requirements met
- [ ] Accessibility standards met
- [ ] Performance targets met
- [ ] CHANGELOG.md updated

### For Build/Test Automation Agents

1. **Log all operations**: Use FileLogger class
2. **Implement error handling**: Meaningful error logs
3. **Save reports**: Coverage, performance, test results
4. **Clean up**: Remove temporary files after completion
5. **Document process**: Add README in agent logs folder

**Output structure:**

```
logs/build/YYYY-MM-DD-webpack.log         # Build logs
reports/performance/YYYY-MM-DD-bundle.json # Bundle analysis
reports/test-results/YYYY-MM-DD-tests.json # Test results
logs/agents/YYYY-MM-DD-build-agent.log     # Agent operation log
```

### For Theme Generation Agents

When working with theme generation:

1. **Follow mustache variable rules**: See [generate-theme.instructions.md](generate-theme.instructions.md)
2. **Validate all inputs**: Use patterns from theme-config.schema.json
3. **Stage-based collection**: Guide users through 3-4 stages
4. **Sanitize user input**: Prevent path traversal and injection
5. **Test generated output**: Verify all variables replaced

**Example workflow:**

```bash
# Interactive agent mode
node scripts/generate-theme.agent.js

# Direct script mode
node scripts/generate-theme.js --config theme-config.json

# Agent logs
logs/agents/YYYY-MM-DD-generate-theme-agent.log

# Agent reports
.github/reports/agents/YYYY-MM-DD-theme-generation.json
```

**Report structure:**

```json
{
  "agent": "generate-theme",
  "timestamp": "2025-12-10T10:30:45.123Z",
  "status": "success",
  "summary": "Generated theme 'my-awesome-theme' from scaffold",
  "metrics": {
    "filesProcessed": 87,
    "variablesReplaced": 52,
    "duration": "1.2s",
    "errors": 0,
    "warnings": 0
  },
  "artifacts": [
    "output-theme/",
    "output-theme/style.css",
    "output-theme/functions.php",
    "output-theme/theme.json"
  ],
  "config": {
    "theme_slug": "my-awesome-theme",
    "theme_name": "My Awesome Theme",
    "author": "Developer Name"
  },
  "logFile": "logs/agents/YYYY-MM-DD-generate-theme.log"
}
```

See: [generate-theme.agent.md](../agents/generate-theme.agent.md) for complete specification.

## Troubleshooting Guide

### Tests Won't Run

**Problem**: `npm run test` fails immediately

**Solutions:**

1. Check dependencies: `npm install`
2. Check Node version: `node --version` (need 16+)
3. Check env: `.env` variables set correctly
4. Run single test: `npm run test -- test-name.js`
5. Check logs: `logs/test/` for details

### Linting Fails

**Problem**: ESLint or Stylelint errors

**Solutions:**

1. Auto-fix if possible: `npm run lint -- --fix`
2. Check config: `.eslintrc.js`, `.stylelintrc`
3. Check affected files
4. Review [FOLDER-STRUCTURE.md](../../docs/FOLDER-STRUCTURE.md) for conventions
5. Check logs: `logs/lint/` for details

### Documentation Outdated

**Problem**: Docs don't match implementation

**Solutions:**

1. Identify which docs are stale
2. Update [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) if structure changed
3. Update [FOLDER-STRUCTURE.md](../../docs/FOLDER-STRUCTURE.md) if conventions changed
4. Update [LOGGING.md](../../docs/LOGGING.md) if logging changed
5. Update API-REFERENCE.md for API changes
6. Add note to CHANGELOG.md

### Permission Denied Errors

**Problem**: Cannot write to logs/ or reports/

**Solutions:**

1. Check directory exists: `ls -la logs/`
2. Check permissions: `chmod 755 logs/`
3. Check parent directory: `chmod 755 logs/lint/` etc
4. Restart process (permissions may be cached)

## Important: Before Making Changes

### Always Check These First

1. **[GOVERNANCE.md](../../docs/GOVERNANCE.md)** - Project policies
2. **[ARCHITECTURE.md](../../docs/ARCHITECTURE.md)** - Folder structure
3. **[FOLDER_STRUCTURE.md](../../docs/FOLDER_STRUCTURE.md)** - Naming conventions
4. **[LOGGING.md](../../docs/LOGGING.md)** - Logging standards
5. **[CONTRIBUTING.md](../../CONTRIBUTING.md)** - Contribution guidelines

### Never Skip These

1. **Linting**: `npm run lint` must pass
2. **Testing**: `npm run test` must pass (80%+ coverage)
3. **Documentation**: Update docs/ with changes
4. **CHANGELOG.md**: Document what changed
5. **Commit message**: Use meaningful description

## Quick Reference Commands

```bash
# Quality checks
npm run lint              # ESLint + Stylelint
npm run test              # Jest + PHPUnit
npm run coverage          # Coverage report
npm audit                 # Security audit

# Specific tools
npm run lint:js           # JavaScript only
npm run lint:css          # CSS only
npm run test:js           # JavaScript tests only
npm run test:php          # PHP tests only

# Code generation
npm run generate:theme    # Theme generator
npm run generate:block    # Block generator

# Build processes
npm run build             # Production build
npm run dev               # Development build
npm run watch             # Watch mode

# Analysis
npm run analyze:bundle    # Bundle analysis
npm run performance       # Performance audit
npm run lighthouse        # Lighthouse score
```

## Escalation Path

**If you're stuck:**

1. Check documentation (this file first)
2. Review [GOVERNANCE.md](../../docs/GOVERNANCE.md) for policies
3. Check related docs in `docs/`
4. Review existing code patterns in `src/`
5. Review existing tests in `tests/`
6. Log your findings to `logs/agents/`
7. Ask for human clarification (don't guess)

**Never:**

- Skip quality checks
- Commit without tests
- Ignore linting errors
- Skip documentation
- Leave temp files behind
- Modify governance docs without approval

## Getting Help

### For Specific Questions

**About code style?** → [FOLDER-STRUCTURE.md](../../docs/FOLDER-STRUCTURE.md)

**About structure?** → [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

**About logging?** → [LOGGING.md](../../docs/LOGGING.md)

**About policies?** → [GOVERNANCE.md](../../docs/GOVERNANCE.md)

**About contributing?** → [CONTRIBUTING.md](../../CONTRIBUTING.md)

**About a feature?** → Check `docs/` folder for specific feature docs

### For Debug Information

**Check logs:**

```bash
# View latest lint log
tail -f logs/lint/$(ls -t logs/lint/ | head -1)

# View latest test log
tail -f logs/test/$(ls -t logs/test/ | head -1)

# View agent logs
tail -f logs/agents/$(ls -t logs/agents/ | head -1)
```

**Run with verbose output:**

```bash
npm run test -- --verbose
npm run lint -- --verbose
```

## Final Reminders

> **Remember**: You are assisting in building a professional, production-ready WordPress theme scaffold.

- Every line of code matters
- Tests protect future developers
- Documentation prevents confusion
- Logging helps troubleshooting
- Quality standards ensure reliability

**When in doubt**, reference the docs and ask for clarification rather than making assumptions.

---

## Version History

| Date       | Change                                   |
| ---------- | ---------------------------------------- |
| 2025-12-07 | Initial AI agent instructions            |
| 2025-12-07 | Added logging and reporting guidance     |
| 2025-12-07 | Integrated with governance documentation |
