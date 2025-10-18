import chalk from 'chalk';
import boxen from 'boxen';

const logger = {
  welcome() {
    const banner = `
 ██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗███████╗██╗  ██╗██╗██████╗
██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██╔════╝██║  ██║██║██╔══██╗
██║   ██║██║   ██║██║██║     █████╔╝ ███████╗███████║██║██████╔╝
██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ╚════██║██╔══██║██║██╔═══╝
╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗███████║██║  ██║██║██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝

Welcome to QuickShip! Let's build something awesome. 🚀
    `;
    console.log(chalk.cyan(banner));
  },

  success(message) {
    console.log(chalk.green('✓'), message);
  },

  error(message) {
    console.log(chalk.red('✗'), message);
  },

  info(message) {
    console.log(chalk.blue('ℹ'), message);
  },

  warning(message) {
    console.log(chalk.yellow('⚠'), message);
  },

  box(message, title) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        title,
      })
    );
  },
};

export default logger;
