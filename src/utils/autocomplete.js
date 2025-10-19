import chalk from 'chalk';

/**
 * Filter function for autocomplete (simplified for standard inquirer)
 * @param {Array} choices - Array of choices
 * @param {string} input - User input
 * @returns {Array} Filtered choices
 */
export function filterChoices(choices, input = '') {
  const inputLower = input.toLowerCase();

  // If no input, return all choices
  if (!inputLower) {
    return choices;
  }

  // Filter choices based on input
  const filtered = choices.filter((choice) => {
    const value =
      typeof choice === 'string' ? choice : choice.name || choice.value;
    return value.toLowerCase().includes(inputLower);
  });

  return filtered;
}

/**
 * Get slash commands help text
 * @returns {string} Help text
 */
export function getSlashCommandsHelp() {
  return `
${chalk.cyan('Available slash commands:')}
  ${chalk.green('/')}help     - Show help for current step
  ${chalk.green('/')}list     - List all available templates
  ${chalk.green('/')}skip     - Skip current question (use default)
  ${chalk.green('/')}back     - Go back to previous question
  ${chalk.green('/')}quit     - Exit QuickShip CLI
  ${chalk.green('/')}clear    - Clear console
`;
}

/**
 * Handle slash command input
 * @param {string} input - User input
 * @param {object} context - Context object
 * @returns {Promise<string|null>} Command result or null
 */
export async function handleSlashCommand(input, context = {}) {
  if (!input || !input.startsWith('/')) {
    return null;
  }

  const command = input.toLowerCase().trim();

  switch (command) {
    case '/help':
    case '/?':
      if (context.help) {
        console.log('\n' + chalk.blue('💡 Help:'));
        console.log(context.help);
        console.log('');
      } else {
        console.log('\n' + chalk.yellow('No help available for this step.'));
        console.log(getSlashCommandsHelp());
      }
      return 'RETRY';

    case '/list':
      console.log('\n' + chalk.blue('📚 Available Templates:'));
      console.log('  • Next.js (Recommended)');
      console.log('  • T3 Stack');
      console.log('  • React + Vite');
      console.log('  • MERN Stack');
      console.log('');
      return 'RETRY';

    case '/skip':
      console.log(chalk.yellow('\n⏭  Skipping... using default value\n'));
      return 'SKIP';

    case '/back':
      console.log(chalk.yellow('\n⬅️  Going back is not yet supported\n'));
      return 'RETRY';

    case '/quit':
    case '/exit':
      console.log(chalk.red('\n👋 Goodbye!\n'));
      process.exit(0);

    case '/clear':
    case '/cls':
      console.clear();
      return 'RETRY';

    default:
      if (input.startsWith('/')) {
        console.log(chalk.yellow(`\n⚠️  Unknown command: ${input}`));
        console.log(getSlashCommandsHelp());
        return 'RETRY';
      }
      return null;
  }
}

/**
 * Add slash command support to a prompt
 * @param {object} prompt - Inquirer prompt object
 * @param {object} context - Context for help
 * @returns {object} Enhanced prompt
 */
export function addSlashCommandSupport(prompt, context = {}) {
  // Add hint to message
  const originalMessage = prompt.message || '';
  prompt.message = originalMessage + chalk.gray(' (type / for commands)');

  // Store original validate
  const originalValidate = prompt.validate;

  // Add validate function to handle slash commands
  prompt.validate = async (input) => {
    // Check for slash command
    const result = await handleSlashCommand(input, context);

    if (result === 'RETRY') {
      return false; // Will re-prompt
    } else if (result === 'SKIP') {
      return true; // Will use default
    }

    // Run original validation if provided
    if (originalValidate) {
      return originalValidate(input);
    }

    return true;
  };

  return prompt;
}

export default {
  filterChoices,
  getSlashCommandsHelp,
  handleSlashCommand,
  addSlashCommandSupport,
};
