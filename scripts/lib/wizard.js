
/**
 * Wizard interface library for release/scaffold automation.
 *
 * Provides a pluggable registry of wizard interfaces (CLI, JSON, YAML, ENV, HTTP, stdin, mock, etc.)
 * and a main runWizard() function to delegate to the selected interface.
 *
 * @module wizard
 * @file scripts/lib/wizard.js
 *
 * @todo
 *  - Add more advanced interfaces (GUI, TUI, web, etc.)
 *  - Support conditional/branching questions and validation in CLI mode
 *  - Add schema validation for loaded configs
 *  - Improve error handling and logging
 *  - Add more integration tests and usage examples
 */

const fs = require('fs');
const path = require('path');

// Try to require inquirer if available
let inquirer = null;
try {
  inquirer = require('inquirer');
} catch (e) {
  // inquirer not installed
}

/**
 * Wizard interface registry. Add new interfaces here.
 * Each interface is an async function: (questions, options) => config
 *
 * Supported interfaces:
 * - cli: Interactive CLI (inquirer)
 * - json: Load config from JSON file
 * - env: Read config from environment variables
 * - mock: Return mock/default values
 * - http: Fetch config from HTTP endpoint (GET/POST)
 * - yaml: Load config from YAML file
 * - stdin: Read config from stdin (JSON or YAML)
 *
 * TODO: Implement interactive prompts for web/GUI interfaces in the future.
 */
const wizardInterfaces = {
  /**
   * CLI interface using inquirer for interactive prompts.
   * @async
   */
  cli: async (questions, options = {}) => {
    if (!inquirer) throw new Error('inquirer is not installed. Run `npm install inquirer` to use CLI wizard.');
    const { logger = console } = options;
    logger.info('Starting CLI wizard...');
    // TODO: Implement advanced interactive prompts (conditional, validation, etc.)
    return await inquirer.prompt(questions);
  },

  /**
   * Load configuration from a JSON file.
   * @async
   */
  json: async (questions, options = {}) => {
    const { configPath, logger = console } = options;
    if (!configPath) throw new Error('configPath required for JSON mode.');
    const absPath = path.isAbsolute(configPath)
      ? configPath
      : path.resolve(process.cwd(), configPath);
    logger.info(`Loading configuration from ${absPath}...`);
    const fileContent = fs.readFileSync(absPath, 'utf8');
    const config = JSON.parse(fileContent);
    logger.info('Configuration loaded from file.');
    return config;
  },

  /**
   * Load configuration from a YAML file.
   * @async
   */
  yaml: async (questions, options = {}) => {
    const { configPath, logger = console } = options;
    if (!configPath) throw new Error('configPath required for YAML mode.');
    let yaml;
    try {
      yaml = require('js-yaml');
    } catch (e) {
      throw new Error('js-yaml is not installed. Run `npm install js-yaml` to use YAML wizard.');
    }
    const absPath = path.isAbsolute(configPath)
      ? configPath
      : path.resolve(process.cwd(), configPath);
    logger.info(`Loading configuration from ${absPath} (YAML)...`);
    const fileContent = fs.readFileSync(absPath, 'utf8');
    const config = yaml.load(fileContent);
    logger.info('Configuration loaded from YAML file.');
    return config;
  },

  /**
   * Load configuration from environment variables.
   * @async
   */
  env: async (questions, options = {}) => {
    const { logger = console } = options;
    logger.info('Gathering configuration from environment variables...');
    const config = {};
    for (const q of questions) {
      const key = q.name || q;
      config[key] = process.env[key] || '';
    }
    return config;
  },

  /**
   * Return mock/default values for all questions (for tests/dry-run).
   * @async
   */
  mock: async (questions, options = {}) => {
    const { logger = console } = options;
    logger.info('Using mock wizard mode (for tests/dry-run)...');
    const config = {};
    for (const q of questions) {
      const key = q.name || q;
      config[key] = q.default || 'mock-value';
    }
    return config;
  },

  /**
   * Fetch configuration from an HTTP endpoint (GET or POST).
   * @async
   * @todo Add support for authentication headers, POST body, etc.
   */
  http: async (questions, options = {}) => {
    const { url, method = 'GET', headers = {}, body, logger = console } = options;
    if (!url) throw new Error('url required for http mode.');
    logger.info(`Fetching configuration from ${url} via HTTP ${method}...`);
    let fetchFn;
    try {
      fetchFn = require('node-fetch');
    } catch (e) {
      throw new Error('node-fetch is not installed. Run `npm install node-fetch` to use http wizard.');
    }
    const res = await fetchFn(url, { method, headers, body });
    if (!res.ok) throw new Error(`HTTP request failed: ${res.status} ${res.statusText}`);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    } else if (contentType.includes('yaml') || contentType.includes('yml')) {
      let yaml;
      try {
        yaml = require('js-yaml');
      } catch (e) {
        throw new Error('js-yaml is not installed. Run `npm install js-yaml` to parse YAML response.');
      }
      return yaml.load(await res.text());
    } else {
      return await res.text();
    }
  },

  /**
   * Read configuration from stdin (JSON or YAML).
   * @async
   * @todo Add support for interactive stdin prompts.
   */
  stdin: async (questions, options = {}) => {
    const { logger = console, format = 'json' } = options;
    logger.info('Reading configuration from stdin...');
    return new Promise((resolve, reject) => {
      let input = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => { input += chunk; });
      process.stdin.on('end', () => {
        try {
          if (format === 'yaml') {
            let yaml;
            try {
              yaml = require('js-yaml');
            } catch (e) {
              throw new Error('js-yaml is not installed. Run `npm install js-yaml` to parse YAML from stdin.');
            }
            resolve(yaml.load(input));
          } else {
            resolve(JSON.parse(input));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  },

  // TODO: Add more interfaces (e.g., GUI, web, TUI) as needed.
};

/**
 * Main runWizard function. Delegates to selected interface.
 * @param {object} options
 *   @param {string} [options.mode] - Wizard interface mode: cli, json, env, mock, etc.
 *   @param {string} [options.configPath] - Path to config file (for json mode).
 *   @param {object} [options.logger] - Logger instance.
 *   @param {array}  [options.questions] - Array of questions (for cli/env/mock modes).
 *   @param {object} [options.interfaceOptions] - Extra options for the interface.
 * @returns {object|Promise<object>} The collected configuration.
 */
async function runWizard(options = {}) {
  const {
    mode = 'cli',
    configPath,
    logger = console,
    questions = [],
    interfaceOptions = {},
  } = options;

  const iface = wizardInterfaces[mode];
  if (!iface) throw new Error(`Unknown wizard mode: ${mode}`);
  return await iface(questions, { configPath, logger, ...interfaceOptions });
}

// Export registry for extension
module.exports = {
  runWizard,
  wizardInterfaces,
};
