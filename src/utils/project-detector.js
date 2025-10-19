import pkg from 'fs-extra';
const { pathExists, readFile } = pkg;
import { resolve } from 'path';

/**
 * Detect the type of project in the current directory
 * @returns {Promise<string|null>} Project type or null if not detected
 */
export async function detectProjectType(projectPath = process.cwd()) {
  try {
    const packageJsonPath = resolve(projectPath, 'package.json');
    const exists = await pathExists(packageJsonPath);

    if (!exists) {
      return null;
    }

    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // T3 Stack detection (has tRPC, Prisma, NextAuth)
    if (
      deps['@trpc/server'] &&
      deps['@prisma/client'] &&
      deps['next-auth'] &&
      deps['next']
    ) {
      return 't3-stack';
    }

    // MERN Stack detection (has Express and is structured with client/server)
    if (deps['express'] && deps['mongoose']) {
      return 'mern-stack';
    }

    // Next.js detection
    if (deps['next']) {
      return 'nextjs';
    }

    // Vite detection
    if (deps['vite']) {
      return 'react-vite';
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Get package manager used in the project
 * @returns {Promise<string>} Package manager (npm, pnpm, yarn, bun)
 */
export async function detectPackageManager(projectPath = process.cwd()) {
  try {
    // Check for lock files
    if (await pathExists(resolve(projectPath, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    if (await pathExists(resolve(projectPath, 'yarn.lock'))) {
      return 'yarn';
    }
    if (await pathExists(resolve(projectPath, 'bun.lockb'))) {
      return 'bun';
    }
    // Default to npm
    return 'npm';
  } catch (error) {
    return 'npm';
  }
}

/**
 * Get build command for the project
 * @param {string} projectType - Type of project
 * @param {string} packageManager - Package manager
 * @returns {string} Build command
 */
export function getBuildCommand(projectType, packageManager = 'npm') {
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager;
  return `${runCmd} build`;
}

/**
 * Get development server port for the project
 * @param {string} projectType - Type of project
 * @returns {number} Port number
 */
export function getDevPort(projectType) {
  switch (projectType) {
    case 'nextjs':
    case 't3-stack':
      return 3000;
    case 'react-vite':
      return 5173;
    case 'mern-stack':
      return 5173; // Frontend port
    default:
      return 3000;
  }
}

/**
 * Get recommended deployment platforms for project type
 * @param {string} projectType - Type of project
 * @returns {Array<{name: string, value: string, description: string}>}
 */
export function getRecommendedPlatforms(projectType) {
  const platforms = {
    nextjs: [
      {
        name: 'Vercel (Recommended)',
        value: 'vercel',
        description: 'Optimized for Next.js, zero-config deployment',
      },
      {
        name: 'Netlify',
        value: 'netlify',
        description: 'Fast CDN, easy setup',
      },
    ],
    't3-stack': [
      {
        name: 'Vercel (Recommended)',
        value: 'vercel',
        description: 'Best for Next.js + tRPC, edge functions support',
      },
      {
        name: 'Netlify',
        value: 'netlify',
        description: 'Alternative with good Next.js support',
      },
    ],
    'react-vite': [
      {
        name: 'Netlify (Recommended)',
        value: 'netlify',
        description: 'Perfect for SPAs, instant builds',
      },
      {
        name: 'Vercel',
        value: 'vercel',
        description: 'Great performance, global CDN',
      },
    ],
    'mern-stack': [
      {
        name: 'Railway (Recommended)',
        value: 'railway',
        description: 'Easy full-stack deployment, MongoDB support',
      },
      {
        name: 'Render',
        value: 'render',
        description: 'Free tier, database hosting included',
      },
    ],
  };

  return platforms[projectType] || platforms['nextjs'];
}

/**
 * Detect required environment variables from .env.example
 * @param {string} projectPath - Path to project
 * @returns {Promise<Array<string>>} List of required env var names
 */
export async function detectRequiredEnvVars(projectPath = process.cwd()) {
  try {
    const envExamplePath = resolve(projectPath, '.env.example');
    const exists = await pathExists(envExamplePath);

    if (!exists) {
      return [];
    }

    const { readFile } = await import('fs-extra');
    const content = await readFile(envExamplePath, 'utf-8');

    // Parse env vars (format: KEY=value or KEY=)
    const lines = content.split('\n');
    const envVars = lines
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => line.split('=')[0].trim())
      .filter((key) => key.length > 0);

    return envVars;
  } catch (error) {
    return [];
  }
}

/**
 * Check if project has a valid build setup
 * @param {string} projectPath - Path to project
 * @returns {Promise<{valid: boolean, errors: Array<string>}>}
 */
export async function validateBuildSetup(projectPath = process.cwd()) {
  const errors = [];

  try {
    const packageJsonPath = resolve(projectPath, 'package.json');
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    // Check for build script
    if (!packageJson.scripts?.build) {
      errors.push('No build script found in package.json');
    }

    // Check for node_modules
    const nodeModulesExists = await pathExists(
      resolve(projectPath, 'node_modules')
    );
    if (!nodeModulesExists) {
      errors.push('Dependencies not installed (node_modules missing)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Could not read package.json'],
    };
  }
}
