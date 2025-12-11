# Schemas Directory

This directory contains JSON schemas and configuration templates used for code generation, validation, and documentation.

## Files

### theme-config.schema.json

**Purpose:** Official JSON Schema defining all valid configuration options for theme generation.

**Usage:**

- Defines the structure and validation rules for theme configuration files
- Used by theme generators to validate user input
- Referenced by editors and IDEs for autocomplete and validation
- Provides documentation for all available configuration options

**Schema Defines:**

- Required fields (theme_slug, theme_name, author)
- Optional fields (description, version, license, etc.)
- Design system tokens (colors, typography, spacing)
- Theme structure settings
- Feature flags
- Content options

**Example:**

```bash
# Validate a configuration file against the schema
jq -f .github/schemas/theme-config.schema.json my-config.json
```

### theme-config.example.json

Location: `.github/schemas/examples/theme-config.example.json`

**Purpose:** Pre-filled example configuration showing realistic values for all schema fields.

**Usage:**

- Template for users creating new theme configurations
- Reference implementation of all available options
- Documentation through working example
- Copy and customize for new projects

**Content:**

- Complete theme-config with all sections populated
- Realistic values for Tour Operator theme
- Comments explaining each major section
- Valid against theme-config.schema.json

**Example:**

```bash
# Copy example to create your own configuration
cp .github/schemas/examples/theme-config.example.json my-theme-config.json

# Edit and customize for your theme
vim my-theme-config.json

# Generate theme with custom config
node scripts/generate-theme.js --config my-theme-config.json
```

## Adding New Schemas

When adding new schemas:

1. Create descriptive filename: `{domain}-{type}.schema.json`
2. Follow JSON Schema standards
3. Include comprehensive descriptions for all fields
4. Add example files when appropriate
5. Document in this README
6. Reference schema in build scripts or generation tools

## Related Files

- [FILE_ORGANIZATION.md](../FILE_ORGANIZATION.md) - Overall file organization guide
- [scripts/generate-theme.js](../../scripts/generate-theme.js) - Theme generation script
- [.github/instructions/generate-theme.instructions.md](../instructions/generate-theme.instructions.md) - Theme generation guidance
- [docs/THEME_STRUCTURE.md](../../docs/THEME_STRUCTURE.md) - Theme structure documentation
