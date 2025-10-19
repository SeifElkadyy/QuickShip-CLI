import logger from '../utils/logger.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import semver from 'semver';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Update command - Update QuickShip CLI to latest version
 */
export async function updateCommand() {
  try {
    logger.log('\n');
    logger.box('🔄 QuickShip CLI Update');

    logger.info('🔍 Checking for updates...\n');

    // Get current version
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const currentVersion = packageJson.version;

    // Get latest version from npm
    let latestVersion;
    try {
      const { stdout } = await execAsync('npm view quickship-cli version');
      latestVersion = stdout.trim();
    } catch (error) {
      logger.error('✘ Could not check for updates');
      logger.dim('Make sure you have an internet connection\n');
      return;
    }

    logger.log(chalk.bold('📦 Current version: ') + chalk.cyan(currentVersion));
    logger.log(chalk.bold('✨ Latest version: ') + chalk.green(latestVersion));

    // Compare versions
    if (semver.gte(currentVersion, latestVersion)) {
      logger.log(chalk.green("\n✅ You're already on the latest version!\n"));
      return;
    }

    // Show what's new
    logger.header("📋 What's new in v" + latestVersion + ':', 'white');
    const releaseNotes = await getReleaseNotes(latestVersion);
    if (releaseNotes) {
      logger.log(releaseNotes);
    } else {
      logger.dim('  • Bug fixes and improvements');
      logger.dim('  • Performance enhancements');
    }

    // Ask to update
    const { shouldUpdate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldUpdate',
        message: `Update to v${latestVersion}?`,
        default: true,
      },
    ]);

    if (!shouldUpdate) {
      logger.warning('\n⏭  Update cancelled\n');
      return;
    }

    // Update
    logger.info('\n⏳ Updating QuickShip CLI...\n');

    try {
      // Determine if installed globally or locally
      const { stdout } = await execAsync('npm list -g quickship-cli --depth=0');
      const isGlobal = stdout.includes('quickship-cli');

      const updateCommand = isGlobal
        ? 'npm install -g quickship-cli@latest'
        : 'npm install quickship-cli@latest';

      await execAsync(updateCommand);

      logger.success('✔ Successfully updated to v' + latestVersion + '!\n');
      logger.dim("🎉 You're all set! Run 'quickship --version' to verify.\n");
    } catch (error) {
      logger.error('\n✘ Update failed');
      logger.dim(
        'Try manually updating: npm install -g quickship-cli@latest\n'
      );
    }
  } catch (error) {
    logger.error('\n✘ Error checking for updates');
    logger.dim(error.message + '\n');
  }
}

/**
 * Get release notes for a version
 * @param {string} version - Version number
 * @returns {string} Release notes
 */
async function getReleaseNotes(version) {
  // For now, return generic notes
  // In the future, this could fetch from GitHub releases API
  const notes = {
    '0.8.0': `  • ${chalk.cyan('Interactive autocomplete system')}
  • ${chalk.cyan('Better progress indicators')}
  • ${chalk.cyan('Enhanced templates with more features')}
  • ${chalk.cyan('New commands: info, templates, doctor, update')}
  • ${chalk.cyan('Improved error messages with solutions')}
  • ${chalk.cyan('Smart defaults and recommendations')}
  • ${chalk.cyan('Preview before project creation')}
  • ${chalk.cyan('Performance improvements')}`,
  };

  return notes[version] || null;
}

export default updateCommand;
