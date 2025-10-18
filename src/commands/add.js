import logger from '../utils/logger.js';
import { execa } from 'execa';
import Spinner from '../utils/spinner.js';
import pkg from 'fs-extra';
const { pathExists, readJson } = pkg;
import { join } from 'path';

const spinner = new Spinner();

export async function addCommand(feature, options) {
  try {
    // Detect project type
    const projectType = await detectProjectType();

    if (!projectType) {
      logger.error(
        'No supported project detected. Make sure you are in a Next.js or React project directory.'
      );
      process.exit(1);
    }

    logger.info(`Detected project type: ${projectType}`);

    // Add the requested feature
    switch (feature) {
      case 'shadcn':
      case 'shadcn-ui':
      case 'ui':
        await addShadcn(projectType);
        break;

      case 'auth':
      case 'nextauth':
        await addAuth(projectType);
        break;

      case 'database':
      case 'db':
      case 'prisma':
        await addDatabase(projectType);
        break;

      default:
        logger.error(
          `Unknown feature: ${feature}\n\nAvailable features:\n  - shadcn (shadcn/ui components)\n  - auth (NextAuth.js)\n  - database (Prisma)`
        );
        process.exit(1);
    }
  } catch (error) {
    logger.error(`Failed to add ${feature}`);
    if (options.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

async function detectProjectType() {
  const cwd = process.cwd();

  // Check if package.json exists
  const packageJsonPath = join(cwd, 'package.json');
  const exists = await pathExists(packageJsonPath);

  if (!exists) {
    return null;
  }

  const packageJson = await readJson(packageJsonPath);
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Check for Next.js
  if (deps.next) {
    return 'nextjs';
  }

  // Check for React + Vite
  if (deps.react && deps.vite) {
    return 'react-vite';
  }

  // Check for React (general)
  if (deps.react) {
    return 'react';
  }

  return null;
}

async function addShadcn(projectType) {
  if (projectType !== 'nextjs') {
    logger.error('shadcn/ui is only supported for Next.js projects');
    process.exit(1);
  }

  spinner.start('Initializing shadcn/ui...');

  try {
    await execa('npx', ['shadcn@latest', 'init', '-y', '--defaults'], {
      stdio: 'inherit',
    });

    spinner.succeed('shadcn/ui initialized successfully!');

    logger.success('\nshadcn/ui is now set up!');
    logger.info('\nNext steps:');
    logger.info('  - Add components: npx shadcn@latest add button');
    logger.info('  - Browse components: https://ui.shadcn.com');
  } catch (error) {
    spinner.fail('Failed to initialize shadcn/ui');
    throw error;
  }
}

async function addAuth(projectType) {
  if (projectType !== 'nextjs') {
    logger.error('NextAuth.js is only supported for Next.js projects');
    process.exit(1);
  }

  spinner.start('Installing NextAuth.js...');

  try {
    // Install NextAuth
    await execa('npm', ['install', 'next-auth'], {
      stdio: 'pipe',
    });

    spinner.succeed('NextAuth.js installed successfully!');

    logger.success('\nNextAuth.js is now installed!');
    logger.info('\nNext steps:');
    logger.info('  1. Create app/api/auth/[...nextauth]/route.ts');
    logger.info('  2. Configure providers in the route');
    logger.info('  3. Wrap your app with SessionProvider');
    logger.info('\nDocumentation: https://next-auth.js.org');
  } catch (error) {
    spinner.fail('Failed to install NextAuth.js');
    throw error;
  }
}

async function addDatabase(projectType) {
  if (projectType !== 'nextjs' && projectType !== 'react-vite') {
    logger.error('Prisma is supported for Next.js and React projects');
    process.exit(1);
  }

  spinner.start('Installing Prisma...');

  try {
    // Install Prisma
    await execa('npm', ['install', '@prisma/client'], {
      stdio: 'pipe',
    });

    await execa('npm', ['install', '-D', 'prisma'], {
      stdio: 'pipe',
    });

    spinner.succeed('Prisma installed successfully!');

    spinner.start('Initializing Prisma...');

    await execa('npx', ['prisma', 'init'], {
      stdio: 'inherit',
    });

    spinner.succeed('Prisma initialized!');

    logger.success('\nPrisma is now set up!');
    logger.info('\nNext steps:');
    logger.info('  1. Define your schema in prisma/schema.prisma');
    logger.info('  2. Run: npx prisma migrate dev --name init');
    logger.info('  3. Run: npx prisma generate');
    logger.info('\nDocumentation: https://www.prisma.io/docs');
  } catch (error) {
    spinner.fail('Failed to set up Prisma');
    throw error;
  }
}
