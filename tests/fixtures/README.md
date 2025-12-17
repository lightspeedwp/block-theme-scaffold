# scripts/fixtures/

This folder contains test fixtures and static data used by tests in the block theme scaffold.

## Contents

- `theme-config.test.json` - Test fixture for theme configuration validation
- `plugin-config.test.json` - Test fixture for plugin configuration validation

## Usage

Import fixtures in your tests:

```javascript
const themeConfig = require('../fixtures/theme-config.test.json');
const pluginConfig = require('../fixtures/plugin-config.test.json');
```

All fixtures should contain minimal required fields for passing tests.
