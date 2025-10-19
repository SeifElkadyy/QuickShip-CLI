import cliProgress from 'cli-progress';
import chalk from 'chalk';

/**
 * Create a progress bar
 * @param {string} label - Progress bar label
 * @returns {object} Progress bar instance
 */
export function createProgressBar(label = 'Progress') {
  const bar = new cliProgress.SingleBar(
    {
      format:
        chalk.cyan('{bar}') +
        ' | {percentage}% | {value}/{total} packages | {duration}s elapsed',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  return {
    start: (total) => {
      console.log(chalk.blue(`📦 ${label}...`));
      bar.start(total, 0);
    },
    update: (value) => {
      bar.update(value);
    },
    increment: () => {
      bar.increment();
    },
    stop: () => {
      bar.stop();
    },
  };
}

/**
 * Create a multi-bar progress tracker
 * @returns {object} Multi-bar instance
 */
export function createMultiBar() {
  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format:
        '  {label} ' +
        chalk.cyan('{bar}') +
        ' | {percentage}% | {value}/{total}',
    },
    cliProgress.Presets.shades_grey
  );

  return {
    create: (label, total) => {
      return multibar.create(total, 0, { label: chalk.blue(label) });
    },
    stop: () => {
      multibar.stop();
    },
  };
}

/**
 * Simulate progress with estimated time
 * @param {string} label - Task label
 * @param {number} estimatedSeconds - Estimated completion time
 * @returns {Promise} Promise that resolves when complete
 */
export async function simulateProgress(label, estimatedSeconds = 30) {
  return new Promise((resolve) => {
    const bar = createProgressBar(label);
    bar.start(100);

    let progress = 0;
    const interval = (estimatedSeconds * 1000) / 100;

    const timer = setInterval(() => {
      progress += 1;
      bar.update(progress);

      if (progress >= 100) {
        clearInterval(timer);
        bar.stop();
        resolve();
      }
    }, interval);
  });
}

export default {
  createProgressBar,
  createMultiBar,
  simulateProgress,
};
