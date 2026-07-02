import logger from '../utils/logger.js';
import chalk from 'chalk';
import { showStackComparison } from '../utils/help-system.js';
import { listCommand } from './list.js';

/**
 * Templates command - List available templates with details
 * @param {object} options - Command options
 */
export async function templatesCommand(options = {}) {
  if (options.compare) {
    showStackComparison();
    return;
  }

  await listCommand();

  logger.header('💡 Helpful Commands:', 'white');
  logger.log(
    chalk.cyan('  quickship templates --compare') +
      chalk.gray('  - Compare all templates side-by-side')
  );
  logger.log(
    chalk.cyan('  quickship build') +
      chalk.gray('                 - Create a new project (interactive)')
  );

  logger.header('📚 Documentation:', 'white');
  logger.log(
    chalk.blue('  https://github.com/SeifElkadyy/QuickShip-CLI#templates')
  );
  logger.log('');
}

export default templatesCommand;
