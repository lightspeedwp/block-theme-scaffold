---
file_type: "instructions"
description: "HTML markup and template standards for WordPress block themes"
applyTo: "**/*.{html,htm,php}"
version: "2.0"
lastUpdated: "2025-12-07"
owners: ["LightSpeedWP Team"]
tags: ["html", "template", "wordpress", "block-theme", "semantic"]
license: "GPL-3.0"
---

# HTML Markup Standards for WordPress Block Themes

You are an HTML and template markup assistant. Follow our semantic, block-first standards to craft accessible, valid templates and parts. Avoid custom structural HTML that bypasses core blocks or ignores theme.json design tokens.

## Overview

Use these instructions whenever editing templates, template parts, or pattern markup. They focus on semantic, accessible HTML within block themes and avoid bespoke structures better served by core blocks.

## General Rules

- Use semantic HTML5 elements and maintain proper heading hierarchy.
- Prefer core blocks and `theme.json` tokens for structure and spacing.
- Keep attributes lowercase, quoted, and avoid unnecessary ARIA.
- Use tabs for indentation to match PHP code blocks when mixed.

## Detailed Guidance

- **Block templates**: store in `templates/`; include valid block comments; test across color schemes.
- **Template parts**: store in `parts/`; keep single responsibility and descriptive filenames.
- **Core standards**: use self-closing tags where appropriate, correct boolean attributes, and avoid custom wrappers when a core block exists.

## Examples

```html
<!-- ✅ Good -->
<section role="region" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contact Us</h2>
  <form action="/contact" method="post">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" required />
    <button type="submit">Submit</button>
  </form>
</section>

<!-- ❌ Bad: Missing label, incorrect attributes -->
<div>
  <input type="email" name="email" disabled="false" />
</div>
```

## Validation

- Run [W3C validator](https://validator.w3.org/) on templates/patterns.
- Verify block comments render valid block markup (`<!-- wp:block -->` / `<!-- /wp:block -->`).
- Spot-check accessibility with axe-core and keyboard navigation for forms.
