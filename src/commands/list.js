import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../utils/logger.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function listCommand() {
  const templatesPath = join(__dirname, '../config/templates.json');
  const templates = JSON.parse(readFileSync(templatesPath, 'utf-8')).templates;

  logger.header('📦 Available Templates', 'cyan');

  for (const [platform, platformTemplates] of Object.entries(templates)) {
    logger.log(chalk.bold.cyan(`\n${platform.toUpperCase()}:`));

    for (const [name, template] of Object.entries(platformTemplates)) {
      const status = template.comingSoon
        ? chalk.gray('(Coming Soon)')
        : chalk.green('✓');
      const recommended = template.recommended ? '⭐' : ' ';
      logger.log(`  ${recommended} ${chalk.white(name.padEnd(30))} ${status}`);
      if (template.description) {
        logger.dim(`     ${template.description}`);
      }
    }
  }

  logger.log('\n');
}
