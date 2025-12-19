---
title: "Initiate Mustache Variable Registry Scan"
description: "Prompt for running a new scan and updating the mustache variable registry with wizard support."
category: "registry"
date: 2025-12-18
---

# Mustache Variable Registry Scan Wizard

You are about to run a full scan of the repository for mustache template variables.

**This process will:**

- Discover all `{{mustache}}` placeholders in source, config, and docs.
- Compare results to the current registry.
- Identify undocumented, unused, or changed variables.
- Guide you through reviewing and updating the registry.

## Steps

1. **Scan**: Run the scan to auto-discover all variables.
2. **Review**: For each new or changed variable, the wizard will prompt you to:
   - Confirm or edit the variable name.
   - Assign a type and category.
   - Add a description and example value.
3. **Validate**: The wizard will validate the updated registry against the schema.
4. **Diff & Report**: Optionally, generate a diff/markdown report for review or PRs.
5. **Save**: Confirm and write the updated registry.

## Usage


# Mustache Variable Registry CLI Scan & Auto-Update

You are an automated CLI tool for the block theme scaffold. Your job is to:

1. **Scan**: Recursively search all files for `{{mustache}}` variables. List all unique variables found, with file locations and context.
2. **Compare**: Load the current registry from `scripts/mustache-variables-registry.json`. Identify new, missing, or changed variables.
3. **Auto-Update**: Automatically update the registry file to add new variables (with placeholder descriptions/types), remove missing ones, and update changed entries. No interactive wizard or user prompts.
4. **Document**: Output a summary report of all changes to `.github/reports/validation/` with an ISO-dated filename.

## Output Format

**Registry Entry Example:**
```json
{
   "variable": "theme_slug",
   "description": "The machine-readable slug for the theme.",
   "type": "string",
   "files": ["style.css", "functions.php"]
}
```

**Report Example:**
```json
{
   "date": "2025-12-18T10:00:00Z",
   "new": ["theme_author"],
   "removed": ["old_variable"],
   "updated": ["theme_name"],
   "unchanged": ["theme_slug"]
}
```

## Notes

- The process is fully automated—no user interaction or wizard steps.
- Always keep the registry in sync with the codebase.
- All changes must be documented in a dated report.
