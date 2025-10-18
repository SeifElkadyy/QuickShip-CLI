import logger from '../utils/logger.js';
import { selectPlatform } from '../prompts/platform-selector.js';
import { websitePrompts } from '../prompts/website-prompts.js';
import Engine from '../core/engine.js';
import ErrorHandler from '../utils/error-handler.js';

export async function buildCommand(projectName, options) {
  try {
    // Show welcome banner
    logger.welcome();

    // Step 1: Select platform
    const platform = await selectPlatform();

    // Step 2: Platform-specific prompts
    let config;
    if (platform === 'website') {
      config = await websitePrompts(projectName);
    } else {
      logger.error('This platform is not yet supported');
      process.exit(1);
    }

    // Step 3: Build the project
    const engine = new Engine(config, options);
    await engine.build();
  } catch (error) {
    ErrorHandler.handle(error, options.verbose);
    process.exit(1);
  }
}
