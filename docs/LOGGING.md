# Logging Standards & Implementation Guide

## Overview

This document defines logging standards for all processes in the block theme scaffold: build, test, lint, and agent operations. All logs should be written to `logs/` directory and excluded from distribution.

## Core Principles

1. **Centralized**: All logs go to `logs/` directory
2. **Structured**: Consistent timestamp, level, and message format
3. **Processable**: Machine-readable for log aggregation
4. **Archived**: Automatic cleanup of old logs
5. **Excluded**: Never included in distribution or committed to git

## Log Directory Structure

```
logs/
├── lint/                 # Linting operations
│   ├── 2025-12-07-lint-dry-run.log
│   ├── 2025-12-07-eslint.log
│   ├── 2025-12-07-stylelint.log
│   └── 2025-12-07-php-lint.log
├── test/                 # Test execution
│   ├── 2025-12-07-jest.log
│   ├── 2025-12-07-phpunit.log
│   ├── 2025-12-07-e2e.log
│   └── 2025-12-07-lighthouse.log
├── build/                # Build processes
│   ├── 2025-12-07-webpack.log
│   ├── 2025-12-07-babel.log
│   └── 2025-12-07-sass.log
└── agents/               # AI agent operations
    ├── 2025-12-07-theme-generator.log
    ├── 2025-12-07-build-agent.log
    └── 2025-12-07-code-review-agent.log
```

## Log Format

### Standard Format

```
[TIMESTAMP] [LEVEL] [PROCESS] [MESSAGE]
```

**Components:**

- `TIMESTAMP`: ISO 8601 format with milliseconds: `2025-12-07T10:30:45.123Z`
- `LEVEL`: One of DEBUG, INFO, WARN, ERROR, FATAL
- `PROCESS`: Name of the process (e.g., lint-dry-run, jest, webpack)
- `MESSAGE`: Human-readable message

### Examples

```log
[2025-12-07T10:30:45.123Z] [INFO] [lint-dry-run] Starting lint dry-run...
[2025-12-07T10:30:46.456Z] [INFO] [lint-dry-run] Creating temporary test files...
[2025-12-07T10:30:47.789Z] [DEBUG] [lint-dry-run] Processing file: src/js/theme.js
[2025-12-07T10:30:48.000Z] [INFO] [eslint] JavaScript linting: ✓ passed
[2025-12-07T10:30:49.111Z] [WARN] [stylelint] CSS has 3 warnings
[2025-12-07T10:30:50.222Z] [ERROR] [stylelint] CSS linting failed: 5 errors found
[2025-12-07T10:30:51.333Z] [INFO] [lint-dry-run] Cleaning up temporary files
[2025-12-07T10:30:52.444Z] [INFO] [lint-dry-run] Lint dry-run complete
```

## Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **DEBUG** | Detailed diagnostic info | Variable values, intermediate steps |
| **INFO** | General informational | Operation started/completed, progress |
| **WARN** | Warning messages | Non-critical issues, deprecations |
| **ERROR** | Error messages | Operation failed, validation errors |
| **FATAL** | Critical failures | Unrecoverable errors, process abort |

### When to Use Each Level

```javascript
// DEBUG - Detailed diagnostic
[DEBUG] Scaffold mode detected: true
[DEBUG] Placeholder count: 42
[DEBUG] Processing file: src/js/theme.js (234 bytes)

// INFO - General information
[INFO] Starting linting process
[INFO] Created temporary directory: .lint-temp/
[INFO] JavaScript linting: ✓ passed
[INFO] Process completed successfully

// WARN - Warnings
[WARN] Skipping PHP linting (Composer not available)
[WARN] Log file exceeds 100MB, consider archiving

// ERROR - Errors
[ERROR] JavaScript linting failed: 5 errors found
[ERROR] Could not read package.json: ENOENT

// FATAL - Critical failures
[FATAL] Unable to initialize build process
[FATAL] Disk space critical: < 100MB available
```

## Implementation Guide

### Node.js/JavaScript Logging

#### Using Console with Timestamps

```javascript
// Basic logger
class Logger {
  constructor(processName) {
    this.processName = processName;
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [${this.processName}] ${message}`;
    console.log(formattedMessage);
  }

  debug(message) { this.log('DEBUG', message); }
  info(message) { this.log('INFO', message); }
  warn(message) { this.log('WARN', message); }
  error(message) { this.log('ERROR', message); }
  fatal(message) { this.log('FATAL', message); }
}

// Usage
const logger = new Logger('lint-dry-run');
logger.info('Starting lint dry-run...');
logger.debug('Temporary directory created');
logger.error('Linting failed');
```

#### Writing to Log Files

```javascript
const fs = require('fs');
const path = require('path');

class FileLogger {
  constructor(processName, logDir = 'logs') {
    this.processName = processName;
    this.logDir = logDir;
    this.ensureLogDir();
    this.logPath = this.getLogPath();
  }

  ensureLogDir() {
    const categoryDir = path.join(this.logDir, this.processName.split('-')[0]);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  }

  getLogPath() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const category = this.processName.split('-')[0]; // e.g., 'lint', 'test'
    return path.join(this.logDir, category, `${date}-${this.processName}.log`);
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [${this.processName}] ${message}\n`;

    // Write to file
    fs.appendFileSync(this.logPath, formattedMessage);

    // Also output to console
    console.log(formattedMessage.trim());
  }

  debug(message) { this.log('DEBUG', message); }
  info(message) { this.log('INFO', message); }
  warn(message) { this.log('WARN', message); }
  error(message) { this.log('ERROR', message); }
  fatal(message) { this.log('FATAL', message); }
}

// Usage
const logger = new FileLogger('lint-dry-run');
logger.info('Starting lint dry-run...');
logger.debug('Temporary directory created');
logger.error('Linting failed');
```

#### Integration with Existing Scripts

Example: `scripts/lint-dry-run.js`

```javascript
#!/usr/bin/env node

const FileLogger = require('./logger');

function main() {
  const logger = new FileLogger('lint-dry-run');

  try {
    logger.info('Starting lint dry-run...');

    // Create temp dir
    logger.debug('Creating temporary test files...');
    createTempDir();
    logger.info('Temporary files created');

    // Run linters
    logger.info('Running linters...');

    try {
      logger.info('JavaScript linting...');
      runJavaScriptLinting();
      logger.info('JavaScript linting: ✓ passed');
    } catch (error) {
      logger.error(`JavaScript linting failed: ${error.message}`);
    }

    logger.info('Lint dry-run complete');

  } catch (error) {
    logger.fatal(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

main();
```

### PHP Logging

```php
<?php

class FileLogger {
  private $processName;
  private $logDir;
  private $logPath;

  public function __construct($processName, $logDir = 'logs') {
    $this->processName = $processName;
    $this->logDir = $logDir;
    $this->ensureLogDir();
    $this->logPath = $this->getLogPath();
  }

  private function ensureLogDir() {
    $parts = explode('-', $this->processName);
    $category = $parts[0];
    $categoryDir = $this->logDir . '/' . $category;

    if (!is_dir($categoryDir)) {
      @mkdir($categoryDir, 0755, true);
    }
  }

  private function getLogPath() {
    $date = date('Y-m-d');
    $category = explode('-', $this->processName)[0];
    return $this->logDir . '/' . $category . '/' . $date . '-' . $this->processName . '.log';
  }

  private function formatMessage($level, $message) {
    $timestamp = gmdate('c');
    return "[{$timestamp}] [{$level}] [{$this->processName}] {$message}\n";
  }

  private function write($message) {
    file_put_contents($this->logPath, $message, FILE_APPEND);
    echo $message;
  }

  public function debug($message) {
    $this->write($this->formatMessage('DEBUG', $message));
  }

  public function info($message) {
    $this->write($this->formatMessage('INFO', $message));
  }

  public function warn($message) {
    $this->write($this->formatMessage('WARN', $message));
  }

  public function error($message) {
    $this->write($this->formatMessage('ERROR', $message));
  }

  public function fatal($message) {
    $this->write($this->formatMessage('FATAL', $message));
  }
}

// Usage
$logger = new FileLogger('phpunit');
$logger->info('Starting PHPUnit tests...');
$logger->debug('Test count: 42');
$logger->error('Test failed: assertion error');
```

### Shell Script Logging

```bash
#!/bin/bash

# Log directory setup
LOG_DIR="logs"
LOG_SUBDIR="$LOG_DIR/test"
PROCESS_NAME="e2e"
LOG_DATE=$(date +%Y-%m-%d)
LOG_FILE="$LOG_SUBDIR/$LOG_DATE-$PROCESS_NAME.log"

# Create log directory
mkdir -p "$LOG_SUBDIR"

# Logging functions
log_debug() {
  local msg="$1"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
  echo "[${timestamp}] [DEBUG] [${PROCESS_NAME}] ${msg}" | tee -a "$LOG_FILE"
}

log_info() {
  local msg="$1"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
  echo "[${timestamp}] [INFO] [${PROCESS_NAME}] ${msg}" | tee -a "$LOG_FILE"
}

log_error() {
  local msg="$1"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
  echo "[${timestamp}] [ERROR] [${PROCESS_NAME}] ${msg}" | tee -a "$LOG_FILE" >&2
}

# Usage
log_info "Starting E2E tests..."
log_debug "Test environment: staging"
log_info "Running tests..."
log_error "Test failed: connection timeout"
```

## Log Rotation & Cleanup

### Automatic Cleanup

Add to `package.json` scripts:

```json
{
  "scripts": {
    "logs:cleanup": "node bin/cleanup-logs.js",
    "logs:archive": "node bin/archive-logs.js"
  }
}
```

Implement `bin/cleanup-logs.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOGS_DIR = 'logs';
const MAX_AGE_DAYS = 30; // Delete logs older than 30 days
const MAX_SIZE_MB = 100; // Archive if larger than 100MB

function cleanupOldLogs() {
  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        walkDir(filePath);
      } else if (stats.isFile() && file.endsWith('.log')) {
        const age = now - stats.mtimeMs;
        if (age > maxAge) {
          console.log(`Removing old log: ${filePath}`);
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  walkDir(LOGS_DIR);
}

function archiveLargeLogs() {
  const now = Date.now();

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        walkDir(filePath);
      } else if (stats.isFile() && file.endsWith('.log')) {
        const sizeMB = stats.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
          const archivePath = `${filePath}.gz`;
          console.log(`Compressing large log: ${filePath}`);
          // Use gzip compression
          require('child_process').execSync(`gzip -c "${filePath}" > "${archivePath}"`);
        }
      }
    });
  }

  walkDir(LOGS_DIR);
}

cleanupOldLogs();
archiveLargeLogs();
console.log('Log cleanup complete');
```

### CI/CD Integration

Add to GitHub Actions workflow:

```yaml
name: Cleanup Logs

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Cleanup old logs
        run: npm run logs:cleanup
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add logs/
          git commit -m "chore: cleanup old logs" || true
          git push
```

## Log Analysis

### Finding Errors

```bash
# Find all errors in logs
grep -r "\[ERROR\]" logs/

# Find errors in specific process
grep "\[ERROR\]" logs/lint/2025-12-07-*.log

# Count errors
grep -r "\[ERROR\]" logs/ | wc -l

# Get errors with context
grep -r -B2 -A2 "\[ERROR\]" logs/
```

### Filtering by Date

```bash
# Logs from December 7
ls logs/*/*.log | grep "2025-12-07"

# Logs from past 7 days
find logs -name "*.log" -mtime -7

# Logs from past 24 hours
find logs -name "*.log" -mtime -1
```

### Analyzing Test Logs

```bash
# Extract test results
grep "✓\|✗\|PASSED\|FAILED" logs/test/2025-12-07-jest.log

# Count test status
grep "✓" logs/test/2025-12-07-jest.log | wc -l

# Find slow tests
grep "ms)" logs/test/2025-12-07-jest.log | sort -t: -k3 -rn | head -5
```

## Logging in AI Agents

### Agent Logging Template

```javascript
class AgentLogger {
  constructor(agentName) {
    this.agentName = agentName;
    this.logger = new FileLogger(`agent-${agentName}`);
  }

  logStart(task) {
    this.logger.info(`[AGENT] Starting: ${task}`);
  }

  logStep(step, description) {
    this.logger.debug(`[STEP ${step}] ${description}`);
  }

  logDecision(decision, reasoning) {
    this.logger.info(`[DECISION] ${decision} - ${reasoning}`);
  }

  logResult(success, message) {
    if (success) {
      this.logger.info(`[RESULT] Success: ${message}`);
    } else {
      this.logger.error(`[RESULT] Failed: ${message}`);
    }
  }

  logMetrics(metrics) {
    this.logger.info(`[METRICS] ${JSON.stringify(metrics)}`);
  }
}

// Usage
const agentLogger = new AgentLogger('theme-generator');
agentLogger.logStart('Generate theme from scaffold');
agentLogger.logStep(1, 'Reading scaffold files');
agentLogger.logDecision('Use template placeholders', 'Preserves default values');
agentLogger.logResult(true, 'Theme generated successfully');
agentLogger.logMetrics({ filesProcessed: 42, duration: '2.5s' });
```

## Exclusions

### .distignore

```
# Logs should never be distributed
logs/
```

### .gitignore

```
# Logs should never be committed
logs/
```

### Git Attributes

Add to `.gitattributes`:

```
logs/ export-ignore
tmp/ export-ignore
reports/ export-ignore
```

## Best Practices

1. **Always log at entry and exit** of operations
2. **Use appropriate log levels** for context
3. **Include variable values** in debug logs
4. **Log errors with context** (what failed, why, how to fix)
5. **Clean up logs regularly** to prevent disk bloat
6. **Test log output** before deployment
7. **Use timestamps consistently** (ISO 8601)
8. **Avoid sensitive data** in logs (passwords, keys, etc.)

## Related Documentation

- [LINTING.md](./LINTING.md) - Linting output and dry-run mode logging
- [TESTING.md](./TESTING.md) - Test execution logging
- [BUILD_PROCESS.md](./BUILD_PROCESS.md) - Build system logging
- [VALIDATION.md](./VALIDATION.md) - Validation process logging
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD workflow logging
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance monitoring logs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Repository structure
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Naming conventions
- [GOVERNANCE.md](./GOVERNANCE.md) - Project policies

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Initial logging standards documentation |
