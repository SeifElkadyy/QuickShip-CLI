import logger from '../utils/logger.js';
import chalk from 'chalk';
import { confirm, isCancel, cancel } from '@clack/prompts';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import semver from 'semver';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function updateCommand() {
  try {
    logger.log('\n');
    logger.box('🔄 QuickShip CLI Update');

    logger.info('🔍 Checking for updates...\n');

    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const currentVersion = packageJson.version;

    let latestVersion;
    try {
      const { stdout } = await execAsync('npm view quickship version');
      latestVersion = stdout.trim();
    } catch {
      logger.error('✘ Could not check for updates');
      logger.dim('Make sure you have an internet connection\n');
      return;
    }

    logger.log(chalk.bold('📦 Current version: ') + chalk.cyan(currentVersion));
    logger.log(chalk.bold('✨ Latest version:  ') + chalk.green(latestVersion));

    if (semver.gte(currentVersion, latestVersion)) {
      logger.log(chalk.green("\n✅ You're already on the latest version!\n"));
      return;
    }

    logger.header("📋 What's new in v" + latestVersion + ':', 'white');
    const releaseNotes = getReleaseNotes(latestVersion);
    if (releaseNotes) {
      logger.log(releaseNotes);
    } else {
      logger.dim('  • Bug fixes and improvements');
      logger.dim('  • Performance enhancements');
    }
    logger.log('');

    const updateAnswer = await confirm({
      message: `Update to v${latestVersion}?`,
      initialValue: true,
    });

    if (isCancel(updateAnswer)) {
      cancel('Update cancelled.');
      process.exit(0);
    }

    if (!updateAnswer) {
      logger.warning('\n⏭  Update cancelled\n');
      return;
    }

    logger.info('\n⏳ Updating QuickShip CLI...\n');

    try {
      const { stdout } = await execAsync('npm list -g quickship --depth=0');
      const isGlobal = stdout.includes('quickship');
      const updateCmd = isGlobal
        ? 'npm install -g quickship@latest'
        : 'npm install quickship@latest';

      await execAsync(updateCmd);

      logger.success('✔ Successfully updated to v' + latestVersion + '!\n');
      logger.dim("🎉 Run 'quickship --version' to verify.\n");
    } catch {
      logger.error('\n✘ Update failed');
      logger.dim('Try manually: npm install -g quickship@latest\n');
    }
  } catch (error) {
    logger.error('\n✘ Error checking for updates');
    logger.dim(error.message + '\n');
  }
}

function getReleaseNotes(version) {
  const notes = {
    '0.8.0': `  • ${chalk.cyan('Interactive autocomplete system')}
  • ${chalk.cyan('Better progress indicators')}
  • ${chalk.cyan('Enhanced templates with more features')}
  • ${chalk.cyan('New commands: info, templates, doctor, update')}
  • ${chalk.cyan('Improved error messages with solutions')}
  • ${chalk.cyan('Smart defaults and recommendations')}`,
  };
  return notes[version] || null;
}

export default updateCommand;
