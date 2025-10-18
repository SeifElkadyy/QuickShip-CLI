#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('quickship')
  .description('Universal project generator - ship projects in 60 seconds')
  .version(packageJson.version);

// Build command
program
  .command('build [project-name]')
  .description('Create a new project')
  .option('-t, --template <name>', 'template to use')
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

// Config command
program
  .command('config')
  .description('Configure CLI settings')
  .action(() => {
    console.log(chalk.blue('Config command coming soon...'));
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
