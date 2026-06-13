import { confirm, select, isCancel, cancel } from '@clack/prompts';
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

function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Deployment cancelled.');
    process.exit(0);
  }
  return value;
}

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

      const shouldContinue = handleCancel(
        await confirm({ message: 'Continue anyway?', initialValue: false })
      );

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

      platform = handleCancel(
        await select({
          message: 'Select deployment platform:',
          options: platforms.map((p) =>
            typeof p === 'string'
              ? { value: p, label: p }
              : { value: p.value ?? p.name, label: p.name ?? p.value }
          ),
        })
      );
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

        const shouldInstall = handleCancel(
          await confirm({ message: 'Install Railway CLI now?', initialValue: true })
        );

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

      const shouldLogin = handleCancel(
        await confirm({
          message: `Log in to ${platform} now?`,
          initialValue: true,
        })
      );

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

        const setupEnv = handleCancel(
          await confirm({
            message: 'Configure environment variables for deployment?',
            initialValue: true,
          })
        );

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

        const shouldInit = handleCancel(
          await confirm({ message: 'Initialize Netlify site now?', initialValue: true })
        );

        if (shouldInit) {
          await platformHandler.init();
        }
      }
    }

    if (platform === 'railway') {
      logger.dim('Checking Railway project status...\n');
    }

    if (platform === 'render') {
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

      const confirmDeploy = handleCancel(
        await confirm({
          message: `Ready to deploy to ${platform}?`,
          initialValue: true,
        })
      );

      if (!confirmDeploy) {
        logger.info('Deployment cancelled');
        process.exit(0);
      }
    }

    logger.log('\n');
    logger.divider();

    // Step 10: Run deployment
    let result;

    if (
      (projectType === 'mern-stack' && platform === 'railway') ||
      (projectType === 'mern-stack' && platform === 'render')
    ) {
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
      const statusUrls = {
        vercel: 'https://www.vercel-status.com',
        netlify: 'https://www.netlifystatus.com',
        railway: 'https://railway.statuspage.io',
        render: 'https://status.render.com',
      };
      if (statusUrls[platform]) logger.log(`   ${statusUrls[platform]}`);
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

async function _testBuild(projectPath, packageManager) {
  try {
    const buildCmd = packageManager === 'npm' ? 'npm' : packageManager;
    const buildArgs = packageManager === 'npm' ? ['run', 'build'] : ['build'];
    await execa(buildCmd, buildArgs, { cwd: projectPath, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}
