---
file_type: "instructions"
description: "Comprehensive accessibility standards for WordPress block theme development"
applyTo: "**"
version: "v3.0"
last_updated: "2025-12-07"
owners: ["LightSpeedWP Team"]
tags: ["accessibility", "a11y", "wcag", "wordpress", "block-theme"]
license: "GPL-3.0"
---

# Accessibility Standards for WordPress Block Themes

All code must conform to [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).

## Quick Reference

- ✅ Semantic HTML, proper heading hierarchy
- ✅ Keyboard accessible (Tab/Shift+Tab, Esc)
- ✅ ARIA only when needed
- ✅ 4.5:1 text contrast, 3:1 graphics
- ✅ Meaningful alt text
- ✅ Form labels and error messages
- ✅ Test with axe-core, Playwright, screen readers

## Testing

- **axe-core**: No critical violations
- **Keyboard**: Tab order, focus visible
- **Screen readers**: NVDA/VoiceOver test

See [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/) for complete guidelines.
