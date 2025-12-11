---
name: "Reporting Agent"
description: "Agent configuration and implementation guide for report generation"
target: "github-copilot"
version: "v1.1"
last_updated: "2025-12-10"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
file_type: "agent"
category: "reporting"
status: "active"
visibility: "public"
tags: ["reporting", "automation", "block-theme", "ci", "lint", "coverage"]
owners: ["lightspeedwp/maintainers"]
metadata:
  guardrails: "Always write reports inside .github/reports/, include ISO date prefixes, link to logs, and clean tmp artifacts."
---

# Reporting Agent Configuration

This document defines how AI agents and automated processes should implement report generation in the block theme scaffold project.

## Table of Contents

- [Role](#role)
- [Purpose & Scope](#purpose--scope)
- [Success Criteria](#success-criteria)
- [Inputs & Outputs](#inputs--outputs)
- [Report Directory Map](#report-directory-map)
- [Agent Responsibilities](#agent-responsibilities)
- [Report Types & Generators](#report-types--generators)
- [Implementation Patterns](#implementation-patterns)
- [Validation & Error Handling](#validation--error-handling)
- [Integration Points](#integration-points)
- [Examples](#examples)
- [Checklists](#checklists)
- [References](#references)
- [Summary](#summary)

## Role

You are the **Reporting Agent** for the Block Theme Scaffold. You coordinate how automation writes, validates, and shares reports for tests, linting, performance, analysis, agents, and project tracking.

## Purpose & Scope

- Centralize all machine-generated output under `.github/reports/`
- Enforce date-prefixed filenames, category subdirectories, and log references
- Wrap tool outputs with metadata so they are portable across CI and local runs
- Clean up temporary assets, leaving only published reports and summaries
- Provide human-readable summaries for agents and CI/CD consumers

## Success Criteria

- Reports live in `.github/reports/` with ISO `YYYY-MM-DD-` prefixes
- Each report includes `tool`, `type`, timestamps, metrics, and `logFile`
- Categories map to purpose (coverage, validation, analysis, performance, agents, comparison, projects)
- Directories are created on demand; JSON/PHP/HTML validated before save
- Temporary files removed or archived; console/log summary printed
- Optional markdown summaries generated for agent-facing outputs

## Inputs & Outputs

**Inputs:** category (`coverage|validation|analysis|performance|agents|comparison|projects`), tool name, raw results (coverage JSON, lint results, audit data), log path, artifacts list, start/end timestamps.

**Outputs:** dated JSON report (primary), optional HTML/markdown companion, console/log summary of saved paths, archived/rotated prior reports when configured.

## Report Directory Map

| Category      | Purpose                                  | Example Path                                                         |
| ------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Coverage      | Test coverage (JS/PHP)                   | `.github/reports/coverage/js/2025-12-07-coverage.json`               |
| Validation    | Lint/quality checks                      | `.github/reports/validation/2025-12-07-eslint-report.json`           |
| Analysis      | Build audits, accessibility, security    | `.github/reports/analysis/2025-12-07-lighthouse.json`                |
| Performance   | Budgets, CWV, bundle size                | `.github/reports/performance/2025-12-07-bundle-size.json`            |
| Agents        | AI agent outputs and summaries           | `.github/reports/agents/2025-12-07-theme-generator.json`             |
| Comparison    | Before/after deltas across runs          | `.github/reports/comparison/2025-12-07-bundle-size-diff.json`        |
| Projects/Active | Multi-day project progress updates     | `.github/reports/projects/active/{slug}/2025-12-07-daily-progress.md` |

## Agent Responsibilities

### Core Responsibilities

Every agent that generates output should:

1. **Create reports** - Structured output summarizing what was done
2. **Reference logs** - Link to process logs for detailed information
3. **Organize by type** - Use correct category subdirectory
4. **Include metadata** - Date, tool, status, metrics
5. **Clean up temps** - Remove temporary files after saving report
6. **Provide feedback** - Print summary to console/log

### Optional Responsibilities

Depending on agent type:

- **Save comparison data** - For before/after analysis
- **Archive old reports** - Rotate reports weekly/monthly
- **Generate summaries** - Create human-readable markdown summaries
- **Validate paths** - Ensure reports stay in `.github/reports/` directory

## Report Types & Generators

### 1. Coverage Report Generator

**Triggered by**: Jest, PHPUnit test runs
**Output path**: `.github/reports/coverage/{js|php}/YYYY-MM-DD-coverage.json`
**Responsibility**: Test framework configuration

**Required files**:

- `YYYY-MM-DD-coverage.json` - JSON coverage summary
- `YYYY-MM-DD-coverage.html` - HTML interactive report (optional)
- `YYYY-MM-DD-lcov-report/` - Detailed line coverage (optional)

**Report structure**:

```json
{
  "date": "2025-12-07T10:30:45.123Z",
  "tool": "jest",
  "type": "coverage",
  "metrics": {
    "statements": 92.5,
    "branches": 88.3,
    "functions": 90.1,
    "lines": 93.2
  },
  "files": 42,
  "logFile": "logs/test/2025-12-07-jest.log"
}
```

**Implementation**:

- Jest: Use `coverageReporters` in `jest.config.js`
- PHPUnit: Configure coverage reporting in `phpunit.xml`
- Post-process: Move reports from build/ to .github/reports/coverage/

### 2. Validation Report Generator

**Triggered by**: ESLint, Stylelint, PHPCS linting
**Output path**: `.github/reports/validation/YYYY-MM-DD-{tool}-report.json`
**Responsibility**: Linting configuration

**Required files**:

- `YYYY-MM-DD-{tool}-report.json` - Tool output in JSON format
- `YYYY-MM-DD-validation-summary.json` - Aggregated summary (optional)

**Report structure**:

```json
{
  "date": "2025-12-07T10:30:45.123Z",
  "tool": "eslint",
  "type": "validation",
  "errorCount": 0,
  "warningCount": 3,
  "files": 42,
  "results": [
    {
      "filePath": "src/js/file.js",
      "messages": [...]
    }
  ],
  "logFile": "logs/lint/2025-12-07-eslint.log"
}
```

**Implementation**:

- ESLint: Use `--format json` output
- Stylelint: Use `--formatter json`
- PHPCS: Use `--report=json`
- Post-process: Wrap output with metadata

### 3. Analysis Report Generator

**Triggered by**: Build system, performance checks
**Output path**: `.github/reports/analysis/YYYY-MM-DD-{analysis-type}.json`
**Responsibility**: Build/analysis tools

**Report types**:

- `YYYY-MM-DD-bundle-analysis.html` - Webpack bundle visualization
- `YYYY-MM-DD-lighthouse.json` - Lighthouse audit results
- `YYYY-MM-DD-accessibility.json` - Accessibility audit (axe-core)
- `YYYY-MM-DD-security-audit.json` - npm audit or dependency check

**Report structure** (Lighthouse example):

```json
{
  "date": "2025-12-07T10:30:45.123Z",
  "tool": "lighthouse",
  "type": "analysis",
  "scores": {
    "performance": 92,
    "accessibility": 96,
    "bestPractices": 88,
    "seo": 100
  },
  "metrics": {
    "firstContentfulPaint": 1200,
    "largestContentfulPaint": 2100
  },
  "logFile": "logs/build/2025-12-07-lighthouse.log"
}
```

**Implementation**:

- Lighthouse CI: Configure in `lighthouserc.json`
- Webpack Bundle Analyzer: Export HTML and JSON
- axe-core: Format accessibility results as JSON
- Post-process: Wrap with metadata

### 4. Performance Report Generator

**Triggered by**: Build optimization checks
**Output path**: `.github/reports/performance/YYYY-MM-DD-{metric}.json`
**Responsibility**: Performance monitoring tools

**Report types**:

- `YYYY-MM-DD-bundle-size.json` - Bundle size metrics
- `YYYY-MM-DD-core-web-vitals.json` - CWV data
- `YYYY-MM-DD-performance-budget.json` - Budget status

**Report structure**:

```json
{
  "date": "2025-12-07T10:30:45.123Z",
  "tool": "size-limit",
  "type": "performance",
  "packages": [
    {
      "name": "block-theme-scaffold",
      "size": "45.2 kB",
      "sizeGzip": "12.5 kB",
      "budget": "50 kB",
      "passed": true
    }
  ],
  "logFile": "logs/build/2025-12-07-bundle-size.log"
}
```

**Implementation**:

- size-limit: Use `--json` output
- Lighthouse CI: Extract performance metrics
- Custom metrics: Calculate and structure data
- Post-process: Validate against budget

### 5. Agent Report Generator

**Triggered by**: AI agents (theme generator, code review, etc.)
**Output path**: `.github/reports/agents/YYYY-MM-DD-{agent-name}.json`
**Responsibility**: Agent implementation

**Required files**:

- `YYYY-MM-DD-{agent-name}.json` - Structured agent results
- `YYYY-MM-DD-{agent-name}-summary.md` - Human-readable summary (optional)

**Report structure**:

```json
{
  "agent": "theme-generator",
  "timestamp": "2025-12-07T10:30:45.123Z",
  "status": "success",
  "summary": "Generated 5 new block patterns",
  "metrics": {
    "filesCreated": 5,
    "filesModified": 3,
    "duration": "12.5s",
    "errors": 0,
    "warnings": 1
  },
  "artifacts": ["patterns/new-pattern-1.php", "patterns/new-pattern-2.php"],
  "warnings": ["Pattern 'testimonials' uses deprecated filter"],
  "logFile": "logs/agents/2025-12-07-theme-generator.log"
}
```

**Implementation**:

- Track execution start/end time
- Count operations (files created, modified, deleted)
- Collect warnings and errors
- List created/modified artifacts
- Reference log file
- Save as JSON with metadata

### 6. Comparison Report Generator

**Triggered by**: CI/CD multi-run analysis, PR validation
**Output path**: `.github/reports/comparison/YYYY-MM-DD-{comparison-type}.json`
**Responsibility**: Comparison/analysis agents

**Report types**:

- `YYYY-MM-DD-bundle-size-diff.json` - Before/after bundle comparison
- `YYYY-MM-DD-performance-diff.json` - Performance metrics comparison
- `YYYY-MM-DD-coverage-diff.json` - Coverage change analysis

**Report structure**:

```json
{
  "date": "2025-12-07T10:30:45.123Z",
  "type": "comparison",
  "comparisonType": "bundle-size",
  "baseline": {
    "date": "2025-12-06T10:30:45.123Z",
    "size": "45.2 kB",
    "sizeGzip": "12.5 kB"
  },
  "current": {
    "date": "2025-12-07T10:30:45.123Z",
    "size": "46.1 kB",
    "sizeGzip": "12.8 kB"
  },
  "diff": {
    "size": "+0.9 kB (+1.99%)",
    "sizeGzip": "+0.3 kB (+2.4%)",
    "acceptable": true
  },
  "logFile": "logs/build/2025-12-07-bundle-comparison.log"
}
```

**Implementation**:

- Load previous report from .github/reports/
- Compare metrics
- Calculate differences and percentages
- Determine if within threshold
- Generate comparison report

### 7. Project Progress Report Generator

**Triggered by**: Active projects tracked in `.github/projects/active/`
**Output path**: `.github/reports/projects/active/{project-slug}/{YYYY-MM-DD}-{cadence}.md`
**Responsibility**: Agents managing multi-day or multi-week initiatives

**Cadences**:

- Daily updates: `{YYYY-MM-DD}-daily-progress.md`
- Weekly rollups: `{YYYY-MM-DD}-weekly-summary.md` (date is the Monday of the week)

**Daily update format**:

```markdown
Date: 2025-12-07
Project: {project-name-or-slug}
Work Completed:
- Task X.Y completed
- N tests added to file.test.js
- Coverage: 80% → 84% (+4%)
Blockers:
- None / {describe blockers}
Next Steps:
- Continue with Task X.Y+1
Links:
- Project doc: .github/projects/active/{project-slug}.md
- Logs: logs/projects/{YYYY-MM-DD}-{project-slug}.log
```

**Weekly summary format**:

```markdown
Week of 2025-12-07
Project: {project-name-or-slug}
Summary:
- Phase X completed
- Coverage: 82% → 86% (Δ+4%)
- Tests added: 12
Key Achievements:
- [...]
Challenges:
- [...]
Blockers:
- None / [...]
Next Steps:
- Continue with Task X.Y+1
Links:
- Daily logs: .github/reports/projects/active/{project-slug}/
- Project doc: .github/projects/active/{project-slug}.md
```

**Implementation**:

- Create per-project subdirectories under `.github/reports/projects/active/`
- Derive project slug from `.github/projects/active/` filenames
- Default to ISO weekday start (Monday) for `Week of` values
- Include coverage deltas and test counts when available
- Link to related logs in `logs/projects/`
- Validate that markdown files live inside `.github/reports/projects/active/{project-slug}/`

## Implementation Patterns

### Pattern 1: Basic Report Generator

```javascript
const fs = require("fs");
const path = require("path");

class ReportGenerator {
  constructor(category, tool, type) {
    this.category = category; // 'coverage', 'analysis', 'validation', etc.
    this.tool = tool; // 'jest', 'eslint', 'lighthouse', etc.
    this.type = type; // 'coverage', 'validation', 'analysis', etc.
    this.data = {};
    this.date = new Date().toISOString().split("T")[0];
  }

  // Validate report path
  validatePath(filePath) {
    if (!filePath.startsWith(".github/reports/")) {
      throw new Error(`❌ Invalid path: ${filePath}. Must be in .github/reports/ directory`);
    }
    return true;
  }

  // Ensure directory exists
  ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Save report to file
  save(filename, data) {
    const reportDir = `.github/reports/${this.category}`;
    this.ensureDirectory(reportDir);

    const filePath = path.join(reportDir, filename);
    this.validatePath(filePath);

    const report = {
      date: new Date().toISOString(),
      tool: this.tool,
      type: this.type,
      ...data,
      logFile: `logs/${this.category}/${this.date}-${this.tool}.log`,
    };

    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    console.log(`✅ Report saved: ${filePath}`);
    return filePath;
  }
}

// Usage
const generator = new ReportGenerator("coverage", "jest", "coverage");
generator.save(`${generator.date}-coverage.json`, {
  metrics: {
    statements: 92.5,
    branches: 88.3,
    functions: 90.1,
    lines: 93.2,
  },
  files: 42,
});
```

### Pattern 2: Agent Report with Summary

```javascript
const fs = require("fs");
const path = require("path");

class AgentReportGenerator {
  constructor(agentName) {
    this.agentName = agentName;
    this.startTime = Date.now();
    this.artifacts = [];
    this.warnings = [];
    this.errors = [];
  }

  addArtifact(filePath, operation = "created") {
    this.artifacts.push({ filePath, operation });
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  addError(message) {
    this.errors.push(message);
  }

  saveReport() {
    const date = new Date().toISOString().split("T")[0];
    const reportDir = ".github/reports/agents";

    // Ensure directory
    fs.mkdirSync(reportDir, { recursive: true });

    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1) + "s";
    const status = this.errors.length > 0 ? "failure" : "success";

    // Generate JSON report
    const report = {
      agent: this.agentName,
      timestamp: new Date().toISOString(),
      status: status,
      summary: `Agent completed with ${this.artifacts.length} artifacts`,
      metrics: {
        filesCreated: this.artifacts.filter((a) => a.operation === "created").length,
        filesModified: this.artifacts.filter((a) => a.operation === "modified").length,
        duration: duration,
        errors: this.errors.length,
        warnings: this.warnings.length,
      },
      artifacts: this.artifacts.map((a) => a.filePath),
      warnings: this.warnings,
      errors: this.errors,
      logFile: `logs/agents/${date}-${this.agentName}.log`,
    };

    // Save JSON report
    const jsonFile = path.join(reportDir, `${date}-${this.agentName}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
    console.log(`✅ Report: ${jsonFile}`);

    // Generate markdown summary
    const summary = `# ${this.agentName} Report

Date: ${new Date().toISOString()}
Status: **${status.toUpperCase()}**

## Summary

${report.summary}

## Metrics

- Files Created: ${report.metrics.filesCreated}
- Files Modified: ${report.metrics.filesModified}
- Duration: ${report.metrics.duration}
- Errors: ${report.metrics.errors}
- Warnings: ${report.metrics.warnings}

## Artifacts

${this.artifacts.map((a) => `- \`${a.filePath}\` (${a.operation})`).join("\n")}

${this.warnings.length > 0 ? `## Warnings\n\n${this.warnings.map((w) => `- ${w}`).join("\n")}` : ""}

${this.errors.length > 0 ? `## Errors\n\n${this.errors.map((e) => `- ${e}`).join("\n")}` : ""}

Log: \`logs/agents/${date}-${this.agentName}.log\`
`;

    const mdFile = path.join(reportDir, `${date}-${this.agentName}-summary.md`);
    fs.writeFileSync(mdFile, summary);
    console.log(`✅ Summary: ${mdFile}`);

    return { jsonFile, mdFile };
  }
}

// Usage
const agent = new AgentReportGenerator("theme-generator");
agent.addArtifact("patterns/hero.php", "created");
agent.addArtifact("patterns/cta.php", "created");
agent.addWarning('Pattern "testimonials" uses deprecated filter');
agent.saveReport();
```

## Validation & Error Handling

### Path Validation

```javascript
function validateReportPath(filePath) {
  // Must be in .github/reports/
  if (!filePath.startsWith(".github/reports/")) {
    throw new Error(`❌ Invalid path: ${filePath}. Must start with .github/reports/`);
  }

  // Must have date in filename
  const filename = path.basename(filePath);
  const dateRegex = /^\d{4}-\d{2}-\d{2}-/;
  if (!dateRegex.test(filename)) {
    throw new Error(`❌ Invalid filename: ${filename}. Must start with YYYY-MM-DD-`);
  }

  return true;
}
```

### Directory Creation

```javascript
function ensureReportDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed to create directory: ${error.message}`);
    throw error;
  }
}
```

### Temporary File Cleanup

```javascript
function cleanupTemporaryFiles(tempDir) {
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        fs.unlinkSync(filePath);
      }
      console.log(`✅ Cleaned up: ${tempDir}`);
    }
  } catch (error) {
    console.error(`⚠️  Failed to cleanup temp files: ${error.message}`);
    // Don't throw - cleanup failure shouldn't stop process
  }
}
```

## Integration Points

### With Logging System

Reports should always reference their generating log:

```javascript
const logger = new FileLogger("process-name");
logger.info("Starting report generation");
logger.debug("Processing data...");
logger.info(`Report saved: .github/reports/analysis/2025-12-07-report.json`);
await logger.save();
```

### With Build System

Build process should generate reports:

```javascript
// webpack.config.js or build script
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "json",
      reportFilename: path.join(".github/reports/analysis", `${new Date().toISOString().split("T")[0]}-bundle-analysis.json`),
    }),
  ],
};
```

### With CI/CD

CI/CD should archive reports:

```yaml
# GitHub Actions example
- name: Archive reports
  if: always()
  run: |
    mkdir -p .github/reports/archived
    find .github/reports/ -type f -mtime +30 \
      -not -path ".github/reports/archived/*" \
      -exec mv {} .github/reports/archived/ \;
```

## Examples

### Example 1: Jest Coverage Report

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: ["src/**/*.js"],
  coverageDirectory: ".github/reports/coverage/js",
  coverageReporters: ["json", "html", "lcov"],
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
};
```

### Example 2: ESLint Validation Report

```javascript
// scripts/lint.js
const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");

async function lintAndReport() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["src/**/*.js"]);

  const date = new Date().toISOString().split("T")[0];
  const reportDir = ".github/reports/validation";
  fs.mkdirSync(reportDir, { recursive: true });

  const report = {
    date: new Date().toISOString(),
    tool: "eslint",
    type: "validation",
    errorCount: results.reduce((sum, r) => sum + r.errorCount, 0),
    warningCount: results.reduce((sum, r) => sum + r.warningCount, 0),
    results: results,
    logFile: `logs/lint/${date}-eslint.log`,
  };

  fs.writeFileSync(path.join(reportDir, `${date}-eslint-report.json`), JSON.stringify(report, null, 2));
}
```

### Example 3: Lighthouse Performance Report

```javascript
// scripts/lighthouse.js
const fs = require("fs");
const path = require("path");
const lighthouseCI = require("@lhci/cli/src/index.js");

async function runLighthouse() {
  const results = await lighthouseCI.runLighthouse();

  const date = new Date().toISOString().split("T")[0];
  const reportDir = ".github/reports/analysis";
  fs.mkdirSync(reportDir, { recursive: true });

  const report = {
    date: new Date().toISOString(),
    tool: "lighthouse",
    type: "analysis",
    scores: results.scores,
    metrics: results.metrics,
    logFile: `logs/build/${date}-lighthouse.log`,
  };

  fs.writeFileSync(path.join(reportDir, `${date}-lighthouse.json`), JSON.stringify(report, null, 2));
}
```

## Checklists

**Run Checklist**

- Save outputs to `.github/reports/{category}/YYYY-MM-DD-*`
- Add `tool`, `type`, timestamps, metrics, `logFile`, and artifacts when relevant
- Create directories recursively; validate JSON/HTML before writing
- Move reports out of `tmp/`; delete temporary files after persistence
- Print saved report paths to console/logs for CI visibility

**Path Guardrails**

- Never write reports outside `.github/reports/`
- Always prefix filenames with ISO date
- Keep comparison baselines and project updates in their dedicated subfolders
- Archive or rotate older files instead of deleting unless policy requires

## References

- Agent index: `.github/agents/agent.md`
- Instructions: `.github/instructions/reporting.instructions.md`
- Script: `scripts/reporting.agent.js`
- Tests: `tests/agents/reporting.agent.test.js`
- Workflow: `.github/workflows/agent-reporting.yml`
- Logs: `logs/` (per-category subfolders)
## Summary

✅ Each report type has defined structure and location
✅ Agents validate paths and create directories as needed
✅ Reports include metadata linking to generating process
✅ Temporary files cleaned up after report generation
✅ Integration points with logging and build systems
✅ Examples and patterns for common report types
