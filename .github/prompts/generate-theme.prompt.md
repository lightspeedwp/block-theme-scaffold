---
description: Interactive WordPress block theme generator with config-first wizard - guides you through creating a new theme from the scaffold
---

# Generate New Block Theme

I'll help you generate a new WordPress block theme from this scaffold using an intelligent config-first approach.

## Step 1: Repository Context Detection

**First, let me detect your repository context...**

The generator automatically detects whether you're running in:

1. **The block-theme-scaffold repository**
   - Theme will be generated in `./generated-theme/`
   - Scaffold files remain untouched
   - Perfect for testing or creating themes to distribute

2. **A new repository for your theme**
   - Theme files will be generated in the current directory
   - Scaffold placeholders replaced with your values
   - This becomes your theme's permanent repository

**Which scenario applies to you?**

_(The script will auto-detect this, but I want to confirm your intention)_

---

## Step 2: Configuration File Check

**Do you have a theme-config.json file ready?**

If you have a pre-filled configuration file:
- ✅ Faster generation with all your values
- ✅ Validated against JSON Schema before generation
- ✅ Can override specific values if needed
- ✅ Reusable for future theme versions

**Options:**
- **"Yes, I have a config file"** → I'll validate and load it
- **"No, start the wizard"** → I'll guide you step-by-step
- **"Help me create one"** → I'll show you the template

---

## Step 3A: Config File Path (if you have one)

**Please provide the path to your theme-config.json file:**

Example paths:
- `theme-config.json` (in current directory)
- `/path/to/my-theme-config.json` (absolute path)
- `../configs/tour-theme.json` (relative path)

I'll validate it against the schema at [.github/schemas/theme-config.schema.json](.github/schemas/theme-config.schema.json).

### If config is valid:

✅ **Configuration loaded successfully!**

**Loaded values:**
- Theme Name: {{loaded_name}}
- Theme Slug: {{loaded_slug}}
- Author: {{loaded_author}}
- ... (and X more values)

**Missing optional values:** {{count}}

Would you like to:
1. **Fill in missing values now** (recommended)
2. **Use defaults for missing values** (quick generation)
3. **Override any loaded values** (advanced)

---

## Step 3B: Wizard Mode Selection (if no config file)

**Choose your wizard complexity:**

### 🚀 Basic Wizard (Recommended for most users)
Collects essential values only:
- Core identity (name, slug, author)
- Versioning (WP/PHP requirements)
- Basic design tokens (colors, fonts)

**Time:** ~5 minutes
**Theme:** Simple, clean, ready to customize
**Variables replaced:** ~50 essential
**Remaining placeholders:** Filled with sensible defaults

### ⚙️ Advanced Wizard (For complete customization)
Collects ALL possible values:
- Everything in Basic +
- Extended design system (dark mode, typography scale)
- Content strings (hero, CTA, footer text)
- Image sizes and dimensions
- Template structure preferences
- Pattern and style variation selection

**Time:** ~15 minutes
**Theme:** Fully customized, production-ready
**Variables replaced:** All 142 discovered
**Remaining placeholders:** None

**Which wizard mode would you like?**

---

## Step 4: Basic Wizard Questions

### Stage 1: Core Identity (Required)

Please provide:

1. **Theme Name** (display name shown in WordPress)
   - Example: "Tour Starter Theme", "My Business Site"
   - What would you like to call your theme?

2. **Theme Slug** (URL-safe identifier)
   - Lowercase, hyphens only, 2+ characters
   - Example: "tour-starter", "my-theme-2024"
   - What slug would you like?

3. **Description** (1-2 sentences)
   - Example: "A modern WordPress block theme for tour operators"
   - What does this theme do?

4. **Author Name** (who is creating this)
   - Example: "LightSpeed", "John Developer"
   - Your name or organization?

5. **Author URI** (your website URL)
   - Must include http:// or https://
   - Example: "https://developer.lsdev.biz"
   - Your website URL?

---

### Stage 2: Versioning & Compatibility (Has Defaults)

**Would you like to use default versions?**

Default values:
- Version: 1.0.0
- Min WordPress: 6.5
- Tested WordPress: 6.7
- Min PHP: 8.0

**Options:**
- "yes" → Use defaults
- "customize" → Provide custom values

_(If "customize", ask for each value individually)_

---

### Stage 3: Design Tokens (Optional in Basic, Required in Advanced)

**Would you like to customize colors and fonts now?**

**Options:**
- "skip" → Use elegant defaults
- "customize" → Set your brand colors and fonts

#### If "customize" selected:

**Color Palette** (provide hex colors):

1. Primary Color (default: #0073aa):
2. Secondary Color (default: #005177):
3. Background Color (default: #ffffff):
4. Text Color (default: #1a1a1a):
5. Accent Color (default: #ff6b35):
6. Neutral Color (default: #6c757d):

**Typography** (provide CSS font stacks):

1. Heading Font Family (default: system-ui, sans-serif):
2. Heading Font Name (default: System Font):
3. Body Font Family (default: system-ui, sans-serif):
4. Body Font Name (default: System Font):

---

### Basic Wizard Complete!

**Summary of your theme configuration:**

```
Theme Name:     {{collected_name}}
Theme Slug:     {{collected_slug}}
Description:    {{collected_description}}
Author:         {{collected_author}}
Author URI:     {{collected_author_uri}}
Version:        {{collected_version}}
Min WordPress:  {{collected_min_wp}}
Tested WP:      {{collected_tested_wp}}
Min PHP:        {{collected_min_php}}
```

**Design tokens:** {{using_defaults_or_custom}}

**Ready to generate?** (yes/no)

---

## Step 5: Advanced Wizard Additional Questions

_(Only if Advanced mode selected)_

### Stage 4: Extended Design System

**Dark Mode Colors** (for dark style variation):
1. Dark Background (default: #1a1a1a):
2. Dark Text (default: #ffffff):
3. Dark Primary (default: #4a9eff):
4. Dark Accent (default: #ff8c5a):

**Typography Details:**
1. Heading Font Weight (default: 700):
2. Body Line Height (default: 1.6):
3. Heading Line Height (default: 1.2):
4. Button Font Weight (default: 600):

**Layout:**
1. Content Width (default: 720px):
2. Wide Width (default: 1200px):

---

### Stage 5: Content Strings & Settings

**Default content for patterns:**

1. Hero Title (default: "Welcome to Your New Website"):
2. Hero Description (default: "Modern WordPress block theme..."):
3. Hero Button Text (default: "Get Started"):
4. CTA Title (default: "Ready to Get Started?"):
5. CTA Description (default: "Join thousands of satisfied customers"):
6. CTA Button Text (default: "Contact Us"):
7. Footer Text (default: "© {{year}} {{author}}. All rights reserved."):

**Content Settings:**
1. Excerpt Length in words (default: 55):
2. Excerpt More Text (default: "..."):
3. Skip Link Text (default: "Skip to content"):
4. Button Border Radius (default: 4px):

---

### Stage 6: Image Sizes

**Define image dimensions (in pixels):**

1. Featured Image Width x Height (default: 1200 x 675):
2. Thumbnail Width x Height (default: 300 x 300):
3. Gallery Image Width x Height (default: 800 x 600):
4. Logo Width x Height (default: 250 x 100):

---

### Stage 7: Theme Structure (Optional)

**Would you like to customize which templates and patterns are included?**

**Options:**
- "use defaults" → Include all standard templates and patterns
- "customize" → Select which ones to include

_(If "customize", present checklist of templates, patterns, and style variations from schema)_

---

### Advanced Wizard Complete!

**Complete Summary:**

```
=== Core Identity ===
Theme Name:     {{collected_name}}
Theme Slug:     {{collected_slug}}
Description:    {{collected_description}}
Author:         {{collected_author}}
Author URI:     {{collected_author_uri}}

=== Versioning ===
Version:        {{collected_version}}
Min WordPress:  {{collected_min_wp}}
Tested WP:      {{collected_tested_wp}}
Min PHP:        {{collected_min_php}}

=== Design System ===
Primary Color:  {{primary_color}}
Secondary Color: {{secondary_color}}
... (all collected design tokens)

=== Content ===
Hero Title:     {{hero_title}}
CTA Title:      {{cta_title}}
... (all collected content strings)

=== Images ===
Featured: {{featured_image_width}} x {{featured_image_height}}px
... (all image sizes)
```

**Total variables configured:** {{total_count}} / 142

**Ready to generate?** (yes/no)

---

## Step 6: Final Validation

**Validating your configuration...**

✓ Theme slug is valid and URL-safe
✓ All URLs have correct format
✓ Version numbers follow semver
✓ Color codes are valid hex
✓ Email addresses are valid
✓ No required fields missing

**Validation complete!**

---

## Step 7: Generation Execution

**Generating your theme...**

```bash
node scripts/generate-theme.js \
  --slug "{{slug}}" \
  --name "{{name}}" \
  --description "{{description}}" \
  --author "{{author}}" \
  --author_uri "{{author_uri}}" \
  ... (all collected values as arguments)
```

_Running generator script..._

---

## Step 8: Post-Generation

**✅ Theme generated successfully!**

**Location:** `{{output_location}}`

**What was generated:**
- 📁 Complete theme structure
- 🎨 theme.json with your design tokens
- 📝 style.css with your metadata
- ⚙️ functions.php with theme setup
- 🎭 Patterns and templates
- 🔧 Build configuration
- 📚 Documentation

**Mustache Variables Replaced:**
- Total variables found: 142
- Variables replaced: {{replaced_count}}
- Using defaults: {{defaults_count}}
- Auto-derived: {{derived_count}}

**Next Steps:**

1. **Navigate to theme directory:**
   ```bash
   cd {{output_dir}}
   ```

2. **Install dependencies:**
   ```bash
   npm install
   composer install
   ```

3. **Start development:**
   ```bash
   npm run start
   ```

4. **Review generated files:**
   - Check `style.css` for theme metadata
   - Review `theme.json` for design system
   - Explore `patterns/` for block patterns

5. **Install in WordPress:**
   - Copy to `wp-content/themes/`
   - Activate in WordPress admin
   - Visit Site Editor to customize

---

## Optional: Save Configuration

**Would you like to save this configuration for future use?**

If yes, I'll create a `theme-config.json` file with all your values:

```json
{
  "theme_slug": "{{slug}}",
  "theme_name": "{{name}}",
  "author": "{{author}}",
  ...
}
```

You can use this file next time:
```bash
node scripts/generate-theme.js --config theme-config.json
```

**Save configuration?** (yes/no)

---

## Validation & Cleanup

Before finishing, I'll run a final validation to ensure no `{{mustache}}` placeholders were left behind:

```bash
node scripts/scan-mustache-variables.js --validate generated-theme/
```

**Validation Results:**
- ✅ All required variables replaced
- ✅ No unreplaced placeholders found
- ✅ Theme ready for development!

---

## Resources

**Documentation:**
- [Complete Generation Guide](../../docs/GENERATE_THEME.md)
- [Theme JSON Configuration](../instructions/theme-json.instructions.md)
- [Development Workflow](../../DEVELOPMENT.md)

**Related Tools:**
- [Generator Script](../../scripts/generate-theme.js)
- [Variable Scanner](../../scripts/scan-mustache-variables.js)
- [Configuration Schema](../schemas/theme-config.schema.json)
- [Example Config](../schemas/examples/theme-config.example.json)

**Next Agents:**
- [Development Assistant](../agents/development-assistant.agent.md)
- [Block Theme Build Agent](../agents/block-theme-build.agent.md)

---

**Ready to begin? Just say "start" or "generate theme"!**
