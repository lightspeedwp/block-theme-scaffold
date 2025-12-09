# Theme Structure Reference

This document defines all template parts, templates, patterns, pattern categories, and style variations available in the Block Theme Scaffold.

## Template Parts

Template parts are reusable sections that can be referenced across multiple templates.

### Available Template Parts

| File | Name | Area | Description | Usage |
|------|------|------|-------------|-------|
| `parts/header.html` | Header | `header` | Main site header with logo and navigation | All templates |
| `parts/footer.html` | Footer | `footer` | Main site footer with widgets and copyright | All templates |
| `parts/sidebar.html` | Sidebar | `sidebar` | Sidebar with widgets | `home-sidebar.html` template |
| `parts/post-meta.html` | Post Meta | `uncategorized` | Post metadata (date, author, categories) | Single post templates |
| `parts/pagination.html` | Pagination | `uncategorized` | Post navigation (prev/next) | Archive templates |
| `parts/comments.html` | Comments | `uncategorized` | Comments section with form | Single post templates |

### Template Part Registration

Template parts are registered in `theme.json`:

```json
{
  "templateParts": [
    {
      "name": "header",
      "title": "Header",
      "area": "header"
    },
    {
      "name": "footer",
      "title": "Footer",
      "area": "footer"
    },
    {
      "name": "sidebar",
      "title": "Sidebar",
      "area": "sidebar"
    },
    {
      "name": "post-meta",
      "title": "Post Meta",
      "area": "uncategorized"
    },
    {
      "name": "pagination",
      "title": "Pagination",
      "area": "uncategorized"
    },
    {
      "name": "comments",
      "title": "Comments",
      "area": "uncategorized"
    }
  ]
}
```

### Template Part Areas

WordPress defines these standard areas:

- `header` - For site headers
- `footer` - For site footers
- `sidebar` - For sidebars
- `uncategorized` - For everything else

---

## Templates

Block templates define complete page layouts using HTML with block markup.

### Available Templates

| File | Name | Description | Post Types | Priority |
|------|------|-------------|-----------|----------|
| `templates/index.html` | Index | Fallback template for all content types | All | Lowest (fallback) |
| `templates/home.html` | Blog Home | Main blog listing page | Posts page | High |
| `templates/home-sidebar.html` | Blog (with Sidebar) | Blog listing with sidebar | Posts page | Custom |
| `templates/front-page.html` | Front Page | Custom homepage design | Static front page | Highest |
| `templates/single.html` | Single Post | Individual post template | `post` | High |
| `templates/page.html` | Page | Individual page template | `page` | High |
| `templates/archive.html` | Archive | Archive listing (category, tag, date) | Archives | Medium |
| `templates/category.html` | Category | Category archive | Category | High |
| `templates/tag.html` | Tag | Tag archive | Tag | High |
| `templates/author.html` | Author | Author archive | Author | High |
| `templates/search.html` | Search | Search results | Search | High |
| `templates/404.html` | 404 | Not found error page | 404 | Highest |
| `templates/singular.html` | Singular | Generic post/page template | `post`, `page` | Low |

### Custom Templates

Custom templates allow users to choose alternative layouts. Defined in `theme.json`:

```json
{
  "customTemplates": [
    {
      "name": "blank",
      "title": "Blank",
      "postTypes": ["page", "post"]
    },
    {
      "name": "page-no-title",
      "title": "Page (No Title)",
      "postTypes": ["page"]
    },
    {
      "name": "home-sidebar",
      "title": "Blog (with Sidebar)",
      "postTypes": ["page"]
    }
  ]
}
```

### WordPress Template Hierarchy

WordPress selects templates in this order (highest priority first):

**For Single Posts:**

1. `single-{post-type}-{slug}.html`
2. `single-{post-type}.html`
3. `single.html`
4. `singular.html`
5. `index.html`

**For Pages:**

1. `page-{slug}.html`
2. `page-{id}.html`
3. `page.html`
4. `singular.html`
5. `index.html`

**For Archives:**

1. `category-{slug}.html` / `tag-{slug}.html`
2. `category.html` / `tag.html`
3. `archive.html`
4. `index.html`

---

## Patterns

Block patterns are pre-designed block layouts that users can insert into their content.

### Available Patterns

| File | Pattern Name | Category | Description | Use Case |
|------|--------------|----------|-------------|----------|
| `patterns/header.php` | Header | headers | Site header with logo and nav | Template parts |
| `patterns/footer.php` | Footer | footers | Site footer with columns | Template parts |
| `patterns/hero.php` | Hero | featured | Large hero section with CTA | Landing pages |
| `patterns/call-to-action.php` | Call to Action | call-to-action | CTA section with button | Conversions |
| `patterns/features.php` | Features | featured | Feature grid with icons | Product pages |
| `patterns/testimonials.php` | Testimonials | testimonials | Customer testimonials | Social proof |
| `patterns/post-card.php` | Post Card | posts | Single post preview card | Blog listings |
| `patterns/post-meta.php` | Post Meta | posts | Post metadata display | Single posts |
| `patterns/pagination.php` | Pagination | posts | Post navigation | Archives |
| `patterns/sidebar.php` | Sidebar | sidebar | Sidebar widget area | Sidebars |
| `patterns/comments.php` | Comments | posts | Comments section | Single posts |
| `patterns/archive-header.php` | Archive Header | headers | Archive page header | Archives |
| `patterns/author-header.php` | Author Header | headers | Author bio header | Author pages |
| `patterns/single-post-content.php` | Post Content | posts | Single post layout | Single posts |
| `patterns/no-search-results.php` | No Results | utility | Empty search results | Search pages |
| `patterns/404-content.php` | 404 Content | utility | Not found content | 404 pages |
| `patterns/query-posts-grid.php` | Posts Grid | posts | Grid layout of posts | Archives |
| `patterns/query-posts-list.php` | Posts List | posts | List layout of posts | Archives |

### Pattern Registration

Patterns are registered in `inc/block-patterns.php`:

```php
function {{namespace}}_register_block_patterns() {
    register_block_pattern_category('{{theme_slug}}/headers', array(
        'label' => __('Headers', '{{theme_slug}}'),
    ));

    register_block_pattern('{{theme_slug}}/hero', array(
        'title'       => __('Hero Section', '{{theme_slug}}'),
        'description' => __('Large hero section with heading and CTA', '{{theme_slug}}'),
        'categories'  => array('{{theme_slug}}/featured'),
        'content'     => /* pattern markup */,
    ));
}
add_action('init', '{{namespace}}_register_block_patterns');
```

### Pattern Categories

Custom pattern categories organize patterns in the inserter:

| Slug | Label | Description | Patterns |
|------|-------|-------------|----------|
| `{{theme_slug}}/headers` | Headers | Site header designs | header, archive-header, author-header |
| `{{theme_slug}}/footers` | Footers | Site footer designs | footer |
| `{{theme_slug}}/featured` | Featured | Hero and feature sections | hero, features |
| `{{theme_slug}}/call-to-action` | Call to Action | CTA sections | call-to-action |
| `{{theme_slug}}/testimonials` | Testimonials | Social proof sections | testimonials |
| `{{theme_slug}}/posts` | Posts | Blog post layouts | post-card, post-meta, pagination, etc. |
| `{{theme_slug}}/utility` | Utility | Helper patterns | 404-content, no-search-results |

---

## Style Variations

Style variations provide alternative design systems that users can switch between.

### Global Style Variations

Global variations override entire theme styles. Located in `styles/`:

| File | Name | Description | Use Case |
|------|------|-------------|----------|
| `styles/dark.json` | Dark | Dark mode color scheme | Night reading |
| `styles/light-contrast.json` | Light Contrast | High contrast light theme | Accessibility |
| `styles/high-contrast.json` | High Contrast | Maximum contrast theme | Visual impairment |

**Example structure (`styles/dark.json`):**

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Dark",
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "background",
          "color": "#1a1a1a",
          "name": "Background"
        },
        {
          "slug": "foreground",
          "color": "#ffffff",
          "name": "Foreground"
        }
      ]
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--background)",
      "text": "var(--wp--preset--color--foreground)"
    }
  }
}
```

### Block Style Variations

Block-specific variations in `styles/blocks/`:

| File | Block | Variation Name | Description |
|------|-------|----------------|-------------|
| `styles/blocks/button-primary.json` | Button | Primary | Primary button style |
| `styles/blocks/button-rounded.json` | Button | Rounded | Fully rounded buttons |
| `styles/blocks/button-outline.json` | Button | Outline | Outline button style |
| `styles/blocks/heading-serif.json` | Heading | Serif | Serif font for headings |
| `styles/blocks/heading-condensed.json` | Heading | Condensed | Narrow heading style |
| `styles/blocks/image-rounded.json` | Image | Rounded | Rounded corner images |
| `styles/blocks/image-shadow.json` | Image | Shadow | Images with drop shadow |

**Example structure (`styles/blocks/button-primary.json`):**

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Primary",
  "styles": {
    "blocks": {
      "core/button": {
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "var(--wp--preset--color--background)"
        },
        "border": {
          "radius": "4px"
        }
      }
    }
  }
}
```

### Section Style Variations

Section-level variations in `styles/sections/`:

| File | Variation Name | Description | Use Case |
|------|----------------|-------------|----------|
| `styles/sections/hero-section.json` | Hero Section | Hero-specific styles | Landing pages |
| `styles/sections/hero-overlay.json` | Hero Overlay | Hero with image overlay | Full-width heroes |
| `styles/sections/content-section.json` | Content Section | Main content area | Standard pages |
| `styles/sections/cta-section.json` | CTA Section | Call-to-action styling | Conversions |
| `styles/sections/testimonials-section.json` | Testimonials | Testimonial styling | Social proof |
| `styles/sections/features-section.json` | Features | Feature grid styling | Product pages |

---

## Theme Configuration Reference

### Minimal Configuration

For a basic theme, you need:

**Templates:**

- `index.html` (required fallback)
- `single.html` (single post)
- `page.html` (pages)
- `404.html` (error page)

**Template Parts:**

- `header.html` (site header)
- `footer.html` (site footer)

**Patterns:**

- None required (but recommended for UX)

**Style Variations:**

- None required (theme.json provides base styles)

### Standard Configuration

For a production-ready theme:

**Templates:**

- All basic templates (index, home, single, page, archive, search, 404)
- Custom templates (blank, page-no-title, home-sidebar)

**Template Parts:**

- All available (header, footer, sidebar, post-meta, pagination, comments)

**Patterns:**

- Core patterns (header, footer, hero, call-to-action)
- Post patterns (post-card, post-meta, pagination)
- Utility patterns (404-content, no-search-results)

**Style Variations:**

- Global: dark.json
- Blocks: button styles, heading styles
- Sections: hero-section, content-section

### Full Configuration

For a comprehensive theme with all options:

**All Templates:** 14 templates
**All Template Parts:** 6 template parts
**All Patterns:** 19 patterns
**All Pattern Categories:** 7 categories
**All Style Variations:** 3 global + 7 block + 6 section = 16 variations

---

## Usage in theme-config.json

Configure which elements to include in your generated theme:

```json
{
  "theme_structure": {
    "template_parts": ["header", "footer", "sidebar", "post-meta", "pagination", "comments"],
    "templates": [
      "index",
      "home",
      "front-page",
      "single",
      "page",
      "archive",
      "search",
      "404"
    ],
    "patterns": [
      "header",
      "footer",
      "hero",
      "call-to-action",
      "features",
      "testimonials",
      "post-card",
      "post-meta",
      "pagination"
    ],
    "pattern_categories": [
      {
        "slug": "tour-operator",
        "label": "Tour Operator"
      },
      {
        "slug": "headers",
        "label": "Headers"
      }
    ],
    "style_variations": {
      "global": ["dark"],
      "block_styles": ["button-primary", "button-rounded", "heading-serif"],
      "section_styles": ["hero-section", "content-section"]
    }
  }
}
```

---

## Adding New Elements

### Add a New Template

1. Create `templates/my-template.html` with block markup
2. Optionally register as custom template in `theme.json`:

```json
{
  "customTemplates": [
    {
      "name": "my-template",
      "title": "My Template",
      "postTypes": ["page"]
    }
  ]
}
```

### Add a New Template Part

1. Create `parts/my-part.html` with block markup
2. Register in `theme.json`:

```json
{
  "templateParts": [
    {
      "name": "my-part",
      "title": "My Part",
      "area": "uncategorized"
    }
  ]
}
```

### Add a New Pattern

1. Create `patterns/my-pattern.php`
2. Register in `inc/block-patterns.php`:

```php
register_block_pattern('{{theme_slug}}/my-pattern', array(
    'title'       => __('My Pattern', '{{theme_slug}}'),
    'description' => __('Pattern description', '{{theme_slug}}'),
    'categories'  => array('{{theme_slug}}/category'),
    'content'     => /* markup */,
));
```

### Add a New Style Variation

1. Create JSON file in appropriate directory:
   - Global: `styles/my-variation.json`
   - Block: `styles/blocks/my-block-variation.json`
   - Section: `styles/sections/my-section-variation.json`

2. Follow theme.json schema with `title` property

---

## Best Practices

### Templates

- Always provide `index.html` as fallback
- Keep templates minimal - use patterns for content
- Test template hierarchy thoroughly
- Use template parts for reusable sections

### Template Parts

- Keep parts focused and single-purpose
- Use consistent naming conventions
- Document which templates use each part
- Test parts in multiple contexts

### Patterns

- Provide clear descriptions
- Use semantic categories
- Include example content
- Test patterns with different widths
- Ensure accessibility

### Style Variations

- Maintain WCAG contrast ratios
- Test variations across blocks
- Keep variations consistent
- Document color changes
- Provide preview screenshots

---

## Related Documentation

- [WordPress Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)
- [Block Patterns Reference](https://developer.wordpress.org/themes/features/block-patterns/)
- [Template Parts](https://developer.wordpress.org/themes/block-themes/templates-and-template-parts/)
- [Style Variations](https://developer.wordpress.org/themes/global-settings-and-styles/style-variations/)
- [theme.json Documentation](https://developer.wordpress.org/themes/block-themes/theme-json-reference/)
