import { execa } from 'execa';
import logger from '../utils/logger.js';
import ora from 'ora';
import { resolve } from 'path';
import pkg from 'fs-extra';
const { pathExists } = pkg;

export class RailwayDeployment {
  constructor(projectPath, options = {}) {
    this.projectPath = projectPath;
    this.options = options;
    this.spinner = ora();
  }

  /**
   * Check if Railway CLI is installed
   */
  async isCliInstalled() {
    try {
      await execa('railway', ['--version'], {
        stdio: 'pipe',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Install Railway CLI
   */
  async installCli() {
    try {
      logger.info('Installing Railway CLI...');

      await execa('npm', ['install', '-g', '@railway/cli'], {
        stdio: 'inherit',
      });

      logger.success('Railway CLI installed successfully\n');
      return true;
    } catch (error) {
      logger.error('Failed to install Railway CLI');
      logger.info('Please install manually: npm install -g @railway/cli');
      return false;
    }
  }

  /**
   * Check if user is authenticated with Railway
   */
  async isAuthenticated() {
    try {
      await execa('railway', ['whoami'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate user with Railway
   */
  async authenticate() {
    try {
      logger.info('Please log in to Railway...');
      logger.dim('A browser window will open for authentication.\n');

      await execa('railway', ['login'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      logger.success('Successfully authenticated with Railway!\n');
      return true;
    } catch (error) {
      logger.error('Authentication failed');
      throw error;
    }
  }

  /**
   * Initialize Railway project
   */
  async init() {
    try {
      logger.info('Initializing Railway project...');

      await execa('railway', ['init'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      logger.success('Railway project initialized\n');
      return true;
    } catch (error) {
      logger.warning('Could not initialize Railway project');
      return false;
    }
  }

  /**
   * Deploy MERN Stack to Railway (both client and server)
   */
  async deployMERN(envVars = {}) {
    try {
      const clientPath = resolve(this.projectPath, 'client');
      const serverPath = resolve(this.projectPath, 'server');

      const clientExists = await pathExists(clientPath);
      const serverExists = await pathExists(serverPath);

      if (!clientExists || !serverExists) {
        throw new Error(
          'MERN project structure not found (missing client or server folder)'
        );
      }

      // Deploy backend first
      logger.header('📦 Deploying Backend (Express + MongoDB)');

      // Set environment variables for server
      if (Object.keys(envVars).length > 0) {
        logger.info('Setting server environment variables...');
        for (const [key, value] of Object.entries(envVars)) {
          try {
            await execa('railway', ['variables', '--set', `${key}=${value}`], {
              cwd: serverPath,
              stdio: 'pipe',
            });
          } catch (error) {
            logger.dim(`Could not set ${key}`);
          }
        }
        logger.success('Server environment variables configured\n');
      }

      // Deploy server
      logger.info('🚀 Deploying backend to Railway...\n');
      await execa('railway', ['up'], {
        cwd: serverPath,
        stdio: 'inherit',
      });

      logger.success('✅ Backend deployed successfully!\n');

      // Deploy frontend
      logger.header('🎨 Deploying Frontend (React + Vite)');
      logger.info('🚀 Deploying frontend to Railway...\n');

      await execa('railway', ['up'], {
        cwd: clientPath,
        stdio: 'inherit',
      });

      logger.success('✅ Frontend deployed successfully!\n');

      // Try to get deployment URLs
      logger.info('Fetching deployment URLs...\n');
      let backendUrl = 'Check Railway dashboard';
      let frontendUrl = 'Check Railway dashboard';

      try {
        const backendStatus = await execa('railway', ['status'], {
          cwd: serverPath,
          stdio: 'pipe',
        });
        const backendUrlMatch = backendStatus.stdout.match(
          /https:\/\/[^\s]+\.up\.railway\.app/
        );
        if (backendUrlMatch) {
          backendUrl = backendUrlMatch[0];
        }
      } catch (error) {
        // Ignore errors, use fallback message
      }

      try {
        const frontendStatus = await execa('railway', ['status'], {
          cwd: clientPath,
          stdio: 'pipe',
        });
        const frontendUrlMatch = frontendStatus.stdout.match(
          /https:\/\/[^\s]+\.up\.railway\.app/
        );
        if (frontendUrlMatch) {
          frontendUrl = frontendUrlMatch[0];
        }
      } catch (error) {
        // Ignore errors, use fallback message
      }

      return {
        success: true,
        message: `MERN Stack deployed to Railway

Backend:  ${backendUrl}
Frontend: ${frontendUrl}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Deploy regular project to Railway
   */
  async deploy(envVars = {}) {
    try {
      // Set environment variables if provided
      if (Object.keys(envVars).length > 0) {
        logger.info('Setting environment variables...');
        for (const [key, value] of Object.entries(envVars)) {
          try {
            await execa('railway', ['variables', '--set', `${key}=${value}`], {
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
      logger.info('🚀 Deploying to Railway...\n');

      await execa('railway', ['up'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });

      // Try to get deployment URL
      logger.log('');
      logger.info('Fetching deployment URL...\n');
      let deploymentUrl = 'Check Railway dashboard for deployment URL';

      try {
        const status = await execa('railway', ['status'], {
          cwd: this.projectPath,
          stdio: 'pipe',
        });
        const urlMatch = status.stdout.match(
          /https:\/\/[^\s]+\.up\.railway\.app/
        );
        if (urlMatch) {
          deploymentUrl = urlMatch[0];
        }
      } catch (error) {
        // Ignore errors, use fallback message
      }

      return {
        success: true,
        url: deploymentUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Link to existing Railway project
   */
  async link() {
    try {
      await execa('railway', ['link'], {
        cwd: this.projectPath,
        stdio: 'inherit',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get deployment status
   */
  async getStatus() {
    try {
      const result = await execa('railway', ['status'], {
        cwd: this.projectPath,
        stdio: 'pipe',
      });
      return result.stdout;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get platform-specific deployment tips
   */
  getDeploymentTips() {
    return [
      '💡 Railway provides $5 free credit per month',
      '💡 MongoDB can be added as a service in your Railway project',
      '💡 Environment variables can be managed in the Railway dashboard',
      '💡 Each service gets its own URL and can scale independently',
    ];
  }
}
