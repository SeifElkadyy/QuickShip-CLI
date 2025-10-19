import logger from '../utils/logger.js';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Info command - Show project information
 */
export async function infoCommand() {
  try {
    logger.log('\n');
    logger.box('📊 QuickShip CLI - Project Info');

    // Check if we're in a project directory
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      logger.warning('⚠️  Not in a project directory');
      logger.dim('Run this command inside a QuickShip project\n');
      return;
    }

    // Read package.json
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Detect project type
    const projectType = detectProjectType(packageJson);

    // Get Node.js version
    const nodeVersion = process.version;

    // Get package manager
    const packageManager = await detectPackageManager();

    // Get Git status
    const gitInitialized = existsSync(path.join(process.cwd(), '.git'));

    // Show info
    logger.log(chalk.bold('\n🔍 Detected Project: ') + chalk.cyan(projectType));
    logger.log(chalk.bold('📁 Location: ') + chalk.gray(process.cwd()));
    logger.log(
      chalk.bold('📦 Package Manager: ') + chalk.green(packageManager)
    );
    logger.log(chalk.bold('🔧 Node.js: ') + chalk.green(nodeVersion));

    // Show features
    logger.header('📚 Installed Features:', 'white');
    const features = detectFeatures(packageJson);
    features.forEach((feature) => {
      logger.log(chalk.green('  ✔ ' + feature));
    });

    // Show missing features
    logger.header('💡 Available to add:', 'white');
    const missingFeatures = getMissingFeatures(packageJson, projectType);
    if (missingFeatures.length > 0) {
      missingFeatures.forEach((feature) => {
        logger.log(
          chalk.cyan(`  quickship add ${feature.command}`) +
            chalk.gray(` - ${feature.description}`)
        );
      });
    } else {
      logger.dim('  All major features installed!');
    }

    // Show quick commands
    logger.header('🚀 Quick Commands:', 'white');
    const scripts = packageJson.scripts || {};
    if (scripts.dev) {
      logger.log(
        chalk.cyan(
          `  ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}dev`
        ) + chalk.gray(' - Start development server')
      );
    }
    if (scripts.build) {
      logger.log(
        chalk.cyan(
          `  ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}build`
        ) + chalk.gray(' - Build for production')
      );
    }
    if (scripts.lint) {
      logger.log(
        chalk.cyan(
          `  ${packageManager} ${packageManager === 'npm' ? 'run ' : ''}lint`
        ) + chalk.gray(' - Run ESLint')
      );
    }

    // Documentation link
    logger.header('📚 Documentation:', 'white');
    logger.log(
      chalk.blue('  https://github.com/SeifElkadyy/QuickShip-CLI#readme')
    );

    logger.log('');
  } catch (error) {
    logger.error('✘ Error reading project information');
    logger.dim(error.message + '\n');
  }
}

/**
 * Detect project type from package.json
 */
function detectProjectType(packageJson) {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (deps['next']) {
    if (deps['@trpc/server']) {
      return 'T3 Stack (Next.js + tRPC + Prisma)';
    }
    return `Next.js ${deps['next'].replace('^', '')}`;
  }

  if (deps['vite']) {
    return `React + Vite ${deps['vite'].replace('^', '')}`;
  }

  if (deps['express'] && deps['mongoose']) {
    return 'MERN Stack (MongoDB + Express + React + Node.js)';
  }

  if (deps['react']) {
    return 'React Application';
  }

  return 'Unknown Project Type';
}

/**
 * Detect package manager
 */
async function detectPackageManager() {
  const cwd = process.cwd();

  if (existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    try {
      const { stdout } = await execAsync('pnpm --version');
      return `pnpm ${stdout.trim()}`;
    } catch {
      return 'pnpm';
    }
  }

  if (existsSync(path.join(cwd, 'yarn.lock'))) {
    try {
      const { stdout } = await execAsync('yarn --version');
      return `yarn ${stdout.trim()}`;
    } catch {
      return 'yarn';
    }
  }

  if (existsSync(path.join(cwd, 'bun.lockb'))) {
    try {
      const { stdout } = await execAsync('bun --version');
      return `bun ${stdout.trim()}`;
    } catch {
      return 'bun';
    }
  }

  try {
    const { stdout } = await execAsync('npm --version');
    return `npm ${stdout.trim()}`;
  } catch {
    return 'npm';
  }
}

/**
 * Detect installed features
 */
function detectFeatures(packageJson) {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const features = [];

  if (deps['typescript']) features.push('TypeScript');
  if (deps['tailwindcss']) features.push('Tailwind CSS');
  if (deps['eslint']) features.push('ESLint');
  if (deps['prettier']) features.push('Prettier');
  if (existsSync(path.join(process.cwd(), '.git')))
    features.push('Git initialized');
  if (existsSync(path.join(process.cwd(), 'components.json')))
    features.push('shadcn/ui');
  if (deps['next-auth']) features.push('NextAuth.js');
  if (deps['prisma'] || deps['@prisma/client']) features.push('Prisma ORM');
  if (deps['@trpc/server']) features.push('tRPC');
  if (deps['mongoose']) features.push('MongoDB + Mongoose');
  if (deps['stripe']) features.push('Stripe');

  return features;
}

/**
 * Get missing features that can be added
 */
function getMissingFeatures(packageJson, projectType) {
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const missing = [];
  const isNextJS = projectType.includes('Next.js');

  if (isNextJS && !existsSync(path.join(process.cwd(), 'components.json'))) {
    missing.push({
      command: 'shadcn',
      description: 'Add shadcn/ui component library',
    });
  }

  if (!deps['next-auth'] && !deps['@clerk/nextjs']) {
    missing.push({
      command: 'auth',
      description: 'Add authentication (NextAuth/Clerk)',
    });
  }

  if (!deps['prisma'] && !deps['mongoose']) {
    missing.push({
      command: 'database',
      description: 'Add database (Prisma/MongoDB)',
    });
  }

  return missing;
}

export default infoCommand;
