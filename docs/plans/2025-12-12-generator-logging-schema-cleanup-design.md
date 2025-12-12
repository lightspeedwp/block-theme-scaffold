# Generator Logging, Schema Validation & Cleanup Design

**Date:** 2025-12-12
**Status:** Design Complete
**Category:** Generator System Enhancement

## Overview

This design adds comprehensive logging, mustache variable schema validation, and two-phase cleanup to the block theme generator system. It ensures proper tracking of theme generation, validates template integrity, and cleanly removes scaffold-only files from generated themes.

## Problem Statement

The current generator system lacks:

1. **Logging** - No record of generation attempts, variables used, or validation results
2. **Schema validation** - Mustache variables are undocumented and unvalidated
3. **Clean separation** - Generated themes contain scaffold-specific files and tooling
4. **Release validation** - Scaffold releases don't verify schema integrity or generation smoke tests

## Design Goals

1. Add JSON-formatted per-project logging to track all theme generations
2. Create and validate a comprehensive mustache variables schema
3. Implement two-phase cleanup: immediate (scaffold release files) and confirmed (generator tooling)
4. Enhance release-scaffold agent with schema validation and generation smoke tests
5. Remove unnecessary workflow file for local-only operations

## Architecture

### 1. Logging System

**Component:** `scripts/lib/logger.js`

Creates per-project log files at `logs/generate-theme-{{slug}}.log` with standard detail level.

**Log Entry Format:**
```json
{
  "timestamp": "2025-12-12T10:30:45.123Z",
  "slug": "safari-lodge",
  "status": "success|failure",
  "variables": {
    "name": "Safari Lodge Theme",
    "slug": "safari-lodge",
    "author": "LightSpeed",
    "author_uri": "https://lightspeedwp.agency/",
    "version": "1.0.0",
    "namespace": "safari_lodge",
    "textdomain": "safari-lodge"
  },
  "validation": {
    "passed": true,
    "errors": [],
    "warnings": ["Optional: design tokens not provided"]
  },
  "outputPath": "./generated-theme",
  "error": null
}
```

**Integration Points:**
- `scripts/generate-theme.js` - Add logging at start, completion, and error handling
- Logger appends to existing log files (supports multiple generation attempts)
- Logger creates `logs/` directory if it doesn't exist

**Logged Data:**
- Timestamp (ISO 8601 format)
- Theme slug
- Success/failure status
- All mustache variables used
- Validation results summary
- Output path
- Error details (if failure)

### 2. Mustache Variables Schema

**File:** `.github/schemas/mustache-variables-registry.schema.json`

A JSON Schema that documents all mustache variables used throughout the scaffold.

**Schema Structure:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://github.com/lightspeedwp/block-theme-scaffold/schemas/mustache-variables-registry",
  "title": "Mustache Variables Registry",
  "description": "Registry of all mustache template variables in the block theme scaffold",
  "type": "object",
  "properties": {
    "slug": {
      "type": "string",
      "description": "Theme slug (lowercase, hyphens)",
      "pattern": "^[a-z0-9-]{2,}$",
      "examples": ["tour-operator", "safari-lodge"]
    },
    "name": {
      "type": "string",
      "description": "Theme display name",
      "minLength": 2,
      "examples": ["Tour Operator Theme", "Safari Lodge"]
    },
    "namespace": {
      "type": "string",
      "description": "PHP namespace (auto-derived from slug)",
      "pattern": "^[a-z_][a-z0-9_]*$",
      "examples": ["tour_operator", "safari_lodge"]
    },
    "textdomain": {
      "type": "string",
      "description": "WordPress text domain (auto-derived from slug)",
      "pattern": "^[a-z0-9-]+$",
      "examples": ["tour-operator", "safari-lodge"]
    },
    "author": {
      "type": "string",
      "description": "Theme author name",
      "minLength": 2
    },
    "author_uri": {
      "type": "string",
      "description": "Theme author website URL",
      "format": "uri",
      "pattern": "^https?://"
    },
    "version": {
      "type": "string",
      "description": "Semantic version number",
      "pattern": "^\\d+\\.\\d+(\\.\\d+)?(-[a-z0-9.-]+)?$",
      "examples": ["1.0.0", "2.1.0-beta.1"]
    },
    "description": {
      "type": "string",
      "description": "Theme description"
    },
    "license": {
      "type": "string",
      "description": "SPDX license identifier",
      "default": "GPL-3.0-or-later",
      "examples": ["GPL-3.0-or-later", "MIT"]
    },
    "license_uri": {
      "type": "string",
      "description": "License URL (auto-derived from license)",
      "format": "uri"
    },
    "min_wp_version": {
      "type": "string",
      "description": "Minimum WordPress version",
      "pattern": "^\\d+\\.\\d+$",
      "default": "6.5"
    },
    "tested_wp_version": {
      "type": "string",
      "description": "Tested up to WordPress version",
      "pattern": "^\\d+\\.\\d+$",
      "default": "6.7"
    },
    "min_php_version": {
      "type": "string",
      "description": "Minimum PHP version",
      "pattern": "^\\d+\\.\\d+$",
      "default": "8.0"
    },
    "primary_color": {
      "type": "string",
      "description": "Primary brand color (hex)",
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "default": "#0073aa"
    },
    "secondary_color": {
      "type": "string",
      "description": "Secondary brand color (hex)",
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "default": "#005177"
    },
    "background_color": {
      "type": "string",
      "description": "Background color (hex)",
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "default": "#ffffff"
    },
    "text_color": {
      "type": "string",
      "description": "Text color (hex)",
      "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "default": "#1a1a1a"
    },
    "font_family": {
      "type": "string",
      "description": "Body font family (CSS)",
      "default": "system-ui"
    },
    "heading_font": {
      "type": "string",
      "description": "Heading font family (CSS)",
      "default": "inherit"
    },
    "hero_title": {
      "type": "string",
      "description": "Homepage hero title",
      "default": "Welcome"
    },
    "cta_text": {
      "type": "string",
      "description": "Call-to-action button text",
      "default": "Get Started"
    },
    "footer_text": {
      "type": "string",
      "description": "Footer copyright text",
      "default": "© {{author}}"
    }
  },
  "required": ["slug", "name", "author"],
  "additionalProperties": false
}
```

**TODO Items in Schema:**
- Schema is initially valid with all known variables documented
- Each property has description, type, validation pattern, examples
- Use TODO comments in code to mark future variable expansions

### 3. Schema Validation Test

**File:** `scripts/test-mustache-schema.js`

Performs three levels of validation:

**Level 1: Schema Structure Validation**
- Validates that `mustache-variables-registry.schema.json` is valid JSON Schema
- Uses Ajv (already in dependencies) to validate schema structure
- Fails if schema is malformed or invalid

**Level 2: Known Variables Validation**
- Maintains hardcoded list of expected mustache variables
- Compares schema properties against known variables list
- Warns if schema is missing known variables
- Warns if schema has undocumented variables

**Level 3: Registry Sync Validation**
- Scans codebase for all `{{...}}` patterns
- Excludes: `node_modules/`, `vendor/`, `.git/`, `generated-theme/`
- Checks each found pattern against schema registry
- Fails if undocumented mustache variables exist in codebase
- Reports file locations of undocumented variables

**Test Output:**
```
✓ Schema structure valid
✓ Known variables match schema
✓ Registry synced with codebase (23 variables found)

All validation checks passed!
```

**Error Output:**
```
✗ Schema structure invalid
  - Schema missing required $schema property

✗ Registry sync failed
  - Found undocumented variable {{theme_prefix}} in:
    - style.css:12
    - functions.php:45

Validation failed with 2 errors
```

**Exit Codes:**
- `0` - All validations passed
- `1` - Validation failed

### 4. Two-Phase Cleanup

**Phase 1: Immediate Deletion**

Executed by `scripts/generate-theme.js` immediately after successful theme generation.

**Files Deleted:**
- `.github/agents/release-scaffold.agent.md`
- `.github/prompts/release-scaffold.prompt.md`
- `.github/instructions/release-scaffold.instructions.md`
- `docs/RELEASE_PROCESS_SCAFFOLD.md`

**Reason:** These files are scaffold-specific and should never exist in generated themes.

**Phase 2: Confirmed Deletion**

Executed by `.github/agents/generate-theme.agent.md` after user validates the generated theme.

**User Validation Options:**

**Option A - Quick Validation:**
- ☐ Installed theme in WordPress
- ☐ Activated successfully
- ☐ Build runs without errors (`npm run build`)
- ☐ No console errors in browser

**Option B - Full Validation:**
- ☐ All items from Option A
- ☐ Tests pass (`npm test`)
- ☐ Linting passes (`npm run lint`)
- ☐ Created and verified sample content

**Files Deleted (after user confirms):**
- `.github/agents/generate-theme.agent.md`
- `.github/prompts/generate-theme.prompt.md`
- `.github/instructions/generate-theme.instructions.md`
- `docs/GENERATE_THEME.md`
- `.github/schemas/mustache-variables-registry.schema.json`
- `scripts/test-mustache-schema.js`
- `scripts/lib/logger.js`
- `logs/` directory (entire directory)
- `scripts/generate-theme.js`

**Reason:** Once theme is confirmed working, generation tooling is no longer needed.

### 5. Agent Conversation Flow Update

**File:** `.github/agents/generate-theme.agent.md`

Add new **Stage 5: Theme Validation & Cleanup** after generation completes:

```markdown
## Stage 5: Theme Validation & Cleanup

After generating your theme, I'll guide you through validation and cleanup.

### Phase 1: Immediate Cleanup (Done Automatically)

I've removed scaffold-specific release files:
- ✓ Deleted release-scaffold agent and documentation
- ✓ Your theme is ready for testing

### Phase 2: Testing Your Theme

Before removing the generation tooling, please test your new theme:

**Choose your validation level:**

**Quick Validation** (Recommended for getting started)
- Install theme in WordPress
- Activate successfully
- Run `npm run build` without errors
- Check browser console for errors

**Full Validation** (Recommended before production)
- Everything in Quick Validation
- Run `npm test` successfully
- Run `npm run lint` successfully
- Create and verify sample content works

### Phase 3: Final Cleanup (Your Confirmation Required)

Once you've completed your chosen validation:

**Me:** "Which validation did you complete: Quick or Full?"

**User:** "Quick" or "Full"

**Me:** "Great! I'll now remove the generation tooling from your theme:
- Generation agent and documentation
- Mustache schema and validation test
- Generation logs
- Generator script

After this cleanup, your theme will be completely independent from the scaffold.

**Proceed with cleanup?** (yes/no)"

**User:** "yes"

**Me:** *Deletes Phase 2 files*

"✅ **Cleanup complete!**

Your theme is now production-ready and independent from the scaffold.

**What's Next:**
- Initialize git repository if needed: `git init`
- Create your first commit: `git add . && git commit -m "Initial theme setup"`
- Start development: `npm run start`
- When ready to release, use `.github/agents/release.agent.md`

Would you like help with any of these steps?"
```

### 6. Release Scaffold Agent Enhancement

**File:** `.github/agents/release-scaffold.agent.md`

Add comprehensive validation gates before allowing scaffold releases.

**New Pre-Release Workflow:**

```markdown
## Enhanced Pre-Release Workflow

1. **Confirm target version**
   - Read VERSION file
   - Confirm version format (SemVer)

2. **Mustache Integrity Check**
   - Run: `grep -R "{{" style.css functions.php theme.json inc patterns templates parts`
   - Verify critical variables present
   - Flag any missing placeholders

3. **Schema Validation** (NEW)
   - Run: `node scripts/test-mustache-schema.js`
   - **BLOCK RELEASE** if validation fails
   - Ensure schema synced with codebase

4. **Meta Version Alignment**
   - Check VERSION, package.json, composer.json match
   - Update only these files if needed
   - Never modify WordPress template files

5. **Quality Gates (dry-run)**
   - `npm run lint:dry-run`
   - `npm run format -- --check`
   - `npm run test:dry-run:all`
   - `npm audit --audit-level=high`

6. **Generation Smoke Test** (Enhanced)
   - Run generation with test values:
     ```bash
     node scripts/generate-theme.js \
       --slug "scaffold-release-test" \
       --name "Scaffold Release Test" \
       --author "Scaffold QA" \
       --author_uri "https://example.com" \
       --version "1.0.0"
     ```
   - Verify output has NO `{{...}}` placeholders
   - Run in generated theme:
     - `cd generated-theme`
     - `npm install`
     - `npm run build`
   - Clean up test output: `rm -rf generated-theme`

7. **Release Readiness Report**
   - Summarize all validation results
   - List blockers (must fix)
   - List warnings (should fix)
   - Provide next steps

**Validation Criteria:**

**Critical (must pass):**
- ✅ Mustache integrity confirmed
- ✅ Schema validation passes
- ✅ Meta versions aligned (SemVer)
- ✅ Dry-run lint/format/test pass
- ✅ CHANGELOG entry exists
- ✅ Generation smoke test passes (no placeholders in output)
- ✅ No high/critical npm vulnerabilities

**Important (should pass):**
- Documentation current
- Release templates still templated
- Dependencies not deprecated
```

### 7. Workflow Cleanup

**Action:** Delete `.github/workflows/agent-generate-theme.yml`

**Reason:** Theme generation is a local operation. No CI workflow is needed.

### 8. Documentation Updates

**Files requiring logging documentation:**

**`.github/agents/generate-theme.agent.md`**
- Add to "How I Work" section:
  ```markdown
  5. **Log Generation** — I'll create a log file at `logs/generate-theme-{{slug}}.log`
  ```
- Add to "Related Files" section:
  ```markdown
  - [Generation Logs](../../logs/)
  - [Mustache Variables Schema](../schemas/mustache-variables-registry.schema.json)
  ```

**`.github/instructions/generate-theme.instructions.md`**
- Add new section: "Logging Behavior"
  ```markdown
  ## Logging Behavior

  Every theme generation creates a JSON log file at `logs/generate-theme-{{slug}}.log`.

  Logs include:
  - Timestamp
  - Theme slug
  - Success/failure status
  - All mustache variables used
  - Validation results

  Logs are appended (multiple generation attempts are tracked).

  Logs are deleted during Phase 2 cleanup after user confirms theme works.
  ```

**`.github/prompts/generate-theme.prompt.md`**
- Add to post-generation summary:
  ```markdown
  📝 **Generation log:** `logs/generate-theme-{{slug}}.log`
  ```

**`docs/GENERATE_THEME.md`**
- Add new section after "Mustache Template System":
  ```markdown
  ## Generation Logging

  Each theme generation creates a JSON log file for tracking and debugging.

  ### Log Location

  `logs/generate-theme-{{slug}}.log`

  ### Log Format

  ```json
  {
    "timestamp": "2025-12-12T10:30:45.123Z",
    "slug": "safari-lodge",
    "status": "success",
    "variables": { ... },
    "validation": { ... },
    "outputPath": "./generated-theme"
  }
  ```

  ### Log Lifecycle

  - Created during theme generation
  - Appended for multiple generation attempts
  - Deleted during Phase 2 cleanup after theme validation
  ```

## File Changes Summary

### New Files

1. `scripts/lib/logger.js` - Logging utility module
2. `.github/schemas/mustache-variables-registry.schema.json` - Mustache variables schema
3. `scripts/test-mustache-schema.js` - Schema validation test
4. `logs/.gitkeep` - Preserve logs directory in git (already exists)

### Modified Files

1. `scripts/generate-theme.js`
   - Add logging imports and calls
   - Add Phase 1 cleanup (delete scaffold release files)

2. `.github/agents/generate-theme.agent.md`
   - Add Stage 5: Theme Validation & Cleanup
   - Document two-phase cleanup flow
   - Add logging to "How I Work"
   - Update "Related Files"

3. `.github/instructions/generate-theme.instructions.md`
   - Add "Logging Behavior" section

4. `.github/prompts/generate-theme.prompt.md`
   - Add log file to post-generation summary

5. `docs/GENERATE_THEME.md`
   - Add "Generation Logging" section

6. `.github/agents/release-scaffold.agent.md`
   - Add schema validation step
   - Enhance generation smoke test
   - Update validation criteria

### Deleted Files

1. `.github/workflows/agent-generate-theme.yml` - Workflow no longer needed

### Phase 1 Deleted Files (from generated themes)

1. `.github/agents/release-scaffold.agent.md`
2. `.github/prompts/release-scaffold.prompt.md`
3. `.github/instructions/release-scaffold.instructions.md`
4. `docs/RELEASE_PROCESS_SCAFFOLD.md`

### Phase 2 Deleted Files (after user confirms theme works)

1. `.github/agents/generate-theme.agent.md`
2. `.github/prompts/generate-theme.prompt.md`
3. `.github/instructions/generate-theme.instructions.md`
4. `docs/GENERATE_THEME.md`
5. `.github/schemas/mustache-variables-registry.schema.json`
6. `scripts/test-mustache-schema.js`
7. `scripts/lib/logger.js`
8. `logs/` directory (entire directory)
9. `scripts/generate-theme.js`

## Implementation Notes

### Logging Implementation

**Logger Module Structure:**
```javascript
// scripts/lib/logger.js
const fs = require('fs');
const path = require('path');

function ensureLogsDirectory() {
  const logsDir = path.resolve(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  return logsDir;
}

function createLogEntry(slug, status, variables, validation, outputPath, error = null) {
  return {
    timestamp: new Date().toISOString(),
    slug,
    status,
    variables,
    validation,
    outputPath,
    error
  };
}

function writeLog(slug, logEntry) {
  const logsDir = ensureLogsDirectory();
  const logFile = path.join(logsDir, `generate-theme-${slug}.log`);

  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(logFile, logLine, 'utf8');
}

module.exports = { createLogEntry, writeLog };
```

**Integration in generate-theme.js:**
```javascript
const { createLogEntry, writeLog } = require('./lib/logger');

// At start of generation
const logEntry = createLogEntry(slug, 'started', variables, { passed: false }, outputDir);
writeLog(slug, logEntry);

// On success
const successEntry = createLogEntry(slug, 'success', variables, validation, outputDir);
writeLog(slug, successEntry);

// On failure
const errorEntry = createLogEntry(slug, 'failure', variables, validation, outputDir, error.message);
writeLog(slug, errorEntry);
```

### Schema Validation Test Structure

```javascript
// scripts/test-mustache-schema.js
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const { execSync } = require('child_process');

// Level 1: Validate schema structure
function validateSchemaStructure(schemaPath) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const ajv = new Ajv();
  const metaSchema = require('ajv/lib/refs/json-schema-draft-07.json');
  const validate = ajv.compile(metaSchema);
  const valid = validate(schema);

  return { valid, errors: validate.errors };
}

// Level 2: Check known variables
function validateKnownVariables(schema) {
  const knownVariables = [
    'slug', 'name', 'namespace', 'textdomain', 'author', 'author_uri',
    'version', 'description', 'license', 'license_uri', 'min_wp_version',
    'tested_wp_version', 'min_php_version', 'primary_color', 'secondary_color',
    'background_color', 'text_color', 'font_family', 'heading_font',
    'hero_title', 'cta_text', 'footer_text'
  ];

  const schemaProps = Object.keys(schema.properties || {});
  const missing = knownVariables.filter(v => !schemaProps.includes(v));
  const extra = schemaProps.filter(v => !knownVariables.includes(v));

  return { missing, extra };
}

// Level 3: Scan codebase for mustache patterns
function scanCodebaseForMustache() {
  const excludeDirs = 'node_modules|vendor|\\.git|generated-theme';
  const grepCmd = `grep -roh "{{[^}]*}}" . --exclude-dir={${excludeDirs}} || true`;

  try {
    const output = execSync(grepCmd, { encoding: 'utf8' });
    const matches = output.match(/{{([^}]+)}}/g) || [];
    const variables = [...new Set(matches.map(m => m.replace(/{{|}}/g, '')))];
    return variables;
  } catch (error) {
    return [];
  }
}

function validateRegistrySync(schema, codebaseVariables) {
  const schemaProps = Object.keys(schema.properties || {});
  const undocumented = codebaseVariables.filter(v => !schemaProps.includes(v));
  return undocumented;
}

// Main execution
function main() {
  let exitCode = 0;

  // Level 1
  const schemaResult = validateSchemaStructure('.github/schemas/mustache-variables-registry.schema.json');
  if (!schemaResult.valid) {
    console.error('✗ Schema structure invalid');
    exitCode = 1;
  } else {
    console.log('✓ Schema structure valid');
  }

  // Level 2
  const schema = require('../.github/schemas/mustache-variables-registry.schema.json');
  const knownResult = validateKnownVariables(schema);
  if (knownResult.missing.length > 0 || knownResult.extra.length > 0) {
    console.warn('⚠ Known variables mismatch');
    if (knownResult.missing.length) console.warn('  Missing:', knownResult.missing);
    if (knownResult.extra.length) console.warn('  Extra:', knownResult.extra);
  } else {
    console.log('✓ Known variables match schema');
  }

  // Level 3
  const codebaseVars = scanCodebaseForMustache();
  const undocumented = validateRegistrySync(schema, codebaseVars);
  if (undocumented.length > 0) {
    console.error('✗ Registry sync failed');
    console.error('  Undocumented variables:', undocumented);
    exitCode = 1;
  } else {
    console.log(`✓ Registry synced with codebase (${codebaseVars.length} variables found)`);
  }

  if (exitCode === 0) {
    console.log('\nAll validation checks passed!');
  } else {
    console.error('\nValidation failed');
  }

  process.exit(exitCode);
}

main();
```

## Testing Strategy

### Manual Testing

1. **Test logging:**
   - Run `node scripts/generate-theme.js --slug test-theme --name "Test" --author "Test"`
   - Verify log created at `logs/generate-theme-test-theme.log`
   - Verify JSON format and content
   - Run again, verify appending works

2. **Test schema validation:**
   - Run `node scripts/test-mustache-schema.js`
   - Verify all three validation levels pass
   - Add undocumented `{{test_var}}` to a file
   - Verify Level 3 fails and reports location

3. **Test two-phase cleanup:**
   - Generate test theme
   - Verify Phase 1 files deleted immediately
   - Follow agent prompts through validation
   - Confirm Phase 2 files deleted after user confirmation

4. **Test release-scaffold agent:**
   - Follow agent workflow for scaffold release
   - Verify schema validation runs
   - Verify generation smoke test executes
   - Verify all quality gates check

### Automated Testing

Add to `package.json` scripts:
```json
{
  "scripts": {
    "test:schema": "node scripts/test-mustache-schema.js"
  }
}
```

Integrate into existing CI workflows:
- Run schema validation in code-quality workflow
- Run generation smoke test in CI workflow

## Success Criteria

1. ✅ Logger creates JSON log files per project
2. ✅ Schema documents all mustache variables
3. ✅ Validation test passes all three levels
4. ✅ Phase 1 cleanup removes scaffold release files immediately
5. ✅ Phase 2 cleanup removes generator tooling after user confirmation
6. ✅ Release-scaffold agent includes schema validation and smoke test
7. ✅ Workflow file deleted
8. ✅ All documentation updated with logging information
9. ✅ Generated themes are clean and independent
10. ✅ Scaffold releases have comprehensive quality gates

## Future Enhancements

1. **Verbose logging option** - Add `--verbose` flag for detailed file operation logging
2. **Schema auto-discovery** - Auto-update schema when new variables added to codebase
3. **Cleanup scripts** - Standalone scripts for Phase 1 and Phase 2 cleanup
4. **Log analysis** - Tool to analyze generation logs and identify common issues
5. **Variable usage report** - Show which mustache variables are used where

## Related Documentation

- [Generate Theme Documentation](../GENERATE_THEME.md)
- [Release Scaffold Process](../RELEASE_PROCESS_SCAFFOLD.md)
- [Release Process](../RELEASE_PROCESS.md)
- [Validation Guide](../VALIDATION.md)
