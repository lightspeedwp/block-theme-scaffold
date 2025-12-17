---
name: "Temporary Files Management"
description: "Guidelines for AI agents on managing temporary files and cleanup"
applyTo: "**"
---

# Temporary Files Instructions for AI Agents & Copilot

## Overview

Use these instructions for managing temporary files during builds, tests, and processing. Ensures tmp/ directory is used correctly and cleaned up.

## General Rules

- All temporary files MUST go in the root-level `tmp/` directory (with subfolders for each process as needed, e.g. `tmp/dry-run/`, `tmp/build/`, etc.)
- All logs MUST go in the root-level `logs/` directory (with subfolders for each process as needed, e.g. `logs/dry-run/`, `logs/build/`, etc.)
- Never use `scripts/dry-run/tmp/` or `scripts/dry-run/logs/` for temp or log files—migrate any such usage to the root `tmp/` or `logs/` directories.
- Never save final outputs to `tmp/`—use appropriate permanent locations (e.g., `.github/reports/`).
- Always clean up temporary files after processing.
- `tmp/` and `logs/` directories are in `.gitignore` and `.distignore`.

## Temporary File & Log Locations

```
tmp/
├── build/              # Temporary build artifacts
├── test/               # Temporary test files
├── lint/               # Temporary lint processing
├── dry-run/            # Temporary files for dry-run process
└── [process-name]/     # Other process-specific temp files

logs/
├── build/              # Build logs
├── test/               # Test logs
├── dry-run/            # Dry-run logs
└── [process-name]/     # Other process-specific logs
```

## File Lifecycle

1. **Create:** Place temporary files in `tmp/[process-name]/` (never in `scripts/dry-run/tmp/`)
2. **Process:** Use temporary files for intermediate processing
3. **Save:** Move final outputs to permanent locations (e.g., `.github/reports/`)
4. **Clean:** Delete temporary files when done

## Example Pattern

```javascript
const fs = require("fs");
const path = require("path");

// Create temp directory
const tempDir = "tmp/my-process"; // Always use root-level tmp/
fs.mkdirSync(tempDir, { recursive: true });

// Use temp file
const tempFile = path.join(tempDir, "temp-data.json");
fs.writeFileSync(tempFile, JSON.stringify(data));

// Process data
const result = processData(tempFile);

// Save to permanent location
const reportFile = ".github/reports/analysis/2025-12-17-analysis.json";
fs.writeFileSync(reportFile, JSON.stringify(result, null, 2));

// Clean up temp files
fs.rmSync(tempDir, { recursive: true, force: true });

// Logs should also be written to root-level logs/ (e.g., logs/dry-run/), not scripts/dry-run/logs/
```

## Validation

- Verify `tmp/` and `logs/` are in .gitignore ✅
- Confirm no final outputs remain in `tmp/` after processing ✅
- Confirm no logs or temp files are written to `scripts/dry-run/tmp/` or `scripts/dry-run/logs/` ✅
- Check for orphaned temp files regularly ✅

## Related Instructions

- `.github/instructions/reporting.instructions.md` - Report storage locations
- `.github/instructions/folder-structure.instructions.md` - Complete folder structure
