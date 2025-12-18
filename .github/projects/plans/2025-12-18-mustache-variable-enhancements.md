---
title: Mustache Variable Enhancements
category: Developer Experience
status: Draft
created: 2025-12-18
audience: Developers, Theme Contributors
---

# Mustache Variable Enhancements

## Objective

Enhance the mustache variable scanning and registry system to improve detection, validation, tracking, and reporting of template variables across the codebase.

## Background

The current mustache scanning system ([scripts/utils/scan.js](scripts/utils/scan.js)) scans the codebase for `{{variable}}` placeholders and maintains a registry ([scripts/mustache-variables-registry.json](scripts/mustache-variables-registry.json)). This plan adds:

1. Detection of unused/undocumented variables
2. Usage context tracking (file paths and line numbers)
3. Custom ignore pattern support via `.mustacheignore`
4. Variable type/format inference
5. Registry change reporting
6. CI/pre-commit integration for validation

## Implementation Steps

### 1. Detect Unused/Undocumented Variables

**Goal**: Flag variables that exist in code but not in registry, and vice versa.

**Tasks**:
- [ ] Update [scripts/utils/scan.js](scripts/utils/scan.js:42) to track two sets:
  - `variablesInCode`: All `{{variable}}` found in scanned files
  - `variablesInRegistry`: All variables defined in registry
- [ ] Add comparison logic after scan completes:
  - `undocumented = variablesInCode - variablesInRegistry`
  - `unused = variablesInRegistry - variablesInCode`
- [ ] Add fields to registry output:
  ```json
  {
    "variables": { ... },
    "meta": {
      "undocumented": ["var1", "var2"],
      "unused": ["var3", "var4"],
      "scannedAt": "2025-12-18T12:00:00Z"
    }
  }
  ```
- [ ] Add summary output to console after scan

**Files Modified**:
- [scripts/utils/scan.js](scripts/utils/scan.js)
- [scripts/mustache-variables-registry.json](scripts/mustache-variables-registry.json)

**Validation**:
- Run `node scripts/utils/scan.js` and verify undocumented/unused lists
- Add test case with intentionally undocumented variable

---

### 2. Track Variable Usage Context

**Goal**: Record all locations (file:line) where each variable appears.

**Tasks**:
- [ ] Update scan logic to track usage locations:
  ```javascript
  const variableUsage = new Map();
  // For each match: variableUsage.get(varName).push({ file, line })
  ```
- [ ] Modify registry output format:
  ```json
  {
    "theme_name": {
      "value": "My Theme",
      "usage": [
        { "file": "style.css", "line": 3 },
        { "file": "functions.php", "line": 12 }
      ]
    }
  }
  ```
- [ ] Add `--show-usage` CLI flag to display usage context in scan output
- [ ] Update [scripts/utils/update-mustache-registry.js](scripts/utils/update-mustache-registry.js) to preserve usage data

**Files Modified**:
- [scripts/utils/scan.js](scripts/utils/scan.js:68)
- [scripts/utils/update-mustache-registry.js](scripts/utils/update-mustache-registry.js)

**Validation**:
- Verify usage array contains correct file paths and line numbers
- Test with variable used in multiple files

---

### 3. Support for Custom Ignore Patterns

**Goal**: Allow developers to exclude files/folders via `.mustacheignore`.

**Status**: ✅ **PARTIALLY IMPLEMENTED** (see [scripts/utils/scan.js:45-66](scripts/utils/scan.js#L45-L66))

**Tasks**:
- [x] Add `.mustacheignore` file support to scan.js
- [x] Load patterns from `.mustacheignore` at repo root
- [ ] Add documentation to [README.md](README.md) about `.mustacheignore` usage
- [ ] Add example `.mustacheignore.example` with common patterns:
  ```
  # .mustacheignore.example
  node_modules/**
  vendor/**
  build/**
  dist/**
  .git/**
  tests/fixtures/**
  scripts/mustache-variables-registry.json
  ```
- [ ] Add test case for custom ignore patterns

**Files Modified**:
- [scripts/utils/scan.js](scripts/utils/scan.js) (already done)
- [.mustacheignore](.mustacheignore) (exists)
- `.mustacheignore.example` (new)
- [README.md](README.md)

**Validation**:
- Add pattern to `.mustacheignore` and verify files are excluded
- Test glob patterns like `tests/**/*.mock.json`

---

### 4. Variable Type/Format Inference

**Goal**: Automatically infer variable types from names/usage.

**Status**: ✅ **PARTIALLY IMPLEMENTED** (see [scripts/utils/scan.js:2-15](scripts/utils/scan.js#L2-L15))

**Tasks**:
- [x] Add `inferVariableType()` helper function (already exists)
- [ ] Expand type inference rules:
  - `color`/`colour` → `color`
  - `url`/`uri`/`link` → `url`
  - `email` → `email`
  - `date`/`year` → `date`
  - `font`/`weight`/`line_height` → `font`
  - `image`/`thumbnail`/`icon` → `image`
  - `version` → `version`
  - `slug` → `slug`
  - `is_*`/`has_*`/`enable_*` → `boolean`
  - `*_count`/`*_width`/`*_size` → `number`
  - Default: `string`
- [ ] Add inferred type to registry:
  ```json
  {
    "primary_color": {
      "value": "#007bff",
      "type": "color",
      "inferred": true
    }
  }
  ```
- [ ] Add `--show-types` CLI flag to display types in scan output
- [ ] Allow manual type override in registry (set `inferred: false`)

**Files Modified**:
- [scripts/utils/scan.js](scripts/utils/scan.js:2-15)
- [scripts/mustache-variables-registry.json](scripts/mustache-variables-registry.json)

**Validation**:
- Test various variable names and verify correct type inference
- Add test for manual type override

---

### 5. Registry Change Reporting

**Goal**: Generate diff reports when registry is updated.

**Tasks**:
- [ ] Create [scripts/utils/registry-diff.js](scripts/utils/registry-diff.js) utility:
  - Compare old vs new registry
  - Track added/removed/modified variables
  - Output summary to stdout
- [ ] Update [scripts/utils/update-mustache-registry.js](scripts/utils/update-mustache-registry.js):
  - Load previous registry before update
  - Run diff after update
  - Save diff report to `.github/agents/reports/registry-changes-YYYY-MM-DD.md`
- [ ] Diff report format:
  ```markdown
  # Registry Changes - 2025-12-18

  ## Added Variables (3)
  - `new_var1` (string) - Found in template.php:42
  - `new_var2` (color) - Found in style.css:15

  ## Removed Variables (1)
  - `old_var` - No longer found in codebase

  ## Modified Variables (2)
  - `changed_var`: value changed from "old" to "new"
  - `type_changed`: type changed from "string" to "url"
  ```
- [ ] Add `--quiet` flag to suppress diff output

**Files Created**:
- [scripts/utils/registry-diff.js](scripts/utils/registry-diff.js)

**Files Modified**:
- [scripts/utils/update-mustache-registry.js](scripts/utils/update-mustache-registry.js)

**Validation**:
- Add/remove variables and verify diff report accuracy
- Check that reports are saved to `.github/agents/reports/`

---

### 6. CI/Pre-commit Integration

**Goal**: Fail CI/pre-commit if registry is out of sync or has issues.

**Tasks**:
- [ ] Add validation mode to scan script:
  - `node scripts/utils/scan.js --validate`
  - Exit code 1 if undocumented variables exist
  - Exit code 2 if unused variables exist
  - Exit code 3 if registry is out of sync with code
- [ ] Create [scripts/validate-mustache-registry.js](scripts/validate-mustache-registry.js):
  ```javascript
  // Load registry and scan code
  // Compare and report issues
  // Exit non-zero on validation failure
  ```
- [ ] Add npm script:
  ```json
  {
    "scripts": {
      "validate:mustache": "node scripts/validate-mustache-registry.js"
    }
  }
  ```
- [ ] Add to pre-commit hook (if using husky):
  ```bash
  npm run validate:mustache
  ```
- [ ] Add to CI workflow ([.github/workflows/test.yml](.github/workflows/test.yml)):
  ```yaml
  - name: Validate mustache registry
    run: npm run validate:mustache
  ```
- [ ] Add documentation:
  - When to run validation
  - How to fix validation errors
  - How to update registry

**Files Created**:
- [scripts/validate-mustache-registry.js](scripts/validate-mustache-registry.js)

**Files Modified**:
- [package.json](package.json)
- [.github/workflows/test.yml](.github/workflows/test.yml) (if exists)
- [README.md](README.md)

**Validation**:
- Introduce undocumented variable and verify CI fails
- Fix issue and verify CI passes

---

## Testing Strategy

### Unit Tests

**Location**: [scripts/utils/__tests__/scan.test.js](scripts/utils/__tests__/scan.test.js) (create if needed)

**Test Cases**:
- [ ] `inferVariableType()` returns correct types for various variable names
- [ ] `.mustacheignore` patterns correctly exclude files
- [ ] Undocumented variables are detected
- [ ] Unused variables are detected
- [ ] Usage locations are tracked accurately
- [ ] Registry diff calculation is correct

**Files Created**:
- [scripts/utils/__tests__/scan.test.js](scripts/utils/__tests__/scan.test.js)
- [scripts/utils/__tests__/registry-diff.test.js](scripts/utils/__tests__/registry-diff.test.js)

### Integration Tests

**Test Cases**:
- [ ] Full scan with real codebase
- [ ] Registry update preserves manual edits
- [ ] Validation mode fails on issues
- [ ] Change reports are generated correctly

### Manual Testing

**Test Cases**:
- [ ] Add pattern to `.mustacheignore` and verify exclusion
- [ ] Add new variable to template and verify detection
- [ ] Remove variable usage and verify "unused" detection
- [ ] Run `--validate` mode in CI and verify failures

---

## CLI Interface

### scan.js

```bash
# Basic scan (current behavior)
node scripts/utils/scan.js

# Show variable types
node scripts/utils/scan.js --show-types

# Show usage locations
node scripts/utils/scan.js --show-usage

# Validate mode (for CI)
node scripts/utils/scan.js --validate
```

### update-mustache-registry.js

```bash
# Update registry and show diff
node scripts/utils/update-mustache-registry.js

# Update registry quietly (no diff output)
node scripts/utils/update-mustache-registry.js --quiet
```

### validate-mustache-registry.js

```bash
# Validate registry sync (exit non-zero on issues)
node scripts/validate-mustache-registry.js

# Validate with detailed output
node scripts/validate-mustache-registry.js --verbose
```

---

## Documentation Updates

### README.md

Add section:

```markdown
### Mustache Variable Management

This project uses mustache templates (`{{variable}}`) for configuration. The variable registry is maintained in `scripts/mustache-variables-registry.json`.

**Scanning for variables**:
```bash
npm run scan:mustache
```

**Updating the registry**:
```bash
npm run update:mustache-registry
```

**Validating registry sync**:
```bash
npm run validate:mustache
```

**Excluding files from scan**:
Add patterns to `.mustacheignore` (gitignore syntax).

**Variable naming conventions**:
- Use `snake_case` for variable names
- Prefix booleans with `is_`, `has_`, or `enable_`
- Suffix counts/sizes with `_count`, `_width`, etc.
```

### New Documentation Files

- [ ] `docs/MUSTACHE_VARIABLES.md` - Comprehensive guide:
  - How the system works
  - How to add new variables
  - How to use `.mustacheignore`
  - How to fix validation errors
  - Type inference rules
  - Registry structure reference

---

## Implementation Order

1. **Phase 1 - Foundation** (Already Started ✅):
   - ✅ Add `.mustacheignore` support
   - ✅ Add `inferVariableType()` helper
   - Complete documentation for existing features

2. **Phase 2 - Detection & Tracking**:
   - Implement unused/undocumented variable detection
   - Add usage context tracking
   - Add tests for new features

3. **Phase 3 - Reporting**:
   - Implement registry diff utility
   - Add change report generation
   - Update registry update script

4. **Phase 4 - Validation & CI**:
   - Create validation script
   - Add npm scripts
   - Integrate with CI workflow
   - Add pre-commit hook (optional)

5. **Phase 5 - Documentation & Polish**:
   - Write comprehensive documentation
   - Add examples and troubleshooting guides
   - Create `.mustacheignore.example`
   - Update README and developer guides

---

## Success Criteria

- [ ] All variables in code are documented in registry
- [ ] All registry variables are used in code (or marked as intentionally unused)
- [ ] Usage locations are tracked for debugging
- [ ] CI fails if registry is out of sync
- [ ] Developers can easily exclude files from scanning
- [ ] Variable types are inferred and displayed
- [ ] Registry changes are tracked and reported
- [ ] Documentation is clear and comprehensive

---

## Risks & Considerations

**Performance**: Scanning large codebases may be slow
- Mitigation: Add caching, only scan changed files

**False Positives**: Type inference may be incorrect
- Mitigation: Allow manual type override in registry

**Breaking Changes**: Registry format changes may break existing tools
- Mitigation: Add migration script, maintain backward compatibility

**Ignored Files**: Developers may forget to update `.mustacheignore`
- Mitigation: Provide good default patterns in `.mustacheignore.example`

---

## Future Enhancements

- Variable value validation (regex patterns, allowed values)
- Auto-fix mode to add undocumented variables to registry
- VSCode extension for variable autocomplete
- GUI for managing registry
- i18n support for variable descriptions
- Schema validation for registry JSON

---
