import inquirer from 'inquirer';
import logger from '../utils/logger.js';
import {
  detectProjectType,
  detectPackageManager,
  getRecommendedPlatforms,
  validateBuildSetup,
} from '../utils/project-detector.js';
import { VercelDeployment } from '../deployment/platform-vercel.js';
import { NetlifyDeployment } from '../deployment/platform-netlify.js';
import { RailwayDeployment } from '../deployment/platform-railway.js';
import { RenderDeployment } from '../deployment/platform-render.js';
import { EnvironmentVariableManager } from '../deployment/env-manager.js';
import { execa } from 'execa';
import ora from 'ora';

export async function deployCommand(options = {}) {
  try {
    logger.log('\n');
    logger.box('🚀 QuickShip Deploy', '⚡ Deploy');

    const projectPath = process.cwd();

    // Step 1: Detect project type
    logger.header('🔍 Analyzing Project');
    const projectType = await detectProjectType(projectPath);

    if (!projectType) {
      logger.error('Could not detect project type');
      logger.info(
        'Make sure you are in a QuickShip project directory with package.json'
      );
      process.exit(1);
    }

    const projectTypeNames = {
      nextjs: 'Next.js',
      't3-stack': 'T3 Stack',
      'react-vite': 'React + Vite',
      'mern-stack': 'MERN Stack',
    };

    logger.success(
      `Detected project type: ${projectTypeNames[projectType] || projectType}`
    );

    const packageManager = await detectPackageManager(projectPath);
    logger.dim(`Package manager: ${packageManager}\n`);

    // Step 2: Validate build setup
    logger.header('✅ Pre-Deployment Checks');

    const buildValidation = await validateBuildSetup(projectPath);
    if (!buildValidation.valid) {
      logger.error('Project has build setup issues:');
      buildValidation.errors.forEach((error) => {
        logger.log(`  ✗ ${error}`);
      });
      logger.log('');

      const { shouldContinue } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldContinue',
          message: 'Continue anyway?',
          default: false,
        },
      ]);

      if (!shouldContinue) {
        logger.info('Deployment cancelled');
        process.exit(0);
      }
    } else {
      logger.success('✓ Build setup validated');
      logger.success('✓ Dependencies installed\n');
    }

    // Step 3: Select deployment platform
    let platform = options.platform;

    if (!platform) {
      const platforms = getRecommendedPlatforms(projectType);

      const { selectedPlatform } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedPlatform',
          message: 'Select deployment platform:',
          choices: platforms,
        },
      ]);

      platform = selectedPlatform;
    }

    logger.log('');
    logger.highlight(`📦 Deploying to ${platform.toUpperCase()}\n`);

    // Step 4: Initialize platform handler
    let platformHandler;

    switch (platform) {
      case 'vercel':
        platformHandler = new VercelDeployment(projectPath, options);
        break;
      case 'netlify':
        platformHandler = new NetlifyDeployment(projectPath, options);
        break;
      case 'railway':
        platformHandler = new RailwayDeployment(projectPath, options);
        break;
      case 'render':
        platformHandler = new RenderDeployment(projectPath, options);
        break;
      default:
        logger.error(`Unsupported platform: ${platform}`);
        process.exit(1);
    }

    // Step 5: Check platform-specific requirements
    if (platform === 'railway') {
      const cliInstalled = await platformHandler.isCliInstalled();
      if (!cliInstalled) {
        logger.warning('Railway CLI is not installed');

        const { shouldInstall } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldInstall',
            message: 'Install Railway CLI now?',
            default: true,
          },
        ]);

        if (shouldInstall) {
          const installed = await platformHandler.installCli();
          if (!installed) {
            process.exit(1);
          }
        } else {
          logger.error('Railway CLI is required for deployment');
          process.exit(1);
        }
      }
    }

    // Step 6: Check authentication
    logger.header('🔐 Authentication');

    const isAuthenticated = await platformHandler.isAuthenticated();

    if (!isAuthenticated) {
      logger.info(`You need to log in to ${platform}`);

      const { shouldLogin } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldLogin',
          message: `Log in to ${platform} now?`,
          default: true,
        },
      ]);

      if (!shouldLogin) {
        logger.error('Authentication required for deployment');
        process.exit(1);
      }

      await platformHandler.authenticate();
    } else {
      logger.success(`Already authenticated with ${platform}\n`);
    }

    // Step 7: Handle environment variables
    const envManager = new EnvironmentVariableManager(projectPath);
    let envVars = {};

    if (!options.skipEnv) {
      const requiredVars = await envManager.detectRequiredVars();

      if (requiredVars.length > 0) {
        logger.log('');
        const { setupEnv } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'setupEnv',
            message: 'Configure environment variables for deployment?',
            default: true,
          },
        ]);

        if (setupEnv) {
          envVars = await envManager.interactiveSetup(projectType);
          envManager.showSummary(envVars);
        }
      }
    }

    // Step 8: Platform-specific setup
    if (platform === 'netlify') {
      const isLinked = await platformHandler.isLinked();
      if (!isLinked) {
        logger.info('Netlify site not linked yet');
        const { shouldInit } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldInit',
            message: 'Initialize Netlify site now?',
            default: true,
          },
        ]);

        if (shouldInit) {
          await platformHandler.init();
        }
      }
    }

    if (platform === 'railway') {
      // Railway might need project initialization
      logger.dim('Checking Railway project status...\n');
    }

    if (platform === 'render') {
      // Check if project has Git
      const hasGit = await platformHandler.hasGit();
      if (!hasGit) {
        logger.warning('Render requires a Git repository');
        logger.info('Initialize Git with: git init');
        logger.log('');
      }
    }

    // Step 9: Final confirmation
    if (!options.yes) {
      logger.log('');
      const { confirmDeploy } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmDeploy',
          message: `Ready to deploy to ${platform}?`,
          default: true,
        },
      ]);

      if (!confirmDeploy) {
        logger.info('Deployment cancelled');
        process.exit(0);
      }
    }

    logger.log('\n');
    logger.divider();

    // Step 10: Run deployment
    let result;

    if (projectType === 'mern-stack' && platform === 'railway') {
      result = await platformHandler.deployMERN(envVars);
    } else if (projectType === 'mern-stack' && platform === 'render') {
      result = await platformHandler.deployMERN(envVars);
    } else {
      result = await platformHandler.deploy(envVars);
    }

    logger.log('\n');
    logger.divider();

    // Step 11: Show results
    if (result.success) {
      logger.log('\n');
      logger.box(
        `
✅ Deployment Successful!

Your project has been deployed to ${platform}!

${result.url ? `🌐 URL: ${result.url}` : ''}

${result.message || ''}
      `.trim(),
        '🎉 Success'
      );

      // Show platform-specific tips
      const tips = platformHandler.getDeploymentTips();
      if (tips && tips.length > 0) {
        logger.log('\n');
        logger.header('💡 Tips & Next Steps');
        tips.forEach((tip) => {
          logger.log(`  ${tip}`);
        });
        logger.log('');
      }
    } else {
      logger.log('\n');
      logger.error('❌ Deployment Failed\n');
      logger.log(`Error: ${result.error}\n`);

      // Show troubleshooting tips
      logger.header('🔧 Troubleshooting');
      logger.log('');
      logger.log('1. Check that your build command works locally:');
      logger.log(
        `   ${packageManager === 'npm' ? 'npm run' : packageManager} build`
      );
      logger.log('');
      logger.log('2. Verify all environment variables are set correctly');
      logger.log('');
      logger.log('3. Check platform status:');
      if (platform === 'vercel') {
        logger.log('   https://www.vercel-status.com');
      } else if (platform === 'netlify') {
        logger.log('   https://www.netlifystatus.com');
      } else if (platform === 'railway') {
        logger.log('   https://railway.statuspage.io');
      } else if (platform === 'render') {
        logger.log('   https://status.render.com');
      }
      logger.log('');

      process.exit(1);
    }
  } catch (error) {
    logger.log('\n');
    logger.error('Deployment failed with error:');
    logger.log(error.message);

    if (options.verbose) {
      logger.log('\n');
      logger.dim('Stack trace:');
      console.error(error);
    }

    process.exit(1);
  }
}

/**
 * Test build locally before deployment
 */
async function testBuild(projectPath, packageManager) {
  const spinner = ora('Testing build...').start();

  try {
    const buildCmd = packageManager === 'npm' ? 'npm' : packageManager;
    const buildArgs = packageManager === 'npm' ? ['run', 'build'] : ['build'];

    await execa(buildCmd, buildArgs, {
      cwd: projectPath,
      stdio: 'pipe',
    });

    spinner.succeed('Build test passed');
    return true;
  } catch (error) {
    spinner.fail('Build test failed');
    logger.error('Your project does not build successfully');
    logger.log('');
    logger.log('Fix build errors before deploying:');
    logger.log(error.message);
    return false;
  }
}
