# Screenshot Placeholder for {{theme_name}}

## Required File: screenshot.png

WordPress themes require a `screenshot.png` or `screenshot.jpg` file in the root directory.

### Specifications

- **Dimensions**: 1200×900 pixels (4:3 aspect ratio)
- **Format**: PNG or JPG
- **Purpose**: Display theme preview in:
  - Appearance > Themes in WordPress admin
  - WordPress.org theme directory
  - Theme details modal

### Creating Your Screenshot

1. **Activate your theme** in WordPress
2. **Visit the front end** of your site
3. **Take a screenshot** at 1200×900px showing:
   - Header with navigation
   - Main content area
   - Footer
   - Representative content

### Tools for Creating Screenshots

- **Browser Extensions**: Full Page Screen Capture, Awesome Screenshot
- **Desktop Tools**: macOS Screenshot (Cmd+Shift+4), Windows Snipping Tool
- **Design Tools**: Figma, Photoshop, Sketch

### Best Practices

- Show the theme's unique design features
- Use representative dummy content
- Ensure good color contrast
- Avoid screenshots with actual client/personal data
- Include visible branding elements from the theme

### For This Scaffold

When generating a theme from this scaffold, replace this file with an actual `screenshot.png` at 1200×900 pixels.

**File name must be**: `screenshot.png` (lowercase, no spaces)

### Example Command (ImageMagick)

```bash
# Create a simple placeholder
convert -size 1200x900 xc:#f0f0f0 -pointsize 48 -gravity center \
  -annotate +0+0 "{{theme_name}}" screenshot.png
```

- [WordPress Theme Handbook - Theme Structure](https://developer.wordpress.org/themes/core-concepts/theme-structure/)
- [Theme Review Handbook - Required Files](https://make.wordpress.org/themes/handbook/review/required/)
