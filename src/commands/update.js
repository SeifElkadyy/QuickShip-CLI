import chalk from 'chalk';
import boxen from 'boxen';
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
    console.log('\n');
    console.log(
      boxen(chalk.bold.cyan('🔄 QuickShip CLI Update'), {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
      })
    );

    console.log(chalk.blue('\n🔍 Checking for updates...\n'));

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
      console.log(chalk.red('✘ Could not check for updates'));
      console.log(chalk.gray('Make sure you have an internet connection\n'));
      return;
    }

    console.log(
      chalk.bold('📦 Current version: ') + chalk.cyan(currentVersion)
    );
    console.log(chalk.bold('✨ Latest version: ') + chalk.green(latestVersion));

    // Compare versions
    if (semver.gte(currentVersion, latestVersion)) {
      console.log(chalk.green("\n✅ You're already on the latest version!\n"));
      return;
    }

    // Show what's new
    console.log(chalk.bold("\n📋 What's new in v" + latestVersion + ':\n'));
    const releaseNotes = await getReleaseNotes(latestVersion);
    if (releaseNotes) {
      console.log(releaseNotes);
    } else {
      console.log(chalk.gray('  • Bug fixes and improvements'));
      console.log(chalk.gray('  • Performance enhancements'));
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
      console.log(chalk.yellow('\n⏭  Update cancelled\n'));
      return;
    }

    // Update
    console.log(chalk.blue('\n⏳ Updating QuickShip CLI...\n'));

    try {
      // Determine if installed globally or locally
      const { stdout } = await execAsync('npm list -g quickship-cli --depth=0');
      const isGlobal = stdout.includes('quickship-cli');

      const updateCommand = isGlobal
        ? 'npm install -g quickship-cli@latest'
        : 'npm install quickship-cli@latest';

      await execAsync(updateCommand);

      console.log(
        chalk.green('✔ Successfully updated to v' + latestVersion + '!\n')
      );
      console.log(
        chalk.gray("🎉 You're all set! Run 'quickship --version' to verify.\n")
      );
    } catch (error) {
      console.log(chalk.red('\n✘ Update failed'));
      console.log(
        chalk.gray(
          'Try manually updating: npm install -g quickship-cli@latest\n'
        )
      );
    }
  } catch (error) {
    console.log(chalk.red('\n✘ Error checking for updates'));
    console.log(chalk.gray(error.message + '\n'));
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
