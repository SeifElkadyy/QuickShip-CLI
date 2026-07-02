import logger from '../utils/logger.js';
import chalk from 'chalk';
import {
  addCustomTemplate,
  removeCustomTemplate,
  getCustomTemplates,
  validateTemplate,
} from '../core/template-registry.js';

/**
 * Register a custom template from a GitHub repo
 * @param {string} repo - GitHub repo in "user/repo" format
 * @param {object} options - Command options
 */
export async function templateAddCommand(repo, options = {}) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    logger.error(
      `Invalid repo format: ${repo}\n\nExpected format: username/repo (e.g. vercel/next-app-template)`
    );
    process.exit(1);
  }

  const name = options.name || repo.split('/')[1];

  const template = {
    name,
    description: options.description || `Custom template from ${repo}`,
    repo,
    category: options.category || 'custom',
  };

  const validation = validateTemplate(template);
  if (!validation.valid) {
    logger.error(`Invalid template:\n${validation.errors.join('\n')}`);
    process.exit(1);
  }

  const existing = getCustomTemplates();
  if (existing[name]) {
    logger.error(
      `A custom template named "${name}" already exists. Use --name to choose a different name or run "quickship template remove ${name}" first.`
    );
    process.exit(1);
  }

  addCustomTemplate(name, template);

  logger.success(`\nTemplate "${name}" added!`);
  logger.info(`\nUse it with:`);
  logger.dim(`  quickship build my-app --template ${name}\n`);
}

/**
 * Remove a custom template
 * @param {string} name - Template name
 */
export async function templateRemoveCommand(name) {
  const removed = removeCustomTemplate(name);
  if (!removed) {
    logger.error(`No custom template named "${name}" found.`);
    process.exit(1);
  }
  logger.success(`Template "${name}" removed.`);
}

/**
 * List custom templates
 */
export async function templateListCommand() {
  const templates = getCustomTemplates();
  const names = Object.keys(templates);

  logger.header('📦 Custom Templates', 'cyan');

  if (names.length === 0) {
    logger.dim(
      '\n  No custom templates yet. Add one with:\n  quickship template add <username/repo>\n'
    );
    return;
  }

  for (const name of names) {
    const template = templates[name];
    logger.log(`\n  ${chalk.bold(name)} ${chalk.gray(`(${template.repo})`)}`);
    if (template.description) {
      logger.dim(`    ${template.description}`);
    }
  }
  logger.log('\n');
}

export default {
  templateAddCommand,
  templateRemoveCommand,
  templateListCommand,
};
