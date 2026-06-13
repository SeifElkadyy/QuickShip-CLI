import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';

const quickshipGradient = gradient(['#00d4ff', '#7b2ff7']);

const logger = {
  welcome() {
    const ascii = [
      '',
      '  ██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗███████╗██╗  ██╗██╗██████╗',
      ' ██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██╔════╝██║  ██║██║██╔══██╗',
      ' ██║   ██║██║   ██║██║██║     █████╔╝ ███████╗███████║██║██████╔╝',
      ' ██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ╚════██║██╔══██║██║██╔═══╝',
      ' ╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗███████║██║  ██║██║██║',
      '  ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝',
      '',
    ].join('\n');
    const banner = quickshipGradient.multiline(ascii);
    console.log(banner);
    console.log(
      boxen(chalk.bold('Build Fast. Ship Faster. ⚡'), {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: 'cyan',
        textAlignment: 'center',
        width: 68,
      })
    );
  },

  showAsciiLogo() {
    const ascii = `
 ██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗███████╗██╗  ██╗██╗██████╗
██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██╔════╝██║  ██║██║██╔══██╗
██║   ██║██║   ██║██║██║     █████╔╝ ███████╗███████║██║██████╔╝
██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ╚════██║██╔══██║██║██╔═══╝
╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗███████║██║  ██║██║██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝`;
    console.log(chalk.cyan(ascii));
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

  divider() {
    console.log(chalk.gray('─'.repeat(60)));
  },
  header(text, color = 'cyan') {
    console.log(chalk[color].bold(`\n${text}\n`));
  },
  dim(message) {
    console.log(chalk.gray(message));
  },
  highlight(message) {
    console.log(chalk.cyan.bold(message));
  },
  log(message) {
    console.log(message);
  },
};

export default logger;
