---
description: Interactive WordPress block theme generator - guides you through creating a new theme from the scaffold
---

# Generate New Block Theme

I'll help you generate a new WordPress block theme from this scaffold. Let's gather the information needed to create your theme.

**Important:** This prompt uses the mustache template variable system. For complete documentation on how variables work and detailed AI agent instructions, see:

- [Generate Theme Instructions](../instructions/generate-theme.instructions.md) - Comprehensive guide for AI agents
- [Generate Theme Documentation](../../docs/GENERATE-THEME.md) - Complete mustache variable reference

## Information Gathering Process

I need to collect several pieces of information from you. I'll ask questions in stages to keep things organised.

---

## Stage 1: Basic Theme Identity

**Please answer these questions:**

1. **Theme Name** (display name, e.g., "Tour Starter")
   - What would you like to call your theme?

2. **Theme Slug** (URL-safe, lowercase, hyphens only, e.g., "tour-starter")
   - This will be used for file names and function prefixes

3. **Description** (one or two sentences)
   - What does this theme do?

4. **Author/Organisation Name**
   - Who is creating this theme?

5. **Author URI** (website URL)
   - Your website or organisation URL

---

## Stage 2: Version & Compatibility

Once you've answered Stage 1, I'll ask:

1. **Version** (e.g., "1.0.0")
   - Starting version number

2. **Minimum WordPress Version** (default: 6.5)
   - Lowest WP version supported

3. **Tested WordPress Version** (default: 6.7)
   - Highest WP version tested

4. **Minimum PHP Version** (default: 8.0)
   - Lowest PHP version required

---

## Stage 3: Design Tokens (Optional)

These help pre-configure theme.json:

1. **Primary Colour** (hex, e.g., "#0073aa")
2. **Secondary Colour** (hex, e.g., "#005177")
3. **Background Colour** (hex, default: "#ffffff")
4. **Text Colour** (hex, default: "#1a1a1a")
5. **Font Family** (body font, e.g., "Inter, sans-serif")
6. **Heading Font** (headings, e.g., "Poppins, sans-serif")

---

## Stage 4: Initial Content (Optional)

1. **Hero Title** (default homepage hero text)
2. **CTA Text** (call-to-action button text)
3. **Footer Text** (copyright line)

---

## Generation Command

Once I have all the information, I'll generate the theme using:

```bash
node scripts/generate-theme.js \
  --slug "{{theme_slug}}" \
  --name "{{theme_name}}" \
  --description "{{description}}" \
  --author "{{author}}" \
  --author_uri "{{author_uri}}" \
  --version "{{version}}" \
  --min_wp_version "{{min_wp_version}}" \
  --tested_wp_version "{{tested_wp_version}}" \
  --min_php_version "{{min_php_version}}"
```

After generation, I'll rewrite `package.json` and `composer.json` in the output folder with your slug, version, author, URLs, and license so npm/composer installs work without placeholders.

---

## Post-Generation Steps

After generating, I'll help you:

1. **Review the generated files**
2. **Configure theme.json** with your design tokens
3. **Set up initial patterns** based on your content
4. **Install dependencies** (`npm install`)
5. **Start development** (`npm run start`)

---

## Let's Begin!

**Please provide your answers for Stage 1:**

1. Theme Name:
2. Theme Slug:
3. Description:
4. Author Name:
5. Author URI:

_Reply with your answers, and I'll confirm them before moving to Stage 2._

---

## Example Session

**User**:

1. Tour Starter Theme
2. tour-starter
3. A modern WordPress block theme for tour operators
4. LightSpeed
5. https://developer.lsdev.biz

**Assistant**: Great! I've captured:

- **Theme Name**: Tour Starter Theme
- **Theme Slug**: tour-starter
- **Description**: A modern WordPress block theme for tour operators
- **Author**: LightSpeed
- **Author URI**: https://developer.lsdev.biz

Now let's move to Stage 2. Would you like to use defaults for version and compatibility?

- Version: 1.0.0
- Min WP: 6.5
- Tested WP: 6.7
- Min PHP: 8.0

_Type "yes" to accept defaults, or provide custom values._

---

## Related Resources

- [Generate Theme Script](../../scripts/generate-theme.js)
- [Block Theme Build Agent](../agents/block-theme-build.agent.md)
- [Development Assistant](../agents/development-assistant.agent.md)
- [Theme JSON Instructions](../instructions/theme-json.instructions.md)
