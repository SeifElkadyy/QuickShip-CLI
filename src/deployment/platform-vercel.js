import { execa } from 'execa';
import logger from '../utils/logger.js';
import ora from 'ora';

export class VercelDeployment {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = options;
    this.spinner = ora();
  }

  /**
   * Check if user is authenticated with Vercel
   */
  async isAuthenticated() {
    try {
      await execa('npx', ['vercel', 'whoami'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate user with Vercel
   */
  async authenticate() {
    try {
      logger.info('Please log in to Vercel...');
      logger.dim('A browser window will open for authentication.\n');

      await execa('npx', ['vercel', 'login'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      logger.success('Successfully authenticated with Vercel!\n');
      return true;
    } catch (error) {
      logger.error('Authentication failed');
      throw error;
    }
  }

  /**
   * Deploy to Vercel
   */
  async deploy(envVars = {}) {
    try {
      // Set environment variables if provided
      if (Object.keys(envVars).length > 0) {
        logger.info('Setting environment variables...');
        for (const [key, value] of Object.entries(envVars)) {
          try {
            await execa('npx', ['vercel', 'env', 'add', key, 'production'], {
              cwd: this.projectPath,
              input: value,
              stdio: ['pipe', 'pipe', 'pipe'],
            });
          } catch (error) {
            // Variable might already exist, that's okay
            logger.dim(
              `Environment variable ${key} already exists or could not be set`
            );
          }
        }
        logger.success('Environment variables configured\n');
      }

      // Deploy
      logger.info('🚀 Deploying to Vercel...\n');

      const deployArgs = ['vercel'];

      // Production deployment
      if (this.options.production !== false) {
        deployArgs.push('--prod');
      }

      // Skip confirmation prompts
      deployArgs.push('--yes');

      // Show deployment progress
      const result = await execa('npx', deployArgs, {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      // Get the deployment URL
      logger.log('');
      const urlResult = await execa('npx', ['vercel', 'ls', '--limit', '1'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });

      // Extract Production URL from output
      let deploymentUrl = null;
      const lines = urlResult.stdout.split('\n');
      for (const line of lines) {
        // Look for production URL in the output
        const urlMatch = line.match(/https:\/\/[^\s]+\.vercel\.app/);
        if (urlMatch) {
          deploymentUrl = urlMatch[0];
          break;
        }
      }

      return {
        success: true,
        url: deploymentUrl || 'Deployment successful - check Vercel dashboard',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get deployment URL from Vercel
   */
  async getDeploymentUrl() {
    try {
      const result = await execa('npx', ['vercel', 'ls', '--limit', '1'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });

      // Parse the output to get the URL
      const output = result.stdout;
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      return urlMatch ? urlMatch[0] : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set environment variable
   */
  async setEnvVar(key, value, environment = 'production') {
    try {
      await execa('npx', ['vercel', 'env', 'add', key, environment], {
        cwd: this.projectPath,
        input: value,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get platform-specific deployment tips
   */
  getDeploymentTips() {
    return [
      '💡 Vercel automatically detects your framework and configures build settings',
      '💡 Environment variables can be managed at https://vercel.com/dashboard',
      '💡 Each push to your main branch will trigger automatic deployments',
      '💡 Preview deployments are created for pull requests',
    ];
  }
}
