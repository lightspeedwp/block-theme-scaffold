---
name: "Theme Generation"
description: "Instructions for AI agents on using mustache variables in theme generation"
applyTo: ".github/prompts/generate-theme.prompt.md"
---

# Generate Theme Instructions

This file provides comprehensive instructions for AI agents using the `generate-theme.prompt.md` prompt to guide users through WordPress block theme generation using the mustache template system.

## Overview

The Block Theme Scaffold uses **mustache template variables** (`{{variable_name}}`) throughout the codebase. During theme generation, these placeholders are replaced with user-provided values by the `scripts/generate-theme.js` script.

**Your role as an AI agent is to:**

1. Guide users through providing values for all required mustache variables
2. Validate user inputs before passing to the generator script
3. Suggest sensible defaults for optional variables
4. Explain what each variable controls and where it's used
5. Execute the generator script with collected values

## Mustache Variable System

### How It Works

**Template files contain placeholders:**

```php
// In scaffold file:
function {{theme_slug}}_setup() {
    load_theme_textdomain( '{{theme_slug}}', get_template_directory() . '/languages' );
}
```

**Generator replaces with user values:**

```php
// In generated file:
function tour_starter_setup() {
    load_theme_textdomain( 'tour-starter', get_template_directory() . '/languages' );
}
```

### Variable Categories

Variables are organized into logical groups that correspond to stages in the generation prompt:

1. **Core Identity** - Theme slug, name, namespace
2. **Author & Contact** - Author info, URLs, emails
3. **Version & Compatibility** - WP/PHP versions
4. **Design System** - Colors, fonts, spacing
5. **Layout** - Content width, wide width
6. **Content** - Text strings, excerpt settings
7. **Images** - Image size definitions

## Required Variables

These variables **MUST** be collected from the user:

### 1. `{{theme_slug}}` (Required)

**What it is:** URL-safe theme identifier used for file names, function prefixes, and text domains.

**Validation rules:**

- Minimum 2 characters
- Only lowercase letters, numbers, and hyphens
- Cannot start or end with hyphen
- No spaces or special characters
- Regex: `^[a-z0-9-]{2,}$`

**Valid examples:**

- `tour-starter`
- `my-theme-2024`
- `company-blog`

**Invalid examples:**

- `My Theme` (uppercase and spaces)
- `theme_slug` (underscores)
- `-theme-` (starts/ends with hyphen)

**Used in:**

- PHP function names
- CSS class prefixes
- JavaScript variable names
- Text domains for translations
- File names
- All configuration files

**How to collect:**

```text
Theme Slug (URL-safe, lowercase, hyphens only):
Example: tour-starter, my-theme-2024

What slug would you like to use?
```

### 2. `{{theme_name}}` (Required)

**What it is:** Human-readable display name shown in WordPress admin.

**Validation rules:**

- Minimum 2 characters
- Alphanumeric and common punctuation allowed
- No HTML or script tags
- Regex: `^[a-zA-Z0-9 \-_.,']{2,}$`

**Valid examples:**

- `Tour Starter Theme`
- `My Company Blog`
- `E-Commerce Pro`

**Used in:**

- WordPress theme header (style.css)
- Admin area display
- Block pattern categories
- Documentation

**How to collect:**

```text
Theme Name (display name shown in WordPress):
Example: Tour Starter Theme, My Business Site

What name would you like to use?
```

## Optional Variables with Defaults

These variables have sensible defaults but can be customized:

### Author Variables

#### `{{author}}`

- **Default:** `"Author Name"`
- **Type:** text
- **Used in:** style.css, package.json, copyright notices
- **Question:** "Author or organization name?"

#### `{{author_uri}}`

- **Default:** `"https://example.com"`
- **Type:** URL (must be valid http/https)
- **Used in:** style.css, package.json
- **Question:** "Author website URL?"

### Version Variables

#### `{{version}}`

- **Default:** `"1.0.0"`
- **Type:** Semantic version (x.y.z)
- **Used in:** style.css, package.json, functions.php
- **Question:** "Starting version number? (default: 1.0.0)"

#### `{{min_wp_version}}`

- **Default:** `"6.5"`
- **Type:** WordPress version
- **Used in:** style.css, README.txt
- **Question:** "Minimum WordPress version? (default: 6.5)"

#### `{{tested_wp_version}}`

- **Default:** `"6.7"`
- **Type:** WordPress version
- **Used in:** style.css, README.txt
- **Question:** "Tested up to WordPress version? (default: 6.7)"

#### `{{min_php_version}}`

- **Default:** `"8.0"`
- **Type:** PHP version
- **Used in:** style.css, composer.json
- **Question:** "Minimum PHP version? (default: 8.0)"

### Description Variable

#### `{{description}}`

- **Default:** `"A WordPress block theme."`
- **Type:** text (1-2 sentences)
- **Used in:** style.css, package.json, README.txt
- **Question:** "Brief theme description (1-2 sentences)?"

## Design System Variables

These are **optional** and primarily affect `theme.json`:

### Color Variables

All colors should be hex format (`#rrggbb` or `#rrggbbaa`).

| Variable               | Default   | Purpose               |
| ---------------------- | --------- | --------------------- |
| `{{primary_color}}`    | `#0073aa` | Primary brand color   |
| `{{secondary_color}}`  | `#005177` | Secondary brand color |
| `{{background_color}}` | `#ffffff` | Default background    |
| `{{text_color}}`       | `#1a1a1a` | Default text color    |
| `{{accent_color}}`     | `#ff6b35` | Accent/CTA color      |
| `{{neutral_color}}`    | `#6c757d` | Neutral/gray color    |

**How to collect (optional):**

```text
Would you like to customize the color palette?
(Press Enter to use defaults, or provide hex colors)

Primary color (default: #0073aa):
Secondary color (default: #005177):
Background color (default: #ffffff):
Text color (default: #1a1a1a):
```

### Typography Variables

| Variable                  | Default                   | Purpose                        |
| ------------------------- | ------------------------- | ------------------------------ |
| `{{heading_font_family}}` | `"system-ui, sans-serif"` | CSS font stack for headings    |
| `{{heading_font_name}}`   | `"System Font"`           | Display name for headings font |
| `{{body_font_family}}`    | `"system-ui, sans-serif"` | CSS font stack for body        |
| `{{body_font_name}}`      | `"System Font"`           | Display name for body font     |

**Font family format:**

- Must be valid CSS font-family value
- Include fallbacks: `"Inter", -apple-system, sans-serif`
- Quote font names with spaces: `"Fira Code"`

**How to collect (optional):**

```text
Would you like to customize typography?
(Press Enter to use system fonts)

Heading font family (CSS format):
Example: "Poppins", "Inter", sans-serif

Body font family (CSS format):
Example: "Inter", -apple-system, BlinkMacSystemFont, sans-serif
```

### Font Weight & Line Height

| Variable                     | Default | Purpose                       |
| ---------------------------- | ------- | ----------------------------- |
| `{{heading_font_weight}}`    | `700`   | Weight for headings (100-900) |
| `{{body_line_height}}`       | `1.6`   | Line height for body text     |
| `{{heading_line_height}}`    | `1.2`   | Line height for headings      |
| `{{button_font_weight}}`     | `600`   | Weight for buttons            |
| `{{site_title_font_weight}}` | `700`   | Weight for site title         |

### Layout Variables

| Variable               | Default  | Purpose                         |
| ---------------------- | -------- | ------------------------------- |
| `{{content_width}}`    | `720px`  | Max width for content           |
| `{{wide_width}}`       | `1200px` | Max width for wide blocks       |
| `{{content_width_px}}` | `720`    | Content width (no unit) for PHP |

**How to collect (optional):**

```text
Content width in pixels (default: 720):
Wide width in pixels (default: 1200):
```

**Important:** Both `{{content_width}}` (with px) and `{{content_width_px}}` (number only) must be set.

## Derived Variables

These variables are **automatically generated** from other inputs:

### `{{namespace}}`

- **Derived from:** `{{theme_slug}}`
- **Transformation:** Replace hyphens with underscores
- **Example:** `tour-starter` → `tour_starter`
- **Used in:** PHP namespaces, function prefixes
- **Note:** Generator handles this automatically

### Auto-Generated URLs

If user doesn't provide these, generator creates defaults:

- `{{theme_repo_url}}` → `https://github.com/{{author}}/{{theme_slug}}`
- `{{support_url}}` → `https://wordpress.org/support/theme/{{theme_slug}}`
- `{{docs_url}}` → `https://github.com/{{author}}/{{theme_slug}}/wiki`

### Auto-Generated Emails

Based on `{{author_uri}}`:

- `{{support_email}}` → `support@domain.com`
- `{{security_email}}` → `security@domain.com`
- `{{business_email}}` → `contact@domain.com`

**Where domain.com is extracted from author_uri**

## Validation Rules by Type

### Type: slug

```javascript
// Rules:
- Minimum 2 characters
- Only a-z, 0-9, and hyphens
- No leading/trailing hyphens
- Automatically lowercased

// Regex:
/^[a-z0-9-]{2,}$/

// Sanitization:
input.toLowerCase()
     .replace(/[^a-z0-9-]/g, '-')
     .replace(/-+/g, '-')
     .replace(/^-|-$/g, '')
```

### Type: name

```javascript
// Rules:
- Minimum 2 characters
- Alphanumeric and punctuation
- No HTML/script tags

// Regex:
/^[a-zA-Z0-9 \-_.,']{2,}$/

// Sanitization:
input.replace(/[^a-zA-Z0-9 \-_.,']/g, '').trim()
```

### Type: url

```javascript
// Rules:
- Must be valid URL
- Only http:// or https://
- Must include protocol

// Valid:
- https://example.com
- https://example.com/path

// Invalid:
- example.com (no protocol)
- ftp://example.com (wrong protocol)
```

### Type: version

```javascript
// Rules:
- Semantic versioning: x.y.z
- Optional pre-release: x.y.z-alpha.1

// Regex:
/^\d+\.\d+(\.\d+)?(-[a-zA-Z0-9.-]+)?$/

// Valid:
- 1.0.0
- 1.0
- 2.1.3-beta.1

// Invalid:
- v1.0.0 (no v prefix)
- 1 (too short)
```

### Type: email

```javascript
// Rules:
- Basic email format
- Must have @ and domain

// Regex:
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Type: hex color

```javascript
// Rules:
- Must start with #
- 6 or 8 hex digits (RRGGBB or RRGGBBAA)

// Regex:
/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/

// Valid:
- #0073aa
- #0073aaff

// Invalid:
- 0073aa (no #)
- #07a (too short)
```

## Multi-Stage Collection Workflow

Follow this workflow when guiding users through generation:

### Stage 1: Core Identity (Required)

**Collect in this order:**

1. `{{theme_name}}` - "What should your theme be called?"
2. `{{theme_slug}}` - "URL-safe slug (lowercase, hyphens)?"
3. `{{description}}` - "Brief description (1-2 sentences)?"
4. `{{author}}` - "Author/organization name?"
5. `{{author_uri}}` - "Author website URL?"

**Validation:**

- Verify slug meets format requirements
- Check name is not empty
- Validate author_uri is proper URL

**Confirm with user before proceeding:**

```text
I've collected:
- Theme Name: Tour Starter Theme
- Theme Slug: tour-starter
- Description: A modern WordPress block theme for tour operators
- Author: LightSpeed
- Author URI: https://developer.lsdev.biz

Is this correct? (yes/no)
```

### Stage 2: Versions & Compatibility (Optional)

**Present defaults, allow customization:**

```text
Would you like to customize version and compatibility settings?
(Press Enter to use defaults)

Defaults:
- Version: 1.0.0
- Min WordPress: 6.5
- Tested WordPress: 6.7
- Min PHP: 8.0

Customize? (yes/no):
```

**If yes, collect:**

1. `{{version}}`
2. `{{min_wp_version}}`
3. `{{tested_wp_version}}`
4. `{{min_php_version}}`

### Stage 3: Design System (Optional)

**Ask if user wants to customize:**

```text
Would you like to customize the design system?
This includes colors, fonts, and spacing.
(Press Enter to use defaults)

Customize design? (yes/no):
```

**If yes, collect:**

**3a. Colors:**

```text
Color Palette (provide hex colors or press Enter for defaults):

Primary color (#0073aa):
Secondary color (#005177):
Background color (#ffffff):
Text color (#1a1a1a):
Accent color (#ff6b35):
Neutral color (#6c757d):
```

**3b. Typography:**

```text
Typography Settings:

Heading font family ("system-ui, sans-serif"):
Heading font name ("System Font"):
Body font family ("system-ui, sans-serif"):
Body font name ("System Font"):
```

**3c. Layout:**

```text
Layout Settings:

Content width in pixels (720):
Wide width in pixels (1200):
```

### Stage 4: Content Strings (Optional)

**Ask if user wants to customize content:**

```text
Would you like to customize default content strings?
(Press Enter to use defaults)

Customize content? (yes/no):
```

**If yes, collect:**

```text
Default Content:

Hero title ("Welcome to {{theme_name}}"):
CTA button text ("Get Started"):
Footer copyright ("© {{year}} {{author}}"):
Skip link text ("Skip to content"):
Excerpt more text ("..."):
```

### Stage 5: Generate

**Build command with all collected values:**

```bash
node scripts/generate-theme.js \
  --slug "{{collected_slug}}" \
  --name "{{collected_name}}" \
  --description "{{collected_description}}" \
  --author "{{collected_author}}" \
  --author_uri "{{collected_author_uri}}" \
  --version "{{collected_version}}"
  # ... additional args if customized
```

**Execute and report results:**

```text
Generating theme...

✓ Theme generated successfully at: output-theme/

Next steps:
1. cd output-theme
2. npm install
3. composer install
4. npm run start
```

## Error Handling

### Invalid Slug

```text
❌ Invalid slug: "My Theme"

Theme slug must:
- Be at least 2 characters
- Use only lowercase letters, numbers, and hyphens
- Not start or end with a hyphen

Valid examples: my-theme, tour-starter, company-blog

Please provide a valid slug:
```

### Invalid URL

```text
❌ Invalid URL: "example.com"

URLs must include the protocol (http:// or https://)

Valid examples:
- https://example.com
- https://developer.lsdev.biz

Please provide a valid URL:
```

### Invalid Version

```text
❌ Invalid version: "v1.0"

Version must follow semantic versioning format: x.y.z

Valid examples:
- 1.0.0
- 2.1.3
- 1.0.0-beta.1

Please provide a valid version:
```

### Output Directory Exists

```text
❌ Error: Output directory already exists

The directory "output-theme" already exists.
Please either:
1. Remove it: rm -rf output-theme
2. Move it: mv output-theme old-output-theme
3. Run from a different location

Would you like me to help you with this?
```

## Best Practices for AI Agents

### 1. Validate Early and Often

Don't wait until the end to validate all inputs. Validate each input immediately after collection.

**Good:**

```text
User: my-theme-123
Agent: ✓ Valid slug: my-theme-123

User: MY THEME
Agent: ❌ Invalid slug. Must be lowercase with hyphens only.
```

### 2. Provide Clear Examples

Always show examples when asking for input.

**Good:**

```text
Theme Slug (lowercase, hyphens only)
Examples: tour-starter, my-theme-2024, company-blog

What slug would you like?
```

**Bad:**

```text
What is your theme slug?
```

### 3. Explain the Impact

Help users understand what each variable controls.

**Good:**

```text
Theme Slug: This will be used for:
- Function names (tour_starter_setup)
- Text domain (tour-starter)
- File names
- CSS class prefixes

What slug would you like?
```

### 4. Suggest Smart Defaults

Derive defaults from previous answers when possible.

**Example:**

```text
User provides: Theme Name: "Tour Operator Pro"

Agent suggests:
- Slug: tour-operator-pro
- Namespace: tour_operator_pro
- Repository: https://github.com/{{author}}/tour-operator-pro
```

### 5. Confirm Before Execution

Always show a summary and get confirmation.

**Template:**

```text
Ready to generate theme with these settings:

Core Identity:
- Name: {{theme_name}}
- Slug: {{theme_slug}}
- Description: {{description}}

Author:
- Name: {{author}}
- Website: {{author_uri}}

Versions:
- Theme: {{version}}
- WordPress: {{min_wp_version}}+ (tested: {{tested_wp_version}})
- PHP: {{min_php_version}}+

Generate theme? (yes/no):
```

### 6. Provide Post-Generation Guidance

After successful generation, guide users through next steps:

```text
✓ Theme generated successfully!

Location: /path/to/output-theme

Next steps:
1. Review generated files:
   cd output-theme
   cat style.css
   cat functions.php

2. Install dependencies:
   npm install
   composer install

3. Start development:
   npm run start

4. Open in WordPress:
   - Copy to wp-content/themes/
   - Activate in WordPress admin

Would you like help with any of these steps?
```

## Variable Usage Reference

### Where Each Variable Appears

This quick reference shows which files use each variable category:

#### `{{theme_slug}}` appears in

- `style.css` (Text Domain header)
- `functions.php` (all function names)
- `package.json` (name, keywords)
- `theme.json` (not directly, but in patterns)
- All PHP files (function prefixes)
- All JavaScript files (text domains)
- `README.txt` (text domain references)
- Pattern files (pattern registration)

#### `{{theme_name}}` appears in

- `style.css` (Theme Name header)
- `functions.php` (pattern category labels)
- `package.json` (themeMeta.displayName)
- `README.txt` (theme title)
- All documentation files

#### Design variables appear in

- `theme.json` only

#### Version variables appear in

- `style.css` (Requires/Tested headers)
- `package.json` (version, engines)
- `functions.php` (VERSION constant)
- `composer.json` (require PHP version)
- `README.txt` (compatibility info)

## Testing Generated Output

After generation, verify that variables were replaced correctly:

### Quick Checks

```bash
cd output-theme

# Check style.css header
head -n 20 style.css

# Check functions.php
grep "function " functions.php | head -n 5

# Check package.json
jq '.name, .version, .author' package.json

# Check theme.json colors
jq '.settings.color.palette' theme.json
```

### Verify No Unreplaced Variables

```bash
# Search for any remaining mustache variables
grep -r "{{" --exclude-dir=node_modules --exclude-dir=vendor .

# Should return no results (or only in documentation)
```

### Validation Checklist

- [ ] All mustache variables replaced
- [ ] `{{theme_slug}}` used consistently in function names
- [ ] Text domain matches slug throughout
- [ ] Version numbers match across files
- [ ] URLs are properly formatted
- [ ] Colors are valid hex codes
- [ ] Font families have proper fallbacks
- [ ] No syntax errors in theme.json

## Related Documentation

- [GENERATE-THEME.md](../../docs/GENERATE-THEME.md) - Complete generator system documentation
- [generate-theme.prompt.md](../prompts/generate-theme.prompt.md) - User-facing generation prompt
- [generate-theme.agent.md](../agents/generate-theme.agent.md) - Agent specification
- [theme-json.instructions.md](./theme-json.instructions.md) - theme.json configuration guide
- [theme-config.schema.json](../schemas/theme-config.schema.json) - JSON Schema for validation
- [theme-config.template.json](../../theme-config.template.json) - Template config file

## Summary

As an AI agent guiding theme generation:

1. **Collect required variables** (theme_slug, theme_name) first
2. **Validate inputs immediately** using type-specific rules
3. **Suggest sensible defaults** for optional variables
4. **Explain the impact** of each variable
5. **Confirm before execution** with a complete summary
6. **Guide post-generation** setup and next steps

**Remember:** Mustache variables are simple string replacements. Your job is to collect valid values and pass them to the generator script. The script handles the actual replacement process.
