import pkg from 'fs-extra';
const { pathExists, writeFile, ensureDir, readFile, appendFile } = pkg;
import { join } from 'path';
import { detectPackageManager } from './project-detector.js';
import logger from './logger.js';

/**
 * React + Vite is a browser-only SPA: every env var it reads ships in the
 * public bundle. Refuse integrations that need a server-side secret
 * (API keys, DB connection strings) instead of leaking them.
 */
export function assertServerProject(name, projectType) {
  if (projectType !== 'react-vite' && projectType !== 'react') return;
  logger.error(
    `${name} needs a server-side secret, but React + Vite runs only in the browser — the secret would be exposed to every visitor.\n\nAdd ${name} to a backend (Express / NestJS / Next.js) instead, e.g.:\n  quickship build my-api --template express-api`
  );
  process.exit(1);
}

export async function getPackageManager(cwd = process.cwd()) {
  return detectPackageManager(cwd);
}

/**
 * Directory where generated client/setup files should live, per project type
 */
export function libDir(projectType) {
  if (projectType === 'nextjs' || projectType === 'react-vite') {
    return 'lib';
  }
  // express, nestjs
  return join('src', 'config');
}

/**
 * Write a generated client/setup file into the project's lib directory,
 * unless a file with that name already exists (never overwrite user code)
 */
export async function writeClientFile(
  projectType,
  fileName,
  content,
  cwd = process.cwd()
) {
  const dir = join(cwd, libDir(projectType));
  await ensureDir(dir);

  const filePath = join(dir, fileName);
  if (await pathExists(filePath)) {
    return { written: false, path: filePath };
  }

  await writeFile(filePath, content, 'utf-8');
  return { written: true, path: filePath };
}

/**
 * Append env vars to .env.local (or .env for backend projects) if not already present
 */
export async function appendEnvVars(projectType, content, cwd = process.cwd()) {
  const envFile = projectType === 'nextjs' ? '.env.local' : '.env';
  const envPath = join(cwd, envFile);
  const envExists = await pathExists(envPath);

  if (envExists) {
    const existing = await readFile(envPath, 'utf-8');
    if (existing.includes(content.split('\n')[0])) {
      return false;
    }
    await appendFile(envPath, `\n${content}`);
  } else {
    await writeFile(envPath, content, 'utf-8');
  }
  return true;
}
