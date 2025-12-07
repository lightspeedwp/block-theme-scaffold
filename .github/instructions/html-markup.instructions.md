---
file_type: "instructions"
description: "HTML markup and template standards for WordPress block themes"
applyTo: "**/*.{html,htm,php}"
version: "v2.0"
last_updated: "2025-12-07"
owners: ["LightSpeedWP Team"]
tags: ["html", "template", "wordpress", "block-theme", "semantic"]
license: "GPL-3.0"
---

# HTML Markup Standards for WordPress Block Themes

## Validation

Use [W3C validator](https://validator.w3.org/) to ensure well-formed markup.

## Core Standards

- ✅ Semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- ✅ Proper heading hierarchy (h1-h6, sequential order)
- ✅ Self-closing elements: `<br />` with space before slash
- ✅ Lowercase tags and attributes
- ✅ Always quote attribute values (double quotes)
- ✅ Boolean attributes: `<input disabled />` not `disabled="true"`
- ✅ Tabs for indentation (match PHP code blocks)

## Block Templates

- Store in `templates/` (e.g., `index.html`, `single.html`)
- Valid block comments required: `<!-- wp:block-type -->` ... `<!-- /wp:block-type -->`
- Use `theme.json` variables for spacing, colors, typography
- Test with light and dark color schemes

## Template Parts

- Store in `parts/` (e.g., `header.html`, `footer.html`)
- Descriptive filenames reflecting purpose
- Single responsibility per part
- Prefer core blocks over custom HTML

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

See [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/) for complete guidelines.
