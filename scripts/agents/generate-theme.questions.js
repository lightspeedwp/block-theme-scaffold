// scripts/agents/generate-theme.questions.js
// Questions array for the generate-theme agent wizard (advanced, conditional, and config-driven)

const questions = [
  // Stage 1: Core Identity
  {
    type: 'input',
    name: 'name',
    message: 'Theme display name:',
    validate: val => val && val.length >= 2 ? true : 'Name must be at least 2 characters.'
  },
  {
    type: 'input',
    name: 'slug',
    message: 'Theme slug (lowercase, hyphens):',
    validate: val => /^[a-z0-9\-]{2,}$/.test(val) ? true : 'Slug must be lowercase, hyphens, min 2 chars.'
  },
  {
    type: 'input',
    name: 'author',
    message: 'Author name:',
    validate: val => val && val.length >= 2 ? true : 'Author must be at least 2 characters.'
  },
  {
    type: 'input',
    name: 'author_uri',
    message: 'Author website URL:',
    validate: val => /^https?:\/\//.test(val) ? true : 'Must be a valid URL.'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Theme description:',
    validate: val => val && val.length >= 5 ? true : 'Description must be at least 5 characters.'
  },
  // Stage 2: Versioning (defaults, can skip)
  {
    type: 'confirm',
    name: 'useVersionDefaults',
    message: 'Use default versioning (1.0.0, WP 6.5, PHP 8.0, etc)?',
    default: true
  },
  {
    type: 'input',
    name: 'version',
    message: 'Initial version (semver):',
    when: answers => !answers.useVersionDefaults,
    default: '1.0.0',
    validate: val => /^\d+\.\d+(\.\d+)?(-[\w.]+)?$/.test(val) ? true : 'Must be valid semver.'
  },
  {
    type: 'input',
    name: 'min_wp_version',
    message: 'Minimum WordPress version:',
    when: answers => !answers.useVersionDefaults,
    default: '6.5',
    validate: val => /^\d+\.\d+$/.test(val) ? true : 'Format: x.y'
  },
  {
    type: 'input',
    name: 'tested_wp_version',
    message: 'Tested up to WordPress version:',
    when: answers => !answers.useVersionDefaults,
    default: '6.7',
    validate: val => /^\d+\.\d+$/.test(val) ? true : 'Format: x.y'
  },
  {
    type: 'input',
    name: 'min_php_version',
    message: 'Minimum PHP version:',
    when: answers => !answers.useVersionDefaults,
    default: '8.0',
    validate: val => /^\d+(\.\d+)?$/.test(val) ? true : 'Format: x or x.y'
  },
  // Stage 3: Design Tokens (optional)
  {
    type: 'confirm',
    name: 'customDesignTokens',
    message: 'Configure custom colours and fonts?',
    default: false
  },
  {
    type: 'input',
    name: 'primary_color',
    message: 'Primary colour (hex):',
    when: answers => answers.customDesignTokens,
    default: '#0073aa',
    validate: val => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val) ? true : 'Must be valid hex colour.'
  },
  {
    type: 'input',
    name: 'secondary_color',
    message: 'Secondary colour (hex):',
    when: answers => answers.customDesignTokens,
    default: '#005177',
    validate: val => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val) ? true : 'Must be valid hex colour.'
  },
  {
    type: 'input',
    name: 'background_color',
    message: 'Background colour (hex):',
    when: answers => answers.customDesignTokens,
    default: '#ffffff',
    validate: val => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val) ? true : 'Must be valid hex colour.'
  },
  {
    type: 'input',
    name: 'text_color',
    message: 'Text colour (hex):',
    when: answers => answers.customDesignTokens,
    default: '#1a1a1a',
    validate: val => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val) ? true : 'Must be valid hex colour.'
  },
  {
    type: 'input',
    name: 'font_family',
    message: 'Body font family (CSS):',
    when: answers => answers.customDesignTokens,
    default: 'system-ui',
    validate: val => !!val
  },
  {
    type: 'input',
    name: 'heading_font',
    message: 'Heading font family (CSS):',
    when: answers => answers.customDesignTokens,
    default: 'inherit',
    validate: val => !!val
  },
  // Stage 4: Initial Content (optional)
  {
    type: 'confirm',
    name: 'addHeroTitle',
    message: 'Add a homepage hero title?',
    default: false
  },
  {
    type: 'input',
    name: 'hero_title',
    message: 'Homepage hero title:',
    when: answers => answers.addHeroTitle,
    default: 'Welcome',
    validate: val => !!val
  }
];

module.exports = questions;
