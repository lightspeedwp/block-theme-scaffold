---
file_type: "instructions"
description: "JavaScript, React, and JSDoc standards for WordPress development"
applyTo: "**/*.{js,jsx,ts,tsx,mjs,cjs}"
version: "v2.0"
last_updated: "2025-12-07"
owners: ["LightSpeedWP Team"]
tags: ["javascript", "react", "jsdoc", "wordpress", "blocks"]
license: "GPL-3.0"
---

# JavaScript Development Standards for WordPress

You are a JavaScript and block editor assistant. Follow our WordPress and block-editor conventions to build modern, testable scripts for the theme. Avoid legacy patterns (`var`, class components) or bypassing lint/i18n requirements.

## Overview

Use these instructions for all JavaScript and TypeScript authored in the scaffold, especially block editor code. They complement PHP/CSS standards and do not replace project governance or build instructions.

## General Rules

- Prefer modern ES modules with `const`/`let`, arrow functions, and WordPress packages.
- Keep code i18n-ready using `@wordpress/i18n`; avoid string concatenation.
- Follow naming conventions (camelCase/PascalCase/UPPER_SNAKE_CASE) and required semicolons.
- Add tests with Jest/React Testing Library where applicable and keep lint clean.

## Detailed Guidance

Refer to the sections below for formatting, React hooks usage, block development patterns, JSDoc conventions, and translation helpers tailored to the block editor.

## Formatting

- **Indentation**: 2 spaces (no tabs)
- **Line length**: 80 characters (soft limit)
- **Quotes**: Single quotes for strings, template literals for interpolation
- **Semicolons**: Required
- **Naming**: `camelCase` for variables/functions, `PascalCase` for classes/components, `UPPER_SNAKE_CASE` for constants

## Modern JavaScript

- Use `const`/`let` (never `var`)
- Prefer arrow functions for callbacks
- Use ES6+ features (destructuring, spread, etc.)
- Strict equality (`===`, `!==`)

## React & Hooks

- Functional components with hooks
- `useState`, `useEffect`, `useCallback`, `useMemo`
- WordPress hooks: `useSelect`, `useDispatch`, `useBlockProps`

```javascript
import { useState, useCallback } from 'react';
import { useSelect } from '@wordpress/data';

const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  
  const posts = useSelect((select) => 
    select('core').getEntityRecords('postType', 'post')
  , []);
  
  return <div>{title}: {count}</div>;
};
```

## Block Development

Use `@wordpress/*` packages:

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

registerBlockType('plugin/block', {
  edit: ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    return (
      <div {...blockProps}>
        <RichText
          value={attributes.content}
          onChange={(content) => setAttributes({ content })}
        />
      </div>
    );
  },
});
```

## JSDoc Documentation

```javascript
/**
 * Fetches posts from REST API.
 *
 * @param {Object} options - Fetch options
 * @param {string} options.search - Search term
 * @param {number} [options.limit=10] - Number of posts
 * @returns {Promise<Array>} Array of post objects
 *
 * @example
 * const posts = await fetchPosts({ search: 'hello', limit: 20 });
 */
export async function fetchPosts({ search = '', limit = 10 } = {}) {
  // Implementation
}
```

## Internationalization

```javascript
import { __, _n, sprintf } from '@wordpress/i18n';

// Simple translation
const label = __('Save Changes', 'textdomain');

// With placeholder
const greeting = sprintf(__('Hello %s!', 'textdomain'), userName);

// Pluralization
const message = _n('One item', '%d items', count, 'textdomain');
```

## Testing

- Use Jest for unit tests
- `@testing-library/react` for component tests
- Run ESLint with WordPress config

See [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/) for complete guidelines.

## Examples

- Block registration snippet in "Block Development" shows preferred imports and attribute handling.
- React component example under "React & Hooks" illustrates hook usage and data selection.

## Validation

- Run `npm run lint` (or `npm run lint:js`) and `npm run test:js` before merging.
- Ensure translations load via `@wordpress/i18n` and text domains match `{{theme_slug}}`.
- Type-check TypeScript definitions if present (`tsc --noEmit`).

## References

- `.github/instructions/wpcs-php.instructions.md` (for server-side integration)
- `.github/instructions/i18n.instructions.md`
- `.github/instructions/naming-conventions.instructions.md`
- WordPress JavaScript Coding Standards documentation
