---
name: "Design Token Extraction"
description: "Extract design tokens from Figma styleguides or design systems and apply them to WordPress theme.json"
applyTo: "**/*.{json,scss,css,php}"
---

# Design Token Extraction Instructions

You are a design token extraction assistant. Follow this workflow to extract design tokens from Figma styleguides, design systems, or brand guidelines and apply them to WordPress block theme configuration.

## Overview

Use these instructions when extracting design systems from external sources (Figma sites, design documentation, brand guidelines) and integrating them into a WordPress block theme via `theme.json`, block styles, and CSS.

## General Rules

- Extract complete design systems, not partial tokens
- Map design tokens to WordPress theme.json structure
- Preserve semantic naming conventions
- Create block styles for component variants
- Document token sources and rationale
- Validate all JSON before committing

## Detailed Guidance

### Phase 1: Design System Discovery

#### 1.1 Locate Design Source

**Figma Published Sites:**
```
- Use fetch_webpage tool for Figma styleguide URLs (*.figma.site/*)
- Extract HTML content including embedded design tokens
- Note: Figma MCP tools work with design files, not published sites
```

**Design Documentation:**
```
- Brand guidelines (PDF, web pages, Notion docs)
- Component libraries (Storybook, Pattern Lab)
- Design system sites (dedicated documentation)
```

**Figma Files (with Figma MCP):**
```
- Use mcp_figma_dev-mod_get_design_context for file access
- Extract variables, styles, and component properties
- Get color tokens, typography, spacing from file metadata
```

#### 1.2 Extract Design Tokens

Create a comprehensive inventory:

**Colors** (10-15 tokens minimum):
- Primary/brand colors with hex values
- Secondary/accent colors
- Base/background colors (white, grays, black)
- Semantic colors (success, warning, error, info)
- Text colors (body, headings, muted)
- Interactive states (hover, active, disabled)

**Typography** (2-4 font families):
- Font family names with weights
- Font size scale (8-12 sizes)
- Heading hierarchy (H1-H6)
- Body text sizes
- Small/metadata sizes
- Line heights for each size

**Spacing** (8-10 tokens):
- Base unit (typically 4px or 8px)
- Scale multipliers (1x, 2x, 3x, 4x, 5x, 6x, 8x, 10x)
- Standard gaps/padding values
- Section margins
- Component-specific spacing

**Layout** (2-4 widths):
- Content width (typically 700-900px)
- Wide width (typically 1200-1400px)
- Container max-width
- Sidebar widths

**Border Radius** (4-6 values):
- Small (2-4px)
- Medium (6-8px)
- Large (12-16px)
- Extra large (20-24px)
- Full/pill (50% or 9999px)

**Shadows** (3-5 presets):
- Small/subtle shadows
- Medium/default shadows
- Large/elevated shadows
- Extra large/modal shadows

**Component Variants:**
- Button styles (primary, secondary, outline, ghost, destructive)
- Badge/label styles
- Card styles
- Form input styles
- Navigation styles

### Phase 2: Map to theme.json

#### 2.1 Color Palette

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#D70025",
          "name": "Primary"
        },
        {
          "slug": "primary-hover",
          "color": "#9E0918",
          "name": "Primary Hover"
        },
        {
          "slug": "secondary",
          "color": "#142135",
          "name": "Secondary"
        }
      ],
      "gradients": [
        {
          "slug": "primary-to-secondary",
          "gradient": "linear-gradient(135deg, var(--wp--preset--color--primary) 0%, var(--wp--preset--color--secondary) 100%)",
          "name": "Primary to Secondary"
        }
      ],
      "defaultPalette": false,
      "defaultGradients": false
    }
  }
}
```

**Naming Conventions:**
- Use semantic names: `primary`, `secondary`, `accent`, `base`, `contrast`
- Include state variants: `primary-hover`, `primary-active`
- Avoid color names: Use `primary` not `red`, `secondary` not `blue`

#### 2.2 Typography

```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "slug": "inter",
          "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "name": "Inter"
        },
        {
          "slug": "raleway",
          "fontFamily": "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "name": "Raleway"
        }
      ],
      "fontSizes": [
        {
          "slug": "xs",
          "size": "0.75rem",
          "name": "XS",
          "fluid": false
        },
        {
          "slug": "sm",
          "size": "0.875rem",
          "name": "SM",
          "fluid": false
        },
        {
          "slug": "base",
          "size": "1rem",
          "name": "Base",
          "fluid": false
        },
        {
          "slug": "h-1",
          "size": "2.25rem",
          "name": "H1",
          "fluid": {
            "min": "2.25rem",
            "max": "3rem"
          }
        }
      ]
    }
  }
}
```

**Font Size Naming:**
- Use semantic scale: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`
- Or heading-based: `h-1`, `h-2`, `h-3`, `h-4`, `h-5`, `h-6`
- Enable fluid typography for headings
- Keep body text fixed size

#### 2.3 Spacing

```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        {
          "slug": "10",
          "size": "4px",
          "name": "1"
        },
        {
          "slug": "20",
          "size": "8px",
          "name": "2"
        },
        {
          "slug": "30",
          "size": "12px",
          "name": "3"
        },
        {
          "slug": "40",
          "size": "16px",
          "name": "4"
        },
        {
          "slug": "50",
          "size": "20px",
          "name": "5"
        },
        {
          "slug": "60",
          "size": "24px",
          "name": "6"
        },
        {
          "slug": "80",
          "size": "32px",
          "name": "8"
        },
        {
          "slug": "100",
          "size": "40px",
          "name": "10"
        }
      ]
    }
  }
}
```

**Spacing Scale:**
- Use 4px or 8px base unit
- Name with multipliers: `10`, `20`, `30`, `40`, `50`, `60`, `80`, `100`
- Display names can be simple: `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`

#### 2.4 Layout

```json
{
  "settings": {
    "layout": {
      "contentSize": "900px",
      "wideSize": "1280px"
    }
  }
}
```

#### 2.5 Border & Custom Settings

```json
{
  "settings": {
    "border": {
      "radius": true,
      "customRadius": [
        {
          "slug": "sm",
          "size": "4px",
          "name": "Small"
        },
        {
          "slug": "md",
          "size": "6px",
          "name": "Medium"
        },
        {
          "slug": "lg",
          "size": "8px",
          "name": "Large"
        },
        {
          "slug": "xl",
          "size": "12px",
          "name": "XL"
        },
        {
          "slug": "2xl",
          "size": "16px",
          "name": "2XL"
        },
        {
          "slug": "full",
          "size": "9999px",
          "name": "Full"
        }
      ]
    }
  }
}
```

#### 2.6 Global Styles

```json
{
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--base)",
      "text": "var(--wp--preset--color--contrast)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--inter)",
      "fontSize": "var(--wp--preset--font-size--base)",
      "lineHeight": "1.6"
    },
    "spacing": {
      "padding": {
        "top": "0",
        "right": "var(--wp--preset--spacing--60)",
        "bottom": "0",
        "left": "var(--wp--preset--spacing--60)"
      }
    },
    "elements": {
      "button": {
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "var(--wp--preset--color--base)"
        },
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--inter)",
          "fontSize": "var(--wp--preset--font-size--base)",
          "fontWeight": "600"
        },
        "border": {
          "radius": "var(--wp--preset--spacing--30)"
        },
        "spacing": {
          "padding": {
            "top": "var(--wp--preset--spacing--30)",
            "right": "var(--wp--preset--spacing--60)",
            "bottom": "var(--wp--preset--spacing--30)",
            "left": "var(--wp--preset--spacing--60)"
          }
        },
        ":hover": {
          "color": {
            "background": "var(--wp--preset--color--primary-hover)"
          }
        }
      },
      "heading": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--raleway)",
          "fontWeight": "700",
          "lineHeight": "1.2"
        }
      },
      "h1": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--h-1)",
          "fontWeight": "900"
        },
        "color": {
          "text": "var(--wp--preset--color--secondary)"
        }
      },
      "h2": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--h-2)",
          "fontWeight": "700"
        },
        "spacing": {
          "margin": {
            "top": "var(--wp--preset--spacing--60)",
            "bottom": "var(--wp--preset--spacing--40)"
          }
        }
      }
    }
  }
}
```

### Phase 3: Create Block Styles

#### 3.1 Register Block Style Variations

File: `inc/block-styles.php`

```php
<?php
/**
 * Register custom block style variations
 *
 * @package {{theme_name}}
 * @since 1.0.0
 */

function {{theme_slug}}_register_block_styles() {
	// Button variants
	register_block_style(
		'core/button',
		array(
			'name'  => 'secondary',
			'label' => __( 'Secondary', '{{theme_slug}}' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'outline',
			'label' => __( 'Outline', '{{theme_slug}}' ),
		)
	);

	register_block_style(
		'core/button',
		array(
			'name'  => 'ghost',
			'label' => __( 'Ghost', '{{theme_slug}}' ),
		)
	);

	// Badge styles for paragraphs
	register_block_style(
		'core/paragraph',
		array(
			'name'  => 'badge',
			'label' => __( 'Badge', '{{theme_slug}}' ),
		)
	);

	// Card style for groups
	register_block_style(
		'core/group',
		array(
			'name'  => 'card',
			'label' => __( 'Card', '{{theme_slug}}' ),
		)
	);
}
add_action( 'init', '{{theme_slug}}_register_block_styles' );
```

#### 3.2 Style Block Variants with SCSS

File: `src/css/style.scss`

```scss
/* Button variants */
.wp-block-button {
	&.is-style-secondary {
		.wp-block-button__link {
			background: var(--wp--preset--color--base-2);
			color: var(--wp--preset--color--secondary);
			border: none;

			&:hover {
				background: var(--wp--preset--color--base-3);
			}
		}
	}

	&.is-style-outline {
		.wp-block-button__link {
			border: 2px solid currentcolor;
			background: transparent;

			&:hover {
				background: currentcolor;
				color: var(--wp--preset--color--base);
			}
		}
	}

	&.is-style-ghost {
		.wp-block-button__link {
			background: transparent;
			color: inherit;
			text-decoration: underline;
			border: none;

			&:hover {
				text-decoration: none;
			}
		}
	}
}

/* Badge styles */
.wp-block-paragraph {
	&.is-style-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		font-size: var(--wp--preset--font-size--xs);
		font-weight: 600;
		line-height: 1.5;
		border-radius: var(--wp--preset--spacing--30);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: var(--wp--preset--color--primary);
		color: var(--wp--preset--color--base);
	}
}

/* Card styles */
.wp-block-group {
	&.is-style-card {
		background: var(--wp--preset--color--base);
		border: 1px solid var(--wp--preset--color--base-3);
		border-radius: var(--wp--preset--spacing--30);
		padding: var(--wp--preset--spacing--60);
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
		transition: box-shadow 0.2s ease;

		&:hover {
			box-shadow:
				0 10px 15px -3px rgba(0, 0, 0, 0.1),
				0 4px 6px -2px rgba(0, 0, 0, 0.05);
		}
	}
}
```

### Phase 4: Build Patterns

#### 4.1 Extract Pattern Requirements

From styleguide, identify:
- Header design (logo, navigation, colors)
- Footer design (columns, links, social media)
- Hero sections
- Card layouts
- Form styles
- Newsletter signups

#### 4.2 Create Branded Patterns

Example: Header Pattern

```php
<?php
/**
 * Title: Header
 * Slug: {{theme_slug}}/header
 * Description: Site header with logo and navigation
 * Categories: header
 * Keywords: header, navigation, menu
 * Block Types: core/template-part/header
 *
 * @package {{theme_name}}
 * @since 1.0.0
 */
?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"backgroundColor":"secondary","textColor":"base","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group has-base-color has-secondary-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">
	<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
	<div class="wp-block-group">
		<!-- wp:site-logo {"width":48} /-->
		<!-- wp:site-title {"style":{"typography":{"fontWeight":"900","fontSize":"1.75rem"}},"fontFamily":"raleway"} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:navigation {"overlayBackgroundColor":"secondary","overlayTextColor":"base","layout":{"type":"flex","justifyContent":"right"},"style":{"typography":{"fontWeight":"500"}},"fontSize":"base","fontFamily":"inter"} /-->
</div>
<!-- /wp:group -->
```

### Phase 5: Documentation

#### 5.1 Document Token Sources

Create a comment in theme.json:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "_comment": "Design tokens extracted from [Brand Name] Styleguide ([URL]) on [Date]",
  "settings": {}
}
```

#### 5.2 Create Design System Documentation

File: `docs/DESIGN_SYSTEM.md`

```markdown
# Design System

## Colors

Extracted from [Brand] styleguide ([URL])

### Brand Colors
- Primary: `#D70025` (Brand red)
- Primary Hover: `#9E0918` (Darker red for hover states)
- Secondary: `#142135` (Navy)
- Accent: `#1A3A5F` (Lighter navy)

### Base Colors
- Base: `#FFFFFF` (White)
- Base 2: `#F0F0F0` (Light gray)
- Base 3: `#DDDDDD` (Medium gray)
- Contrast: `#2C2C2C` (Almost black)

## Typography

- **Body Font:** Inter (weights: 400, 500, 600, 700)
- **Heading Font:** Raleway (weights: 400, 600, 700, 900)

### Font Sizes
[Table of font sizes with pixel values and use cases]

## Component Variants

[List all button, badge, card variants with screenshots if possible]
```

### Phase 6: Build and Validate

```bash
# Build theme assets
npm run build

# Validate theme.json
npm run validate:theme-json

# Test in WordPress
wp theme activate {{theme_slug}}
```

## Workflow Summary

1. **Fetch** styleguide using `fetch_webpage` or Figma MCP tools
2. **Extract** design tokens (colors, typography, spacing, components)
3. **Map** tokens to theme.json structure
4. **Update** theme.json with all design system values
5. **Register** block style variations in PHP
6. **Style** block variants in SCSS
7. **Create** branded patterns (header, footer, templates)
8. **Build** theme assets
9. **Document** token sources and design decisions
10. **Test** in WordPress environment

## Examples

### Complete Color Palette

```json
{
  "settings": {
    "color": {
      "palette": [
        {"slug": "primary", "color": "#D70025", "name": "Primary"},
        {"slug": "primary-hover", "color": "#9E0918", "name": "Primary Hover"},
        {"slug": "secondary", "color": "#142135", "name": "Secondary"},
        {"slug": "accent", "color": "#1A3A5F", "name": "Accent"},
        {"slug": "base", "color": "#FFFFFF", "name": "Base"},
        {"slug": "base-2", "color": "#F0F0F0", "name": "Base 2"},
        {"slug": "base-3", "color": "#DDDDDD", "name": "Base 3"},
        {"slug": "contrast", "color": "#2C2C2C", "name": "Contrast"},
        {"slug": "muted", "color": "#717182", "name": "Muted"},
        {"slug": "destructive", "color": "#D4183D", "name": "Destructive"}
      ]
    }
  }
}
```

### Complete Typography Scale

```json
{
  "settings": {
    "typography": {
      "fontSizes": [
        {"slug": "xs", "size": "0.75rem", "name": "XS"},
        {"slug": "sm", "size": "0.875rem", "name": "SM"},
        {"slug": "base", "size": "1rem", "name": "Base"},
        {"slug": "lg", "size": "1.125rem", "name": "LG"},
        {"slug": "xl", "size": "1.25rem", "name": "XL"},
        {"slug": "h-6", "size": "1rem", "name": "H6"},
        {"slug": "h-5", "size": "1.125rem", "name": "H5"},
        {"slug": "h-4", "size": "1.25rem", "name": "H4"},
        {"slug": "h-3", "size": "1.5rem", "name": "H3"},
        {"slug": "h-2", "size": "1.75rem", "name": "H2"},
        {
          "slug": "h-1",
          "size": "2.25rem",
          "name": "H1",
          "fluid": {"min": "2.25rem", "max": "3rem"}
        }
      ]
    }
  }
}
```

## Validation

- Verify all colors have semantic names (not color-based like "red" or "blue")
- Confirm spacing scale uses consistent base unit (4px or 8px)
- Check font sizes include both body and heading scales
- Ensure all component variants have corresponding CSS
- Test button states (default, hover, active, disabled)
- Validate theme.json syntax with `npm run validate:theme-json`
- Build without errors: `npm run build`

## Related Instructions

- `.github/instructions/theme-json.instructions.md` - Theme.json standards
- `.github/instructions/block-theme-development.instructions.md` - Block theme patterns
- `.github/instructions/wpcs-css.instructions.md` - CSS coding standards
- `.github/instructions/naming-conventions.instructions.md` - Naming conventions

