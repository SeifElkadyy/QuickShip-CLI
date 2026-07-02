import logger from '../utils/logger.js';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';
import { copyFile } from 'fs/promises';
import path from 'path';
import semver from 'semver';
import { detectPackageManager } from '../utils/project-detector.js';

const execAsync = promisify(exec);

/**
 * Doctor command - Check project health
 * @param {object} options - Command options
 */
export async function doctorCommand(options = {}) {
  logger.log('\n');
  logger.box('🔍 QuickShip Doctor - Health Check');

  logger.info('⏳ Running health check...\n');

  const checks = [];
  const warnings = [];
  const errors = [];

  // Check Node.js version
  const nodeCheck = await checkNodeVersion();
  checks.push(nodeCheck);
  if (nodeCheck.status === 'error') errors.push(nodeCheck);
  if (nodeCheck.status === 'warning') warnings.push(nodeCheck);

  // Check package manager
  const pmCheck = await checkPackageManager();
  checks.push(pmCheck);

  // Check Git
  const gitCheck = await checkGit();
  checks.push(gitCheck);
  if (gitCheck.status === 'warning') warnings.push(gitCheck);

  // Check if in project directory
  const inProject = existsSync(path.join(process.cwd(), 'package.json'));

  if (inProject) {
    // Check project structure
    const structureCheck = await checkProjectStructure();
    checks.push(structureCheck);

    // Check dependencies
    const depsCheck = await checkDependencies();
    checks.push(depsCheck);
    if (depsCheck.status === 'warning') warnings.push(depsCheck);

    // Check environment variables
    const envCheck = await checkEnvVariables();
    checks.push(envCheck);
    if (envCheck.status === 'warning') warnings.push(envCheck);

    // Check TypeScript config
    const tsCheck = await checkTypeScriptConfig();
    checks.push(tsCheck);
  }

  // Display results
  logger.header('Results:', 'white');
  checks.forEach((check) => {
    const icon =
      check.status === 'ok'
        ? chalk.green('✔')
        : check.status === 'warning'
          ? chalk.yellow('⚠')
          : chalk.red('✘');
    const message = `${icon} ${check.name}: ${check.message}`;
    logger.log('  ' + message);
  });

  // Show warnings
  if (warnings.length > 0) {
    logger.log(chalk.bold('\n⚠️  WARNINGS:\n'));
    warnings.forEach((warning, index) => {
      logger.log(chalk.yellow(`${index + 1}. ${warning.details}`));
      if (warning.fix) {
        logger.log(chalk.cyan(`   Fix: ${warning.fix}\n`));
      }
    });
  }

  // Show errors
  if (errors.length > 0) {
    logger.log(chalk.bold('\n✘ ERRORS:\n'));
    errors.forEach((error, index) => {
      logger.log(chalk.red(`${index + 1}. ${error.details}`));
      if (error.fix) {
        logger.log(chalk.cyan(`   Fix: ${error.fix}\n`));
      }
    });
  }

  // Calculate health score
  const totalChecks = checks.length;
  const okChecks = checks.filter((c) => c.status === 'ok').length;
  const healthScore = Math.round((okChecks / totalChecks) * 100);

  logger.log(chalk.bold('\n📊 Overall Health: ') + getHealthBadge(healthScore));

  const fixableIssues = [...warnings, ...errors].filter((c) => c.autoFix);

  if (options.fix) {
    if (fixableIssues.length === 0) {
      logger.dim('\nNothing to auto-fix.\n');
    } else {
      logger.log(chalk.bold('\n🔧 Applying fixes:\n'));
      for (const issue of fixableIssues) {
        try {
          await issue.autoFix();
          logger.log(chalk.green(`  ✔ Fixed: ${issue.name}`));
        } catch (error) {
          logger.log(chalk.red(`  ✘ Could not fix: ${issue.name}`));
          logger.dim(`    ${error.message}`);
        }
      }
      logger.log('');
    }

    const unfixable = [...warnings, ...errors].filter((c) => !c.autoFix);
    if (unfixable.length > 0) {
      logger.dim(
        'Remaining issues need manual fixes (see suggestions above)\n'
      );
    }
  } else if (warnings.length > 0 || errors.length > 0) {
    logger.dim('\n💡 Run with --fix flag to auto-fix common issues\n');
  } else {
    logger.log(chalk.green('\n✨ Everything looks good!\n'));
  }
}

/**
 * Check Node.js version
 */
async function checkNodeVersion() {
  const currentVersion = process.version;
  const requiredVersion = '18.0.0';

  if (semver.gte(currentVersion, requiredVersion)) {
    return {
      name: 'Node.js',
      status: 'ok',
      message: `${currentVersion} (Recommended: >=${requiredVersion})`,
    };
  } else {
    return {
      name: 'Node.js',
      status: 'error',
      message: `${currentVersion} (Required: >=${requiredVersion})`,
      details: `Node.js version ${currentVersion} is too old`,
      fix: 'Update Node.js: https://nodejs.org or use nvm: nvm install 22',
    };
  }
}

/**
 * Check package manager
 */
async function checkPackageManager() {
  try {
    const { stdout } = await execAsync('npm --version');
    return {
      name: 'Package manager',
      status: 'ok',
      message: `npm ${stdout.trim()}`,
    };
  } catch (error) {
    return {
      name: 'Package manager',
      status: 'error',
      message: 'npm not found',
      details: 'npm is not installed or not in PATH',
      fix: 'Install Node.js from https://nodejs.org (includes npm)',
    };
  }
}

/**
 * Check Git
 */
async function checkGit() {
  try {
    const { stdout } = await execAsync('git --version');
    const version = stdout.trim().replace('git version ', '');
    return {
      name: 'Git',
      status: 'ok',
      message: version,
    };
  } catch (error) {
    return {
      name: 'Git',
      status: 'warning',
      message: 'Not installed',
      details: 'Git is not installed (optional but recommended)',
      fix: 'Install Git: https://git-scm.com/downloads',
    };
  }
}

/**
 * Check project structure
 */
async function checkProjectStructure() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!existsSync(packageJsonPath)) {
    return {
      name: 'Project structure',
      status: 'error',
      message: 'No package.json found',
      details: 'Not in a valid project directory',
      fix: 'Navigate to your project directory',
    };
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const projectType = packageJson.dependencies?.next
      ? 'Next.js'
      : packageJson.dependencies?.vite
        ? 'Vite'
        : packageJson.dependencies?.express
          ? 'Express'
          : 'Unknown';

    return {
      name: 'Project structure',
      status: 'ok',
      message: `Valid ${projectType} project`,
    };
  } catch (error) {
    return {
      name: 'Project structure',
      status: 'error',
      message: 'Invalid package.json',
      details: 'Could not parse package.json file',
      fix: 'Check package.json for syntax errors',
    };
  }
}

/**
 * Check dependencies
 */
async function checkDependencies() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');

  if (!existsSync(nodeModulesPath)) {
    return {
      name: 'Dependencies',
      status: 'warning',
      message: 'node_modules not found',
      details: 'Dependencies are not installed',
      fix: 'Run: npm install',
      autoFix: async () => {
        const pm = await detectPackageManager(process.cwd());
        await execAsync(`${pm} install`, { cwd: process.cwd() });
      },
    };
  }

  return {
    name: 'Dependencies',
    status: 'ok',
    message: 'Installed',
  };
}

/**
 * Check environment variables
 */
async function checkEnvVariables() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (existsSync(envExamplePath) && !existsSync(envPath)) {
    return {
      name: 'Environment variables',
      status: 'warning',
      message: '.env.local not found',
      details: '.env.example exists but .env.local is missing',
      fix: 'Copy .env.example to .env.local and fill in values',
      autoFix: async () => {
        await copyFile(envExamplePath, envPath);
      },
    };
  }

  return {
    name: 'Environment variables',
    status: 'ok',
    message: 'Configured',
  };
}

/**
 * Check TypeScript config
 */
async function checkTypeScriptConfig() {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');

  if (existsSync(tsConfigPath)) {
    try {
      JSON.parse(readFileSync(tsConfigPath, 'utf-8'));
      return {
        name: 'TypeScript config',
        status: 'ok',
        message: 'Valid',
      };
    } catch (error) {
      return {
        name: 'TypeScript config',
        status: 'error',
        message: 'Invalid',
        details: 'tsconfig.json has syntax errors',
        fix: 'Check tsconfig.json for syntax errors',
      };
    }
  }

  return {
    name: 'TypeScript config',
    status: 'ok',
    message: 'Not using TypeScript',
  };
}

/**
 * Get health badge
 */
function getHealthBadge(score) {
  if (score >= 90) {
    return chalk.green(`${score}% (Excellent) ✨`);
  } else if (score >= 75) {
    return chalk.green(`${score}% (Good) ✅`);
  } else if (score >= 50) {
    return chalk.yellow(`${score}% (Fair) ⚠️`);
  } else {
    return chalk.red(`${score}% (Poor) ❌`);
  }
}

export default doctorCommand;
