# Generate-Theme System: Specific File Updates

**Date:** 2025-12-10
**Report Type:** Recommendations
**Based On:** [2025-12-10-generate-theme-validation.md](./2025-12-10-generate-theme-validation.md)

---

## Required File Updates

### 1. Update `AGENTS.md` - Test Status Table

**File:** `AGENTS.md`

**Current:**

```markdown
## Agent Test Status

| Agent | Tests | Notes |
| ----- | ----- | ---------------------------- |
| *TBD* | ⏳    | Awaiting test implementation |
```

**Update to:**

```markdown
## Agent Test Status

| Agent | Tests | Notes |
| ----- | ----- | ---------------------------- |
| Generate Theme | ✅ | Passing - tests/bin/generate-theme.test.js, tests/agents/generate-theme.agent.test.js |
```

---

### 2. Add JSON Schema Validation to `scripts/generate-theme.js`

**File:** `scripts/generate-theme.js`

**Add after dependencies:**

```javascript
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
```

**Add validation function:**

```javascript
/**
 * Validate configuration against JSON schema
 *
 * @param {Object} config - Configuration object to validate
 * @return {boolean} True if valid, exits process if invalid
 */
function validateAgainstSchema(config) {
 try {
  const schema = require('../.github/schemas/theme-config.schema.json');
  const validate = ajv.compile(schema);
  const valid = validate(config);

  if (!valid) {
   console.error('\n❌ Configuration validation errors:\n');
   validate.errors.forEach(err => {
    const path = err.instancePath || 'root';
    const message = err.message;
    const value = err.params.limit !== undefined
     ? ` (got: ${JSON.stringify(err.data)})`
     : '';
    console.error(`  ${path}: ${message}${value}`);
   });
   return false;
  }

  console.log('✓ Configuration validated against schema');
  return true;
 } catch (error) {
  console.warn(`⚠️  Schema validation skipped: ${error.message}`);
  return true; // Don't fail if schema file missing
 }
}
```

**Use in config loading:**

```javascript
/**
 * Load configuration from JSON file
 *
 * @param {string} configPath
 */
function loadConfig(configPath) {
 try {
  const absolutePath = path.isAbsolute(configPath)
   ? configPath
   : path.resolve(process.cwd(), configPath);

  if (!fs.existsSync(absolutePath)) {
   throw new Error(`Configuration file not found: ${absolutePath}`);
  }

  const configContent = fs.readFileSync(absolutePath, 'utf8');
  const config = JSON.parse(configContent);

  // Validate against schema
  if (!validateAgainstSchema(config)) {
   throw new Error('Configuration failed schema validation');
  }

  // Validate required fields (backup validation)
  if (!config.theme_slug || !config.theme_name || !config.author) {
   throw new Error(
    'Configuration must include theme_slug, theme_name, and author'
   );
  }

  console.log(
   `✓ Loaded configuration from ${path.basename(absolutePath)}`
  );
  return config;
 } catch (error) {
  throw new Error(`Failed to load configuration: ${error.message}`);
 }
}
```

**Also update package.json to include ajv:**

```json
{
  "devDependencies": {
    "ajv": "^8.12.0"
  }
}
```

---

### 3. Create Root Template Config File

**File:** `theme-config.template.json` (new file at root)

```json
{
 "$schema": "./.github/schemas/theme-config.schema.json",
 "_comment": "Copy this file to theme-config.json and fill in your values, then run: node scripts/generate-theme.js --config theme-config.json",

 "theme_slug": "",
 "theme_name": "",
 "description": "A modern WordPress block theme built with accessibility and performance in mind.",
 "author": "",
 "author_uri": "",

 "version": "1.0.0",
 "min_wp_version": "6.5",
 "tested_wp_version": "6.7",
 "min_php_version": "8.0",

 "license": "GPL-2.0-or-later",
 "theme_uri": "",
 "theme_repo_url": "",

 "design_system": {
  "colors": {
   "primary_color": "#0073aa",
   "secondary_color": "#005177",
   "background_color": "#ffffff",
   "text_color": "#1a1a1a",
   "accent_color": "#ff6b35",
   "neutral_color": "#6c757d"
  },
  "typography": {
   "heading_font_family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
   "heading_font_name": "System Font",
   "body_font_family": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
   "body_font_name": "System Font",
   "heading_font_weight": "700",
   "body_line_height": "1.6",
   "heading_line_height": "1.2",
   "button_font_weight": "600",
   "site_title_font_weight": "700"
  },
  "layout": {
   "content_width": "720px",
   "wide_width": "1200px"
  }
 },

 "content": {
  "button_border_radius": "4px",
  "excerpt_more": "...",
  "skip_link_text": "Skip to content"
 }
}
```

**Update `.gitignore` to exclude user configs:**

```gitignore
# User theme configs (but keep template)
theme-config.json
*-config.json
!theme-config.template.json
```

---

### 4. Document Schema Relationship in `scripts/lib/config-schema.js`

**File:** `scripts/lib/config-schema.js`

**Add at top of file:**

```javascript
/**
 * scripts/lib/config-schema.js
 *
 * Shared configuration schema and validation functions
 * Used by both generate-theme.js and generate-theme.agent.js
 * to ensure consistency across different generation modes.
 *
 * SCHEMA RELATIONSHIP:
 * This JavaScript schema is synchronized with the JSON Schema at:
 * .github/schemas/theme-config.schema.json
 *
 * When adding new configuration fields:
 * 1. Add to CONFIG_SCHEMA below (JS format)
 * 2. Add to .github/schemas/theme-config.schema.json (JSON Schema format)
 * 3. Update theme-config.template.json with default value
 * 4. Document in .github/instructions/generate-theme.instructions.md
 *
 * @module config-schema
 * @see {@link ../../.github/schemas/theme-config.schema.json} - JSON Schema definition
 */
```

---

### 5. Add Schema Reference to Agent Spec

**File:** `.github/agents/generate-theme.agent.md`

**Add to Related Files section:**

```markdown
## Related Files

- [Generate Theme Script](../../scripts/generate-theme.js)
- [Generate Theme Prompt](../prompts/generate-theme.prompt.md)
- [Generate Theme Instructions](../instructions/generate-theme.instructions.md)
- [Configuration Schema](../schemas/theme-config.schema.json)
- [Configuration Template](../../theme-config.template.json)
- [Development Assistant](./development-assistant.agent.md)
- [Block Theme Build Agent](./block-theme-build.agent.md)
- [Theme JSON Instructions](../instructions/theme-json.instructions.md)
```

---

### 6. Update Instructions with Template Reference

**File:** `.github/instructions/generate-theme.instructions.md`

**Add to Related Documentation section:**

```markdown
## Related Documentation

- [GENERATE-THEME.md](../../docs/GENERATE-THEME.md) - Complete generator system documentation
- [generate-theme.prompt.md](../prompts/generate-theme.prompt.md) - User-facing generation prompt
- [generate-theme.agent.md](../agents/generate-theme.agent.md) - Agent specification
- [theme-json.instructions.md](./theme-json.instructions.md) - theme.json configuration guide
- [theme-config.schema.json](../schemas/theme-config.schema.json) - JSON Schema for validation
- [theme-config.template.json](../../theme-config.template.json) - Template config file
```

---

### 7. Update Documentation with Template Usage

**File:** `docs/GENERATE_THEME.md`

**Add section after "Generation Methods":**

```markdown
### Using Configuration Template

For complex themes with many customizations, use the template config file:

1. **Copy the template:**
   ```bash
   cp theme-config.template.json my-theme-config.json
   ```

2. **Edit with your values:**

   ```json
   {
     "theme_slug": "my-awesome-theme",
     "theme_name": "My Awesome Theme",
     "author": "Your Name",
     "author_uri": "https://yoursite.com",
     "design_system": {
       "colors": {
         "primary_color": "#ff6b35"
       }
     }
   }
   ```

3. **Generate theme:**

   ```bash
   node scripts/generate-theme.js --config my-theme-config.json
   ```

**Benefits:**

- ✅ Pre-validation with JSON Schema
- ✅ Autocomplete in VS Code (with schema)
- ✅ Reusable for future versions
- ✅ All options in one file
- ✅ Easy to version control

```

---

### 8. Add VS Code JSON Schema Association

**File:** `.vscode/settings.json` (create if doesn't exist)

```json
{
 "json.schemas": [
  {
   "fileMatch": [
    "*theme-config*.json",
    "!theme-config.template.json"
   ],
   "url": "./.github/schemas/theme-config.schema.json"
  }
 ]
}
```

This enables autocomplete and validation in VS Code for user config files.

---

## Implementation Checklist

- [ ] Update `AGENTS.md` with Generate Theme test status
- [ ] Add JSON Schema validation to `scripts/generate-theme.js`
- [ ] Install `ajv` dependency: `npm install --save-dev ajv`
- [ ] Create `theme-config.template.json` at root
- [ ] Update `.gitignore` to exclude user configs
- [ ] Document schema relationship in `config-schema.js`
- [ ] Add schema reference to agent spec
- [ ] Update instructions with template reference
- [ ] Update docs with template usage guide
- [ ] Create/update `.vscode/settings.json` for JSON schema
- [ ] Test JSON config validation with invalid config
- [ ] Test template workflow end-to-end
- [ ] Update CHANGELOG.md with enhancements

---

## Testing Recommendations

After implementing changes, test:

1. **Schema Validation:**

   ```bash
   # Create invalid config
   echo '{"theme_slug": "INVALID"}' > test-config.json

   # Should fail with helpful error
   node scripts/generate-theme.js --config test-config.json
   ```

2. **Template Workflow:**

   ```bash
   # Copy template
   cp theme-config.template.json test-theme.json

   # Edit test-theme.json with valid values
   # Generate theme
   node scripts/generate-theme.js --config test-theme.json
   ```

3. **VS Code Autocomplete:**
   - Open `test-theme.json` in VS Code
   - Start typing field names
   - Verify autocomplete suggestions appear
   - Verify validation errors show for invalid values

4. **Agent Mode:**

   ```bash
   # Interactive mode should still work
   node scripts/generate-theme.agent.js

   # JSON mode should validate
   echo '{"slug":"test","name":"Test"}' | node scripts/generate-theme.agent.js --json
   ```

---

## Priority Order

1. **High Priority** (Production Impact):
   - Add JSON schema validation (prevents user errors)
   - Create theme-config.template.json (improves UX)
   - Update AGENTS.md (documentation accuracy)

2. **Medium Priority** (Developer Experience):
   - Add VS Code JSON schema association (autocomplete)
   - Document schema relationship (maintainability)

3. **Low Priority** (Nice to Have):
   - Add schema references to agent spec (completeness)
   - Update instructions with template (comprehensive docs)

---

## Related Reports

- [2025-12-10-generate-theme-validation.md](./2025-12-10-generate-theme-validation.md) - Full validation analysis

---

**Generated by:** GitHub Copilot
**Date:** 2025-12-10
**Status:** Ready for Implementation
