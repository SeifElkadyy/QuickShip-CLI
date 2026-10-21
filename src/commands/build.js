import logger from '../utils/logger.js';
import { selectPlatform } from '../prompts/platform-selector.js';
import { websitePrompts } from '../prompts/website-prompts.js';
import { mobilePrompts } from '../prompts/mobile-prompts.js';
import { backendPrompts } from '../prompts/backend-prompts.js';
import Engine from '../core/engine.js';
import ErrorHandler from '../utils/error-handler.js';
import ci from 'ci-info';
import { loadProjectConfig } from '../utils/config-loader.js';
import TemplateManager from '../core/template-manager.js';
import validator from '../utils/validator.js';
import { text, isCancel, cancel } from '@clack/prompts';

async function customTemplateName(options) {
  if (options.yes) return 'my-app';
  const name = await text({
    message: 'Project name',
    placeholder: 'my-app',
    defaultValue: 'my-app',
    validate(input) {
      const v = validator.validateProjectName(input);
      if (!v.valid) return v.errors.join(', ');
    },
  });
  if (isCancel(name)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return name;
}

export async function buildCommand(projectName, options) {
  try {
    // CI mode, --json, and --dry-run all imply non-interactive defaults
    if (ci.isCI || options.json || options.dryRun) {
      options.yes = true;
      options.git = options.git !== false;
    }

    // Load .quickshiprc / quickship.config.js if present — merged under CLI flags
    const fileConfig = await loadProjectConfig();
    if (fileConfig) {
      options = { ...fileConfig, ...options };
    }

    // Show welcome banner (skipped for machine-readable / dry-run output)
    if (options.json || options.dryRun) {
      // no banner
    } else if (options.ascii) {
      logger.showAsciiLogo();
    } else {
      logger.welcome();
    }

    // Step 1: Select platform (skip if -y flag and template provided)
    let platform = 'website'; // Default platform

    // Check if template is mobile-related
    if (
      options.template === 'expo-react-native' ||
      options.template === 'expo'
    ) {
      platform = 'mobile';
    }

    // Check if template is backend-related
    if (
      options.template === 'express-api' ||
      options.template === 'nestjs-api'
    ) {
      platform = 'backend';
    }

    // Fail fast on unknown --template instead of silently building Next.js
    const templateManager = new TemplateManager();
    if (options.template) {
      templateManager.determineTemplate({ stack: options.template });
    }
    const isCustom =
      !!options.template && templateManager.isCustomTemplate(options.template);

    if (!options.yes && !options.template) {
      platform = await selectPlatform();
    }

    // Step 2: Platform-specific prompts
    let config;
    if (isCustom) {
      // Custom templates bring their own stack — only name, PM, and git apply
      config = {
        projectName: projectName || (await customTemplateName(options)),
        stack: options.template,
        packageManager: options.packageManager || 'npm',
        git: options.git !== false,
      };
    } else if (platform === 'website') {
      config = await websitePrompts(projectName, options);
    } else if (platform === 'mobile') {
      config = await mobilePrompts(projectName, options);
    } else if (platform === 'backend') {
      config = await backendPrompts(projectName, options);
    } else {
      logger.error('This platform is not yet supported');
      process.exit(1);
    }

    // Override with CLI flags if provided
    if (options.packageManager) {
      const validPMs = ['npm', 'pnpm', 'yarn', 'bun'];
      if (!validPMs.includes(options.packageManager)) {
        logger.error(
          `Invalid package manager: ${options.packageManager}. Valid options: ${validPMs.join(', ')}`
        );
        process.exit(1);
      }
      config.packageManager = options.packageManager;
    }

    // --dry-run: validate and preview without writing anything
    if (options.dryRun) {
      const engine = new Engine(config, options);
      await engine.validatePath();

      if (options.json) {
        console.log(
          JSON.stringify({ dryRun: true, config, path: engine.projectPath })
        );
      } else {
        logger.info('\nDry run — no files were created.\n');
        logger.log(JSON.stringify(config, null, 2));
        logger.info(`\nWould create project at: ${engine.projectPath}\n`);
      }
      return;
    }

    // Step 3: Build the project
    const engine = new Engine(config, options);
    await engine.build();

    if (options.json) {
      console.log(
        JSON.stringify({
          success: true,
          config,
          path: engine.projectPath,
        })
      );
    }
  } catch (error) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
    ErrorHandler.handle(error, options.verbose);
    process.exit(1);
  }
}
