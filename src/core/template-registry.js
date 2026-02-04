import Conf from 'conf';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Template registry cache
const registryCache = new Conf({
  projectName: 'quickship-cli',
  configName: 'template-registry',
  schema: {
    templates: {
      type: 'object',
      default: {},
    },
    lastFetch: {
      type: 'number',
      default: 0,
    },
    customTemplates: {
      type: 'object',
      default: {},
    },
  },
});

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Remote registry URL (for future use)
const REGISTRY_URL =
  'https://raw.githubusercontent.com/SeifElkadyy/quickship-templates/main/registry.json';

/**
 * Template definition interface
 * @typedef {Object} TemplateDefinition
 * @property {string} name - Template name
 * @property {string} description - Template description
 * @property {string} repo - GitHub repository (username/repo)
 * @property {string} [branch] - Branch to clone (default: main)
 * @property {string} category - website, mobile, or backend
 * @property {string[]} features - List of features
 * @property {boolean} recommended - Is this template recommended
 * @property {number} priority - Sort priority
 * @property {Object} [config] - Additional configuration
 */

/**
 * Get built-in templates from local config
 * @returns {Object} Templates grouped by category
 */
function getBuiltInTemplates() {
  const configPath = join(__dirname, '../config/templates.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.templates;
  }
  return {};
}

/**
 * Fetch remote template registry
 * @returns {Promise<Object|null>} Remote templates or null if failed
 */
async function fetchRemoteRegistry() {
  try {
    const response = await fetch(REGISTRY_URL, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.templates;
  } catch (error) {
    // Remote registry not available yet - this is expected
    return null;
  }
}

/**
 * Get all available templates (built-in + remote + custom)
 * @param {Object} options - Options
 * @param {boolean} options.force - Force refresh from remote
 * @param {boolean} options.includeRemote - Include remote templates
 * @returns {Promise<Object>} All templates grouped by category
 */
export async function getAllTemplates(options = {}) {
  const { force = false, includeRemote = true } = options;

  // Start with built-in templates
  const templates = getBuiltInTemplates();

  // Add custom templates
  const customTemplates = registryCache.get('customTemplates');
  for (const [name, template] of Object.entries(customTemplates)) {
    const category = template.category || 'custom';
    if (!templates[category]) {
      templates[category] = {};
    }
    templates[category][name] = template;
  }

  // Optionally fetch remote templates
  if (includeRemote) {
    const now = Date.now();
    const lastFetch = registryCache.get('lastFetch');
    let remoteTemplates = registryCache.get('templates');

    if (force || now - lastFetch > CACHE_DURATION) {
      const freshRemote = await fetchRemoteRegistry();
      if (freshRemote) {
        remoteTemplates = freshRemote;
        registryCache.set('templates', freshRemote);
        registryCache.set('lastFetch', now);
      }
    }

    // Merge remote templates (remote overrides built-in for same name)
    if (remoteTemplates && typeof remoteTemplates === 'object') {
      for (const [category, categoryTemplates] of Object.entries(
        remoteTemplates
      )) {
        if (!templates[category]) {
          templates[category] = {};
        }
        Object.assign(templates[category], categoryTemplates);
      }
    }
  }

  return templates;
}

/**
 * Get templates for a specific category
 * @param {string} category - Category name (website, mobile, backend)
 * @returns {Promise<Object>} Templates in that category
 */
export async function getTemplatesByCategory(category) {
  const templates = await getAllTemplates();
  return templates[category] || {};
}

/**
 * Get a specific template by name
 * @param {string} name - Template name
 * @returns {Promise<Object|null>} Template definition or null
 */
export async function getTemplate(name) {
  const templates = await getAllTemplates();

  for (const category of Object.values(templates)) {
    if (category[name]) {
      return category[name];
    }
  }

  return null;
}

/**
 * Add a custom template
 * @param {string} name - Template name
 * @param {TemplateDefinition} template - Template definition
 */
export function addCustomTemplate(name, template) {
  const customTemplates = registryCache.get('customTemplates');
  customTemplates[name] = {
    ...template,
    isCustom: true,
    addedAt: Date.now(),
  };
  registryCache.set('customTemplates', customTemplates);
}

/**
 * Remove a custom template
 * @param {string} name - Template name
 * @returns {boolean} True if removed, false if not found
 */
export function removeCustomTemplate(name) {
  const customTemplates = registryCache.get('customTemplates');
  if (customTemplates[name]) {
    delete customTemplates[name];
    registryCache.set('customTemplates', customTemplates);
    return true;
  }
  return false;
}

/**
 * Get all custom templates
 * @returns {Object} Custom templates
 */
export function getCustomTemplates() {
  return registryCache.get('customTemplates');
}

/**
 * Clear template cache
 */
export function clearTemplateCache() {
  registryCache.set('templates', {});
  registryCache.set('lastFetch', 0);
}

/**
 * Validate template definition
 * @param {Object} template - Template definition to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateTemplate(template) {
  const errors = [];

  if (!template.name || typeof template.name !== 'string') {
    errors.push('Template must have a name');
  }

  if (!template.description || typeof template.description !== 'string') {
    errors.push('Template must have a description');
  }

  if (
    !template.category ||
    !['website', 'mobile', 'backend', 'custom'].includes(template.category)
  ) {
    errors.push(
      'Template must have a valid category (website, mobile, backend, custom)'
    );
  }

  // For external templates, repo is required
  if (template.repo && typeof template.repo !== 'string') {
    errors.push('Template repo must be a string (username/repo format)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get template statistics
 * @returns {Promise<Object>} Statistics about available templates
 */
export async function getTemplateStats() {
  const templates = await getAllTemplates();

  const stats = {
    total: 0,
    byCategory: {},
    recommended: 0,
    custom: 0,
  };

  for (const [category, categoryTemplates] of Object.entries(templates)) {
    const count = Object.keys(categoryTemplates).length;
    stats.byCategory[category] = count;
    stats.total += count;

    for (const template of Object.values(categoryTemplates)) {
      if (template.recommended) stats.recommended++;
      if (template.isCustom) stats.custom++;
    }
  }

  return stats;
}

export default {
  getAllTemplates,
  getTemplatesByCategory,
  getTemplate,
  addCustomTemplate,
  removeCustomTemplate,
  getCustomTemplates,
  clearTemplateCache,
  validateTemplate,
  getTemplateStats,
};
