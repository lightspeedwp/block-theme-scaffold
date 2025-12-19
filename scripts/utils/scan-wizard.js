#!/usr/bin/env node

/**
 * scripts/utils/scan-wizard.js
 *
 * Interactive CLI wizard for reviewing and updating the mustache variable registry.
 * Guides the user through new/changed variables, prompts for metadata, and validates before saving.
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { scanMustacheVariables, categorizeVariable, inferVariableType } = require('./scan');
const registryPath = path.resolve(__dirname, '../mustache-variables-registry.json');

function loadRegistry() {
  if (fs.existsSync(registryPath)) {
    return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  }
  return { variables: {} };
}

function saveRegistry(registry) {
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

async function promptForVariableMeta(name, existing = {}) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `Variable name:`,
      default: name,
      validate: (input) => input.match(/^[a-zA-Z0-9_\-]+$/) ? true : 'Invalid variable name.'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: existing.description || ''
    },
    {
      type: 'list',
      name: 'type',
      message: 'Type:',
      choices: ['string', 'number', 'boolean', 'color', 'url', 'email', 'date', 'font', 'image', 'slug', 'version'],
      default: existing.type || inferVariableType(name)
    },
    {
      type: 'input',
      name: 'example',
      message: 'Example value:',
      default: existing.examples && existing.examples[0] ? existing.examples[0] : ''
    },
    {
      type: 'list',
      name: 'category',
      message: 'Category:',
      choices: [
        'core_identity', 'author_contact', 'versioning', 'urls', 'license',
        'design_colors', 'design_typography', 'design_layout', 'content_strings',
        'images', 'theme_metadata', 'ui_components', 'other'
      ],
      default: existing.category || categorizeVariable(name)
    }
  ]);
  return {
    name: answers.name,
    description: answers.description,
    type: answers.type,
    category: answers.category,
    examples: answers.example ? [answers.example] : []
  };
}

async function runWizard() {
  const scan = scanMustacheVariables();
  const registry = loadRegistry();
  const newVars = scan.variables;
  const oldVars = registry.variables || {};

  // Find undocumented variables
  const undocumented = Object.keys(newVars).filter((v) => !oldVars[v]);
  const updatedVars = { ...oldVars };

  for (const varName of undocumented) {
    console.log(`\nNew variable found: {{${varName}}}`);
    const meta = await promptForVariableMeta(varName, newVars[varName]);
    updatedVars[meta.name] = {
      ...newVars[varName],
      ...meta
    };
  }

  // Optionally review all variables
  const { reviewAll } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'reviewAll',
      message: 'Review/edit all variables in registry?',
      default: false
    }
  ]);

  if (reviewAll) {
    for (const varName of Object.keys(updatedVars)) {
      console.log(`\nReviewing: {{${varName}}}`);
      const meta = await promptForVariableMeta(varName, updatedVars[varName]);
      updatedVars[meta.name] = {
        ...updatedVars[varName],
        ...meta
      };
    }
  }

  // Confirm and save
  const { confirmSave } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmSave',
      message: 'Save updated registry?',
      default: true
    }
  ]);

  if (confirmSave) {
    saveRegistry({ ...scan, variables: updatedVars });
    console.log('Registry updated.');
  } else {
    console.log('No changes saved.');
  }
}

if (require.main === module) {
  runWizard();
}
