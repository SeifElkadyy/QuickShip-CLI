import chalk from 'chalk';
import boxen from 'boxen';

const LOGOS = {
  main: `
 ██████╗ ██╗   ██╗██╗ ██████╗██╗  ██╗███████╗██╗  ██╗██╗██████╗
██╔═══██╗██║   ██║██║██╔════╝██║ ██╔╝██╔════╝██║  ██║██║██╔══██╗
██║   ██║██║   ██║██║██║     █████╔╝ ███████╗███████║██║██████╔╝
██║▄▄ ██║██║   ██║██║██║     ██╔═██╗ ╚════██║██╔══██║██║██╔═══╝
╚██████╔╝╚██████╔╝██║╚██████╗██║  ██╗███████║██║  ██║██║██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝
Welcome to QuickShip! Let's build something awesome. 🚀`,

  small: `
          ▝▀▚▄     ▄▄▄█▀▀▀▀▀▀▀█▄▄
         ▀▙▄▄  ▝▜▌  ▗▄▄▙▄▟▟██▄▄▀█▖
              ▟▘▄▛▀▘       ▘▝▜██▌
           ▗█▘▟▛ ▗▄▟██▙▄      ▀▜▌
          ▄█▚▟▘ ▄████▜▀▜▀▛▛▛▜▜▀▀█▙▄▄
      ▄▟▟█▀▀▀   ▝▝            ▝▘▀█▛
         ▜▙▄▗                 ▄▛▘
      ▝█▀▀▀▜▀▀▀██▙▄▄▄▄▄▖    ▄▛▀
       ▀▛▙▙▄▄▗      ▘▀▀▀▀█▜▛▘`,

  full: `
                             ▄▄▖
                             ███
      ▗▄                      █▖
       ▝▜▟▄                ▗▗▄▟▙
          ▝▀▚▄     ▄▄▄█▀▀▀▀▀▀▀▀▀▀▀█▄▄
    ▄▄▖▖          ▐▙▞               ▀▜▄
     ▝▀▀▀▙▄▄       ▝▜▌  ▗▄▄▙▄▟▟███▄▄▄▄▀█▖
                    ▟▘▄▛▀▘▘         ▘▝▜██▌
   ▗▄▄▄▄▄▄▄       ▗█▘▟▛ ▗▄▟██▙▄         ▀▜▌
    ▝            ▄█▚▟▘ ▄██████▜▀▜▀▛▛▛▛▛▛▜▜▜▀▀▀█▙▄▄▄▄▗▖
        ▄▄▄▟▟▟▟█▀▀▀▀   ▝▝                         ▝▝▘▀█▛
       ▝█▘                                          ▄▛▘
        ▜▙▄▗                                      ▄▛▘
     ▗▄▖▝█▀▀▀▀▀▜▀▀▀▀▀██▙▄▄▄▄▄▄▄▄▄▄▄▖            ▄▛▀
      ▝▀▀▛▙▙▄▄▗            ▝▝ ▘  ▘▀▀▀▀▀▀█▜▚▜▞█▟▛▘
             ▀▀▀▜█▟▄▄▖                    ▗▄▟▀▘
                    ▀▀▀▛▜▄▄▖▖         ▗▗▄▛▀
                      ▄▄▄▖▝▀▀▀█▙▙▟▄▟▛▀▀▀
                        ▀▀▀▀▟▄▄▗ ▝▀▀▜▄▄▗
                              ▝▀▀▜▄   ▝▀▀`,
};

const logger = {
  // Show main welcome banner
  welcome() {
    console.log(chalk.cyan(LOGOS.main));
  },

  // Show small logo for loading, processing, etc.
  showLogo(color = 'cyan') {
    console.log(chalk[color](LOGOS.small));
  },

  // Show small logo with a message below it
  logoWithMessage(message, color = 'cyan') {
    console.log(chalk[color](LOGOS.small));
    console.log(chalk.white(`\n    ${message}\n`));
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

  // Divider for visual separation
  divider() {
    console.log(chalk.gray('─'.repeat(60)));
  },

  // Styled header text
  header(text, color = 'cyan') {
    console.log(chalk[color].bold(`\n${text}\n`));
  },

  // Dim/muted text for less important info
  dim(message) {
    console.log(chalk.gray(message));
  },

  // Highlight important text
  highlight(message) {
    console.log(chalk.cyan.bold(message));
  },

  // Plain console.log wrapper for consistency
  log(message) {
    console.log(message);
  },
};

export default logger;
