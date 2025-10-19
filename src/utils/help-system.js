import chalk from 'chalk';
import boxen from 'boxen';
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
    console.log(chalk.yellow('\n⚠️  No help available for this topic.\n'));
    return;
  }

  console.log('\n');
  console.log(
    boxen(chalk.bold.blue('💡 ' + content.title), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue',
    })
  );

  console.log(chalk.bold('\n📖 Description:'));
  console.log('  ' + chalk.gray(content.description));

  if (content.tips) {
    console.log(chalk.bold('\n💡 Tips:'));
    content.tips.forEach((tip) => {
      console.log(chalk.cyan('  • ' + tip));
    });
  }

  if (content.examples) {
    console.log(chalk.bold('\n📝 Examples:'));
    content.examples.forEach((example) => {
      console.log(chalk.green('  • ' + example));
    });
  }

  if (content.options) {
    console.log(chalk.bold('\n🎯 Available Options:\n'));
    Object.entries(content.options).forEach(([key, option]) => {
      console.log(chalk.cyan(`  ${option.name}`));
      console.log('    ' + chalk.gray(option.description));
      if (option.best_for) {
        console.log('    ' + chalk.yellow('Best for: ') + option.best_for);
      }
      if (option.pros) {
        console.log('    ' + chalk.green('Pros: ') + option.pros.join(', '));
      }
      console.log('');
    });
  }

  if (content.pros) {
    console.log(chalk.bold('\n✅ Pros:'));
    content.pros.forEach((pro) => {
      console.log(chalk.green('  • ' + pro));
    });
  }

  if (content.cons) {
    console.log(chalk.bold('\n❌ Cons:'));
    content.cons.forEach((con) => {
      console.log(chalk.red('  • ' + con));
    });
  }

  if (content.includes) {
    console.log(chalk.bold('\n📦 Includes:'));
    content.includes.forEach((item) => {
      console.log(chalk.cyan('  • ' + item));
    });
  }

  if (content.what_happens) {
    console.log(chalk.bold('\n🔄 What happens:'));
    content.what_happens.forEach((item) => {
      console.log(chalk.cyan('  • ' + item));
    });
  }

  console.log('');
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
