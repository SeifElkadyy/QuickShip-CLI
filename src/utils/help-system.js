import logger from './logger.js';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load help content
let helpContent = {};
try {
  const helpPath = join(__dirname, '../config/help-content.json');
  helpContent = JSON.parse(readFileSync(helpPath, 'utf-8'));
} catch (err) {
  // Fallback if file doesn't exist
}

/**
 * Show help for a specific topic
 * @param {string} topic - Topic name
 */
export function showHelp(topic) {
  const content = helpContent[topic];

  if (!content) {
    logger.warning('\n⚠️  No help available for this topic.\n');
    return;
  }

  logger.log('\n');
  logger.box('💡 ' + content.title);

  logger.header('📖 Description:', 'white');
  logger.dim('  ' + content.description);

  if (content.tips) {
    logger.header('💡 Tips:', 'white');
    content.tips.forEach((tip) => {
      logger.log(chalk.cyan('  • ' + tip));
    });
  }

  if (content.examples) {
    logger.header('📝 Examples:', 'white');
    content.examples.forEach((example) => {
      logger.log(chalk.green('  • ' + example));
    });
  }

  if (content.options) {
    logger.header('🎯 Available Options:', 'white');
    Object.entries(content.options).forEach(([key, option]) => {
      logger.log(chalk.cyan(`  ${option.name}`));
      logger.dim('    ' + option.description);
      if (option.best_for) {
        logger.log('    ' + chalk.yellow('Best for: ') + option.best_for);
      }
      if (option.pros) {
        logger.log('    ' + chalk.green('Pros: ') + option.pros.join(', '));
      }
      logger.log('');
    });
  }

  if (content.pros) {
    logger.header('✅ Pros:', 'white');
    content.pros.forEach((pro) => {
      logger.log(chalk.green('  • ' + pro));
    });
  }

  if (content.cons) {
    logger.header('❌ Cons:', 'white');
    content.cons.forEach((con) => {
      logger.log(chalk.red('  • ' + con));
    });
  }

  if (content.includes) {
    logger.header('📦 Includes:', 'white');
    content.includes.forEach((item) => {
      logger.log(chalk.cyan('  • ' + item));
    });
  }

  if (content.what_happens) {
    logger.header('🔄 What happens:', 'white');
    content.what_happens.forEach((item) => {
      logger.log(chalk.cyan('  • ' + item));
    });
  }

  logger.log('');
}

/**
 * Show stack comparison
 */
export function showStackComparison() {
  const stacks = helpContent.stack?.options || {};

  console.log('\n');
  console.log(
    boxen(chalk.bold.cyan('📊 Stack Comparison'), {
      padding: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
    })
  );

  Object.entries(stacks).forEach(([key, stack]) => {
    console.log('\n' + chalk.bold.blue('━'.repeat(60)));
    console.log(chalk.bold.cyan(`\n📌 ${stack.name}`));
    console.log(chalk.gray('   ' + stack.description));

    console.log(chalk.bold('\n   Best for: ') + chalk.yellow(stack.best_for));

    console.log(chalk.bold('\n   Tech Stack:'));
    stack.includes.forEach((tech) => {
      console.log(chalk.cyan('     • ' + tech));
    });

    console.log(
      chalk.bold('\n   Deploy to: ') + chalk.green(stack.deploy.join(', '))
    );

    if (stack.learning) {
      console.log(chalk.bold('\n   Learn more: ') + chalk.blue(stack.learning));
    }

    console.log(chalk.bold('\n   Create:'));
    console.log(chalk.gray(`     quickship build my-app --template ${key}`));
  });

  console.log('\n' + chalk.bold.blue('━'.repeat(60)));
  console.log('');
}

/**
 * Get help text for a topic
 * @param {string} topic - Topic name
 * @returns {string} Help text
 */
export function getHelpText(topic) {
  const content = helpContent[topic];
  if (!content) return null;

  let text = chalk.bold(content.title) + '\n';
  text += content.description + '\n';

  if (content.tips) {
    text += '\nTips:\n';
    content.tips.forEach((tip) => {
      text += '  • ' + tip + '\n';
    });
  }

  return text;
}

export default {
  showHelp,
  showStackComparison,
  getHelpText,
};
