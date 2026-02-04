#!/usr/bin/env node

import { Command } from 'commander';
import logger from '../src/utils/logger.js';
import { checkForUpdates } from '../src/utils/update-checker.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Check for updates in background (non-blocking)
// Skip update check for 'update' command to avoid double-checking
const isUpdateCommand = process.argv.includes('update');
if (!isUpdateCommand) {
  checkForUpdates({ silent: false }).catch(() => {
    // Silently ignore errors - don't disrupt user experience
  });
}

program
  .name('quickship')
  .description('Universal project generator - ship projects in 60 seconds')
  .version(packageJson.version);

// Build command
program
  .command('build [project-name]')
  .description('Create a new project')
  .option('-t, --template <name>', 'template to use')
  .option(
    '-p, --package-manager <pm>',
    'package manager (npm, pnpm, yarn, bun)'
  )
  .option('-y, --yes', 'skip prompts and use defaults')
  .option('--no-git', 'skip git initialization')
  .option('--no-install', 'skip dependency installation')
  .option('-v, --verbose', 'show detailed logs')
  .action(async (projectName, options) => {
    const { buildCommand } = await import('../src/commands/build.js');
    await buildCommand(projectName, options);
  });

// List command
program
  .command('list')
  .description('List available templates')
  .action(async () => {
    const { listCommand } = await import('../src/commands/list.js');
    await listCommand();
  });

// Add command
program
  .command('add <feature>')
  .description('Add features to existing project (shadcn, auth, database)')
  .option('-p, --provider <name>', 'auth provider (clerk, supabase, nextauth)')
  .option('-v, --verbose', 'show detailed logs')
  .action(async (feature, options) => {
    const { addCommand } = await import('../src/commands/add.js');
    await addCommand(feature, options);
  });

// Doctor command
program
  .command('doctor')
  .description('Check project health and environment')
  .option('--fix', 'auto-fix common issues (coming soon)')
  .action(async (options) => {
    const { doctorCommand } = await import('../src/commands/doctor.js');
    await doctorCommand(options);
  });

// Info command
program
  .command('info')
  .description('Show project information')
  .action(async () => {
    const { infoCommand } = await import('../src/commands/info.js');
    await infoCommand();
  });

// Templates command
program
  .command('templates')
  .description('Show detailed template information')
  .option('--compare', 'compare all templates side-by-side')
  .action(async (options) => {
    const { templatesCommand } = await import('../src/commands/templates.js');
    await templatesCommand(options);
  });

// Update command
program
  .command('update')
  .description('Update QuickShip CLI to latest version')
  .action(async () => {
    const { updateCommand } = await import('../src/commands/update.js');
    await updateCommand();
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy your project to production')
  .option(
    '-p, --platform <name>',
    'deployment platform (vercel, netlify, railway, render)'
  )
  .option('-y, --yes', 'skip confirmation prompts')
  .option('--skip-env', 'skip environment variable setup')
  .option('--production', 'deploy to production (default: true)', true)
  .option('-v, --verbose', 'show detailed logs')
  .action(async (options) => {
    const { deployCommand } = await import('../src/commands/deploy.js');
    await deployCommand(options);
  });

// Config command
program
  .command('config')
  .description('Configure CLI settings')
  .action(() => {
    logger.info('Config command coming soon...');
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
