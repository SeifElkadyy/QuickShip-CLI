import { execa } from 'execa';
import logger from '../utils/logger.js';
import ora from 'ora';

export class NetlifyDeployment {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = options;
    this.spinner = ora();
  }

  /**
   * Check if user is authenticated with Netlify
   */
  async isAuthenticated() {
    try {
      await execa('npx', ['netlify', 'status'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate user with Netlify
   */
  async authenticate() {
    try {
      logger.info('Please log in to Netlify...');
      logger.dim('A browser window will open for authentication.\n');

      await execa('npx', ['netlify', 'login'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      logger.success('Successfully authenticated with Netlify!\n');
      return true;
    } catch (error) {
      logger.error('Authentication failed');
      throw error;
    }
  }

  /**
   * Deploy to Netlify
   */
  async deploy(envVars = {}) {
    try {
      // Set environment variables if provided
      if (Object.keys(envVars).length > 0) {
        logger.info('Setting environment variables...');
        for (const [key, value] of Object.entries(envVars)) {
          try {
            await execa('npx', ['netlify', 'env:set', key, value], {
              cwd: this.projectPath,
              stdio: 'pipe',
            });
          } catch (error) {
            logger.dim(`Could not set environment variable ${key}`);
          }
        }
        logger.success('Environment variables configured\n');
      }

      // Deploy
      logger.info('🚀 Deploying to Netlify...\n');

      const deployArgs = ['netlify', 'deploy'];

      // Production deployment
      if (this.options.production !== false) {
        deployArgs.push('--prod');
      }

      // Build before deploy
      deployArgs.push('--build');

      // Capture output to extract URL
      const result = await execa('npx', deployArgs, {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      // Get site info to extract URL
      logger.log('');
      const siteInfo = await execa('npx', ['netlify', 'status'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });

      // Extract URL from status output
      let deploymentUrl = null;
      const lines = siteInfo.stdout.split('\n');
      for (const line of lines) {
        if (line.includes('URL:') || line.includes('Site URL:')) {
          const urlMatch = line.match(/https:\/\/[^\s]+\.netlify\.app/);
          if (urlMatch) {
            deploymentUrl = urlMatch[0];
            break;
          }
        }
      }

      return {
        success: true,
        url: deploymentUrl || 'Deployment successful - check Netlify dashboard',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Initialize Netlify site if not already initialized
   */
  async init() {
    try {
      logger.info('Initializing Netlify site...');

      await execa('npx', ['netlify', 'init'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      logger.success('Netlify site initialized\n');
      return true;
    } catch (error) {
      logger.warning('Could not initialize Netlify site');
      return false;
    }
  }

  /**
   * Check if site is already linked
   */
  async isLinked() {
    try {
      const { pathExists } = await import('fs-extra');
      const { resolve } = await import('path');

      const netlifyConfigExists = await pathExists(
        resolve(this.projectPath, 'netlify.toml')
      );
      const netlifyDirExists = await pathExists(
        resolve(this.projectPath, '.netlify')
      );

      return netlifyConfigExists || netlifyDirExists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set environment variable
   */
  async setEnvVar(key, value) {
    try {
      await execa('npx', ['netlify', 'env:set', key, value], {
        cwd: this.projectPath,
        stdio: 'pipe',
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
      '💡 Netlify automatically detects build settings for popular frameworks',
      '💡 Environment variables can be managed at https://app.netlify.com',
      '💡 Deploy previews are created for all branches',
      '💡 Free tier includes 100GB bandwidth and 300 build minutes',
    ];
  }
}
