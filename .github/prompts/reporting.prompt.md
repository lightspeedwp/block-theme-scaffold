---
description: "Prompt templates for generating and managing reports"
name: "Reporting Prompt Templates"
---

# Reporting Prompt Templates

This document contains prompt templates for AI agents to use when generating reports, analyzing metrics, and creating report summaries.

## Table of Contents

- Coverage Report Prompts
- Analysis Report Prompts
- Validation Report Prompts
- Performance Report Prompts
- Agent Report Prompts
- Comparison Report Prompts

---

## Coverage Report Prompts

### Prompt: Generate Coverage Report

```
Task: Generate a code coverage report from test execution results.

Input Data:
- Coverage data (statements, branches, functions, lines percentages)
- File count and file-by-file coverage
- Test framework (Jest, PHPUnit, etc.)
- Date and time of test execution
- Related log file path

Requirements:
1. Create JSON report with metadata
2. Include metrics object with all coverage percentages
3. Reference the related log file
4. Use correct date format in filename (YYYY-MM-DD)
5. Save to .github/reports/coverage/{js|php}/YYYY-MM-DD-coverage.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "<jest|phpunit>",
  "type": "coverage",
  "metrics": {
    "statements": <number>,
    "branches": <number>,
    "functions": <number>,
    "lines": <number>
  },
  "files": <number>,
  "logFile": "logs/test/YYYY-MM-DD-{tool}.log"
}

Success Criteria:
- All percentages between 0-100
- Files in .github/reports/coverage/js/ or .github/reports/coverage/php/
- Filename includes ISO date prefix
- logFile references correct log directory
```

### Prompt: Coverage Summary

```
Task: Create a human-readable summary of code coverage results.

Input:
- Coverage report JSON file path
- Previous coverage (for comparison)
- Coverage threshold values

Create a markdown summary that:
1. Shows overall coverage percentages
2. Highlights metrics below threshold
3. Compares to previous run if available
4. Lists top files by coverage
5. Notes files needing coverage improvement

Format as: .github/reports/coverage/{js|php}/YYYY-MM-DD-coverage-summary.md

Example output:
# Code Coverage Report

Date: 2025-12-07

## Overview

- Statements: 92.5% (✓ exceeds 80% threshold)
- Branches: 88.3% (✓ exceeds 80% threshold)
- Functions: 90.1% (✓ exceeds 80% threshold)
- Lines: 93.2% (✓ exceeds 80% threshold)

## Comparison

vs. Previous (2025-12-06):
- Statements: +1.2%
- Branches: -0.3%
- Functions: +0.8%
- Lines: +1.5%

## Files Needing Coverage

- src/js/utils/helpers.js (74% - below 80% threshold)
- src/js/api/client.js (78% - below 80% threshold)
```

---

## Analysis Report Prompts

### Prompt: Generate Lighthouse Report

```
Task: Generate a Lighthouse performance analysis report.

Input:
- Lighthouse audit results
- URL audited
- Audit timestamp
- Device profile (mobile/desktop)

Requirements:
1. Extract scores for: performance, accessibility, best-practices, seo
2. Extract key metrics: FCP, LCP, CLS, FID, TTFB
3. Create JSON report with structure below
4. Save to .github/reports/analysis/YYYY-MM-DD-lighthouse.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "lighthouse",
  "type": "analysis",
  "url": "<audited URL>",
  "device": "<mobile|desktop>",
  "scores": {
    "performance": <0-100>,
    "accessibility": <0-100>,
    "bestPractices": <0-100>,
    "seo": <0-100>
  },
  "metrics": {
    "firstContentfulPaint": <ms>,
    "largestContentfulPaint": <ms>,
    "cumulativeLayoutShift": <number>,
    "totalBlockingTime": <ms>
  },
  "logFile": "logs/build/YYYY-MM-DD-lighthouse.log"
}

Scoring Guidance:
- 90-100: Green (good)
- 50-89: Orange (needs improvement)
- 0-49: Red (poor)
```

### Prompt: Generate Bundle Analysis Report

```
Task: Generate a webpack bundle analysis report.

Input:
- Webpack bundle stats
- Bundle size metrics
- Asset list with sizes
- Build timestamp

Requirements:
1. Calculate total bundle size (gzipped and ungzipped)
2. Identify largest assets
3. Detect potential issues (large files, duplicates)
4. Create JSON report
5. Save to .github/reports/analysis/YYYY-MM-DD-bundle-analysis.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "webpack-bundle-analyzer",
  "type": "analysis",
  "totalSize": {
    "raw": <bytes>,
    "gzipped": <bytes>
  },
  "largestAssets": [
    {
      "name": "<asset name>",
      "size": <bytes>,
      "gzipped": <bytes>,
      "percentage": <0-100>
    }
  ],
  "issues": [
    {
      "type": "<duplication|large-file>",
      "severity": "<warning|error>",
      "message": "<description>"
    }
  ],
  "logFile": "logs/build/YYYY-MM-DD-bundle-analysis.log"
}

Asset Analysis:
- Flag files > 100KB as warnings
- Flag duplicate packages as warnings
- Suggest code splitting opportunities
```

---

## Validation Report Prompts

### Prompt: Generate ESLint Report

```
Task: Generate an ESLint validation report.

Input:
- ESLint results (errors and warnings by file)
- Execution timestamp
- Files checked

Requirements:
1. Parse ESLint output
2. Count errors and warnings
3. Categorize by rule
4. Create JSON report
5. Save to .github/reports/validation/YYYY-MM-DD-eslint-report.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "eslint",
  "type": "validation",
  "errorCount": <number>,
  "warningCount": <number>,
  "files": <number>,
  "results": [
    {
      "filePath": "<path>",
      "messages": [
        {
          "line": <number>,
          "column": <number>,
          "severity": "<error|warning>",
          "message": "<description>",
          "rule": "<rule name>"
        }
      ]
    }
  ],
  "logFile": "logs/lint/YYYY-MM-DD-eslint.log"
}

Error Thresholds:
- 0 errors: ✓ Pass
- 1+ errors: ✗ Fail (must be fixed)
- 1+ warnings: ⚠ Warning (address if possible)
```

### Prompt: Generate Validation Summary

```
Task: Create a summary of all validation (linting) results.

Input:
- ESLint report
- Stylelint report
- PHPCS report

Create a combined report: .github/reports/validation/YYYY-MM-DD-validation-summary.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "type": "validation",
  "tools": {
    "eslint": {
      "errorCount": <number>,
      "warningCount": <number>,
      "passed": <boolean>,
      "report": "YYYY-MM-DD-eslint-report.json"
    },
    "stylelint": {
      "errorCount": <number>,
      "warningCount": <number>,
      "passed": <boolean>,
      "report": "YYYY-MM-DD-stylelint-report.json"
    },
    "phpcs": {
      "errorCount": <number>,
      "warningCount": <number>,
      "passed": <boolean>,
      "report": "YYYY-MM-DD-phpcs-report.json"
    }
  },
  "summary": {
    "totalErrors": <number>,
    "totalWarnings": <number>,
    "overallPassed": <boolean>
  },
  "logFile": "logs/lint/YYYY-MM-DD-validation.log"
}

Summary Logic:
- overallPassed = true only if all tools have 0 errors
- Warnings don't fail, but should be addressed
```

---

## Performance Report Prompts

### Prompt: Generate Bundle Size Report

```
Task: Generate a bundle size metrics report.

Input:
- size-limit or webpack stats output
- Previous bundle sizes (for comparison)
- Size budget values

Requirements:
1. Parse bundle sizes (raw and gzipped)
2. Calculate percentage change from previous
3. Check against size budget
4. Create JSON report
5. Save to .github/reports/performance/YYYY-MM-DD-bundle-size.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "size-limit",
  "type": "performance",
  "packages": [
    {
      "name": "<package name>",
      "size": "<size in kB>",
      "sizeGzip": "<size in kB>",
      "budget": "<budget in kB>",
      "passed": <boolean>,
      "change": {
        "size": "<+/-X kB>",
        "percentage": "<+/-X.X%>"
      }
    }
  ],
  "logFile": "logs/build/YYYY-MM-DD-bundle-size.log"
}

Budget Checking:
- passed = (size <= budget)
- Calculate percentage: ((current - previous) / previous) * 100
- Flag if size increases > 5% from previous
```

### Prompt: Generate Performance Budget Report

```
Task: Evaluate against performance budget and create report.

Input:
- Current performance metrics (Lighthouse, Core Web Vitals)
- Performance budget thresholds
- Previous metrics

Requirements:
1. Compare metrics to budget
2. Identify violations and successes
3. Create detailed report
4. Save to .github/reports/performance/YYYY-MM-DD-performance-budget.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "tool": "performance-budget",
  "type": "performance",
  "budget": {
    "performance": 80,
    "accessibility": 90,
    "bestPractices": 90,
    "seo": 90,
    "maxBundleSize": "50 kB"
  },
  "metrics": {
    "performance": <0-100>,
    "accessibility": <0-100>,
    "bestPractices": <0-100>,
    "seo": <0-100>,
    "bundleSize": "<X kB>"
  },
  "violations": [
    {
      "metric": "<name>",
      "budget": <number>,
      "actual": <number>,
      "severity": "<error|warning>"
    }
  ],
  "passed": <boolean>,
  "logFile": "logs/build/YYYY-MM-DD-performance-budget.log"
}

Violation Severity:
- error: Metric below budget threshold
- warning: Metric within 10% of budget
```

---

## Agent Report Prompts

### Prompt: Generate Agent Execution Report

```
Task: Create a report of AI agent execution and results.

Input:
- Agent name
- Execution status (success/failure)
- Files created, modified, or deleted
- Any warnings or errors encountered
- Execution duration
- Related log file

Requirements:
1. Structure all execution data in JSON
2. Include timestamp and status
3. List all artifacts with operation type
4. Provide metrics (duration, file counts)
5. Save to .github/reports/agents/YYYY-MM-DD-{agent-name}.json

Report Structure:
{
  "agent": "<agent-name>",
  "timestamp": "<ISO timestamp>",
  "status": "<success|failure|warning>",
  "summary": "<what agent accomplished>",
  "metrics": {
    "filesCreated": <number>,
    "filesModified": <number>,
    "filesDeleted": <number>,
    "duration": "<X.X seconds>",
    "errors": <number>,
    "warnings": <number>
  },
  "artifacts": [
    {
      "path": "<file path>",
      "operation": "<created|modified|deleted>"
    }
  ],
  "warnings": ["<warning 1>", "<warning 2>"],
  "errors": ["<error 1>", "<error 2>"],
  "logFile": "logs/agents/YYYY-MM-DD-{agent-name}.log"
}

Status Logic:
- success: 0 errors, agent completed task
- warning: 0 errors but some warnings
- failure: 1+ errors, task incomplete
```

### Prompt: Generate Agent Summary Markdown

```
Task: Create human-readable summary of agent execution.

Input:
- Agent execution report (JSON)
- Agent description
- Key results

Create markdown file: .github/reports/agents/YYYY-MM-DD-{agent-name}-summary.md

Template:
# {Agent Name} Execution Report

**Status**: {SUCCESS|FAILURE|WARNING}
**Date**: {ISO timestamp}
**Duration**: {X.X seconds}

## Summary

{What the agent did and main results}

## Results

- Files Created: {N}
- Files Modified: {N}
- Files Deleted: {N}
- Errors: {N}
- Warnings: {N}

## Artifacts

{List of created/modified files with brief description}

## Issues

{If warnings/errors exist, list them with context}

## Log File

See: `logs/agents/YYYY-MM-DD-{agent-name}.log`

---

Use this template to make reports scannable and informative.
```

---

## Comparison Report Prompts

### Prompt: Generate Bundle Size Comparison

```
Task: Compare current and baseline bundle sizes, generate comparison report.

Input:
- Current bundle report (YYYY-MM-DD-bundle-size.json)
- Baseline/previous report (YYYY-MM-DD-bundle-size.json from previous date)
- Size budget threshold

Requirements:
1. Load both reports
2. Calculate differences and percentages
3. Determine if changes acceptable
4. Create comparison JSON
5. Save to .github/reports/comparison/YYYY-MM-DD-bundle-size-diff.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "type": "comparison",
  "comparisonType": "bundle-size",
  "baseline": {
    "date": "<previous report date>",
    "size": "<X kB>",
    "sizeGzip": "<X kB>"
  },
  "current": {
    "date": "<current report date>",
    "size": "<X kB>",
    "sizeGzip": "<X kB>"
  },
  "diff": {
    "size": {
      "absolute": "<+/-X kB>",
      "percentage": "<+/-X.X%>"
    },
    "sizeGzip": {
      "absolute": "<+/-X kB>",
      "percentage": "<+/-X.X%>"
    },
    "acceptable": <boolean>
  },
  "logFile": "logs/build/YYYY-MM-DD-bundle-comparison.log"
}

Acceptability Rules:
- acceptable = true if change <= +5% and < +10 kB
- acceptable = false if change > +5% or > +10 kB
- Flag significant reductions (> -10%) as successes
```

### Prompt: Generate Performance Comparison

```
Task: Compare current performance metrics to baseline.

Input:
- Current Lighthouse report
- Baseline Lighthouse report (from previous successful run)

Requirements:
1. Compare all score categories
2. Compare Core Web Vitals
3. Identify regressions and improvements
4. Create comparison report
5. Save to .github/reports/comparison/YYYY-MM-DD-performance-diff.json

Report Structure:
{
  "date": "<ISO timestamp>",
  "type": "comparison",
  "comparisonType": "performance",
  "baseline": {
    "date": "<previous report date>",
    "scores": { "performance": X, "accessibility": X, ... }
  },
  "current": {
    "date": "<current report date>",
    "scores": { "performance": X, "accessibility": X, ... }
  },
  "changes": {
    "performance": {
      "from": X,
      "to": Y,
      "change": "Z",
      "status": "<improved|regressed|unchanged>"
    },
    ...
  },
  "summary": "<overall improvement/regression>",
  "logFile": "logs/build/YYYY-MM-DD-performance-comparison.log"
}

Status Logic:
- improved: Current > Baseline
- regressed: Current < Baseline
- unchanged: Current == Baseline
```

---

## Common Patterns

### Pattern: Report Generation Checklist

Before saving any report, verify:

```
□ Location: .github/reports/{category}/
□ Filename: YYYY-MM-DD-{description}.{ext}
□ Date format: ISO 8601 (2025-12-07)
□ Metadata: date, tool, type included
□ Log reference: logFile points to correct log directory
□ Directory: Created with fs.mkdirSync({ recursive: true })
□ Content: Valid JSON (if .json file)
□ Cleanup: Temporary files removed after report saved
```

### Pattern: Consistent Date Format

```javascript
// ✓ Correct
const date = new Date().toISOString().split("T")[0]; // 2025-12-07
const timestamp = new Date().toISOString(); // 2025-12-07T10:30:45.123Z

// ✗ Incorrect
const badDate = Date.now(); // Milliseconds timestamp
const wrongFormat = new Date().toLocaleDateString(); // 12/7/2025
```

### Pattern: Report File Organization

```
.github/reports/
├── {category}/
│   └── YYYY-MM-DD-{type}.json      ← Report file
│   └── YYYY-MM-DD-{type}-summary.md ← Optional markdown
│   └── YYYY-MM-DD-{type}-detail/    ← Optional detailed files
```

---

## Tips for AI Agents

1. **Always validate paths** before writing files
2. **Use consistent date format** (ISO 8601) everywhere
3. **Include metadata** in every report (date, tool, type, logFile)
4. **Reference logs** from within reports
5. **Create summaries** for complex reports (markdown human-readable version)
6. **Clean up temps** - never leave temporary files
7. **Print confirmations** - let users know report was saved
8. **Store structured data** - use JSON for machine-readability

## Related Documentation

- `../instructions/reporting.instructions.md` - Agent implementation rules
- `../../docs/REPORTING.md` - System documentation
- `../../docs/LOGGING.md` - Log standards
- `../agents/reporting.agent.md` - Agent implementation guide
