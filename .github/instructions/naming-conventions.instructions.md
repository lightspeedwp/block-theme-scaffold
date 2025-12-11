---
name: "Naming Conventions"
description: "File and code naming standards for all file types"
applyTo: "**"
---

# Naming Conventions & File Organization Instructions

> **Quick Reference**: Standard naming patterns for all file types in block-theme-scaffold.

## File Naming by Type

### JavaScript Files

**Pattern**: kebab-case with meaningful name

```
✓ Good
- file-handler.js
- data-processor.js
- api-client.js
- component-utils.js

✗ Bad
- fileHandler.js (use kebab-case)
- file_handler.js (use kebab-case)
- fh.js (not descriptive)
- FileHandler.js (not kebab-case)

Location: src/js/ or tests/js/
Example: src/js/theme-initializer.js
```

**Exports from JavaScript files:**

```javascript
// Class exports: PascalCase
export class FileHandler {}

// Function exports: camelCase
export function processData() {}

// Constant exports: UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 1024 * 1024;

// Default exports: camelCase
export default function initTheme() {}
```

### PHP Files

**Pattern**: kebab-case with meaningful name

```
✓ Good
- file-handler.php
- theme-setup.php
- block-register.php
- custom-filters.php

✗ Bad
- fileHandler.php (use kebab-case)
- file_handler.php (use kebab-case)
- FileHandler.php (not kebab-case)
- fh.php (not descriptive)

Location: inc/ or tests/php/
Example: inc/block-register.php
```

**Functions in PHP files:**

```php
// Function names: prefix_snake_case (always prefix)
function lightspeed_process_file() { }
function lightspeed_validate_input() { }

// Class names: PascalCase
class FileHandler { }
class BlockRegistry { }

// Constants: PREFIX_UPPER_SNAKE_CASE
const LIGHTSPEED_VERSION = '1.0.0';
const LIGHTSPEED_MIN_PHP = '7.4';

// Variables: $snake_case
$file_path = 'path/to/file';
$block_config = array();
```

### CSS/SCSS Files

**Pattern**: kebab-case with component or section name

```
✓ Good
- component-styles.css
- form-elements.scss
- block-gallery.scss
- utility-classes.css

✗ Bad
- componentStyles.css (use kebab-case)
- component_styles.css (use kebab-case)
- styles.css (not descriptive enough)

Location: src/css/ or styles/blocks/
Example: src/css/form-elements.scss
```

**CSS class names:**

```css
/* BEM notation: block__element--modifier */
.button {
}
.button__text {
}
.button--primary {
}
.button--primary.active {
}

/* Utility classes: utility-name (no prefix usually) */
.sr-only {
}
.flex-center {
}
.text-truncate {
}

/* State classes: .is-* or .has-* */
.is-active {
}
.is-disabled {
}
.has-sidebar {
}
```

### Markdown Documentation Files

**Pattern**: UPPER-KEBAB-CASE (all caps)

```
✓ Good
- README.md
- CONTRIBUTING.md
- ARCHITECTURE.md
- FOLDER-STRUCTURE.md
- FILE-HANDLING.md

✗ Bad
- readme.md (not all caps)
- ReadMe.md (not kebab-case)
- read-me.md (not all caps)
- fileHandling.md (not kebab-case or uppercase)

Location: docs/ or root
Example: docs/FILE-HANDLING.md
```

### Log Files

**Pattern**: YYYY-MM-DD-{process-name}.log

```
✓ Good
- 2025-12-07-eslint-check.log
- 2025-12-07-jest-tests.log
- 2025-12-07-phpcs-check.log
- 2025-12-07-build-webpack.log

✗ Bad
- eslint-check.log (missing date)
- 2025-12-07-eslint.log (vague process name)
- 2025-12-07-ESLINT-CHECK.log (not lowercase)
- eslintCheck.log (not kebab-case or dated)

Location: logs/{category}/
Example: logs/lint/2025-12-07-eslint-check.log
```

**Log file organization:**

```
logs/
├── lint/
│   ├── 2025-12-07-eslint-check.log
│   ├── 2025-12-07-stylelint-check.log
│   └── 2025-12-07-phpcs-check.log
├── test/
│   ├── 2025-12-07-jest-tests.log
│   └── 2025-12-07-phpunit-tests.log
├── build/
│   ├── 2025-12-07-webpack-build.log
│   └── 2025-12-07-babel-transpile.log
└── agents/
    ├── 2025-12-07-code-generator.log
    └── 2025-12-07-analyzer.log
```

### Report Files

**Pattern**: YYYY-MM-DD-{report-type}.{format}

```
✓ Good
- 2025-12-07-coverage.json
- 2025-12-07-bundle-analysis.json
- 2025-12-07-lighthouse-score.json
- 2025-12-07-test-results.json

✗ Bad
- coverage.json (missing date)
- 2025-12-07-coverage.txt (use .json for data)
- 2025-12-07-COVERAGE.json (use lowercase)
- coverage-2025-12-07.json (date first in filename)

Location: reports/{category}/
Example: reports/coverage/2025-12-07-coverage.json
```

**Report file organization:**

```
reports/
├── coverage/
│   ├── 2025-12-07-coverage.json
│   └── 2025-12-07-coverage-report.html
├── performance/
│   ├── 2025-12-07-bundle-analysis.json
│   ├── 2025-12-07-lighthouse-score.json
│   └── 2025-12-07-lighthouse-report.html
├── test-results/
│   ├── 2025-12-07-test-results.json
│   └── 2025-12-07-test-results-html.html
└── agents/
    ├── 2025-12-07-analysis-findings.json
    └── 2025-12-07-recommendations.md
```

### Configuration Files

**Pattern**: Specific format, usually at root or in specific folder

```
✓ Good - At root
- package.json
- composer.json
- jest.config.js
- phpunit.xml
- phpcs.xml
- webpack.config.js

✓ Good - In .github/
- .github/workflows/build.yml
- .github/workflows/test.yml

✗ Bad
- config.json (too vague)
- jest-config.js (should be jest.config.js)
- webpack-config.js (should be webpack.config.js)
```

### Temporary Files

**Pattern**: descriptive-name-{timestamp}.tmp

```
✓ Good
- placeholder-temp-1702046400.tmp
- theme-build-temp-1702046400.tmp
- test-fixture-temp-1702046400.tmp

✗ Bad
- temp.tmp (not descriptive)
- temp-file.tmp (vague)
- TEMP-FILE.tmp (not lowercase)
- placeholder-temp.tmp (no timestamp)

Location: tmp/
Cleanup: Daily (scripts/cleanup-old-files.js)
```

## Folder Naming Conventions

### Source Code Folders

```
src/
├── js/              ← JavaScript source
├── css/             ← CSS/SCSS source
└── README.md

inc/                 ← PHP source (WordPress convention)
├── custom-blocks.php
├── theme-setup.php
└── README.md

patterns/            ← WordPress block patterns
├── hero.php
├── features.php
└── README.md

parts/               ← Template parts
├── header.html
├── footer.html
└── README.md
```

### Test Folders

```
tests/
├── js/              ← JavaScript tests
│   └── test-*.js
├── php/             ← PHP tests
│   └── test-*.php
├── e2e/             ← End-to-end tests
│   └── spec-*.js
└── README.md
```

### Documentation Folders

```
docs/
├── ARCHITECTURE.md      ← Folder structure
├── FOLDER-STRUCTURE.md  ← Naming conventions
├── LOGGING.md           ← Logging standards
├── GOVERNANCE.md        ← Project policies
├── README.md            ← Documentation index
├── config/              ← Configuration docs
└── styles/              ← CSS documentation
```

### Build & Output Folders

```
build/               ← Built/compiled code (temporary)
dist/                ← Distribution files (release)
logs/                ← Process logs (gitignored)
├── lint/
├── test/
├── build/
└── agents/

tmp/                 ← Temporary work files (gitignored)
reports/             ← Generated reports (gitignored)
├── coverage/
├── performance/
├── test-results/
└── agents/
```

## Special Naming Cases

### Test Files

**Pattern**: test-{feature-name}.js or test-{feature-name}.php

```
✓ Good
- tests/js/test-file-handler.js
- tests/php/test-block-register.php
- tests/e2e/spec-theme-loading.js

✗ Bad
- tests/js/file-handler-test.js (suffix, not prefix)
- tests/js/fileHandlerTest.js (not kebab-case)
- tests/js/file-handler.spec.js (use test- not .spec)
```

### Utility/Helper Files

**Pattern**: {purpose}-utils.js or {purpose}-helpers.php

```
✓ Good
- src/js/string-utils.js
- src/js/date-utils.js
- inc/theme-helpers.php
- inc/block-helpers.php

✗ Bad
- src/js/utils.js (too vague)
- src/js/stringUtils.js (not kebab-case)
- inc/helpers.php (too vague)
```

### Hook/Event Handler Files

**Pattern**: {event}-handler.js or {hook}-handler.php

```
✓ Good
- src/js/scroll-handler.js
- src/js/click-handler.js
- inc/menu-filter-handler.php
- inc/block-register-handler.php

✗ Bad
- src/js/handler.js (too vague)
- src/js/scroll.js (vague purpose)
- inc/menu-hooks.php (too generic)
```

### Type Definition Files (TypeScript/JSDoc)

**Pattern**: {name}.types.js or types.d.ts

```
✓ Good
- src/js/file-handler.types.js
- src/js/types.d.ts
- types/block-config.d.ts

✗ Bad
- src/js/types.js (too vague)
- src/js/FileHandler.types.js (not kebab-case)
```

## Multi-Word Folder Names

**Always use kebab-case for folder names:**

```
✓ Good
- src/js/
- src/css/
- inc/
- block-patterns/
- template-parts/
- test-utils/

✗ Bad
- src/JS/ (not lowercase)
- src/Css/ (not lowercase)
- INC/ (not lowercase)
- block-patterns/ (not in WordPress conventions but acceptable if used consistently)
- templateParts/ (not kebab-case)
```

## Consistent Naming Across Repository

### Example: File Handler Feature

```
Source Code:
- src/js/file-handler.js (kebab-case)
  - export class FileHandler { } (PascalCase)
  - export function processFile() { } (camelCase)
  - export const MAX_SIZE = 1024 (UPPER_SNAKE_CASE)

Tests:
- tests/js/test-file-handler.js
  - describe('FileHandler', () => { })
  - it('should process files', () => { })

Documentation:
- docs/FILE-HANDLER.md (UPPER-KEBAB-CASE)

PHP Bridge (if needed):
- inc/file-handler.php (kebab-case)
  - function lightspeed_process_file() { } (prefix_snake_case)
  - class FileHandler { } (PascalCase)

Types:
- src/js/file-handler.types.js
  - interface FileHandlerConfig { }

Styles:
- src/css/file-handler.scss
  - .file-handler { } (BEM notation)
  - .file-handler__input { }
  - .file-handler--active { }

Tests:
- tests/js/test-file-handler.js
- tests/php/test-file-handler.php

Reports:
- reports/coverage/2025-12-07-file-handler-coverage.json

Logs:
- logs/test/2025-12-07-file-handler-tests.log
```

## When Creating New Files

### Checklist

Before naming a new file, ask:

- [ ] Is it JavaScript? → Use kebab-case.js
- [ ] Is it PHP? → Use kebab-case.php (functions: prefix_snake_case)
- [ ] Is it CSS/SCSS? → Use kebab-case.scss (classes: .kebab-case)
- [ ] Is it documentation? → Use UPPER-KEBAB-CASE.md
- [ ] Is it a log file? → Use YYYY-MM-DD-kebab-case.log
- [ ] Is it a report? → Use YYYY-MM-DD-kebab-case.json
- [ ] Is it in the right folder? → Check [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [ ] Does it follow naming conventions? → Check this file
- [ ] Will it be committed? → Use .gitignore if temporary
- [ ] Is it generated? → Place in logs/, tmp/, or reports/

## Common Mistakes to Avoid

| Mistake                   | Problem                       | Fix                                                      |
| ------------------------- | ----------------------------- | -------------------------------------------------------- |
| camelCase in files        | Inconsistent with conventions | Use kebab-case: `file-handler.js`                        |
| UPPERCASE files           | Hard to read and type         | Use kebab-case: `file-handler.js`                        |
| PascalCase in docs        | Inconsistent with conventions | Use UPPER-KEBAB-CASE: `FILE-HANDLER.md`                  |
| Inconsistent folder names | Confusing organization        | Check [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)      |
| Overly descriptive names  | Names get too long            | Balance: `file-handler.js` not `file-handler-utility.js` |
| Vague names               | Unclear purpose               | Be specific: `date-formatter.js` not `formatter.js`      |
| Mixed naming styles       | Looks unprofessional          | Pick one style and stick to it                           |
| Undated log files         | Can't track when created      | Use: `2025-12-07-process.log`                            |

## Decision Tree: What Should I Name This?

```
START: Creating a new file

Is it source code?
├─ Yes, JavaScript → kebab-case.js
├─ Yes, PHP → kebab-case.php
├─ Yes, CSS/SCSS → kebab-case.scss
└─ No → Continue

Is it documentation?
├─ Yes, feature doc → UPPER-KEBAB-CASE.md
├─ Yes, architecture/structure → UPPER-KEBAB-CASE.md
└─ No → Continue

Is it generated output?
├─ Yes, log file → YYYY-MM-DD-kebab-case.log
├─ Yes, report file → YYYY-MM-DD-kebab-case.json
├─ Yes, temporary file → kebab-case-TIMESTAMP.tmp
└─ No → Continue

Is it configuration?
├─ Yes, webpack/jest/etc → {tool}.config.js
├─ Yes, package/composer → package.json / composer.json
└─ No → Continue

RESULT: Follow pattern for your file type
```

## Version History

| Date       | Change                                      |
| ---------- | ------------------------------------------- |
| 2025-12-07 | Initial naming conventions instruction      |
| 2025-12-07 | Added file type examples                    |
| 2025-12-07 | Integrated with folder structure governance |
