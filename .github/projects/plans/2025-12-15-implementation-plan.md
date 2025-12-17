# Implementation Plan: Generator Logging, Schema Validation & Cleanup

**Date:** 2025-12-15
**Based On:** [2025-12-12-generator-logging-schema-cleanup-design.md](2025-12-12-generator-logging-schema-cleanup-design.md)
**Total Tasks:** 35 tasks across 6 phases

## Executive Summary

This plan breaks down the implementation of generator logging, mustache schema validation, and two-phase cleanup into 6 logical phases with 35 discrete tasks. The implementation will add comprehensive tracking, validation, and cleanup to the block theme generator system while maintaining backward compatibility.

## Phase 1: Core Infrastructure (Logger & Schema Foundation)

**Goal:** Build the foundational logging and schema infrastructure without modifying existing generator behavior.

### Task 1.1: Create Logger Module
**File:** `scripts/lib/logger.js` (NEW)

**Implementation Details:**
- Create module with 3 exported functions: `ensureLogsDirectory()`, `createLogEntry()`, `writeLog()`
- Use Node.js `fs` and `path` modules (already available)
- Log entry format must match design spec (JSON with timestamp, slug, status, variables, validation, outputPath, error)
- Append mode for multiple generation attempts
- Auto-create logs directory if missing

**Dependencies:** None

**Testing:**
```bash
# Manual test
node -e "const {createLogEntry, writeLog} = require('./scripts/lib/logger'); const entry = createLogEntry('test', 'success', {}, {passed: true}, './out'); writeLog('test', entry); console.log('Test passed');"
ls logs/generate-theme-test.log
```

**Validation:** Logger creates valid JSON entries, appends correctly, creates directory

---

### Task 1.2: Create Mustache Variables Schema
**File:** `.github/schemas/mustache-variables-registry.schema.json` (NEW)

**Implementation Details:**
Document all mustache variables found in templates with:
- Core: slug, name, namespace, textdomain, author, author_uri, version, description, license, license_uri
- Versions: min_wp_version, tested_wp_version, min_php_version
- Design tokens: primary_color, secondary_color, background_color, text_color
- Typography: font_family, heading_font
- Content: hero_title, cta_text, footer_text

**Schema Structure:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://github.com/lightspeedwp/block-theme-scaffold/schemas/mustache-variables-registry",
  "title": "Mustache Variables Registry",
  "description": "Registry of all mustache template variables",
  "type": "object",
  "properties": {
    "slug": {
      "type": "string",
      "description": "Theme slug (lowercase, hyphens)",
      "pattern": "^[a-z0-9-]{2,}$",
      "examples": ["tour-operator", "safari-lodge"]
    }
    // ... all variables with validation patterns
  },
  "required": ["slug", "name", "author"],
  "additionalProperties": false
}
```

**Dependencies:** None

**Testing:**
```bash
# Validate schema is valid JSON
cat .github/schemas/mustache-variables-registry.schema.json | jq .
```

**Validation:** Schema file is valid JSON Schema draft-07 format

---

### Task 1.3: Create Schema Validation Test
**File:** `scripts/test-mustache-schema.js` (NEW)

**Implementation Details:**
- Level 1: Schema structure validation using Ajv (already in devDependencies: "ajv": "8.17.1")
- Level 2: Known variables validation (hardcoded list vs schema properties)
- Level 3: Registry sync validation (grep codebase for {{...}} patterns, compare to schema)
- Exit codes: 0 = pass, 1 = fail
- Exclude directories: node_modules, vendor, .git, generated-theme, dist, logs

**Code Structure:**
```javascript
const Ajv = require('ajv');
const { execSync } = require('child_process');

// Level 1: validateSchemaStructure()
// Level 2: validateKnownVariables()
// Level 3: scanCodebaseForMustache() + validateRegistrySync()
// main() - orchestrate all three levels
```

**Dependencies:** Task 1.2 (schema must exist)

**Testing:**
```bash
node scripts/test-mustache-schema.js
# Should pass all 3 levels

# Test failure detection
echo '{{undocumented_var}}' >> test-file.php
node scripts/test-mustache-schema.js
# Should fail Level 3
rm test-file.php
```

**Validation:** All 3 validation levels execute, exit codes correct, error reporting clear

---

## Phase 2: Generator Integration (Logging + Phase 1 Cleanup)

**Goal:** Integrate logging into generate-theme.js and implement Phase 1 cleanup without breaking existing functionality.

### Task 2.1: Add Logging to generate-theme.js (Start)
**File:** `scripts/generate-theme.js` (MODIFY)

**Modifications:**
1. Add import at top (after line 25):
```javascript
const { createLogEntry, writeLog } = require('./lib/logger');
```

2. Add logging at generation start (in `main()` function around line 567):
```javascript
// Log generation start
const startEntry = createLogEntry(
  placeholders['{{slug}}'],
  'started',
  placeholders,
  { passed: false, errors: [], warnings: [] },
  outputDir,
  null
);
writeLog(placeholders['{{slug}}'], startEntry);
```

**Dependencies:** Task 1.1 (logger must exist)

**Testing:** Run generation and verify log file created with "started" status

**Validation:** Log file created at `logs/generate-theme-{slug}.log` with started entry

---

### Task 2.2: Add Logging to generate-theme.js (Success & Error)
**File:** `scripts/generate-theme.js` (MODIFY)

**Modifications:**
1. Add success logging (after "Theme generated successfully!" message):
```javascript
// Log generation success
const successEntry = createLogEntry(
  placeholders['{{slug}}'],
  'success',
  placeholders,
  { passed: true, errors: [], warnings: [] },
  outputDir,
  null
);
writeLog(placeholders['{{slug}}'], successEntry);
```

2. Wrap try-catch error logging:
```javascript
} catch (error) {
  // Log generation failure
  const errorEntry = createLogEntry(
    placeholders['{{slug}}'] || 'unknown',
    'failure',
    placeholders,
    { passed: false, errors: [error.message], warnings: [] },
    outputDir,
    error.message
  );
  writeLog(placeholders['{{slug}}'] || 'unknown', errorEntry);

  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
```

**Dependencies:** Task 2.1

**Testing:**
- Test success: Generate valid theme, check log has success entry
- Test failure: Generate with invalid input, check log has failure entry

**Validation:** Both success and failure paths create log entries

---

### Task 2.3: Implement Phase 1 Cleanup in generate-theme.js
**File:** `scripts/generate-theme.js` (MODIFY)

**Modifications:**
Add Phase 1 cleanup immediately after successful generation:

```javascript
// Phase 1 Cleanup: Delete scaffold-specific release files
const phase1Files = [
  '.github/agents/release-scaffold.agent.md',
  '.github/prompts/release-scaffold.prompt.md',
  '.github/instructions/release-scaffold.instructions.md',
  'docs/RELEASE_PROCESS_SCAFFOLD.md'
];

console.log('\n🧹 Phase 1 Cleanup: Removing scaffold-specific files...');
let cleanupCount = 0;
for (const file of phase1Files) {
  const filePath = path.join(outputDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    cleanupCount++;
    console.log(`  ✓ Deleted: ${file}`);
  }
}
console.log(`✓ Phase 1 cleanup complete (${cleanupCount} files removed)\n`);
```

**Dependencies:** Task 2.2

**Testing:**
```bash
node scripts/generate-theme.js --slug test-cleanup --name "Test" --author "Test" --author_uri "https://example.com"
# Verify Phase 1 files deleted from generated-theme/
ls generated-theme/.github/agents/release-scaffold.agent.md # Should not exist
ls generated-theme/.github/agents/release.agent.md # Should exist
```

**Validation:** Phase 1 files deleted, Phase 2 files remain

---

## Phase 3: Documentation Updates

**Goal:** Document logging and cleanup in all relevant documentation files.

### Task 3.1: Update generate-theme.agent.md
**File:** `.github/agents/generate-theme.agent.md` (MODIFY)

**Modifications:**

1. Update "How I Work" section (around line 12):
```markdown
4. **Log Generation** — I'll create a log file at `logs/generate-theme-{{slug}}.log`
```

2. Add Stage 5 at end (after existing stages):
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

Once you've completed your chosen validation, I'll ask:

**Me:** "Which validation did you complete: Quick or Full?"

**User:** "Quick" or "Full"

**Me:** "Great! I'll now remove the generation tooling from your theme. After this cleanup, your theme will be completely independent from the scaffold. **Proceed with cleanup?** (yes/no)"

**User:** "yes"

**Me:** *Deletes Phase 2 files*

"✅ **Cleanup complete!** Your theme is now production-ready."
```

3. Add to "Related Files" section:
```markdown
- [Generation Logs](../../logs/)
- [Mustache Variables Schema](../schemas/mustache-variables-registry.schema.json)
```

**Dependencies:** None

**Testing:** Read through updated agent to ensure flow makes sense

**Validation:** Agent documentation complete and accurate

---

### Task 3.2: Update generate-theme.instructions.md
**File:** `.github/instructions/generate-theme.instructions.md` (MODIFY)

**Modifications:**
Add new section after existing content:

```markdown
## Logging Behavior

Every theme generation creates a JSON log file at `logs/generate-theme-{{slug}}.log`.

Logs include:
- Timestamp (ISO 8601 format)
- Theme slug
- Success/failure status
- All mustache variables used
- Validation results summary
- Output path
- Error details (if failure)

Logs are appended (multiple generation attempts are tracked).
Logs are deleted during Phase 2 cleanup after user confirms theme works.

## Two-Phase Cleanup

### Phase 1: Immediate Deletion (Automatic)

The generator automatically deletes these scaffold-specific files:
- `.github/agents/release-scaffold.agent.md`
- `.github/prompts/release-scaffold.prompt.md`
- `.github/instructions/release-scaffold.instructions.md`
- `docs/RELEASE_PROCESS_SCAFFOLD.md`

### Phase 2: Confirmed Deletion (User Confirmation Required)

After user validates the theme, the agent will delete generation tooling including the generator script, schema, logs, and documentation.
```

**Dependencies:** None

**Testing:** Review for clarity and completeness

**Validation:** Instructions accurate and helpful

---

### Task 3.3: Update generate-theme.prompt.md
**File:** `.github/prompts/generate-theme.prompt.md` (MODIFY)

**Modifications:**
Add to post-generation summary section:

```markdown
📝 **Generation log:** `logs/generate-theme-{{slug}}.log`

This log tracks all variables used, validation results, and any errors.
The log will be deleted during Phase 2 cleanup after you confirm the theme is working.
```

**Dependencies:** None

**Testing:** Review prompt flow

**Validation:** Prompt includes logging reference

---

### Task 3.4: Update GENERATE_THEME.md
**File:** `docs/GENERATE_THEME.md` (MODIFY)

**Modifications:**
Add new sections after "Mustache Template System":

```markdown
## Generation Logging

Each theme generation creates a JSON log file at `logs/generate-theme-{{slug}}.log`.

### Log Format

```json
{
  "timestamp": "2025-12-15T10:30:45.123Z",
  "slug": "safari-lodge",
  "status": "success",
  "variables": { "slug": "safari-lodge", "name": "Safari Lodge", ... },
  "validation": { "passed": true, "errors": [], "warnings": [] },
  "outputPath": "./generated-theme",
  "error": null
}
```

### Log Lifecycle

- Created during generation (status: "started")
- Updated on success or failure
- Appended for multiple attempts
- Deleted during Phase 2 cleanup

## Schema Validation

All mustache variables are documented in `.github/schemas/mustache-variables-registry.schema.json`.

### Validate Schema

```bash
node scripts/test-mustache-schema.js
```

Performs three levels of validation:
1. Schema structure - Validates JSON Schema is well-formed
2. Known variables - Ensures expected variables documented
3. Registry sync - Scans codebase for undocumented variables

## Two-Phase Cleanup

### Phase 1: Immediate (Automatic)
Deletes scaffold-specific release files after successful generation.

### Phase 2: Confirmed (User Required)
After validation, deletes generation tooling to make theme independent.

**Validation Options:**
- Quick: Install, activate, build, check console
- Full: Quick + tests + linting + sample content
```

**Dependencies:** None

**Testing:** Review documentation for accuracy

**Validation:** Documentation complete and well-organized

---

## Phase 4: Release Scaffold Agent Enhancement

**Goal:** Add schema validation and enhanced smoke testing to scaffold release process.

### Task 4.1: Add Schema Validation Step to release-scaffold.agent.md
**File:** `.github/agents/release-scaffold.agent.md` (MODIFY)

**Modifications:**

Update Workflow section (around line 46):
```markdown
3. **Schema validation (NEW):**
   - Run: `node scripts/test-mustache-schema.js`
   - **BLOCK RELEASE** if validation fails
   - Ensure schema synced with codebase
```

Update Commands section (around line 80):
```markdown
- **Schema validation:** `node scripts/test-mustache-schema.js`
```

Update Generation smoke test:
```markdown
7. **Generation smoke test (enhanced):**
   - Run generation with test values
   - Verify Phase 1 cleanup deleted scaffold-only files
   - Check log file created at `logs/generate-theme-{slug}.log`
   - Run `npm install && npm run build` in output
```

Update Validation Criteria:
```markdown
**Critical (must pass):**
- ✅ **Schema validation passes** (NEW)
- ✅ **Phase 1 cleanup verified** (NEW)
- ✅ **Generation log created** (NEW)
```

**Dependencies:** Tasks 1.2, 1.3, 2.3

**Testing:** Follow release-scaffold workflow to verify new steps

**Validation:** Release process includes all new validation steps

---

## Phase 5: Workflow Cleanup & NPM Script Addition

**Goal:** Remove unnecessary workflow file and add schema validation to npm scripts.

### Task 5.1: Delete agent-generate-theme.yml Workflow
**File:** `.github/workflows/agent-generate-theme.yml` (DELETE)

**Rationale:** Theme generation is local-only operation.

**Implementation:** Delete the file.

**Dependencies:** None

**Testing:**
```bash
grep -r "agent-generate-theme" .github/ docs/
```

**Validation:** File deleted, no references remain

---

### Task 5.2: Add Schema Validation NPM Script
**File:** `package.json` (MODIFY)

**Modifications:**
Add to scripts section:

```json
"test:schema": "node scripts/test-mustache-schema.js",
"validate:mustache": "node scripts/test-mustache-schema.js"
```

**Dependencies:** Task 1.3

**Testing:**
```bash
npm run test:schema
npm run validate:mustache
```

**Validation:** Both scripts execute validation successfully

---

## Phase 6: Integration Testing & Validation

**Goal:** Comprehensive testing of the complete system integration.

### Task 6.1: End-to-End Generation Test
**Test Steps:**
```bash
# Clean state
rm -rf generated-theme logs/

# Run generation
node scripts/generate-theme.js \
  --slug "e2e-test-theme" \
  --name "E2E Test Theme" \
  --author "Test Author" \
  --author_uri "https://test.example.com" \
  --version "1.0.0"

# Verify log created
cat logs/generate-theme-e2e-test-theme.log | jq .

# Verify Phase 1 cleanup
test ! -f generated-theme/.github/agents/release-scaffold.agent.md && echo "✓ Phase 1 cleanup verified"

# Verify theme files intact
test -f generated-theme/.github/agents/release.agent.md && echo "✓ Release agent preserved"

# Verify no mustache variables
grep -r "{{" generated-theme/style.css generated-theme/functions.php || echo "✓ All variables replaced"

# Test build
cd generated-theme && npm install && npm run build && cd ..

# Cleanup
rm -rf generated-theme logs/
```

**Dependencies:** All previous tasks

**Validation:** All steps pass, no errors

---

### Task 6.2: Schema Validation Test
**Test Steps:**
```bash
# Schema validation should pass
npm run test:schema

# Add undocumented variable
echo '{{undocumented_test_var}}' >> templates/index.html

# Should fail
npm run test:schema && echo "✗ Should have failed" || echo "✓ Correctly detected"

# Cleanup
git checkout templates/index.html
npm run test:schema
```

**Dependencies:** Tasks 1.2, 1.3, 5.2

**Validation:** Schema validation detects undocumented variables

---

### Task 6.3: Multiple Generation Attempts Test
**Test Steps:**
```bash
# Clean logs
rm -rf logs/

# First generation
node scripts/generate-theme.js --slug "multi-test" --name "Test 1" --author "Author" --author_uri "https://example.com"
rm -rf generated-theme

# Second generation (same slug)
node scripts/generate-theme.js --slug "multi-test" --name "Test 2" --author "Author" --author_uri "https://example.com"

# Verify two entries
ENTRIES=$(cat logs/generate-theme-multi-test.log | wc -l)
[ "$ENTRIES" -eq 2 ] && echo "✓ Multiple generations logged" || echo "✗ Expected 2 entries"

# Cleanup
rm -rf generated-theme logs/
```

**Dependencies:** Tasks 1.1, 2.1, 2.2

**Validation:** Log file contains multiple entries

---

### Task 6.4: Error Handling Test
**Test Steps:**
```bash
# Clean logs
rm -rf logs/

# Trigger error (missing required field)
node scripts/generate-theme.js --slug "error-test" 2>/dev/null || true

# Verify error logged
grep -q '"status":"failure"' logs/generate-theme-error-test.log && echo "✓ Error logged" || echo "✗ Error not logged"

# Cleanup
rm -rf logs/
```

**Dependencies:** Task 2.2

**Validation:** Errors are logged with failure status

---

### Task 6.5: Release Scaffold Smoke Test
**Test Steps:**
```bash
# Run schema validation
npm run test:schema

# Run generation smoke test
node scripts/generate-theme.js \
  --slug "scaffold-release-test" \
  --name "Scaffold Release Test" \
  --author "Scaffold QA" \
  --author_uri "https://example.com" \
  --version "1.0.0"

# Verify cleanup and logging
test ! -f generated-theme/.github/agents/release-scaffold.agent.md && echo "✓ Scaffold files cleaned"
test -f logs/generate-theme-scaffold-release-test.log && echo "✓ Log created"

# Test build
cd generated-theme && npm install && npm run build && cd ..

# Cleanup
rm -rf generated-theme logs/
```

**Dependencies:** All previous tasks

**Validation:** Full release validation workflow passes

---

## Implementation Sequence

### Critical Path
1. **Phase 1** (Tasks 1.1 → 1.2 → 1.3) - Foundation first
2. **Phase 2** (Tasks 2.1 → 2.2 → 2.3) - Generator integration
3. **Phase 3** (Tasks 3.1-3.4) - Documentation (can be parallel)
4. **Phase 4** (Task 4.1) - Release agent
5. **Phase 5** (Tasks 5.1, 5.2) - Cleanup (can be parallel)
6. **Phase 6** (Tasks 6.1-6.5) - Testing

### Parallel Opportunities
- Tasks 3.1, 3.2, 3.3, 3.4 (documentation)
- Tasks 5.1, 5.2 (cleanup)

### Recommended Order
1. Phase 1 (foundational)
2. Phase 2 (integration)
3. Phase 3 + Phase 5 (docs and cleanup)
4. Phase 4 (release agent)
5. Phase 6 (testing)

---

## Risk Mitigation

**Risk 1: Breaking Existing Generator**
- Add changes incrementally
- Test after each modification
- Maintain CLI argument compatibility

**Risk 2: Schema Drift**
- Run validation in CI
- Include in pre-commit hooks
- Block releases if invalid

**Risk 3: Incomplete Documentation**
- Cross-reference all variable usage
- Level 3 validation catches undocumented vars
- Schema validation gate in release process

**Risk 4: Log Accumulation**
- Per-project files (one per slug)
- Deleted in Phase 2 cleanup
- Already in .gitignore

---

## Success Criteria

### Functional Requirements
- [x] Logger creates JSON log files
- [x] Schema documents all variables
- [x] Validation performs 3 levels
- [x] Phase 1 cleanup removes 4 files
- [x] Phase 2 cleanup removes 9 files
- [x] Release includes schema validation
- [x] Workflow file deleted

### Quality Requirements
- [x] All documentation updated
- [x] No breaking changes
- [x] Schema validation in CI
- [x] Clear error messages
- [x] Valid JSON logs

### Testing Requirements
- [x] E2E generation test passes
- [x] Schema validation catches undocumented vars
- [x] Multiple attempts log correctly
- [x] Error handling logs failures
- [x] Release smoke test passes

---

## Post-Implementation

1. Update CHANGELOG.md
2. Create example log file in docs/examples/
3. Add schema validation to CI workflow
4. Update README.md
5. Create screencast of cleanup flow
6. Add troubleshooting section

---

## Critical Files

1. `scripts/generate-theme.js` - Core generator (~100 lines changes)
2. `scripts/lib/logger.js` - NEW logging module (~60 lines)
3. `.github/schemas/mustache-variables-registry.schema.json` - NEW schema (~250 lines)
4. `scripts/test-mustache-schema.js` - NEW validation test (~200 lines)
5. `.github/agents/generate-theme.agent.md` - Agent updates (~100 lines added)
